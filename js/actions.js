window.onload = () => {
    searchBook()
}

function searchBook() {
    // Opciones de la solicitud (método, headers, body, etc.)
    const options = {
        method: 'GET', // o 'POST', 'PUT', 'DELETE', etc.
        headers: {
            'Content-Type': 'application/json',
            // otros headers si es necesario
        },
        // body: JSON.stringify({ key: 'value' }) // solo para métodos que llevan cuerpo como POST
    };
    fetch('https://www.googleapis.com/books/v1/volumes?q=animals', options)
        .then(response => {
            return response.json()
        })
        .then(data => {
            const table = document.getElementById('bookTable')
            const row = document.createElement('tr')
           
            console.log(data);
            data.items.forEach(element => {
                const cellImage = document.createElement('td')
                const cellTitle = document.createElement('td')
                const cellAuthor = document.createElement('td')
                const cellDescription = document.createElement('td')
                const image = document.createElement('img')
                image.src = element.volumeInfo.imageLinks.thumbnail
                cellImage.append(image)
                cellTitle.innerHTML = element.volumeInfo.title
                cellAuthor.innerHTML = element.volumeInfo.authors.join('')
                cellDescription.innerHTML = element.volumeInfo.description
                row.append(cellImage)
                row.append(cellTitle)
                row.append(cellAuthor)
                row.append(cellDescription)
                table.append(row)
            });
        })
        .catch(error => {
            console.log("🚀 ~ searchBook ~ error:", error)
        })
}