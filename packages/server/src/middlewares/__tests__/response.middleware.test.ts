import type { NextFunction, Request, Response } from 'express';
import { httpResponseHandler } from '../response.middleware';

describe('Response Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };
    mockNext = jest.fn();
  });

  describe('handleResponse', () => {
    it('should call next when no data in res.locals', () => {
      mockResponse.locals = {};

      httpResponseHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should send response with status 200 when no status provided', () => {
      mockResponse.locals = {
        data: { id: 1, name: 'Test' },
      };

      httpResponseHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 1, name: 'Test' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should send response with provided status', () => {
      mockResponse.locals = {
        data: { id: 1, name: 'Test' },
        status: 201,
      };

      httpResponseHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 1, name: 'Test' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
