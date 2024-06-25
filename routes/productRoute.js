const express = require("express")
const productController = require("../controllers/productController")
const multer = require("multer")
const {auth, admin} = require("../middleware/auth")



const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "uploads/")
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage})

const router = express.Router()

router.post("/", auth, admin, upload.single("img"), productController.createProduct)
router.get("/", productController.getAllProducts)
router.get("/:id", productController.getProductById);
router.put("/:id", upload.single("img"), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/featured", productController.getAllProducts);
router.get("/topSelling", productController.getTopSellingProducts)

module.exports = router