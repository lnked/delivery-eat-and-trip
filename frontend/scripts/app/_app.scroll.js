let app = app || {};

((body => {
    "use strict";

    const $body = $('body');

    app.scroll = {

        disableHover () {
            let timer;

            $(window).on('scroll', () => {
                clearTimeout(timer);

                if (!$body.hasClass('disable-hover')) {
                    $body.addClass('disable-hover');
                }

                timer = setTimeout(() => {
                    $body.removeClass('disable-hover');
                }, 500);
            });
        },

        bind() {
            $('html').scrollWithEase();
        },

        init() {
            this.bind();
            this.disableHover();
        }
    };

}))(document.body);
