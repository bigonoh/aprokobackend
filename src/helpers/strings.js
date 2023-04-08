const crypto = require("crypto");
const {encKey, encIv} = require("../base");
const nairaSymbol = "\u{020A6}"
const dollarSymbol = "\u{00024}"
const poundSymbol = "\u{000A3}"
const eurSymbol = "\u{020AC}"

function toCurrency(amount, curr) {
    let sum = 0;
    for (let i = 0; i < arguments.length; i++) {
      sum += arguments[i];
    }
    if (curr === 'ngn'){
      return nairaSymbol + new Intl.NumberFormat("en-US").format(sum);
    }

    if (curr === 'eur'){
      return eurSymbol + new Intl.NumberFormat("en-US").format(sum);
    }

    if (curr === 'usd'){
      return dollarSymbol + new Intl.NumberFormat("en-US").format(sum);
    }

    if (curr === 'gbp'){
      return poundSymbol + new Intl.NumberFormat("en-US").format(sum);
    }
  }

  function toCurr (curr) {
return (curr)
  }


function fcUppercase(string) {

    //first convert to lowercase
    string.toLowerCase();

    //prepare
    return (string.charAt(0).toUpperCase() + string.slice(1))
}

function toMoney(value, decimals) {

    return (value.toMoney(decimals));
}
Number.prototype.toMoney = function(decimals, decimal_sep, thousands_sep) {
    let n = this,
        c = isNaN(decimals) ? 2 : Math.abs(decimals),
        d = decimal_sep || '.',
        t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        sign = (n < 0) ? '-' : '',
        i = parseInt(n = Math.abs(n).toFixed(c)) + '',
        p = i.length,
        j = ((p) > 3) ? p % 3 : 0;
    return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};

function transfersTableName(previousMonth=0) {
    let month = new Date().getMonth() + 1;
    if (month > 12) {
        month = month - 12;
    }
    month -= (previousMonth===1)?1:0; //get previous month table name
    const year = new Date().getFullYear();
    return ('transfers_' + year + '_' + month);
}

function transfersTableNamePreviousMonth() {
    let month = new Date().getMonth();
    if (month > 12) {
        month = month - 12;
    }
    const year = new Date().getFullYear();
    return ('transfers_' + year + '_' + month);
}

function collectionsTableName() {
    let month = new Date().getMonth() + 1;
    if (month > 12) {
        month = month - 12;
    }
    const year = new Date().getFullYear();
    return ('collections_' + year + '_' + month);
}

function collectionsTableNameFromYearAndMonth(year, month) {
    return ('collections_' + year + '_' + month);
}

function transfersTableNameFromYearAndMonth(year, month) {
    return ('transfers_' + year + '_' + month);
}
function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encKey), encIv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: encIv.toString('hex'), encryptedData: encrypted.toString('hex') };
}
function maskCardNumber(number){
    return number.replace(/.(?=.{4})/g, '*');
}
module.exports = {
    fcUppercase,
    toMoney,
    transfersTableName,
    collectionsTableName,
    collectionsTableNameFromYearAndMonth,
    transfersTableNamePreviousMonth,
    transfersTableNameFromYearAndMonth,
    encrypt,
    maskCardNumber,
    toCurrency,
    toCurr
}
