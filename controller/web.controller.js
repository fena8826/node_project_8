const Blog = require("../models/blog.model");
const User = require("../models/Web.model");
const Product = require("../models/product.model");
const Category = require("../models/category.model");

exports.logout = (req, res) => {
  try {
    req.session.destroy((err)=> {
      if (err){
        console.log(err);
        return false;
      }else{
        return res.redirect("/web/login");
      }
    })
  } catch (error) {
    console.log("something Wrong");
    return res.redirect("/web/login");
  }
};
exports.homepage = async (req, res) => {
    try {
        let blogs = await Blog.find();
        res.render("web/home", { blogs });
    } catch (error) {
        console.log("error", error);
        return res.redirect("/");
    }
};
exports.productpage = async (req, res) => {
  try {
    console.log("Query params:", req.query);

    let search = req.query.search ? req.query.search.trim() : "";
    let categoryId = req.query.category || "";

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { desc: { $regex: search, $options: "i" } }
      ];
    }

    if (categoryId) {
      query.category = categoryId;
    }
    let allProducts = await Product.find(query).populate("category");
    if (search && allProducts.length === 0) {
      allProducts = await Product.find({})
        .populate("category")
        .then(products =>
          products.filter(p =>
            p.category &&
            p.category.category &&
            p.category.category.toLowerCase().includes(search.toLowerCase())
          )
        );
    }

    let categories = await Category.find();
    let colors = ["primary", "success", "danger", "warning", "info", "secondary"];

    res.render("web/product", {
      allProducts,
      categories,
      colors,
      search,
     
    });
  } catch (err) {
    console.error("Error loading products:", err);
    res.status(500).send("Internal Server Error");
  }
};





exports.loginPage = (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.render("web/loginpage");
    } else {
      return res.redirect("/web/product");
    }
  } catch (error) {
    console.log("something Wrong");
    return res.redirect("/");
  }
};


exports.loginuser = async (req, res) => {
    try {
        console.log(req.body);
        let user = await User.findOne({email: req.body.email})
        console.log(user);
        if(user){
            if(user.password == req.body.password){
                res.cookie("user", user)
                return res.redirect("/web/product")
            }else{
                console.log("Password is not matched");
                return res.redirect("/web/login");
            }
        }else{
            console.log("User not Found");
            return res.redirect("/web/login");
        }
    } catch (error) {
        return res.redirect("/");
    }
}



exports.registerpage = (req, res) => {
    try {
        res.render("web/register");
    } catch (error) {
        console.log("error", error);
        return res.redirect("/");
    }
};

exports.registeruser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, cpassword } = req.body;
    if (password !== cpassword) {
      console.log("Passwords do not match");
      return res.redirect("/web/register");
    }
    let user = await User.findOne({ email });
    if (user) {
      console.log("Email already registered!");
      return res.redirect("/web/register");
    }
    user = new User({
      firstname,
      lastname,
      email,
      password,
      cpassword
    });

    await user.save();
    console.log("Registered Successfully! Please login.");
    return res.redirect("/web/login");

  } catch (err) {
    console.log("Error in registeruser:", err);
    return res.redirect("/web/register");
  }
};



exports.singleblog = async (req, res) => {
    try {
        let id = req.params.id;
        let blogs = await Blog.findById(id);
        res.render("web/singleblog", { blogs });
    } catch (error) {
        console.log("error", error);
        return res.redirect("/");
    }

};
exports.singleProductPage = async (req, res) => {
  try {
    const productId = req.params.id;
    let product = await Product.findById(productId).populate("category");
    res.render("web/single_product", {
      product,
    
    });
  } catch (err) {
    console.error("Error loading single product:", err);
    res.status(500).send("Internal Server Error");
  }
};
exports.contactpage = (req, res) => {
    try {
        res.render("web/contact");
    } catch (error) {
        console.log("error", error);
        return res.redirect("/");
    }
};