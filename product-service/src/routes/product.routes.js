const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const productController = require('../controllers/product.controller');
const {
  validateCategory,
  validateProduct,
  validateStock,
  validateReview
} = require('../validators/product.validator');
const { authenticate, authorize } = require('@amazon-clone/shared');

const jwtSecret = process.env.JWT_SECRET || 'secret123';
const auth = authenticate(jwtSecret);
const adminOnly = authorize('Admin');

// Multer Storage Configuration
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Images only (jpeg, jpg, png, webp)!'));
  }
});

// Category routes
router.post('/categories', auth, adminOnly, validateCategory, productController.createCategory);
router.get('/categories', productController.getCategories);

// Product routes
router.post('/products', auth, adminOnly, upload.array('images', 5), validateProduct, productController.createProduct);
router.get('/products', productController.listProducts);
router.get('/products/:id', productController.getProduct);
router.put('/products/:id', auth, adminOnly, upload.array('images', 5), validateProduct, productController.updateProduct);
router.delete('/products/:id', auth, adminOnly, productController.deleteProduct);

// Stock adjustments
router.put('/products/:id/stock', auth, validateStock, productController.updateStock);

// Review routes
router.post('/products/:productId/reviews', auth, validateReview, productController.addReview);
router.get('/products/:productId/reviews', productController.getReviews);

module.exports = router;
