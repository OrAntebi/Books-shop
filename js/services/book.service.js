'use strict'

var gBooks = []
_createBooks()

function getBooks() {
    return gBooks
}




function _createBooks() {

    gBooks = [
        _createBook('The Adventures of Lori Ipsi', 120),
        _createBook('World Atlas', 120),
        _createBook('Zorba the Greek', 87),
    ]
}

function _createBook(bookName, price) {

    return {
        SKU: makeSKU(),
        title: bookName,
        price
    }
}