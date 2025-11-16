#!/usr/bin/env python3
"""
Convert existing .claude/agents/*.md to new Skills API format in src/templates/skills/
"""

import os
import re
from pathlib import Path

# Skill metadata: trigger terms and allowed tools for each skill
SKILL_METADATA = {
    "orchestrator": {
        "trigger_terms": "orchestrate, coordinate, multi-agent, workflow, execution plan, task breakdown, agent selection, project planning, complex task, full lifecycle, end-to-end development, comprehensive solution",
        "allowed_tools": ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "TodoWrite"],
    },
    "steering": {
        "trigger_terms": "steering, project memory, codebase analysis, auto-update context, generate steering, architecture patterns, tech stack analysis, project structure, analyze codebase, understand project",
        "allowed_tools": ["Read", "Write", "Bash", "Glob", "Grep"],
    },
    "requirements-analyst": {
        "trigger_terms": "requirements, EARS format, user stories, functional requirements, non-functional requirements, SRS, requirement analysis, specification, acceptance criteria, requirement validation",
        "allowed_tools": ["Read", "Write", "Edit", "Bash"],
    },
    "project-manager": {
        "trigger_terms": "project management, project plan, WBS, Gantt chart, risk management, sprint planning, milestone tracking, project timeline, resource allocation, stakeholder management",
        "allowed_tools": ["Read", "Write", "Edit", "TodoWrite"],
    },
    "system-architect": {
        "trigger_terms": "architecture, system design, C4 model, ADR, architecture decision, design patterns, component design, architecture diagram, microservices, monolith, scalability",
        "allowed_tools": ["Read", "Write", "Edit", "Bash", "Glob", "Grep"],
    },
    "api-designer": {
        "trigger_terms": "API design, REST API, GraphQL, OpenAPI, API specification, endpoint design, API contract, API documentation, gRPC, API versioning",
        "allowed_tools": ["Read", "Write", "Edit", "Bash"],
    },
    "database-schema-designer": {
        "trigger_terms": "database design, schema design, ER diagram, normalization, DDL, database modeling, relational database, NoSQL design, data modeling, migration plan",
        "allowed_tools": ["Read", "Write", "Edit", "Bash"],
    },
    "ui-ux-designer": {
        "trigger_terms": "UI design, UX design, wireframe, mockup, prototype, user interface, user experience, design system, component library, accessibility, responsive design",
        "allowed_tools": ["Read", "Write", "Edit"],
    },
    "software-developer": {
        "trigger_terms": "implement, code, development, programming, coding, build feature, create function, write code, SOLID principles, clean code, refactor",
        "allowed_tools": ["Read", "Write", "Edit", "Bash", "Glob", "Grep"],
    },
    "test-engineer": {
        "trigger_terms": "testing, unit tests, integration tests, E2E tests, test cases, test coverage, test automation, test plan, test design, TDD, test-first",
        "allowed_tools": ["Read", "Write", "Edit", "Bash", "Glob", "Grep"],
    },
    "code-reviewer": {
        "trigger_terms": "code review, review code, code quality, best practices, SOLID principles, code smells, refactoring suggestions, code analysis, static analysis",
        "allowed_tools": ["Read", "Grep", "Glob", "Bash"],
    },
    "bug-hunter": {
        "trigger_terms": "bug fix, debug, troubleshoot, root cause analysis, error investigation, fix bug, resolve issue, error analysis, stack trace",
        "allowed_tools": ["Read", "Write", "Edit", "Bash", "Glob", "Grep"],
    },
    "quality-assurance": {
        "trigger_terms": "QA, quality assurance, test strategy, QA plan, quality metrics, test planning, quality gates, acceptance testing, regression testing",
        "allowed_tools": ["Read", "Write", "Edit", "Bash"],
    },
    "security-auditor": {
        "trigger_terms": "security audit, vulnerability scan, OWASP, security analysis, penetration testing, security review, threat modeling, security best practices, CVE",
        "allowed_tools": ["Read", "Grep", "Glob", "Bash"],
    },
    "performance-optimizer": {
        "trigger_terms": "performance optimization, performance tuning, profiling, benchmark, bottleneck analysis, scalability, latency optimization, memory optimization, query optimization",
        "allowed_tools": ["Read", "Write", "Edit", "Bash", "Glob", "Grep"],
    },
    "devops-engineer": {
        "trigger_terms": "CI/CD, DevOps, pipeline, Docker, Kubernetes, deployment automation, containerization, infrastructure automation, GitHub Actions, GitLab CI",
        "allowed_tools": ["Read", "Write", "Edit", "Bash", "Glob"],
    },
    "cloud-architect": {
        "trigger_terms": "cloud architecture, AWS, Azure, GCP, cloud infrastructure, IaC, Terraform, CloudFormation, cloud design, serverless, cloud migration",
        "allowed_tools": ["Read", "Write", "Edit", "Bash"],
    },
    "database-administrator": {
        "trigger_terms": "database administration, DBA, database tuning, performance tuning, backup recovery, high availability, database monitoring, query optimization, index optimization",
        "allowed_tools": ["Read", "Write", "Edit", "Bash", "Grep"],
    },
    "technical-writer": {
        "trigger_terms": "documentation, technical writing, API documentation, README, user guide, developer guide, tutorial, runbook, technical docs",
        "allowed_tools": ["Read", "Write", "Edit", "Glob"],
    },
    "ai-ml-engineer": {
        "trigger_terms": "machine learning, ML, AI, model training, MLOps, model deployment, feature engineering, model evaluation, neural network, deep learning",
        "allowed_tools": ["Read", "Write", "Edit", "Bash", "Glob", "Grep"],
    },
}

