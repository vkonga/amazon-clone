const request = require('supertest');
const app = require('../src/app');
const paymentService = require('../src/services/payment.service');

// Mock paymentService
jest.mock('../src/services/payment.service');

describe('Payment Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/payments', () => {
    it('should process payment transaction successfully', async () => {
      const mockTx = {
        id: 'tx_123',
        orderId: 'order_123',
        amount: 25.99,
        paymentMethod: 'Credit Card',
        status: 'Completed',
        transactionType: 'Payment',
        invoiceNumber: 'INV-123456789'
      };

      paymentService.processPayment.mockResolvedValue(mockTx);

      const res = await request(app)
        .post('/api/payments')
        .set('Authorization', 'Bearer dummy_token')
        .send({
          orderId: 'order_123',
          amount: 25.99,
          paymentMethod: 'Credit Card'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toEqual('Completed');
    });
  });

  describe('GET /api/payments/invoices/:orderId', () => {
    it('should generate invoice for order', async () => {
      const mockInvoice = {
        invoiceNumber: 'INV-123',
        amount: 50.00,
        paymentMethod: 'PayPal',
        status: 'Completed'
      };

      paymentService.getInvoiceByOrderId.mockResolvedValue(mockInvoice);

      const res = await request(app)
        .get('/api/payments/invoices/order_abc')
        .set('Authorization', 'Bearer dummy_token');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.invoiceNumber).toEqual('INV-123');
    });
  });
});
