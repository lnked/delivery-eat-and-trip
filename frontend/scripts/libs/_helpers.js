// 'use strict';

function declOfNum(n, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    n = Math.abs(n);
    return [n, titles[(n % 100 > 4 && n % 100 < 20) ? 2 : cases[(n % 10 < 5) ? n % 10 : 5]]].join(' ');
}

function currency(input) {
    const number = parseInt(input, 10);

    const formatMoney = function(n, b, t, d) {
        let c = isNaN(b = Math.abs(b)) ? 2 : b,
            s = n < 0 ? "-" : "",
            i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
            j = (j = i.length) > 3 ? j % 3 : 0;

        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };

    return formatMoney(number, 0, ' ', '');
}
