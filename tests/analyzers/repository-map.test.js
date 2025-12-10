/**
 * Repository Map Tests
 * 
 * Part of MUSUBI v4.1.0 - Codebase Intelligence
 * @trace REQ-P4-001
 * @requirement REQ-P4-001 Repository Map Generation
 */

const {
  RepositoryMap,
  createRepositoryMap,
  generateRepositoryMap,
  LANGUAGE_MAP,
  ENTRY_PATTERNS,
  DEFAULT_IGNORE_PATTERNS
} = require('../../src/analyzers/repository-map');

const path = require('path');
const fs = require('fs');
const os = require('os');

describe('RepositoryMap', () => {
  let testDir;
  
  beforeEach(async () => {
    // Create temporary test directory
    testDir = path.join(os.tmpdir(), `musubi-test-${Date.now()}`);
    await fs.promises.mkdir(testDir, { recursive: true });
    
    // Create test file structure
    await fs.promises.mkdir(path.join(testDir, 'src'), { recursive: true });
    await fs.promises.mkdir(path.join(testDir, 'tests'), { recursive: true });
    
    await fs.promises.writeFile(
      path.join(testDir, 'package.json'),
      JSON.stringify({ name: 'test-project', version: '1.0.0' })
    );
    
    await fs.promises.writeFile(
      path.join(testDir, 'src', 'index.js'),
      `const utils = require('./utils');\nmodule.exports = { main: () => {} };`
    );
    
    await fs.promises.writeFile(
      path.join(testDir, 'src', 'utils.js'),
      `function helper() {}\nexport { helper };`
    );
    
    await fs.promises.writeFile(
      path.join(testDir, 'tests', 'index.test.js'),
      `describe('test', () => { it('works', () => {}) });`
    );
    
    await fs.promises.writeFile(
      path.join(testDir, 'README.md'),
      `# Test Project\n\nDescription here.`
    );
  });
  
  afterEach(async () => {
    // Clean up
    await fs.promises.rm(testDir, { recursive: true, force: true });
  });
  
  describe('constructor', () => {
    it('should create with default options', () => {
      const mapper = new RepositoryMap();
      
      expect(mapper.rootPath).toBe(process.cwd());
      expect(mapper.maxDepth).toBe(20);
      expect(mapper.maxFiles).toBe(10000);
    });
    
    it('should accept custom options', () => {
      const mapper = new RepositoryMap({
        rootPath: '/custom/path',
        maxDepth: 5,
        maxFiles: 100,
        ignorePatterns: ['custom-ignore']
      });
      
      expect(mapper.rootPath).toBe('/custom/path');
      expect(mapper.maxDepth).toBe(5);
      expect(mapper.maxFiles).toBe(100);
      expect(mapper.ignorePatterns).toContain('custom-ignore');
    });
  });
  
  describe('generate', () => {
    it('should scan directory structure', async () => {
      const mapper = new RepositoryMap({ rootPath: testDir });
      const result = await mapper.generate();
      
      expect(result.root).toBe(testDir);
      expect(result.files.length).toBeGreaterThan(0);
      expect(result.stats.totalFiles).toBeGreaterThan(0);
    });
    
    it('should detect file types', async () => {
      const mapper = new RepositoryMap({ rootPath: testDir });
      await mapper.generate();
      
      const jsFiles = mapper.getFilesByLanguage('javascript');
      expect(jsFiles.length).toBeGreaterThanOrEqual(2);
    });
    
    it('should detect entry points', async () => {
      const mapper = new RepositoryMap({ rootPath: testDir });
      await mapper.generate();
      
      expect(mapper.entryPoints).toContain('package.json');
      expect(mapper.entryPoints.some(e => e.includes('index.js'))).toBe(true);
    });
    
    it('should emit events', async () => {
      const mapper = new RepositoryMap({ rootPath: testDir });
      const events = [];
      
      mapper.on('scan:start', () => events.push('start'));
      mapper.on('scan:complete', () => events.push('complete'));
      mapper.on('file:processed', () => events.push('file'));
      
      await mapper.generate();
      
      expect(events).toContain('start');
      expect(events).toContain('complete');
      expect(events).toContain('file');
    });
    
    it('should respect ignore patterns', async () => {
      // Create node_modules directory
      await fs.promises.mkdir(path.join(testDir, 'node_modules'), { recursive: true });
      await fs.promises.writeFile(
        path.join(testDir, 'node_modules', 'dep.js'),
        'module.exports = {};'
      );
      
      const mapper = new RepositoryMap({ rootPath: testDir });
      await mapper.generate();
      
      const nmFiles = mapper.files.filter(f => f.path.includes('node_modules'));
      expect(nmFiles.length).toBe(0);
    });
  });
  
  describe('getFilesByLanguage', () => {
    it('should filter files by language', async () => {
      const mapper = new RepositoryMap({ rootPath: testDir });
      await mapper.generate();
      
      const jsFiles = mapper.getFilesByLanguage('javascript');
      expect(jsFiles.every(f => f.language === 'javascript')).toBe(true);
    });
  });
  
  describe('getFilesByExtension', () => {
    it('should filter files by extension', async () => {
      const mapper = new RepositoryMap({ rootPath: testDir });
      await mapper.generate();
      
      const jsFiles = mapper.getFilesByExtension('.js');
      expect(jsFiles.every(f => f.extension === '.js')).toBe(true);
    });
  });
  
  describe('getFilesInDirectory', () => {
    it('should return files in specific directory', async () => {
      const mapper = new RepositoryMap({ rootPath: testDir });
      await mapper.generate();
      
      const srcFiles = mapper.getFilesInDirectory('src');
      expect(srcFiles.every(f => f.path.startsWith('src/'))).toBe(true);
    });
  });
  
  describe('searchFiles', () => {
    it('should search by string pattern', async () => {
      const mapper = new RepositoryMap({ rootPath: testDir });
      await mapper.generate();
      
      const testFiles = mapper.searchFiles('test');
      expect(testFiles.length).toBeGreaterThan(0);
    });
    
    it('should search by regex', async () => {
      const mapper = new RepositoryMap({ rootPath: testDir });
      await mapper.generate();
      
      const indexFiles = mapper.searchFiles(/index\./);
      expect(indexFiles.some(f => f.path.includes('index.'))).toBe(true);
    });
  });
  
  describe('toTreeString', () => {
    it('should generate tree structure string', async () => {
      const mapper = new RepositoryMap({ rootPath: testDir });
      await mapper.generate();
      
      const tree = mapper.toTreeString();
      expect(tree).toContain('src');
      expect(tree).toContain('tests');
    });
  });
  
  describe('toLLMContext', () => {
    it('should generate LLM-optimized context', async () => {
      const mapper = new RepositoryMap({ rootPath: testDir });
      await mapper.generate();
      
      const context = mapper.toLLMContext({ maxTokens: 2000 });
      
      expect(context).toContain('# Repository Map');
      expect(context).toContain('Statistics');
      expect(context).toContain('Entry Points');
    });
    
    it('should respect focus paths', async () => {
      const mapper = new RepositoryMap({ rootPath: testDir });
      await mapper.generate();
      
      const context = mapper.toLLMContext({ 
        focusPaths: ['src'],
        maxTokens: 2000 
      });
      
      expect(context).toContain('src');
    });
  });
  
  describe('toJSON / fromJSON', () => {
    it('should serialize and deserialize', async () => {
      const mapper = new RepositoryMap({ rootPath: testDir });
      await mapper.generate();
      
      const json = mapper.toJSON();
      
      const mapper2 = new RepositoryMap();
      mapper2.fromJSON(json);
      
      expect(mapper2.files.length).toBe(mapper.files.length);
      expect(mapper2.stats.totalFiles).toBe(mapper.stats.totalFiles);
    });
  });
  
  describe('extractExports', () => {
    it('should extract CommonJS exports', async () => {
      const mapper = new RepositoryMap({ rootPath: testDir });
      await mapper.generate();
      
      const indexFile = mapper.files.find(f => f.path.includes('src/index.js'));
      expect(indexFile).toBeDefined();
      expect(indexFile.exports).toContain('main');
    });
  });
});

