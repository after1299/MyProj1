const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").userModel;

// middleware
router.use((req, res, next) => {
    console.log("A request is comming in to auth.js.");
    next();
})

router.get("/testAPI", (req, res) => {
    const msgObj = {
        message: "Test API is working."
    };
    return res.json(msgObj);
})

router.post("/register", async (req, res) => {
    // check the validation of data
    const {error} = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // check if the user exists
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) {
        return res.status(400).send("Email has already been registerd.");
    }

    // register the user
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        // date: req.body.date,
    });
    try {
        const savedUser = await newUser.save();
        res.status(200).send({
            msg: "success",
            savedObject: savedUser,
        });
    } catch (err) {
        res.status(400).send("User not saved."); 
        console.log(err);
    }
})

module.exports = router;