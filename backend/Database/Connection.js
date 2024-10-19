const mongoose = require("mongoose");
 const Connection  = async ()=>{

    try{
       
     const connect = await mongoose.connect("mongodb+srv://test:test@cluster1.gxvlp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1")
     console.log("DataBase Connected Successfully")
    }
    catch(e){
        console.log(`DataBase Connection Error ${e}`)
    }

}

module.exports = Connection;