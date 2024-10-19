const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other services like Outlook, Yahoo, etc.
  auth: {
        user: 'ashapuraelectronics2024@gmail.com',
        pass: 'gpll onts itau rvsa',// Your email password (consider using environment variables)
  }
});
// controllers-------------------
const fetchProducts = require("../controllers/fetchProducts");
const signUp = require("../controllers/signUp");
const logIn = require("../controllers/logInUser");
const fetchProductDetails = require("../controllers/fetchProductDetails");
const orders = require("../controllers/orders");
const purchasedModel = require("../models/product-purchased-model");
const CartModel = require("../models/cartModel");
const User = require("../models/signupModel");
// -----------------------------

router.get("/fetchProducts", fetchProducts)
router.post("/signup", signUp)
router.post("/login", logIn)
router.post("/productDetails", fetchProductDetails)
router.post("/orderHistory", orders)

// purchased product routes
router.post('/purchaseProduct', async (req, res) => {
    try {
        const { username, url, description, price, title } = req.body;
        console.log(price);
        
        // Logging the username for debugging purposes
        console.log(`Username: ${username}`);

        // Create a new order using the purchasedModel
        const order = new purchasedModel({
            username,
            url,
            description,
            price,
            title
        });

        // Save the order to the database
        await order.save();

        const user = await User.findOne({userName:username});
        
        


        const mailOptions = {
          from: 'ashapuraelectronics2024@gmail.com', // Sender address
          to: user.email, // Recipient's email address (assuming username is an email)
          subject: 'Order Confirmation - Ashapura Electronics',
          html: `
              <h1 style="color: #4CAF50;">Thank You for Your Purchase!</h1>
              <p>Dear Customer,</p>
              <p>We are thrilled to confirm your order at Ashapura Electronics. Here are the details:</p>
              <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                      <tr>
                          <th style="border: 1px solid #ddd; padding: 8px;">Product Title</th>
                          <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                          <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
                      </tr>
                  </thead>
                  <tbody>
                          <tr>
                              <td style="border: 1px solid #ddd; padding: 8px;">${title.longTitle}</td>
                              <td style="border: 1px solid #ddd; padding: 8px;">${1}</td>
                              <td style="border: 1px solid #ddd; padding: 8px;">₹${price.cost}</td>
                          </tr>
                     
                  </tbody>
              </table>
              <p style="font-weight: bold;">Total Amount: ₹${price.cost}</p>
              <p>We appreciate your business!</p>
              <p>Best Regards,<br>Ashapura Electronics Team</p>
          `
      };

      // Send the email
       transporter.sendMail(mailOptions);
        
        // Send a success response
        res.status(200).json({ message: "Product Purchased Successfully" });
    } catch (e) {
        console.error(e); // Log the error for debugging

        // Send an error response
        res.status(501).json({ message: 'Internal Server Error' });
    }
});

router.get('/fetchOrders',async (req,res)=>{
    const {username} = req.query;
    console.log(username);
    
    
    try{
    const purchased = await purchasedModel.find({username});
    console.log(purchased);
    
    res.status(200).json({orders: purchased});
}
    catch(e){
        console.log('error in fetching orders',e);
        res.status(501).json({message:"Internal Server Error"});
    }
})

router.post("/addToCart",async(req,res)=>{

    try {
        const { username, url, description, price, title } = req.body;

        // Logging the username for debugging purposes
        console.log(`Username: ${username}`);

        // Create a new order using the purchasedModel
        const order = new CartModel({
            username,
            url,
            description,
            price,
            title
        });

        // Save the order to the database
        await order.save();
        
        // Send a success response
        res.status(200).json({ message: "Product Added To Cart Successfully" });
    } catch (e) {
        console.error(e); // Log the error for debugging

        // Send an error response
        res.status(501).json({ message: 'Internal Server Error' });
    }


})

