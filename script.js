// CHANGE IP IN URL
// ADD IMAGES BEFORE SEARCHING IN DIV
// ADD PAGINATION (MAYBE)
URL = "http://localhost:9200/books_data/_search/template"
var searchOptions = document.getElementById("search-options")
const formDiv = document.getElementById("form-div")
const cardData = document.getElementById("card-data")

function showBookInformation(searchTemplate) {
    cardData.innerHTML = ""

    fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(searchTemplate)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json()
    })
    .then(data => {
        let bookCard = ""
        if (data.hits.total.value <= 0) {
            bookCard = `<div>Your search did not match any documents</div>`;
        } else {
            data.hits.hits.forEach(hit => {
                const highlightedTitle = hit.highlight ? hit.highlight["Book-Title"] : null
                const bookTitle = highlightedTitle ? highlightedTitle[0] : hit._source["Book-Title"]
                const highlightedAuhor = hit.highlight ? hit.highlight["Book-Author"] : null
                const bookAuthor = highlightedAuhor ? highlightedAuhor[0] : hit._source["Book-Author"]
                const highlightedPublisher = hit.highlight ? hit.highlight["Publisher"] : null
                const bookPublisher = highlightedPublisher ? highlightedPublisher[0] : hit._source["Publisher"]

                bookCard += `<div class="book-card">
                    <img src="${hit._source["Image-URL-L"]}" alt="${hit._source["Book-Title"]}">
                    <div class="card-container">
                        <p>${hit._source["ISBN"]}</p>
                        <p>${bookTitle}</p>
                        <p>${bookAuthor}</p>
                        <p><span>published by </span>${bookPublisher}</p>
                        <span>${hit._source["Year-Of-Publication"]}</span>
                    </div>
                </div>`;
            });
        }
        cardData.innerHTML += bookCard
    })
}


function searchByTitle(parameters) {
    let searchTemplate = {
        "id": "book_title",
        "params": {
            "parameters": parameters
        }
    }
    showBookInformation(searchTemplate)
}

function searchByAuthor(parameters) {
    let searchTemplate = {
        "id": "book_author",
        "params": {
            "parameters": parameters
        }
    }
    showBookInformation(searchTemplate)
}

function searchByYearOfPublication(parameters) {
    let searchTemplate = {
        "id": "year_publication",
        "params": {
            "parameter1": parameters[0],
            "parameter2": parameters[1]
        }
    }
    showBookInformation(searchTemplate)
}

function searchByPublisher(parameters) {
    let searchTemplate = {
        "id": "book_publisher",
        "params": {
            "parameters": parameters
        }
    }
    showBookInformation(searchTemplate)
}

function searchAdvanced(parameters) {
    let searchTemplate = {
        "id": "search_book",
        "params": {
            "parameters": parameters
        }
    }
    showBookInformation(searchTemplate)
}


searchOptions.addEventListener("change", function () {
    const currentYear = new Date().getFullYear();
    formDiv.innerHTML = ""
    cardData.innerHTML = ""
    let htmlDiv;

    switch (searchOptions.value) {
        case "book_title":
            htmlDiv = `<input type="text" id="parameters-input" placeholder="Search by title">
                <button type="button" id="search-button">Search</button>`
            break;

        case "book_author":
            htmlDiv = `<input type="text" id="parameters-input" placeholder="Search by author">
                <button type="button" id="search-button">Search</button>`
            break;

        case "year_publication":
            htmlDiv = `<select name="year1" id="year1" value="1800">
                ${Array.from({ length: currentYear - 1799 }, (_, i) => `<option value="${i + 1800}">${i + 1800}</option>`).join('')}
                </select>
                <select name="year2" id="year2" value="${currentYear}">
                ${Array.from({ length: currentYear - 1799 }, (_, i) => `<option value="${i + 1800}" ${i + 1800 === currentYear ? 'selected' : ''}>${i + 1800}</option>`).join('')}
                </select>
                <button type="button" id="search-button">Search</button>`
            break;

        case "book_publisher":
            htmlDiv = `<input type="text" id="parameters-input" placeholder="Search by publisher">
                    <button type="button" id="search-button">Search</button>`
            break;
        case "search_book":
            // htmlDiv = `<input type="text" id="book_title" placeholder="Title">
            //     <input type="text" id="book_author" placeholder="Author">
            //     <input type="text" id="book_publisher" placeholder="Publisher">
            //     <select name="year1" id="year1" value="1800">
            //     ${Array.from({ length: currentYear - 1799 }, (_, i) => `<option value="${i + 1800}">${i + 1800}</option>`).join('')}
            //     </select>
            //     <select name="year2" id="year2" value="${currentYear}">
            //     ${Array.from({ length: currentYear - 1799 }, (_, i) => `<option value="${i + 1800}" ${i + 1800 === currentYear ? 'selected' : ''}>${i + 1800}</option>`).join('')}
            //     </select>
            //     <button type="button" id="search-button">Search</button>`
            htmlDiv = `<input type="text" id="parameters-input" placeholder="Search">
                    <button type="button" id="search-button">Search</button>`
            break;
    }
    formDiv.innerHTML += htmlDiv

    document.getElementById("search-button").addEventListener("click", function () {
        switch (searchOptions.value) {
            case "book_title":
                searchByTitle(document.getElementById("parameters-input").value)
                break;
            case "book_author":
                searchByAuthor(document.getElementById("parameters-input").value)
                break;
            case "year_publication":
                year1 = document.getElementById("year1").value
                year2 = document.getElementById("year2").value
                if(year1>=year2) {
                    cardData.innerHTML = `First year must be lower than the second one`
                } else{
                    parametersArray = [year1, year2]
                    searchByYearOfPublication(parametersArray)
                }
                break;
            case "book_publisher":
                searchByPublisher(document.getElementById("parameters-input").value)
                break;
            case "search_book":
                // year1 = document.getElementById("year1").value
                // year2 = document.getElementById("year2").value
                // bookTitle = document.getElementById("book_title").value
                // bookAuthor = document.getElementById("book_author").value
                // bookPublisher = document.getElementById("book_publisher").value
                // parametersArray = [bookTitle, year1, year2, bookAuthor, bookPublisher]
                searchAdvanced(document.getElementById("parameters-input").value)
                break;
        }
    })
})

document.getElementById("search-button").addEventListener("click", function () {
    searchAdvanced(document.getElementById("parameters-input").value)
})