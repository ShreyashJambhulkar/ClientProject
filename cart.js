// Listen for the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded, checking login status...');
    checkLoginStatus();
});

// Check if user is logged in and fetch cart if they are
async function checkLoginStatus() {
    const username = localStorage.getItem('username');
    const cartContainer = document.getElementById('cart-items');

    console.log('Username from localStorage:', username);

    if (!username) {
        // If not logged in, show empty cart message
        window.location.href = '/login.html';
        showEmptyCart(cartContainer);
    } else {
        // If logged in, fetch cart items
        await fetchCart(username, cartContainer);
    }
}

function navigateToHome() {
    window.location.href = "home.html"; // Adjust the path as needed
}

function navigateToOrders() {
    window.location.href = "order-history.html"; // Adjust the path as needed
}

function navigateToCart() {
    window.location.href = "cart.html"; // Adjust the path as needed
}

function navigateToSeller() {
    window.location.href = "become-seller.html"; // Adjust the path as needed
}

function navigateToAllProducts() {
    window.location.href = "all-products.html"; // Adjust the path as needed
}

function navigateToLogin() {
    window.location.href = "login.html"; // Adjust the path as needed
}

// Search Functionality
function handleSearch() {
    const query = document.getElementById('search-input').value;
    if (query.trim() !== "") {
        // Redirect to a search results page or implement search functionality
        alert(`Search functionality not implemented. You searched for: ${query}`);
    }
}

// User Authentication: Update User Button Based on Login Status
function handleUserButton() {
    const firstName = localStorage.getItem("username"); // Assuming firstName is stored in localStorage
    const userNameSpan = document.getElementById("user-name");

    if (firstName) {
        userNameSpan.textContent = firstName; // Display the firstName if found
    } else {
        userNameSpan.textContent = "Login"; // Default to "Login" if not logged in
    }
}

// Toggle User Menu (Login/Logout)
function toggleUserMenu() {
    const firstName = localStorage.getItem("username");
    if (firstName) {
        // Logout Functionality
        localStorage.removeItem("username");
        handleUserButton(); // Update UI
        updateCartCount();
        navigateToHome();
    } else {
        // Navigate to Login Page
        navigateToLogin();
    }
}

