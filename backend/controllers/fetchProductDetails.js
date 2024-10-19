const  Product = require("../models/product-schema");

const fetchProductDetails  = async (req,res)=>{

    const {id} = req.body;
    console.log(req.body);
    console.log("id:" ,id);


    
    // finding the product from DB:
    try{

        const data = await Product.findOne({id:id});
        
        console.log()
        
        res.status(200).json(
            {productDetails:data}
        )

    }
    catch(e){
        res.status(501).json({msg:"Error in fetching Data"})
    }

}

module.exports = fetchProductDetails;