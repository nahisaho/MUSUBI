/**
 * Repository Map Generator
 *
 * Generates a comprehensive map of the repository structure for LLM context.
 * Implements efficient file scanning, caching, and incremental updates.
 *
 * Part of MUSUBI v5.0.0 - Codebase Intelligence
 *
 * @module analyzers/repository-map
 * @version 1.0.0
 *
 * @traceability
 * - Requirement: REQ-P4-001 (Repository Map Generation)
 * - Design: docs/design/tdd-musubi-v5.0.0.md#2.1
 * - Test: tests/analyzers/repository-map.test.js
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

/**
 * @typedef {Object} FileInfo
 * @property {string} path - Relative file path
 * @property {string} type - File type (file/directory)
 * @property {string} extension - File extension
 * @property {number} size - File size in bytes
 * @property {number} mtime - Modification timestamp
 * @property {string} language - Detected programming language
 * @property {boolean} isEntry - Whether this is an entry point
 * @property {string[]} exports - Exported symbols (for modules)
 */

/**
 * @typedef {Object} RepositoryStats
 * @property {number} totalFiles - Total number of files
 * @property {number} totalDirs - Total number of directories
 * @property {number} totalSize - Total size in bytes
 * @property {Object<string, number>} byLanguage - File count by language
 * @property {Object<string, number>} byExtension - File count by extension
 */

/**
 * @typedef {Object} RepositoryMap
 * @property {string} root - Repository root path
 * @property {Date} generatedAt - Generation timestamp
 * @property {FileInfo[]} files - All files in repository
 * @property {RepositoryStats} stats - Repository statistics
 * @property {Object} structure - Tree structure
 * @property {string[]} entryPoints - Detected entry points
 */

/**
 * Language detection mappings
 */
const LANGUAGE_MAP = {
  '.js': 'javascript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  '.jsx': 'javascript',
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.py': 'python',
  '.rb': 'ruby',
  '.go': 'go',
  '.rs': 'rust',
  '.java': 'java',
  '.kt': 'kotlin',
  '.swift': 'swift',
  '.cs': 'csharp',
  '.cpp': 'cpp',
  '.c': 'c',
  '.h': 'c',
  '.hpp': 'cpp',
  '.php': 'php',
  '.sh': 'shell',
  '.bash': 'shell',
  '.zsh': 'shell',
  '.md': 'markdown',
  '.json': 'json',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.toml': 'toml',
  '.xml': 'xml',
  '.html': 'html',
  '.css': 'css',
  '.scss': 'scss',
  '.sass': 'sass',
  '.less': 'less',
  '.sql': 'sql',
  '.graphql': 'graphql',
  '.gql': 'graphql',
  '.dockerfile': 'dockerfile',
  '.vue': 'vue',
  '.svelte': 'svelte',
};

/**
 * Entry point patterns
 */
const ENTRY_PATTERNS = [
  /^index\.(js|ts|mjs|cjs)$/,
  /^main\.(js|ts|py|go|rs)$/,
  /^app\.(js|ts|py)$/,
  /^server\.(js|ts)$/,
  /^cli\.(js|ts)$/,
  /^package\.json$/,
  /^Cargo\.toml$/,
  /^go\.mod$/,
  /^setup\.py$/,
  /^pyproject\.toml$/,
  /^Gemfile$/,
  /^pom\.xml$/,
  /^build\.gradle(\.kts)?$/,
];

/**
 * Default ignore patterns
 */
const DEFAULT_IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.svn',
  '.hg',
  '__pycache__',
  '.pytest_cache',
  '.mypy_cache',
  'venv',
  '.venv',
  'env',
  '.env',
  'dist',
  'build',
  'out',
  'target',
  'coverage',
  '.nyc_output',
  '.next',
  '.nuxt',
  '.cache',
  'vendor',
  'Pods',
  '.idea',
  '.vscode',
  '.DS_Store',
  'Thumbs.db',
  '*.log',
  '*.lock',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'Cargo.lock',
  'Gemfile.lock',
  'poetry.lock',
];

/**
 * Repository Map Generator
 * @extends EventEmitter
 */
