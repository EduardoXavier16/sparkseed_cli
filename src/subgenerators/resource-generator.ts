import type { ResourceConfig } from './types';

export function generateController(config: ResourceConfig): string {
  const { resourceName, language } = config;
  const isTs = language === 'typescript';
  const serviceName = `${resourceName}.service`;
  const resourceNameCapitalized = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);

  if (isTs) {
    return `import type { Request, Response, NextFunction } from 'express';
import { ${resourceNameCapitalized}Service } from '../services/${serviceName}';
import { HttpError } from '../utils/httpError';

export class ${resourceNameCapitalized}Controller {
  private service: ${resourceNameCapitalized}Service;

  constructor() {
    this.service = new ${resourceNameCapitalized}Service();
  }

  /**
   * GET /${resourceName}
   * List all ${resourceName} resources
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await this.service.findAll();
      res.json({ data: items });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /${resourceName}/:id
   * Get a single ${resourceName} by ID
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const item = await this.service.findById(id);
      
      if (!item) {
        throw new HttpError(404, '${resourceNameCapitalized} not found');
      }
      
      res.json({ data: item });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /${resourceName}
   * Create a new ${resourceName}
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const item = await this.service.create(data);
      res.status(201).json({ data: item });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /${resourceName}/:id
   * Update a ${resourceName} by ID
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const item = await this.service.update(id, data);
      res.json({ data: item });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /${resourceName}/:id
   * Delete a ${resourceName} by ID
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
`;
  }

  return `const { ${resourceNameCapitalized}Service } = require('../services/${serviceName}');
const { HttpError } = require('../utils/httpError');

class ${resourceNameCapitalized}Controller {
  constructor() {
    this.service = new ${resourceNameCapitalized}Service();
  }

  /**
   * GET /${resourceName}
   * List all ${resourceName} resources
   */
  async getAll(req, res, next) {
    try {
      const items = await this.service.findAll();
      res.json({ data: items });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /${resourceName}/:id
   * Get a single ${resourceName} by ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const item = await this.service.findById(id);
      
      if (!item) {
        throw new HttpError(404, '${resourceNameCapitalized} not found');
      }
      
      res.json({ data: item });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /${resourceName}
   * Create a new ${resourceName}
   */
  async create(req, res, next) {
    try {
      const data = req.body;
      const item = await this.service.create(data);
      res.status(201).json({ data: item });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /${resourceName}/:id
   * Update a ${resourceName} by ID
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const item = await this.service.update(id, data);
      res.json({ data: item });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /${resourceName}/:id
   * Delete a ${resourceName} by ID
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { ${resourceNameCapitalized}Controller };
`;
}

export function generateService(config: ResourceConfig): string {
  const { resourceName, language } = config;
  const isTs = language === 'typescript';
  const resourceNameCapitalized = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);

  if (isTs) {
    return `interface I${resourceNameCapitalized} {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
}

/**
 * ${resourceNameCapitalized}Service
 * 
 * Business logic for ${resourceName} operations
 */
export class ${resourceNameCapitalized}Service {
  private items: Map<string, I${resourceNameCapitalized}> = new Map();

  /**
   * Find all ${resourceName} items
   */
  async findAll(): Promise<I${resourceNameCapitalized}[]> {
    // TODO: Replace with database query
    return Array.from(this.items.values());
  }

  /**
   * Find a ${resourceName} by ID
   */
  async findById(id: string): Promise<I${resourceNameCapitalized} | null> {
    // TODO: Replace with database query
    return this.items.get(id) || null;
  }

  /**
   * Create a new ${resourceName}
   */
  async create(data: Partial<I${resourceNameCapitalized}>): Promise<I${resourceNameCapitalized}> {
    const id = crypto.randomUUID();
    const now = new Date();
    
    const item: I${resourceNameCapitalized} = {
      id,
      createdAt: now,
      updatedAt: now,
      ...data,
    };

    this.items.set(id, item);
    return item;
  }

  /**
   * Update a ${resourceName} by ID
   */
  async update(id: string, data: Partial<I${resourceNameCapitalized}>): Promise<I${resourceNameCapitalized} | null> {
    const existing = this.items.get(id);
    
    if (!existing) {
      return null;
    }

    const updated: I${resourceNameCapitalized} = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };

    this.items.set(id, updated);
    return updated;
  }

  /**
   * Delete a ${resourceName} by ID
   */
  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }
}
`;
  }

  return `/**
 * ${resourceNameCapitalized}Service
 * 
 * Business logic for ${resourceName} operations
 */
class ${resourceNameCapitalized}Service {
  constructor() {
    this.items = new Map();
  }

  /**
   * Find all ${resourceName} items
   */
  async findAll() {
    return Array.from(this.items.values());
  }

  /**
   * Find a ${resourceName} by ID
   */
  async findById(id) {
    return this.items.get(id) || null;
  }

  /**
   * Create a new ${resourceName}
   */
  async create(data) {
    const id = crypto.randomUUID();
    const now = new Date();
    
    const item = {
      id,
      createdAt: now,
      updatedAt: now,
      ...data,
    };

    this.items.set(id, item);
    return item;
  }

  /**
   * Update a ${resourceName} by ID
   */
  async update(id, data) {
    const existing = this.items.get(id);
    
    if (!existing) {
      return null;
    }

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };

    this.items.set(id, updated);
    return updated;
  }

  /**
   * Delete a ${resourceName} by ID
   */
  async delete(id) {
    return this.items.delete(id);
  }
}

module.exports = { ${resourceNameCapitalized}Service };
`;
}

