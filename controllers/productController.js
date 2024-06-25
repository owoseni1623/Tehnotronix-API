const Product = require ("../models/product")
const {validateProduct} = require("../validator")


// To create product
exports.createProduct = async (req, res)=>{
    try {
        const {error} = validateProduct(req.body)
        if (error) {
            res.json(error.details[0].message)
        }

        const product = new Product({
            category: req.body.category,
            name: req.body.name,
            img: req.file.path,
            price: req.body.price,
            featured: req.body.featured,
            topSelling: req.body.topSelling
        })

        const productItem = await product.save();

        res.setHeader("Content-Type","application/json");
        res.json(productItem)
    } catch (error) {
        console.log({message: error.message});
    }
};
// To get all product
exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.find().populate('category');
      res.json(products);
    } catch (error) {
      console.log({ message: error.message });
      res.json({ message: "Server Error" });
    }
  };
//   To get a single product
  exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.log({ message: error.message });
      res.json({ message: "Server Error" });
    }
  };
// To update a product
  exports.updateProduct = async (req, res) => {
    try {
      const { error } = validateProduct(req.body);
      if (error) {
        return res.json({ message: error.details[0].message });
      }
  
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          category: req.body.category,
          name: req.body.name,
          img: req.file ? req.file.path : req.body.img, // Update the img field only if a new file is provided
          price: req.body.price,
          featured: req.body.featured,
          topSelling: req.body.topSelling,
        },
        { new: true }
      );
  
      if (!product) {
        return res.json({ message: "Product not found" });
      }
  
      res.json(product);
    } catch (error) {
      console.log({ message: error.message });
      res.json({ message: "Server Error" });
    }
  };
//   To delete a product
exports.deleteProduct = async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.log({ message: error.message });
      res.json({ message: "Server Error" });
    }
  };
  exports.getFeaturedProducts = async(req, res)=>{
    try {
      const featured = await Product.find({featured: true}).populate('category')
      res.json(featured)
    } catch (error) {
      res.json({message: error.message})
    }
  }

  exports.getTopSellingProducts = async(req, res)=>{
    try {
      const topSelling = await Product.find({topSelling: true}).populate('category')
      res.json(topSelling)
    } catch (error) {
      res.json({message: error.message})
    }
  }