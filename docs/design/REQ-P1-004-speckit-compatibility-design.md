# REQ-P1-004: Spec Kit Compatibility - 詳細設計書

## 概要

本ドキュメントは、MUSUBI と GitHub Spec Kit 間の双方向変換機能の詳細設計を定義します。

### 設計目標

1. **完全な双方向変換**: MUSUBI ↔ Spec Kit の相互変換
2. **情報損失最小化**: 変換時のデータ保持率 > 95%
3. **ラウンドトリップ保証**: A → B → A' で A ≈ A'
4. **拡張性**: 将来的に他フォーマット対応可能

## アーキテクチャ

### コンポーネント構成

```
┌─────────────────────────────────────────────────────────────────┐
│                        musubi-convert CLI                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐   │
│  │   Parser    │   │  Converter  │   │      Writer         │   │
│  │  (Source)   │──▶│    (IR)     │──▶│    (Target)         │   │
│  └─────────────┘   └─────────────┘   └─────────────────────┘   │
│         │                 │                     │               │
│  ┌──────┴──────┐   ┌─────┴─────┐        ┌──────┴──────┐       │
│  │ SpecKit     │   │ Internal  │        │ MUSUBI      │       │
│  │ Parser      │   │ Represent │        │ Writer      │       │
│  ├─────────────┤   │ -ation    │        ├─────────────┤       │
│  │ MUSUBI      │   │   (IR)    │        │ SpecKit     │       │
│  │ Parser      │   └───────────┘        │ Writer      │       │
│  └─────────────┘                        └─────────────┘       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐   │
│  │  Validator  │   │   Schema    │   │      Logger         │   │
│  └─────────────┘   └─────────────┘   └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Intermediate Representation (IR) スキーマ

```typescript
// src/converters/ir/types.ts

/**
 * Intermediate Representation for cross-format conversion
 */
interface ProjectIR {
  metadata: ProjectMetadata;
  constitution: ConstitutionIR;
  features: FeatureIR[];
  templates: TemplateIR[];
  memories: MemoryIR[];
}

interface ProjectMetadata {
  name: string;
  version: string;
  sourceFormat: 'musubi' | 'speckit' | 'kiro';
  sourceVersion: string;
  convertedAt: Date;
  preservedFields: Record<string, unknown>;
}

interface ConstitutionIR {
  // MUSUBI 9 Articles mapped
  articles: ArticleIR[];
  // Spec Kit specific sections
  corePrinciples: PrincipleIR[];
  governance: GovernanceIR;
  // Original raw content for lossless conversion
  rawContent?: string;
}

interface ArticleIR {
  number: number;  // 1-9 for MUSUBI
  name: string;
  description: string;
  rules: string[];
  mappedFrom?: string;  // Original section name if converted
}

interface PrincipleIR {
  name: string;
  description: string;
  mappedToArticle?: number;
}

interface GovernanceIR {
  version: string;
  ratified: Date;
  lastAmended: Date;
  rules: string[];
}

interface FeatureIR {
  id: string;           // e.g., "001-photo-albums"
  name: string;
  branch?: string;
  status: 'draft' | 'in-progress' | 'completed';
  createdAt: Date;
  
  specification: SpecificationIR;
  plan?: PlanIR;
  tasks?: TaskIR[];
  research?: ResearchIR;
  dataModel?: DataModelIR;
  contracts?: ContractIR[];
  quickstart?: QuickstartIR;
}

interface SpecificationIR {
  title: string;
  description: string;
  userScenarios: UserScenarioIR[];
  requirements: RequirementIR[];
  successCriteria: string[];
  rawContent?: string;
}

interface UserScenarioIR {
  id: string;
  title: string;
  actor: string;
  action: string;
  benefit: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  acceptanceCriteria: AcceptanceCriterionIR[];
}

