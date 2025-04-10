let shelfBooks = JSON.parse(localStorage.getItem("shelfBooks")) || [];
let preorderBooks = JSON.parse(localStorage.getItem("preorderBooks")) || [];
let currentTab = "shelf";

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll(".tab").forEach(s => s.style.display = "none");
  document.getElementById(tab + "Section").style.display = "block";
  renderBooks();
  if (tab === "expenses") updateTotals();
}

function renderBooks() {
  const list = currentTab === "shelf" ? shelfBooks : preorderBooks;
  const container = document.getElementById(currentTab + "List");
  if (!container) return;
  container.innerHTML = "";
  list.forEach((book, index) => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.onclick = () => openQuickView(book);
    card.innerHTML = `
      <img src="${book.image || 'https://via.placeholder.com/150'}" alt="Buchbild"/>
      <h4>${book.title}</h4>
      <p>${book.author}</p>
      <p><strong>${book.price} €</strong></p>
      <button onclick="event.stopPropagation(); editBook(${index}, '${currentTab}')">✏️</button>
      <button onclick="event.stopPropagation(); deleteBook(${index}, '${currentTab}')">🗑️</button>
    `;
    container.appendChild(card);
  });
}

function openForm(book = null) {
  document.getElementById("formModal").classList.remove("hidden");
  document.getElementById("bookForm").reset();
  document.getElementById("editIndex").value = "";
  document.getElementById("editType").value = "";
  document.getElementById("formTitle").innerText = "Buch hinzufügen";

  if (book) {
    document.getElementById("inputTitle").value = book.title;
    document.getElementById("inputAuthor").value = book.author;
    document.getElementById("inputDate").value = book.date;
    document.getElementById("inputPrice").value = book.price;
    document.getElementById("inputDescription").value = book.description;
    document.getElementById("inputImage").value = book.image;
    document.getElementById("inputType").value = book.type;
  }
}

function closeForm() {
  document.getElementById("formModal").classList.add("hidden");
}

function saveBook(e) {
  e.preventDefault();
  const book = {
    title: inputTitle.value,
    author: inputAuthor.value,
    date: inputDate.value,
    price: parseFloat(inputPrice.value),
    description: inputDescription.value,
    image: inputImage.value,
    type: inputType.value
  };

  const idx = document.getElementById("editIndex").value;
  const type = document.getElementById("editType").value || book.type;

  if (idx !== "") {
    if (type === "shelf") shelfBooks[idx] = book;
    else preorderBooks[idx] = book;
  } else {
    if (book.type === "shelf") shelfBooks.push(book);
    else preorderBooks.push(book);
  }

  saveToStorage();
  closeForm();
  renderBooks();
}

function editBook(index, type) {
  const book = type === "shelf" ? shelfBooks[index] : preorderBooks[index];
  openForm(book);
  document.getElementById("editIndex").value = index;
  document.getElementById("editType").value = type;
  document.getElementById("formTitle").innerText = "Buch bearbeiten";
}

function deleteBook(index, type) {
  if (type === "shelf") shelfBooks.splice(index, 1);
  else preorderBooks.splice(index, 1);
  saveToStorage();
  renderBooks();
}

function openQuickView(book) {
  document.getElementById("quickViewModal").classList.remove("hidden");
  document.getElementById("bookTitle").innerText = book.title;
  document.getElementById("bookAuthor").innerText = book.author;
  document.getElementById("bookDate").innerText = book.date;
  document.getElementById("bookPrice").innerText = book.price.toFixed(2);
  document.getElementById("bookDescription").innerText = book.description;
  document.getElementById("bookImage").src = book.image || 'https://via.placeholder.com/300';
}

function closeQuickView() {
  document.getElementById("quickViewModal").classList.add("hidden");
}

function sortBooks() {
  const key = document.getElementById("sortSelect").value;
  if (!key) return;
  const list = currentTab === "shelf" ? shelfBooks : preorderBooks;
  list.sort((a, b) => a[key].localeCompare(b[key]));
  renderBooks();
}

function updateTotals() {
  const shelfTotal = shelfBooks.reduce((sum, b) => sum + b.price, 0);
  const preorderTotal = preorderBooks.reduce((sum, b) => sum + b.price, 0);
  document.getElementById("shelfTotal").innerText = shelfTotal.toFixed(2) + " €";
  document.getElementById("preorderTotal").innerText = preorderTotal.toFixed(2) + " €";
}

function saveToStorage() {
  localStorage.setItem("shelfBooks", JSON.stringify(shelfBooks));
  localStorage.setItem("preorderBooks", JSON.stringify(preorderBooks));
}

window.onload = () => {
  switchTab("shelf");
};
