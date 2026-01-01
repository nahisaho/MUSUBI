/**
 * MUSUBI Initialization Generators
 *
 * Generator functions for musubi-init.js
 * Extracted to reduce file size and improve maintainability
 */

const fs = require('fs-extra');

/**
 * Generate language-specific dependency files for single-package projects
 */
async function generateDependencyFiles(primaryLang, answers) {
  const projectName = answers.projectName || 'my-project';
  const safeName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  if (primaryLang === 'javascript') {
    // Check if package.json already exists
    if (!(await fs.pathExists('package.json'))) {
      const packageJson = {
        name: safeName,
        version: '0.1.0',
        description: answers.description || '',
        type: 'module',
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
        scripts: {
          build: 'tsc',
          test: 'jest',
          lint: 'eslint src/',
          format: 'prettier --write .',
        },
        devDependencies: {
          typescript: '^5.0.0',
          '@types/node': '^20.0.0',
          jest: '^29.0.0',
          '@types/jest': '^29.0.0',
          eslint: '^9.0.0',
          prettier: '^3.0.0',
        },
      };
      await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2) + '\n');
    }

    // Generate tsconfig.json
    if (!(await fs.pathExists('tsconfig.json'))) {
      const tsconfig = {
        compilerOptions: {
          target: 'ES2022',
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          declaration: true,
          outDir: './dist',
          rootDir: './src',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
        },
        include: ['src/**/*'],
        exclude: ['node_modules', 'dist'],
      };
      await fs.writeFile('tsconfig.json', JSON.stringify(tsconfig, null, 2) + '\n');
    }
  } else if (primaryLang === 'rust') {
    // Check if Cargo.toml already exists
    if (!(await fs.pathExists('Cargo.toml'))) {
      const cargoToml = `[package]
name = "${safeName}"
version = "0.1.0"
edition = "2021"
description = "${answers.description || ''}"
license = "MIT"

[dependencies]
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
thiserror = "1"
tracing = "0.1"

[dev-dependencies]
tokio-test = "0.4"
`;
      await fs.writeFile('Cargo.toml', cargoToml);

      // Create src/main.rs or src/lib.rs
      await fs.ensureDir('src');
      if (!(await fs.pathExists('src/main.rs')) && !(await fs.pathExists('src/lib.rs'))) {
        const mainRs = `//! ${answers.description || projectName}

fn main() {
    println!("Hello from ${projectName}!");
}
`;
        await fs.writeFile('src/main.rs', mainRs);
      }
    }
  } else if (primaryLang === 'python') {
    // Check if pyproject.toml already exists
    if (!(await fs.pathExists('pyproject.toml'))) {
      const pyprojectToml = `[project]
name = "${safeName}"
version = "0.1.0"
description = "${answers.description || ''}"
requires-python = ">=3.11"
dependencies = []

[project.optional-dependencies]
dev = [
    "pytest>=7.0",
    "ruff>=0.1",
    "mypy>=1.0",
]

[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "W"]

[tool.mypy]
python_version = "3.11"
strict = true

[tool.pytest.ini_options]
testpaths = ["tests"]
`;
      await fs.writeFile('pyproject.toml', pyprojectToml);

      // Create src directory and __init__.py
      const srcDir = `src/${safeName.replace(/-/g, '_')}`;
      await fs.ensureDir(srcDir);
      if (!(await fs.pathExists(`${srcDir}/__init__.py`))) {
        await fs.writeFile(
          `${srcDir}/__init__.py`,
          `"""${answers.description || projectName}"""\n\n__version__ = "0.1.0"\n`
        );
      }
    }
  } else if (primaryLang === 'go') {
    // Check if go.mod already exists
    if (!(await fs.pathExists('go.mod'))) {
      const goMod = `module github.com/${safeName}

go 1.21

require (
    // Add dependencies here
)
`;
      await fs.writeFile('go.mod', goMod);

      // Create main.go
      await fs.ensureDir('cmd');
      if (!(await fs.pathExists('cmd/main.go'))) {
        const mainGo = `package main

import "fmt"

func main() {
    fmt.Println("Hello from ${projectName}!")
}
`;
        await fs.writeFile('cmd/main.go', mainGo);
      }
    }
  } else if (primaryLang === 'java') {
    // Generate pom.xml for Maven
    if (!(await fs.pathExists('pom.xml'))) {
      const pomXml = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>${safeName}</artifactId>
    <version>0.1.0</version>
    <packaging>jar</packaging>

    <name>${projectName}</name>
    <description>${answers.description || ''}</description>

    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.0</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
`;
      await fs.writeFile('pom.xml', pomXml);
    }
  } else if (primaryLang === 'csharp') {
    // Generate .csproj file
    const csprojPath = `${projectName}.csproj`;
    if (!(await fs.pathExists(csprojPath))) {
      const csproj = `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Extensions.Logging" Version="8.0.0" />
  </ItemGroup>

</Project>
`;
      await fs.writeFile(csprojPath, csproj);
    }
  }
}

/**
 * Language information for tech.md generation
 */
const LANG_INFO = {
  javascript: {
    name: 'JavaScript/TypeScript',
    version: 'ES2022+ / TypeScript 5.0+',
    runtime: 'Node.js 20+ LTS, Bun, Deno',
    packageManager: 'npm, pnpm, yarn',
    frameworks: 'React, Vue, Next.js, Express, Fastify',
    testing: 'Jest, Vitest, Playwright',
  },
  python: {
    name: 'Python',
    version: '3.11+',
    runtime: 'CPython, PyPy',
    packageManager: 'pip, poetry, uv',
    frameworks: 'FastAPI, Django, Flask',
    testing: 'pytest, unittest',
  },
  rust: {
    name: 'Rust',
    version: '1.75+ stable',
    runtime: 'Native binary',
    packageManager: 'Cargo',
    frameworks: 'Axum, Actix-web, Tokio',
    testing: 'cargo test, criterion',
  },
  go: {
    name: 'Go',
    version: '1.21+',
    runtime: 'Native binary',
    packageManager: 'Go modules',
    frameworks: 'Gin, Echo, Chi',
    testing: 'go test, testify',
  },
  java: {
    name: 'Java/Kotlin',
    version: 'Java 21 LTS / Kotlin 1.9+',
    runtime: 'JVM, GraalVM',
    packageManager: 'Maven, Gradle',
    frameworks: 'Spring Boot, Quarkus, Ktor',
    testing: 'JUnit 5, Kotest',
  },
  csharp: {
    name: 'C#/.NET',
    version: '.NET 8+',
    runtime: '.NET Runtime',
    packageManager: 'NuGet',
    frameworks: 'ASP.NET Core, MAUI',
    testing: 'xUnit, NUnit',
  },
  cpp: {
    name: 'C/C++',
    version: 'C++20',
    runtime: 'Native binary',
    packageManager: 'vcpkg, Conan',
    frameworks: 'Qt, Boost',
    testing: 'GoogleTest, Catch2',
  },
  swift: {
    name: 'Swift',
    version: '5.9+',
    runtime: 'Native binary',
    packageManager: 'Swift Package Manager',
    frameworks: 'SwiftUI, Vapor',
    testing: 'XCTest',
  },
  ruby: {
    name: 'Ruby',
    version: '3.2+',
    runtime: 'CRuby, JRuby',
    packageManager: 'Bundler, RubyGems',
    frameworks: 'Rails, Sinatra',
    testing: 'RSpec, Minitest',
  },
  php: {
    name: 'PHP',
    version: '8.2+',
    runtime: 'PHP-FPM, Swoole',
    packageManager: 'Composer',
    frameworks: 'Laravel, Symfony',
    testing: 'PHPUnit, Pest',
  },
};

/**
 * Generate language-specific tech.md content
 */
function generateTechMd(languages, answers, _locale) {
  const isUndecided = languages[0] === 'undecided';
  const date = new Date().toISOString().split('T')[0];

  if (isUndecided) {
    return `# Technology Stack

**Project**: ${answers.projectName}
**Last Updated**: ${date}
**Status**: Technology stack to be determined

---

## Overview

The technology stack for this project has not yet been decided. This document will be updated once the technical decisions are made.

## Decision Criteria

When selecting technologies, consider:

1. **Application Type**: What type of application is being built?
2. **Performance Requirements**: What are the performance constraints?
3. **Team Expertise**: What technologies is the team familiar with?
4. **Ecosystem**: What libraries and tools are available?
5. **Long-term Maintainability**: How well-supported is the technology?

## Candidates Under Consideration

| Aspect | Options | Decision |
|--------|---------|----------|
| Primary Language | TBD | ⏳ Pending |
| Web Framework | TBD | ⏳ Pending |
| Database | TBD | ⏳ Pending |
| Hosting | TBD | ⏳ Pending |

## Next Steps

1. [ ] Define functional requirements
2. [ ] Identify performance constraints
3. [ ] Evaluate team skills
4. [ ] Create proof-of-concept
5. [ ] Make final decision and update this document

---

*Run \`musubi steering\` to update this document after decisions are made.*
`;
  }

  // Generate tech.md for selected languages
  const primaryLang = languages[0];
  const primary = LANG_INFO[primaryLang] || { name: primaryLang, version: 'Latest' };

  let languageTable = `### Programming Languages

| Language | Version | Role | Notes |
|----------|---------|------|-------|
`;

  for (let i = 0; i < languages.length; i++) {
    const lang = languages[i];
    const info = LANG_INFO[lang] || { name: lang, version: 'Latest' };
    const role = i === 0 ? 'Primary' : 'Secondary';
    languageTable += `| ${info.name} | ${info.version} | ${role} | ${info.runtime || ''} |\n`;
  }

  let frameworksSection = '';
  for (const lang of languages) {
    const info = LANG_INFO[lang];
    if (info && info.frameworks) {
      frameworksSection += `
### ${info.name} Ecosystem

- **Package Manager**: ${info.packageManager}
- **Frameworks**: ${info.frameworks}
- **Testing**: ${info.testing}
`;
    }
  }

  return `# Technology Stack

**Project**: ${answers.projectName}
**Last Updated**: ${date}
**Version**: 0.1.0

---

## Overview

${answers.description}

---

## Primary Technologies

${languageTable}
${frameworksSection}

---

## Development Environment

### Required Tools

- Primary language runtime (see above)
- Git 2.40+
- IDE: VS Code / JetBrains / Neovim

### Recommended Extensions

- Language-specific LSP
- Linter/Formatter integration
- Test runner integration

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary Language | ${primary.name} | Selected during project initialization |
| Package Manager | ${primary.packageManager || 'TBD'} | Standard for ${primary.name} |

---

## Dependencies

### Production Dependencies

*To be documented as dependencies are added.*

### Development Dependencies

*To be documented as dependencies are added.*

---

*Generated by MUSUBI SDD - Update with \`musubi steering\`*
`;
}

module.exports = {
  generateDependencyFiles,
  generateTechMd,
  LANG_INFO,
};
