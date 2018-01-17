let app = app || {};

((body => {
    "use strict";

    const $body = $('body');
    const _s = ['name', 'email', 'phone', 'street', 'house', 'entrance', 'apartment', 'persons'];

    app.cart = {

        cart: {
            count: 0,
            amount: 0
        },

        products: [],

        update(count, amount) {
            $('.j-cart-count').html(count);
            $('.j-cart-amount').html(currency(amount));

            if ($('.j-update-passed').length)
            {
                $('.j-update-passed').removeClass('is-passed');

                if (amount >= 1000) {
                    $('.j-update-passed').addClass('is-passed');
                }
            }

            if ($('.j-update-disabled').length)
            {
                $('.j-update-disabled').prop('disabled', true);

                if (amount >= 1000) {
                    $('.j-update-disabled').prop('disabled', false);
                }
            }

            if (count == 0) {
                $('.j-cart-is-empty').addClass('is-active');
                $('.j-cart-no-empty').removeClass('is-active');
            } else {
                $('.j-cart-no-empty').addClass('is-active');
                $('.j-cart-is-empty').removeClass('is-active');
            }
        },

        calculate () {
            let count = 0;
            let amount = 0;
            const products = this.products;

            for (let i in products) {
                count += products[i].count;
                amount += products[i].count * products[i].price;
            }

            this.cart.count = count;
            this.cart.amount = amount;

            this.update(count, amount);
        },

        request (data) {
            data = decodeURIComponent(data);

            const _t = data.split('&');
            const _d = {};

            if (_t.length)
            {
                for (let i = _t.length - 1; i >= 0; i--)
                {
                    const item = _t[i].split('=');

                    if (item.length == 2 && _s.indexOf(item[0]) >= 0)
                    {
                        _d[item[0]] = item[1];
                    }

                    if (i === 0)
                    {
                        store.set('_customer', _d);
                    }
                }
            }
        },

        quantity () {
            const _this_ = this;

            app.quantity.make({
                afterClick: function($element) {
                    $element.closest('.j-product').addClass('is-disabled');
                },
                complete: function($element, id, count) {
                    const $product = $element.closest('.j-product');
                    const $amount = $product.find('.j-product-amount');

                    const price = $amount.data('price');

                    $amount.html(currency(price * count));

                    $.ajax({
                        url: [ '/api', 'update', id, count ].join('/'),
                        type: 'POST',
                        data: { 'id' : id, count },
                        dataType: 'JSON',
                        contentType: false,
                        processData: false,
                        success: function(response) {
                            _this_.update(response.count, response.amount);
                            $element.closest('.j-product').removeClass('is-disabled');
                        }
                    });
                }
            });
        },

        getter (callback) {
            const _this_ = this;

            $.ajax({
                url: [ '/api', 'get' ].join('/'),
                type: 'POST',
                dataType: 'JSON',
                contentType: false,
                processData: false,
                success: function(response) {
                    _this_.products = response;
                    _this_.calculate();

                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            });
        },

        toggleAdded ($button) {
            $button.closest('.j-product-button').toggleClass('is-added');
        },

        desire () {
            const desireData = {
                'id' : -1,
                'name' : 'Желание гостя',
                'price' : 1,
                'total_price' : 1,
                'photo' : '/images/desire.jpg'
            };

            if (!$('#cart-items').find('.j-product[data-product="-1"]').length) {
                $.popup.notification('Товар добавлен в корзину');
                $('#cart-items').append($(template('tmpl-cart-item', { 'product': desireData })));
            }
        },

        bind () {
            const _this_ = this;

            _this_.quantity();

            $body.on('click', '.j-return-menu', function(e) {
                e.preventDefault();

                const inMenu = location.href.split('/').indexOf('menu') >= 0;

                if (!inMenu) {
                    location.href = '/menu';
                }
            });

            $body.on('click', '.j-cart-add', function(e) {
                e.preventDefault();

                const $button = $(this);
                const $parent = $button.closest('.j-cart-button');
                const product = $button.data('product');
                $button.addClass('is-busy');

                $.ajax({
                    url: [ '/api', 'add', product ].join('/'),
                    type: 'POST',
                    data: { 'id' : product },
                    dataType: 'JSON',
                    contentType: false,
                    processData: false,
                    success: function(response) {
                        if (response.hasOwnProperty('desire')) {
                            $('.j-quantity[data-product="-1"]').find('.j-quantity-count').val(response.desire);
                        }

                        _this_.update(response.count, response.amount);
                        _this_.toggleAdded($button);

                        $parent.html($(template('tmpl-quantity', { 'id': product, 'count': 1 })));

                        if (product < 0) {
                            _this_.desire();
                        }
                        else {
                            $.popup.notification('Товар добавлен в корзину');
                        }

                        setTimeout(() => {
                            _this_.quantity();
                            $button.removeClass('is-busy');
                        }, 150);
                    }
                });

                return false;
            });

            $body.on('click', '.j-cart-clean', function(e) {
                e.preventDefault();

                $.ajax({
                    url: [ '/api', 'clean' ].join('/'),
                    type: 'get',
                    dataType: 'JSON',
                    contentType: false,
                    processData: false,
                    success: function(response) {
                        $('.j-product').remove();
                        _this_.update(response.count, response.amount);
                    }
                });

                return false;
            });

            $body.on('click', '.j-cart-remove', function(e) {
                e.preventDefault();

                const $button = $(this);
                const product = $button.data('product');
                $button.addClass('is-busy');

                $.ajax({
                    url: [ '/api', 'remove', product ].join('/'),
                    type: 'POST',
                    data: { 'id' : product },
                    dataType: 'JSON',
                    contentType: false,
                    processData: false,
                    success: function(response) {
                        $('.j-product[data-product="' + product + '"]').remove();
                        _this_.update(response.count, response.amount);
                        _this_.toggleAdded($button);
                        $button.removeClass('is-busy');
                        $.popup.notification('Товар удален из корзины');
                    }
                });

                return false;
            });

            $body.on('cart.success', function(e, data) {
                _this_.request(data);
            });
        },

        events() {
            const _this = this;
        },

        init() {
            this.bind();
            this.events();
            // this.getter();
        }
    };

}))(document.body);