// Show Empty Cart Message
function showEmptyCart(container) {
    container.innerHTML = `
        <div class="empty-cart-container d-flex flex-column justify-content-center align-items-center my-5">
            <div class="empty-cart card text-center p-4">
                <img class="cart-img" src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Cart Empty" style="max-width: 150px; height: auto;">
                <div class="card-body">
                    <h5 class="card-title">Your cart is empty!</h5>
                    <p class="card-text">Looks like you haven't added anything to your cart yet.</p>
                    <div class="place-order-container">
                        <button class="btn btn-primary" onclick="redirectToHome()">Start Shopping</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Redirect to home page
function redirectToHome() {
    window.location.href = '/home.html'; // Adjust the home page path as needed
}

// Fetch Cart from server
async function fetchCart(username, container) {
    try {
        const response = await fetch(`http://localhost:8080/fetchCart?username=${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('Fetched data:', data); // Log the entire response for debugging

        const orders = data.message || []; // Default to empty array if no items in cart

        // Render the cart items or show empty cart message
        if (orders.length === 0) {
            showEmptyCart(container);
        } else {
            renderCartItems(orders, container);
            renderOrderSummary(orders);
            setupCheckoutButton(username); // Setup the checkout button after loading the cart
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}

// Remove cart item
async function removeCartItem(id) {
    console.log('called',id);
    
    try {
        const response = await axios.post('http://localhost:8080/delteItemFromCart', {
            id: id
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Remove response:', response.data);

        if (response.status === 200) {
            // Refresh the page after successful removal
            location.reload();
        } else {
            console.log(response.data.message);
            
            alert(response.data.message || 'Failed to remove item');
        }
    } catch (error) {
        console.log('Error removing item:', error);
        alert('An error occurred while removing the item.');
    }
}

// Setup Checkout Button
function setupCheckoutButton(username) {
    const checkoutButton = document.querySelector('.checkout-btn');
    checkoutButton.addEventListener('click', () => proceedToCheckout(username));
}

// Proceed to Checkout
async function proceedToCheckout(username) {
    try {
        const response = await fetch('http://localhost:8080/buyCartItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();
        console.log('Checkout response:', data); // Log the response for debugging

        if (response.ok) {
            alert(data.message); // Show success message
            redirectToHome(); // Redirect to home after purchase
        } else {
            alert(data.message || 'Failed to proceed to checkout');
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('An error occurred during checkout.');
    }
}

// Render cart items
function renderCartItems(orders, container) {
    container.innerHTML = ''; // Clear container first

    orders.forEach(order => {
        const date = new Date(order.createdAt);
        order.addedDate = date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="img-button-container" style="display: flex; flex-direction: column; align-items: center;">
                <img class="cart-image-container" src="${order.url}" alt="${order.title.longTitle}">
            </div>
            <div class="cart-text-container" style="position: relative; flex-grow: 1;">
                <p>${truncateText(order.title.longTitle, 50)}</p>
                <p style="color: #878787; font-size: 14px;">Seller: RetailNet</p>
                <div class="price-container">
                    <p>Price: &#8377;${order.price.cost}</p>
                    <p class="order-date">Added on ${order.addedDate}</p>
                </div>
                <!-- Quantity control and Remove button container aligned at bottom-right -->
                <div class="quantity-control" style="display: flex; align-items: center; position: absolute; bottom: 0; right: 0; padding: 10px;">
                    <button class="btn btn-secondary decrement-btn" data-id="${order._id}">-</button>
                    <input type="number" class="quantity-input" data-id="${order._id}" value="${order.quantity || 1}" min="1" style="width: 40px; text-align: center; margin: 0 5px;">
                    <button class="btn btn-secondary increment-btn" data-id="${order._id}">+</button>
                    <button class="btn btn-danger remove-btn" data-id="${order._id}" style="margin-left: 10px;">Remove</button>
                </div>
            </div>
        `;
        container.appendChild(cartItem);

        // Add event listeners for quantity buttons and remove button
        const decrementBtn = cartItem.querySelector('.decrement-btn');
        const incrementBtn = cartItem.querySelector('.increment-btn');
        const quantityInput = cartItem.querySelector('.quantity-input');
        const removeBtn = cartItem.querySelector('.remove-btn');

        decrementBtn.addEventListener('click', () => {
            const currentQuantity = parseInt(quantityInput.value);
            if (currentQuantity > 1) {
                quantityInput.value = currentQuantity - 1; // Decrement quantity
                updateQuantity(order._id, quantityInput.value); // Update on server
            }
        });

        incrementBtn.addEventListener('click', () => {
            const currentQuantity = parseInt(quantityInput.value);
            quantityInput.value = currentQuantity + 1;
            const qty = quantityInput.value;
            updateQuantity(order._id, qty); // Update on server
        });

        removeBtn.addEventListener('click', () => removeCartItem(order._id)); // Pass only order ID
    });
}

async function updateQuantity(_id, qty) {
    console.log('Updating quantity:', _id, 'to', qty);

    try {
        const response = await axios.post('http://localhost:8080/modifyQty', {
            _id: _id,
            qty: qty
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        location.reload();
        console.log('Update response:', response.data); // Log the response for debugging

        // If the request is successful, you can handle success here if needed
        // For example, you could refresh the cart or show a message
    } catch (error) {
        console.error('Error updating quantity:', error);
        // Show an alert if there's an error
        window.alert('An error occurred while updating the quantity: ' + (error.response?.data?.message || error.message));
    }
}



// Render order summary
function renderOrderSummary(orders) {
    const summaryContainer = document.getElementById('summary-details');
    const orderSummaryContainer = document.getElementById('order-summary'); // Reference to the summary section
    let totalCost = 0;
    let totalMrp = 0;

    // Calculate total cost and MRP
    orders.forEach(order => {
        totalCost += order.price.cost*order.quantity;
        totalMrp += order.price.mrp*order.quantity;
    });

    // Check if there are orders to summarize
    if (orders.length > 0) {
        summaryContainer.innerHTML = `
            <p>Total MRP: ₹${totalMrp}</p>
            <p>Discounted Price: ₹${totalCost}</p>
            <p>Total Discount: ₹${totalMrp - totalCost}</p>
            <p class="summary-total">Final Total: ₹${totalCost}</p>
        `;
        orderSummaryContainer.style.display = 'block'; // Show the order summary section
    } else {
        orderSummaryContainer.style.display = 'none'; // Hide the order summary section if no orders
    }
}

// Helper function to truncate long titles
function truncateText(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
}
