const bookShelf = [];
const RENDER_EVENT = "render-bookshelf";
const STORAGE_KEY = "bookshelf";
const SAVED_EVENT = "saved-bookshelf";

// Generate Id (unique id)
function generateId() {
  return +new Date();
}

// Generate Book Object
function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

// Event Listener when document loaded
document.addEventListener("DOMContentLoaded", function () {
  const inputBook = document.getElementById("inputBook");

  //   Event Listener Form
  inputBook.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
  });

  //   Load Data From Local Storage
  if (isStorageExist()) {
    loadDataFromLocalStorage();
  }
});

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const generateID = generateId();
  const bookObject = generateBookObject(generateID, title, author, year, isComplete);
  bookShelf.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));

  saveDataToLocalStorage();
}

// Event Listener RENDER_EVENT
document.addEventListener(RENDER_EVENT, function () {
  const incompletedBookList = document.getElementById("incompletedBookShelfList");
  incompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completedBookShelfList");
  completedBookList.innerHTML = "";

  for (const book of bookShelf) {
    const bookShelfElement = makeBook(book);
    if (!book.isComplete) incompletedBookList.append(bookShelfElement);
    else completedBookList.append(bookShelfElement);
  }
});

function makeBook(bookObject) {
  const bookTitle = document.createElement("h3");
  bookTitle.classList.add("font-bold", "text-xl", "text-neutral-950");
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.classList.add("font-semibold", "text-lg", "text-neutral-800");
  bookAuthor.innerText = bookObject.author;

  const bookYear = document.createElement("p");
  bookYear.classList.add("font-medium", "text-base", "text-neutral-600");
  bookYear.innerText = bookObject.year;

  const bookContainer = document.createElement("article");
  bookContainer.classList.add("shadow-xl", "rounded-lg", "border", "border-blue-500", "p-4", "my-1");
  bookContainer.append(bookTitle, bookAuthor, bookYear);
  bookContainer.setAttribute("id", `bookId-${bookObject.id}`);

  //   Check if book is complete or not
  if (bookObject.isComplete) {
    const undoCompleteButton = document.createElement("button");
    undoCompleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
</svg>
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
  `;
    undoCompleteButton.classList.add("text-lg", "bg-blue-950", "text-white", "block", "rounded-md", "py-1.5", "px-2", "hover:bg-blue-800");

    // Event Listener Undo
    undoCompleteButton.addEventListener("click", function () {
      undoBookFromComplete(bookObject.id);
    });

    const removeButton = document.createElement("button");
    removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
  `;
    removeButton.classList.add("text-lg", "bg-red-700", "text-white", "block", "rounded-md", "py-1.5", "px-2", "hover:bg-red-600");
    removeButton.classList.add("remove-button");

    // Event Listener Remove Book
    removeButton.addEventListener("click", function () {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "Your book has been deleted.",
            icon: "success",
          });
          removeBook(bookObject.id);
        }
      });
    });

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action", "flex", "flex-row", "gap-x-2", "mt-3");
    actionContainer.append(undoCompleteButton, removeButton);
    bookContainer.append(actionContainer);
  } else {
    const completeButton = document.createElement("button");
    completeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
  `;
    completeButton.classList.add("text-lg", "bg-blue-950", "text-white", "block", "rounded-md", "py-1.5", "px-2", "hover:bg-blue-800");

    completeButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    const removeButton = document.createElement("button");
    removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
  `;
    removeButton.classList.add("text-lg", "bg-red-700", "text-white", "block", "rounded-md", "py-1.5", "px-2", "hover:bg-red-600");
    removeButton.classList.add("remove-button");

    // Event Listener Remove Book
    removeButton.addEventListener("click", function () {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "Your book has been deleted.",
            icon: "success",
          });
          removeBook(bookObject.id);
        }
      });
    });

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action", "flex", "flex-row", "gap-x-2", "mt-3");
    actionContainer.append(completeButton, removeButton);
    bookContainer.append(actionContainer);
  }

  return bookContainer;
}

function addBookToCompleted(bookId) {
  const completedBook = findBook(bookId);

  if (completedBook == null) return;

  completedBook.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  //   save data to local storage
  saveDataToLocalStorage();
}

function undoBookFromComplete(bookId) {
  const incompletedBook = findBook(bookId);

  if (incompletedBook == null) return;

  incompletedBook.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  //   save data to local storage
  saveDataToLocalStorage();
}

function removeBook(bookId) {
  const bookIndex = findBookIndex(bookId);

  if (bookIndex === -1) return;

  bookShelf.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveDataToLocalStorage();
}

function findBook(bookId) {
  for (const book of bookShelf) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const i in bookShelf) {
    if (bookShelf[i].id === bookId) {
      return i;
    }
  }
  return -1;
}

function saveDataToLocalStorage() {
  if (isStorageExist) {
    const parsedData = JSON.stringify(bookShelf);
    localStorage.setItem(STORAGE_KEY, parsedData);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser not support local storage");
    return false;
  }
  return true;
}

//Event Listener SAVED_EVENT
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

// Load Data from Local Storage
function loadDataFromLocalStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const bookList = JSON.parse(serializedData);

  if (bookList !== null) {
    for (const book of bookList) {
      bookShelf.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Searching books feature
function searchBooks() {
  //   input, filter, shelf, articles, titles, i, textValue;
  const input = document.getElementById("searchBookTitle").value;
  const filter = input.toUpperCase();
  const shelf = document.getElementsByClassName("book_list");

  for (let j = 0; j < shelf.length; j++) {
    const articles = shelf[j].getElementsByTagName("article");

    for (let i = 0; i < articles.length; i++) {
      const titles = articles[i].getElementsByTagName("h3")[0];
      const textValue = titles.textContent || titles.innerText;
      if (textValue.toUpperCase().indexOf(filter) > -1) {
        articles[i].hidden = false;
      } else {
        articles[i].hidden = true;
      }
    }
  }
}
