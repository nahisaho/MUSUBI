/**
 * AST Extractor Tests
 * 
 * Part of MUSUBI v4.1.0 - Codebase Intelligence
 */

const {
  ASTExtractor,
  createASTExtractor,
  extractAST,
  PATTERNS
} = require('../../src/analyzers/ast-extractor');

const path = require('path');
const fs = require('fs');
const os = require('os');

describe('ASTExtractor', () => {
  let extractor;
  let testDir;
  
  beforeEach(async () => {
    extractor = new ASTExtractor();
    testDir = path.join(os.tmpdir(), `musubi-ast-${Date.now()}`);
    await fs.promises.mkdir(testDir, { recursive: true });
  });
  
  afterEach(async () => {
    await fs.promises.rm(testDir, { recursive: true, force: true });
  });
  
  describe('constructor', () => {
    it('should create with default options', () => {
      const ext = new ASTExtractor();
      
      expect(ext.supportedLanguages).toContain('javascript');
      expect(ext.supportedLanguages).toContain('typescript');
      expect(ext.supportedLanguages).toContain('python');
      expect(ext.includeDocstrings).toBe(true);
    });
    
    it('should accept custom options', () => {
      const ext = new ASTExtractor({
        supportedLanguages: ['javascript'],
        includeDocstrings: false,
        extractComments: true
      });
      
      expect(ext.supportedLanguages).toEqual(['javascript']);
      expect(ext.includeDocstrings).toBe(false);
      expect(ext.extractComments).toBe(true);
    });
  });
  
  describe('detectLanguage', () => {
    it('should detect JavaScript', () => {
      expect(extractor.detectLanguage('test.js')).toBe('javascript');
      expect(extractor.detectLanguage('test.mjs')).toBe('javascript');
      expect(extractor.detectLanguage('test.jsx')).toBe('javascript');
    });
    
    it('should detect TypeScript', () => {
      expect(extractor.detectLanguage('test.ts')).toBe('typescript');
      expect(extractor.detectLanguage('test.tsx')).toBe('typescript');
    });
    
    it('should detect Python', () => {
      expect(extractor.detectLanguage('test.py')).toBe('python');
    });
    
    it('should return unknown for unsupported', () => {
      expect(extractor.detectLanguage('test.xyz')).toBe('unknown');
    });
  });
  
  describe('extract JavaScript', () => {
    it('should extract function declarations', () => {
      const code = `
        function hello(name) {
          return 'Hello ' + name;
        }
        
        async function fetchData(url) {
          return fetch(url);
        }
      `;
      
      const ast = extractor.extract(code, 'javascript');
      
      expect(ast.symbols.some(s => s.name === 'hello' && s.type === 'function')).toBe(true);
      expect(ast.symbols.some(s => s.name === 'fetchData' && s.isAsync)).toBe(true);
    });
    
    it('should extract arrow functions', () => {
      const code = `
        const add = (a, b) => a + b;
        const asyncFn = async () => {};
      `;
      
      const ast = extractor.extract(code, 'javascript');
      
      expect(ast.symbols.some(s => s.name === 'add' && s.type === 'function')).toBe(true);
      expect(ast.symbols.some(s => s.name === 'asyncFn' && s.isAsync)).toBe(true);
    });
    
    it('should extract classes', () => {
      const code = `
        class Animal {
          constructor(name) {
            this.name = name;
          }
          
          speak() {
            console.log(this.name);
          }
        }
        
        class Dog extends Animal {
          bark() {
            console.log('Woof!');
          }
        }
      `;
      
      const ast = extractor.extract(code, 'javascript');
      
      const animalClass = ast.symbols.find(s => s.name === 'Animal' && s.type === 'class');
      expect(animalClass).toBeDefined();
      expect(animalClass.methods).toContain('constructor');
      expect(animalClass.methods).toContain('speak');
      
      const dogClass = ast.symbols.find(s => s.name === 'Dog' && s.type === 'class');
      expect(dogClass).toBeDefined();
      expect(dogClass.extends).toBe('Animal');
    });
    
    it('should extract ES6 imports', () => {
      const code = `
        import React from 'react';
        import { useState, useEffect } from 'react';
        import * as utils from './utils';
      `;
      
      const ast = extractor.extract(code, 'javascript');
      
      expect(ast.imports.some(i => i.source === 'react' && i.names.includes('React'))).toBe(true);
      expect(ast.imports.some(i => i.names.includes('useState'))).toBe(true);
      expect(ast.imports.some(i => i.isNamespace && i.names.includes('utils'))).toBe(true);
    });
    
    it('should extract CommonJS require', () => {
      const code = `
        const fs = require('fs');
        const { EventEmitter } = require('events');
      `;
      
      const ast = extractor.extract(code, 'javascript');
      
      expect(ast.imports.some(i => i.source === 'fs')).toBe(true);
      expect(ast.imports.some(i => i.source === 'events' && i.names.includes('EventEmitter'))).toBe(true);
    });
    
    it('should extract exports', () => {
      const code = `
        export function helper() {}
        export const VALUE = 42;
        export class Service {}
        export default function main() {}
        export { other, another };
      `;
      
      const ast = extractor.extract(code, 'javascript');
      
      expect(ast.exports).toContain('helper');
      expect(ast.exports).toContain('VALUE');
      expect(ast.exports).toContain('Service');
    });
    
    it('should extract JSDoc comments', () => {
      const code = `
        /**
         * Calculate the sum of two numbers
         * @param {number} a - First number
         * @param {number} b - Second number
         * @returns {number} The sum
         */
        function add(a, b) {
          return a + b;
        }
      `;
      
      const ast = extractor.extract(code, 'javascript');
      
      const addFunc = ast.symbols.find(s => s.name === 'add');
      expect(addFunc).toBeDefined();
      expect(addFunc.docstring).toContain('Calculate the sum');
    });
  });
  
  describe('extract TypeScript', () => {
    it('should extract interfaces', () => {
      const code = `
        export interface User {
          id: number;
          name: string;
        }
        
        interface Config extends BaseConfig {
          value: string;
        }
      `;
      
      const ast = extractor.extract(code, 'typescript');
      
      expect(ast.symbols.some(s => s.name === 'User' && s.type === 'interface')).toBe(true);
      expect(ast.symbols.some(s => s.name === 'Config' && s.type === 'interface')).toBe(true);
    });
    
    it('should extract type aliases', () => {
      const code = `
        export type ID = string | number;
        type Handler<T> = (value: T) => void;
      `;
      
      const ast = extractor.extract(code, 'typescript');
      
      expect(ast.symbols.some(s => s.name === 'ID' && s.type === 'type')).toBe(true);
      expect(ast.symbols.some(s => s.name === 'Handler' && s.type === 'type')).toBe(true);
    });
    
    it('should extract enums', () => {
      const code = `
        export enum Status {
          Pending,
          Active,
          Completed
        }
        
        const enum Direction {
          Up,
          Down
        }
      `;
      
      const ast = extractor.extract(code, 'typescript');
      
      expect(ast.symbols.some(s => s.name === 'Status' && s.type === 'enum')).toBe(true);
      expect(ast.symbols.some(s => s.name === 'Direction' && s.type === 'enum')).toBe(true);
    });
  });
  
  describe('extract Python', () => {
    it('should extract function definitions', () => {
      const code = `
def hello(name):
    return f"Hello {name}"

async def fetch_data(url):
    return await get(url)
      `;
      
      const ast = extractor.extract(code, 'python');
      
      expect(ast.symbols.some(s => s.name === 'hello' && s.type === 'function')).toBe(true);
      expect(ast.symbols.some(s => s.name === 'fetch_data' && s.isAsync)).toBe(true);
    });
    
    it('should extract class definitions', () => {
      const code = `
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        print(self.name)

class Dog(Animal):
    def bark(self):
        print("Woof!")
      `;
      
      const ast = extractor.extract(code, 'python');
      
      const animalClass = ast.symbols.find(s => s.name === 'Animal' && s.type === 'class');
      expect(animalClass).toBeDefined();
      expect(animalClass.methods).toContain('__init__');
      expect(animalClass.methods).toContain('speak');
      
      const dogClass = ast.symbols.find(s => s.name === 'Dog' && s.type === 'class');
      expect(dogClass).toBeDefined();
      expect(dogClass.extends).toContain('Animal');
    });
    
    it('should extract imports', () => {
      const code = `
from os import path, getcwd
import json
import pandas as pd
from typing import List, Dict
      `;
      
      const ast = extractor.extract(code, 'python');
      
      expect(ast.imports.some(i => i.source === 'os' && i.names.includes('path'))).toBe(true);
      expect(ast.imports.some(i => i.source === 'json')).toBe(true);
      expect(ast.imports.some(i => i.source === 'pandas')).toBe(true);
    });
    
    it('should extract docstrings', () => {
      const code = `
def add(a, b):
    """
    Calculate the sum of two numbers.
    
    Args:
        a: First number
        b: Second number
    
    Returns:
        The sum of a and b
    """
    return a + b
      `;
      
      const ast = extractor.extract(code, 'python');
      
      const addFunc = ast.symbols.find(s => s.name === 'add');
      expect(addFunc).toBeDefined();
      expect(addFunc.docstring).toContain('Calculate the sum');
    });
    
    it('should detect private symbols', () => {
      const code = `
def public_func():
    pass

def _private_func():
    pass

class _PrivateClass:
    pass
      `;
      
      const ast = extractor.extract(code, 'python');
      
      const publicFunc = ast.symbols.find(s => s.name === 'public_func');
      expect(publicFunc.visibility).toBe('public');
      
      const privateFunc = ast.symbols.find(s => s.name === '_private_func');
      expect(privateFunc.visibility).toBe('private');
    });
  });
  
  describe('extractFromFile', () => {
    it('should extract from JavaScript file', async () => {
      const filePath = path.join(testDir, 'test.js');
      await fs.promises.writeFile(filePath, `
        function greet(name) {
          return 'Hello ' + name;
        }
        module.exports = { greet };
      `);
      
      const ast = await extractor.extractFromFile(filePath);
      
      expect(ast.language).toBe('javascript');
      expect(ast.symbols.some(s => s.name === 'greet')).toBe(true);
    });
    
    it('should return unsupported for unknown files', async () => {
      const filePath = path.join(testDir, 'test.xyz');
      await fs.promises.writeFile(filePath, 'some content');
      
      const ast = await extractor.extractFromFile(filePath);
      
      expect(ast.language).toBe('unknown');
      expect(ast.metadata.supported).toBe(false);
    });
  });
  
  describe('toSummary', () => {
    it('should generate readable summary', () => {
      const code = `
        import { helper } from './utils';
        
        /**
         * Main entry point
         */
        export class App {
          run() {}
        }
        
        export function init() {}
      `;
      
      const ast = extractor.extract(code, 'javascript');
      const summary = extractor.toSummary(ast);
      
      expect(summary).toContain('Classes');
      expect(summary).toContain('App');
      expect(summary).toContain('Functions');
      expect(summary).toContain('Dependencies');
    });
  });
  
  describe('caching', () => {
    it('should cache results', () => {
      const code = 'function test() {}';
      const ast = extractor.extract(code, 'javascript', 'test.js');
      
      extractor.addToCache('test.js', 12345, ast);
      const cached = extractor.getFromCache('test.js', 12345);
      
      expect(cached).toEqual(ast);
    });
    
    it('should return null for cache miss', () => {
      const cached = extractor.getFromCache('nonexistent.js', 0);
      expect(cached).toBeNull();
    });
    
    it('should clear cache', () => {
      const ast = extractor.extract('function x() {}', 'javascript');
      extractor.addToCache('test.js', 0, ast);
      
      extractor.clearCache();
      
      expect(extractor.getFromCache('test.js', 0)).toBeNull();
    });
  });
  
  describe('events', () => {
    it('should emit events during extraction', () => {
      const events = [];
      extractor.on('extract:start', () => events.push('start'));
      extractor.on('extract:complete', () => events.push('complete'));
      
      extractor.extract('function test() {}', 'javascript');
      
      expect(events).toContain('start');
      expect(events).toContain('complete');
    });
  });
});

