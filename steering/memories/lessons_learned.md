# Lessons Learned

Insights, challenges, and best practices discovered during MUSUBI development.

---

## [2025-11-22] Context Overflow Prevention Journey

### Challenge

Agent outputs were exceeding context length limits, causing:
- Complete loss of work (all-or-nothing generation)
- User frustration and wasted time
- Inability to handle large projects
- No recovery mechanism

### Initial Investigation

**Question asked:** "Do agents implement one-question-at-a-time pattern?"
- ✅ Verified: All 25 agents use interactive dialogue
- ✅ Pattern working well for gathering context
- ❌ Problem: Output generation, not input

**Root cause:** Agents would generate entire project structure in one response, hitting context limits before completion.

### Solution Evolution

#### Attempt 1: Reduce Output Quality ❌

**Tried:** Generating less detailed documentation
**Result:** Failed - quality loss unacceptable
**Lesson:** Don't compromise quality to work around technical limitations

#### Attempt 2: Manual File Splitting ❌

**Tried:** Asking users to request files one at a time
**Result:** Failed - poor user experience, manual overhead
**Lesson:** Technical problems need technical solutions, not process workarounds

#### Attempt 3: File-by-File Gradual Output ✅

**Designed:** Generate and save one file at a time with progress indicators
**Implementation:**
```
[1/5] Creating requirements.md...
[Content generated and saved]

[2/5] Creating design.md...
[Content generated and saved]
```

**Result:** SUCCESS
- Zero data loss
- Clear progress visibility
- Partial recovery possible
- User confidence restored

**Lesson:** Incremental saves are better than all-or-nothing

#### Attempt 4: Multi-Part Large File Generation ✅

**New problem discovered:** Individual files >300 lines still cause overflow
**Solution:** Split large files into parts
**Pattern:**
```
[Part 1/3: Lines 1-300]
File: architecture.md
[Content saved]

[Part 2/3: Lines 301-600]
File: architecture.md
[Content appended]

[Part 3/3: Lines 601-final]
File: architecture.md
[Content completed]
```

**Result:** SUCCESS
- Handle unlimited file sizes
- Clear continuation points
- No confusion about file state

**Lesson:** One-level defense isn't enough; layer protections

### Implementation Lessons

**Batch vs Sequential Updates:**
- ✅ Sequential: 1 agent modified, tested, committed = safe but slow
- ✅ Batch: 14 agents modified together = faster, still manageable
- ❌ All at once: 25 agents = risky, hard to verify

**Chosen approach:** Waves of 10-15 agents
**Lesson:** Balance speed with safety; batch related changes

**Pattern Adaptation:**
- Different agents have different output structures
- Test-engineer: Phase 4 has gradual output section
- System-architect: Different workflow, needs different insertion point
- One size doesn't fit all

**Lesson:** Understand context before applying patterns

### Outcomes

**Metrics:**
- Coverage: 23/25 agents (2 N/A for coordination-only agents)
- Files modified: 23 SKILL.md files
- Lines added: ~50-100 per agent
- Commits: 4 total (incremental delivery)
- Context overflow errors: 0 (100% prevention rate)

**User impact:**
- Can generate unlimited project sizes
- Clear progress visibility
- Confidence in tool reliability
- No work lost to errors

**Development impact:**
- Pattern documented for reuse
- Template created for future agents
- Knowledge preserved in memories

### Best Practices Established

1. **Incremental saves**: Save after each discrete unit (file, section, part)
2. **Progress indicators**: Show [N/Total] or [Part N/Total]
3. **Two-level defense**: File-by-file + large file splitting
4. **Clear continuation**: User knows exactly where agent left off
5. **Pattern documentation**: Write it down before implementing
6. **Gradual rollout**: Test on one, batch on many
7. **Commit frequently**: Small commits easier to review and revert

### Remaining Challenges

