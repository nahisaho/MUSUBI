# Ultimate SDD Tool - Claude Code Skills Implementation Blueprint

**Based on comprehensive analysis of 6 SDD frameworks + Claude Code Skills standards + Gap Analysis**
**Target**: Production-ready Specification Driven Development tool using Claude Code Skills API
**Version**: 3.0 - 25 Skills Architecture (Complete SDD Workflow Coverage)

---

## 🎯 Vision Statement

Build a Specification Driven Development tool that:
- **Scales** from simple 2-file workflows to complex 25-skill orchestrations
- **Adapts** to greenfield (0→1) and brownfield (1→n) projects seamlessly
- **Enforces** quality through constitutional governance and validation gates
- **Tracks** all changes with delta specs and full traceability
- **Integrates** with Claude Code via Skills API (model-invoked, not user-invoked)
- **Maintains** consistency through auto-updating project memory
- **Enables** parallel execution with intelligent task decomposition
- **Ensures** testability with EARS format and test-first workflow
- **Completes** all 8 SDD workflow stages (Research → Monitoring)
- **Validates** 100% compliance with 9 Constitutional Articles

---

## 📊 What's New in v3.0

### Major Additions (20 → 25 Skills)

**5 Critical Skills Added**:

1. **site-reliability-engineer** - Production monitoring, observability, SLO/SLI management, incident response
   - **Completes**: SDD Stage 8 (Monitoring)
   - **Category**: Infrastructure & Operations

2. **traceability-auditor** - Requirements ↔ Design ↔ Code ↔ Test traceability validation
   - **Enforces**: Constitutional Article V (Traceability Mandate)
   - **Category**: Quality & Review

3. **constitution-enforcer** - Constitutional governance and Phase -1 Gates validation
   - **Enforces**: All 9 Constitutional Articles
   - **Category**: Orchestration & Management

4. **change-impact-analyzer** - Brownfield change analysis and delta spec validation
   - **Supports**: OpenSpec-style change management
   - **Category**: Requirements & Planning

5. **release-coordinator** - Multi-component release management, versioning, changelog generation
   - **Bridges**: Gap between devops-engineer and project-manager
   - **Category**: Infrastructure & Operations

### Coverage Improvements

| Metric | v2.0 (20 Skills) | v3.0 (25 Skills) | Improvement |
|--------|------------------|------------------|-------------|
| SDD Workflow Stages | 7/8 (87.5%) | 8/8 (100%) | ✅ Complete |
| Constitutional Articles Enforced | Partial | 9/9 (100%) | ✅ Complete |
| Governance Automation | Manual | Automated | ✅ Skill-driven |
| Brownfield Support | Basic | Advanced | ✅ Impact analysis |
| Traceability | Self-validated | Audited | ✅ Independent validation |

---

## 📐 Architecture Design

### Core Components

```
ultimate-sdd/
├── .claude/
│   └── skills/                         # Claude Code Skills (model-invoked) - 25 TOTAL
│       ├── orchestrator/               # 1. Master coordinator skill
│       │   ├── SKILL.md                # Main skill definition with YAML
│       │   ├── patterns.md             # Orchestration patterns
│       │   └── selection-matrix.md     # Skill selection logic (25 skills)
│       │
│       ├── steering/                   # 2. Project memory manager skill
│       │   ├── SKILL.md                # Auto-update project context
│       │   ├── auto-update-rules.md    # Trigger rules
│       │   └── templates/
│       │       ├── structure.md        # Architecture patterns template
│       │       ├── tech.md             # Tech stack template
│       │       └── product.md          # Business context template
│       │
│       ├── constitution-enforcer/      # 3. NEW: Constitutional governance skill
│       │   ├── SKILL.md
│       │   ├── phase-minus-one-gates.md
│       │   ├── constitutional-articles.md
│       │   └── examples/
│       │
│       ├── requirements-analyst/       # 4. EARS format requirements skill
│       │   ├── SKILL.md
│       │   ├── ears-format.md          # EARS syntax guide
│       │   ├── validation-rules.md     # Requirements validation
│       │   └── examples/
│       │       └── sample-srs.md
│       │
│       ├── change-impact-analyzer/     # 5. NEW: Brownfield change analysis skill
│       │   ├── SKILL.md
│       │   ├── delta-spec-guide.md
│       │   ├── impact-analysis-template.md
│       │   └── examples/
│       │
│       ├── project-manager/            # 6. Project management skill
│       │   ├── SKILL.md
│       │   ├── planning-templates.md
│       │   ├── risk-management.md
│       │   └── examples/
│       │
│       ├── system-architect/           # 7. C4 + ADR design skill
│       │   ├── SKILL.md
│       │   ├── c4-model-guide.md       # C4 diagram standards
│       │   ├── adr-template.md         # Architecture decision records
│       │   └── examples/
│       │       └── sample-design.md
│       │
│       ├── api-designer/               # 8. API design skill
│       │   ├── SKILL.md
│       │   ├── openapi-template.yaml   # OpenAPI 3.0 template
│       │   ├── graphql-template.graphql
│       │   └── examples/
│       │
│       ├── database-schema-designer/   # 9. Database design skill
│       │   ├── SKILL.md
│       │   ├── er-diagram-guide.md
│       │   ├── normalization-rules.md
│       │   └── examples/
│       │
│       ├── ui-ux-designer/             # 10. UI/UX design skill
│       │   ├── SKILL.md
│       │   ├── wireframe-guide.md
│       │   ├── design-system-template.md
│       │   └── examples/
│       │
│       ├── software-developer/         # 11. Code implementation skill
│       │   ├── SKILL.md
│       │   ├── solid-principles.md
│       │   ├── test-first-workflow.md
│       │   └── examples/
│       │
│       ├── test-engineer/              # 12. Testing skill
│       │   ├── SKILL.md
│       │   ├── test-types.md           # Unit/Integration/E2E
│       │   ├── ears-test-mapping.md
│       │   └── examples/
│       │
│       ├── code-reviewer/              # 13. Code review skill
│       │   ├── SKILL.md
│       │   ├── review-checklist.md
│       │   ├── best-practices.md
│       │   └── examples/
│       │
│       ├── bug-hunter/                 # 14. Bug investigation skill
│       │   ├── SKILL.md
│       │   ├── root-cause-analysis.md
│       │   └── examples/
│       │
│       ├── traceability-auditor/       # 15. NEW: Traceability validation skill
│       │   ├── SKILL.md
│       │   ├── coverage-matrix-template.md
│       │   ├── gap-detection-rules.md
│       │   └── examples/
│       │
│       ├── quality-assurance/          # 16. QA strategy skill
│       │   ├── SKILL.md
│       │   ├── qa-plan-template.md
│       │   └── examples/
│       │
│       ├── security-auditor/           # 17. Security audit skill
│       │   ├── SKILL.md
│       │   ├── owasp-top-10.md
│       │   ├── vulnerability-patterns.md
│       │   └── examples/
│       │
│       ├── performance-optimizer/      # 18. Performance tuning skill
│       │   ├── SKILL.md
│       │   ├── optimization-patterns.md
│       │   ├── benchmark-template.md
│       │   └── examples/
│       │
│       ├── devops-engineer/            # 19. CI/CD skill
│       │   ├── SKILL.md
│       │   ├── pipeline-templates/
│       │   │   ├── github-actions.yml
│       │   │   └── gitlab-ci.yml
│       │   └── examples/
│       │
│       ├── release-coordinator/        # 20. NEW: Release management skill
│       │   ├── SKILL.md
│       │   ├── release-plan-template.md
│       │   ├── feature-flag-guide.md
│       │   └── examples/
│       │
│       ├── cloud-architect/            # 21. Cloud infrastructure skill
│       │   ├── SKILL.md
│       │   ├── aws-patterns.md
│       │   ├── azure-patterns.md
│       │   ├── terraform-templates/
│       │   └── examples/
│       │
│       ├── site-reliability-engineer/  # 22. NEW: SRE/monitoring skill
│       │   ├── SKILL.md
│       │   ├── slo-sli-guide.md
│       │   ├── observability-patterns.md
│       │   ├── incident-response-template.md
│       │   └── examples/
│       │
│       ├── database-administrator/     # 23. Database operations skill
│       │   ├── SKILL.md
│       │   ├── tuning-guide.md
│       │   ├── backup-recovery.md
│       │   └── examples/
│       │
│       ├── technical-writer/           # 24. Documentation skill
│       │   ├── SKILL.md
│       │   ├── doc-templates/
│       │   └── examples/
│       │
│       └── ai-ml-engineer/             # 25. ML engineering skill
│           ├── SKILL.md
│           ├── mlops-guide.md
│           ├── model-card-template.md
│           └── examples/
│
├── .claude/commands/                   # Slash commands (user-invoked)
│   ├── sdd-constitution.md             # Initialize governance
│   ├── sdd-steering.md                 # Generate project memory
│   ├── sdd-requirements.md             # Create requirements
│   ├── sdd-design.md                   # Generate design
│   ├── sdd-tasks.md                    # Break down tasks
│   ├── sdd-implement.md                # Execute implementation
│   ├── sdd-change-init.md              # Start change proposal
│   ├── sdd-change-apply.md             # Apply change
│   ├── sdd-change-archive.md           # Archive completed change
│   ├── sdd-validate-requirements.md    # Validate EARS format
│   ├── sdd-validate-design.md          # Validate architecture
│   ├── sdd-validate-traceability.md    # NEW: Check traceability (uses traceability-auditor)
│   ├── sdd-validate-constitution.md    # NEW: Check constitutional compliance (uses constitution-enforcer)
│   ├── sdd-validate-coverage.md        # Check test coverage
│   ├── sdd-list.md                     # List features/changes
│   └── sdd-show.md                     # Show item details
│
├── steering/                           # Project memory (auto-generated)
│   ├── structure.md                    # Architecture patterns, naming
│   ├── tech.md                         # Tech stack, frameworks
│   ├── product.md                      # Business context, users
│   └── rules/
│       ├── constitution.md             # 9 immutable articles
│       ├── workflow.md                 # 8-stage SDD workflow
│       ├── ears-format.md              # EARS syntax reference
│       └── agent-validation-checklist.md
│
├── templates/                          # Document templates
│   ├── constitution.md                 # Constitutional template
│   ├── requirements.md                 # EARS requirements template
│   ├── research.md                     # Research template
│   ├── design.md                       # C4 + ADR template
│   ├── tasks.md                        # P-labeled tasks template
│   ├── proposal.md                     # Change proposal template
│   └── specs/                          # Capability spec templates
│
├── orchestration/                      # Multi-skill coordination
│   ├── patterns/
│   │   ├── auto-pattern.md             # Automatic skill selection
│   │   ├── sequential.md               # Linear execution
│   │   ├── nested.md                   # Hierarchical delegation
│   │   ├── group-chat.md               # Multi-skill discussion
│   │   ├── swarm.md                    # Parallel execution
│   │   └── human-loop.md               # Validation gates
│   └── dependency-chains.md            # Skill dependencies (25 skills)
│
├── validators/                         # Quality gates (Python scripts)
│   ├── ears-format.py                  # EARS syntax validation
│   ├── constitutional.py               # Phase -1 Gates
│   ├── coverage.py                     # Requirements coverage
│   ├── traceability.py                 # NEW: Traceability matrix validation
│   ├── delta-format.py                 # Delta spec validation
│   ├── scenario-format.py              # Scenario formatting
│   └── consistency.py                  # Cross-artifact analysis
│
├── storage/                            # Project data structure
│   ├── specs/                          # Current truth
│   │   └── [capability]/
│   │       ├── spec.md
│   │       └── design.md
│   ├── changes/                        # Proposals
│   │   ├── [change-id]/
│   │   │   ├── proposal.md
│   │   │   ├── tasks.md
│   │   │   ├── design.md
│   │   │   ├── impact-analysis.md     # NEW: From change-impact-analyzer
│   │   │   └── specs/
│   │   └── archive/                    # Completed changes
│   └── features/                       # Feature branches
│       └── [feature-id]/
│           ├── requirements.md
│           ├── research.md
│           ├── design.md
│           └── tasks.md
│
└── cli/                                # Command-line interface (optional)
    ├── sdd.py                          # Main CLI entry point
    ├── commands/
    └── utils/
```

---

## 🤖 All 25 Skills - Complete Categorization

### Skill Distribution by Category

| Category | Count | Skills |
|----------|-------|--------|
| **Orchestration & Management** | 3 | orchestrator, steering, constitution-enforcer |
| **Requirements & Planning** | 3 | requirements-analyst, project-manager, change-impact-analyzer |
| **Architecture & Design** | 4 | system-architect, api-designer, database-schema-designer, ui-ux-designer |
| **Development & Implementation** | 2 | software-developer, ai-ml-engineer |
| **Quality & Review** | 5 | code-reviewer, bug-hunter, traceability-auditor, security-auditor, performance-optimizer |
| **QA** | 2 | test-engineer, quality-assurance |
| **Infrastructure & Operations** | 5 | devops-engineer, release-coordinator, cloud-architect, site-reliability-engineer, database-administrator |
| **Documentation** | 1 | technical-writer |
| **TOTAL** | **25** | |

---

## 🆕 New Skills - Complete Specifications

