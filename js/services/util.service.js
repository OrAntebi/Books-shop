'use strict'

function makeSKU(length = 10) {
    var sku = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        sku += possible.charAt(getRandomInt(0, possible.length))
    }

    return sku
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}


function capitalizeFirstLetter(str) {
    if (str.length === 0) return str
    return str.charAt(0).toUpperCase() + str.slice(1)
}