describe('createASTExtractor', () => {
  it('should create extractor instance', () => {
    const ext = createASTExtractor();
    expect(ext).toBeInstanceOf(ASTExtractor);
  });
  
  it('should pass options', () => {
    const ext = createASTExtractor({ includeDocstrings: false });
    expect(ext.includeDocstrings).toBe(false);
  });
});

describe('extractAST', () => {
  it('should extract from file', async () => {
    const testDir = path.join(os.tmpdir(), `musubi-extract-${Date.now()}`);
    await fs.promises.mkdir(testDir, { recursive: true });
    
    const filePath = path.join(testDir, 'test.js');
    await fs.promises.writeFile(filePath, 'const x = 1;');
    
    try {
      const ast = await extractAST(filePath);
      expect(ast.language).toBe('javascript');
    } finally {
      await fs.promises.rm(testDir, { recursive: true, force: true });
    }
  });
});

describe('PATTERNS', () => {
  it('should have JavaScript patterns', () => {
    expect(PATTERNS.javascript).toBeDefined();
    expect(PATTERNS.javascript.functionDecl).toBeDefined();
    expect(PATTERNS.javascript.classDecl).toBeDefined();
  });
  
  it('should have TypeScript patterns', () => {
    expect(PATTERNS.typescript).toBeDefined();
    expect(PATTERNS.typescript.interfaceDecl).toBeDefined();
    expect(PATTERNS.typescript.typeDecl).toBeDefined();
  });
  
  it('should have Python patterns', () => {
    expect(PATTERNS.python).toBeDefined();
    expect(PATTERNS.python.functionDef).toBeDefined();
    expect(PATTERNS.python.classDef).toBeDefined();
  });
});