interface RequirementIR {
  id: string;           // e.g., "REQ-001"
  title: string;
  pattern: EARSPattern;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  
  // EARS components
  trigger?: string;     // WHEN clause
  condition?: string;   // WHILE/WHERE clause
  action: string;       // SHALL clause
  
  // Full EARS statement
  statement: string;
  
  acceptanceCriteria: AcceptanceCriterionIR[];
  traceability?: string;
  
  // Mapping metadata
  mappedFromUserStory?: string;
}

type EARSPattern = 
  | 'ubiquitous'    // The system SHALL...
  | 'event-driven'  // WHEN [event], the system SHALL...
  | 'state-driven'  // WHILE [state], the system SHALL...
  | 'optional'      // WHERE [feature], the system SHALL...
  | 'complex';      // WHILE [state], WHEN [event], the system SHALL...

interface AcceptanceCriterionIR {
  id: string;
  description: string;
  testable: boolean;
}

interface PlanIR {
  summary: string;
  technicalContext: TechnicalContextIR;
  constitutionCheck: ConstitutionCheckIR[];
  projectStructure: ProjectStructureIR;
  phases: PhaseIR[];
  rawContent?: string;
}

interface TechnicalContextIR {
  language: string;
  version: string;
  framework: string;
  dependencies: string[];
  storage?: string;
  testing: string;
  targetPlatform: string;
  performanceGoals?: string;
  constraints?: string;
  scale?: string;
}

interface ConstitutionCheckIR {
  principle: string;
  status: 'pass' | 'fail' | 'needs-justification';
  notes?: string;
}

interface ProjectStructureIR {
  type: 'single' | 'web' | 'mobile' | 'monorepo';
  directories: DirectoryIR[];
}

interface DirectoryIR {
  path: string;
  purpose: string;
  children?: DirectoryIR[];
}

interface PhaseIR {
  number: number;
  name: string;
  purpose: string;
  prerequisites?: string[];
  outputs: string[];
  tasks: TaskReferenceIR[];
}

interface TaskIR {
  id: string;           // e.g., "T001"
  description: string;
  phase: number;
  userStory?: string;   // e.g., "US1"
  parallel: boolean;
  filePath?: string;
  completed: boolean;
  dependencies?: string[];
}

interface TaskReferenceIR {
  taskId: string;
  order: number;
}

interface ResearchIR {
  decisions: DecisionIR[];
  alternatives: AlternativeIR[];
  rawContent?: string;
}

interface DecisionIR {
  topic: string;
  decision: string;
  rationale: string;
}

interface AlternativeIR {
  name: string;
  pros: string[];
  cons: string[];
  rejected: boolean;
  reason?: string;
}

interface DataModelIR {
  entities: EntityIR[];
  relationships: RelationshipIR[];
  rawContent?: string;
}

interface EntityIR {
  name: string;
  fields: FieldIR[];
  validations: string[];
  stateTransitions?: StateTransitionIR[];
}

interface FieldIR {
  name: string;
  type: string;
  required: boolean;
  unique: boolean;
  description?: string;
}

interface StateTransitionIR {
  from: string;
  to: string;
  trigger: string;
}

interface RelationshipIR {
  from: string;
  to: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  name?: string;
}

interface ContractIR {
  type: 'rest' | 'graphql' | 'grpc' | 'websocket' | 'other';
  name: string;
  endpoints: EndpointIR[];
  rawContent?: string;
}

interface EndpointIR {
  method: string;
  path: string;
  description: string;
  request?: SchemaIR;
  response?: SchemaIR;
  errors?: ErrorIR[];
}

interface SchemaIR {
  type: string;
  properties: Record<string, unknown>;
}

interface ErrorIR {
  code: number | string;
  description: string;
}

interface QuickstartIR {
  scenarios: TestScenarioIR[];
  rawContent?: string;
}

interface TestScenarioIR {
  name: string;
  description: string;
  steps: string[];
  expectedResult: string;
}

