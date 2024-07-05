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
            table.innerHTML = '';

            if (!data.items || data.items.length === 0) {
                alert(table, 'Escriba el titulo de un libro...')
                return;
            }

            data.items.forEach(element => {
                //Crear renglon
                const row = document.createElement('tr');

                //Crear celdas
                const cellImage = document.createElement('td');
                const cellTitle = document.createElement('td');
                const cellAuthor = document.createElement('td');
                const cellDescription = document.createElement('td');

                //Crear etiqueta imagen y asignar imagen de base de datos
                const image = document.createElement('img');
                image.src = element.volumeInfo.imageLinks.thumbnail;
                cellImage.append(image);

                //Asignar titulo a la celda
                cellTitle.innerHTML = element.volumeInfo.title;

                //Asignar autor a la celda, si no encuentra autor muestra el mensaje "SIN AUTOR"
                cellAuthor.innerHTML = element.volumeInfo.authors ? element.volumeInfo.authors.join(', ') : 'SIN AUTOR';

                //Asignar descripcion a la celda
                const descriptionText = element.volumeInfo.description || '';
                
                //Si la descripcion tiene mas de 100 caracteres, se trunca para que no se distorsione la tabla
                const truncatedText = descriptionText.length > 100 ? descriptionText.substring(0, 97) + '...' : descriptionText;
                cellDescription.innerHTML = truncatedText;

                //Agregamos las celdas al renglon
                row.append(cellImage, cellTitle, cellAuthor, cellDescription);

                //Agregamos el renglon a la tabla
                table.append(row);
            });
        })
        .catch(error => {
            console.error("Error:", error);
            const table = document.getElementById('bookTable');
            table.innerHTML = '';

            alert(table, 'Ocurrió un error al cargar los datos.')
        });
}, 300);

function alert(table, message) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 4;
    cell.textContent = message;
    cell.style.textAlign = 'center';
    row.appendChild(cell);
    table.appendChild(row);
}

document.getElementById('searchInput').addEventListener('keyup', debouncedSearchBook);
