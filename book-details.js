const params = new URLSearchParams(window.location.search);
const bookId = params.get('id');

const fetchBookDetails = async () => {
    const res = await fetch(`https://gutendex.com/books/${bookId}`);
    const book = await res.json();
    renderBookDetails(book);
};

const renderBookDetails = (book) => {
    const bookDetails = document.getElementById('book-details');
    bookDetails.innerHTML = `
        <img class="w-full h-64 object-cover mb-4" src="${book.formats["image/jpeg"] || 'placeholder.jpg'}" alt="${book.title}">
        <h2 class="text-2xl font-bold mb-4">${book.title}</h2>
        <p class="text-lg">${book?.authors[0]?.name}</p>
        <p class="text-sm text-gray-500">${book?.subjects.join(', ')}</p>
        <p class="mt-4">${book?.description || 'No description available'}</p>
    `;
};

fetchBookDetails();
