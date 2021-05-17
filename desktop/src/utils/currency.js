import accounting from 'accounting'

const max = 999999999
const symbol = "đ"
accounting.settings = {
    currency: {
        symbol: symbol,   // default currency symbol is '$'
        format: "%v%s", // controls output: %s = symbol, %v = value/number (can be object: see below)
        decimal: ".",  // decimal point separator
        thousand: ",",  // thousands separator
        precision: 0,   // decimal places
    },
    number: {
        precision: 0,  // default precision on numbers is 0
        thousand: ",",
        decimal: "."
    }
}

export const formatMoney = (money) => {
    return accounting.formatMoney(money);
}

export const formatNumber = (money) => {
    return accounting.formatNumber(money);
}

export const unFormat = (money) => {
    return accounting.unformat(money);
}

export const getMaxMoney = () => {
    return max;
}

export const getCurrencySymbol = () => {
    return symbol;
}