### Skill 21: Site Reliability Engineer (SRE)

**File**: `.claude/skills/site-reliability-engineer/SKILL.md`

```yaml
---
name: site-reliability-engineer
description: |
  Production monitoring, observability, SLO/SLI management, and incident response.

  Trigger terms: monitoring, observability, SRE, site reliability, alerting, incident response,
  SLO, SLI, error budget, Prometheus, Grafana, Datadog, New Relic, ELK stack, logs, metrics,
  traces, on-call, production monitoring, health checks, uptime, availability, dashboards,
  post-mortem, incident management, runbook.

  Completes SDD Stage 8 (Monitoring) with comprehensive production observability:
  - SLI/SLO definitions and tracking
  - Monitoring stack setup (Prometheus, Grafana, ELK, Datadog, etc.)
  - Alert rules and notification channels
  - Incident response runbooks
  - Observability dashboards (logs, metrics, traces)
  - Post-mortem templates and analysis
  - Health check endpoints
  - Error budget tracking

  Use when: user needs production monitoring, observability platform, alerting, SLOs,
  incident response, or post-deployment health tracking.
allowed-tools: [Read, Write, Bash, Glob]
---

# Site Reliability Engineer (SRE) Skill

You are a Site Reliability Engineer specializing in production monitoring, observability, and incident response.

## Responsibilities

1. **SLI/SLO Definition**: Define Service Level Indicators and Objectives
2. **Monitoring Setup**: Configure monitoring platforms (Prometheus, Grafana, Datadog, New Relic, ELK)
3. **Alerting**: Create alert rules and notification channels
4. **Observability**: Implement comprehensive logging, metrics, and distributed tracing
5. **Incident Response**: Design incident response workflows and runbooks
6. **Post-Mortem**: Template and facilitate blameless post-mortems
7. **Health Checks**: Implement readiness and liveness probes
8. **Error Budgets**: Track and report error budget consumption

## SLO/SLI Framework

### Service Level Indicators (SLIs)
Examples:
- **Availability**: % of successful requests (e.g., non-5xx responses)
- **Latency**: % of requests < 200ms (p95, p99)
- **Throughput**: Requests per second
- **Error Rate**: % of failed requests

### Service Level Objectives (SLOs)
Examples:
```markdown
## SLO: API Availability
- **SLI**: Percentage of successful API requests (HTTP 200-399)
- **Target**: 99.9% availability (43.2 minutes downtime/month)
- **Measurement Window**: 30 days rolling
- **Error Budget**: 0.1% (43.2 minutes/month)
```

## Monitoring Stack Templates

### Prometheus + Grafana (Open Source)
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'api'
    static_configs:
      - targets: ['localhost:8080']
    metrics_path: '/metrics'
```

### Alert Rules
```yaml
# alerts.yml
groups:
  - name: api_alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }}% over last 5 minutes"
```

### Grafana Dashboard Template
```json
{
  "dashboard": {
    "title": "API Monitoring",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [{"expr": "rate(http_requests_total[5m])"}]
      },
      {
        "title": "Error Rate",
        "targets": [{"expr": "rate(http_requests_total{status=~\"5..\"}[5m])"}]
      },
      {
        "title": "Latency (p95)",
        "targets": [{"expr": "histogram_quantile(0.95, http_request_duration_seconds_bucket)"}]
      }
    ]
  }
}
```

## Incident Response Workflow

```markdown
# Incident Response Runbook

## Phase 1: Detection (Automated)
- Alert triggers via monitoring system
- Notification sent to on-call engineer
- Incident ticket auto-created

## Phase 2: Triage (< 5 minutes)
1. Acknowledge alert
2. Check monitoring dashboards
3. Assess severity (SEV-1/2/3)
4. Escalate if needed

## Phase 3: Investigation (< 30 minutes)
1. Review recent deployments
2. Check logs (ELK/CloudWatch/Datadog)
3. Analyze metrics and traces
4. Identify root cause

## Phase 4: Mitigation
- **If deployment issue**: Rollback via release-coordinator
- **If infrastructure issue**: Scale/restart via devops-engineer
- **If application bug**: Hotfix via bug-hunter

## Phase 5: Recovery Verification
1. Confirm SLI metrics return to normal
2. Monitor error rate for 30 minutes
3. Update incident ticket

## Phase 6: Post-Mortem (Within 48 hours)
- Use post-mortem template
- Conduct blameless review
- Identify action items
- Update runbooks
```

## Observability Architecture

### Three Pillars of Observability

#### 1. Logs (Structured Logging)
```typescript
// Example: Structured log format
{
  "timestamp": "2025-11-16T12:00:00Z",
  "level": "error",
  "service": "user-api",
  "trace_id": "abc123",
  "span_id": "def456",
  "user_id": "user-789",
  "error": "Database connection timeout",
  "latency_ms": 5000
}
```

#### 2. Metrics (Time-Series Data)
```
# Prometheus metrics examples
http_requests_total{method="GET", status="200"} 1500
http_request_duration_seconds_bucket{le="0.1"} 1200
http_request_duration_seconds_bucket{le="0.5"} 1450
```

#### 3. Traces (Distributed Tracing)
```
User Request
  ├─ API Gateway (50ms)
  ├─ Auth Service (20ms)
  ├─ User Service (150ms)
  │   ├─ Database Query (100ms)
  │   └─ Cache Lookup (10ms)
  └─ Response (10ms)
Total: 240ms
```

## Post-Mortem Template

```markdown
# Post-Mortem: [Incident Title]

**Date**: [YYYY-MM-DD]
**Duration**: [Start time] - [End time] ([Total duration])
**Severity**: [SEV-1/2/3]
**Affected Services**: [List services]
**Impact**: [Number of users, requests, revenue impact]

## Timeline

| Time | Event |
|------|-------|
| 12:00 | Alert triggered: High error rate |
| 12:05 | On-call engineer acknowledged |
| 12:15 | Root cause identified: Database connection pool exhausted |
| 12:30 | Mitigation: Increased connection pool size |
| 12:45 | Service recovered, monitoring continues |

## Root Cause

[Detailed explanation of what caused the incident]

## Resolution

[Detailed explanation of how the incident was resolved]

## Action Items

- [ ] Increase database connection pool default size
- [ ] Add alert for connection pool saturation
- [ ] Update capacity planning documentation
- [ ] Conduct load testing with higher concurrency

## Lessons Learned

**What Went Well**:
- Alert detection was immediate
- Rollback procedure worked smoothly

**What Could Be Improved**:
- Connection pool monitoring was missing
- Load testing didn't cover this scenario
```

## Health Check Endpoints

```typescript
// Readiness probe (is service ready to handle traffic?)
app.get('/health/ready', async (req, res) => {
  try {
    await database.ping();
    await redis.ping();
    res.status(200).json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message });
  }
});

// Liveness probe (is service alive?)
app.get('/health/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});
```

## Integration with Other Skills

- **Before**: devops-engineer deploys application to production
- **After**:
  - Monitors production health
  - Triggers bug-hunter for incidents
  - Triggers release-coordinator for rollbacks
  - Reports to project-manager on SLO compliance
- **Uses**: steering/tech.md for monitoring stack selection

## Workflow

### Phase 1: SLO Definition (Based on Requirements)
1. Read `storage/features/[feature]/requirements.md`
2. Identify non-functional requirements (performance, availability)
3. Define SLIs and SLOs
4. Calculate error budgets

### Phase 2: Monitoring Stack Setup
1. Check `steering/tech.md` for approved monitoring tools
2. Configure monitoring platform (Prometheus, Grafana, Datadog, etc.)
3. Implement instrumentation in application code
4. Set up centralized logging (ELK, Splunk, CloudWatch)

### Phase 3: Alerting Configuration
1. Create alert rules based on SLOs
2. Configure notification channels (PagerDuty, Slack, email)
3. Define escalation policies
4. Test alerting workflow

### Phase 4: Dashboard Creation
1. Design observability dashboards
2. Include RED metrics (Rate, Errors, Duration)
3. Add business metrics
4. Create service dependency maps

### Phase 5: Runbook Development
1. Document common incident scenarios
2. Create step-by-step resolution guides
3. Include rollback procedures
4. Review with team

### Phase 6: Continuous Improvement
1. Review post-mortems monthly
2. Update runbooks based on incidents
3. Refine SLOs based on actual performance
4. Optimize alerting (reduce false positives)

## Best Practices

1. **Alerting Philosophy**: Alert on symptoms (user impact), not causes
2. **Error Budgets**: Use error budgets to balance speed and reliability
3. **Blameless Post-Mortems**: Focus on systems, not people
4. **Observability First**: Instrument before deploying
5. **Runbook Maintenance**: Update runbooks after every incident
6. **SLO Review**: Revisit SLOs quarterly

## Output Format

```markdown
# SRE Deliverables: [Feature Name]

## 1. SLI/SLO Definitions

### API Availability SLO
- **SLI**: HTTP 200-399 responses / Total requests
- **Target**: 99.9% (43.2 min downtime/month)
- **Window**: 30-day rolling
- **Error Budget**: 0.1%

### API Latency SLO
- **SLI**: 95th percentile response time
- **Target**: < 200ms
- **Window**: 24 hours
- **Error Budget**: 5% of requests can exceed 200ms

## 2. Monitoring Configuration

### Prometheus Scrape Configs
[Configuration files]

### Grafana Dashboards
[Dashboard JSON exports]

### Alert Rules
[Alert rule YAML files]

## 3. Incident Response

### Runbooks
- [Link to runbook files]

### On-Call Rotation
- [PagerDuty/Opsgenie configuration]

## 4. Observability

### Logging
- **Stack**: ELK/CloudWatch/Datadog
- **Format**: JSON structured logging
- **Retention**: 30 days

### Metrics
- **Stack**: Prometheus + Grafana
- **Retention**: 90 days
- **Aggregation**: 15-second intervals

### Tracing
- **Stack**: Jaeger/Zipkin/Datadog APM
- **Sampling**: 10% of requests
- **Retention**: 7 days

## 5. Health Checks

- **Readiness**: `/health/ready` - Database, cache, dependencies
- **Liveness**: `/health/live` - Application heartbeat

## 6. Requirements Traceability

| Requirement ID | SLO | Monitoring |
|----------------|-----|------------|
| REQ-NF-001: Response time < 2s | Latency SLO: p95 < 200ms | Prometheus latency histogram |
| REQ-NF-002: 99% uptime | Availability SLO: 99.9% | Uptime monitoring |
```

## Project Memory Integration

**ALWAYS check steering files before starting**:
- `steering/structure.md` - Follow existing patterns
- `steering/tech.md` - Use approved monitoring stack
- `steering/product.md` - Understand business context
- `steering/rules/constitution.md` - Follow governance rules

## Validation Checklist

Before finishing:
- [ ] SLIs/SLOs defined for all non-functional requirements
- [ ] Monitoring stack configured
- [ ] Alert rules created and tested
- [ ] Dashboards created with RED metrics
- [ ] Runbooks documented
- [ ] Health check endpoints implemented
- [ ] Post-mortem template created
- [ ] On-call rotation configured
- [ ] Traceability to requirements established
```

---

### Skill 22: Traceability Auditor

**File**: `.claude/skills/traceability-auditor/SKILL.md`

```yaml
---
name: traceability-auditor
description: |
  Validates complete requirements traceability across EARS requirements → design → tasks → code → tests.

  Trigger terms: traceability, requirements coverage, coverage matrix, traceability matrix,
  requirement mapping, test coverage, EARS coverage, requirements tracking, traceability audit,
  gap detection, orphaned requirements, untested code, coverage validation, traceability analysis.

  Enforces Constitutional Article V (Traceability Mandate) with comprehensive validation:
  - Requirement → Design mapping (100% coverage)
  - Design → Task mapping
  - Task → Code implementation mapping
  - Code → Test mapping (100% coverage)
  - Gap detection (orphaned requirements, untested code)
  - Coverage percentage reporting
  - Traceability matrix generation

  Use when: user needs traceability validation, coverage analysis, gap detection,
  or requirements tracking across the full development lifecycle.
allowed-tools: [Read, Glob, Grep]
---

# Traceability Auditor Skill

You are a Traceability Auditor specializing in validating requirements coverage across the full SDD lifecycle.

## Responsibilities

1. **Requirements Coverage**: Ensure all EARS requirements are mapped to design
2. **Design Coverage**: Ensure all design components are mapped to tasks
3. **Task Coverage**: Ensure all tasks are implemented in code
4. **Test Coverage**: Ensure all requirements have corresponding tests
5. **Gap Detection**: Identify orphaned requirements and untested code
6. **Matrix Generation**: Create comprehensive traceability matrices
7. **Reporting**: Generate coverage percentage reports

## Traceability Chain

```
EARS Requirement (REQ-001)
  ↓ (mapped in design.md)
Architectural Component (Auth Service)
  ↓ (mapped in tasks.md)
Implementation Task (P1-auth-service)
  ↓ (implemented in code)
Source Code (src/auth/service.ts)
  ↓ (tested by)
Test Suite (tests/auth/service.test.ts)
```

**Constitutional Mandate**: Article V requires 100% traceability at each stage.

## Traceability Matrix Template

