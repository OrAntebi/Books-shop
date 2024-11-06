'use strict'

const STORAGE_KEY = 'books'

const booksImages = {
    "the great gatsby": "https://covers.openlibrary.org/b/id/7223916-L.jpg",
    "to kill a mockingbird": "https://covers.openlibrary.org/b/id/8221253-L.jpg",
    "1984": "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    "pride and prejudice": "https://covers.openlibrary.org/b/id/10074623-L.jpg",
    "the catcher in the rye": "https://covers.openlibrary.org/b/id/8221072-L.jpg",
    "war and peace": "https://covers.openlibrary.org/b/id/7223352-L.jpg",
    "the odyssey": "https://covers.openlibrary.org/b/id/8745667-L.jpg",
    "the picture of dorian gray": "https://covers.openlibrary.org/b/id/8772104-L.jpg",
    "the hobbit": "https://covers.openlibrary.org/b/id/345442-L.jpg",
    "fahrenheit 451": "https://covers.openlibrary.org/b/id/256052-L.jpg",
    "brave new world": "https://covers.openlibrary.org/b/id/640311-L.jpg",
    "the adventures of huckleberry finn": "https://covers.openlibrary.org/b/id/8189476-L.jpg",
    "the call of the wild": "https://covers.openlibrary.org/b/id/8777275-L.jpg",
    "animal farm": "https://covers.openlibrary.org/b/id/12396474-L.jpg",
    "gone with the wind": "https://covers.openlibrary.org/b/id/8172919-L.jpg",
    "the alchemist": "https://covers.openlibrary.org/b/id/10822246-L.jpg",
    "the handmaid's tale": "https://covers.openlibrary.org/b/id/11003222-L.jpg",
    "a tale of two cities": "https://covers.openlibrary.org/b/id/11835276-L.jpg",
    "the road": "https://covers.openlibrary.org/b/id/7224093-L.jpg",
    "the invisible man": "https://covers.openlibrary.org/b/id/5744244-L.jpg",
    "life of pi": "https://covers.openlibrary.org/b/id/6882943-L.jpg",
    "the martian": "https://covers.openlibrary.org/b/id/10093050-L.jpg",
    "little women": "https://covers.openlibrary.org/b/id/8153328-L.jpg",
    "the secret garden": "https://covers.openlibrary.org/b/id/8240088-L.jpg",
    "the wind in the willows": "https://covers.openlibrary.org/b/id/6104330-L.jpg",
    "wuthering heights": "https://covers.openlibrary.org/b/id/8320912-L.jpg",
    "sense and sensibility": "https://covers.openlibrary.org/b/id/11722300-L.jpg",
    "unknown": "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
}

const unknownImg = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"

var gBooks = []
_createBooks()

function getBooks() {
    return gBooks
}

function filterBooks(inputValue) {
    return gBooks.filter(book => book.title.toLowerCase().includes(inputValue))
}

function addBook() {
    const title = prompt('Book title please:')
    if (!title) return alert('To add a book, you must write the book\'s name')

    const price = +prompt('Book price please:')
    if (!price) return alert('Price must be in numbers')

    const img = prompt('Book cover img (Optinal):')

    const newBook = _createBook(title, price, img)
    gBooks.unshift(newBook)
    _saveBooks()
}

function getBookBySKU(sku) {
    const book = gBooks.find(book => book.sku === sku)
    return book
}

function updateBook(sku) {
    const newPrice = +prompt('Enter a new price please:')

    const book = getBookBySKU(sku)
    book.price = `$${newPrice}`
    _saveBooks()
}

function removeBook(sku) {
    const idx = gBooks.findIndex(book => book.sku === sku)
    gBooks.splice(idx, 1)
    _saveBooks()
}

function _createBooks() {

    gBooks = loadFromStorage(STORAGE_KEY)
    if (gBooks && gBooks.length > 0) return

    const bookTitles = Object.keys(booksImages)

    gBooks = bookTitles.map(title => {
        return _createBook(title)
    })
    _saveBooks()
}

function _createBook(title, price, imgUrl) {

    if (!price) price = getRandomInt(10, 300)
    if (!imgUrl) booksImages[title.toLowerCase()] && !imgUrl.includes('http') ?
        imgUrl = _getBookImgByTitle(title) :
        imgUrl = unknownImg

    return {
        sku: makeSKU(),
        title: capitalizeFirstLetter(title),
        price: `$${price}`,
        imgUrl
    }
}

function _getBookImgByTitle(title) {
    const bookTitle = title.toLowerCase()

    if (!booksImages[bookTitle]) return unknownImg
    return booksImages[bookTitle]
}

function _saveBooks() {
    saveToStorage(STORAGE_KEY, gBooks)
}