def convert_agent_to_skill(agent_name: str, source_dir: Path, dest_dir: Path):
    """Convert a single agent file to Skills API format"""

    source_file = source_dir / f"{agent_name}.md"
    dest_file = dest_dir / agent_name / "SKILL.md"

    if not source_file.exists():
        print(f"⚠️  Source file not found: {source_file}")
        return False

    # Read existing content
    with open(source_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract existing YAML frontmatter (if any)
    yaml_match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
    if yaml_match:
        old_yaml = yaml_match.group(1)
        main_content = yaml_match.group(2)

        # Extract existing description
        desc_match = re.search(r'description:\s*"([^"]+)"', old_yaml)
        if desc_match:
            base_description = desc_match.group(1)
        else:
            base_description = f"{agent_name} skill"
    else:
        main_content = content
        base_description = f"{agent_name} skill"

    # Get metadata for this skill
    metadata = SKILL_METADATA.get(agent_name, {
        "trigger_terms": agent_name.replace("-", " "),
        "allowed_tools": ["Read", "Write", "Bash", "Glob"]
    })

    # Build new YAML frontmatter with Skills API format
    trigger_terms = metadata["trigger_terms"]
    allowed_tools_str = ", ".join(metadata["allowed_tools"])

    new_yaml = f"""---
name: {agent_name}
description: |
  {base_description}

  Trigger terms: {trigger_terms}

  Use when: User requests involve {agent_name.replace("-", " ")} tasks.
allowed-tools: [{allowed_tools_str}]
---"""

    # Combine new YAML with existing content
    new_content = new_yaml + "\n" + main_content

    # Ensure destination directory exists
    dest_file.parent.mkdir(parents=True, exist_ok=True)

    # Write the new SKILL.md file
    with open(dest_file, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"✅ Converted: {agent_name}")
    return True

def main():
    """Convert all agents to Skills API format"""

    project_root = Path(__file__).parent
    source_dir = project_root / ".claude" / "agents"
    dest_dir = project_root / "src" / "templates" / "skills"

    print(f"Converting agents from: {source_dir}")
    print(f"To skills directory: {dest_dir}")
    print()

    success_count = 0
    total_count = len(SKILL_METADATA)

    for agent_name in SKILL_METADATA.keys():
        if convert_agent_to_skill(agent_name, source_dir, dest_dir):
            success_count += 1

    print()
    print(f"✅ Conversion complete: {success_count}/{total_count} skills converted")

if __name__ == "__main__":
    main()
