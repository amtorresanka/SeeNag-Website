let cart = JSON.parse(localStorage.getItem('shopCart')) || [];

const cartSection= document.getElementById('cartSection');
const emptyState= document.getElementById('emptyState');
const filledState= document.getElementById('filledState');
const container= document.getElementById('cartItemsContainer');
const checkoutForm= document.getElementById('checkoutForm');
const orderFormSection= document.getElementById('orderFormSection');

function renderCheckout() {
    if (cart.length==0) {
    cartSection.classList.add('is-empty');
    emptyState.classList.remove('hidden');
    filledState.classList.add('hidden');
    orderFormSection.classList.add('hidden');
    }
    else {
    cartSection.classList.remove('is-empty');
    emptyState.classList.add('hidden');
    filledState.classList.remove('hidden');
    orderFormSection.classList.remove('hidden');
    }
    container.innerHTML = ' ';
    let total = 0;

const totalText = document.getElementById('totalText');

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        container.innerHTML += `
            <div class="cart-item">
                ${item.image 
                    ? `<img src="${item.image}" alt="${item.name}" class="item-img">` 
                    : `<div class="item-img-placeholder"></div>`
                }
                <div class="item-details">
                    <div class="item-header">
                        <h3>${item.name}</h3>
                        <button type="button" class="delete-btn" onclick="removeItem(${index})">Delete</button>
                    </div>
                    <p class="item-price">₱ ${item.price.toFixed(2)}</p>
                
                    <div class="control-row">
                        <span class="control-label">Quantity</span>
                        <div class="quantity-control">
                            <button type="button" class="qty-btn" onclick="changeQuantity(${index}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                            <span class="qty-value">${item.quantity}</span>
                            <button type="button" class="qty-btn" onclick="changeQuantity(${index}, 1)" ${item.quantity >= 50 ? 'disabled' : ''}>+</button>
                        </div>
                    </div>

                    <div class="control-row">
                        <span class="control-label">Size</span>
                        <select onchange="updateSize(${index}, this.value)">
                            ${['XS', 'S', 'M', 'L', 'XL'].map(s => 
                                `<option value="${s}" ${item.size === s ? 'selected' : ''}>${s}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
            </div>
        `;
    });

    totalText.textContent = `₱ ${total.toFixed(2)}`;
}
// Unchecks payment selection for Gcash and Paypal
document.querySelectorAll('input[type="radio"][name="payment"]').forEach(radio => {
    radio.addEventListener('click', function () {
        if (this.dataset.wasChecked === 'true') {
            this.checked = false;
            this.dataset.wasChecked = 'false';
        } else {
            document.querySelectorAll('input[type="radio"][name="payment"]').forEach(r => {
                r.dataset.wasChecked = 'false';
            });
            this.dataset.wasChecked = 'true';
        }
    });
});

function changeQuantity(index, delta) {
    const newQty = cart[index].quantity + delta;
    if (newQty >= 1 && newQty <= 50) {
        cart[index].quantity = newQty;
        localStorage.setItem('shopCart', JSON.stringify(cart));
        renderCheckout();
    }
}

function updateSize(index, newSize) {
    cart[index].size = newSize;
    localStorage.setItem('shopCart', JSON.stringify(cart));
    renderCheckout();
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('shopCart', JSON.stringify(cart));
    renderCheckout();
}

document.querySelectorAll('.numeric-only').forEach(input => {
    input.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '');
    });
});
// by clicking "back" button, the page will return to the previous page.
const backBtn = document.getElementById('BackBtn');
backBtn.addEventListener('click', function(e) {
  e.preventDefault();
  
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = 'index.html';
  }
});

const expiryInput = document.querySelector('.expiry-input');
if (expiryInput) {
    expiryInput.addEventListener('input', function () {
        let digits = this.value.replace(/\D/g, '').substring(0, 4);
        this.value = digits.length >= 3 
            ? `${digits.slice(0, 2)} / ${digits.slice(2)}` 
            : digits;
    });
}

if (checkoutForm) {
    checkoutForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Order submitted! Thank you for your purchase.');
        localStorage.removeItem('shopCart');
        cart = [];
        checkoutForm.reset();
        renderCheckout();
    });
// Handle order submission and open pre-filled email client
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const storeEmail = 'hello@examplewebsite142.com';

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const street = document.getElementById('streetAddress').value.trim();
        const apt = document.getElementById('addedAddress').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('stateProvince').value.trim();
        const postal = document.getElementById('postalCode').value.trim();
        const country = document.getElementById('country').value.trim();
        const notes = document.getElementById('specialInstructions').value.trim();

        const selectedRadio = document.querySelector('input[name="payment"]:checked');
        const paymentMethod = selectedRadio 
            ? selectedRadio.value.toUpperCase() 
            : (document.getElementById('cardNumber').value.trim() ? 'Credit / Debit Card' : 'Not specified');

        // Format ordered items from the cart
        let grandTotal = 0;
        const itemLines = cart.map((item, i) => {
            const subtotal = item.price * item.quantity;
            grandTotal += subtotal;
            return `${i + 1}. ${item.name} | Size: ${item.size} | Qty: ${item.quantity} | Price: PHP ${item.price.toFixed(2)} (Subtotal: PHP ${subtotal.toFixed(2)})`;
        }).join('\n');

        // Build email subject and body
        const subject = `New T-Shirt Order from ${firstName} ${lastName}`;
        const body = [
            ``,
            `--- ORDER DETAILS ---`,
            itemLines,
            ``,
            `Total Amount: PHP ${grandTotal.toFixed(2)}`,
            `Payment Method: ${paymentMethod}`,
            ``,
            `--- CUSTOMER & SHIPPING INFO ---`,
            `Name: ${firstName} ${lastName}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            `Address: ${street}${apt ? ', ' + apt : ''}, ${city}, ${state} ${postal}, ${country}`,
            notes ? `Special Instructions: ${notes}` : ''
        ].filter(line => line !== null).join('\n');

        const mailtoLink = `mailto:${hello@examplewebsite142.com}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;

        // Clear cart and reset form after email was sent
        localStorage.removeItem('shopCart');
        cart = [];
        checkoutForm.reset();
        renderCheckout();
    });
}

renderCheckout();