```markdown
# Traceability Matrix: [Feature Name]

## Forward Traceability (Requirements → Tests)

| REQ ID | Requirement | Design Ref | Task IDs | Code Files | Test IDs | Status |
|--------|-------------|------------|----------|------------|----------|--------|
| REQ-001 | User login | Auth Service | P1-001, P1-002 | auth/service.ts | T-001, T-002 | ✅ Complete |
| REQ-002 | Password reset | Auth Service | P2-001 | auth/password.ts | T-003 | ✅ Complete |
| REQ-003 | 2FA | Auth Service | — | — | — | ❌ Not Implemented |

## Backward Traceability (Tests → Requirements)

| Test ID | Test Name | Code File | Task ID | Design Ref | REQ ID | Status |
|---------|-----------|-----------|---------|------------|--------|--------|
| T-001 | Login success | auth/service.ts | P1-001 | Auth Service | REQ-001 | ✅ Traced |
| T-002 | Login failure | auth/service.ts | P1-002 | Auth Service | REQ-001 | ✅ Traced |
| T-003 | Password reset | auth/password.ts | P2-001 | Auth Service | REQ-002 | ✅ Traced |
| T-004 | Session timeout | auth/session.ts | — | — | — | ⚠️ Orphaned Test |

## Coverage Summary

- **Requirements Coverage**: 2/3 (66.7%) ❌ Below 100% target
- **Test Coverage**: 3/3 requirements with tests (100%) ✅
- **Orphaned Requirements**: 1 (REQ-003: 2FA)
- **Orphaned Tests**: 1 (T-004: Session timeout)

## Gaps Identified

### Missing Implementation
- **REQ-003**: Two-factor authentication (no tasks, code, or tests)

### Orphaned Tests
- **T-004**: Session timeout test has no corresponding requirement

### Recommendations
1. Create requirement for session timeout or remove test
2. Implement REQ-003 (2FA) or defer to next release
3. Update traceability matrix after addressing gaps
```

## Audit Workflow

### Phase 1: Collect Artifacts
1. Read `storage/features/[feature]/requirements.md`
2. Read `storage/features/[feature]/design.md`
3. Read `storage/features/[feature]/tasks.md`
4. Scan source code for implementation
5. Scan test files for test cases

### Phase 2: Forward Traceability Analysis

#### Step 1: Requirements → Design
```python
# Pseudocode
for each requirement in requirements.md:
    if requirement.id not found in design.md:
        report_gap("Requirement {id} not mapped to design")
```

#### Step 2: Design → Tasks
```python
for each component in design.md:
    if component not referenced in tasks.md:
        report_gap("Component {name} not mapped to tasks")
```

#### Step 3: Tasks → Code
```python
for each task in tasks.md:
    if task.file_path not exists:
        report_gap("Task {id} not implemented")
```

#### Step 4: Code → Tests
```python
for each code_file in implementation:
    if no test_file found:
        report_gap("Code file {file} has no tests")
```

### Phase 3: Backward Traceability Analysis

#### Step 1: Tests → Requirements
```python
for each test in test_files:
    if test.requirement_id not in requirements.md:
        report_orphan("Test {id} has no requirement")
```

### Phase 4: Coverage Calculation

```python
requirements_total = count(requirements.md)
requirements_with_design = count(requirements mapped in design.md)
requirements_with_tests = count(requirements mapped in test_files)

coverage_design = (requirements_with_design / requirements_total) * 100
coverage_test = (requirements_with_tests / requirements_total) * 100
```

### Phase 5: Report Generation

```markdown
# Traceability Audit Report

**Date**: [YYYY-MM-DD]
**Feature**: [Feature Name]
**Auditor**: traceability-auditor

## Executive Summary

- **Overall Traceability**: ❌ Incomplete (66.7%)
- **Requirements Implemented**: 2/3 (66.7%)
- **Requirements Tested**: 2/3 (66.7%)
- **Orphaned Items**: 2 (1 requirement, 1 test)

## Detailed Analysis

[Traceability matrix as shown above]

## Recommendations

1. **HIGH**: Implement or defer REQ-003 (2FA)
2. **MEDIUM**: Create requirement for session timeout test
3. **LOW**: Review orphaned test T-004 for removal

## Constitutional Compliance

- **Article V (Traceability Mandate)**: ❌ FAIL (< 100% coverage)
- **Action Required**: Address gaps before merging
```

## Integration with Other Skills

- **Before**:
  - requirements-analyst creates requirements
  - system-architect creates design
  - software-developer implements code
  - test-engineer creates tests
- **After**:
  - If gaps found → orchestrator triggers missing skills
  - If complete → quality-assurance approves release
- **Uses**: All spec files in `storage/features/` and `storage/changes/`

## Gap Detection Rules

### Orphaned Requirements
**Definition**: Requirements with no corresponding design, tasks, code, or tests

**Detection**:
```bash
# Find all REQ-IDs in requirements.md
grep -oP 'REQ-\d+' requirements.md > req_ids.txt

# Check if each REQ-ID appears in design.md
for req_id in req_ids.txt:
    if not grep -q "$req_id" design.md:
        report_orphan(req_id)
```

### Orphaned Tests
**Definition**: Tests with no corresponding requirements

**Detection**:
```bash
# Find all test files
find tests/ -name "*.test.*"

# Extract test descriptions and check for REQ-ID references
for test_file in test_files:
    if no REQ-ID found in test_file:
        report_orphan_test(test_file)
```

### Untested Code
**Definition**: Source files with no corresponding test files

**Detection**:
```bash
# For each source file, check if test file exists
for src_file in src/**/*.ts:
    test_file = src_file.replace("src/", "tests/").replace(".ts", ".test.ts")
    if not exists(test_file):
        report_untested(src_file)
```

## Best Practices

1. **Continuous Auditing**: Run after every skill completes work
2. **Fail Fast**: Block merges if traceability < 100%
3. **Automate**: Integrate traceability validation into CI/CD
4. **Clear Reporting**: Use visual indicators (✅ ❌ ⚠️)
5. **Actionable Recommendations**: Specify which skills to invoke to fix gaps

## Output Format

```markdown
# Traceability Audit: [Feature Name]

## Coverage Metrics

- **Requirements → Design**: 100% (3/3) ✅
- **Design → Tasks**: 100% (5/5) ✅
- **Tasks → Code**: 80% (4/5) ❌
- **Code → Tests**: 100% (4/4) ✅
- **Overall Traceability**: 95% (19/20) ❌

## Gaps

### Missing Implementation
- **Task P3-005**: "Implement password strength validator" (no code found)

### Recommendations
1. Implement P3-005 or mark as deferred
2. Re-run traceability audit after implementation
3. Achieve 100% coverage before release

## Traceability Matrix
[Full matrix as shown in template above]

## Constitutional Compliance
- **Article V**: ❌ FAIL (95% < 100% required)
```

## Project Memory Integration

**ALWAYS check steering files before starting**:
- `steering/structure.md` - Understand file organization
- `steering/tech.md` - Identify test framework conventions
- `steering/rules/constitution.md` - Article V traceability requirements

## Validation Checklist

Before finishing:
- [ ] All requirements have design mappings
- [ ] All design components have task mappings
- [ ] All tasks have code implementations
- [ ] All code has test coverage
- [ ] Traceability matrix generated
- [ ] Coverage percentages calculated
- [ ] Gaps identified with recommendations
- [ ] Constitutional compliance assessed
```

---

### Skill 23: Constitution Enforcer

**File**: `.claude/skills/constitution-enforcer/SKILL.md`

```yaml
---
name: constitution-enforcer
description: |
  Validates compliance with 9 Constitutional Articles and Phase -1 Gates before implementation.

  Trigger terms: constitution, governance, compliance, validation, constitutional compliance,
  Phase -1 Gates, simplicity gate, anti-abstraction gate, test-first, library-first,
  EARS compliance, governance validation, constitutional audit, compliance check, gate validation.

  Enforces all 9 Constitutional Articles with automated validation:
  - Article I: Library-First Principle
  - Article II: CLI Interface Mandate
  - Article III: Test-First Imperative
  - Article IV: EARS Requirements Format
  - Article V: Traceability Mandate
  - Article VI: Project Memory
  - Article VII: Simplicity Gate
  - Article VIII: Anti-Abstraction Gate
  - Article IX: Integration-First Testing

  Runs Phase -1 Gates before any implementation begins.

  Use when: validating project governance, checking constitutional compliance,
  or enforcing quality gates before implementation.
allowed-tools: [Read, Glob, Grep]
---

# Constitution Enforcer Skill

You are a Constitution Enforcer responsible for validating compliance with the 9 Constitutional Articles.

## Responsibilities

1. **Phase -1 Gates**: Validate all pre-implementation gates before coding begins
2. **Article Enforcement**: Check compliance with each constitutional article
3. **Violation Detection**: Identify and report governance violations
4. **Complexity Tracking**: Document justified exceptions
5. **Remediation Plans**: Provide actionable steps to achieve compliance

## 9 Constitutional Articles

### Article I: Library-First Principle

**Rule**: Every feature MUST begin as a standalone library.

**Validation**:
```bash
# Check if feature is in a library directory
if implementation in /app/ or /web/ without /lib/ first:
    FAIL: "Feature implemented directly in application"
```

**Example Compliance**:
```
✅ PASS: Feature in lib/auth/ with CLI interface
❌ FAIL: Feature in app/auth/ without library abstraction
```

---

### Article II: CLI Interface Mandate

**Rule**: All libraries MUST expose CLI interfaces.

**Validation**:
```bash
# Check for CLI entry point
if library exists and no cli.ts or __main__.py:
    FAIL: "Library missing CLI interface"
```

**Example Compliance**:
```
✅ PASS: lib/auth/cli.ts exists with --login, --logout flags
❌ FAIL: lib/auth/ has no CLI entry point
```

---

### Article III: Test-First Imperative

**Rule**: NON-NEGOTIABLE: No code before tests.

**Validation**:
```bash
# Check git history
for commit in feature_branch:
    if code committed before test:
        FAIL: "Code committed before tests (Test-First violation)"
```

**Example Compliance**:
```
✅ PASS: tests/auth.test.ts committed before src/auth.ts
❌ FAIL: src/auth.ts committed first
```

---

### Article IV: EARS Requirements Format

**Rule**: All requirements MUST use EARS patterns.

**Validation**:
```bash
# Check requirements.md for EARS keywords
if "WHEN" not in requirements or "SHALL" not in requirements:
    FAIL: "Requirements not in EARS format"

if "should" in requirements or "may" in requirements:
    FAIL: "Ambiguous keywords (should/may) used instead of SHALL"
```

**Example Compliance**:
```
✅ PASS: "WHEN user clicks login, system SHALL validate credentials"
❌ FAIL: "User should be able to log in" (ambiguous)
```

---

### Article V: Traceability Mandate

**Rule**: 100% traceability required: Requirement ↔ Design ↔ Task ↔ Code ↔ Test.

**Validation**:
```bash
# Use traceability-auditor skill
coverage = run_traceability_audit()
if coverage < 100%:
    FAIL: "Traceability coverage {coverage}% < 100%"
```

**Example Compliance**:
```
✅ PASS: All requirements traced to tests (100%)
❌ FAIL: REQ-003 has no corresponding test (66.7% coverage)
```

---

### Article VI: Project Memory

**Rule**: All skills MUST check steering before work.

**Validation**:
```bash
# Check if steering files exist and are referenced
if steering/* exists:
    if skill output does not reference steering:
        WARN: "Skill did not check project memory"
```

**Example Compliance**:
```
✅ PASS: Design references steering/structure.md patterns
❌ FAIL: Implementation ignores steering/tech.md stack
```

---

### Article VII: Simplicity Gate

**Rule**: Maximum 3 projects initially, no future-proofing.

**Validation**:
```bash
# Count directories/projects
project_count = count_projects()
if project_count > 3:
    if no justification in complexity-tracking.md:
        FAIL: "More than 3 projects without justification"
```

**Example Compliance**:
```
✅ PASS: Using 1 monorepo (< 3 projects)
❌ FAIL: Created 5 microservices without justification
```

---

### Article VIII: Anti-Abstraction Gate

**Rule**: Use framework features directly, single model representation.

**Validation**:
```bash
# Check for wrapper patterns
if code wraps framework (e.g., DatabaseWrapper, HttpClientWrapper):
    if no justification in complexity-tracking.md:
        FAIL: "Unnecessary abstraction layer created"
```

**Example Compliance**:
```
✅ PASS: Using Prisma ORM directly
❌ FAIL: Created custom DatabaseClient wrapping Prisma
```

---

### Article IX: Integration-First Testing

**Rule**: Prefer real databases over mocks, contract tests mandatory before implementation.

**Validation**:
```bash
# Check test files for mocking patterns
if tests use mock_database or stub_service:
    WARN: "Using mocks instead of real services"

if contract tests not found before implementation:
    FAIL: "Contract tests missing before implementation"
```

**Example Compliance**:
```
✅ PASS: Tests use real PostgreSQL via Docker
❌ FAIL: Tests use in-memory mock database
```

---

## Phase -1 Gates Checklist

**Run BEFORE any implementation begins**:

