/**
 * @fileoverview Tests for OllamaProvider - Local LLM integration
 */

const { OllamaProvider, MODEL_PRESETS, OLLAMA_DEFAULTS } = require('../../src/llm-providers/ollama-provider');

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('OllamaProvider', () => {
  let provider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new OllamaProvider();
  });

  describe('constructor', () => {
    test('should use default configuration', () => {
      expect(provider.name).toBe('ollama');
      expect(provider.baseUrl).toBe('http://localhost:11434');
      expect(provider.config.model).toBe('llama3.2');
      expect(provider.config.maxTokens).toBe(2048);
      expect(provider.config.temperature).toBe(0.7);
      expect(provider.config.timeout).toBe(120000);
    });

    test('should accept custom configuration', () => {
      const customProvider = new OllamaProvider({
        baseUrl: 'http://custom:8080',
        model: 'codellama',
        maxTokens: 4096,
        temperature: 0.5,
      });

      expect(customProvider.baseUrl).toBe('http://custom:8080');
      expect(customProvider.config.model).toBe('codellama');
      expect(customProvider.config.maxTokens).toBe(4096);
      expect(customProvider.config.temperature).toBe(0.5);
    });
  });

  describe('OLLAMA_DEFAULTS', () => {
    test('should have expected default values', () => {
      expect(OLLAMA_DEFAULTS.baseUrl).toBe('http://localhost:11434');
      expect(OLLAMA_DEFAULTS.model).toBe('llama3.2');
      expect(OLLAMA_DEFAULTS.keepAlive).toBe('5m');
    });
  });

  describe('MODEL_PRESETS', () => {
    test('should include popular models', () => {
      expect(MODEL_PRESETS['llama3.2']).toBeDefined();
      expect(MODEL_PRESETS['codellama']).toBeDefined();
      expect(MODEL_PRESETS['mistral']).toBeDefined();
      expect(MODEL_PRESETS['qwen2.5-coder']).toBeDefined();
    });

    test('should have context length for each model', () => {
      Object.values(MODEL_PRESETS).forEach(preset => {
        expect(preset.contextLength).toBeGreaterThan(0);
      });
    });
  });

  describe('isAvailable', () => {
    test('should return true when Ollama is running', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ models: [] }),
      });

      const result = await provider.isAvailable();
      expect(result).toBe(true);
    });

    test('should return false when Ollama is not running', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

      const result = await provider.isAvailable();
      expect(result).toBe(false);
    });

    test('should return false on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await provider.isAvailable();
      expect(result).toBe(false);
    });
  });

  describe('refreshModels', () => {
    test('should populate availableModels from API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          models: [
            { name: 'llama3.2:latest' },
            { name: 'codellama:7b' },
          ],
        }),
      });

      const models = await provider.refreshModels();
      expect(models).toEqual(['llama3.2:latest', 'codellama:7b']);
      expect(provider.availableModels).toEqual(['llama3.2:latest', 'codellama:7b']);
    });

    test('should throw error when Ollama is not reachable', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));

      await expect(provider.refreshModels()).rejects.toThrow('Failed to connect to Ollama');
    });
  });

  describe('complete', () => {
    test('should send chat completion request', async () => {
      const mockResponse = {
        model: 'llama3.2',
        message: { content: 'Hello, world!' },
        done: true,
        prompt_eval_count: 10,
        eval_count: 5,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await provider.complete('Say hello');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/chat',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );

      expect(result.content).toBe('Hello, world!');
      expect(result.model).toBe('llama3.2');
      expect(result.usage.promptTokens).toBe(10);
      expect(result.usage.completionTokens).toBe(5);
      expect(result.finishReason).toBe('stop');
    });

    test('should include system prompt in messages', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          message: { content: 'Response' },
          done: true,
        }),
      });

      await provider.complete('User message', {
        systemPrompt: 'You are a helpful assistant',
      });

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.messages).toEqual([
        { role: 'system', content: 'You are a helpful assistant' },
        { role: 'user', content: 'User message' },
      ]);
    });

    test('should throw error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal server error'),
      });

      await expect(provider.complete('Hello')).rejects.toThrow('Ollama API error: 500');
    });

    test('should use custom temperature and maxTokens', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          message: { content: 'OK' },
          done: true,
        }),
      });

      await provider.complete('Test', {
        temperature: 0.1,
        maxTokens: 100,
      });

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.options.temperature).toBe(0.1);
      expect(callBody.options.num_predict).toBe(100);
    });
  });

  describe('embed', () => {
    test('should return embedding vector', async () => {
      const mockEmbedding = Array(384).fill(0).map(() => Math.random());

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ embedding: mockEmbedding }),
      });

      const result = await provider.embed('Hello world');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/embeddings',
        expect.objectContaining({
          method: 'POST',
        })
      );

      expect(result).toEqual(mockEmbedding);
    });

    test('should throw error on embedding failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Model not found'),
      });

      await expect(provider.embed('Test')).rejects.toThrow('Ollama embedding error: 404');
    });
  });

  describe('getModelInfo', () => {
    test('should return model information', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          license: 'MIT',
          modelfile: 'FROM llama3.2',
          parameters: 'temperature 0.7',
          template: '{{ .Prompt }}',
          details: { format: 'gguf' },
        }),
      });

      const info = await provider.getModelInfo('llama3.2');

      expect(info.name).toBe('llama3.2');
      expect(info.license).toBe('MIT');
      expect(info.contextLength).toBe(128000); // From preset
    });

    test('should throw error for unknown model', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(provider.getModelInfo('nonexistent')).rejects.toThrow('Model not found');
    });
  });

  describe('deleteModel', () => {
    test('should delete model and refresh list', async () => {
      // First call: delete
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });
      // Second call: refresh models
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ models: [] }),
      });

      await provider.deleteModel('old-model');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/delete',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('getAvailableModels', () => {
    test('should return copy of available models', async () => {
      provider.availableModels = ['model1', 'model2'];

      const models = provider.getAvailableModels();
      expect(models).toEqual(['model1', 'model2']);

      // Verify it's a copy
      models.push('model3');
      expect(provider.availableModels).toEqual(['model1', 'model2']);
    });
  });

  describe('getModelPresets', () => {
    test('should return copy of model presets', () => {
      const presets = provider.getModelPresets();
      expect(presets).toEqual(MODEL_PRESETS);

      // Verify it's a copy
      presets['new-model'] = { contextLength: 1000 };
      expect(MODEL_PRESETS['new-model']).toBeUndefined();
    });
  });

  describe('getInfo', () => {
    test('should return provider information', () => {
      provider.availableModels = ['llama3.2'];

      const info = provider.getInfo();

      expect(info.name).toBe('ollama');
      expect(info.baseUrl).toBe('http://localhost:11434');
      expect(info.availableModels).toEqual(['llama3.2']);
      expect(info.capabilities.completion).toBe(true);
      expect(info.capabilities.embedding).toBe(true);
      expect(info.capabilities.streaming).toBe(true);
      expect(info.capabilities.localOnly).toBe(true);
    });
  });

  describe('formatMessages', () => {
    test('should format messages correctly', () => {
      const messages = provider.formatMessages('System prompt', 'User message');

      expect(messages).toEqual([
        { role: 'system', content: 'System prompt' },
        { role: 'user', content: 'User message' },
      ]);
    });

    test('should omit system message when not provided', () => {
      const messages = provider.formatMessages(null, 'User message');

      expect(messages).toEqual([
        { role: 'user', content: 'User message' },
      ]);
    });
  });

  describe('integration with index.js', () => {
    test('should be exported from llm-providers module', () => {
      const { OllamaProvider: ExportedProvider } = require('../../src/llm-providers');
      expect(ExportedProvider).toBe(OllamaProvider);
    });

    test('should be in provider priority list', () => {
      const { PROVIDER_PRIORITY } = require('../../src/llm-providers');
      expect(PROVIDER_PRIORITY).toContain('ollama');
    });
  });
});
