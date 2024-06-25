const express = require("express")
const cartController = require("../controllers/cartController")
const {auth} = require("../middleware/auth")


const router = express.Router()
// router.use(handleAnonymousCart)

router.post("/addToCart", auth, cartController.addToCart)
router.get("/cart", auth, cartController.getCart)
router.post("/update", auth, cartController.updateQuantity)
router.post("/remove", auth, cartController.removeItem)



module.exports = router;