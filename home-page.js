document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

async function initializePage() {
    // Load header dynamically

    const username = localStorage.getItem("username");
    if (!username) {
        // If no username is found in localStorage, redirect to the login page
        window.location.href = "login.html";
        return; // Prevent further execution if not logged in
    }

    const query = getSearchParams();
    await renderCategories();
    await renderProducts(query);
    updateCartCount();
}
function getSearchParams() {
    const params = new URLSearchParams(window.location.search);
    return params.get("query"); // Example: ?query=product_name
}

// Function to Load Header


// Navigation Functions
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
    console.log(query);
    
    window.location.href = "/home.html?query="+query
}

document.getElementById("search-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission or page reload
        handleSearch(); // Trigger search functionality
    }
});

// User Authentication: Update User Button Based on Login Status
function Logout() {
    localStorage.removeItem('username');
    window.location.href ='/login.html';
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

// Categories Data
const categories = [
    { img: "https://www.pngall.com/wp-content/uploads/10/Geyser-PNG-Image-File.png", type: "Geyser" },
    { img: "https://png.pngtree.com/png-vector/20221017/ourmid/pngtree-realistic-led-lamps-light-bulb-png-image_6310024.png", type: "Led Lighting" },
    { img: "https://purepng.com/public/uploads/large/purepng.com-iron-boxelectronicsiron-box-941524670568wq1py.png", type: "Iron Box" },
    { img: "https://png.pngtree.com/png-vector/20240403/ourmid/pngtree-washing-machine-isolated-on-transparent-background-png-image_12260985.png", type: "Washing Machine" },
    { img: "https://img.freepik.com/premium-vector/realistic-electric-kettle-made-metal-isolated-3d-vector-illustration-white-background_545793-100.jpg?w=360", type: "Electric Kettle" },
    { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm7N5BdEXSuXOPauJqginmc0kJ_XZMamYfWA&s", type: "Air Conditioning" },
    { img: "https://media.croma.com/image/upload/v1691679764/Croma%20Assets/Small%20Appliances/Steamers%20Cookers/Images/211140_0_vcoytt.png", type: "Electric Cooker" },
    { img: "https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-led-tv-television-screen-vector-png-image_6673700.png", type: "Television" },
    { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzMliKsWcyqdzbKjIh83yiuColOK6t4ICXcA&s", type: "Microwave" },
    { img: "https://atlas-content-cdn.pixelsquid.com/stock-images/dvd-player-MxGZev7-600.jpg", type: "DVD Player" },
    { img: "https://i.pinimg.com/originals/ca/fb/90/cafb9062f27390676aa00d68f7dd1104.png", type: "Desktop" },
    { img: "https://image.similarpng.com/very-thumbnail/2020/06/Laptop-computer-with-apps-icons-interface-on-transparent-background-PNG.png", type: "Laptop" },
];

// Function to Render Categories
async function renderCategories() {
    const categoriesContainer = document.getElementById("categories-container");

    categories.forEach(category => {
        const categoryCard = document.createElement("div");
        categoryCard.classList.add("category-card");
        categoryCard.innerHTML = `
            <img src="${category.img}" alt="${category.type}">
            <p>${category.type}</p>
        `;
        categoriesContainer.appendChild(categoryCard);
    });
}

// Function to Fetch and Render Products
async function renderProducts(query) {

    if(!query)query="all";

    try {
        console.log("fetching products");
        const response = await fetch(`http://localhost:8080/fetchProducts?query=${query}`, { // Replace with your actual API endpoint
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (data && data.products && data.products.length > 0) {
            const products = data.products;
            const carousel = document.getElementById("product-carousel");

            products.forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");
                productCard.innerHTML = `
                    <a href="productDetails.html?id=${product.id}" style="text-decoration: none; color: black;">
                        <img src="${product.url}" alt="${product.title.longTitle}">
                        <p class="product-title">${product.title.longTitle}</p>
                        <p class="product-discount">${product.discount}</p>
                        <p class="product-tagline">${product.tagline}</p>
                    </a>
                `;
                carousel.appendChild(productCard);
            });
        } else {
            const carousel = document.getElementById("product-carousel");
            carousel.innerHTML = '<p>No products available.</p>';
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        const carousel = document.getElementById("product-carousel");
        carousel.innerHTML = '<p>Error loading products.</p>';
    }
}

// Function to Update Cart Count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Attach Event Listener to User Button for Toggle Functionality
document.getElementById("user-button").addEventListener("click", toggleUserMenu);