interface TemplateIR {
  name: string;
  type: 'spec' | 'plan' | 'tasks' | 'other';
  content: string;
}

interface MemoryIR {
  name: string;
  content: string;
  type: 'context' | 'decision' | 'learning';
}
```

## ファイル構造

```
src/
├── converters/
│   ├── index.js                    # エントリーポイント
│   ├── cli.js                      # CLI インターフェース
│   │
│   ├── ir/
│   │   ├── types.js                # IR 型定義
│   │   └── schema.js               # JSON Schema 定義
│   │
│   ├── parsers/
│   │   ├── index.js                # パーサー共通インターフェース
│   │   ├── musubi-parser.js        # MUSUBI → IR
│   │   └── speckit-parser.js       # Spec Kit → IR
│   │
│   ├── writers/
│   │   ├── index.js                # ライター共通インターフェース
│   │   ├── musubi-writer.js        # IR → MUSUBI
│   │   └── speckit-writer.js       # IR → Spec Kit
│   │
│   ├── mappers/
│   │   ├── constitution-mapper.js  # 憲法マッピング
│   │   ├── requirements-mapper.js  # 要件マッピング (EARS ↔ User Stories)
│   │   ├── tasks-mapper.js         # タスクマッピング
│   │   └── structure-mapper.js     # ディレクトリ構造マッピング
│   │
│   ├── validators/
│   │   ├── ir-validator.js         # IR 検証
│   │   ├── musubi-validator.js     # MUSUBI 形式検証
│   │   └── speckit-validator.js    # Spec Kit 形式検証
│   │
│   └── utils/
│       ├── markdown-utils.js       # Markdown 処理
│       ├── yaml-utils.js           # YAML 処理
│       └── file-utils.js           # ファイル操作
│
├── bin/
│   └── musubi-convert.js           # CLI エントリーポイント
│
└── tests/
    └── converters/
        ├── speckit-parser.test.js
        ├── speckit-writer.test.js
        ├── musubi-parser.test.js
        ├── musubi-writer.test.js
        ├── roundtrip.test.js
        └── fixtures/
            ├── speckit-sample/
            └── musubi-sample/
```

## 変換マッピング

### 1. ディレクトリ構造マッピング

| Spec Kit パス | MUSUBI パス | 備考 |
|--------------|-------------|------|
| `.specify/memory/constitution.md` | `steering/rules/constitution.md` | 内容マッピングあり |
| `.specify/specs/###-feature/spec.md` | `storage/specs/feature/spec.md` | EARS 変換 |
| `.specify/specs/###-feature/plan.md` | `storage/specs/feature/plan.md` | 構造変換 |
| `.specify/specs/###-feature/tasks.md` | `storage/specs/feature/tasks.md` | フォーマット変換 |
| `.specify/specs/###-feature/research.md` | `storage/specs/feature/research.md` | ほぼ直接コピー |
| `.specify/specs/###-feature/data-model.md` | `storage/specs/feature/data-model.md` | ほぼ直接コピー |
| `.specify/specs/###-feature/contracts/` | `storage/specs/feature/contracts/` | 直接コピー |
| `.specify/templates/` | `steering/templates/` | テンプレート変換 |
| (なし) | `steering/product.md` | MUSUBI 固有（生成） |
| (なし) | `steering/structure.md` | MUSUBI 固有（生成） |
| (なし) | `steering/tech.md` | plan.md から抽出 |
| (なし) | `steering/project.yml` | メタデータから生成 |

### 2. 憲法マッピング

#### Spec Kit → MUSUBI 変換

