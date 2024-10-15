const wishlistBooksContainer = document.getElementById("wishlist-books");
let wishlistBooks = JSON.parse(localStorage.getItem("wishlist")) || [];

// Fetch books by their ID from the Gutenberg API
const fetchWishlistBooks = async () => {
  if (wishlistBooks.length === 0) {
    wishlistBooksContainer.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  const promises = wishlistBooks.map(async (bookId) => {
    const res = await fetch(`https://gutendex.com/books/${bookId}/`);
    return res.json();
  });

  const books = await Promise.all(promises);

  renderWishlistBooks(books);
};

// Render wishlisted books in the UI
const renderWishlistBooks = (books) => {
  wishlistBooksContainer.innerHTML = "";

  books.forEach((book) => {
    const authorName = book.authors.map((author) => author.name).join(", ");
    const genres = book.subjects.join(", ");

    const bookCard = document.createElement("div");
    bookCard.classList = "bg-white shadow-lg rounded-lg overflow-hidden p-4";

    bookCard.innerHTML = `
            <img class="w-full h-64 object-cover cursor-pointer book-image" src="${
              book.formats["image/jpeg"] || "placeholder.jpg"
            }" alt="${book.title}">
            <h3 class="text-lg font-bold mt-2 cursor-pointer book-title">${
              book.title
            }</h3>
            <p class="text-gray-600">${authorName}</p>
            <p class="text-sm text-gray-500">${genres || "N/A"}</p>
            <p class="text-sm text-gray-500">ID: ${book.id}</p>
            <button onclick="removeFromWishlist(${book.id})" class="mt-4 p-2 bg-red-100 rounded text-red-600">Remove from Wishlist</button>
        `;

    // Add event listener to redirect when the image or title is clicked
    const bookImage = bookCard.querySelector(".book-image");
    const bookTitle = bookCard.querySelector(".book-title");

    bookImage.addEventListener("click", () => {
      window.location.href = `book.html?id=${book.id}`;
    });

    bookTitle.addEventListener("click", () => {
      window.location.href = `book.html?id=${book.id}`;
    });

    wishlistBooksContainer.appendChild(bookCard);
  });
};

// Remove a book from the wishlist
const removeFromWishlist = (bookId) => {
  // Remove the book from the wishlist array
  wishlistBooks = wishlistBooks.filter((id) => id !== bookId);
  // Update localStorage
  localStorage.setItem("wishlist", JSON.stringify(wishlistBooks));

  // Re-render the wishlist immediately
  fetchWishlistBooks(); 
};

// Fetch and display the wishlist books when the page loads
fetchWishlistBooks();
