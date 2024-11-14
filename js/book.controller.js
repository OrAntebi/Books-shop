'use strict'

var gLayout = 'table'
const LAYOUT_KEY = 'layout_db'

const gQueryOptions = {
    filterBy: { txt: '' },
    sortBy: {},
    page: { currPageNumber: 0, size: 5 },
}

function onInit() {
    readQueryParams()
    renderBooks()
}

// RENDERS
function renderBooks() {
    
    const books = getBooks(gQueryOptions)
    if (gLayout === 'table') renderBooksTable(books)
    else renderBooksCards(books)
    renderBooksStatistics()
    renderPageNumber()
}

function renderBooksTable(books) {
    const elBooks = document.querySelector('tbody')

    const strHtmls = books.map(book => `
        <tr>
            <td>
                <img class="book-img" src="${book.imgUrl}" alt="Book Cover">
            </td>
            <td>${book.title}</td>
            <td>${formatPrice(book.price)}</td>
            <td>${convertRatingToStars(book.rating)}</td>
            <td class="actions-container">
                <button class="details-btn" onclick="onShowBookDetails('${book.sku}')">Details</button>
                <button class="update-btn" onclick="onUpdateBook('${book.sku}')">Update</button>
                <button class="remove-btn" onclick="onRemoveBook('${book.sku}')">Remove</button>
            </td>
        </tr>`
    )
    showElements('table')
    hideElements('div.cards-container')
    elBooks.innerHTML = strHtmls.join('')

    if (books.length === 0) return showElements('.no-books-found')
    else hideElements('.no-books-found')
}

function renderBooksCards(books) {
    const elBooks = document.querySelector('.cards-container')

    const strHtmls = books.map(book => `
            <div class="book-card">
                <img class="book-img" src="${book.imgUrl}" />
                <div class="details">
                <p><strong>Title:</strong> ${book.title}</p>
                <p><strong>Price:</strong> ${formatPrice(book.price)}</p>
                <p>${convertRatingToStars(book.rating)}</p> 
                </div>
                <div class="actions-container">
                    <button class="details-btn" onclick="onShowBookDetails('${book.sku}')">Details</button>
                    <button class="update-btn" onclick="onUpdateBook('${book.sku}')">Update</button>
                    <button class="remove-btn" onclick="onRemoveBook('${book.sku}')">Delete</button>
                </div>
            </div>`
    )
    showElements('div.cards-container')
    hideElements('table')
    elBooks.innerHTML = strHtmls.join('')

    if (books.length === 0) return showElements('.no-books-found')
        else hideElements('.no-books-found')
}

