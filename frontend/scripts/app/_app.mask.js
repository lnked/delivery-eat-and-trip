const app = app || {};

(body => {
    app.mask = {
        phone(phones) {
            if (phones.length) {
                for (let i = phones.length - 1; i >= 0; i--) {
                    const phone = phones[i];

                    new Cleave(phone, {
                        phone: true,
                        phoneRegionCode: "ru"
                    });
                }
            }
        },

        init() {
            const _this_ = this;

            _this_.phone($(".mask-phone"));

            $("body").on("popup.after_open", (e, popup) => {
                setTimeout(() => {
                    _this_.phone($(popup).find(".mask-phone"));
                }, 50);
            });
        }
    };
})(document.body);
