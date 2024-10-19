document.addEventListener('DOMContentLoaded', function () {
    // Check user login status and update the header accordingly
    updateUserHeader();

    // Function to navigate to Home
    document.getElementById('logo').addEventListener('click', navigateToHome);

    // Attach event listener to search button
    document.getElementById('search-button').addEventListener('click', handleSearch);

    // Attach event listener to user button
    document.getElementById('user-button').addEventListener('click', handleUserButton);

    // Function to navigate to Orders page
    document.getElementById('orders-button').addEventListener('click', navigateToOrders);

    // Function to navigate to Cart page
    document.getElementById('cart-button').addEventListener('click', navigateToCart);

    // Function to navigate to Seller page
    document.getElementById('seller-button').addEventListener('click', navigateToSeller);

    // Function to check user login status and update the header
    function updateUserHeader() {
        const username = localStorage.getItem('username');
        console.log('username');
         // Retrieve username from local storage
        const userNameSpan = document.getElementById('user-name');

        if (username) {
            userNameSpan.textContent = username; // Display username if found
        } else {
            userNameSpan.textContent = 'Login'; // Default to "Login" if no username found
        }
    }

    // Function to handle search
    function handleSearch() {
        const query = document.getElementById('search-input').value;
        if (query) {
            window.location.href = `/search?query=${query}`;
        }
    }

    function Logout() {
        localStorage.removeItem('username');
        window.location.href ='/login.html';
    }

    // Function to handle user button (login/logout)
    // function handleUserButton() {
    //     const username = localStorage.getItem('username');
    //     if (username) {
    //         // If user is logged in, redirect to profile
    //         window.location.href = '/home';
    //     } else {
    //         // If not logged in, redirect to login
    //         window.location.href = '/login';
    //     }
    // }

    // Function to navigate to Orders page
    function navigateToOrders() {
        window.location.href = '/orders';
    }

    // Function to navigate to Cart page
    function navigateToCart() {
        window.location.href = '/home';
    }

    // Function to navigate to Seller page
    function navigateToSeller() {
        window.location.href = '/become-a-seller';
    }
});