class RepositoryMap extends EventEmitter {
  /**
   * Create repository map generator
   * @param {Object} options - Configuration options
   * @param {string} options.rootPath - Repository root path
   * @param {string[]} [options.ignorePatterns] - Patterns to ignore
   * @param {number} [options.maxDepth=20] - Maximum directory depth
   * @param {number} [options.maxFiles=10000] - Maximum files to scan
   * @param {boolean} [options.includeContent=false] - Include file content
   * @param {number} [options.contentMaxSize=10000] - Max content size to include
   */
  constructor(options = {}) {
    super();
    this.rootPath = options.rootPath || process.cwd();
    this.ignorePatterns = [...DEFAULT_IGNORE_PATTERNS, ...(options.ignorePatterns || [])];
    this.maxDepth = options.maxDepth ?? 20;
    this.maxFiles = options.maxFiles ?? 10000;
    this.includeContent = options.includeContent ?? false;
    this.contentMaxSize = options.contentMaxSize ?? 10000;

    // Cache
    this.cache = new Map();
    this.lastScanTime = null;

    // Statistics
    this.stats = {
      totalFiles: 0,
      totalDirs: 0,
      totalSize: 0,
      byLanguage: {},
      byExtension: {},
    };

    // Results
    this.files = [];
    this.structure = {};
    this.entryPoints = [];
  }

  /**
   * Generate repository map
   * @returns {Promise<RepositoryMap>}
   */
  async generate() {
    this.emit('scan:start', { rootPath: this.rootPath });

    // Reset state
    this.files = [];
    this.structure = {};
    this.entryPoints = [];
    this.stats = {
      totalFiles: 0,
      totalDirs: 0,
      totalSize: 0,
      byLanguage: {},
      byExtension: {},
    };

    try {
      await this.scanDirectory(this.rootPath, '', 0);
      this.lastScanTime = new Date();

      const result = {
        root: this.rootPath,
        generatedAt: this.lastScanTime,
        files: this.files,
        stats: this.stats,
        structure: this.structure,
        entryPoints: this.entryPoints,
      };

      this.emit('scan:complete', result);
      return result;
    } catch (error) {
      this.emit('scan:error', error);
      throw error;
    }
  }

