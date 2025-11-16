# Product Context

## Overview
This document defines the business context, product purpose, and core capabilities. It helps AI agents understand the "why" behind development decisions and ensures alignment with business goals.

## Product Vision

### What We're Building
[Brief description of the product/service]

Example:
```
A collaborative project management platform that helps remote teams
coordinate work, track progress, and communicate effectively. Designed
for teams of 5-50 people who need simple, powerful tools without
enterprise complexity.
```

### Problem We're Solving
[What pain points does this address?]

Example:
```
Remote teams struggle with:
- Scattered information across multiple tools
- Difficulty tracking project status
- Asynchronous communication challenges
- Lack of visibility into team workload
```

### Target Users
**Primary Audience**: [Who uses this product?]
- **Role/Title**: [e.g., Project Managers, Developers, Designers]
- **Company Size**: [e.g., Startups, SMBs, Enterprise]
- **Technical Level**: [e.g., Technical, Non-technical]

Example:
```
Primary: Project managers and team leads in remote-first startups (10-50 employees)
Secondary: Individual contributors who need visibility into team work
Technical Level: Mixed (non-technical PMs, technical developers)
```

## Core Capabilities

### Must-Have Features
Features essential to the product's value proposition:

1. **[Feature Area 1]**: [Brief description]
   - **User Value**: [What benefit does this provide?]
   - **Priority**: Critical

2. **[Feature Area 2]**: [Brief description]
   - **User Value**: [What benefit does this provide?]
   - **Priority**: Critical

Example:
```
1. **Task Management**: Create, assign, and track tasks across projects
   - User Value: Clear ownership and accountability for work items
   - Priority: Critical

2. **Real-time Collaboration**: Comments, mentions, and notifications
   - User Value: Asynchronous communication without email overload
   - Priority: Critical

3. **Progress Visualization**: Dashboards and timeline views
   - User Value: Quick status understanding without status meetings
   - Priority: Critical
```

### Nice-to-Have Features
Features that enhance but aren't critical:

Example:
```
- Time tracking and reporting
- Gantt chart views
- Custom workflows
- Mobile app
- Integration marketplace
```

### Explicitly Out of Scope
Features we intentionally don't support:

Example:
```
- Resource management and capacity planning (too complex for target users)
- Financial/budget tracking (use existing tools)
- HR/people management features (not our focus)
- Custom reporting engine (provide templates instead)
```

## Business Model

### Revenue Model
[How does the product make money?]

Example:
```
- Subscription-based SaaS
- Tiered pricing: Free (up to 5 users), Pro ($10/user/month), Enterprise (custom)
- Annual billing discount (20% off)
```

### Key Metrics
Success metrics we track:

Example:
```
- Monthly Active Users (MAU)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Conversion rate (free to paid)
- Churn rate
- Net Promoter Score (NPS)
```

## User Personas

### Persona 1: [Name/Role]
**Background**: [Brief description]
**Goals**:
- [Goal 1]
- [Goal 2]
**Pain Points**:
- [Pain 1]
- [Pain 2]
**How They Use The Product**: [Typical usage patterns]

Example:
```
### Persona 1: Sarah (Project Manager)
Background: 5 years experience, manages 3-5 projects simultaneously, non-technical
Goals:
- Keep projects on track without micromanaging
- Maintain visibility across all projects
- Reduce time in status meetings
Pain Points:
- Information scattered across Slack, email, docs
- Team members forget to update task status
- Hard to see blockers early
How They Use The Product:
- Daily: Check dashboard, review notifications, update critical tasks
- Weekly: Review project timelines, adjust priorities
- Monthly: Generate progress reports for stakeholders
```

### Persona 2: [Name/Role]
[Similar structure]

## Product Principles

### Design Principles
1. **[Principle]**: [Description]
2. **[Principle]**: [Description]

Example:
```
1. **Simplicity First**: Default to simple workflows; advanced features are opt-in
2. **Async-First**: Design for asynchronous communication, not real-time
3. **Reduce Noise**: Only notify users about what matters to them
4. **Mobile-Friendly**: Key features accessible on mobile devices
5. **Transparent Progress**: Always show what's happening and why
```

### Development Priorities
When making tradeoffs:
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

Example:
```
1. **User Experience > Feature Count**: Better to do fewer things well
2. **Performance > Visual Polish**: Fast loading beats fancy animations
3. **Reliability > New Features**: Fix bugs before adding features
4. **Privacy > Analytics**: Don't track unless essential for product improvement
```

## Competitive Landscape

### Main Competitors
1. **[Competitor]**: [Strengths and weaknesses]
2. **[Competitor]**: [Strengths and weaknesses]

Example:
```
1. **Asana**: Strong task management, but complex UI overwhelming for small teams
2. **Trello**: Simple boards, but lacks advanced features for growing teams
3. **Linear**: Great for engineering teams, but too technical for non-engineers
```

### Our Differentiation
[What makes us unique?]

Example:
```
- Designed specifically for remote-first teams
- Balance between simplicity (Trello) and power (Asana)
- Best-in-class notification system (reduce noise)
- Affordable for startups (free tier more generous than competitors)
```

## Domain Terminology

### Key Terms
Standard terminology to use consistently:

Example:
```
- **Project**: Top-level container for related work
- **Task**: Individual unit of work assigned to a person
- **Milestone**: Significant project checkpoint with deadline
- **Workspace**: Organization-level container for all projects
- **Member**: User who belongs to a workspace
- **Guest**: External user with limited access to specific projects
```

### Avoid These Terms
Terms that might confuse users:

Example:
```
- Don't say "ticket" (use "task")
- Don't say "sprint" (use "milestone" or "iteration")
- Don't say "resource" for people (use "team member")
- Don't say "owner" (use "assignee" or "project lead")
```

## User Journey

### Typical User Flow
[How do users typically interact with the product?]

Example:
```
1. **Onboarding**:
   - Sign up with email/Google
   - Create workspace
   - Invite 2-3 team members
   - Create first project from template

2. **Daily Usage**:
   - Check dashboard (2-3 times/day)
   - Update task status
   - Comment on tasks
   - Respond to mentions

3. **Weekly Usage**:
   - Create new tasks for upcoming work
   - Review project timelines
   - Adjust priorities based on progress

4. **Monthly Usage**:
   - Generate progress reports
   - Review team workload
   - Archive completed projects
```

## Integration Strategy

### Must-Have Integrations
Essential for product success:

Example:
```
- Slack: Notifications and task creation
- Google Workspace: Calendar sync, Drive attachments
- GitHub/GitLab: Link commits/PRs to tasks
```

### Future Integrations
Nice to have, but not critical:

Example:
```
- Jira (for teams migrating)
- Figma (for design teams)
- Zapier (general automation)
- Notion (documentation links)
```

## Compliance & Regulations

### Requirements
[Regulatory requirements to consider]

Example:
```
- GDPR compliance (EU users)
- CCPA compliance (California users)
- SOC 2 Type II certification (enterprise customers)
- Data residency options (EU, US)
```

## Roadmap Themes

### Current Quarter
[High-level focus areas]

Example:
```
Q1 2024:
- Improve onboarding experience (reduce time to first value)
- Mobile app MVP
- Advanced search and filtering
```

### Next 6 Months
[Medium-term direction]

Example:
```
- Automation and workflow builders
- Custom field support
- Enhanced reporting capabilities
- API for custom integrations
```

---

**Note**: This document should be updated as product direction evolves. Keep it focused on high-level context rather than detailed specifications (those belong in requirements documents).

**Last Updated**: [Auto-generated by Steering Agent]
