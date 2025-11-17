# GitHub Copilot Agents - Specification Driven Development

This directory contains 19 professional AI agents for GitHub Copilot, designed to support the complete Specification Driven Development (SDD) workflow.

## Available Agents

### Development & Architecture
- **software-developer**: Full-stack development with modern best practices
- **system-architect**: System design and architectural decisions
- **api-designer**: RESTful and GraphQL API design
- **database-schema-designer**: Database design and optimization

### Code Quality & Review
- **code-reviewer**: Comprehensive code review focusing on quality, security, and SOLID principles
- **bug-hunter**: Systematic bug detection and resolution
- **performance-optimizer**: Performance analysis and optimization
- **orchestrator**: Multi-agent coordination and workflow management

### Testing & Quality Assurance
- **test-engineer**: Comprehensive test strategy and implementation
- **quality-assurance**: QA processes and quality standards

### Security & Operations
- **security-auditor**: Security vulnerability assessment and mitigation
- **devops-engineer**: CI/CD, infrastructure, and deployment automation
- **cloud-architect**: Cloud infrastructure design and optimization
- **database-administrator**: Database management and performance tuning

### Documentation & Project Management
- **technical-writer**: Technical documentation and user guides
- **requirements-analyst**: Requirements gathering and analysis
- **project-manager**: Project planning and team coordination

### Specialized Roles
- **ai-ml-engineer**: Machine learning and AI implementation
- **ui-ux-designer**: User interface and experience design

## Specification Driven Development Workflow

1. **Requirements** → `@requirements-analyst` → Define clear specifications
2. **Architecture** → `@system-architect` → Design scalable systems
3. **API Design** → `@api-designer` → Create REST/GraphQL APIs
4. **Implementation** → `@software-developer` → Write clean, tested code
5. **Quality** → `@code-reviewer` + `@test-engineer` → Ensure excellence
6. **Security** → `@security-auditor` → Verify protection
7. **Deployment** → `@devops-engineer` → Automate delivery

Or let the **Orchestrator** coordinate everything automatically!

## Usage

To use these agents in GitHub Copilot, reference them in your conversations:

```
# Start with requirements
@requirements-analyst Create specifications for a task management system

# Or let Orchestrator handle the full workflow
@orchestrator Build a complete task management system from requirements to deployment

# Individual agent usage
@code-reviewer Please review this pull request
@test-engineer Create comprehensive tests for the auth module
@security-auditor Check for vulnerabilities in the API endpoints
```

## Customization

You can customize these agents by editing the markdown files in the `agents/` directory.
Add your project-specific guidelines, coding standards, and requirements.