```markdown
# Phase -1: Pre-Implementation Gates

**Feature**: [Feature Name]
**Date**: [YYYY-MM-DD]

## Gate 1: Simplicity Gate (Article VII)
- [ ] Using ≤3 projects?
- [ ] No future-proofing?
- [ ] If FAIL: Documented in `complexity-tracking.md`?

**Result**: ✅ PASS / ❌ FAIL
**Notes**: [Justification if failed]

## Gate 2: Anti-Abstraction Gate (Article VIII)
- [ ] Using framework directly (no wrappers)?
- [ ] Single model representation?
- [ ] If FAIL: Documented in `complexity-tracking.md`?

**Result**: ✅ PASS / ❌ FAIL
**Notes**: [Justification if failed]

## Gate 3: Integration-First Gate (Article IX)
- [ ] Contract tests defined?
- [ ] Contract tests written?
- [ ] Using real services in tests (not mocks)?

**Result**: ✅ PASS / ❌ FAIL
**Notes**: [Justification if failed]

## Gate 4: EARS Compliance Gate (Article IV)
- [ ] All requirements in EARS format?
- [ ] No ambiguous SHALL/SHOULD?
- [ ] Each requirement testable?

**Result**: ✅ PASS / ❌ FAIL
**Notes**: [Validation report]

## Gate 5: Traceability Gate (Article V)
- [ ] Coverage matrix shows 100%?
- [ ] All requirements mapped to design?
- [ ] All design mapped to tasks?

**Result**: ✅ PASS / ❌ FAIL
**Notes**: [Coverage percentage]

## Gate 6: Steering Alignment Gate (Article VI)
- [ ] Checked `steering/structure.md`?
- [ ] Followed `steering/tech.md` stack?
- [ ] Aligned with `steering/product.md` goals?

**Result**: ✅ PASS / ❌ FAIL
**Notes**: [Alignment verification]

## Gate 7: Library-First Gate (Article I)
- [ ] Feature begins as library?
- [ ] No direct application implementation?

**Result**: ✅ PASS / ❌ FAIL
**Notes**: [Library path]

## Gate 8: CLI Interface Gate (Article II)
- [ ] Library exposes CLI?
- [ ] CLI accepts text input/output?
- [ ] CLI supports JSON?

**Result**: ✅ PASS / ❌ FAIL
**Notes**: [CLI interface details]

## Gate 9: Test-First Gate (Article III)
- [ ] Tests written before code?
- [ ] Red-Green-Refactor cycle followed?

**Result**: ✅ PASS / ❌ FAIL
**Notes**: [Git commit history verification]

---

## Overall Result

**PASS Count**: [X/9]
**FAIL Count**: [Y/9]

**Decision**:
- ✅ **APPROVED**: All gates passed or justified exceptions documented
- ❌ **BLOCKED**: Address failures before proceeding to implementation

**Next Steps**:
[List remediation actions if blocked]
```

## Workflow

### Phase 1: Pre-Validation Setup
1. Read `steering/rules/constitution.md`
2. Identify which articles apply to current feature
3. Prepare Phase -1 Gates checklist

### Phase 2: Article-by-Article Validation
For each constitutional article:
1. Read validation criteria
2. Check relevant artifacts (requirements, design, code, tests)
3. Determine PASS/FAIL status
4. Document findings

### Phase 3: Gate Execution
Run all Phase -1 Gates:
1. Simplicity Gate
2. Anti-Abstraction Gate
3. Integration-First Gate
4. EARS Compliance Gate
5. Traceability Gate
6. Steering Alignment Gate
7. Library-First Gate
8. CLI Interface Gate
9. Test-First Gate

### Phase 4: Report Generation
```markdown
# Constitutional Compliance Report

**Feature**: User Authentication
**Date**: 2025-11-16
**Enforcer**: constitution-enforcer

## Executive Summary

- **Gates Passed**: 7/9 (77.8%)
- **Gates Failed**: 2/9 (22.2%)
- **Overall Status**: ❌ BLOCKED

## Failed Gates

### Gate 3: Integration-First Gate
- **Issue**: Tests use mock database instead of real PostgreSQL
- **Article**: Article IX - Integration-First Testing
- **Severity**: HIGH
- **Remediation**: Replace mocks with Testcontainers PostgreSQL

### Gate 5: Traceability Gate
- **Issue**: REQ-003 (2FA) not implemented (66.7% coverage)
- **Article**: Article V - Traceability Mandate
- **Severity**: CRITICAL
- **Remediation**: Implement REQ-003 or defer to next release

## Recommendations

1. **CRITICAL**: Achieve 100% traceability (invoke traceability-auditor)
2. **HIGH**: Replace mock database with real database in tests
3. **MEDIUM**: Document exceptions in `complexity-tracking.md`

## Approval Status

❌ **BLOCKED** - Implementation cannot proceed until critical failures are addressed.
```

### Phase 5: Remediation Coordination
If failures detected:
1. Notify orchestrator of blocking issues
2. Recommend which skills to invoke for remediation
3. Re-run validation after fixes applied

## Integration with Other Skills

- **Before**: Runs BEFORE software-developer, test-engineer
- **After**:
  - If PASS → Implementation proceeds
  - If FAIL → orchestrator triggers remediation skills
- **Uses**:
  - requirements-analyst output (EARS validation)
  - traceability-auditor output (traceability validation)
  - steering files (alignment validation)

## Best Practices

1. **Enforce Early**: Run Phase -1 Gates before any code is written
2. **Fail Fast**: Block implementation immediately if critical gates fail
3. **Document Exceptions**: All justified violations must be in `complexity-tracking.md`
4. **Automate**: Integrate into CI/CD pipeline for continuous enforcement
5. **Review Regularly**: Revisit constitutional compliance monthly

## Output Format

```markdown
# Phase -1 Gates Validation Report

**Feature**: [Feature Name]
**Date**: [YYYY-MM-DD]
**Status**: ✅ APPROVED / ❌ BLOCKED

## Gates Summary

| Gate | Article | Status | Notes |
|------|---------|--------|-------|
| Simplicity | VII | ✅ PASS | Using 1 monorepo |
| Anti-Abstraction | VIII | ✅ PASS | No framework wrappers |
| Integration-First | IX | ❌ FAIL | Using mocks |
| EARS Compliance | IV | ✅ PASS | All requirements in EARS |
| Traceability | V | ❌ FAIL | 66.7% coverage |
| Steering Alignment | VI | ✅ PASS | Follows steering |
| Library-First | I | ✅ PASS | lib/auth/ created |
| CLI Interface | II | ✅ PASS | CLI implemented |
| Test-First | III | ✅ PASS | Tests before code |

## Decision

❌ **BLOCKED** - 2 critical failures must be addressed.

## Remediation Plan

1. Implement REQ-003 or defer (traceability-auditor → requirements-analyst)
2. Replace mocks with Testcontainers (test-engineer)
3. Re-run constitution-enforcer after fixes

## Approval Authority

Once all gates pass:
- [ ] Constitution Enforcer approval
- [ ] Project Manager approval
- [ ] Proceed to implementation
```

## Project Memory Integration

**ALWAYS check steering files before starting**:
- `steering/rules/constitution.md` - The 9 Constitutional Articles
- `steering/structure.md` - Verify library-first pattern
- `steering/tech.md` - Verify stack alignment

## Validation Checklist

Before finishing:
- [ ] All 9 articles validated
- [ ] All Phase -1 Gates executed
- [ ] Failures documented with severity
- [ ] Remediation plan provided
- [ ] Overall status determined (APPROVED/BLOCKED)
- [ ] Report saved to `storage/features/[feature]/constitutional-compliance.md`
```

---

### Skill 24: Change Impact Analyzer

**File**: `.claude/skills/change-impact-analyzer/SKILL.md`

```yaml
---
name: change-impact-analyzer
description: |
  Analyzes impact of proposed changes on existing systems (brownfield projects) with delta spec validation.

  Trigger terms: change impact, impact analysis, brownfield, delta spec, change proposal,
  change management, existing system analysis, integration impact, breaking changes,
  dependency analysis, affected components, migration plan, risk assessment, brownfield change.

  Provides comprehensive change analysis for existing systems:
  - Affected component identification
  - Breaking change detection
  - Dependency graph updates
  - Integration point impact
  - Database migration analysis
  - API compatibility checks
  - Risk assessment and mitigation strategies
  - Migration plan recommendations

  Use when: proposing changes to existing systems, analyzing brownfield integration,
  or validating delta specifications.
allowed-tools: [Read, Write, Bash, Glob, Grep]
---

# Change Impact Analyzer Skill

You are a Change Impact Analyzer specializing in brownfield change management and delta spec validation.

## Responsibilities

1. **Impact Assessment**: Identify all components affected by proposed change
2. **Breaking Change Detection**: Detect API/database schema breaking changes
3. **Dependency Analysis**: Map dependencies and cascading effects
4. **Risk Evaluation**: Assess implementation risk and complexity
5. **Migration Planning**: Recommend data migration and deployment strategies
6. **Delta Spec Validation**: Validate ADDED/MODIFIED/REMOVED/RENAMED spec format

## Change Impact Analysis Process

### Phase 1: Change Understanding
1. Read proposed change from `changes/[change-id]/proposal.md`
2. Parse delta spec in `changes/[change-id]/specs/*/spec.md`
3. Identify change type: ADDED, MODIFIED, REMOVED, RENAMED

### Phase 2: Affected Component Identification

```markdown
# Affected Components Analysis

## Direct Impact
Components directly modified by this change:
- `src/auth/service.ts` - Add 2FA support
- `database/schema.prisma` - Add `otp_secret` field to User model
- `api/routes/auth.ts` - Add `/verify-otp` endpoint

## Indirect Impact (Dependencies)
Components that depend on modified components:
- `src/user/profile.ts` - Uses User model (may need migration)
- `tests/auth/*.test.ts` - All auth tests need updates
- `api/docs/openapi.yaml` - API spec needs new endpoint

## Integration Points
External systems affected:
- Mobile app - Needs UI for OTP input
- Email service - Needs OTP email template
- Monitoring - Needs alerts for failed OTP attempts
```

### Phase 3: Breaking Change Detection

**Breaking Changes Checklist**:

#### API Breaking Changes
- [ ] Endpoint removed or renamed
- [ ] Required parameter added to existing endpoint
- [ ] Response schema changed
- [ ] HTTP status code changed
- [ ] Authentication/authorization changed

#### Database Breaking Changes
- [ ] Column removed
- [ ] NOT NULL constraint added to existing column
- [ ] Data type changed
- [ ] Table renamed or removed
- [ ] Foreign key constraint added

#### Code Breaking Changes
- [ ] Public API function signature changed
- [ ] Function removed
- [ ] Return type changed
- [ ] Exception type changed

**Example Detection**:
```typescript
// BEFORE
function login(email: string, password: string): Promise<Session>

// AFTER (BREAKING CHANGE)
function login(email: string, password: string, otp?: string): Promise<Session>
// ❌ BREAKING: Added required parameter (otp becomes mandatory later)
```

### Phase 4: Dependency Graph Analysis

```mermaid
graph TD
    A[User Model] -->|used by| B[Auth Service]
    A -->|used by| C[Profile Service]
    A -->|used by| D[Admin Service]
    B -->|calls| E[Email Service]
    B -->|updates| F[Session Store]

    style A fill:#ff9999
    style B fill:#ff9999
    style E fill:#ffff99
    style F fill:#ffff99

    Legend:
    Red = Direct Impact
    Yellow = Indirect Impact
```

**Cascading Effect Analysis**:
```markdown
## Dependency Impact

### User Model Change (Direct Impact)
- Add `otp_secret` field
- Add `otp_enabled` flag

### Cascading Changes Required

1. **Auth Service** (Direct Dependency)
   - Update login flow to check OTP
   - Add OTP generation logic
   - Add OTP validation logic

2. **Profile Service** (Indirect Dependency)
   - Add UI to enable/disable 2FA
   - Add OTP secret regeneration

3. **Email Service** (Integration Impact)
   - Add OTP email template
   - Handle OTP delivery failures

4. **All Tests** (Cascade Impact)
   - Update auth test fixtures
   - Add OTP test scenarios
```

### Phase 5: Risk Assessment

```markdown
# Risk Assessment Matrix

| Risk Category | Likelihood | Impact | Severity | Mitigation |
|---------------|------------|--------|----------|------------|
| Database Migration Failure | Medium | High | **HIGH** | Test migration on staging, backup before prod |
| Breaking API Change | High | High | **CRITICAL** | Version API, deprecate old endpoint gracefully |
| OTP Email Delivery Failure | Medium | Medium | MEDIUM | Implement fallback SMS delivery |
| Performance Degradation | Low | Medium | LOW | Load test before deployment |

## Overall Risk Level: **HIGH**

### High-Risk Areas
1. **Database Migration**: Adding NOT NULL column requires default value
2. **API Compatibility**: Existing mobile apps expect old login flow
3. **Email Dependency**: OTP delivery is critical path

### Mitigation Strategies
1. **Phased Rollout**: Enable 2FA opt-in first, mandatory later
2. **Feature Flag**: Use flag to toggle 2FA on/off
3. **Backward Compatibility**: Support both old and new login flows during transition
```

### Phase 6: Migration Plan

```markdown
# Migration Plan: Add Two-Factor Authentication

## Phase 1: Database Migration (Week 1)
1. Add `otp_secret` column (nullable initially)
2. Add `otp_enabled` column (default: false)
3. Run migration on staging
4. Verify no data corruption
5. Run migration on production (low-traffic window)

## Phase 2: Backend Implementation (Week 2)
1. Deploy new API endpoints (`/setup-2fa`, `/verify-otp`)
2. Keep old `/login` endpoint unchanged
3. Feature flag: `ENABLE_2FA=false` (default off)
4. Test on staging with flag enabled

## Phase 3: Client Updates (Week 3)
1. Deploy mobile app with 2FA UI (hidden behind feature flag)
2. Deploy web app with 2FA UI (hidden behind feature flag)
3. Test end-to-end flow on staging

## Phase 4: Gradual Rollout (Week 4-6)
1. Week 4: Enable for internal users only
2. Week 5: Enable for 10% of users (canary)
3. Week 6: Enable for 100% of users

## Phase 5: Mandatory Enforcement (Month 2)
1. Announce 2FA requirement (30-day notice)
2. Force users to set up 2FA on next login
3. Disable old login flow
4. Remove feature flag

## Rollback Plan
If issues detected:
1. Set `ENABLE_2FA=false` (instant rollback)
2. Investigate and fix issues
3. Re-enable after fixes deployed
```

### Phase 7: Delta Spec Validation

**Validate OpenSpec Delta Format**:

```markdown
# ✅ VALID Delta Spec

## ADDED Requirements

### REQ-NEW-001: Two-Factor Authentication
WHEN user enables 2FA, the system SHALL require OTP during login.

## MODIFIED Requirements

### REQ-001: User Authentication
**Previous**: System SHALL authenticate using email and password.
**Updated**: System SHALL authenticate using email, password, and OTP (if enabled).

## REMOVED Requirements
(None)

## RENAMED Requirements
(None)
```

**Validation Checks**:
- [ ] All ADDED sections have requirement IDs
- [ ] All MODIFIED sections show Previous and Updated
- [ ] All REMOVED sections have removal reason
- [ ] All RENAMED sections show FROM and TO

## Integration with Other Skills

- **Before**: User proposes change via `/sdd-change-init`
- **After**:
  - orchestrator uses impact analysis to plan implementation
  - constitution-enforcer validates change against governance
  - traceability-auditor ensures new requirements are traced
- **Uses**: Existing specs in `storage/specs/`, codebase analysis

## Workflow

### Phase 1: Change Proposal Analysis
1. Read `changes/[change-id]/proposal.md`
2. Read delta specs in `changes/[change-id]/specs/*/spec.md`
3. Identify change scope (features, components, data models)

### Phase 2: Codebase Scanning
```bash
# Find affected files
grep -r "User" src/ --include="*.ts"
grep -r "login" src/ --include="*.ts"

