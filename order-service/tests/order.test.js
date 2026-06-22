const request = require('supertest');
const app = require('../src/app');
const cartService = require('../src/services/cart.service');
const orderService = require('../src/services/order.service');

// Mock services
jest.mock('../src/services/cart.service');
jest.mock('../src/services/order.service');

describe('Order & Cart Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/cart', () => {
    it('should retrieve a shopping cart', async () => {
      const mockCart = {
        userId: '123',
        items: [{ productId: 'abc', name: 'Product X', price: 10, quantity: 2 }],
        totalAmount: 20
      };
      cartService.getCart.mockResolvedValue(mockCart);

      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', 'Bearer dummy_token');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalAmount).toEqual(20);
    });
  });

  describe('POST /api/orders', () => {
    it('should checkout and create an order', async () => {
      const mockOrder = {
        id: 'order_123',
        userId: '123',
        items: [{ productId: 'abc', name: 'Product X', price: 10, quantity: 2 }],
        totalAmount: 20,
        paymentStatus: 'Paid',
        orderStatus: 'Confirmed'
      };
      orderService.createOrder.mockResolvedValue(mockOrder);

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', 'Bearer dummy_token')
        .send({
          shippingAddress: {
            fullName: 'John Doe',
            phoneNumber: '12345678',
            streetAddress: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA'
          },
          paymentMethod: 'Credit Card'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderStatus).toEqual('Confirmed');
    });
  });
});
