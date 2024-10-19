// Listen for the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded, checking login status...');
    checkLoginStatus();
});

// Check if user is logged in
async function checkLoginStatus() {

    const username = localStorage.getItem('username');
    if(!username){
        window.location.href = '/login.html'
    }
    const orderHistoryContainer = document.getElementById('order-history-div');
   
    

    console.log('Username from localStorage:', username);

    if (!username) {
        // If not logged in, show Not Login message
        showNotLoginContainer(orderHistoryContainer);
    } else {
        // If logged in, fetch order history
         // Load the header first
        await fetchOrderHistory(username, orderHistoryContainer);
    }
}

function Logout() {
    localStorage.removeItem('username');
    window.location.href ='/login.html';
}


// Show Not Login Container
function showNotLoginContainer(container) {
    container.innerHTML = `
        <div class="empty-cart-container d-flex flex-column justify-content-center align-items-center my-5">
            <div class="empty-cart card text-center p-4">
                <img class="cart-img" src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Cart Empty" style="max-width: 150px; height: auto;">
                <div class="card-body">
                    <h5 class="card-title">You have not purchased anything yet !</h5>
                    <p class="card-text">Explore variety of products on Ashapura Electronics</p>
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

// Fetch Order History from server
async function fetchOrderHistory(username, container) {
    try {
        const response = await fetch(`http://localhost:8080/fetchOrders?username=${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('Fetched data:', data); // Log the entire response for debugging

        const orders = data.orders || []; // Default to empty array if no orders

        // Render the order history
        renderOrderHistory(orders, container);
    } catch (error) {
        console.error('Error fetching order history:', error);
    }
}

// Render order history
function renderOrderHistory(orders, container) {

        console.log("Orders",orders);
        

    container.innerHTML = ''; // Clear container first
  
    if (orders.length === 0) {
        showNotLoginContainer(container);
        return;
    }

    orders.forEach(order => {

     

        const date = new Date(order.createdAt);
        order.purchasedDate = date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        const orderItem = document.createElement('div');
        orderItem.classList.add('cart-item-container');
        orderItem.innerHTML = `
            <div class="img-button-container" style="display: flex; flex-direction: column; align-items: center;">
                <img class="cart-image-container" src="${order.url}" alt="${order.title.longTitle}">
            </div>
            <div class="cart-text-container">
                <p>${truncateText(order.title.longTitle, 50)}</p>
                <p style="color: #878787; font-size: 14px;">Seller: RetailNet</p>
                <div class="price-container" style="display: flex; align-items: center;">
                    <p>Purchased for &#8377;${order.price.cost*order.quantity}</p>
                    <p>on ${order.purchasedDate}</p>
                </div>
                  <p> Quantity: ${order.quantity}</p>
            </div>
        `;
        container.appendChild(orderItem);
    });
}

// Helper function to truncate long titles
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