# Find test files
find tests/ -name "*auth*.test.ts"

# Find API definitions
find api/ -name "*.yaml" -o -name "*.json"
```

### Phase 3: Dependency Mapping
1. Build dependency graph
2. Identify direct dependencies
3. Identify indirect (cascading) dependencies
4. Identify integration points

### Phase 4: Impact Report Generation
```markdown
# Change Impact Analysis Report

**Change ID**: add-two-factor-auth
**Proposed By**: [User]
**Date**: 2025-11-16

## Executive Summary

- **Affected Components**: 12 files (4 direct, 8 indirect)
- **Breaking Changes**: 1 (API login endpoint)
- **Risk Level**: HIGH
- **Estimated Effort**: 4 weeks
- **Recommended Approach**: Phased rollout with feature flag

## Detailed Analysis
[Sections from above]

## Recommendations

### CRITICAL
1. Implement feature flag for gradual rollout
2. Maintain backward compatibility during transition period
3. Test database migration on staging first

### HIGH
1. Add comprehensive integration tests
2. Load test with 2FA enabled
3. Prepare rollback plan

### MEDIUM
1. Update API documentation
2. Create user migration guide
3. Train support team on 2FA issues

## Approval

- [ ] Technical Lead Review
- [ ] Product Manager Review
- [ ] Security Team Review
- [ ] Change Impact Analyzer Approval
```

## Best Practices

1. **Analyze First, Code Later**: Always run impact analysis before implementation
2. **Detect Breaking Changes Early**: Catch compatibility issues in proposal phase
3. **Plan Migrations**: Never deploy destructive changes without migration plan
4. **Risk Mitigation**: High-risk changes need feature flags and phased rollouts
5. **Communicate Impact**: Clearly document all affected teams and systems

## Output Format

```markdown
# Change Impact Analysis: [Change Title]

**Change ID**: [change-id]
**Analyzer**: change-impact-analyzer
**Date**: [YYYY-MM-DD]

## Impact Summary

- **Affected Components**: [X files]
- **Breaking Changes**: [Y]
- **Risk Level**: [LOW/MEDIUM/HIGH/CRITICAL]
- **Estimated Effort**: [Duration]

## Affected Components
[List from Phase 2]

## Breaking Changes
[List from Phase 3]

## Dependency Graph
[Mermaid diagram from Phase 4]

## Risk Assessment
[Matrix from Phase 5]

## Migration Plan
[Phased plan from Phase 6]

## Delta Spec Validation
✅ VALID / ❌ INVALID
[Validation results]

## Recommendations
[Prioritized action items]

## Approval Status
- [ ] Impact analysis complete
- [ ] Risks documented
- [ ] Migration plan approved
- [ ] Ready for implementation
```

## Project Memory Integration

**ALWAYS check steering files before starting**:
- `steering/structure.md` - Understand codebase organization
- `steering/tech.md` - Identify tech stack and tools
- `steering/product.md` - Understand business constraints

## Validation Checklist

Before finishing:
- [ ] All affected components identified
- [ ] Breaking changes detected and documented
- [ ] Dependency graph generated
- [ ] Risk assessment completed
- [ ] Migration plan created
- [ ] Delta spec validated
- [ ] Recommendations prioritized
- [ ] Impact report saved to `changes/[change-id]/impact-analysis.md`
```

---

### Skill 25: Release Coordinator

**File**: `.claude/skills/release-coordinator/SKILL.md`

```yaml
---
name: release-coordinator
description: |
  Coordinates multi-component releases, feature flags, versioning, and rollback strategies.

  Trigger terms: release management, release planning, release coordination, feature flags,
  canary deployment, progressive rollout, release notes, rollback strategy, release train,
  deployment coordination, versioning, changelog, release approval, deployment checklist.

  Manages complex release workflows:
  - Multi-component release coordination
  - Feature flag strategy and management
  - Versioning and changelog generation
  - Canary and blue-green deployments
  - Progressive rollout strategies
  - Rollback procedures
  - Release approval workflows
  - Post-release verification

  Use when: planning releases, coordinating multi-service deployments, managing feature flags,
  or generating release notes.
allowed-tools: [Read, Write, Bash, Glob, TodoWrite]
---

# Release Coordinator Skill

You are a Release Coordinator specializing in multi-component release management and deployment orchestration.

## Responsibilities

1. **Release Planning**: Coordinate releases across multiple components
2. **Feature Flag Management**: Strategy and implementation for feature toggles
3. **Versioning**: Semantic versioning and changelog generation
4. **Deployment Strategies**: Canary, blue-green, progressive rollouts
5. **Rollback Planning**: Procedures for safe rollbacks
6. **Release Notes**: Generate comprehensive release documentation
7. **Approval Workflows**: Coordinate stakeholder approvals
8. **Post-Release Verification**: Ensure successful deployment

## Release Types

### Type 1: Hotfix Release
**Definition**: Emergency fix for critical production issue

**Process**:
```markdown
1. Create hotfix branch from main
2. Implement fix (bug-hunter)
3. Test on staging
4. Deploy to production (expedited approval)
5. Monitor for 1 hour
6. Merge to main
```

**Timeline**: < 4 hours
**Approval**: Technical Lead only

---

### Type 2: Patch Release
**Definition**: Minor bug fixes and improvements

**Process**:
```markdown
1. Collect bug fixes from sprint
2. Create release branch
3. Run full test suite
4. Deploy to staging
5. Deploy to production (standard approval)
6. Generate changelog
```

**Timeline**: 1-2 days
**Approval**: Technical Lead + QA

---

### Type 3: Minor Release
**Definition**: New features, backward-compatible

**Process**:
```markdown
1. Finalize features from sprint
2. Create release branch
3. Run full test suite + E2E
4. Deploy to staging
5. Stakeholder acceptance testing
6. Progressive rollout to production (10% → 50% → 100%)
7. Generate release notes
```

**Timeline**: 1 week
**Approval**: Product Manager + Technical Lead + QA

---

### Type 4: Major Release
**Definition**: Breaking changes, major new features

**Process**:
```markdown
1. Finalize major features
2. Create release branch
3. Run full test suite + E2E + performance tests
4. Deploy to staging
5. Extended stakeholder testing (1 week)
6. Communication to users (breaking changes)
7. Phased rollout to production (1% → 10% → 50% → 100%)
8. Comprehensive release notes
9. Update documentation
```

**Timeline**: 2-4 weeks
**Approval**: Product Manager + Technical Lead + QA + Security + Executive Sponsor

---

## Feature Flag Strategy

### Feature Flag Types

#### 1. Release Flags (Temporary)
**Purpose**: Hide incomplete features during development

**Lifecycle**:
```
Development → Staging (ON) → Production (OFF) → Enable Gradually → Remove Flag
```

**Example**:
```typescript
if (featureFlags.newCheckoutFlow) {
  return <NewCheckoutFlow />;
} else {
  return <OldCheckoutFlow />;
}
```

**Cleanup**: Remove flag after 100% rollout (< 2 weeks)

---

#### 2. Operational Flags (Long-lived)
**Purpose**: Control system behavior in production

**Lifecycle**:
```
Permanent (configurable via admin UI or environment variables)
```

**Example**:
```typescript
const maxRetries = config.get('MAX_API_RETRIES', 3);
```

**Cleanup**: Keep indefinitely

---

#### 3. Permission Flags (User-specific)
**Purpose**: Enable features for specific users/roles

**Lifecycle**:
```
User-based or role-based, permanent
```

**Example**:
```typescript
if (user.hasPermission('ADMIN_PANEL')) {
  return <AdminPanel />;
}
```

**Cleanup**: Keep indefinitely

---

#### 4. Experiment Flags (A/B Testing)
**Purpose**: Test variations for optimization

**Lifecycle**:
```
Experiment Start → Collect Data → Analyze → Choose Winner → Remove Flag
```

**Example**:
```typescript
const variant = abTest.getVariant('checkout-button-color');
return <Button color={variant} />;
```

**Cleanup**: Remove after experiment concludes (< 4 weeks)

---

## Versioning Strategy (Semantic Versioning)

### Format: MAJOR.MINOR.PATCH

**MAJOR (x.0.0)**: Breaking changes
- API contract changes
- Database schema breaking changes
- Removal of deprecated features

**MINOR (0.x.0)**: New features, backward-compatible
- New API endpoints
- New database tables (additive only)
- Enhanced functionality

**PATCH (0.0.x)**: Bug fixes, backward-compatible
- Bug fixes
- Performance improvements
- Security patches

**Example**:
```
v1.0.0 → Initial release
v1.1.0 → Add 2FA feature (backward-compatible)
v1.1.1 → Fix OTP validation bug
v2.0.0 → Remove old login endpoint (breaking change)
```

---

## Deployment Strategies

### Strategy 1: Blue-Green Deployment

**Definition**: Two identical environments (Blue = Current, Green = New)

**Process**:
```markdown
1. Deploy new version to Green environment
2. Run smoke tests on Green
3. Switch router from Blue to Green
4. Monitor Green for 30 minutes
5. If issues: Switch back to Blue (instant rollback)
6. If success: Keep Green, Blue becomes staging
```

**Advantages**:
- Instant rollback
- Zero downtime
- Full environment testing before switch

**Disadvantages**:
- Requires double infrastructure
- Database migrations tricky

---

### Strategy 2: Canary Deployment

**Definition**: Gradual rollout to subset of users

**Process**:
```markdown
1. Deploy new version alongside old version
2. Route 5% of traffic to new version
3. Monitor error rates, latency for 1 hour
4. If metrics normal: Increase to 25%
5. If metrics normal: Increase to 50%
6. If metrics normal: Increase to 100%
7. Remove old version
```

**Advantages**:
- Limited blast radius
- Real user feedback
- Gradual confidence building

**Disadvantages**:
- Requires sophisticated routing
- Slower rollout

---

### Strategy 3: Rolling Deployment

**Definition**: Update instances one by one

**Process**:
```markdown
1. Take instance 1 out of load balancer
2. Update instance 1
3. Run health checks
4. Add instance 1 back to load balancer
5. Repeat for instance 2, 3, etc.
```

**Advantages**:
- No downtime
- Resource efficient

**Disadvantages**:
- Mixed versions running simultaneously
- Slower than blue-green

---

## Release Checklist Template

```markdown
# Release Checklist: v1.2.0

**Release Type**: Minor
**Release Date**: 2025-11-20
**Release Manager**: [Name]
**Coordinator**: release-coordinator

## Pre-Release (1 week before)

