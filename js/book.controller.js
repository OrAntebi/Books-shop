'use strict'


function onInit() {
    renderBooks()
}

function renderBooks(books = getBooks()) {
    const elBooks = document.querySelector('tbody')

    const strHtmls = books.map(book => `
        <tr>
            <td>
                <img src="${book.imgUrl}" alt="Book Cover">
            </td>
            <td>${book.title}</td>
            <td>${book.price}</td>
            <td>
                <button class="details-btn" onclick="onShowBookDetails('${book.sku}')">Details</button>
                <button class="update-btn" onclick="onUpdateBook('${book.sku}')">Update</button>
                <button class="remove-btn" onclick="onRemoveBook('${book.sku}')">Remove</button>
            </td>
        </tr>`
    )
    elBooks.innerHTML = strHtmls.join('')
}

function onFilterBooks() {
    const elSearchInput = document.querySelector('.search-input')
    const inputValue = elSearchInput.value.toLowerCase()
    const filteredBooks = filterBooks(inputValue)
    renderBooks(filteredBooks)
}

function onClearSearch(ev) {
    ev.preventDefault()

    const elSearchInput = document.querySelector('.search-input')
    elSearchInput.value = ''
    renderBooks()
}

function onAddBook() {
    addBook()
    renderBooks()
    showSuccessMessage('Success! The book has been added')
}

function onShowBookDetails(sku) {

    const book = getBookBySKU(sku)
    renderBookDetails(book)

    const elModal = document.querySelector('.modal')
    elModal.showModal()
}

function renderBookDetails(book) {
    const elBookDetails = document.querySelector('.book-details')

    elBookDetails.innerHTML = `
    <h2>${book.title}</h2>
    <p><strong>Price: </strong>${book.price}</p>
    <p><strong>SKU: </strong>${book.sku}</p>
    `;
}

function onCloseBookDetails() {
    const elModal = document.querySelector('.modal')
    elModal.close()
}

function onUpdateBook(sku) {
    updateBook(sku)
    renderBooks()
    showSuccessMessage('Success! The book has been updated')
}

function onRemoveBook(sku) {
    removeBook(sku)
    showSuccessMessage('Success! The book has been deleted')
    renderBooks()
}

function showSuccessMessage(message) {
    
    const elBackdrop = document.querySelector('.backdrop')
    const elModal = document.querySelector('.success-message-modal')
    const elSuccessMessage = document.querySelector('.success-message')
    const elProgressBar = document.querySelector('.progress-bar')

    elBackdrop.style.display = 'block'
    elSuccessMessage.textContent = message
    elModal.style.display = 'block'

    var progress = 100

    const interval = setInterval(() => {
        progress -= 1
        elProgressBar.style.width = progress + '%'
    
        if (progress <= 0) {
            clearInterval(interval)
            elBackdrop.style.display = 'none'
            elModal.style.display = 'none'
        }
    }, 20)
    
}