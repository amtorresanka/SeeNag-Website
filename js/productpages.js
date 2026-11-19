// ============================================================
//  Seenag — shared product page scripts
//  Works on every product page: the ORDER button carries the
//  product's name, price and image in data-* attributes.
// ============================================================

const MAX_QTY = 50; // matches the limit on the checkout page

// Swap the main image when a thumbnail is clicked (instant)
function swapImage(thumb) {
  const main = document.getElementById('mainImage');
  main.src = thumb.src;
  main.alt = thumb.alt;

  // move the highlight to the clicked thumbnail (this fades via .thumb transition)
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active-thumb'));
  thumb.classList.add('active-thumb');
}

// Change the quantity with the + and - buttons, and update the summary
function changeQty(amount) {
  const qty = document.getElementById('qty');
  let current = parseInt(qty.value) || 0;
  current = current + amount;
  if (current < 0) current = 0;
  if (current > MAX_QTY) current = MAX_QTY;
  qty.value = current;
  document.getElementById('selectedQty').textContent = current;
}

// Add the selected tee to the cart, then go to checkout
function addToCart() {
  const btn = document.getElementById('orderBtn');
  const sizeInput = document.querySelector('input[name="size"]:checked');
  const qty = parseInt(document.getElementById('qty').value) || 0;

  if (!sizeInput) {
    alert('Please choose a size.');
    return;
  }
  if (qty < 1) {
    alert('Please set a quantity of at least 1.');
    return;
  }

  const newItem = {
    name: btn.dataset.name,
    price: parseFloat(btn.dataset.price),
    image: btn.dataset.image,
    size: sizeInput.value,
    quantity: qty
  };

  // 'shopCart' is the same key checkout.js reads
  let cart = JSON.parse(localStorage.getItem('shopCart')) || [];

  // If the same tee in the same size is already in the cart, add to it instead of duplicating
  const existing = cart.find(item => item.name === newItem.name && item.size === newItem.size);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + newItem.quantity, MAX_QTY);
  } else {
    cart.push(newItem);
  }

  localStorage.setItem('shopCart', JSON.stringify(cart));
  window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', function () {
  // Update the "Size | —" summary when a size is picked
  document.querySelectorAll('input[name="size"]').forEach(function (sizeInput) {
    sizeInput.addEventListener('change', function () {
      document.getElementById('selectedSize').textContent = this.value;
    });
  });

  // Keep the summary in sync if the quantity is typed in directly
  const qtyInput = document.getElementById('qty');
  qtyInput.addEventListener('input', function () {
    let value = parseInt(this.value.replace(/\D/g, '')) || 0;
    if (value > MAX_QTY) value = MAX_QTY;
    this.value = value;
    document.getElementById('selectedQty').textContent = value;
  });

  // ORDER button
  const orderBtn = document.getElementById('orderBtn');
  if (orderBtn) orderBtn.addEventListener('click', addToCart);
});