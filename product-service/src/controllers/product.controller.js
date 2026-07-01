const productService = require('../services/product.service');
const { sendSuccess, ApiResponse } = require('../shared');

class ProductController {
  // Category controllers
  async createCategory(req, res, next) {
    try {
      const category = await productService.createCategory(req.body);
      sendSuccess(res, category, 'Category created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req, res, next) {
    try {
      const categories = await productService.getCategories();
      sendSuccess(res, categories, 'Categories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Product controllers
  async createProduct(req, res, next) {
    try {
      const productData = { ...req.body };
      // Multer file processing if uploaded
      if (req.files && req.files.length > 0) {
        productData.images = req.files.map(file => `/uploads/${file.filename}`);
      } else if (req.body.images) {
        // Fallback for string images
        productData.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      }
      
      const product = await productService.createProduct(productData);
      sendSuccess(res, product, 'Product created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      sendSuccess(res, product, 'Product retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const productData = { ...req.body };
      if (req.files && req.files.length > 0) {
        productData.images = req.files.map(file => `/uploads/${file.filename}`);
      }
      
      const product = await productService.updateProduct(req.params.id, productData);
      sendSuccess(res, product, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const result = await productService.deleteProduct(req.params.id);
      sendSuccess(res, result, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async listProducts(req, res, next) {
    try {
      const { keyword, category, minPrice, maxPrice, rating, sort, page = 1, limit = 20 } = req.query;
      const { data, total } = await productService.searchProducts({
        keyword,
        category,
        minPrice,
        maxPrice,
        rating,
        sort,
        page,
        limit
      });

      const paginated = ApiResponse.paginate(data, total, page, limit);
      sendSuccess(res, paginated.data, 'Products retrieved successfully', 200, paginated.pagination);
    } catch (error) {
      next(error);
    }
  }

  async updateStock(req, res, next) {
    try {
      const { stock } = req.body;
      const product = await productService.updateStock(req.params.id, stock);
      sendSuccess(res, product, 'Product stock updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Reviews controllers
  async addReview(req, res, next) {
    try {
      const reviewData = {
        userId: req.user.id,
        userName: req.user.name || 'Anonymous',
        rating: req.body.rating,
        comment: req.body.comment
      };
      const review = await productService.addReview(req.params.productId, reviewData);
      sendSuccess(res, review, 'Review added successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getReviews(req, res, next) {
    try {
      const reviews = await productService.getReviews(req.params.productId);
      sendSuccess(res, reviews, 'Reviews retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
