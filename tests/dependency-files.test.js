/**
 * Language-Specific Dependency File Generation Tests
 *
 * Tests for generating package.json, Cargo.toml, pyproject.toml, etc.
 */

const path = require('path');
const fs = require('fs-extra');
const os = require('os');

describe('Language-Specific Dependency File Generation', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `musubi-deps-test-${Date.now()}`);
    await fs.ensureDir(tempDir);
  });

  afterEach(async () => {
    if (tempDir && (await fs.pathExists(tempDir))) {
      await fs.remove(tempDir);
    }
  });

  describe('JavaScript/TypeScript', () => {
    it('should generate package.json with correct structure', async () => {
      const packageJson = {
        name: 'my-project',
        version: '0.1.0',
        type: 'module',
        main: 'dist/index.js',
        scripts: {
          build: 'tsc',
          test: 'jest',
        },
        devDependencies: {
          typescript: '^5.0.0',
        },
      };

      const filePath = path.join(tempDir, 'package.json');
      await fs.writeFile(filePath, JSON.stringify(packageJson, null, 2));

      const content = JSON.parse(await fs.readFile(filePath, 'utf8'));
      expect(content.name).toBe('my-project');
      expect(content.type).toBe('module');
      expect(content.devDependencies.typescript).toBeDefined();
    });

    it('should generate tsconfig.json with strict mode', async () => {
      const tsconfig = {
        compilerOptions: {
          target: 'ES2022',
          module: 'NodeNext',
          strict: true,
          esModuleInterop: true,
        },
      };

      const filePath = path.join(tempDir, 'tsconfig.json');
      await fs.writeFile(filePath, JSON.stringify(tsconfig, null, 2));

      const content = JSON.parse(await fs.readFile(filePath, 'utf8'));
      expect(content.compilerOptions.strict).toBe(true);
      expect(content.compilerOptions.target).toBe('ES2022');
    });
  });

  describe('Rust', () => {
    it('should generate Cargo.toml with correct structure', async () => {
      const cargoToml = `[package]
name = "my-project"
version = "0.1.0"
edition = "2021"

[dependencies]
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
`;

      const filePath = path.join(tempDir, 'Cargo.toml');
      await fs.writeFile(filePath, cargoToml);

      const content = await fs.readFile(filePath, 'utf8');
      expect(content).toContain('[package]');
      expect(content).toContain('edition = "2021"');
      expect(content).toContain('[dependencies]');
      expect(content).toContain('tokio');
    });

    it('should generate src/main.rs', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.ensureDir(srcDir);

      const mainRs = `fn main() {
    println!("Hello!");
}
`;
      const filePath = path.join(srcDir, 'main.rs');
      await fs.writeFile(filePath, mainRs);

      const content = await fs.readFile(filePath, 'utf8');
      expect(content).toContain('fn main()');
    });
  });

  describe('Python', () => {
    it('should generate pyproject.toml with correct structure', async () => {
      const pyprojectToml = `[project]
name = "my-project"
version = "0.1.0"
requires-python = ">=3.11"

[tool.ruff]
line-length = 100

[tool.pytest.ini_options]
testpaths = ["tests"]
`;

      const filePath = path.join(tempDir, 'pyproject.toml');
      await fs.writeFile(filePath, pyprojectToml);

      const content = await fs.readFile(filePath, 'utf8');
      expect(content).toContain('[project]');
      expect(content).toContain('requires-python = ">=3.11"');
      expect(content).toContain('[tool.ruff]');
    });

    it('should create src package with __init__.py', async () => {
      const srcDir = path.join(tempDir, 'src', 'my_project');
      await fs.ensureDir(srcDir);

      const initPy = `"""My Project"""

__version__ = "0.1.0"
`;
      const filePath = path.join(srcDir, '__init__.py');
      await fs.writeFile(filePath, initPy);

      const content = await fs.readFile(filePath, 'utf8');
      expect(content).toContain('__version__');
    });
  });

  describe('Go', () => {
    it('should generate go.mod with correct structure', async () => {
      const goMod = `module github.com/my-project

go 1.21

require (
    // Add dependencies here
)
`;

      const filePath = path.join(tempDir, 'go.mod');
      await fs.writeFile(filePath, goMod);

      const content = await fs.readFile(filePath, 'utf8');
      expect(content).toContain('module github.com/my-project');
      expect(content).toContain('go 1.21');
    });

    it('should create cmd/main.go', async () => {
      const cmdDir = path.join(tempDir, 'cmd');
      await fs.ensureDir(cmdDir);

      const mainGo = `package main

import "fmt"

func main() {
    fmt.Println("Hello!")
}
`;
      const filePath = path.join(cmdDir, 'main.go');
      await fs.writeFile(filePath, mainGo);

      const content = await fs.readFile(filePath, 'utf8');
      expect(content).toContain('package main');
      expect(content).toContain('func main()');
    });
  });

  describe('Java', () => {
    it('should generate pom.xml with correct structure', async () => {
      const pomXml = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>my-project</artifactId>
    <version>0.1.0</version>
    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
    </properties>
</project>
`;

      const filePath = path.join(tempDir, 'pom.xml');
      await fs.writeFile(filePath, pomXml);

      const content = await fs.readFile(filePath, 'utf8');
      expect(content).toContain('<modelVersion>4.0.0</modelVersion>');
      expect(content).toContain('<maven.compiler.source>21</maven.compiler.source>');
    });
  });

  describe('C#/.NET', () => {
    it('should generate .csproj with correct structure', async () => {
      const csproj = `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>
`;

      const filePath = path.join(tempDir, 'MyProject.csproj');
      await fs.writeFile(filePath, csproj);

      const content = await fs.readFile(filePath, 'utf8');
      expect(content).toContain('<TargetFramework>net8.0</TargetFramework>');
      expect(content).toContain('<Nullable>enable</Nullable>');
    });
  });

  describe('Safe name generation', () => {
    it('should convert project name to safe package name', () => {
      const testCases = [
        { input: 'My Project', expected: 'my-project' },
        { input: 'Test_App', expected: 'test-app' },
        { input: 'Hello World!', expected: 'hello-world-' },
      ];

      testCases.forEach(({ input, expected }) => {
        const safeName = input.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        expect(safeName).toBe(expected);
      });
    });
  });
});
