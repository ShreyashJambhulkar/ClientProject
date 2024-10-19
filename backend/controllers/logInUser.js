const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");

const User = require("../models/signupModel");
const bcrypt = require('bcrypt');

dotenv.config();

const logIn = async (req, res) => {


    try {
        const { email, password } = req.body;



        const user = await User.findOne({ email })

        if (user) {
            console.log(user);
            const dbPassword = user.password;
            console.log(password);
            console.log(dbPassword);

            if (await bcrypt.compare(password, dbPassword)) {

            

                res.status(200).json({ msg: "Login Successfull",  username: user.userName, firstName: user.firstName })

            }
            else {
                res.status(502).json({ msg: "Enter correct password" })
            }

        } else {
            res.status(501).json({ msg: "User with this email does not exists" })
        }



    } catch (e) {
        console.log(e)
        res.status(503).json({ msg: "Internal Server error" })
    }
}

module.exports = logIn;