export function generateRoutes(config: ResourceConfig): string {
  const { resourceName, language } = config;
  const isTs = language === 'typescript';
  const controllerName = `${resourceName}.controller`;
  const resourceNameCapitalized = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);

  if (isTs) {
    return `import { Router } from 'express';
import { ${resourceNameCapitalized}Controller } from '../controllers/${controllerName}';

const router = Router();
const controller = new ${resourceNameCapitalized}Controller();

/**
 * @route GET /${resourceName}
 * @description Get all ${resourceName} resources
 */
router.get('/', controller.getAll.bind(controller));

/**
 * @route GET /${resourceName}/:id
 * @description Get a single ${resourceName} by ID
 */
router.get('/:id', controller.getById.bind(controller));

/**
 * @route POST /${resourceName}
 * @description Create a new ${resourceName}
 */
router.post('/', controller.create.bind(controller));

/**
 * @route PUT /${resourceName}/:id
 * @description Update a ${resourceName} by ID
 */
router.put('/:id', controller.update.bind(controller));

/**
 * @route DELETE /${resourceName}/:id
 * @description Delete a ${resourceName} by ID
 */
router.delete('/:id', controller.delete.bind(controller));

export { router as ${resourceName}Routes };
`;
  }

  return `const { Router } = require('express');
const { ${resourceNameCapitalized}Controller } = require('../controllers/${controllerName}');

const router = Router();
const controller = new ${resourceNameCapitalized}Controller();

/**
 * @route GET /${resourceName}
 * @description Get all ${resourceName} resources
 */
router.get('/', controller.getAll.bind(controller));

/**
 * @route GET /${resourceName}/:id
 * @description Get a single ${resourceName} by ID
 */
router.get('/:id', controller.getById.bind(controller));

/**
 * @route POST /${resourceName}
 * @description Create a new ${resourceName}
 */
router.post('/', controller.create.bind(controller));

/**
 * @route PUT /${resourceName}/:id
 * @description Update a ${resourceName} by ID
 */
router.put('/:id', controller.update.bind(controller));

/**
 * @route DELETE /${resourceName}/:id
 * @description Delete a ${resourceName} by ID
 */
router.delete('/:id', controller.delete.bind(controller));

module.exports = { ${resourceName}Routes: router };
`;
}

