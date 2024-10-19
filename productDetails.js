const userName = localStorage.getItem("userName");
const id = new URLSearchParams(window.location.search).get("id");
let product;

// Load the header when the page is initialized
document.addEventListener('DOMContentLoaded', async () => {
    await initializePage();
});

async function initializePage() {
    // Load header dynamically
   

    const username = localStorage.getItem("username");
    if (!username) {
        // If no username is found in localStorage, redirect to the login page
        window.location.href = "login.html";
        return; // Prevent further execution if not logged in
    }

    fetchProductDetails(id);
}

async function fetchProductDetails(productId) {
    try {
        const response = await axios.post("http://localhost:8080/productDetails", { id: productId });
        product = response.data.productDetails;
        renderProductDetails();
    } catch (error) {
        console.error("Error fetching product details:", error);
        document.getElementById('details-content').innerHTML = '<p>Error loading product details.</p>';
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


// Toggle User Menu (Login/Logout)


function Logout(){
    localStorage.removeItem('username');
    window.location.href='/login.html'
}

function handleUserButton() {
    const userButton = document.getElementById('userButton');
    if (userName) {
        userButton.innerHTML = `<a class="nav-link" href="/home.html">${userName}</a>`;
    } else {
        userButton.innerHTML = `<a class="nav-link" href="/login.html">Login</a>`;
    }
}

function renderProductDetails() {
    const detailsContent = document.getElementById('details-content');

    const date = new Date();
    const deliveryDate = new Date(date);
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    detailsContent.innerHTML = `
       <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-12 left-container text-center">
                <img src="${product.detailUrl}" alt="${product.title.shortTitle}" class="img-fluid" />
                <br /><br />

                <div class="button-container d-flex justify-content-center">
                    <button class="btn btn-light me-2" onclick="addItemToCart()">
                        <span class="material-icons">shopping_cart</span> Add to Cart
                    </button>
                    <button class="btn btn-primary buy-now-button" onclick="buyProduct(this)">
                        <span class="material-icons">flash_on</span> Buy Now
                    </button>
                </div>
            </div>

            <div class="col-lg-8 col-md-8 col-sm-12 right-container">
                <h4>${product.title.longTitle}</h4>
                <div class="rating">
                    <p>59,167 Ratings & 6,869 Reviews</p>
                </div>
                <div class="price-section">
                    <p class="h4">&#8377; ${product.price.cost}</p>
                    <s>&#8377; ${product.price.mrp}</s>
                    <p class="text-success">${product.price.discount} off</p>
                </div>
                <div class="offers">
                    <p><span class="material-icons" style="color: #14BE47;">local_offer</span> Available Offers</p>
                    <p><span class="material-icons" style="color: #14BE47;">local_offer</span> Get extra 20% off up to ₹50 on 1 item(s) <a href="#">T&C</a></p>
                    <p><span class="material-icons" style="color: #14BE47;">local_offer</span> Get extra 13% off <a href="#">T&C</a></p>
                    <p><span class="material-icons" style="color: #14BE47;">local_offer</span> Buy 2 items save 5%; Buy 3 or more save 10% <a href="#">T&C</a></p>
                    <p><span class="material-icons" style="color: #14BE47;">local_offer</span> 5% Cashback on Your Bank Card</p>
                    <p><span class="material-icons" style="color: #14BE47;">local_offer</span> No Cost EMI on orders above ₹2999 <a href="#">T&C</a></p>
                </div>
                <table class="table">
                    <tbody>
                        <tr>
                            <td>Delivery</td>
                            <td>Delivery by ${deliveryDate.toDateString()} | &#8377; 40</td>
                        </tr>
                        <tr>
                            <td>Warranty</td>
                            <td>No Warranty</td>
                        </tr>
                        <tr>
                            <td>Seller</td>
                            <td>
                                <span style="color: #2876f0;">SuperComNet</span><br />
                                <span>GST Invoice available</span><br />
                                <span>View More Sellers Starting from &#8377;${product.price.cost}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Description</td>
                            <td>${product.description}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function showToast(message) {
    const toastHTML = `
        <div class="toast" role="alert" aria-live="polite" aria-atomic="true" style="position: fixed; bottom: 20px; right: 20px;">
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', toastHTML);
    const toastEl = document.querySelector('.toast');
    $(toastEl).toast({ delay: 3000 });
    $(toastEl).toast('show');
    setTimeout(() => {
        toastEl.remove();
    }, 3000);
}

// Add item to cart
async function addItemToCart() {
    // Get the username from local storage
    const userName =  localStorage.getItem('username');
       console.log(userName);
       
        try {
            const config = {
                headers: {
                    "content-type": "application/json",
                }
            };
            console.log(product);
            const url = product.url;
            const description = product.description
             
            const orderData = {
                url : url,
                description: description,
                username: userName,
              
                title : product.title,
                price : product.price,

            };

            const { data } = await axios.post("http://localhost:8080/addToCart", orderData, config);
            console.log(data.message);
            window.location.href="/cart.html"
            // Assuming the rest of the Razorpay integration is not needed
            // console.log("Product bought successfully:", order);
            // window.location.href = "order-history.html";
        } catch (e) {
            console.log(e);
            alert("An error occurred while processing your order.");
        }
}

// Buy product function
async function buyProduct() {
   // Redirect to login if not authenticated
       const userName =  localStorage.getItem('username');
       console.log(userName);
       
        try {
            const config = {
                headers: {
                    "content-type": "application/json",
                }
            };
            console.log(product);
            const url = product.url;
            const description = product.description
             
            const orderData = {
                url : url,
                description: description,
                username: userName,
              
                title : product.title,
                price : product.price,

            };

            const { data } = await axios.post("http://localhost:8080/purchaseProduct", orderData, config);
            console.log(data.message);
            window.location.href = "order-history.html";
            // Assuming the rest of the Razorpay integration is not needed
            // console.log("Product bought successfully:", order);
            // window.location.href = "order-history.html";
        } catch (e) {
            console.log(e);
            alert("An error occurred while processing your order.");
            showToast("Error While Placing Your Order")
        }
    }

