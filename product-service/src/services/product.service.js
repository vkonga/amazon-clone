const productRepository = require('../repositories/product.repository');
const { NotFoundError, ValidationError } = require('../shared');

class ProductService {
  // Category logic
  async createCategory(categoryData) {
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return await productRepository.createCategory({ ...categoryData, slug });
  }

  async getCategories() {
    return await productRepository.findAllCategories();
  }

  // Product logic
  async createProduct(productData) {
    // Validate category exists
    const category = await productRepository.findCategoryById(productData.category);
    if (!category) {
      throw new ValidationError('Invalid category ID');
    }
    return await productRepository.createProduct(productData);
  }

  async getProductById(id) {
    const product = await productRepository.findProductById(id);
    if (!product) {
      throw new NotFoundError('Product');
    }
    return product;
  }

  async updateProduct(id, updateData) {
    if (updateData.category) {
      const category = await productRepository.findCategoryById(updateData.category);
      if (!category) {
        throw new ValidationError('Invalid category ID');
      }
    }
    const product = await productRepository.updateProduct(id, updateData);
    if (!product) {
      throw new NotFoundError('Product');
    }
    return product;
  }

  async deleteProduct(id) {
    const product = await productRepository.deleteProduct(id);
    if (!product) {
      throw new NotFoundError('Product');
    }
    return { message: 'Product deleted successfully' };
  }

  async searchProducts({ keyword, category, minPrice, maxPrice, rating, sort, page = 1, limit = 20 }) {
    const query = {};

    // Search keyword
    if (keyword) {
      query.$text = { $search: keyword };
    }

    // Category filter
    if (category) {
      // Find category by slug first
      const cat = await productRepository.findCategoryBySlug(category);
      if (cat) {
        query.category = cat._id;
      } else {
        // If not a slug, check if it's an object ID
        query.category = category;
      }
    }

    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) query.price.$lte = parseFloat(maxPrice);
    }

    // Rating filter
    if (rating !== undefined) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Sorting
    let sortObj = {};
    if (sort) {
      switch (sort) {
        case 'priceAsc':
          sortObj = { price: 1 };
          break;
        case 'priceDesc':
          sortObj = { price: -1 };
          break;
        case 'rating':
          sortObj = { rating: -1 };
          break;
        case 'newest':
          sortObj = { createdAt: -1 };
          break;
        default:
          sortObj = { createdAt: -1 };
      }
    } else {
      sortObj = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;
    const { data, total } = await productRepository.findProducts({
      query,
      sort: sortObj,
      skip,
      limit: parseInt(limit)
    });

    return { data, total };
  }

  async updateStock(id, count) {
    const product = await productRepository.updateStock(id, count);
    if (!product) {
      throw new NotFoundError('Product');
    }
    if (product.stock < 0) {
      // Revert if stock goes below zero
      await productRepository.updateStock(id, -count);
      throw new ValidationError('Insufficient product stock');
    }
    return product;
  }

  // Reviews logic
  async addReview(productId, reviewData) {
    const product = await productRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundError('Product');
    }
    return await productRepository.createReview({
      productId,
      ...reviewData
    });
  }

  async getReviews(productId) {
    const product = await productRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundError('Product');
    }
    return await productRepository.findReviewsByProductId(productId);
  }
}

module.exports = new ProductService();