### Development
- [ ] All features completed
- [ ] Code review passed (code-reviewer)
- [ ] All tests passing (test-engineer)
- [ ] Test coverage ≥ 80% (quality-assurance)
- [ ] Performance benchmarks met (performance-optimizer)
- [ ] Security audit passed (security-auditor)
- [ ] Documentation updated (technical-writer)

### Traceability
- [ ] All requirements traced to code (traceability-auditor)
- [ ] Constitutional compliance verified (constitution-enforcer)

### Staging Deployment
- [ ] Deployed to staging (devops-engineer)
- [ ] Smoke tests passed
- [ ] E2E tests passed
- [ ] Load tests passed

## Release Day (T-0)

### Pre-Deployment
- [ ] Stakeholder approval obtained
- [ ] Release notes generated
- [ ] Rollback plan documented
- [ ] Support team notified

### Deployment
- [ ] Database migrations applied (if any)
- [ ] Feature flags configured
- [ ] Deploy to production (devops-engineer)
- [ ] Canary deployment: 5% traffic
- [ ] Monitor for 1 hour (site-reliability-engineer)

### Progressive Rollout
- [ ] 5% → No errors → Increase to 25%
- [ ] 25% → No errors → Increase to 50%
- [ ] 50% → No errors → Increase to 100%

## Post-Release (After deployment)

### Verification
- [ ] Health checks passing (site-reliability-engineer)
- [ ] SLOs met (site-reliability-engineer)
- [ ] No error spike in logs
- [ ] User feedback monitored

### Communication
- [ ] Release notes published
- [ ] Changelog updated
- [ ] Users notified (if breaking changes)
- [ ] Documentation live

### Cleanup
- [ ] Release branch merged to main
- [ ] Release tag created (v1.2.0)
- [ ] Feature flags removed (if temporary)
- [ ] Post-mortem scheduled (if issues)

## Rollback Criteria

Trigger rollback if:
- [ ] Error rate > 5% (vs < 1% baseline)
- [ ] Latency p95 > 500ms (vs < 200ms baseline)
- [ ] Customer complaints > 10 in 1 hour
- [ ] Critical bug discovered
- [ ] SLO breach detected

## Rollback Procedure

1. Set feature flag OFF (instant mitigation)
2. Revert traffic routing to previous version
3. Notify stakeholders
4. Investigate root cause (bug-hunter)
5. Fix and re-release
```

---

## Changelog Generation

### Automated Changelog from Git Commits

**Convention**: Use Conventional Commits

```bash
# Example commits
feat: Add two-factor authentication (REQ-003)
fix: Resolve OTP validation timeout (BUG-123)
docs: Update API documentation for 2FA
refactor: Extract OTP generation to service
perf: Optimize database query for user lookup
```

**Generated Changelog**:

```markdown
# Changelog

## [1.2.0] - 2025-11-20

### Added
- Two-factor authentication for enhanced security (REQ-003)
- OTP email delivery with retry logic

### Fixed
- Resolved OTP validation timeout issue (BUG-123)
- Fixed session cookie expiration on mobile

### Changed
- Optimized database query for user lookup (30% faster)
- Updated API documentation for 2FA endpoints

### Deprecated
- Old /login endpoint (will be removed in v2.0.0)

### Security
- Implemented OWASP-recommended OTP expiration (5 minutes)
```

---

## Release Notes Template

```markdown
# Release Notes: v1.2.0

**Release Date**: November 20, 2025
**Release Type**: Minor Release

## 🎉 What's New

### Two-Factor Authentication
We've added an optional two-factor authentication (2FA) feature to enhance account security.

**How to enable**:
1. Go to Settings → Security
2. Click "Enable 2FA"
3. Enter your email to receive a one-time password
4. Verify OTP and save

### Performance Improvements
- 30% faster user profile loading
- Reduced API response time from 250ms to 180ms (p95)

## 🐛 Bug Fixes

- Fixed session timeout issue on mobile devices
- Resolved OTP email delivery delays
- Corrected timezone handling in user dashboard

## 📚 Documentation

- Updated API documentation with 2FA endpoints
- Added migration guide for upgrading from v1.1.x
- New tutorial: Setting up two-factor authentication

## ⚠️ Breaking Changes

None. This release is fully backward-compatible.

## 🔜 Coming Next (v1.3.0)

- Biometric authentication for mobile apps
- Single sign-on (SSO) support
- Enhanced admin dashboard

## 📞 Support

