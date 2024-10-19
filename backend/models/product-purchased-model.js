const mongoose = require('mongoose');

const purchasedSchema = mongoose.Schema({

    username: String,
    description: String,
    url: String,
    quantity: {
        default : 1,
        type: Number,
    },    price : {
        mrp: Number,
        cost : Number,
        discount : String,
       
    },
    title : {
        shortTitle : String,
        longTitle : String,
    },

    createdAt: {
        type: Date,
        default: Date.now, // Set default to current date and time
    },
   
})

const purchasedModel = mongoose.model('purchased',purchasedSchema);

module.exports = purchasedModel;