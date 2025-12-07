/**
 * @fileoverview Tests for GUI Server
 */

const Server = require('../../src/gui/server');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const http = require('http');

describe('Server', () => {
  let tempDir;
  let server;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `musubi-test-${Date.now()}`);
    await fs.ensureDir(path.join(tempDir, 'steering', 'rules'));
    await fs.ensureDir(path.join(tempDir, 'storage', 'specs'));
    await fs.writeFile(
      path.join(tempDir, 'steering', 'rules', 'constitution.md'),
      '# Constitution\n\n## Article 1: Purpose\nTest'
    );
  });

  afterEach(async () => {
    if (server) {
      await server.stop();
      server = null;
    }
    await fs.remove(tempDir);
  });

  describe('constructor()', () => {
    it('should create a server instance', () => {
      server = new Server(tempDir);

      expect(server).toBeInstanceOf(Server);
      expect(server.projectPath).toBe(tempDir);
    });

    it('should accept custom port', () => {
      server = new Server(tempDir, { port: 4000 });

      expect(server.port).toBe(4000);
    });

    it('should default to port 3000', () => {
      server = new Server(tempDir);

      expect(server.port).toBe(3000);
    });
  });

  describe('start() and stop()', () => {
    it('should start and stop the server', async () => {
      server = new Server(tempDir, { port: 3001 });
      
      await server.start();
      expect(server.httpServer).not.toBeNull();
      expect(server.httpServer.listening).toBe(true);

      await server.stop();
      expect(server.httpServer.listening).toBe(false);
    });

    it('should handle already stopped server', async () => {
      server = new Server(tempDir, { port: 3002 });
      
      await server.start();
      await server.stop();
      
      // Should not throw
      await server.stop();
    });
  });

  describe('API endpoints', () => {
    let baseUrl;

    beforeEach(async () => {
      server = new Server(tempDir, { port: 3003 });
      await server.start();
      baseUrl = `http://localhost:3003`;
    });

    it('should respond to health check', async () => {
      const response = await fetch(`${baseUrl}/api/health`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
    });

    it('should get project info', async () => {
      const response = await fetch(`${baseUrl}/api/project`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('name');
      expect(data).toHaveProperty('hasSteering', true);
    });

    it('should get steering data', async () => {
      const response = await fetch(`${baseUrl}/api/steering`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('product');
      expect(data).toHaveProperty('structure');
      expect(data).toHaveProperty('tech');
    });

    it('should get specs list', async () => {
      await fs.writeFile(
        path.join(tempDir, 'storage', 'specs', 'test.md'),
        '---\ntitle: Test\n---\n# Test'
      );

      const response = await fetch(`${baseUrl}/api/specs`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should get traceability matrix', async () => {
      const response = await fetch(`${baseUrl}/api/traceability`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('requirements');
      expect(data).toHaveProperty('traces');
    });

    it('should get coverage statistics', async () => {
      const response = await fetch(`${baseUrl}/api/coverage`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('total');
      expect(data).toHaveProperty('linked');
    });

    it('should get workflow state', async () => {
      const response = await fetch(`${baseUrl}/api/workflow/test-feature`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('featureId', 'test-feature');
      expect(data).toHaveProperty('currentStage');
    });

    it('should get all workflows', async () => {
      const response = await fetch(`${baseUrl}/api/workflows`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should handle 404 for unknown API', async () => {
      const response = await fetch(`${baseUrl}/api/unknown`);

      expect(response.status).toBe(404);
    });
  });

  describe('WebSocket', () => {
    it('should accept WebSocket connections', async () => {
      server = new Server(tempDir, { port: 3004 });
      await server.start();

      const WebSocket = require('ws');
      const ws = new WebSocket('ws://localhost:3004');

      await new Promise((resolve, reject) => {
        ws.on('open', () => {
          ws.close();
          resolve();
        });
        ws.on('error', reject);
      });
    });

    it('should broadcast to all clients', async () => {
      server = new Server(tempDir, { port: 3005 });
      await server.start();

      const WebSocket = require('ws');
      const ws = new WebSocket('ws://localhost:3005');

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          ws.close();
          reject(new Error('Timeout waiting for broadcast'));
        }, 5000);

        ws.on('open', () => {
          // Wait a bit for connection to stabilize
          setTimeout(() => {
            server.broadcast({ type: 'test', data: 'hello' });
          }, 100);
        });

        ws.on('message', (data) => {
          const message = JSON.parse(data.toString());
          if (message.type === 'test') {
            expect(message.data).toBe('hello');
            clearTimeout(timeout);
            ws.close();
            resolve();
          }
        });

        ws.on('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });
    });
  });

  describe('Static file serving', () => {
    it('should serve index.html for root', async () => {
      // Create a mock client dist
      const clientDir = path.join(tempDir, 'client', 'dist');
      await fs.ensureDir(clientDir);
      await fs.writeFile(path.join(clientDir, 'index.html'), '<html>Test</html>');

      server = new Server(tempDir, { port: 3006, clientPath: clientDir });
      await server.start();

      const response = await fetch('http://localhost:3006/');
      const text = await response.text();

      expect(response.status).toBe(200);
      expect(text).toContain('<html>');
    });
  });
});
