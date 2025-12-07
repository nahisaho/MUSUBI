/**
 * Constants for MUSUBI extension
 */

export const EXTENSION_ID = 'musubi-sdd';
export const EXTENSION_NAME = 'MUSUBI SDD';

export const PLATFORMS = [
  { label: 'Claude Code', value: '--claude', id: 'claude-code' },
  { label: 'GitHub Copilot', value: '--copilot', id: 'github-copilot' },
  { label: 'Cursor', value: '--cursor', id: 'cursor' },
  { label: 'Gemini CLI', value: '--gemini', id: 'gemini-cli' },
  { label: 'Windsurf', value: '--windsurf', id: 'windsurf' },
  { label: 'Codex CLI', value: '--codex', id: 'codex' },
  { label: 'Qwen Code', value: '--qwen', id: 'qwen-code' },
] as const;

export const STEERING_FILES = [
  'product.md',
  'structure.md', 
  'tech.md',
  'product.ja.md',
  'structure.ja.md',
  'tech.ja.md',
  'project.yml',
];

export const SKILLS = [
  'orchestrator',
  'steering',
  'requirements-analyst',
  'system-architect',
  'software-developer',
  'test-engineer',
  'code-reviewer',
  'bug-hunter',
  'security-auditor',
  'performance-optimizer',
  'devops-engineer',
  'database-administrator',
  'database-schema-designer',
  'api-designer',
  'ui-ux-designer',
  'technical-writer',
  'project-manager',
  'release-coordinator',
  'quality-assurance',
  'cloud-architect',
  'ai-ml-engineer',
  'site-reliability-engineer',
  'constitution-enforcer',
  'traceability-auditor',
  'change-impact-analyzer',
  'agent-assistant',
  'issue-resolver',
];

export const CLI_COMMANDS = {
  init: 'npx musubi-sdd init',
  validate: 'npx musubi-sdd validate',
  sync: 'npx musubi-sdd sync',
  status: 'npx musubi-sdd status',
  requirements: 'npx musubi-requirements',
  design: 'npx musubi-design',
  tasks: 'npx musubi-tasks',
  analyze: 'npx musubi-analyze',
  trace: 'npx musubi-trace',
  gaps: 'npx musubi-gaps',
} as const;
