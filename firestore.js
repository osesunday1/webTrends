import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD7UYCpLmZlUWfnX8UKYuCwsv8quc5DQ80",
    authDomain: "crudweb-33534.firebaseapp.com",
    projectId: "crudweb-33534",
    storageBucket: "crudweb-33534.firebasestorage.app",
    messagingSenderId: "198702026055",
    appId: "1:198702026055:web:f9307c54c483d15b48d062"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/// add book
document.getElementById("submitData").addEventListener("click", async function(event) {
    event.preventDefault(); // Prevents form reload

    // Get input values
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const isbn = document.getElementById("isbn").value.trim();
    const image = document.getElementById("image").value.trim();
    const price = parseFloat(document.getElementById("price").value) || 0;
    const genre = document.getElementById("genre").value;
    const description = document.getElementById("description").value.trim();

    // Validate input fields
    if (!title || !author || !isbn || !genre || !description) {
        alert("Please fill in all fields before adding a book.");
        return;
    }

    try {
        // Save book to Firestore
        await addDoc(collection(db, "Books"), {
            title,
            author,
            isbn,
            price,
            image,
            genre,
            description
        });

        alert("Book added successfully ✅");

        // Reset the form
        document.getElementById("bookForm").reset();

        // Reload book list
        loadBooks();
    } catch (error) {
        console.error("Error adding book:", error);
        alert("Error adding book ❌. Please try again.");
    }
});

// Function to Fetch Books from Firestore
async function loadBooks() {
    const bookContainer = document.getElementById("bookContainer");
    bookContainer.innerHTML = ""; // Clear previous content

    const querySnapshot = await getDocs(collection(db, "Books"));

    if (querySnapshot.empty) {
        bookContainer.innerHTML = "<p>No books available.</p>";
        return;
    }

    const fragment = document.createDocumentFragment(); // Optimize performance

    querySnapshot.forEach((docSnapshot) => {
        const book = docSnapshot.data();
        const bookId = docSnapshot.id;

         // Check if book.image exists, else use a default image or background color
         const backgroundStyle = book.image
         ? `background-image: url('${book.image}'); background-size: cover; background-position: center;`
         : `background-color: #03a9f4;`; // Fallback if no image

        const bookCard = document.createElement("div");
        bookCard.classList.add("card");
        bookCard.setAttribute("data-id", bookId);
        bookCard.innerHTML = `
            <div class="face face1" style="${backgroundStyle}">
                <div class="content">
                    <h3>${book.title}</h3>
                </div>
            </div>
            <dv class="face face2">
                <div class="content">
                    <h3>Author: ${book.author}</h3>
                    <p>Genre: ${book.genre}</p>
                    <p>Price: $${book.price ? book.price.toFixed(2) : 'N/A'}</p>
                    
                    <div class="icons">
                        <a href="" class="read-more" data-title="${book.title}" data-description="${book.description}">
                            <i class="fas fa-eye"></i>
                        </a>
                        <a href="" class="edit-book" data-id="${bookId}" data-title="${book.title}" data-author="${book.author}" 
                            data-isbn="${book.isbn}" data-price="${book.price}" data-genre="${book.genre}" data-description="${book.description}">
                            <i class="fas fa-edit"></i>
                        </a>
                        <a href="" class="delete-book" data-id="${bookId}">
                            <i class="fas fa-trash"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;

        fragment.appendChild(bookCard);
    });

    bookContainer.appendChild(fragment); // Append everything at once

    // Event listener for "Edit Book" functionality
    document.querySelectorAll(".edit-book").forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            document.getElementById("editBookId").value = this.getAttribute("data-id");
            document.getElementById("editTitle").value = this.getAttribute("data-title");
            document.getElementById("editAuthor").value = this.getAttribute("data-author");
            document.getElementById("editIsbn").value = this.getAttribute("data-isbn");
            document.getElementById("editPrice").value = this.getAttribute("data-price");
            document.getElementById("editGenre").value = this.getAttribute("data-genre");
            document.getElementById("editDescription").value = this.getAttribute("data-description");

            document.getElementById("editBookModal").style.display = "flex";
        });
    });

        // Add event listeners to all "Read More" buttons
        document.querySelectorAll(".read-more").forEach(button => {
            button.addEventListener("click", function(event) {
                event.preventDefault();
                const title = this.getAttribute("data-title");
                const description = this.getAttribute("data-description");
    
                // Show modal
                document.getElementById("modalTitle").innerText = title;
                document.getElementById("modalDescription").innerText = description;
                document.getElementById("bookModal").style.display = "flex";
            });
        });

            // Close modal when clicking the close button
    document.querySelector(".close").addEventListener("click", function() {
        document.getElementById("bookModal").style.display = "none";
    });

    // Close modal when clicking outside modal content
    window.addEventListener("click", function(event) {
        const modal = document.getElementById("bookModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

        


    // Delete Book Functionality
    document.querySelectorAll(".delete-book").forEach(button => {
        button.addEventListener("click", async function(event) {
            event.preventDefault();
            const bookId = this.getAttribute("data-id");

            if (confirm("Are you sure you want to delete this book?")) {
                try {
                    await deleteDoc(doc(db, "Books", bookId));
                    document.querySelector(`[data-id="${bookId}"]`).remove();
                    alert("Book deleted successfully ✅");
                } catch (error) {
                    console.error("Error deleting book:", error);
                    alert("Error deleting book ❌");
                }
            }
        });
    });

    // Close Edit Modal
    document.querySelector(".close-edit").addEventListener("click", function() {
        document.getElementById("editBookModal").style.display = "none";
    });

    // Update Book Functionality
    document.getElementById("editBookForm").addEventListener("submit", async function(event) {
        event.preventDefault();

        const bookId = document.getElementById("editBookId").value;
        const updatedBook = {
            title: document.getElementById("editTitle").value,
            author: document.getElementById("editAuthor").value,
            isbn: document.getElementById("editIsbn").value,
            price: parseFloat(document.getElementById("editPrice").value),
            genre: document.getElementById("editGenre").value,
            description: document.getElementById("editDescription").value
        };

        try {
            await updateDoc(doc(db, "Books", bookId), updatedBook);
            alert("Book updated successfully ✅");
            document.getElementById("editBookModal").style.display = "none";
            loadBooks(); // Refresh the books
        } catch (error) {
            console.error("Error updating book:", error);
            alert("Error updating book ❌");
        }
    });
}

// Load books when the page is loaded
document.addEventListener("DOMContentLoaded", loadBooks);