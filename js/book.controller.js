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
            <td>$${book.price}</td>
            <td class="actions-container">
                <button class="details-btn" onclick="onShowBookDetails('${book.sku}')">Details</button>
                <button class="update-btn" onclick="onUpdateBook('${book.sku}')">Update</button>
                <button class="remove-btn" onclick="onRemoveBook('${book.sku}')">Remove</button>
            </td>
        </tr>`
    )
    showElement('table')
    hideElement('.cards-container')
    elBooks.innerHTML = strHtmls.join('')
}

function renderBooksCards(books) {
    const elBooks = document.querySelector('.cards-container')

    const strHtmls = books.map(book => `
            <div class="book-card">
                <img src="${book.imgUrl}" />
                <div class="details">
                <p><strong>Title:</strong> ${book.title}</p>
                <p><strong>Price:</strong> $${book.price}</p>
                </div>
                <div class="actions-container">
                    <button class="details-btn" onclick="onShowBookDetails('${book.sku}')">Details</button>
                    <button class="update-btn" onclick="onUpdateBook('${book.sku}')">Update</button>
                    <button class="remove-btn" onclick="onRemoveBook('${book.sku}')">Delete</button>
                </div>
            </div>`
    )
    showElement('.cards-container')
    hideElement('table')
    elBooks.innerHTML = strHtmls.join('')
}

function renderModal(action, book = null) {
    const elModal = document.querySelector('.modal');

    if (action === 'add') {
        elModal.innerHTML = `
            <section class="modal-content">
                <h2>Add new book</h2>
                <p>Enter book title</p>
                <input class="title-input" type="text" placeholder="Title">
            
                <p>Enter book price</p>
                <input class="price-input" type="number" min="1" placeholder="Price">
            
                <p>Enter book cover image (Optional)</p>
                <input class="img-input" type="text" placeholder="Url">
            </section>

            <div class="modal-btns-container">
                <button onclick="onSubmit('add')">Submit</button>
                <button onclick="onCloseModal()">Cancel</button>
            </div>
        `;
    } else if (action === 'details') {
        elModal.innerHTML = `
            <section class="modal-content">
                <img src="${book.imgUrl}" />
                <h2>${book.title}</h2>
                <p><strong>Price:</strong> $${book.price}</p>
                <p><strong>SKU: </strong>${book.sku}</p>
                <p><strong>Description: </strong>${book.description}</p>
            </section>

            <div class="modal-btns-container">
                <button onclick="onCloseModal()">Close</button>
            </div>
        `;
    } else if (action === 'update') {
        elModal.innerHTML = `
            <section class="modal-content">
                <h2>Update Book Price</h2>
                <p>Please enter the new price for the book</p>
                <input class="price-input" type="number" min="1" placeholder="Price">
            </section>

            <div class="modal-btns-container">
                <button onclick="onSubmit('update')">Submit</button>
                <button onclick="onCloseModal()">Cancel</button>
            </div>
        `;
    } else if (action === 'remove') {
        elModal.innerHTML = `
            <section class="modal-content">
                <h3>Are you sure you want to remove this book?</h3>
            </section>

            <div class="modal-btns-container">
                <button onclick="onSubmit('remove')">Yes</button>
                <button onclick="onCloseModal()">No</button>
            </div>
        `;
    }
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
        hideElement('.cards-container')
        showElement('.no-books-found')
    } else {
        showElement('.cards-container')
        hideElement('.no-books-found')
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
    renderModal('add')
    elModal.showModal()
}

function onChangeView(layout) {
    gLayout = layout
    saveToStorage(LAYOUT_KEY, gLayout)
    onFilterBooks()
}

function onShowBookDetails(sku) {

    const book = getBookBySKU(sku)
    renderModal('details', book)

    const elModal = document.querySelector('.modal')
    elModal.showModal()
}

function onUpdateBook(sku) {
    const elModal = document.querySelector('.modal')
    elModal.dataset.sku = sku
    renderModal('update')
    elModal.showModal()
}

function onRemoveBook(sku) {
    const elModal = document.querySelector('.modal')
    elModal.dataset.sku = sku
    renderModal('remove')
    elModal.showModal()
}

function onSubmit(action) {
    const elModal = document.querySelector('.modal')
    const sku = elModal.dataset.sku
    const elTitleValue = elModal.querySelector('.title-input')
    const elPriceValue = elModal.querySelector('.price-input')
    const elImgValue = elModal.querySelector('.img-input')

    if (action === 'update') {
        const price = parseFloat(elPriceValue.value)

        if (!price || price <= 0) return alert('Please enter a valid price.')
        updateBook(sku, price)
        renderBooks()
        elModal.close()
        showSuccessMessage('Success! The book has been updated')

    } else if (action === 'add') {
        const title = elTitleValue.value
        const price = parseFloat(elPriceValue.value)
        const img = elImgValue.value

        if (!title) return alert('Please enter a valid book title.')
        addBook(title, price, img)
        renderBooks()
        elModal.close()
        showSuccessMessage('Success! The book has been added')

    } else if (action === 'remove') {
        removeBook(sku)
        renderBooks()
        elModal.close()
        showSuccessMessage('Success! The book has been deleted')
    }
}

function onCloseModal() {
    const elModal = document.querySelector('.modal')
    elModal.close()
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