export function generateResourceTest(config: ResourceConfig): string {
  const { resourceName, language } = config;
  const isTs = language === 'typescript';
  const resourceNameCapitalized = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);

  if (isTs) {
    return `import type { Request, Response, NextFunction } from 'express';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ${resourceNameCapitalized}Controller } from '../../src/controllers/${resourceName}.controller';
import { ${resourceNameCapitalized}Service } from '../../src/services/${resourceName}.service';

vi.mock('../../src/services/${resourceName}.service');

describe('${resourceNameCapitalized}Controller', () => {
  let controller: ${resourceNameCapitalized}Controller;
  let mockService: ${resourceNameCapitalized}Service;

  beforeEach(() => {
    mockService = new ${resourceNameCapitalized}Service();
    vi.spyOn(${resourceNameCapitalized}Service.prototype, 'findAll').mockResolvedValue([]);
    vi.spyOn(${resourceNameCapitalized}Service.prototype, 'findById').mockResolvedValue(null);
    vi.spyOn(${resourceNameCapitalized}Service.prototype, 'create').mockResolvedValue({
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.spyOn(${resourceNameCapitalized}Service.prototype, 'update').mockResolvedValue(null);
    vi.spyOn(${resourceNameCapitalized}Service.prototype, 'delete').mockResolvedValue(true);

    controller = new ${resourceNameCapitalized}Controller();
  });

  const createMockRequest = (overrides?: Partial<Request>): Request =>
    ({
      params: {},
      body: {},
      query: {},
      headers: {},
      ...overrides,
    } as unknown as Request);

  const createMockResponse = (overrides?: Partial<Response>): Response =>
    ({
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
      ...overrides,
    } as unknown as Response);

  const createMockNext = (): NextFunction => vi.fn() as unknown as NextFunction;

  describe('GET /${resourceName}', () => {
    it('should return all items', async () => {
      const mockItems = [
        { id: '1', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', createdAt: new Date(), updatedAt: new Date() },
      ];
      vi.spyOn(${resourceNameCapitalized}Service.prototype, 'findAll').mockResolvedValue(mockItems);

      const mockRes = createMockResponse();
      const mockNext = createMockNext();

      await controller.getAll(createMockRequest(), mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ data: mockItems });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('GET /${resourceName}/:id', () => {
    it('should return a single item', async () => {
      const mockItem = { id: '1', createdAt: new Date(), updatedAt: new Date() };
      vi.spyOn(${resourceNameCapitalized}Service.prototype, 'findById').mockResolvedValue(mockItem);

      const mockReq = createMockRequest({ params: { id: '1' } });
      const mockRes = createMockResponse();
      const mockNext = createMockNext();

      await controller.getById(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ data: mockItem });
    });

    it('should return 404 when item not found', async () => {
      vi.spyOn(${resourceNameCapitalized}Service.prototype, 'findById').mockResolvedValue(null);

      const mockReq = createMockRequest({ params: { id: '999' } });
      const mockRes = createMockResponse();
      const mockNext = createMockNext();

      await controller.getById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('POST /${resourceName}', () => {
    it('should create a new item', async () => {
      const mockData = { name: 'Test' };
      const mockRes = createMockResponse();
      const mockNext = createMockNext();
      const mockReq = createMockRequest({ body: mockData });

      await controller.create(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });
});
`;
  }

  return `const { describe, it, expect, beforeEach, vi } = require('vitest');
const { ${resourceNameCapitalized}Controller } = require('../../src/controllers/${resourceName}.controller');
const { ${resourceNameCapitalized}Service } = require('../../src/services/${resourceName}.service');

vi.mock('../../src/services/${resourceName}.service');

describe('${resourceNameCapitalized}Controller', () => {
  let controller;
  let mockService;

  beforeEach(() => {
    mockService = new ${resourceNameCapitalized}Service();
    vi.spyOn(${resourceNameCapitalized}Service.prototype, 'findAll').mockResolvedValue([]);
    vi.spyOn(${resourceNameCapitalized}Service.prototype, 'findById').mockResolvedValue(null);
    vi.spyOn(${resourceNameCapitalized}Service.prototype, 'create').mockResolvedValue({
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    controller = new ${resourceNameCapitalized}Controller();
  });

  describe('GET /${resourceName}', () => {
    it('should return all items', async () => {
      const mockItems = [
        { id: '1', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', createdAt: new Date(), updatedAt: new Date() },
      ];
      vi.spyOn(${resourceNameCapitalized}Service.prototype, 'findAll').mockResolvedValue(mockItems);

      const mockRes = { json: vi.fn() };
      const mockNext = vi.fn();

      await controller.getAll({}, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ data: mockItems });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
`;
}
