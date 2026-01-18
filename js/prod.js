

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('product-list');

  fetch('get_productos_neon.php')
    .then(res => res.json())
    .then(json => {
      if (json.status !== 'ok') {
        console.error('Error status:', json);
        return;
      }

      json.data.forEach(prod => {
        const item = document.createElement('div');
        item.classList.add('item');

       item.innerHTML = `
  <div class="img">
    <img src="${prod.img}" alt="${prod.nombre}">
  </div>
  <div class="content">
    <div class="title">${prod.nombre}</div>
    <div class="des">Código: ${prod.codigo}</div>
    <div class="price" data-price="${prod.precio}">$${Number(prod.precio).toLocaleString('es-CO')}</div>
    <button class="add"
      data-id="${prod.codigo}"
      data-name="${prod.nombre}"
      data-price="${prod.precio}"
      data-img="${prod.img}"
    >Add to cart</button>
  </div>
`;

        list.appendChild(item);
        loadItem();
      });
    })
    .catch(err => {
      console.error('Error al cargar productos:', err);
    });
});

const cart = {}; // key = id producto

const cartToggle = document.querySelector('.cart-toggle');
const cartSidebar = document.getElementById('cartSidebar');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotalEl = document.querySelector('.cart-total');

cartToggle.addEventListener('click', () => {
  cartSidebar.classList.toggle('active');
});

// Delegación de eventos para botones Add
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('add')) {
    const btn = e.target;
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const img = btn.dataset.img;

    addToCart({ id, name, price, img });
  }

  // botones +, -
  if (e.target.classList.contains('btn-plus')) {
    const id = e.target.dataset.id;
    changeQty(id, 1);
  }
  if (e.target.classList.contains('btn-minus')) {
    const id = e.target.dataset.id;
    changeQty(id, -1);
  }
});

function addToCart(product) {
  if (!cart[product.id]) {
    cart[product.id] = {
      ...product,
      qty: 1
    };
  } else {
    cart[product.id].qty += 1;
  }
  renderCart();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) {
    delete cart[id];
  }
  renderCart();
}

function renderCart() {
  cartItemsContainer.innerHTML = '';
  let totalItems = 0;
  let totalPrice = 0;

  Object.values(cart).forEach(item => {
    totalItems += item.qty;
    totalPrice += item.price * item.qty;

    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toLocaleString('es-CO')}</div>
      </div>
      <div class="cart-item-controls">
        <button class="btn-plus" data-id="${item.id}">+</button>
        <div class="cart-item-qty">${item.qty}</div>
        <button class="btn-minus" data-id="${item.id}">-</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartCount.textContent = totalItems;
  cartTotalEl.textContent = '$' + totalPrice.toLocaleString('es-CO');
}




