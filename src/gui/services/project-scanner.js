/**
 * @fileoverview Project Scanner Service
 * @module gui/services/project-scanner
 */

const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');

/**
 * Project Scanner - Scans MUSUBI project structure
 */
class ProjectScanner {
  /**
   * Create a new ProjectScanner instance
   * @param {string} projectPath - Project root path
   */
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.cache = null;
    this.cacheTime = 0;
    this.cacheTTL = 5000; // 5 seconds
  }

  /**
   * Scan the project structure
   * @returns {Promise<Object>}
   */
  async scan() {
    // Check cache
    if (this.cache && Date.now() - this.cacheTime < this.cacheTTL) {
      return this.cache;
    }

    const project = {
      name: path.basename(this.projectPath),
      path: this.projectPath,
      hasSteering: await this.hasSteering(),
      hasSpecs: await this.hasSpecs(),
      steering: null,
      specs: [],
      constitution: null,
      workflow: null,
    };

    if (project.hasSteering) {
      project.steering = await this.getSteering();
      project.constitution = await this.getConstitution();
      project.workflow = await this.getWorkflow();
    }

    if (project.hasSpecs) {
      project.specs = await this.getSpecs();
    }

    this.cache = project;
    this.cacheTime = Date.now();

    return project;
  }

  /**
   * Check if project has steering directory
   * @returns {Promise<boolean>}
   */
  async hasSteering() {
    const steeringPath = path.join(this.projectPath, 'steering');
    return fs.pathExists(steeringPath);
  }

  /**
   * Check if project has specs directory
   * @returns {Promise<boolean>}
   */
  async hasSpecs() {
    const specsPath = path.join(this.projectPath, 'storage', 'specs');
    return fs.pathExists(specsPath);
  }

  /**
   * Get steering files
   * @returns {Promise<Object>}
   */
  async getSteering() {
    const steeringPath = path.join(this.projectPath, 'steering');

    if (!(await fs.pathExists(steeringPath))) {
      return null;
    }

    const steering = {
      product: await this.readMarkdownFile(path.join(steeringPath, 'product.md')),
      structure: await this.readMarkdownFile(path.join(steeringPath, 'structure.md')),
      tech: await this.readMarkdownFile(path.join(steeringPath, 'tech.md')),
      project: await this.readYamlFile(path.join(steeringPath, 'project.yml')),
    };

    return steering;
  }

  /**
   * Get constitution
   * @returns {Promise<Object>}
   */
  async getConstitution() {
    const constitutionPath = path.join(this.projectPath, 'steering', 'rules', 'constitution.md');

    if (!(await fs.pathExists(constitutionPath))) {
      return null;
    }

    const content = await fs.readFile(constitutionPath, 'utf-8');
    const articles = this.parseConstitutionArticles(content);

    return {
      path: constitutionPath,
      content,
      articles,
    };
  }

  /**
   * Parse constitution articles
   * @param {string} content
   * @returns {Array}
   */
  parseConstitutionArticles(content) {
    const articles = [];
    const articleRegex = /#{2,3}\s+(?:Article|第)\s*(\d+)[:\s]+(.+?)(?=\n#{2,3}|\n##|$)/gs;

    let match;
    while ((match = articleRegex.exec(content)) !== null) {
      articles.push({
        number: parseInt(match[1], 10),
        title: match[2].trim().split('\n')[0],
        content: match[2].trim(),
      });
    }

    return articles;
  }

  /**
   * Get all specs
   * @returns {Promise<Array>}
   */
  async getSpecs() {
    const specsPath = path.join(this.projectPath, 'storage', 'specs');

    if (!(await fs.pathExists(specsPath))) {
      return [];
    }

    const files = await fs.readdir(specsPath);
    const specs = [];

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const filePath = path.join(specsPath, file);
      const spec = await this.parseSpec(filePath);
      if (spec) {
        specs.push(spec);
      }
    }

    return specs;
  }

  /**
   * Get a specific spec by ID
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getSpec(id) {
    const specsPath = path.join(this.projectPath, 'storage', 'specs');
    const files = await fs.readdir(specsPath);

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const filePath = path.join(specsPath, file);
      const spec = await this.parseSpec(filePath);

      if (spec && spec.id === id) {
        return spec;
      }
    }

    return null;
  }

  /**
   * Parse a spec file
   * @param {string} filePath
   * @returns {Promise<Object|null>}
   */
  async parseSpec(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const { data, content: body } = matter(content);

      // Extract ID from filename or frontmatter
      const filename = path.basename(filePath, '.md');
      const id = data.id || filename;

      // Parse requirements
      const requirements = this.parseRequirements(body);

      // Parse tasks
      const tasks = this.parseTasks(body);

      return {
        id,
        title: data.title || filename,
        path: filePath,
        metadata: data,
        requirements,
        tasks,
        content: body,
      };
    } catch (error) {
      console.error(`Error parsing spec ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Parse requirements from spec content
   * @param {string} content
   * @returns {Array}
   */
  parseRequirements(content) {
    const requirements = [];
    const reqRegex =
      /#{2,3}\s+(REQ[-\w]+)[:\s]*(.+?)(?=\n#{2,3}\s+REQ|\n#{1,2}\s+[^#]|\n#{1,2}$|$)/gs;

    let match;
    while ((match = reqRegex.exec(content)) !== null) {
      const id = match[1];
      const body = match[2].trim();

      // Try to extract EARS pattern
      const pattern = this.detectEARSPattern(body);

      requirements.push({
        id,
        body,
        pattern,
      });
    }

    return requirements;
  }

  /**
   * Detect EARS pattern from requirement text
   * @param {string} text
   * @returns {string}
   */
  detectEARSPattern(text) {
    // Check for EARS keywords anywhere in the text (case-insensitive)
    if (/\bWHEN\b/i.test(text)) return 'event-driven';
    if (/\bWHILE\b/i.test(text)) return 'state-driven';
    if (/\bWHERE\b/i.test(text)) return 'optional';
    if (/\bIF\b/i.test(text)) return 'complex';
    return 'ubiquitous';
  }

  /**
   * Parse tasks from spec content
   * @param {string} content
   * @returns {Array}
   */
  parseTasks(content) {
    const tasks = [];
    const taskRegex = /- \[([ xX])\]\s+(TASK[-\w]+)?:?\s*(.+)/g;

    let match;
    let order = 0;
    while ((match = taskRegex.exec(content)) !== null) {
      const completed = match[1].toLowerCase() === 'x';
      const id = match[2] || `TASK-${order + 1}`;
      const title = match[3].trim();

      tasks.push({
        id,
        title,
        completed,
        order,
      });
      order++;
    }

    return tasks;
  }

  /**
   * Get tasks for a specific spec
   * @param {string} specId
   * @returns {Promise<Array>}
   */
  async getTasks(specId) {
    const spec = await this.getSpec(specId);
    return spec ? spec.tasks : [];
  }

  /**
   * Get traceability matrix
   * @returns {Promise<Object>}
   */
  async getTraceabilityMatrix() {
    const specs = await this.getSpecs();
    const matrix = {
      requirements: [],
      traces: [],
    };

    for (const spec of specs) {
      for (const req of spec.requirements) {
        matrix.requirements.push({
          id: req.id,
          specId: spec.id,
          specTitle: spec.title,
          pattern: req.pattern,
        });

        // Check for traces to tasks
        for (const task of spec.tasks) {
          if (task.title.includes(req.id)) {
            matrix.traces.push({
              from: req.id,
              to: task.id,
              type: 'requirement-to-task',
            });
          }
        }
      }
    }

    return matrix;
  }

  /**
   * Get traceability graph data (for D3.js)
   * @returns {Promise<Object>}
   */
  async getTraceabilityGraph() {
    const matrix = await this.getTraceabilityMatrix();
    const nodes = [];
    const links = [];

    // Add requirement nodes
    for (const req of matrix.requirements) {
      nodes.push({
        id: req.id,
        type: 'requirement',
        label: req.id,
        specId: req.specId,
        pattern: req.pattern,
      });
    }

    // Add links
    for (const trace of matrix.traces) {
      // Add task node if not exists
      if (!nodes.find(n => n.id === trace.to)) {
        nodes.push({
          id: trace.to,
          type: 'task',
          label: trace.to,
        });
      }

      links.push({
        source: trace.from,
        target: trace.to,
        type: trace.type,
      });
    }

    return { nodes, links };
  }

  /**
   * Get workflow state
   * @returns {Promise<Object>}
   */
  async getWorkflow() {
    const workflowPath = path.join(this.projectPath, 'steering', 'rules', 'workflow.md');

    if (!(await fs.pathExists(workflowPath))) {
      // Return default workflow stages
      return {
        stages: [
          { id: 1, name: 'Project Memory', status: 'completed' },
          { id: 2, name: 'Requirements', status: 'active' },
          { id: 3, name: 'Design', status: 'pending' },
          { id: 4, name: 'Tasks', status: 'pending' },
          { id: 5, name: 'Implementation', status: 'pending' },
          { id: 6, name: 'Validation', status: 'pending' },
          { id: 7, name: 'Review', status: 'pending' },
          { id: 8, name: 'Reflection', status: 'pending' },
        ],
        currentStage: 2,
      };
    }

    const content = await fs.readFile(workflowPath, 'utf-8');
    return this.parseWorkflow(content);
  }

  /**
   * Parse workflow from content
   * @param {string} content
   * @returns {Object}
   */
  parseWorkflow(content) {
    const stages = [];
    const stageRegex = /#{2,3}\s+(?:Stage\s+)?(\d+)[:\s]+(.+?)(?:\s*\[(\w+)\])?/g;

    let match;
    let currentStage = 1;
    while ((match = stageRegex.exec(content)) !== null) {
      const status = match[3]?.toLowerCase() || 'pending';
      stages.push({
        id: parseInt(match[1], 10),
        name: match[2].trim(),
        status,
      });

      if (status === 'active') {
        currentStage = parseInt(match[1], 10);
      }
    }

    return { stages, currentStage };
  }

  /**
   * Validate the project
   * @returns {Promise<Object>}
   */
  async validate() {
    const results = {
      valid: true,
      errors: [],
      warnings: [],
    };

    // Check for steering directory
    if (!(await this.hasSteering())) {
      results.errors.push({
        type: 'missing-steering',
        message: 'steering/ directory not found',
      });
      results.valid = false;
    }

    // Check for constitution
    const constitution = await this.getConstitution();
    if (!constitution) {
      results.warnings.push({
        type: 'missing-constitution',
        message: 'Constitution file not found',
      });
    }

    // Check for specs
    const specs = await this.getSpecs();
    if (specs.length === 0) {
      results.warnings.push({
        type: 'no-specs',
        message: 'No specification files found',
      });
    }

    // Validate each spec
    for (const spec of specs) {
      if (spec.requirements.length === 0) {
        results.warnings.push({
          type: 'no-requirements',
          message: `Spec ${spec.id} has no requirements`,
          specId: spec.id,
        });
      }
    }

    return results;
  }

  /**
   * Read a markdown file
   * @param {string} filePath
   * @returns {Promise<Object|null>}
   */
  async readMarkdownFile(filePath) {
    try {
      if (!(await fs.pathExists(filePath))) {
        return null;
      }

      const content = await fs.readFile(filePath, 'utf-8');
      const { data, content: body } = matter(content);

      return {
        path: filePath,
        metadata: data,
        content: body,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Read a YAML file
   * @param {string} filePath
   * @returns {Promise<Object|null>}
   */
  async readYamlFile(filePath) {
    try {
      if (!(await fs.pathExists(filePath))) {
        return null;
      }

      const yaml = require('js-yaml');
      const content = await fs.readFile(filePath, 'utf-8');

      return {
        path: filePath,
        data: yaml.load(content),
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache = null;
    this.cacheTime = 0;
  }
}

module.exports = ProjectScanner;
