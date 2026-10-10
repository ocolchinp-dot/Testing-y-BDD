const DEMO_CREDENTIALS = { username: "admin", password: "admin123" };

const initialProducts = [
  { id: "arroz", name: "Arroz Blanco 5 lb", price: 25.00, stock: 10 },
  { id: "aceite", name: "Aceite Vegetal 1L", price: 18.50, stock: 8 },
  { id: "azucar", name: "Azúcar Morena 2 lb", price: 12.75, stock: 15 }
];

const clients = [
  { id: "comercial-esperanza", name: "Comercial La Esperanza" },
  { id: "tienda-pacifico", name: "Tienda El Pacífico" },
  { id: "minisuper-retalhuleu", name: "Minisúper Retalhuleu" }
];

let products = initialProducts.map(product => ({ ...product }));
let salesRegistered = 0;

const $ = (selector) => document.querySelector(selector);

function formatCurrency(amount) {
  return `Q${amount.toFixed(2)}`;
}

function setMessage(element, message, type) {
  element.textContent = message;
  element.className = `form-message ${type}`;
}

function renderClients() {
  const select = $("#client-select");
  clients.forEach(client => {
    const option = document.createElement("option");
    option.value = client.id;
    option.textContent = client.name;
    select.appendChild(option);
  });
}

function renderProducts() {
  const productSelect = $("#product-select");
  const tableBody = $("#products-table-body");
  productSelect.replaceChildren(new Option("Selecciona un producto", ""));
  tableBody.replaceChildren();

  products.forEach(product => {
    const option = new Option(product.name, product.id);
    productSelect.appendChild(option);

    const row = document.createElement("tr");
    row.dataset.productId = product.id;
    row.innerHTML = `
      <td class="product-name">${product.name}</td>
      <td class="product-price">${formatCurrency(product.price)}</td>
      <td class="product-stock stock-value">${product.stock}</td>
    `;
    tableBody.appendChild(row);
  });

  $("#product-count").textContent = products.length;
  $("#unit-count").textContent = products.reduce((total, product) => total + product.stock, 0);
}

function getSelectedProduct() {
  return products.find(product => product.id === $("#product-select").value);
}

function updateTotal() {
  const product = getSelectedProduct();
  const quantity = Number($("#quantity").value);
  const total = product && Number.isFinite(quantity) && quantity > 0 ? product.price * quantity : 0;
  $("#sale-total").textContent = formatCurrency(total);
}

function handleLogin(event) {
  event.preventDefault();
  const username = $("#username").value.trim();
  const password = $("#password").value;
  const message = $("#login-message");

  if (username !== DEMO_CREDENTIALS.username || password !== DEMO_CREDENTIALS.password) {
    setMessage(message, "Usuario o contraseña incorrectos.", "error");
    return;
  }

  $("#login-view").classList.add("is-hidden");
  $("#app-view").classList.remove("is-hidden");
  message.textContent = "";
  $("#username").value = "";
  $("#password").value = "";
}

function handleLogout() {
  $("#app-view").classList.add("is-hidden");
  $("#login-view").classList.remove("is-hidden");
  $("#sale-form").reset();
  $("#sale-total").textContent = "Q0.00";
  $("#sale-message").textContent = "";
}

function handleSale(event) {
  event.preventDefault();
  const clientId = $("#client-select").value;
  const product = getSelectedProduct();
  const quantityValue = $("#quantity").value;
  const quantity = Number(quantityValue);
  const message = $("#sale-message");

  if (!clientId) {
    setMessage(message, "Debes seleccionar un cliente.", "error");
    return;
  }
  if (!product) {
    setMessage(message, "Debes seleccionar un producto.", "error");
    return;
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    setMessage(message, "La cantidad debe ser mayor que 0.", "error");
    return;
  }
  if (quantity > product.stock) {
    setMessage(message, `Stock insuficiente. Disponible: ${product.stock} unidades.`, "error");
    return;
  }

  const total = product.price * quantity;
  product.stock -= quantity;
  salesRegistered += 1;
  renderProducts();
  $("#sales-count").textContent = salesRegistered;
  setMessage(message, `Venta registrada correctamente. Total: ${formatCurrency(total)}.`, "success");
  $("#sale-form").reset();
  $("#sale-total").textContent = "Q0.00";
}

function initializeApp() {
  renderClients();
  renderProducts();
  $("#login-form").addEventListener("submit", handleLogin);
  $("#logout-button").addEventListener("click", handleLogout);
  $("#sale-form").addEventListener("submit", handleSale);
  $("#product-select").addEventListener("change", updateTotal);
  $("#quantity").addEventListener("input", updateTotal);
}

initializeApp();