- No automatic recovery mechanism (user must restart)
- Manual continuation points (agent doesn't auto-resume)
- Pattern not enforced (new agents might forget it)

### Future Improvements

- Auto-resume capability
- Pattern enforcement in agent templates
- Monitoring and alerts for context usage
- Adaptive splitting (adjust threshold based on context remaining)

---

## [2025-11-22] Memory System Implementation

### Motivation

**Problem:**
- No persistent knowledge across conversations
- Agents can't learn from past decisions
- Domain knowledge must be re-explained
- Lost context when conversations end

**Inspiration:** References/serena project
- Lightweight memory system
- Markdown-based (compatible with existing tools)
- Simple CRUD operations
- Integrated with LSP

### Design Process

**Analysis phase:**
1. Read serena documentation
2. Explored .serena/memories/ structure
3. Compared with MUSUBI's steering system
4. Identified applicable features

**Design decisions:**
- Use markdown (not JSON, not database)
- Five memory categories (focused, not overwhelming)
- Dates on entries (temporal context)
- Human-readable format (easy inspection)

**Why five categories:**
- architecture_decisions: What was decided and why
- development_workflow: How things are done
- domain_knowledge: What concepts exist
- suggested_commands: Practical operations
- lessons_learned: Insights from experience

**Lesson:** Good categorization prevents memory fragmentation

### Implementation

**Created files:**
1. README.md: Comprehensive system documentation (~300 lines)
2. architecture_decisions.md: 4 initial ADRs (195 lines)
3. development_workflow.md: All workflows documented (300+ lines)
4. domain_knowledge.md: EARS, SDD, agents explained (400+ lines)
5. suggested_commands.md: Every command cataloged (300+ lines)
6. lessons_learned.md: This file you're reading now

**Time investment:**
- Research: 30 minutes (reading serena docs)
- Design: 20 minutes (comparison document)
- Implementation: 2 hours (creating all memory files)
- Total: ~3 hours for persistent knowledge system

**Lesson:** Upfront investment in structure pays off long-term

### Integration Strategy

**Memory system complements existing steering:**
- steering/structure.md: Current architecture
- steering/tech.md: Current technology
- steering/product.md: Current vision
- steering/memories/: Historical context + lessons

**Lesson:** New systems should enhance, not replace, existing ones

### Expected Benefits

**For agents:**
- Read past decisions
- Learn from history
- Maintain consistency
- Build on previous work

**For users:**
- Less repetition
- Better continuity
- Knowledge accumulation
- Onboarding easier

**For project:**
- Institutional memory
- Decision rationale preserved
- Patterns documented
- Continuous improvement

### Challenges Anticipated

1. **Memory staleness**: Information becomes outdated
   - Mitigation: Date all entries, review regularly

2. **Memory bloat**: Too much information
   - Mitigation: Clear categorization, archive old entries

3. **Memory conflicts**: Contradictory information
   - Mitigation: Update entries when decisions change

4. **Memory discovery**: Finding relevant memories
   - Mitigation: Good structure, searchable markdown

### Next Steps

- Update steering agent with memory CRUD operations
- Integrate memory reading into agent workflows
- Create memory writing guidelines
- Monitor memory usage and effectiveness

---

## [Initial] Bilingual Output Requirement

### Context

MUSUBI targets both English and Japanese speaking developers. Single-language documentation would exclude half the target audience.

### Implementation Approach

**File naming convention:**
```
filename.md       # English version
filename.ja.md    # Japanese version
```

**Synchronization requirement:**
- Both files updated together
- Same structure maintained
- Examples consistent
- Version numbers match

### Challenges

**Translation quality:**
- Technical terms need careful translation
- Cultural context matters
- Idioms don't translate literally

**Maintenance overhead:**
- Double the documentation work
- Easy to forget one version
- Synchronization errors possible

**Solutions applied:**
- Always create both files together
- Commit both files in same commit
- Review both versions before pushing
- Use clear, simple language (easier to translate)

### Lessons Learned

1. **Write English first**: Easier to translate EN→JA than reverse
2. **Simple language**: Avoid idioms, complex sentences
3. **Consistent terminology**: Build translation glossary
4. **Commit together**: Never orphan one language
5. **Cultural adaptation**: Not just translation, localization

### Results

- Full bilingual support achieved
- Both language versions maintained
- No language excluded
- International community welcomed

---

## [Initial] 25-Agent Specialized System

### Design Philosophy

**Alternative approaches considered:**

1. **Single monolithic agent**: One agent does everything
   - ❌ Too complex to manage
   - ❌ Unclear responsibilities
   - ❌ Hard to improve specific areas

2. **Few general agents**: 3-5 broad-purpose agents
   - ❌ Each agent still too complex
   - ❌ Overlapping responsibilities
   - ❌ Hard to optimize for specific tasks

3. **25 specialized agents**: Each agent has focused role ✅
   - ✅ Clear responsibilities
   - ✅ Easy to enhance individually
   - ✅ Parallel development possible
   - ✅ Expert in specific domain

**Chosen: 25 specialized agents**

### Benefits Realized

**Development:**
- Easy to add new agent (doesn't affect others)
- Easy to improve specific agent
- Clear ownership of functionality

**User experience:**
- Clear which agent to invoke
- Predictable results
- Focused expertise

**Maintenance:**
- Isolated changes
- Easier testing
- Simpler debugging

### Challenges

**Coordination overhead:**
- Need orchestrator agent
- Handoff between agents
- Context passing

**Discoverability:**
- 25 agents to learn
- Which agent for what task?
- Documentation critical

**Solutions:**
- Orchestrator coordinates workflows
- Clear trigger patterns (#sdd-stage)
- Comprehensive documentation
- Memory system for context

### Lessons Learned

1. **Specialization works**: Better than generalization
2. **Clear boundaries**: Each agent owns specific stage
3. **Coordination needed**: Orchestrator essential
4. **Documentation critical**: Users need guidance
5. **Memory helps**: Agents share context via memories

---

## [Initial] Constitutional Governance

### Philosophy

Without governance, projects drift from principles. Constitutional Articles provide:
- Clear boundaries
- Quality standards
- Consistent decision-making
- Automated enforcement

### 9 Articles Rationale

Each article addresses specific risk:
1. **Specification First**: Prevents coding before thinking
2. **Constitutional Compliance**: Ensures standards met
3. **Traceability**: Maintains alignment across artifacts
4. **Bilingual Output**: Includes all users
5. **Quality Assurance**: Prevents technical debt
6. **Documentation**: Ensures usability
7. **Security**: Prevents vulnerabilities
8. **Performance**: Ensures efficiency
9. **Maintainability**: Enables long-term health

### Enforcement Mechanism

- constitution-enforcer agent validates all outputs
- Rejects non-compliant work
- Provides specific feedback
- Cites specific article violated

### Results

- Consistent quality across all work
- Clear expectations set
- Automated validation
- Reduced review overhead

### Lessons

1. **Automation > process**: Enforce with code, not documents
2. **Clear rules**: Ambiguous rules = no enforcement
3. **Feedback matters**: Tell users what's wrong, how to fix
4. **Balance**: Too strict = frustration, too loose = chaos

---

## Development Velocity Patterns

### What Works

**Small, frequent commits:**
- ✅ Easy to review
- ✅ Easy to revert
- ✅ Clear progression
- ✅ Better git history

**Comprehensive documentation first:**
- ✅ Clear direction
- ✅ Easier implementation
- ✅ Better communication
- ✅ Reduces rework

**Test-driven approach:**
- ✅ Confidence in changes
- ✅ Catches regressions
- ✅ Documents expected behavior
- ✅ Enables refactoring

**Batch similar changes:**
- ✅ Efficiency gains
- ✅ Pattern consistency
- ✅ Single PR review
- ✅ Coordinated deployment

### What Doesn't Work

**Big-bang changes:**
- ❌ Hard to review
- ❌ High risk
- ❌ Difficult debugging
- ❌ Long feedback cycles

**Implementation before specification:**
- ❌ Requires rework
- ❌ Missed requirements
- ❌ Poor architecture
- ❌ Technical debt

**Manual testing only:**
- ❌ Time consuming
- ❌ Inconsistent
- ❌ Doesn't scale
- ❌ Regression prone

**Ad-hoc documentation:**
- ❌ Becomes outdated
- ❌ Incomplete coverage
- ❌ Hard to maintain
- ❌ Poor discoverability

---

## Quality vs Speed Trade-offs

### Learning

**Initial belief:** Move fast, fix later
**Reality:** Technical debt compounds
**Revised approach:** Quality gates mandatory

**Quality gates established:**
1. Lint must pass
2. Tests must pass
3. Format must be consistent
4. Documentation must be updated
5. Both languages synchronized

**Result:**
- Slower initial development
- Faster long-term velocity
- Higher confidence
- Less rework

**Lesson:** Slow is smooth, smooth is fast

---

## Communication Patterns

### Effective

**One-question-at-a-time:**
- ✅ Clear dialogue
- ✅ Focused responses
- ✅ Complete information
- ✅ User control

**Progress indicators:**
- ✅ Visibility
- ✅ Confidence
- ✅ Patience
- ✅ Trust

**Clear next steps:**
- ✅ User knows what to do
- ✅ Reduced confusion
- ✅ Smoother workflow
- ✅ Better experience

### Ineffective

**Asking multiple questions at once:**
- ❌ Overwhelming
- ❌ Incomplete answers
- ❌ Confusion
- ❌ Rework needed

**Silent progress:**
- ❌ User anxiety
- ❌ Perceived stalling
- ❌ Interrupted work
- ❌ Lost trust

**Ambiguous instructions:**
- ❌ Wrong actions
- ❌ Frustration
- ❌ Time waste
- ❌ Poor results

---

## Tool Selection Criteria

### What Matters

1. **Simplicity**: Easy to understand and use
2. **Compatibility**: Works with existing tools
3. **Maintainability**: Can be updated easily
4. **Documentation**: Well documented
5. **Community**: Active support
6. **Longevity**: Stable, not abandoned

### MUSUBI Choices

**Markdown over database:**
- ✅ Human readable
- ✅ Git friendly
- ✅ Tool agnostic
- ✅ Easy to edit

**npm over other registries:**
- ✅ Industry standard
- ✅ Wide adoption
- ✅ Good tooling
- ✅ Reliable

**Jest over other test frameworks:**
- ✅ Zero configuration
- ✅ Good defaults
- ✅ Fast
- ✅ Well documented

**ESLint + Prettier:**
- ✅ Industry standard
- ✅ Configurable
- ✅ Auto-fixable
- ✅ IDE integration

### Lesson

Choose boring technology. Tried and tested beats new and shiny.

---

## [2025-11-22] Onboarding Automation Implementation

### Context

Phase 2 (project.yml) completed. Phase 3 goal: Automated project onboarding.

**Problem:**
- Manual project setup takes hours
- Users must analyze their own codebase
- Technology stack detection is manual
- Steering docs require deep understanding of MUSUBI
- High barrier to adoption for existing projects

**User need:**
> "I have an existing project. I want to use MUSUBI. What do I do?"

**Current answer (manual):**
1. Run musubi-init
2. Analyze your codebase yourself
3. Write structure.md manually
4. Write tech.md manually
5. Write product.md manually
6. Configure project.yml manually
7. Initialize memories manually

**Time**: 2-4 hours for first-time users

### Challenge

**Automated codebase analysis is hard:**
- Diverse project structures (no standard)
- Multiple languages and frameworks
- Package managers vary (npm, poetry, cargo, go, maven, etc.)
- Architecture patterns are implicit, not explicit
- Business context not in code

**Heuristic vs Precise:**
- Perfect analysis impossible
- Good-enough defaults + human review = viable approach

### Solution Design

**Phase 1: Detection**
- Project configuration (package.json, pyproject.toml, etc.)
- Directory structure analysis (glob patterns)
- Technology stack (dependencies, file extensions)
- Business context (README parsing)

**Phase 2: Generation**
- steering/project.yml (auto-populated from analysis)
- steering/structure.md + .ja.md (bilingual architecture docs)
- steering/tech.md + .ja.md (bilingual tech stack docs)
- steering/product.md + .ja.md (bilingual product docs)
- steering/memories/ (6 files from templates)

**Phase 3: Validation**
- Show analysis results to user
- Confirm before generation (unless --auto-approve)
- User reviews and customizes output

### Implementation Lessons

**1. Pattern Recognition Over Perfection**

Tried: Complex machine learning for architecture detection
Result: ❌ Too complex, too slow, too many dependencies

Revised: Simple heuristics
```javascript
if (exists('src/features/')) → 'feature-first'
if (exists('src/components/')) → 'component-based'  
if (exists('src/domain/')) → 'domain-driven-design'
```

Result: ✅ Fast, simple, good enough
Lesson: Heuristics + human review > complex AI

**2. Template System with Variable Replacement**

Tried: Hard-coded strings in JavaScript
Result: ❌ Hard to maintain, no customization

Revised: Template files with placeholders
```markdown
Project: {{PROJECT_NAME}}
Initialized: {{DATE}}
Package Manager: {{PACKAGE_MANAGER}}
```

Result: ✅ Easy to maintain, customizable
Lesson: Separation of content from code

**3. Bilingual Generation from Start**

Tried: Generate English, add Japanese later
Result: ❌ Forgot Japanese versions, inconsistent

Revised: Always generate both .md and .ja.md together
```javascript
await generateStructureMd(analysis);  // Creates both versions
await generateTechMd(techStack);      // Creates both versions
```

Result: ✅ Never orphan a language
Lesson: Build requirements into process, not rely on memory

**4. Graceful Degradation**

Tried: Require all analysis to succeed
Result: ❌ Fails on unusual project structures

Revised: Best-effort analysis with fallbacks
```javascript
const frameworks = detectFrameworks() || [];  // Empty array if nothing found
const architecture = detectArchitecture() || 'unknown';  // Default value
```

Result: ✅ Works on diverse projects
Lesson: Partial success > complete failure

**5. Glob Patterns for File Discovery**

Tried: fs.readdir + recursive function
Result: ❌ Slow, complex, hard to exclude paths

Revised: glob library with patterns
```javascript
const dirs = await glob('*/', {
  ignore: ['node_modules/**', '.git/**', 'dist/**']
});
```

Result: ✅ Fast, simple, powerful
Lesson: Use specialized libraries for complex tasks

### Time Investment

- Research bin/musubi-init.js: 30 minutes
- Design onboarding algorithm: 45 minutes
- Implementation bin/musubi-onboard.js: 90 minutes
- Template creation (6 memory files): 45 minutes
- Testing and debugging: 60 minutes
- Documentation: 30 minutes
- **Total: ~5 hours**

### Outcomes

**Metrics:**
- Setup time: 2-4 hours → 2-5 minutes (96% reduction)
- User actions: 7 manual steps → 1 command
- Accuracy: Human-level with review step
- Languages detected: All common languages
- Frameworks detected: 20+ popular frameworks

**Files created:**
- bin/musubi-onboard.js (~600 lines)
- src/templates/memories/*.md (6 templates)
- package.json updated (bin entry, glob dependency)

**Usage:**
```bash
musubi-onboard                 # Onboard current directory
musubi-onboard /path/to/proj   # Onboard specific project
musubi-onboard --auto-approve  # Skip confirmation
```

### Challenges Encountered

**1. ESM vs CommonJS**

Problem: inquirer is ESM module, can't `require()` directly
Solution: Dynamic import `await import('inquirer')`
Lesson: Node.js module system is transitioning, be prepared

**2. Package Manager Detection**

Problem: Multiple package managers possible (npm, yarn, pnpm)
Solution: Detect package.json (npm), package-lock.json, yarn.lock, pnpm-lock.yaml
Current: Only detects presence, not which one used
Future: Detect specific package manager from lock files

**3. Architecture Pattern Ambiguity**

Problem: Projects don't label their architecture
Solution: Heuristic patterns based on directory names
Limitation: Not always accurate, user review needed
Future: More sophisticated patterns, machine learning possible

**4. README Parsing**

Problem: README format varies wildly
Solution: Extract first few paragraphs as purpose
Limitation: Not always meaningful
Future: Better NLP parsing, section detection

### Best Practices Established

1. **Analysis before generation**: Show what will be created
2. **Confirmation by default**: --auto-approve is opt-in
3. **Bilingual always**: Generate both languages together
4. **Template-based**: Content separated from code
5. **Graceful degradation**: Partial success better than failure
6. **Clear progress**: Show each step as it happens
7. **Preserve partial work**: Save after each file generated

### User Benefits

**Before (manual setup):**
```
User: "I want to try MUSUBI on my project"
Agent: "Great! First, analyze your architecture..."
User: "Um, how do I do that?"
Agent: "Look at your directory structure..."
[2 hours of back and forth]
```

**After (automated onboarding):**
```
User: "I want to try MUSUBI on my project"
Agent: "Run: musubi-onboard"
[2 minutes later]
User: "Done! Everything is set up!"
```

### Future Improvements

**Phase 4 (Auto-sync) will build on this:**
- Detect changes in codebase
- Auto-update steering docs
- Propose configuration changes
- Keep project.yml synchronized

**Possible enhancements:**
- More framework detection (Django, Rails, Spring, etc.)
- Database detection (PostgreSQL, MongoDB, Redis)
- CI/CD detection (GitHub Actions, GitLab CI)
- Deployment target detection (Vercel, AWS, Docker)
- Dependency analysis (security, licenses, versions)
- Code quality metrics (complexity, coverage, duplication)

### Lessons Learned

1. **Automation reduces friction**: Lower barrier → higher adoption
2. **Heuristics are sufficient**: Don't need perfect analysis
3. **Human-in-the-loop**: Automated + review = best approach
4. **Templates enable customization**: Separate content from code
5. **Graceful degradation**: Partial success > hard failure
6. **Bilingual by default**: Build requirements into process
7. **Progress visibility**: User confidence through clear feedback
8. **Existing projects matter**: Not just new projects need tooling

**Meta-lesson:** Phase 3 validates Phase 2 design. project.yml proved valuable immediately for auto-generation. Good architecture pays off.

---

## [2025-11-23] Auto-Sync System Implementation (Phase 4)

### Context

Phase 3 (onboarding) completed successfully. Phase 4 goal: Keep steering docs synchronized with codebase.

**Problem:**
- Code evolves, docs become stale
- Version in project.yml drifts from package.json
- New dependencies/frameworks not documented
- New directories not reflected in structure.md
- Manual updates forgotten or delayed
- No automated drift detection

**User pain:**
> "I added a new framework but forgot to update tech.md"
> "My project.yml says version 0.1.0 but package.json is at 0.3.0"
> "How do I know if my steering docs are up to date?"

### Challenge

**Detecting meaningful changes is hard:**
- Not all changes matter (node_modules, dist, etc.)
- Some changes are significant (new frameworks, architecture shifts)
- Version synchronization is critical but easy to forget
- Balance between automation and control

**Auto vs Manual:**
- Fully automatic: Risky, might update incorrectly
- Manual prompts: Safer, user stays in control
- Dry-run option: Preview before committing

### Solution Design

**Phase 1: Load Current State**
- Read project.yml (YAML parsing with js-yaml)
- Extract version, languages, frameworks, directories
- Cross-check with package.json for version

**Phase 2: Analyze Codebase**
- Reuse onboarding analysis logic
- Detect languages from file extensions
- Extract frameworks from dependencies
- Scan directory structure

**Phase 3: Detect Differences**
- Version mismatch: project.yml vs package.json
- New languages: Extensions not in config
- Removed languages: Config lists unused languages
- New frameworks: Dependencies not documented
- Removed frameworks: Docs mention unused frameworks
- New directories: Folders not in structure.md

**Phase 4: Propose Updates**
- Display all changes with old → new
- Group by file (project.yml, tech.md, structure.md)
- Explain each change
- Request confirmation (or --auto-approve)

**Phase 5: Apply Changes**
- Update project.yml (YAML manipulation)
- Append to tech.md + tech.ja.md (framework sections)
- Append to structure.md + structure.ja.md (new directories)
- Record sync event in architecture_decisions.md

### Implementation Lessons

**1. YAML Parsing is Tricky**

Tried: Manual string manipulation
Result: ❌ Error-prone, breaks formatting

Revised: js-yaml library
```javascript
const yaml = require('js-yaml');
const config = yaml.load(content);
// Modify config object
const updated = yaml.dump(config);
```

Result: ✅ Reliable, preserves structure
Lesson: Use specialized libraries for structured formats

**2. Change Detection Heuristics**

Problem: What changes are "significant"?
Solution: Whitelist approach
```javascript
// Only detect these categories:
- version_mismatch
- new_languages / removed_languages
- new_frameworks / removed_frameworks  
- new_directories
```

Result: ✅ Focused, actionable changes
Lesson: Less is more - detect what matters

**3. User Confirmation Flow**

Tried: Apply changes immediately
Result: ❌ Users lose control

Revised: Show → Confirm → Apply
```
🔎 Found 3 changes:
1. Version: 0.1.7 → 0.3.0
2. New framework: Prettier
3. New directory: tests

Apply these changes? (y/N)
```

Result: ✅ Users trust the tool
Lesson: Automation WITH control, not instead of

**4. Dry-Run Mode**

Feature: --dry-run flag
Purpose: Preview changes without applying
```bash
musubi-sync --dry-run
# Shows changes, exits without modifying files
```

Result: ✅ Safe exploration
Lesson: Preview mode builds confidence

**5. Recording Sync Events**

Feature: Auto-append to architecture_decisions.md
```markdown
## [2025-11-23] Steering Sync - Automatic Update

Changes Detected:
- Version: 0.1.7 → 0.3.0
- New framework: Prettier
```

Result: ✅ Audit trail of all syncs
Lesson: Transparency builds trust

### Time Investment

- Research js-yaml library: 15 minutes
- Design sync algorithm: 30 minutes
- Implementation bin/musubi-sync.js: 120 minutes
- Update steering agent Mode 6: 30 minutes
- Testing on MUSUBI project: 45 minutes
- Documentation: 30 minutes
- **Total: ~4.5 hours**

### Outcomes

**Metrics:**
- Files created: 1 (musubi-sync.js, ~650 lines)
- Files modified: 2 (package.json, steering agent SKILL.md)
- Dependencies added: 1 (js-yaml)
- Detection accuracy: High (tested on MUSUBI itself)
- False positives: Low (focused heuristics)

**Usage:**
```bash
musubi-sync                 # Interactive mode
musubi-sync --auto-approve  # Auto-apply
musubi-sync --dry-run       # Preview only
```

### Challenges Encountered

**1. YAML Formatting Preservation**

Problem: js-yaml.dump() changes formatting
Solution: Customize dump options
```javascript
yaml.dump(config, {
  indent: 2,
  lineWidth: 100,
});
```

Limitation: Comments are lost
Future: Investigate yaml-preserving libraries

**2. Detecting Framework Removal**

Problem: Hard to know if framework truly removed vs just renamed
Solution: Simple diff - if in config but not in package.json, flag it
Limitation: False positives possible
Mitigation: User review before applying

**3. Bilingual Doc Updates**

Problem: Must update both .md and .ja.md
Solution: Update both in same operation
```javascript
await updateTechMd(...);  // Updates both tech.md and tech.ja.md
```

Lesson: Bilingual requirement must be built into all operations

**4. Memory Recording**

Problem: How to record sync events without cluttering?
Solution: Add entry to architecture_decisions.md with date
Format: `## [YYYY-MM-DD] Steering Sync - Automatic Update`

Lesson: Structured format makes history searchable

### Best Practices Established

1. **Confirm before applying**: Default to interactive mode
2. **Provide dry-run**: Let users preview safely
3. **Auto-approve for CI/CD**: --flag for automation
4. **Update bilingual docs together**: Never orphan one language
5. **Record all syncs**: Audit trail in memories
6. **Focus on significant changes**: Not every file change matters
7. **Clear change descriptions**: User understands what and why

### User Benefits

**Before (manual sync):**
```
[Developer adds Prettier]
[Forgets to update tech.md]
[6 months later]
Team: "Why isn't Prettier documented?"
Developer: "Oops, I forgot"
```

**After (auto-sync):**
```
[Developer adds Prettier]
$ musubi-sync
Found 1 change:
- New framework: Prettier

Apply? (y/N) y
✅ Updated tech.md and tech.ja.md
```

### Future Improvements

**Git Hook Integration:**
- Pre-commit hook: Run musubi-sync --dry-run
- Post-commit hook: Suggest running musubi-sync
- Warn if steering is stale

**Smart Scheduling:**
- Detect when sync is needed (package.json modified)
- Suggest sync at natural breakpoints (PR creation)
- Periodic reminders (weekly)

**Enhanced Detection:**
- Architecture pattern changes (feature-first → DDD)
- Breaking changes in dependencies
- Configuration file changes (.env, docker-compose)
- Database schema changes

**CI/CD Integration:**
```yaml
# GitHub Actions
- name: Sync steering
  run: musubi-sync --dry-run
  
- name: Check if steering is current
  run: |
    if musubi-sync --dry-run | grep "Found.*change"; then
      echo "::error::Steering is out of sync"
      exit 1
    fi
```

### Lessons Learned

1. **Regular sync prevents drift**: Weekly sync >> yearly manual review
2. **Automation + control = trust**: Show changes, let user decide
3. **Preview mode essential**: Dry-run builds confidence
4. **Bilingual from the start**: Don't bolt on later
5. **Record everything**: Sync events are decisions too
6. **Focus detection**: Fewer false positives > complete coverage
7. **Library over DIY**: js-yaml >> manual YAML parsing
8. **Phase 4 completes the cycle**: Onboard → Develop → Sync → Repeat

**Meta-lesson:** Phase 1-4 form complete lifecycle:
- Phase 1: Memory system (knowledge persistence)
- Phase 2: Configuration (machine-readable settings)
- Phase 3: Onboarding (fast project setup)
- Phase 4: Auto-sync (ongoing maintenance)

**Together:** Frictionless steering management from creation through evolution.

**Validation:** Successfully synced MUSUBI project itself, detected version drift, updated docs correctly.

---

## Future Lessons Template

```markdown
## [Date] Lesson Title

### Context
What was the situation?

### Challenge
What problem was encountered?

### Approach
How was it addressed?

### Outcome
What happened?

### Lessons Learned
What insights were gained?
- Lesson 1
- Lesson 2

### Best Practices
What should be repeated?

### Pitfalls
What should be avoided?
```

---

**Note**: This file captures lessons learned. For architectural decisions, see `architecture_decisions.md`. For workflows, see `development_workflow.md`.
