'use strict'

var gLayout = 'table'
const LAYOUT_KEY = 'layout_db'

function onInit() {
    renderBooks()
}

function renderBooks(books = getBooks()) {
    if (gLayout === 'table') renderBooksTable(books)
    else renderBooksCards(books)
    renderBooksStatistics()
}

function renderBooksTable(books) {
    const elBooks = document.querySelector('tbody')

    const strHtmls = books.map(book => `
        <tr>
            <td>
                <img src="${book.imgUrl}" alt="Book Cover">
            </td>
            <td>${book.title}</td>
            <td>${book.price}</td>
            <td class="actions-container">
                <button class="details-btn" onclick="onShowBookDetails('${book.sku}')">Details</button>
                <button class="update-btn" onclick="onUpdateBook('${book.sku}')">Update</button>
                <button class="remove-btn" onclick="onRemoveBook('${book.sku}')">Remove</button>
            </td>
        </tr>`
    )
    showElements('table')
    hideElements('.cards-container')
    elBooks.innerHTML = strHtmls.join('')
}

function renderBooksCards(books) {
    const elBooks = document.querySelector('.cards-container')

    const strHtmls = books.map(book => `
            <div class="book-card">
                <img src="${book.imgUrl}" />
                <div class="details">
                <p><strong>Title:</strong> ${book.title}</p>
                <p><strong>Price:</strong> ${book.price}</p>
                </div>
                <div class="actions-container">
                    <button class="details-btn" onclick="onShowBookDetails('${book.sku}')">Details</button>
                    <button class="update-btn" onclick="onUpdateBook('${book.sku}')">Update</button>
                    <button class="remove-btn" onclick="onRemoveBook('${book.sku}')">Delete</button>
                </div>
            </div>`
    )
    showElements('.cards-container')
    hideElements('table')
    elBooks.innerHTML = strHtmls.join('')
}

function renderBookDetailsModal(book) {
    const elModal = document.querySelector('.modal-wrapper.details-btn');

    elModal.innerHTML = `
        <section class="modal-content">
            <img src="${book.imgUrl}" />
            <h2>${book.title}</h2>
            <p><strong>Price:</strong> ${book.price}</p>
            <p><strong>SKU: </strong>${book.sku}</p>
            <p><strong>Description: </strong>${book.description}</p>
        </section>

        <div class="modal-btns-container">
            <button onclick="onCloseModal()">Close</button>
        </div>
    `;
}

function renderBooksStatistics() {
    const elCheapBooks = document.querySelector('.cheap-books-statistic span')
    const elAverageBooks = document.querySelector('.average-books-statistic span')
    const elExpansiveBooks = document.querySelector('.expensive-books-statistic span')

    elCheapBooks.innerText = calcBooksStatistics(book => book.price < 80)
    elAverageBooks.innerText = calcBooksStatistics(book => book.price >= 80 && book.price < 200)
    elExpansiveBooks.innerText = calcBooksStatistics(book => book.price >= 200)
}

function onFilterBooks() {

    const elSearchInput = document.querySelector('.search-input')
    const inputValue = elSearchInput.value.toLowerCase()
    const filteredBooks = filterBooks(inputValue)
    renderBooks(filteredBooks)

    if (filteredBooks.length <= 0) {
        hideElements('.cards-container')
        showElements('.no-books-found')
    } else {
        showElements('.cards-container')
        hideElements('.no-books-found')
    }
}

function onClearSearch() {
    const elNoBooksFound = document.querySelector('.no-books-found')
    const elSearchInput = document.querySelector('.search-input')
    elNoBooksFound.classList.add('hidden')
    elSearchInput.value = ''
    renderBooks()
}

function onAddBook() {
    const elModal = document.querySelector('.modal')
    showElements('.modal-wrapper.add-btn')
    elModal.showModal()
}

function onChangeView(layout) {
    gLayout = layout
    saveToStorage(LAYOUT_KEY, gLayout)
    onFilterBooks()
}

function onShowBookDetails(sku) {

    const book = getBookBySKU(sku)
    renderBookDetailsModal(book)

    const elModal = document.querySelector('.modal')
    elModal.showModal()
    showElements('.modal-wrapper.details-btn')
}

function onUpdateBook(sku) {
    const elModal = document.querySelector('.modal')
    elModal.dataset.sku = sku
    showElements('.modal-wrapper.update-btn')
    elModal.showModal()
}

function onRemoveBook(sku) {
    const elModal = document.querySelector('.modal')
    elModal.dataset.sku = sku
    showElements('.modal-wrapper.remove-btn')
    elModal.showModal()
}

function onSubmit(action) {
    const elModal = document.querySelector('.modal')
    const titleFieldValue = elModal.querySelector('.modal-wrapper.add-btn .title-input').value
    const updatedPriceFieldValue = parseFloat(elModal.querySelector('.modal-wrapper.update-btn .price-input').value)
    const newPriceFieldValue = parseFloat(elModal.querySelector('.modal-wrapper.add-btn .price-input').value)
    const imgFieldValue = elModal.querySelector('.modal-wrapper.add-btn .img-input').value
    const sku = elModal.dataset.sku

    const msg = action === 'update' ? 'Success! The book has been updated' :
                action === 'add' ? 'Success! The book has been added' :
                action === 'remove' ? 'Success! The book has been deleted' :
                '';

    if (action === 'update') {
        if (!updatedPriceFieldValue || updatedPriceFieldValue <= 0) return alert('Please enter a valid price.')
        updateBook(sku, updatedPriceFieldValue)

    } else if (action === 'add') {
        if (!titleFieldValue) return alert('Please enter a valid book title.')
        addBook(titleFieldValue, newPriceFieldValue, imgFieldValue)

    } else if (action === 'remove') {
        removeBook(sku)
    }
    
    renderBooks()
    hideElements('.modal-wrapper')
    elModal.close()
    showSuccessMessage(msg)
    clearInputFields()
}

function onCloseModal() {
    const elModal = document.querySelector('.modal')
    elModal.close()
    hideElements('.modal-wrapper')
    clearInputFields()
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
    }, 10)

}

function clearInputFields() {
    const elModal = document.querySelector('.modal');
    const inputFields = elModal.querySelectorAll('input')

    inputFields.forEach(input => {
        if (input.value) input.value = ''
    })
}