  /**
   * Scan a directory recursively
   * @param {string} dirPath - Absolute directory path
   * @param {string} relativePath - Relative path from root
   * @param {number} depth - Current depth
   * @private
   */
  async scanDirectory(dirPath, relativePath, depth) {
    if (depth > this.maxDepth) return;
    if (this.files.length >= this.maxFiles) return;

    let entries;
    try {
      entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    } catch (error) {
      this.emit('scan:dirError', { path: relativePath, error });
      return;
    }

    for (const entry of entries) {
      if (this.files.length >= this.maxFiles) break;
      if (this.shouldIgnore(entry.name)) continue;

      const entryRelPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      const entryAbsPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        this.stats.totalDirs++;
        this.setStructureNode(entryRelPath, { type: 'directory', children: {} });
        await this.scanDirectory(entryAbsPath, entryRelPath, depth + 1);
      } else if (entry.isFile()) {
        await this.processFile(entryAbsPath, entryRelPath);
      }
    }
  }

  /**
   * Process a single file
   * @param {string} absPath - Absolute file path
   * @param {string} relPath - Relative file path
   * @private
   */
  async processFile(absPath, relPath) {
    try {
      const stat = await fs.promises.stat(absPath);
      const ext = path.extname(relPath).toLowerCase();
      const basename = path.basename(relPath);
      const language = LANGUAGE_MAP[ext] || 'unknown';

      // Detect entry points
      const isEntry = ENTRY_PATTERNS.some(pattern => pattern.test(basename));
      if (isEntry) {
        this.entryPoints.push(relPath);
      }

      // File info
      const fileInfo = {
        path: relPath,
        type: 'file',
        extension: ext,
        size: stat.size,
        mtime: stat.mtime.getTime(),
        language,
        isEntry,
        exports: [],
      };

      // Extract exports for JS/TS files
      if (['javascript', 'typescript'].includes(language) && stat.size < 100000) {
        const exports = await this.extractExports(absPath);
        fileInfo.exports = exports;
      }

      // Optionally include content
      if (this.includeContent && stat.size <= this.contentMaxSize) {
        try {
          const content = await fs.promises.readFile(absPath, 'utf-8');
          fileInfo.content = content;
        } catch {
          // Binary or unreadable file
        }
      }

      // Update statistics
      this.stats.totalFiles++;
      this.stats.totalSize += stat.size;
      this.stats.byLanguage[language] = (this.stats.byLanguage[language] || 0) + 1;
      this.stats.byExtension[ext] = (this.stats.byExtension[ext] || 0) + 1;

      // Add to results
      this.files.push(fileInfo);
      this.setStructureNode(relPath, { type: 'file', language, size: stat.size });

      this.emit('file:processed', fileInfo);
    } catch (error) {
      this.emit('file:error', { path: relPath, error });
    }
  }

  /**
   * Extract exported symbols from JS/TS file
   * @param {string} filePath - File path
   * @returns {Promise<string[]>}
   * @private
   */
  async extractExports(filePath) {
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      const exports = [];

      // CommonJS exports
      const cjsMatch = content.match(/module\.exports\s*=\s*\{([^}]+)\}/);
      if (cjsMatch) {
        const props = cjsMatch[1].match(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g);
        if (props) exports.push(...props);
      }

      // Named exports
      const namedExports = content.matchAll(
        /export\s+(?:const|let|var|function|class|async function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g
      );
      for (const match of namedExports) {
        exports.push(match[1]);
      }

      // Export statements
      const exportStmts = content.matchAll(/export\s*\{\s*([^}]+)\s*\}/g);
      for (const match of exportStmts) {
        const names = match[1].match(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g);
        if (names) exports.push(...names);
      }

      // Default export
      if (/export\s+default/.test(content)) {
        exports.push('default');
      }

      return [...new Set(exports)];
    } catch {
      return [];
    }
  }

  /**
   * Set a node in the structure tree
   * @param {string} relPath - Relative path
   * @param {Object} value - Node value
   * @private
   */
  setStructureNode(relPath, value) {
    const parts = relPath.split('/');
    let current = this.structure;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = { type: 'directory', children: {} };
      }
      current = current[parts[i]].children || current[parts[i]];
    }

    const lastName = parts[parts.length - 1];
    if (value.type === 'directory') {
      if (!current[lastName]) {
        current[lastName] = value;
      }
    } else {
      current[lastName] = value;
    }
  }

  /**
   * Check if a path should be ignored
   * @param {string} name - File/directory name
   * @returns {boolean}
   * @private
   */
  shouldIgnore(name) {
    return this.ignorePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\./g, '\\.').replace(/\*/g, '.*'));
        return regex.test(name);
      }
      return name === pattern;
    });
  }

  /**
   * Get files by language
   * @param {string} language - Programming language
   * @returns {FileInfo[]}
   */
  getFilesByLanguage(language) {
    return this.files.filter(f => f.language === language);
  }

  /**
   * Get files by extension
   * @param {string} extension - File extension (with dot)
   * @returns {FileInfo[]}
   */
  getFilesByExtension(extension) {
    return this.files.filter(f => f.extension === extension);
  }

  /**
   * Get files in directory
   * @param {string} dirPath - Relative directory path
   * @returns {FileInfo[]}
   */
  getFilesInDirectory(dirPath) {
    const prefix = dirPath.endsWith('/') ? dirPath : `${dirPath}/`;
    return this.files.filter(f => f.path.startsWith(prefix));
  }

  /**
   * Search files by pattern
   * @param {string|RegExp} pattern - Search pattern
   * @returns {FileInfo[]}
   */
  searchFiles(pattern) {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    return this.files.filter(f => regex.test(f.path));
  }

  /**
   * Generate tree view string
   * @param {Object} [node] - Starting node
   * @param {string} [prefix=''] - Prefix for indentation
   * @param {number} [maxDepth=5] - Maximum depth
   * @returns {string}
   */
  toTreeString(node = this.structure, prefix = '', maxDepth = 5) {
    if (maxDepth <= 0) return prefix + '...\n';

    let result = '';
    const entries = Object.entries(node);

    for (let i = 0; i < entries.length; i++) {
      const [name, info] = entries[i];
      const isLast = i === entries.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const childPrefix = isLast ? '    ' : '│   ';

      result += `${prefix}${connector}${name}`;

      if (info.type === 'file') {
        result += ` (${info.language})\n`;
      } else {
        result += '/\n';
        if (info.children) {
          result += this.toTreeString(info.children, prefix + childPrefix, maxDepth - 1);
        }
      }
    }

    return result;
  }

  /**
   * Generate LLM-optimized context
   * @param {Object} options - Context options
   * @param {number} [options.maxTokens=4000] - Maximum token estimate
   * @param {string[]} [options.focusPaths] - Paths to focus on
   * @param {string[]} [options.languages] - Languages to include
   * @returns {string}
   */
  toLLMContext(options = {}) {
    const { maxTokens = 4000, focusPaths = [], languages = [] } = options;

    let context = `# Repository Map\n\n`;
    context += `**Root**: ${this.rootPath}\n`;
    context += `**Generated**: ${this.lastScanTime?.toISOString() || 'N/A'}\n\n`;

    // Statistics
    context += `## Statistics\n\n`;
    context += `- Total Files: ${this.stats.totalFiles}\n`;
    context += `- Total Directories: ${this.stats.totalDirs}\n`;
    context += `- Total Size: ${this.formatBytes(this.stats.totalSize)}\n\n`;

    // Language breakdown
    context += `### Languages\n\n`;
    const langEntries = Object.entries(this.stats.byLanguage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    for (const [lang, count] of langEntries) {
      context += `- ${lang}: ${count} files\n`;
    }
    context += '\n';

    // Entry points
    if (this.entryPoints.length > 0) {
      context += `## Entry Points\n\n`;
      for (const entry of this.entryPoints.slice(0, 10)) {
        context += `- \`${entry}\`\n`;
      }
      context += '\n';
    }

    // Structure (token-limited)
    context += `## Structure\n\n\`\`\`\n`;
    const treeStr = this.toTreeString(this.structure, '', 4);
    const truncatedTree = this.truncateToTokens(treeStr, Math.floor(maxTokens * 0.6));
    context += truncatedTree;
    context += `\`\`\`\n\n`;

    // Key files
    let keyFiles = this.files;

    // Filter by focus paths
    if (focusPaths.length > 0) {
      keyFiles = keyFiles.filter(f =>
        focusPaths.some(fp => f.path.startsWith(fp) || f.path.includes(fp))
      );
    }

    // Filter by languages
    if (languages.length > 0) {
      keyFiles = keyFiles.filter(f => languages.includes(f.language));
    }

    // Sort by importance (entry points first, then by size)
    keyFiles.sort((a, b) => {
      if (a.isEntry && !b.isEntry) return -1;
      if (!a.isEntry && b.isEntry) return 1;
      return b.exports.length - a.exports.length;
    });

    // Add key files with exports
    context += `## Key Modules\n\n`;
    for (const file of keyFiles.slice(0, 20)) {
      if (file.exports.length > 0) {
        context += `### ${file.path}\n`;
        context += `- Language: ${file.language}\n`;
        context += `- Exports: ${file.exports.slice(0, 10).join(', ')}\n`;
        if (file.exports.length > 10) {
          context += `  (and ${file.exports.length - 10} more...)\n`;
        }
        context += '\n';
      }
    }

    return context;
  }

  /**
   * Format bytes to human readable
   * @param {number} bytes - Size in bytes
   * @returns {string}
   * @private
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Truncate string to approximate token count
   * @param {string} str - Input string
   * @param {number} maxTokens - Maximum tokens (approximate)
   * @returns {string}
   * @private
   */
  truncateToTokens(str, maxTokens) {
    // Rough estimate: 1 token ≈ 4 characters
    const maxChars = maxTokens * 4;
    if (str.length <= maxChars) return str;
    return str.slice(0, maxChars) + '\n... (truncated)\n';
  }

  /**
   * Export to JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      root: this.rootPath,
      generatedAt: this.lastScanTime?.toISOString(),
      stats: this.stats,
      files: this.files,
      entryPoints: this.entryPoints,
      structure: this.structure,
    };
  }

  /**
   * Import from JSON
   * @param {Object} data - JSON data
   */
  fromJSON(data) {
    this.rootPath = data.root;
    this.lastScanTime = new Date(data.generatedAt);
    this.stats = data.stats;
    this.files = data.files;
    this.entryPoints = data.entryPoints;
    this.structure = data.structure;
  }

  /**
   * Get cache key for incremental updates
   * @returns {string}
   */
  getCacheKey() {
    return `repomap:${this.rootPath}`;
  }

  /**
   * Check if file has changed since last scan
   * @param {string} filePath - Relative file path
   * @param {number} mtime - Current modification time
   * @returns {boolean}
   */
  hasFileChanged(filePath, mtime) {
    const cached = this.cache.get(filePath);
    if (!cached) return true;
    return cached.mtime !== mtime;
  }
}

/**
 * Create a repository map generator
 * @param {Object} options - Options
 * @returns {RepositoryMap}
 */
function createRepositoryMap(options = {}) {
  return new RepositoryMap(options);
}

/**
 * Generate repository map for a path
 * @param {string} rootPath - Repository root
 * @param {Object} options - Options
 * @returns {Promise<Object>}
 */
async function generateRepositoryMap(rootPath, options = {}) {
  const mapper = createRepositoryMap({ rootPath, ...options });
  return mapper.generate();
}

module.exports = {
  RepositoryMap,
  createRepositoryMap,
  generateRepositoryMap,
  LANGUAGE_MAP,
  ENTRY_PATTERNS,
  DEFAULT_IGNORE_PATTERNS,
};
