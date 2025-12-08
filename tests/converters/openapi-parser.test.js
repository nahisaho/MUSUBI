/**
 * @fileoverview Tests for OpenAPI Parser
 */

const { 
  parseOpenAPISpec, 
  groupPathsByTag,
  createRequirementFromOperation,
  generateAcceptanceCriteria,
} = require('../../src/converters/parsers/openapi-parser');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

describe('OpenAPI Parser', () => {
  let tempDir;
  
  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'openapi-test-'));
  });
  
  afterEach(async () => {
    await fs.remove(tempDir);
  });

  describe('parseOpenAPISpec', () => {
    it('should parse a simple OpenAPI 3.0 spec', async () => {
      const spec = {
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          description: 'A test API',
          version: '1.0.0',
        },
        paths: {
          '/users': {
            get: {
              operationId: 'getUsers',
              summary: 'Get all users',
              tags: ['users'],
              responses: {
                '200': { description: 'Success' },
              },
            },
            post: {
              operationId: 'createUser',
              summary: 'Create a user',
              tags: ['users'],
              responses: {
                '201': { description: 'Created' },
              },
            },
          },
        },
        tags: [
          { name: 'users', description: 'User management' },
        ],
      };
      
      const specPath = path.join(tempDir, 'api.json');
      await fs.writeJSON(specPath, spec);
      
      const ir = await parseOpenAPISpec(specPath);
      
      expect(ir.metadata.name).toBe('Test API');
      expect(ir.metadata.description).toBe('A test API');
      expect(ir.features.length).toBeGreaterThan(0);
      
      const usersFeature = ir.features.find(f => f.id === 'users');
      expect(usersFeature).toBeDefined();
      expect(usersFeature.specification.requirements.length).toBe(2);
    });

    it('should parse YAML OpenAPI spec', async () => {
      const yaml = `
openapi: "3.0.0"
info:
  title: YAML API
  version: "1.0.0"
paths:
  /items:
    get:
      operationId: getItems
      responses:
        "200":
          description: OK
`;
      const specPath = path.join(tempDir, 'api.yaml');
      await fs.writeFile(specPath, yaml);
      
      const ir = await parseOpenAPISpec(specPath);
      
      expect(ir.metadata.name).toBe('YAML API');
      expect(ir.features.length).toBeGreaterThan(0);
    });

    it('should handle security schemes', async () => {
      const spec = {
        openapi: '3.0.0',
        info: { title: 'Secure API', version: '1.0.0' },
        paths: {},
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
            },
          },
        },
        security: [{ bearerAuth: [] }],
      };
      
      const specPath = path.join(tempDir, 'secure.json');
      await fs.writeJSON(specPath, spec);
      
      const ir = await parseOpenAPISpec(specPath);
      
      const securityFeature = ir.features.find(f => f.id === 'security');
      expect(securityFeature).toBeDefined();
      expect(securityFeature.specification.requirements.length).toBeGreaterThan(0);
    });

    it('should throw for invalid spec', async () => {
      const specPath = path.join(tempDir, 'invalid.json');
      await fs.writeJSON(specPath, { notOpenAPI: true });
      
      await expect(parseOpenAPISpec(specPath)).rejects.toThrow('Not a valid OpenAPI');
    });
  });

  describe('groupPathsByTag', () => {
    it('should group paths by tag', () => {
      const paths = {
        '/users': {
          get: { tags: ['users'], operationId: 'getUsers' },
          post: { tags: ['users'], operationId: 'createUser' },
        },
        '/products': {
          get: { tags: ['products'], operationId: 'getProducts' },
        },
      };
      
      const groups = groupPathsByTag(paths);
      
      expect(Object.keys(groups)).toContain('users');
      expect(Object.keys(groups)).toContain('products');
      expect(Object.keys(groups.users['/users'])).toContain('get');
      expect(Object.keys(groups.users['/users'])).toContain('post');
    });

    it('should handle operations with multiple tags', () => {
      const paths = {
        '/admin/users': {
          get: { tags: ['admin', 'users'], operationId: 'getAdminUsers' },
        },
      };
      
      const groups = groupPathsByTag(paths);
      
      expect(groups.admin['/admin/users']).toBeDefined();
      expect(groups.users['/admin/users']).toBeDefined();
    });

    it('should use default tag for untagged operations', () => {
      const paths = {
        '/health': {
          get: { operationId: 'healthCheck' },
        },
      };
      
      const groups = groupPathsByTag(paths);
      
      expect(groups.default['/health']).toBeDefined();
    });
  });

  describe('createRequirementFromOperation', () => {
    it('should create EARS requirement from GET operation', () => {
      const operation = {
        operationId: 'getUsers',
        summary: 'Get all users',
        responses: { '200': { description: 'Success' } },
      };
      
      const req = createRequirementFromOperation('REQ-001', 'get', '/users', operation);
      
      expect(req.id).toBe('REQ-001');
      expect(req.type).toBe('functional');
      expect(req.statement).toContain('GET');
      expect(req.statement).toContain('/users');
      expect(req.metadata.method).toBe('GET');
    });

    it('should create EARS requirement for secured endpoint', () => {
      const operation = {
        operationId: 'createUser',
        summary: 'Create a user',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Created' } },
      };
      
      const req = createRequirementFromOperation('REQ-002', 'post', '/users', operation);
      
      expect(req.statement).toContain('authenticated');
    });
  });

  describe('generateAcceptanceCriteria', () => {
    it('should generate criteria from responses', () => {
      const operation = {
        responses: {
          '200': { description: 'Success' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
        },
      };
      
      const criteria = generateAcceptanceCriteria('get', '/users', operation);
      
      expect(criteria.some(c => c.includes('200'))).toBe(true);
      expect(criteria.some(c => c.includes('400'))).toBe(true);
    });

    it('should add parameter validation criteria', () => {
      const operation = {
        parameters: [
          { name: 'id', in: 'path', required: true },
        ],
        responses: { '200': { description: 'OK' } },
      };
      
      const criteria = generateAcceptanceCriteria('get', '/users/{id}', operation);
      
      expect(criteria.some(c => c.includes('required parameters'))).toBe(true);
    });

    it('should add auth criteria for secured endpoints', () => {
      const operation = {
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'OK' } },
      };
      
      const criteria = generateAcceptanceCriteria('get', '/secure', operation);
      
      expect(criteria.some(c => c.includes('401'))).toBe(true);
    });
  });
});
