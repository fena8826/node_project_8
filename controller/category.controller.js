const Category = require("../models/category.model");
const path = require("path");
const fs = require("fs");
exports.addCategoryPage = (req, res) => {
  try {
    return res.render("category/addcategory");
  } catch (error) {
    console.log("Error: ", error);
    req.flash("error", "Server Error");
    return res.redirect("/");
  }
};

exports.viewCategoryPage = async (req, res) => {
  try {
    let search = "";
    if (req.query.search) {
      search = req.query.search;
    }
    let categories = await Category.find({
      category: { $regex: search, $options: "i" },
    });
    return res.render("category/viewCategory", { categories });
  } catch (error) {
    console.log("Error: ", error);
    req.flash("error", "Server Error");
    return res.redirect("/");
  }
};

exports.addNewCategory = async (req, res) => {
  try {
    let categoryExist = await Category.findOne({ category: req.body.category });
    if (categoryExist) {
      req.flash("warning", "Category is Already Exist");
      return res.redirect("/category/add-category");
    }
    let imagepath = "";
    if (req.file) {
      imagepath = `/uploads/${req.file.filename}`;
    }
    let newCategory = await Category.create({
      ...req.body,
      categoryImage: imagepath,
    });

    if (newCategory) {
      req.flash("success", "Category Addedd Success!!!");
      return res.redirect("/category/add-category");
    } else {
      req.flash("error", "Category Not Addedd.");
      return res.redirect("/category/add-category");
    }
  } catch (error) {
    console.log("Error: ", error);
    req.flash("error", "Server Error");
    return res.redirect("/");
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    // Find the category
    const category = await Category.findById(id);

    if (!category) {
      req.flash("error", "Category not found");
      return res.redirect("back");
    }

    // Delete the image file if exists
    if (category.categoryImage && category.categoryImage !== "") {
      const imagePath = path.join(__dirname, "..", category.categoryImage);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the category from database
    await Category.findByIdAndDelete(id);

    // Optional: Delete related subcategories and extra categories
    // await SubCategory.deleteMany({ category: id });
    // await ExtraCategory.deleteMany({ categoryId: id });

    req.flash("success", "Category and related data deleted successfully");
    return res.redirect("/category/view-categories");
  } catch (error) {
    console.error("Error deleting category:", error);
    req.flash("error", "Something went wrong while deleting category");
    return res.redirect("/category/view-categories");
  }
};
exports.editCategoryPage = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash("error", "Category not found!");
      return res.redirect("back");
    }

    console.log("Category found:", category); // Debug

    return res.render("category/edit_category", {
      category,
      admin: req.user, // if needed in the view
    });
  } catch (error) {
    console.error("Error loading edit category page:", error);
    req.flash("error", "Something went wrong!");
    return res.redirect("back");
  }
};
exports.updateCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      req.flash("error", "Category not found!");
      return res.redirect("back");
    }

    console.log("Form Data:", req.body);
    console.log("Uploaded File:", req.file);

    if (req.file) {
  // Delete old image
  const oldImagePath = path.join(__dirname, "..", category.categoryImage || "");
  if (fs.existsSync(oldImagePath)) {
    fs.unlinkSync(oldImagePath);
  }

  // ✅ Save new image path in same format as during create
  req.body.categoryImage = `/uploads/${req.file.filename}`;
}

    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (updated) {
      req.flash("success", "Category updated successfully!");
      console.log("Category updated successfully");
      return res.redirect("/category/view-categories");
    } else {
      console.log("Update failed");
      return res.redirect("back");
    }

  } catch (error) {
    console.log("Error updating category:", error);
    return res.redirect("back");
  }
};
