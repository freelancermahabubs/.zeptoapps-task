let books = [];
let filteredBooks = [];
let currentPage = 1;
let nextPage = null;
let prevPage = null;
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Fetch available genres
const fetchGenres = async () => {
    try {
        const res = await fetch("https://gutendex.com/books/subjects/");
        const data = await res.json();
        const genreDropdown = document.getElementById("genre-filter");

        // Populate genre dropdown
        data.results.forEach((genre) => {
            const option = document.createElement("option");
            option.value = genre;
            option.textContent = genre;
            genreDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching genres:", error);
    }
};

// Fetch books from the API
const fetchBooks = async (page = 1) => {
    document.getElementById("loading").classList.remove("hidden");
    try {
        const res = await fetch(`https://gutendex.com/books/?page=${page}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.statusText}`);
        }
        const data = await res.json();

        document.getElementById("loading").classList.add("hidden");

        // Update books, nextPage, prevPage, and currentPage
        books = data.results;
        nextPage = data.next;
        prevPage = data.previous;
        currentPage = page;

        renderBooks(books);
        setupPagination();
    } catch (error) {
        console.error("Error fetching books:", error);
        document.getElementById("loading").textContent = "Failed to load data.";
    }
};

// Render the books
const renderBooks = (booksToRender) => {
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = ""; // Clear existing books

    booksToRender.forEach((book) => {
        const authorName = book?.authors?.map((author) => author?.name).join(", ");
        const genres = book.subjects.join(", ");

        const bookCard = document.createElement("div");
        bookCard.classList =
            "bg-white shadow-lg rounded-lg overflow-hidden p-4 transform transition-all hover:scale-105";

        bookCard.innerHTML = `
            <img class="w-full h-64 object-cover cursor-pointer" src="${
                book.formats["image/jpeg"] || "placeholder.jpg"
            }" alt="${book.title}">
            <h3 class="text-lg font-bold mt-2">${book.title}</h3>
            <p class="text-gray-600">${authorName}</p>
            <p class="text-sm text-gray-500">${genres || "N/A"}</p>
            <p class="text-sm text-gray-500">ID: ${book?.id}</p>
            <button onclick="toggleWishlist(${
                book.id
            })" class="mt-4 p-2 bg-red-100 rounded text-red-600">
                ${wishlist.includes(book.id) ? "❤️ Wishlisted" : "♡ Wishlist"}
            </button>
        `;

        bookList.appendChild(bookCard);
    });
};

// Update Wishlist Count
const updateWishlistCount = () => {
    const wishlistCount = document.getElementById("wishlist-count");
    wishlistCount.textContent = wishlist.length;
};

// Add/Remove Book from Wishlist
const toggleWishlist = (bookId) => {
    const index = wishlist.indexOf(bookId);
    if (index !== -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(bookId);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    updateWishlistCount();
    renderBooks(filteredBooks.length ? filteredBooks : books);
};

// Setup Pagination
const setupPagination = () => {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    // Previous Page Button
    if (prevPage) {
        const prevBtn = document.createElement("button");
        prevBtn.innerText = "Previous";
        prevBtn.classList = "mx-2 px-4 py-2 bg-blue-500 text-white rounded";
        prevBtn.addEventListener("click", () => fetchBooks(currentPage - 1));
        pagination.appendChild(prevBtn);
    }

    // Next Page Button
    if (nextPage) {
        const nextBtn = document.createElement("button");
        nextBtn.innerText = "Next";
        nextBtn.classList = "mx-2 px-4 py-2 bg-blue-500 text-white rounded";
        nextBtn.addEventListener("click", () => fetchBooks(currentPage + 1));
        pagination.appendChild(nextBtn);
    }
};

// Search books by title
document.getElementById("search").addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm)
    );
    renderBooks(filteredBooks);
});

// Filter books by genre
const genreDropdown = document.getElementById("genre-filter");
genreDropdown.addEventListener("change", (e) => {
    const selectedGenre = e.target.value;

    // Filter books based on both search and genre
    filteredBooks = books.filter((book) => {
        const matchesGenre = selectedGenre ? book.subjects.includes(selectedGenre) : true;
        const matchesSearch = book.title.toLowerCase().includes(document.getElementById("search").value.toLowerCase());
        return matchesGenre && matchesSearch;
    });

    renderBooks(filteredBooks);
});

// Initial fetch of books and genres on page load
fetchBooks();
fetchGenres();
