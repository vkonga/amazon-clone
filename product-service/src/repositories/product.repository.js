const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Review = require('../models/review.model');

class ProductRepository {
  // Category operations
  async createCategory(categoryData) {
    return await Category.create(categoryData);
  }

  async findCategoryBySlug(slug) {
    return await Category.findOne({ slug });
  }

  async findCategoryById(id) {
    return await Category.findById(id);
  }

  async findAllCategories() {
    return await Category.find({});
  }

  async updateCategory(id, updateData) {
    return await Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteCategory(id) {
    return await Category.findByIdAndDelete(id);
  }

  // Product operations
  async createProduct(productData) {
    return await Product.create(productData);
  }

  async findProductById(id) {
    return await Product.findById(id).populate('category').populate('reviews');
  }

  async findProducts({ query = {}, sort = {}, skip = 0, limit = 20 }) {
    const total = await Product.countDocuments(query);
    const data = await Product.find(query)
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    return { data, total };
  }

  async updateProduct(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('category');
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }

  async updateStock(id, count) {
    return await Product.findByIdAndUpdate(
      id,
      { $inc: { stock: count } },
      { new: true, runValidators: true }
    );
  }

  // Review operations
  async createReview(reviewData) {
    const review = await Review.create(reviewData);
    await Product.findByIdAndUpdate(reviewData.productId, {
      $push: { reviews: review._id }
    });
    await this.recalculateRatings(reviewData.productId);
    return review;
  }

  async findReviewsByProductId(productId) {
    return await Review.find({ productId }).sort({ createdAt: -1 });
  }

  async deleteReview(id, productId) {
    const review = await Review.findByIdAndDelete(id);
    if (review) {
      await Product.findByIdAndUpdate(productId, {
        $pull: { reviews: id }
      });
      await this.recalculateRatings(productId);
    }
    return review;
  }

  async recalculateRatings(productId) {
    const reviews = await Review.find({ productId });
    const numReviews = reviews.length;
    const rating = numReviews > 0
      ? parseFloat((reviews.reduce((sum, rev) => sum + rev.rating, 0) / numReviews).toFixed(2))
      : 0;

    await Product.findByIdAndUpdate(productId, { rating, numReviews });
  }
}

module.exports = new ProductRepository();
