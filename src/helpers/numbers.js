const nairaSymbol = "\u{020A6}"
const dollarSymbol = "\u{00024}"
const poundSymbol = "\u{000A3}"
const eurSymbol = "\u{020AC}"
const crypto = require('crypto');

function formatNaira() {
    const nairaSymbol = "\u{020A6}";
    let sum = 0;
    for (let i = 0; i < arguments.length; i++) {
      sum += arguments[i];
    }
    return nairaSymbol + new Intl.NumberFormat("en-US").format(sum);
  }

  function toCurrency(sum, curr) {
    const nairaSymbol = "\u{020A6}"
const dollarSymbol = "\u{00024}"
const poundSymbol = "\u{000A3}"
const eurSymbol = "\u{020AC}"


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
    crypto.each(curr, function (e){
return (e)
    })
  }

module.exports = {formatNaira, toCurrency, toCurr};