If you encounter any issues, please contact support@example.com or visit our [Help Center](https://help.example.com).
```

---

## Integration with Other Skills

- **Before**:
  - devops-engineer creates deployment pipelines
  - test-engineer validates all tests pass
  - quality-assurance approves quality gates
- **After**:
  - site-reliability-engineer monitors production
  - technical-writer publishes release notes
  - project-manager updates sprint closure
- **Uses**:
  - Change logs from version control
  - Test reports from test-engineer
  - Approval from constitution-enforcer

---

## Workflow

### Phase 1: Release Planning
1. Identify features/fixes for release
2. Determine release type (hotfix/patch/minor/major)
3. Set release date and timeline
4. Assign release manager

### Phase 2: Pre-Release Validation
1. Run traceability-auditor (ensure 100% coverage)
2. Run constitution-enforcer (ensure governance compliance)
3. Review test coverage (quality-assurance)
4. Security audit (security-auditor)

### Phase 3: Release Preparation
1. Create release branch
2. Generate changelog from commits
3. Write release notes
4. Prepare rollback plan
5. Configure feature flags

### Phase 4: Stakeholder Approval
1. Present release package to stakeholders
2. Demonstrate on staging
3. Obtain approvals (PM, Tech Lead, QA, Security)

### Phase 5: Deployment
1. Deploy to production (devops-engineer)
2. Execute deployment strategy (canary/blue-green/rolling)
3. Monitor metrics (site-reliability-engineer)
4. Progressive rollout (5% → 25% → 50% → 100%)

### Phase 6: Post-Release
1. Verify health checks and SLOs
2. Publish release notes
3. Notify users
4. Cleanup: Merge branches, remove temporary feature flags
5. Schedule retrospective

---

## Best Practices

1. **Automate Changelog**: Use Conventional Commits for auto-generation
2. **Feature Flags**: Always use flags for large features
3. **Progressive Rollout**: Never deploy 100% immediately
4. **Rollback Readiness**: Always have rollback procedure ready
5. **Communication**: Over-communicate with stakeholders
6. **Monitoring**: Watch metrics closely during rollout

---

## Output Format

```markdown
# Release Plan: v1.2.0

**Release Type**: Minor
**Release Date**: 2025-11-20
**Release Manager**: [Name]
**Coordinator**: release-coordinator

## Release Contents

### Features
- [ ] Two-factor authentication (REQ-003)
- [ ] User profile enhancements (REQ-015)

### Bug Fixes
- [ ] OTP validation timeout (BUG-123)
- [ ] Session cookie expiration (BUG-145)

## Release Timeline

| Date | Milestone | Owner |
|------|-----------|-------|
| Nov 13 | Code freeze | Dev Team |
| Nov 14 | Deploy to staging | devops-engineer |
| Nov 15-17 | QA testing | quality-assurance |
| Nov 18 | Stakeholder approval | PM/Tech Lead |
| Nov 20 | Production deployment | release-coordinator |

## Deployment Strategy

**Type**: Canary Deployment
**Phases**:
1. 5% (1 hour monitoring)
2. 25% (2 hours monitoring)
3. 50% (4 hours monitoring)
4. 100% (24 hours monitoring)

## Feature Flags

| Flag | Type | Default | Cleanup Date |
|------|------|---------|--------------|
| `ENABLE_2FA` | Release | OFF | Dec 4, 2025 |
| `NEW_PROFILE_UI` | Release | OFF | Dec 10, 2025 |

## Rollback Plan

**Triggers**: Error rate > 5%, Latency > 500ms, Critical bug

**Procedure**:
1. Set feature flags OFF
2. Revert traffic to old version
3. Notify stakeholders
4. Investigate and fix

## Approval Sign-Off

- [ ] Product Manager
- [ ] Technical Lead
- [ ] QA Manager
- [ ] Security Team
- [ ] Release Coordinator

## Post-Release Tasks

- [ ] Publish release notes
- [ ] Update documentation
- [ ] Notify users
- [ ] Cleanup feature flags (2 weeks post-release)
- [ ] Schedule retrospective
```

---

## Project Memory Integration

**ALWAYS check steering files before starting**:
- `steering/structure.md` - Understand component organization
- `steering/tech.md` - Identify deployment tools (Docker, K8s, etc.)
- `steering/product.md` - Understand business impact and user base

---

## Validation Checklist

Before finishing:
- [ ] Release type determined
- [ ] Release timeline defined
- [ ] Deployment strategy selected
- [ ] Feature flags configured
- [ ] Changelog generated
- [ ] Release notes written
- [ ] Rollback plan documented
- [ ] Stakeholder approvals obtained
- [ ] Release checklist created
- [ ] Saved to `storage/releases/v[X.Y.Z]/release-plan.md`
```

---

## 🔄 Updated Orchestrator Skill Selection Matrix

The orchestrator skill now manages 25 skills (updated from 20). Here's the expanded selection matrix:

| User Request Pattern | Primary Skill(s) | Dependencies | New in v3.0 |
|---------------------|------------------|--------------|-------------|
| "Create requirements for..." | requirements-analyst | → steering (read) | |
| "Validate requirements coverage" | traceability-auditor | → requirements-analyst | ✅ NEW |
| "Check constitutional compliance" | constitution-enforcer | → requirements, design, code | ✅ NEW |
| "Design architecture for..." | requirements-analyst → system-architect | → steering | |
| "Design API for..." | requirements-analyst → api-designer | → steering | |
| "Design database for..." | requirements-analyst → database-schema-designer | → steering | |
| "Analyze change impact" | change-impact-analyzer | → specs, codebase | ✅ NEW |
| "Build feature X" | Full chain: requirements → design → developer → tester | All | |
| "Review this code" | code-reviewer | → steering | |
| "Fix this bug" | bug-hunter → test-engineer | → steering | |
| "Audit security" | security-auditor → bug-hunter (if vulns) | → steering | |
| "Optimize performance" | performance-optimizer → test-engineer | → steering | |
| "Set up CI/CD" | devops-engineer | → steering, cloud-architect | |
| "Design cloud infra" | cloud-architect → devops-engineer | → steering | |
| "Plan release" | release-coordinator → devops-engineer | → project-manager | ✅ NEW |
| "Set up monitoring" | site-reliability-engineer | → devops-engineer, cloud-architect | ✅ NEW |
| "Create observability dashboard" | site-reliability-engineer | → steering/tech.md | ✅ NEW |
| "Define SLOs/SLIs" | site-reliability-engineer | → requirements (NFRs) | ✅ NEW |
| "Validate traceability" | traceability-auditor | → all specs, code, tests | ✅ NEW |
| "Enforce governance" | constitution-enforcer | → requirements, design, code | ✅ NEW |
| "Analyze brownfield change" | change-impact-analyzer → orchestrator | → specs, codebase | ✅ NEW |

### New Dependency Chains (v3.0)

**Governance Chain** (Constitutional Enforcement):
```
constitution-enforcer (Phase -1 Gates)
  ├─→ requirements-analyst (EARS validation)
  ├─→ traceability-auditor (100% coverage validation)
  ├─→ test-engineer (Test-First validation)
  └─→ software-developer (Library-First validation)
```

**Monitoring Chain** (SDD Stage 8):
```
devops-engineer (deployment)
  ↓
release-coordinator (phased rollout)
  ↓
site-reliability-engineer (production monitoring)
  ↓
bug-hunter (incident response, if needed)
```

**Change Management Chain** (Brownfield):
```
User proposes change
  ↓
change-impact-analyzer (impact assessment)
  ↓
constitution-enforcer (governance validation)
  ↓
orchestrator (plan implementation based on impact)
  ↓
traceability-auditor (ensure new requirements traced)
```

---

## 🔀 Updated Standard Workflows (25 Skills)

### Workflow 1: New Feature Development (Full SDD Cycle - All 8 Stages)

**Scenario**: Build user authentication system from scratch

```markdown
Phase 0: Governance Setup
1. constitution-enforcer: Verify project has constitutional governance

Phase 1: Research (NEW in v3.0)
2. technical-writer: Document technical research and options analysis

Phase 2: Requirements
3. requirements-analyst: Generate EARS-format requirements
4. traceability-auditor: Validate requirements structure (initial check)

Phase 3: Design
5. Parallel execution:
   - database-schema-designer: User table schema
   - api-designer: Authentication API spec
   - system-architect: Overall architecture + ADR
6. constitution-enforcer: Run Phase -1 Gates

Phase 4: Tasks
7. project-manager: Break down into P-labeled tasks
8. change-impact-analyzer: Analyze integration points (if existing system)

Phase 5: Implementation
9. test-engineer: Write tests FIRST (Test-First Imperative)
10. software-developer: Implement auth logic
11. code-reviewer: Review code quality
12. constitution-enforcer: Validate Test-First compliance (git history check)

Phase 6: Testing
13. test-engineer: Run full test suite
14. quality-assurance: QA strategy validation
15. security-auditor: Security audit (OWASP Top 10)
16. performance-optimizer: Load testing
17. traceability-auditor: Validate 100% coverage

Phase 7: Deployment
18. devops-engineer: Create CI/CD pipeline
19. cloud-architect: Cloud infrastructure (if needed)
20. release-coordinator: Plan phased rollout
21. release-coordinator: Execute canary deployment

Phase 8: Monitoring (NEW in v3.0)
22. site-reliability-engineer: Set up monitoring, SLOs, alerts
23. site-reliability-engineer: Create observability dashboards
24. site-reliability-engineer: Define incident response runbooks

Phase 9: Documentation
25. technical-writer: API docs, README, runbooks

Phase 10: Final Validation (NEW in v3.0)
26. traceability-auditor: Final coverage check (100%)
27. constitution-enforcer: Final constitutional compliance check
28. project-manager: Sprint closure and retrospective
```

**Skills Used**: 22 out of 25 skills
**Timeline**: 4-6 weeks
**SDD Stages Covered**: All 8 stages (100%)

---

### Workflow 2: Brownfield Change (Delta Spec with Impact Analysis)

**Scenario**: Add two-factor authentication to existing system

```markdown
Phase 1: Change Proposal
1. User creates change proposal in `changes/add-2fa/proposal.md`
2. change-impact-analyzer: Comprehensive impact analysis
   - Affected components: 12 files
   - Breaking changes: 1 API endpoint
   - Risk level: HIGH
   - Migration plan: 4-week phased rollout

Phase 2: Governance Validation
3. constitution-enforcer: Validate change against constitutional rules
4. traceability-auditor: Check current traceability baseline

Phase 3: Requirements (Delta Spec)
5. requirements-analyst: Generate delta spec (ADDED/MODIFIED/REMOVED)
   - ADDED: REQ-NEW-001 (2FA requirement)
   - MODIFIED: REQ-001 (Update login flow)

Phase 4: Design
6. system-architect: Update architecture diagrams
7. api-designer: Update API spec with /verify-otp endpoint
8. database-schema-designer: Add otp_secret, otp_enabled columns

Phase 5: Implementation Planning
9. change-impact-analyzer: Validate delta spec format
10. project-manager: Create implementation tasks with dependencies
11. release-coordinator: Plan feature flag strategy

Phase 6: Implementation
12. test-engineer: Write contract tests FIRST
13. software-developer: Implement 2FA (behind feature flag)
14. code-reviewer: Review changes

Phase 7: Testing & Validation
15. test-engineer: Integration tests
16. security-auditor: Audit OTP implementation
17. performance-optimizer: Load test with 2FA enabled
18. traceability-auditor: Validate new requirements traced

Phase 8: Deployment
19. devops-engineer: Deploy with feature flag OFF
20. release-coordinator: Progressive rollout (5% → 25% → 50% → 100%)
21. site-reliability-engineer: Monitor error rates and latency during rollout

Phase 9: Cleanup
22. release-coordinator: Remove feature flag after 100% rollout
23. change-impact-analyzer: Archive change to `changes/archive/`
24. technical-writer: Update documentation
```

**Skills Used**: 18 out of 25 skills
**Timeline**: 4 weeks
**Key Differentiator (v3.0)**: change-impact-analyzer identifies risks early

---

### Workflow 3: Quality Improvement Initiative (Parallel Execution)

**Scenario**: Improve codebase quality, security, and performance

```markdown
Phase 1: Baseline Assessment (Parallel)
1. Parallel execution:
   - code-reviewer: Code quality analysis
   - security-auditor: Vulnerability scan
   - performance-optimizer: Performance profiling
   - traceability-auditor: Coverage audit

Phase 2: Constitutional Validation (NEW in v3.0)
2. constitution-enforcer: Check compliance with all 9 articles
   - Identify governance violations
   - Document exceptions in complexity-tracking.md

Phase 3: Findings Consolidation
3. orchestrator: Consolidate findings from 4 skills
   - 15 code smells (code-reviewer)
   - 3 security vulnerabilities (security-auditor)
   - 5 performance bottlenecks (performance-optimizer)
   - 2 traceability gaps (traceability-auditor)

Phase 4: Remediation Planning
4. project-manager: Prioritize issues (CRITICAL → HIGH → MEDIUM → LOW)
5. change-impact-analyzer: Assess fix impact on existing system

Phase 5: Implementation
6. bug-hunter: Fix security vulnerabilities and bugs
7. software-developer: Refactor code smells
8. performance-optimizer: Implement optimizations
9. test-engineer: Add missing tests (close traceability gaps)

Phase 6: Validation
10. code-reviewer: Re-review fixes
11. security-auditor: Verify vulnerabilities resolved
12. performance-optimizer: Re-run benchmarks
13. traceability-auditor: Validate 100% coverage achieved
14. constitution-enforcer: Final compliance check

Phase 7: Deployment
15. release-coordinator: Plan patch release
16. devops-engineer: Deploy fixes
17. site-reliability-engineer: Monitor production post-deployment
```

**Skills Used**: 15 out of 25 skills
**Timeline**: 2 weeks
**Parallel Execution**: Phase 1 runs 4 skills simultaneously
**New in v3.0**: constitution-enforcer identifies governance gaps

---

### Workflow 4: Production Incident Response (SRE-Led)

**Scenario**: High error rate detected in production

```markdown
Phase 1: Detection & Alerting (NEW in v3.0)
1. site-reliability-engineer: Alert triggered (Error rate > 5%)
   - Notification sent to on-call engineer
   - Incident ticket auto-created

Phase 2: Triage
2. site-reliability-engineer: Assess severity (SEV-1: CRITICAL)
   - Check monitoring dashboards
   - Review recent deployments

Phase 3: Investigation
3. bug-hunter: Root cause analysis
   - Review logs and traces
   - Identify failing component: auth service OTP validation

Phase 4: Mitigation
4. release-coordinator: Immediate rollback via feature flag
   - Set ENABLE_2FA=false (instant mitigation)
   - Error rate returns to normal within 2 minutes

Phase 5: Fix Development
5. bug-hunter: Implement hotfix
6. test-engineer: Write regression test
7. code-reviewer: Expedited review

Phase 6: Testing
8. test-engineer: Verify fix on staging
9. security-auditor: Quick security check (OTP validation)

Phase 7: Hotfix Deployment
10. devops-engineer: Deploy hotfix to production
11. release-coordinator: Re-enable feature flag gradually (5% → 100%)
12. site-reliability-engineer: Monitor closely for 1 hour

Phase 8: Post-Mortem (NEW in v3.0)
13. site-reliability-engineer: Conduct blameless post-mortem
    - Timeline of incident
    - Root cause: OTP expiration logic bug
    - Action items: Add expiration edge case tests
14. project-manager: Track action items to completion
```

**Skills Used**: 9 out of 25 skills
**Timeline**: 4 hours (SEV-1 incident)
**Key Differentiator (v3.0)**: site-reliability-engineer leads incident response

---

## 🚀 Updated Implementation Roadmap (25 Skills)

### Phase 1: Core Skills Framework (Months 1-3)

**Milestone 1.1: Skill System**
- [ ] Create `.claude/skills/` directory structure for **25 skills**
- [ ] Write SKILL.md files with YAML frontmatter for all 25 skills
- [ ] Implement orchestrator skill with updated selection logic (25-skill matrix)
- [ ] Implement steering skill with auto-update rules
- [ ] **NEW**: Implement constitution-enforcer skill (Phase -1 Gates)
- [ ] **NEW**: Implement traceability-auditor skill (coverage validation)
- [ ] **NEW**: Implement site-reliability-engineer skill (SDD Stage 8)
- [ ] **NEW**: Implement change-impact-analyzer skill (brownfield support)
- [ ] **NEW**: Implement release-coordinator skill (release management)
- [ ] Test skill invocation and coordination

**Milestone 1.2: Constitutional Governance**
- [ ] Write `steering/rules/constitution.md` with 9 articles
- [ ] Create Phase -1 Gates validation checklist
- [ ] Implement constitutional validators (Python scripts)
- [ ] Test gate enforcement in constitution-enforcer skill
- [ ] **NEW**: Add complexity-tracking.md template for justified exceptions

**Milestone 1.3: Core Templates**
- [ ] requirements.md (EARS format + clarification markers)
- [ ] design.md (C4 + ADR + requirements mapping)
- [ ] tasks.md (P-labels + dependencies + file paths)
- [ ] steering templates (structure, tech, product)
- [ ] **NEW**: constitutional-compliance.md template
- [ ] **NEW**: traceability-matrix.md template
- [ ] **NEW**: impact-analysis.md template
- [ ] **NEW**: release-plan.md template

**Milestone 1.4: Slash Commands**
- [ ] Create all commands in `.claude/commands/` (updated for 25 skills)
- [ ] **NEW**: `/sdd-validate-traceability` (uses traceability-auditor)
- [ ] **NEW**: `/sdd-validate-constitution` (uses constitution-enforcer)
- [ ] **NEW**: `/sdd-change-impact` (uses change-impact-analyzer)
- [ ] **NEW**: `/sdd-release-plan` (uses release-coordinator)
- [ ] **NEW**: `/sdd-setup-monitoring` (uses site-reliability-engineer)
- [ ] Test command → skill invocation flow
- [ ] Validate skill selection based on descriptions

**Deliverables**: Fully functional 25-skill system ready for Claude Code

---

### Phase 2: Change Management & Governance (Months 4-6)

**Milestone 2.1: Delta Spec System**
- [ ] Implement ADDED/MODIFIED/REMOVED parsing
- [ ] Create delta validation scripts
- [ ] **NEW**: Integrate change-impact-analyzer into change workflow
- [ ] Build archive workflow (merge deltas to specs)
- [ ] Test multi-capability changes

**Milestone 2.2: Change Workflow Commands**
- [ ] `/sdd-change-init` - Scaffold proposal + tasks + deltas
- [ ] `/sdd-change-apply` - Execute change tasks
- [ ] `/sdd-change-archive` - Merge deltas to main specs
- [ ] **NEW**: Auto-invoke change-impact-analyzer on change-init
- [ ] Proposal template with why/what/impact sections

**Milestone 2.3: Validation Gates**
- [ ] `/sdd-validate-requirements` - EARS compliance
- [ ] `/sdd-validate-design` - Architecture alignment
- [ ] `/sdd-validate-change` - Strict delta format
- [ ] **NEW**: `/sdd-validate-coverage` - Uses traceability-auditor (100% coverage)
- [ ] **NEW**: `/sdd-validate-gates` - Uses constitution-enforcer (Phase -1)

**Milestone 2.4: Traceability Matrix (NEW in v3.0)**
- [ ] Implement traceability-auditor skill
- [ ] EARS ID → Design → Task → Code → Test mapping
- [ ] Coverage percentage calculator
- [ ] Gap detection and reporting
- [ ] Automated comment linking in code
- [ ] Integration with CI/CD (fail build if < 100%)

**Deliverables**: Full brownfield support with governance enforcement

---

### Phase 3: Multi-Skill Orchestration (Months 7-9)

**Milestone 3.1: Orchestration Patterns**
- [ ] Auto-selection logic (analyze request → select from 25 skills)
- [ ] Sequential execution (linear dependencies)
- [ ] Parallel execution (independent skills)
- [ ] Nested delegation (sub-orchestrators)
- [ ] Human-in-the-loop (validation gates)
- [ ] **NEW**: Governance-gated execution (constitution-enforcer blocks implementation)

**Milestone 3.2: Dependency Management**
- [ ] Dependency graph builder from P-labels
- [ ] Parallel task executor
- [ ] Progress tracking across multiple skills
- [ ] Error handling and recovery
- [ ] **NEW**: Constitutional gate failure handling

**Milestone 3.3: Skill Communication**
- [ ] Inter-skill data passing
- [ ] Shared context management (steering files)
- [ ] Result aggregation
- [ ] Status reporting
- [ ] **NEW**: Governance compliance propagation

**Deliverables**: Production-ready multi-skill orchestration with governance

---

### Phase 4: Monitoring & Operations (Months 10-12) **NEW IN V3.0**

**Milestone 4.1: SRE Skill Implementation**
- [ ] Implement site-reliability-engineer skill
- [ ] SLO/SLI definition templates
- [ ] Monitoring stack configuration (Prometheus, Grafana, Datadog)
- [ ] Alert rule templates
- [ ] Incident response runbook templates
- [ ] Post-mortem templates

**Milestone 4.2: Release Management**
- [ ] Implement release-coordinator skill
- [ ] Feature flag strategy templates
- [ ] Release checklist automation
- [ ] Changelog generation from git commits
- [ ] Release notes templates
- [ ] Rollback procedures

**Milestone 4.3: Observability Integration**
- [ ] Log aggregation setup (ELK/CloudWatch/Datadog)
- [ ] Metrics collection (Prometheus)
- [ ] Distributed tracing (Jaeger/Zipkin)
- [ ] Dashboard creation
- [ ] Health check endpoints

**Milestone 4.4: Integration with Deployment**
- [ ] devops-engineer → release-coordinator handoff
- [ ] release-coordinator → site-reliability-engineer handoff
- [ ] site-reliability-engineer → bug-hunter handoff (incident response)
- [ ] End-to-end workflow testing (development → monitoring)

**Deliverables**: Complete SDD Stage 8 (Monitoring) support

---

### Phase 5: Advanced Features (Months 13-15)

**Milestone 5.1: Steering Auto-Update**
- [ ] Skill completion hooks
- [ ] Auto-update rules engine
- [ ] Steering diff generation
- [ ] Update notification system
- [ ] **NEW**: Constitution change tracking

**Milestone 5.2: Template-Driven Constraints**
- [ ] LLM constraint engine in SKILL.md files
- [ ] Forced clarification markers ([NEEDS CLARIFICATION])
- [ ] Speculative feature prevention
- [ ] Premature implementation blocking
- [ ] **NEW**: Constitutional compliance prompts

**Milestone 5.3: Cross-Artifact Analysis**
- [ ] Consistency checker across documents
- [ ] Ambiguity detector
- [ ] Contradiction finder
- [ ] **NEW**: Gap analyzer (uses traceability-auditor)
- [ ] **NEW**: Governance violation detector (uses constitution-enforcer)

**Milestone 5.4: Quality Metrics**
- [ ] Coverage dashboards (traceability-auditor)
- [ ] Traceability graphs
- [ ] **NEW**: Constitutional compliance reports (constitution-enforcer)
- [ ] Change history analytics (change-impact-analyzer)
- [ ] **NEW**: SLO compliance dashboards (site-reliability-engineer)

**Deliverables**: Advanced quality and governance features

---

### Phase 6: Ecosystem Integration (Months 16-18)

**Milestone 6.1: Distribution**
- [ ] Package skills as shareable modules
- [ ] Create marketplace for custom skills
- [ ] Version control for skill definitions
- [ ] Skill dependency management

**Milestone 6.2: CI/CD Integration**
- [ ] Pipeline templates using skills
- [ ] **NEW**: Automated constitutional validation in CI (constitution-enforcer)
- [ ] **NEW**: Automated traceability check in CI (traceability-auditor)
- [ ] Test generation integration
- [ ] Deployment scripts

**Milestone 6.3: Documentation**
- [ ] Complete skill reference docs (all 25 skills)
- [ ] User guides and tutorials
- [ ] Video walkthroughs
- [ ] Example projects (simple → complex)
- [ ] **NEW**: Governance setup guide

**Milestone 6.4: Community**
- [ ] Open source repository
- [ ] Discord community
- [ ] Contribution guidelines
- [ ] Skill certification program

**Deliverables**: Full ecosystem launch with 25 skills

---

## 📊 Updated Success Metrics (25 Skills)

### Adoption Metrics
- **Skill Discovery Rate**: >90% of users find correct skill on first try (25-skill system)
- **Onboarding Time**: <20 minutes for first feature (with governance setup)
- **Learning Curve**: Junior developers productive in 1 week
- **Community Growth**: 1000+ GitHub stars in Year 1

### Quality Metrics
- **Requirements Coverage**: 100% EARS format compliance (constitution-enforcer)
- **Traceability**: 100% requirement → test mapping (traceability-auditor)
- **Test Coverage**: ≥80% code coverage
- **Constitutional Compliance**: All Phase -1 Gates passed (constitution-enforcer)
- **Bug Rate**: <5% defects in production
- **SLO Compliance**: ≥99.9% uptime (site-reliability-engineer)

### Productivity Metrics
- **Specification Time**: Reduce from 3 days → 3 hours
- **Implementation Time**: 30-50% faster with parallel execution
- **Rework Rate**: <10% due to spec-first approach
- **Documentation Completeness**: 100% templates filled
- **Incident Response Time**: <4 hours for SEV-1 (site-reliability-engineer)

### Consistency Metrics
- **Steering Accuracy**: Auto-update within 24 hours
- **Architectural Compliance**: 100% steering alignment
- **Change Tracking**: 100% deltas archived correctly
- **Validation Pass Rate**: >95% on first attempt
- **Governance Compliance**: >90% constitutional adherence (constitution-enforcer)

### Monitoring Metrics (NEW in v3.0)
- **SLO Definition Rate**: 100% of features have defined SLOs
- **Alert Accuracy**: <5% false positive rate
- **Incident Detection Time**: <5 minutes (site-reliability-engineer)
- **Rollback Success Rate**: 100% of rollbacks successful (release-coordinator)

---

## 🎓 Skills Implementation Best Practices (Updated for 25 Skills)

### 1. Writing Effective Skill Descriptions

#### ✅ DO:
- Include 10-20 trigger terms that users would naturally say
- Describe WHAT the skill does and WHEN to use it
- Be specific about deliverables and outputs
- Mention related concepts and synonyms
- Keep under 1024 characters
- **NEW**: Indicate which SDD stage or constitutional article the skill supports

#### ❌ DON'T:
- Use vague descriptions like "helps with tasks"
- Omit trigger terms - they're critical for discovery
- Exceed 1024 character limit
- Assume Claude knows when to use your skill
- Overlap with other skills' trigger terms

### 2. Tool Restrictions

Use `allowed-tools` to restrict skill capabilities:
- **Read-only skills**: `[Read, Glob, Grep]` (e.g., traceability-auditor, constitution-enforcer)
- **Write-heavy skills**: `[Read, Write]` (e.g., requirements-analyst, system-architect)
- **Development skills**: `[Read, Write, Bash, Glob, Grep]` (e.g., software-developer, bug-hunter)
- **Orchestration skills**: `[Read, Write, Bash, Glob, Grep, TodoWrite]` (e.g., orchestrator, release-coordinator)
- **Operations skills**: `[Read, Write, Bash]` (e.g., site-reliability-engineer, devops-engineer)

### 3. Skill Granularity

**Good**: Narrowly focused skills
- `requirements-analyst` - Only requirements
- `api-designer` - Only API design
- `test-engineer` - Only testing
- **NEW**: `traceability-auditor` - Only traceability validation
- **NEW**: `constitution-enforcer` - Only governance enforcement

**Bad**: Overly broad skills
- `full-stack-developer` - Too many responsibilities
- `everything-skill` - No clear focus

### 4. Skill Coordination

Skills should:
- Reference other skills they depend on
- Specify outputs for downstream skills
- Check steering before executing
- Update steering after completing
- **NEW**: Check constitutional compliance (invoke constitution-enforcer)
- **NEW**: Validate traceability (invoke traceability-auditor)

### 5. Naming Conventions

- **Name**: Lowercase with hyphens (e.g., `site-reliability-engineer`)
- **Directory**: Match skill name exactly (e.g., `.claude/skills/site-reliability-engineer/`)
- **Main File**: Always `SKILL.md` (uppercase)
- **Supporting Files**: Lowercase with hyphens (e.g., `slo-sli-guide.md`)

---

## 🔍 Testing Skills (Updated for 25 Skills)

### Manual Testing

```bash
# 1. Test skill discovery (NEW skills)
# Say: "Set up production monitoring"
# Expected: Claude invokes site-reliability-engineer skill

# Say: "Validate requirements traceability"
# Expected: Claude invokes traceability-auditor skill

# Say: "Check constitutional compliance"
# Expected: Claude invokes constitution-enforcer skill

# Say: "Analyze change impact for adding 2FA"
# Expected: Claude invokes change-impact-analyzer skill

# Say: "Plan release for v1.2.0"
# Expected: Claude invokes release-coordinator skill

# 2. Test skill chaining (governance flow)
# Say: "Build authentication system with full governance"
# Expected: constitution-enforcer → requirements-analyst → system-architect → 
#          software-developer → test-engineer → traceability-auditor

# 3. Test monitoring setup
# Say: "Set up monitoring with SLOs for my API"
# Expected: site-reliability-engineer creates SLOs, dashboards, alerts

# 4. Test change management
# Say: "I want to add 2FA to my existing auth system"
# Expected: change-impact-analyzer → (report) → orchestrator → implementation
```

### Automated Testing (Future)

```python
# tests/skills/test_constitution_enforcer.py

def test_phase_minus_one_gates():
    result = invoke_skill("constitution-enforcer", {
        "feature": "user-authentication",
        "requirements_file": "storage/features/auth/requirements.md"
    })

    assert result.gates_passed >= 9  # All 9 gates
    assert "APPROVED" in result.decision or "BLOCKED" in result.decision
    assert result.file_path.endswith("constitutional-compliance.md")

# tests/skills/test_traceability_auditor.py

def test_traceability_coverage():
    result = invoke_skill("traceability-auditor", {
        "feature": "user-authentication"
    })

    assert result.coverage_percentage == 100  # Constitutional mandate
    assert result.gaps == []
    assert result.traceability_matrix_generated == True

# tests/skills/test_site_reliability_engineer.py

def test_slo_definition():
    result = invoke_skill("site-reliability-engineer", {
        "feature": "api-service",
        "requirements_file": "storage/features/api/requirements.md"
    })

    assert "SLO" in result.content
    assert "SLI" in result.content
    assert result.monitoring_stack_configured == True
    assert result.alert_rules_created == True
```

---

## 🏁 Conclusion

This blueprint provides a complete implementation guide for the **Ultimate SDD Tool** using **Claude Code Skills API with 25 specialized skills**:

### Key Achievements

1. **25 Specialized Skills**: Expanded from 20 to 25 with 5 critical additions
2. **Complete SDD Workflow**: All 8 stages covered (Research → Monitoring)
3. **Full Constitutional Governance**: All 9 Articles enforced with dedicated skills
4. **Model-Invoked Architecture**: Skills are autonomously selected by Claude based on context
5. **Slash Commands**: User-invoked commands that trigger skill workflows
6. **Project Memory**: Auto-updating steering system maintains consistency
7. **Full Traceability**: EARS requirements → Design → Code → Tests (100% enforced)
8. **Change Management**: Delta specs for brownfield projects with impact analysis
9. **Parallel Execution**: P-labeled tasks with intelligent orchestration
10. **Production Monitoring**: Complete observability and incident response

### New Skills in v3.0 (5 Total)

| Skill | Category | Purpose | SDD Stage | Constitutional Article |
|-------|----------|---------|-----------|----------------------|
| **site-reliability-engineer** | Operations | Production monitoring, SLOs, incident response | Stage 8 | — |
| **traceability-auditor** | Quality | Requirements → Code → Test coverage validation | All stages | Article V |
| **constitution-enforcer** | Governance | Enforce 9 Articles and Phase -1 Gates | All stages | All Articles |
| **change-impact-analyzer** | Planning | Brownfield change analysis and delta specs | Stage 4 | — |
| **release-coordinator** | Operations | Multi-component releases and feature flags | Stage 7 | — |

### Synthesis of 6 Frameworks

- **musuhi**: 20-skill system → **25-skill system**, steering auto-update, EARS format, 8-stage workflow
- **OpenSpec**: Delta specs, archive workflow, brownfield support → **enhanced with change-impact-analyzer**
- **ag2**: Multi-skill orchestration, conversation patterns, human-in-the-loop
- **ai-dev-tasks**: Simplicity, progressive complexity, universal compatibility
- **cc-sdd**: P-label parallelization, validation gates → **constitution-enforcer**, customizable templates
- **spec-kit**: Constitutional governance, template-driven quality, test-first imperative → **full automation**

### Coverage Improvements (v2.0 → v3.0)

| Metric | v2.0 (20 Skills) | v3.0 (25 Skills) |
|--------|------------------|------------------|
| **SDD Workflow Stages** | 7/8 (87.5%) | 8/8 (100%) ✅ |
| **Constitutional Enforcement** | Manual | Automated (constitution-enforcer) ✅ |
| **Traceability Validation** | Self-reported | Independent auditor (traceability-auditor) ✅ |
| **Brownfield Support** | Basic | Advanced (change-impact-analyzer) ✅ |
| **Monitoring & SRE** | None | Complete (site-reliability-engineer) ✅ |
| **Release Management** | Partial | Formalized (release-coordinator) ✅ |

### Next Steps

1. **Begin Phase 1**: Create skill directory structure and SKILL.md files for all 25 skills
2. **Prioritize New Skills**: Implement the 5 new skills first (SRE, Traceability, Constitution, Change Impact, Release)
3. **Validate with Claude Code**: Test skill invocation and discovery
4. **Test Governance Flow**: Verify constitution-enforcer blocks non-compliant implementations
5. **Test Monitoring Flow**: Verify SDD Stage 8 completion with site-reliability-engineer
6. **Iterate**: Refine descriptions based on skill selection accuracy
7. **Community**: Open source and gather feedback

**The result**: A production-ready Specification Driven Development tool that leverages Claude Code Skills API for autonomous, intelligent workflow orchestration with **complete governance enforcement** and **full SDD lifecycle coverage**.

---

**End of Blueprint v3.0 - 25 Skills Architecture (Complete SDD Workflow Coverage)**

**Document Statistics**:
- Total Skills: 25 (up from 20 in v2.0)
- New Skills: 5 (SRE, Traceability Auditor, Constitution Enforcer, Change Impact Analyzer, Release Coordinator)
- SDD Stages Covered: 8/8 (100%)
- Constitutional Articles Enforced: 9/9 (100%)
- Implementation Phases: 6 (18 months)
- Standard Workflows: 4 (updated)
- Success Metrics: 25 (expanded)

Generated: 2025-11-16
Version: 3.0
Status: Complete
