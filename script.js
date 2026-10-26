const menuToggle = document.querySelector('#menu-toggle');
const menuLinks = document.querySelector('#menu-links');
const cartPanel = document.querySelector('#cart-panel');
const overlay = document.querySelector('#overlay');
const cartItems = document.querySelector('#cart-items');
const cartCount = document.querySelector('#cart-count');
const cartTotal = document.querySelector('#cart-total');
const toast = document.querySelector('#toast');
const cart = new Map();
let toastTimer;

document.querySelector('#year').textContent = new Date().getFullYear();

function closeMenu() {
  menuLinks.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}

menuToggle.addEventListener('click', () => {
  const open = menuLinks.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
menuLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function renderCart() {
  const entries = [...cart.values()];
  const count = entries.reduce((sum, item) => sum + item.quantity, 0);
  const total = entries.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = count;
  cartTotal.textContent = `$${total.toFixed(2)}`;
  if (!entries.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your bag is empty. Find your favourite in the menu.</p>';
    return;
  }
  cartItems.innerHTML = entries.map(item => `
    <div class="cart-row">
      <strong>${item.name}</strong><span class="row-price">$${(item.price * item.quantity).toFixed(2)}</span>
      <div class="quantity-controls"><button data-action="minus" data-name="${item.name}" aria-label="Remove one ${item.name}">−</button><span>${item.quantity}</span><button data-action="plus" data-name="${item.name}" aria-label="Add one ${item.name}">+</button></div>
    </div>`).join('');
}

document.querySelectorAll('.add-button').forEach(button => {
  button.addEventListener('click', () => {
    const { name, price } = button.dataset;
    const item = cart.get(name) || { name, price: Number(price), quantity: 0 };
    item.quantity += 1;
    cart.set(name, item);
    renderCart();
    showToast(`${name} added to your bag`);
  });
});

cartItems.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const item = cart.get(button.dataset.name);
  if (!item) return;
  item.quantity += button.dataset.action === 'plus' ? 1 : -1;
  if (item.quantity <= 0) cart.delete(item.name);
  renderCart();
});

function openCart() {
  closeMenu();
  cartPanel.classList.add('is-open');
  cartPanel.setAttribute('aria-hidden', 'false');
  overlay.hidden = false;
  document.body.classList.add('cart-open');
  document.querySelector('#close-cart').focus();
}
function closeCart() {
  cartPanel.classList.remove('is-open');
  cartPanel.setAttribute('aria-hidden', 'true');
  overlay.hidden = true;
  document.body.classList.remove('cart-open');
  document.querySelector('#open-cart').focus();
}
document.querySelector('#open-cart').addEventListener('click', openCart);
document.querySelector('#close-cart').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (cartPanel.classList.contains('is-open')) closeCart();
    closeMenu();
  }
});

renderCart();
