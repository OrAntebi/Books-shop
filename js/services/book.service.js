'use strict'

var gBooks = []
_createBooks()

function getBooks() {
    return gBooks
}

function addBook() {   
    const title = prompt('Book title please:')
    const price = prompt('Book price please:')
    
    const newBook = _createBook(title, price)
    gBooks.unshift(newBook)
}

function getBookBySKU(sku) {
    const book = gBooks.find(book => book.sku === sku)
    return book
}

function updateBook(sku) {   
    const newPrice = +prompt('Enter a new price please:')

    const book = gBooks.find(book => book.sku === sku)
    book.price = newPrice
}

function removeBook(sku) {
    const idx = gBooks.findIndex(book => book.sku === sku)
    gBooks.splice(idx, 1)
}

function _createBooks() {

    gBooks = [
        _createBook('The Adventures of Lori Ipsi', 120),
        _createBook('World Atlas', 300),
        _createBook('Zorba the Greek', 87),
    ]
}

function _createBook(title, price) {

    return {
        sku: makeSKU(),
        title,
        price: `$${price}`,
        imgUrl: ''
    }
}