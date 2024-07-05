window.onload = () => {
    noData()
}

function noData() {
    const table = document.getElementById('bookTable')
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 4;
    cell.textContent = 'No se encontraron resultados.';
    cell.style.textAlign = 'center';
    row.appendChild(cell);
    table.appendChild(row);
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedSearchBook = debounce(function(event) {
    const query = event.target.value;

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`, options)
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('bookTable');
            table.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            if (!data.items || data.items.length === 0) {
                const row = document.createElement('tr');
                const cell = document.createElement('td');
                cell.colSpan = 4; // Ajusta según el número de columnas
                cell.textContent = 'No se encontraron resultados, escriba el titulo de un libro...';
                cell.style.textAlign = 'center'; // Centrar el texto en la celda
                row.appendChild(cell);
                table.appendChild(row);
                return;
            }

            data.items.forEach(element => {
                const row = document.createElement('tr');

                const cellImage = document.createElement('td');
                const cellTitle = document.createElement('td');
                const cellAuthor = document.createElement('td');
                const cellDescription = document.createElement('td');

                const image = document.createElement('img');
                image.src = element.volumeInfo.imageLinks.thumbnail;
                cellImage.append(image);

                cellTitle.innerHTML = element.volumeInfo.title;

                cellAuthor.innerHTML = element.volumeInfo.authors ? element.volumeInfo.authors.join(', ') : 'SIN AUTOR';

                const descriptionText = element.volumeInfo.description || '';
                const truncatedText = descriptionText.length > 100 ? descriptionText.substring(0, 97) + '...' : descriptionText;

                cellDescription.innerHTML = truncatedText;
                cellDescription.classList.add('cell-description');
                cellDescription.setAttribute('data-fulltext', descriptionText);

                row.append(cellImage, cellTitle, cellAuthor, cellDescription);
                table.append(row);
            });
        })
        .catch(error => {
            console.error("Error:", error);
            const table = document.getElementById('bookTable');
            table.innerHTML = ''; // Limpiar la tabla antes de agregar el mensaje de error

            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 4; // Ajusta según el número de columnas
            cell.textContent = 'Ocurrió un error al cargar los datos.';
            cell.style.textAlign = 'center'; // Centrar el texto en la celda
            row.appendChild(cell);
            table.appendChild(row);
        });
}, 300); // Ajusta el tiempo de espera del debounce (en milisegundos)

document.getElementById('searchInput').addEventListener('keyup', debouncedSearchBook);
