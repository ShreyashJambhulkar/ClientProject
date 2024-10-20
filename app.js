    
    // app.js

    document.addEventListener('DOMContentLoaded', async () => {
      await  loadHeader();
        const detailsContainer = document.getElementById('details-container');
        const urlParams = new URLSearchParams(window.location.search);
       const id = urlParams.get("id");
        // Assuming the product ID is passed as a query parameter

    

        fetchProductDetails(id);
    });

    async function loadHeader() {
        try {
            const response = await fetch('/header.html'); // Adjust the path if necessary
            if (!response.ok) {
                throw new Error('Failed to load header');
            }
            const headerHTML = await response.text();
            // Assuming your header is meant to be part of the body, replace 'body' with the appropriate tag
            document.body.insertAdjacentHTML('afterbegin', headerHTML); // Inserts header at the beginning of body
            handleUserButton(); // Update the user button after loading the header
        } catch (error) {
            console.error('Error loading header:', error);
        }
    }

    function fetchProductDetails(id) {
        fetch('http://localhost:8080/productDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: id}),
        })
        .then(response => response.json({id: id}))
        .then(data => {
            if (data.productDetails) {
                renderProductDetails(data.productDetails);
            } else {
                document.getElementById('details-container').innerHTML = '<p>Product not found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            document.getElementById('details-container').innerHTML = '<p>Error loading product details.</p>';
        });
    }

    function renderProductDetails(product) {
        const detailsContainer = document.getElementById('details-container');

        // Create the grid container
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid-container';

        // Left Container
        const leftContainer = document.createElement('div');
        leftContainer.className = 'left-container';
        leftContainer.innerHTML = `
            <img src="${product.detailUrl}" alt="${product.title.shortTitle}" />
            <div class="button-group">
                <button class="add-to-cart">
                    <span class="material-icons">shopping_cart</span> Add to Cart
                </button>
                <button class="buy-now">
                    <span class="material-icons">flash_on</span> Buy Now
                </button>
            </div>
        `;

        // Right Container
        const rightContainer = document.createElement('div');
        rightContainer.className = 'right-container';
        rightContainer.innerHTML = `
            <p style="font-size: 18px; font-weight: 405; color: #212121;">${product.title.longTitle}</p>
            <div style="color: #878787; display: flex; align-items: center; gap: 10px;">
                <p>59,167 Ratings & 6,869 Reviews</p>
            </div>
            <div class="price-section">
                <p class="cost">&#8377; ${product.price.cost}</p>
                <s>&#8377; ${product.price.mrp}</s>
                <p class="discount">${product.price.discount} off</p>
            </div>
            <div class="offers">
                <p><span class="material-icons">local_offer</span> Available Offers</p>
                <p><span class="material-icons">local_offer</span> Get extra 20% off up to ₹50 on 1 item(s) <a href="#">T&C</a></p>
                <p><span class="material-icons">local_offer</span> Get extra 13% off (price inclusive of discount) <a href="#">T&C</a></p>
                <p><span class="material-icons">local_offer</span> Buy 2 items save 5%; Buy 3 or more save 10% <a href="#">T&C</a></p>
                <p><span class="material-icons">local_offer</span> 5% Cashback on Your Bank Card</p>
                <p><span class="material-icons">local_offer</span> No Cost EMI on selected credit cards for orders above ₹2999 <a href="#">T&C</a></p>
            </div>
            <table class="table">
                <tr>
                    <td class="label">Delivery</td>
                    <td class="value">Delivery by ${getDeliveryDate()} | &#8377; 40</td>
                </tr>
                <tr>
                    <td class="label">Warranty</td>
                    <td class="value">No Warranty</td>
                </tr>
                <tr>
                    <td class="label">Seller</td>
                    <td class="value">
                        <span style="color: #2876f0;">SuperComNet</span><br />
                        <span>GST Invoice available</span><br />
                        <span>View More Sellers Starting from &#8377;${product.price.cost}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Description</td>
                    <td class="value">${product.description}</td>
                </tr>
            </table>
        `;

        gridContainer.appendChild(leftContainer);
        gridContainer.appendChild(rightContainer);
        detailsContainer.appendChild(gridContainer);

        // Event Listeners
        document.querySelector('.add-to-cart').addEventListener('click', () => addItemToCart(product.id, 1));
        document.querySelector('.buy-now').addEventListener('click', () => buyProduct(product));
    }

    function getDeliveryDate() {
        const date = new Date();
        date.setDate(date.getDate() + 5); // Assuming delivery in 5 days
        return date.toDateString();
    }

    function addItemToCart(id, quantity) {
        // Retrieve existing cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if the item is already in the cart
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id, quantity });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Item added to cart!');
        // Redirect to cart page
        window.location.href = '/cart.html'; // Change this to your cart page URL
    }

    function buyProduct(product) {
        const userName = localStorage.getItem("userName");
        if (!userName) {
            // Redirect to login page
            window.location.href = '/login.html'; // Change this to your login page URL
            return;
        }

        // Create order
        fetch('http://localhost:8080/buyProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userName,
                product: product,
            }),
        })
        .then(response => response.json())
        .then(async data => {
            if (data.order) {
                const order = data.order;
                const keyResponse = await fetch('http://localhost:8080/getKey');
                const keyData = await keyResponse.json();
                const key = keyData.key;

                const options = {
                    key: key,
                    amount: order.amount,
                    currency: "INR",
                    name: "Your Company Name",
                    description: "Transaction Description",
                    order_id: order.id,
                    handler: function (response) {
                        verifyPayment(response, product, userName);
                    },
                    prefill: {
                        name: "Customer Name",
                        email: "customer@example.com",
                        contact: "9000090000"
                    },
                    notes: {
                        address: "Customer Address"
                    },
                    theme: {
                        color: "#3399cc"
                    }
                };

                const rzp = new Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    alert("Payment failed, please try again.");
                });
                rzp.open();
            } else {
                alert('Order creation failed.');
            }
        })
        .catch(error => {
            console.error('Error during buyProduct:', error);
            alert('An error occurred. Please try again.');
        });
    }

    function verifyPayment(response, product, userName) {
        fetch('http://localhost:8080/paymentVerification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                product: product,
                userName: userName,
            }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Payment successful!');
                window.location.href = '/orders.html'; // Change this to your orders page URL
            } else {
                alert('Payment verification failed.');
            }
        })
        .catch(error => {
            console.error('Error during payment verification:', error);
            alert('An error occurred during payment verification.');
        });
    }