describe('createRepositoryMap', () => {
  it('should create mapper instance', () => {
    const mapper = createRepositoryMap({ rootPath: '/test' });
    expect(mapper).toBeInstanceOf(RepositoryMap);
  });
});

describe('generateRepositoryMap', () => {
  it('should generate map for path', async () => {
    const testDir = path.join(os.tmpdir(), `musubi-gen-${Date.now()}`);
    await fs.promises.mkdir(testDir, { recursive: true });
    await fs.promises.writeFile(path.join(testDir, 'test.js'), 'const x = 1;');
    
    try {
      const result = await generateRepositoryMap(testDir);
      expect(result.files.length).toBeGreaterThan(0);
    } finally {
      await fs.promises.rm(testDir, { recursive: true, force: true });
    }
  });
});

describe('Constants', () => {
  it('should have language mappings', () => {
    expect(LANGUAGE_MAP['.js']).toBe('javascript');
    expect(LANGUAGE_MAP['.ts']).toBe('typescript');
    expect(LANGUAGE_MAP['.py']).toBe('python');
  });
  
  it('should have entry patterns', () => {
    expect(ENTRY_PATTERNS.length).toBeGreaterThan(0);
    expect(ENTRY_PATTERNS.some(p => p.test('index.js'))).toBe(true);
  });
  
  it('should have default ignore patterns', () => {
    expect(DEFAULT_IGNORE_PATTERNS).toContain('node_modules');
    expect(DEFAULT_IGNORE_PATTERNS).toContain('.git');
  });
});