```javascript
// src/converters/mappers/constitution-mapper.js

const MUSUBI_ARTICLES = [
  { number: 1, name: 'Specification Primacy', keywords: ['spec', 'requirement', 'documentation'] },
  { number: 2, name: 'Test-First Development', keywords: ['test', 'quality', 'validation'] },
  { number: 3, name: 'Architectural Compliance', keywords: ['architecture', 'structure', 'design'] },
  { number: 4, name: 'Traceability Requirements', keywords: ['trace', 'track', 'link'] },
  { number: 5, name: 'Change Control Protocol', keywords: ['change', 'version', 'control'] },
  { number: 6, name: 'Separation of Concerns', keywords: ['separation', 'modular', 'concern'] },
  { number: 7, name: 'Documentation Standards', keywords: ['document', 'standard', 'format'] },
  { number: 8, name: 'Continuous Validation', keywords: ['continuous', 'validate', 'check'] },
  { number: 9, name: 'Graceful Degradation', keywords: ['graceful', 'fallback', 'degrade'] }
];

function mapSpeckitToMusubiConstitution(speckitConstitution) {
  const articles = [];
  
  // Map Spec Kit principles to MUSUBI articles
  for (const principle of speckitConstitution.corePrinciples) {
    const matchedArticle = findBestMatchingArticle(principle);
    if (matchedArticle) {
      articles.push({
        number: matchedArticle.number,
        name: matchedArticle.name,
        description: principle.description,
        rules: extractRulesFromPrinciple(principle),
        mappedFrom: principle.name
      });
    }
  }
  
  // Fill missing articles with defaults
  for (const article of MUSUBI_ARTICLES) {
    if (!articles.find(a => a.number === article.number)) {
      articles.push({
        number: article.number,
        name: article.name,
        description: getDefaultDescription(article.number),
        rules: getDefaultRules(article.number),
        mappedFrom: null
      });
    }
  }
  
  return { articles: articles.sort((a, b) => a.number - b.number) };
}
```

### 3. 要件マッピング (User Stories ↔ EARS)

#### User Story → EARS 変換

```javascript
// src/converters/mappers/requirements-mapper.js

function userStoryToEARS(userStory) {
  // User Story: "As a [user], I want to [action] so that [benefit]"
  // EARS: "WHEN [trigger], the system SHALL [action]"
  
  const trigger = `${userStory.actor} initiates ${extractAction(userStory.action)}`;
  const action = `${userStory.action} to enable ${userStory.benefit}`;
  
  return {
    id: generateReqId(userStory.id),
    title: userStory.title,
    pattern: determineEARSPattern(userStory),
    priority: userStory.priority,
    trigger: trigger,
    action: action,
    statement: `WHEN ${trigger}, the system SHALL ${action}.`,
    acceptanceCriteria: userStory.acceptanceCriteria.map(ac => ({
      id: ac.id,
      description: ac.description,
      testable: true
    })),
    mappedFromUserStory: userStory.id
  };
}

function determineEARSPattern(userStory) {
  // Analyze user story to determine best EARS pattern
  const action = userStory.action.toLowerCase();
  
  if (action.includes('always') || action.includes('all')) {
    return 'ubiquitous';
  }
  if (action.includes('when') || action.includes('if')) {
    return 'event-driven';
  }
  if (action.includes('while') || action.includes('during')) {
    return 'state-driven';
  }
  if (action.includes('optionally') || action.includes('can')) {
    return 'optional';
  }
  
  return 'event-driven';  // Default
}
```

#### EARS → User Story 変換

```javascript
function earsToUserStory(requirement) {
  // EARS: "WHEN [trigger], the system SHALL [action]"
  // User Story: "As a [user], I want to [action] so that [benefit]"
  
  const actor = extractActorFromTrigger(requirement.trigger) || 'user';
  const action = requirement.action;
  const benefit = inferBenefitFromContext(requirement);
  
  return {
    id: generateUserStoryId(requirement.id),
    title: requirement.title,
    actor: actor,
    action: action,
    benefit: benefit,
    priority: requirement.priority,
    acceptanceCriteria: requirement.acceptanceCriteria.map(ac => ({
      id: ac.id,
      description: ac.description
    })),
    mappedFromRequirement: requirement.id
  };
}
```

