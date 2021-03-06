const app = app || {};

((body => {
    'use strict';

    app.quantity = {

        config: {
            element: '.j-quantity',
            input: '.j-quantity-count',
            control: '.j-quantity-control',
            complete: null,
            afterClick: null
        },

        element: null,

        getValue: function() {
            return parseInt(this.element.find(this.config.input).val(), 10);
        },

        setValue: function(quantity) {
            let min = 1;
            let max = 100;

            if (this.element.data('min')) {
                min = this.element.data('min');
            }

            if (this.element.data('max')) {
                max = this.element.data('max');
            }

            if (quantity > max) {
                quantity = max;
            }

            if (quantity < min) {
                quantity = min;
            }

            this.element.find(this.config.input).val(quantity);
        },

        increase: function(quantity) {
            quantity += 1;

            this.setValue(quantity);
        },

        decrease: function(quantity) {
            if (quantity > 1) {
                quantity -= 1;
            }

            this.setValue(quantity);
        },

        afterClick: function($control) {
            if (typeof (this.config.afterClick) == 'function')
            {
                this.config.afterClick.call(null, $control);
            }
        },

        callback: function() {
            if (typeof (this.element.data('product')) !== 'undefined' && typeof (this.config.complete) == 'function')
            {
                this.config.complete.call(null, this.element, this.element.data('product'), this.getValue());
            }
        },

        keys: function() {
            const _this_ = this;
            let role = '';

            $('body').on('keydown', _this_.config.input, function(e) {
                if ([0, 8, 13, 38, 40].indexOf( e.which ) < 0 && (e.which < 48 || e.which > 57)) {
                    return !1;
                }
            });

            $('body').on('keydown', _this_.config.input, function(e) {
                if ([38, 40].includes(e.keyCode))
                {
                    e.preventDefault();

                    role = {
                        38: 'increase',
                        40: 'decrease'
                    };

                    _this_.element = $(this).closest(_this_.config.element);

                    _this_[role[e.keyCode]](parseInt(_this_.element.find(_this_.config.input).val()));

                    _this_.callback();

                    return false;
                }
            });
        },

        bind: function() {
            let role = '';
            const _this_ = this;

            function process($element)
            {
                _this_.afterClick($element.closest('.j-quantity'));

                _this_.element = $element.closest(_this_.config.element);

                role = $element.data('role');

                if(['increase', 'decrease'].includes(role))
                {
                    _this_[role](parseInt(_this_.element.find(_this_.config.input).val(), 10));
                }

                _this_.callback();
            }

            $('body').off('input.quantity').on('input.quantity', _this_.config.input, function(e) {
                const val = parseInt($(this).val(), 10);

                if (val < 1) {
                    $(this).val(1);
                }

                process($(this));
            });

            $('body').off('click.quantity').on('click.quantity', _this_.config.control, function(e) {
                e.preventDefault();
                process($(this));
                return !1;
            });
        },

        make: function(config) {
            const _this_ = this;

            if (typeof config !== 'undefined')
            {
                _this_.config = app._extend(_this_.config, config);
            }

            _this_.bind();
            _this_.keys();
        }

    };
}))(document.body);
