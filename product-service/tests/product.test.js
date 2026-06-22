const request = require('supertest');
const app = require('../src/app');
const productService = require('../src/services/product.service');

// Mock productService methods
jest.mock('../src/services/product.service');

describe('Product Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should retrieve list of products with pagination', async () => {
      const mockResult = {
        data: [
          { id: '1', name: 'Product A', price: 99.99, rating: 4.5 },
          { id: '2', name: 'Product B', price: 49.99, rating: 4.0 }
        ],
        total: 2
      };

      productService.searchProducts.mockResolvedValue(mockResult);

      const res = await request(app)
        .get('/api/products')
        .query({ page: 1, limit: 10 });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination.total).toEqual(2);
      expect(productService.searchProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should retrieve a product by ID', async () => {
      const mockProduct = { id: '1', name: 'Product A', price: 99.99, rating: 4.5 };
      productService.getProductById.mockResolvedValue(mockProduct);

      const res = await request(app).get('/api/products/1');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toEqual('Product A');
    });
  });
});