router.post("/buyCartItem", async (req, res) => {
    try {
        const { username } = req.body;

        // Logging the username for debugging purposes
        console.log(`Username: ${username}`);

        // Find all cart items for the user
        const cartItems = await CartModel.find({ username });
        const user = await User.findOne({userName:username});

        if (cartItems.length === 0) {
            return res.status(404).json({ message: "No items in the cart" });
        }

        // Loop through cart items and store them in the purchasedModel
        const purchasedItems = cartItems.map(item => ({
            username: item.username,
            description: item.description,
            url: item.url,
            price: item.price,
            title: item.title,
            createdAt: item.createdAt,
            quantity: item.quantity,
        }));

        // Insert all cart items into the purchasedModel
        await purchasedModel.insertMany(purchasedItems);

        // Remove the cart items for this user
        await CartModel.deleteMany({ username });

        // Prepare the email
        const emailHtml = `
            <h1 style="color: #4CAF50;">Thank You for Your Purchase!</h1>
            <p>Dear Customer,</p>
            <p>We are thrilled to confirm your order at Ashapura Electronics. Here are the details:</p>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px;">Product Title</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${purchasedItems.map(item => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${item.title.longTitle}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">₹${item.price.cost}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <p style="font-weight: bold;">Total Amount: ₹${purchasedItems.reduce((total, item) => total + (item.price.cost * item.quantity), 0)}</p>
            <p>We appreciate your business!</p>
            <p>Best Regards,<br>Ashapura Electronics Team</p>
        `;

        // Send the email
        const mailOptions = {
            from: 'ashapuraelectronics2024@gmail.com', // Sender address
            to: user.email, // Assuming the username is an email address
            subject: 'Order Confirmation - Ashapura Electronics',
            html: emailHtml
        };

        await transporter.sendMail(mailOptions);

        // Send a success response
        res.status(200).json({ message: "Payment Successful. Redirecting to Orders.." });
    } catch (e) {
        console.error(e); // Log the error for debugging

        // Send an error response
        res.status(501).json({ message: 'Internal Server Error' });
    }
});

  router.get("/fetchCart", async (req, res) => {
    try {
      const { username } = req.query;
  
      // Logging the username for debugging purposes
      console.log(`Username: ${username}`);
  
      // Find all cart items for the user
      const cartItems = await CartModel.find({ username });
  
      if (cartItems.length === 0) {
        return res.status(404).json({ message: [] });
      }
  
      // Loop through cart items and store them in the purchasedModel
     
  
      // Send a success response
      res.status(200).json({ message: cartItems });
    } catch (e) {
      console.error(e); // Log the error for debugging
  
      // Send an error response
      res.status(501).json({ message: 'Internal Server Error' });
    }
  });


  
  router.post('/modifyQty', async (req, res) => {
    const { _id, qty } = req.body; // Destructure the request body
    console.log('Received ID:', _id, 'Quantity:', qty);

    try {
        // Find the cart item by ID and update its quantity
        const updatedItem = await CartModel.findByIdAndUpdate(
            _id,
            { $set: { quantity: qty } }, // Update quantity
            { new: true } // Return the updated document
        );

        // Check if the item was found and updated
        if (!updatedItem) {
            return res.status(404).json({ message: 'Cart item not found.' });
        }

        // Send success response with the updated item
        return res.status(200).json({ message: 'Quantity updated successfully.', item: updatedItem });
    } catch (error) {
        console.error('Error updating quantity:', error);
        return res.status(500).json({ message: 'Failed to update quantity.', error: error.message });
    }
});
// delete item from cart
router.post('/delteItemFromCart', async (req, res) => {
  console.log('called');
  
  const { id } = req.body;

  try {
      const result = await CartModel.deleteOne({ _id: id });

      if (result.deletedCount === 1) {
          console.log('Data deleted from cart');
          return res.status(200).json({ msg: "Item deleted" });
      } else {
          console.log('This item does not exist in cart');
          return res.status(404).json({ msg: "Item not found" });
      }
  } catch (e) {
      console.log('Error in deleting product', e);
      return res.status(501).json({ msg: "Internal Server Error" });
  }
});


module.exports = router