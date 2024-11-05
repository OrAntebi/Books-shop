'use strict'


function onInit() {
    renderBooks()
}

function renderBooks() {
    const elBooks = document.querySelector('.books-body-container')
    const books = getBooks()

    const strHtmls = books.map(book => `
        <tr>
            <td>${book.title}</td>
            <td>${book.price}</td>
            <td>
                <button onclick="onReadBook(event, '${book.sku}')">Read</button>
                <button onclick="onUpdateBook(event, '${book.sku}')">Update</button>
                <button onclick="onRemoveBook(event, '${book.sku}')">Delete</button>
            </td>
        </tr>`
    )
    elBooks.innerHTML = strHtmls.join('')
}


function onReadBook(ev, sku) {
    
}

function onUpdateBook(ev, sku) {
    
}

function onRemoveBook(ev, sku) {
    
}