function renderBookDetailsModal(book) {
    const elModal = document.querySelector('.modal-wrapper.details-btn');

    elModal.innerHTML = `
        <section class="modal-content">
            <img class="book-img" src="${book.imgUrl}" />
            <h2>${book.title}</h2>
            <p><strong>Price:</strong> ${formatPrice(book.price)}</p>
            <p><strong>SKU: </strong>${book.sku}</p>
            <p><strong>Description: </strong>${book.description}</p>
            <div class="rating-container">
                <img class="rating-img minus-btn" src="img/minus-button.png" alt="minus-rating-icon" onclick="onChangeRating(-1)">
                <div class="stars-container">${convertRatingToStars(book.rating)}</div>
                <img class="rating-img plus-btn" src="img/plus-button.png" alt="plus-rating-icon" onclick="onChangeRating(1)">
            </div>
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

    elCheapBooks.innerText = calcBooksStatistics(book => book.price < 80, gQueryOptions)
    elAverageBooks.innerText = calcBooksStatistics(book => book.price >= 80 && book.price < 200, gQueryOptions)
    elExpansiveBooks.innerText = calcBooksStatistics(book => book.price >= 200, gQueryOptions)
}

function renderPageNumber() {
    const elPageNumber = document.querySelector('.page-number-container')
    const pageCount = getPageCount(gQueryOptions)
    const currPageNumber = gQueryOptions.page.currPageNumber


    elPageNumber.innerHTML = `
        <div class="page-number currect-page">${currPageNumber} of ${pageCount}</div>
    `
}

// ADD BOOK
function onAddBook() {
    const elModal = document.querySelector('.modal')
    showElements('.modal-wrapper.add-btn')
    elModal.showModal()
}

// READ
function onShowBookDetails(sku) {
    const book = getBookBySKU(sku)
    renderBookDetailsModal(book)

    const elModal = document.querySelector('.modal')
    elModal.dataset.sku = sku
    elModal.showModal()
    showElements('.modal-wrapper.details-btn')
}

// UPDATE BOOK
function onUpdateBook(sku) {
    const elModal = document.querySelector('.modal')
    elModal.dataset.sku = sku
    showElements('.modal-wrapper.update-btn')
    elModal.showModal()
}

function onChangeRating(value) {
    const elModal = document.querySelector('.modal')
    const sku = elModal.dataset.sku
    changeRating(sku, value)
    renderBooks()
    const updatedBook = getBookBySKU(sku);
    renderBookDetailsModal(updatedBook);
}

// REMOVE BOOK
function onRemoveBook(sku) {
    const elModal = document.querySelector('.modal')
    elModal.dataset.sku = sku
    showElements('.modal-wrapper.remove-btn')
    elModal.showModal()
}

// Sort & Filter
function onSetFilterBooks(filterBy) {
    
    if ('txt' in filterBy) {
        gQueryOptions.filterBy.txt = filterBy.txt
    }
    setQueryParams()
    renderBooks()
}

function onSetSortBy() {

    const elSortField = document.querySelector('.sort-by select')
    const elSortDir = document.querySelector('.radio-btns input')
    const sortField = elSortField.value
    const sortDir = elSortDir.checked ? -1 : 1
    gQueryOptions.sortBy = { [sortField]: sortDir }
    setQueryParams()
    renderBooks()
}

// Query Params
function readQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)

    gQueryOptions.filterBy = {
        txt: queryParams.get('txt') || '',
    }

    if (queryParams.get('sortField')) {
        const sortField = queryParams.get('sortField')
        const sortDir = +queryParams.get('sortDir')
        gQueryOptions.sortBy[sortField] = sortDir
    }

    if (queryParams.get('currPageNumber')) {
        gQueryOptions.page.currPageNumber = +queryParams.get('currPageNumber')
        gQueryOptions.page.size = +queryParams.get('pageSize')
    }
    // console.log('gQueryOptions:', gQueryOptions)
    renderQueryParams()
}

function renderQueryParams() {

    document.querySelector('.search-input').value = gQueryOptions.filterBy.txt

    const sortKeys = Object.keys(gQueryOptions.sortBy)
    const sortField = sortKeys[0]
    const sortDir = gQueryOptions.sortBy[sortKeys[0]]

    document.querySelector('.sort-by select').value = sortField || ''
    document.querySelector('.sort-by input').checked = sortDir === -1
}

function setQueryParams() {
    const queryParams = new URLSearchParams()

    queryParams.set('text', gQueryOptions.filterBy.txt)

    const sortKeys = Object.keys(gQueryOptions.sortBy)
    if (sortKeys.length) {
        const sortField = sortKeys[0]
        queryParams.set('sortField', sortField)
        queryParams.set('sortDir', gQueryOptions.sortBy[sortField])
    }

    if (gQueryOptions.page) {
        queryParams.set('currPageNumber', gQueryOptions.page.currPageNumber)
        queryParams.set('pageSize', gQueryOptions.page.size)
    }
  
    const newUrl =
        window.location.protocol + "//" +
        window.location.host +
        window.location.pathname + '?' + queryParams.toString()

    window.history.pushState({ path: newUrl }, '', newUrl)
}

// HELPERS
function onChangeView(layout) {
    const filterBy = gQueryOptions.filterBy
    gLayout = layout
    saveToStorage(LAYOUT_KEY, gLayout)
    onSetFilterBooks(filterBy)
}

function onChangePage(diff) {
    const pageCount = getPageCount(gQueryOptions)

    var newPageIdx = gQueryOptions.page.currPageNumber + diff
    if (newPageIdx >= pageCount) newPageIdx = 0
    if (newPageIdx < 0) newPageIdx = pageCount - 1

    gQueryOptions.page.currPageNumber = newPageIdx
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    })
    
    setQueryParams()
    renderBooks()
}

function onSubmit(action) {
    const elModal = document.querySelector('.modal')
    const titleFieldValue = elModal.querySelector('.modal-wrapper.add-btn .title-input').value
    const updatedPriceFieldValue = parseFloat(elModal.querySelector('.modal-wrapper.update-btn .price-input').value)
    const newPriceFieldValue = parseFloat(elModal.querySelector('.modal-wrapper.add-btn .price-input').value)
    const imgFieldValue = elModal.querySelector('.modal-wrapper.add-btn .img-input').value
    const ratingFieldValue = elModal.querySelector('.modal-wrapper.add-btn .rating-input').value
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
        addBook(titleFieldValue, newPriceFieldValue, imgFieldValue, parseInt(ratingFieldValue))

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

function onClearSearch() {
    const elNoBooksFound = document.querySelector('.no-books-found')
    const elSearchInput = document.querySelector('.search-input')
    elNoBooksFound.classList.add('hidden')
    elSearchInput.value = ''
    gQueryOptions.filterBy.txt = ''
    renderBooks()
}

function clearInputFields() {
    const elModal = document.querySelector('.modal');
    const inputFields = elModal.querySelectorAll('input')

    inputFields.forEach(input => {
        if (input.value) input.value = ''
    })
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