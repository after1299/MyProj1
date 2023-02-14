const router = require("express").Router();

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

module.exports = router;