### 4. タスクフォーマット変換

#### Spec Kit タスク形式
```markdown
- [ ] T001 [P] [US1] Create user authentication module at src/auth/
```

#### MUSUBI タスク形式
```markdown
- [ ] T001: Create user authentication module
  - Path: src/auth/
  - User Story: US1
  - Parallel: Yes
  - Status: Not Started
```

```javascript
// src/converters/mappers/tasks-mapper.js

function speckitTaskToMusubi(task) {
  return {
    id: task.id,
    description: task.description,
    phase: task.phase,
    userStory: task.userStory,
    parallel: task.parallel,
    filePath: task.filePath,
    completed: task.completed,
    format: 'musubi'
  };
}

function musubiTaskToSpeckit(task) {
  const parallelMarker = task.parallel ? '[P] ' : '';
  const storyMarker = task.userStory ? `[${task.userStory}] ` : '';
  const checkbox = task.completed ? '[x]' : '[ ]';
  
  return `- ${checkbox} ${task.id} ${parallelMarker}${storyMarker}${task.description}`;
}
```

## CLI インターフェース

### コマンド仕様

```bash
# bin/musubi-convert.js

musubi-convert [command] [options]

Commands:
  from-speckit <path>    Convert Spec Kit project to MUSUBI
  to-speckit             Convert current MUSUBI project to Spec Kit
  validate <format>      Validate project format
  roundtrip <path>       Test roundtrip conversion

Options:
  --output, -o           Output directory (default: current)
  --dry-run              Preview changes without writing
  --verbose, -v          Verbose output
  --force, -f            Overwrite existing files
  --preserve-raw         Keep original content in comments
  --version              Show version
  --help                 Show help

Examples:
  musubi-convert from-speckit ./speckit-project --output ./musubi-project
  musubi-convert to-speckit --output ./speckit-export
  musubi-convert validate speckit ./project
  musubi-convert roundtrip ./speckit-project --verbose
```

### CLI 実装

