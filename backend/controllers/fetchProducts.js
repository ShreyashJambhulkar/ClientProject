const Product = require("../models/product-schema");

const fetchProducts = async (req, res) => {

    const { query } = req.query;
    console.log(query);

    if (query == "all") {
        try {
            const fetchedProducts = await Product.find({});
            res.status(200).json({ products: fetchedProducts });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ msg: "Error While Fetching Products from MongoDB" })
        }
    }
    else {
        try {
            // Use $regex for partial matching and case insensitivity
            const fetchedProducts = await Product.find({
                $or: [
                    { "title.longTitle": { $regex: query, $options: 'i' } }, // Search in title
                    { description: { $regex: query, $options: 'i' } }         // Search in description
                ]
            });

            res.status(200).json({ products: fetchedProducts });
        } catch (e) {
            console.log(e);
            res.status(500).json({ msg: "Error While Fetching Products from MongoDB" });
        }
    }



}


module.exports = fetchProducts;