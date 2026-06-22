/**
 * Standard API response helpers — used by all services
 */
class ApiResponse {
  static success(data = null, message = 'Success', statusCode = 200, pagination = null) {
    const response = { success: true, message, data };
    if (pagination) response.pagination = pagination;
    return { statusCode, body: response };
  }

  static error(message = 'An error occurred', statusCode = 500, code = 'INTERNAL_ERROR', details = []) {
    return {
      statusCode,
      body: { success: false, error: { code, message, details } },
    };
  }

  static paginate(data, total, page, limit) {
    return {
      data,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }
}

/**
 * Send a success response
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200, pagination = null) => {
  const body = { success: true, message, data };
  if (pagination) body.pagination = pagination;
  return res.status(statusCode).json(body);
};

/**
 * Send an error response
 */
const sendError = (res, message = 'An error occurred', statusCode = 500, code = 'INTERNAL_ERROR', details = []) => {
  return res.status(statusCode).json({
    success: false,
    error: { code, message, details },
  });
};

module.exports = { ApiResponse, sendSuccess, sendError };