```javascript
// bin/musubi-convert.js
#!/usr/bin/env node

import { program } from 'commander';
import { 
  convertFromSpeckit, 
  convertToSpeckit, 
  validateFormat, 
  testRoundtrip 
} from '../src/converters/index.js';

program
  .name('musubi-convert')
  .description('Convert between MUSUBI and Spec Kit formats')
  .version('1.0.0');

program
  .command('from-speckit <path>')
  .description('Convert Spec Kit project to MUSUBI')
  .option('-o, --output <dir>', 'Output directory', '.')
  .option('--dry-run', 'Preview changes without writing')
  .option('-v, --verbose', 'Verbose output')
  .option('-f, --force', 'Overwrite existing files')
  .option('--preserve-raw', 'Keep original content')
  .action(async (path, options) => {
    try {
      const result = await convertFromSpeckit(path, options);
      console.log(`✓ Converted ${result.filesConverted} files`);
      if (result.warnings.length > 0) {
        console.log(`⚠ ${result.warnings.length} warnings`);
        result.warnings.forEach(w => console.log(`  - ${w}`));
      }
    } catch (error) {
      console.error(`✗ Conversion failed: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('to-speckit')
  .description('Convert current MUSUBI project to Spec Kit')
  .option('-o, --output <dir>', 'Output directory', './.specify')
  .option('--dry-run', 'Preview changes without writing')
  .option('-v, --verbose', 'Verbose output')
  .option('-f, --force', 'Overwrite existing files')
  .action(async (options) => {
    try {
      const result = await convertToSpeckit(options);
      console.log(`✓ Exported to Spec Kit format: ${result.outputPath}`);
    } catch (error) {
      console.error(`✗ Export failed: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('validate <format> [path]')
  .description('Validate project format (speckit or musubi)')
  .action(async (format, path, options) => {
    try {
      const result = await validateFormat(format, path || '.');
      if (result.valid) {
        console.log(`✓ Valid ${format} project`);
      } else {
        console.log(`✗ Invalid ${format} project`);
        result.errors.forEach(e => console.log(`  - ${e}`));
        process.exit(1);
      }
    } catch (error) {
      console.error(`✗ Validation failed: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('roundtrip <path>')
  .description('Test roundtrip conversion (A → B → A\')')
  .option('-v, --verbose', 'Show detailed diff')
  .action(async (path, options) => {
    try {
      const result = await testRoundtrip(path, options);
      console.log(`Roundtrip test: ${result.passed ? '✓ PASSED' : '✗ FAILED'}`);
      console.log(`  Similarity: ${result.similarity}%`);
      if (!result.passed && options.verbose) {
        console.log('Differences:');
        result.differences.forEach(d => console.log(`  - ${d}`));
      }
    } catch (error) {
      console.error(`✗ Roundtrip test failed: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
```

## 検証スキーマ

### Spec Kit 形式検証

```javascript
// src/converters/validators/speckit-validator.js

const SPECKIT_REQUIRED_FILES = [
  '.specify/memory/constitution.md'
];

const SPECKIT_OPTIONAL_STRUCTURE = [
  '.specify/templates/',
  '.specify/scripts/',
  '.specify/specs/'
];

const SPEC_FILE_SCHEMA = {
  required: ['Feature Specification', 'Requirements', 'Success Criteria'],
  optional: ['User Scenarios', 'Key Entities']
};

async function validateSpeckitProject(projectPath) {
  const errors = [];
  const warnings = [];
  
  // Check required files
  for (const file of SPECKIT_REQUIRED_FILES) {
    if (!await fileExists(path.join(projectPath, file))) {
      errors.push(`Missing required file: ${file}`);
    }
  }
  
  // Check spec files format
  const specsDir = path.join(projectPath, '.specify/specs');
  if (await dirExists(specsDir)) {
    const features = await readdir(specsDir);
    for (const feature of features) {
      const specFile = path.join(specsDir, feature, 'spec.md');
      if (await fileExists(specFile)) {
        const validation = await validateSpecFile(specFile);
        errors.push(...validation.errors);
        warnings.push(...validation.warnings);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
```

## 実装フェーズ

### Phase 1: 基盤（2週間）

| タスク | 成果物 | 優先度 |
|--------|--------|--------|
| IR スキーマ定義 | `src/converters/ir/types.js` | P0 |
| CLI 基盤実装 | `bin/musubi-convert.js` | P0 |
| ファイルユーティリティ | `src/converters/utils/` | P0 |
| 検証スキーマ | `src/converters/validators/` | P1 |

### Phase 2: Spec Kit → MUSUBI（2週間）

| タスク | 成果物 | 優先度 |
|--------|--------|--------|
| Spec Kit パーサー | `src/converters/parsers/speckit-parser.js` | P0 |
| 憲法マッパー | `src/converters/mappers/constitution-mapper.js` | P0 |
| 要件マッパー | `src/converters/mappers/requirements-mapper.js` | P0 |
| MUSUBI ライター | `src/converters/writers/musubi-writer.js` | P0 |
| テスト | `tests/converters/speckit-*.test.js` | P1 |

### Phase 3: MUSUBI → Spec Kit（1週間）

| タスク | 成果物 | 優先度 |
|--------|--------|--------|
| MUSUBI パーサー | `src/converters/parsers/musubi-parser.js` | P0 |
| Spec Kit ライター | `src/converters/writers/speckit-writer.js` | P0 |
| 逆マッピング実装 | マッパー拡張 | P0 |
| テスト | `tests/converters/musubi-*.test.js` | P1 |

### Phase 4: 検証と最適化（1週間）

| タスク | 成果物 | 優先度 |
|--------|--------|--------|
| ラウンドトリップテスト | `tests/converters/roundtrip.test.js` | P0 |
| エッジケース対応 | バグ修正 | P1 |
| ドキュメント | `docs/guides/speckit-migration.md` | P1 |
| パフォーマンス最適化 | 最適化 | P2 |

## テスト戦略

### ユニットテスト

```javascript
// tests/converters/requirements-mapper.test.js

describe('RequirementsMapper', () => {
  describe('userStoryToEARS', () => {
    test('converts basic user story to EARS format', () => {
      const userStory = {
        id: 'US1',
        title: 'User Login',
        actor: 'registered user',
        action: 'log into the system',
        benefit: 'access my personalized dashboard',
        priority: 'P1',
        acceptanceCriteria: [
          { id: 'AC1', description: 'Valid credentials grant access' }
        ]
      };
      
      const result = userStoryToEARS(userStory);
      
      expect(result.pattern).toBe('event-driven');
      expect(result.statement).toContain('WHEN');
      expect(result.statement).toContain('SHALL');
      expect(result.priority).toBe('P1');
    });
    
    test('detects ubiquitous pattern for always-requirements', () => {
      const userStory = {
        id: 'US2',
        actor: 'system',
        action: 'always validate user input',
        benefit: 'maintain data integrity'
      };
      
      const result = userStoryToEARS(userStory);
      
      expect(result.pattern).toBe('ubiquitous');
    });
  });
  
  describe('earsToUserStory', () => {
    test('converts EARS requirement to user story', () => {
      const requirement = {
        id: 'REQ-001',
        title: 'Authentication',
        pattern: 'event-driven',
        trigger: 'user submits login credentials',
        action: 'validate credentials and create session',
        priority: 'P1',
        acceptanceCriteria: []
      };
      
      const result = earsToUserStory(requirement);
      
      expect(result.actor).toBe('user');
      expect(result.action).toContain('validate');
    });
  });
});
```

### 統合テスト

```javascript
// tests/converters/roundtrip.test.js

describe('Roundtrip Conversion', () => {
  test('Spec Kit → MUSUBI → Spec Kit preserves structure', async () => {
    const originalPath = './tests/fixtures/speckit-sample';
    
    // Convert to MUSUBI
    const musubiPath = await convertFromSpeckit(originalPath, { output: tmpDir });
    
    // Convert back to Spec Kit
    process.chdir(musubiPath);
    const speckitPath = await convertToSpeckit({ output: tmpDir2 });
    
    // Compare
    const similarity = await compareProjects(originalPath, speckitPath);
    
    expect(similarity).toBeGreaterThan(0.95);  // 95% similarity
  });
  
  test('preserves all requirements through conversion', async () => {
    const original = await loadSpeckitProject('./tests/fixtures/speckit-sample');
    const converted = await convertFromSpeckit('./tests/fixtures/speckit-sample');
    const reconverted = await convertToSpeckit();
    
    const originalReqs = countRequirements(original);
    const reconvertedReqs = countRequirements(reconverted);
    
    expect(reconvertedReqs).toBe(originalReqs);
  });
});
```

## 受入基準

| 基準 | 検証方法 | ターゲット |
|------|----------|-----------|
| `musubi-convert --to-speckit` が有効な Spec Kit 形式を出力 | Spec Kit validate | ✓ |
| `musubi-convert --from-speckit` が Spec Kit プロジェクトをインポート | MUSUBI validate | ✓ |
| ラウンドトリップ変換で全ての要件データを保持 | roundtrip テスト | > 95% |
| 形式検証が Spec Kit スキーマをパス | スキーマ検証 | ✓ |

## 関連ドキュメント

- [ADR-P1-004: Spec Kit Compatibility](./adr/ADR-P1-004-speckit-compatibility.md)
- [SRS v3.0.0 REQ-P1-004](../requirements/srs/srs-musubi-v3.0.0.md#req-p1-004-spec-kit-compatibility)
- [GitHub Spec Kit](https://github.com/github/spec-kit)
