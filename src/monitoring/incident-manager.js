/**
 * Incident Manager - Incident response and management
 * 
 * Provides incident management capabilities:
 * - Incident lifecycle management
 * - Runbook execution
 * - Post-mortem generation
 * - On-call management
 * 
 * Part of MUSUBI v5.0.0 - Production Readiness
 * 
 * @module monitoring/incident-manager
 * @version 1.0.0
 * 
 * @traceability
 * - Requirement: REQ-P5-002 (Incident Management)
 * - Design: docs/design/tdd-musubi-v5.0.0.md#3.2
 * - Test: tests/monitoring/incident-manager.test.js
 */

const { EventEmitter } = require('events');

/**
 * Incident Severity Levels
 */
const IncidentSeverity = {
  SEV1: 'sev1', // Critical - major customer impact
  SEV2: 'sev2', // High - significant impact
  SEV3: 'sev3', // Medium - limited impact
  SEV4: 'sev4', // Low - minimal impact
  SEV5: 'sev5'  // Informational
};

/**
 * Incident Status
 */
const IncidentStatus = {
  DETECTED: 'detected',
  TRIAGING: 'triaging',
  INVESTIGATING: 'investigating',
  IDENTIFIED: 'identified',
  MITIGATING: 'mitigating',
  MONITORING: 'monitoring',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

/**
 * Runbook Step Status
 */
const StepStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  SKIPPED: 'skipped'
};

/**
 * Incident definition
 */
class Incident {
  constructor(options) {
    this.id = options.id || this._generateId();
    this.title = options.title;
    this.description = options.description || '';
    this.severity = options.severity || IncidentSeverity.SEV3;
    this.status = options.status || IncidentStatus.DETECTED;
    
    this.detectedAt = options.detectedAt || new Date();
    this.acknowledgedAt = null;
    this.mitigatedAt = null;
    this.resolvedAt = null;
    this.closedAt = null;
    
    this.affectedServices = options.affectedServices || [];
    this.impactSummary = options.impactSummary || '';
    this.customerImpact = options.customerImpact || {
      affected: 0,
      percentage: 0
    };
    
    this.assignee = options.assignee || null;
    this.responders = options.responders || [];
    this.commander = options.commander || null;
    
    this.timeline = [{
      timestamp: this.detectedAt,
      action: 'detected',
      description: 'Incident detected',
      actor: 'system'
    }];
    
    this.rootCause = null;
    this.resolution = null;
    this.postMortem = null;
    
    this.relatedIncidents = options.relatedIncidents || [];
    this.tags = options.tags || [];
    this.metadata = options.metadata || {};
  }

  /**
   * Acknowledge the incident
   */
  acknowledge(responder) {
    if (this.acknowledgedAt) {
      throw new Error('Incident already acknowledged');
    }
    
    this.acknowledgedAt = new Date();
    this.status = IncidentStatus.TRIAGING;
    this.assignee = responder;
    
    if (!this.responders.includes(responder)) {
      this.responders.push(responder);
    }
    
    this._addTimelineEntry('acknowledged', `Acknowledged by ${responder}`, responder);
    return this;
  }

  /**
   * Add a responder
   */
  addResponder(responder, role = 'responder') {
    if (!this.responders.includes(responder)) {
      this.responders.push(responder);
      this._addTimelineEntry('responder_added', `${responder} joined as ${role}`, responder);
    }
    return this;
  }

  /**
   * Set incident commander
   */
  setCommander(commander) {
    this.commander = commander;
    this.addResponder(commander, 'commander');
    this._addTimelineEntry('commander_assigned', `${commander} assigned as incident commander`, commander);
    return this;
  }

  /**
   * Transition to a new status
   */
  updateStatus(newStatus, note = '', actor = 'system') {
    const previousStatus = this.status;
    this.status = newStatus;
    
    this._addTimelineEntry('status_change', `Status changed from ${previousStatus} to ${newStatus}. ${note}`, actor);
    
    // Update timestamps
    if (newStatus === IncidentStatus.MITIGATING && !this.mitigatedAt) {
      // Record when mitigation started
    }
    if (newStatus === IncidentStatus.RESOLVED) {
      this.resolvedAt = new Date();
    }
    if (newStatus === IncidentStatus.CLOSED) {
      this.closedAt = new Date();
    }
    
    return this;
  }

  /**
   * Update severity
   */
  updateSeverity(newSeverity, reason = '', actor = 'system') {
    const previousSeverity = this.severity;
    this.severity = newSeverity;
    this._addTimelineEntry('severity_change', `Severity changed from ${previousSeverity} to ${newSeverity}. ${reason}`, actor);
    return this;
  }

  /**
   * Add a timeline entry
   */
  addUpdate(description, actor = 'system') {
    this._addTimelineEntry('update', description, actor);
    return this;
  }

  /**
   * Set root cause
   */
  setRootCause(rootCause, actor = 'system') {
    this.rootCause = rootCause;
    this.status = IncidentStatus.IDENTIFIED;
    this._addTimelineEntry('root_cause_identified', `Root cause identified: ${rootCause}`, actor);
    return this;
  }

  /**
   * Set resolution
   */
  setResolution(resolution, actor = 'system') {
    this.resolution = resolution;
    this.status = IncidentStatus.RESOLVED;
    this.resolvedAt = new Date();
    this._addTimelineEntry('resolved', `Incident resolved: ${resolution}`, actor);
    return this;
  }

  /**
   * Calculate time metrics
   */
  getMetrics() {
    const now = new Date();
    
    return {
      timeToAcknowledge: this.acknowledgedAt 
        ? (this.acknowledgedAt - this.detectedAt) / 1000 
        : null,
      timeToMitigate: this.mitigatedAt 
        ? (this.mitigatedAt - this.detectedAt) / 1000 
        : null,
      timeToResolve: this.resolvedAt 
        ? (this.resolvedAt - this.detectedAt) / 1000 
        : null,
      totalDuration: this.closedAt 
        ? (this.closedAt - this.detectedAt) / 1000 
        : (now - this.detectedAt) / 1000,
      isOpen: !this.closedAt
    };
  }

  /**
   * Add timeline entry
   * @private
   */
  _addTimelineEntry(action, description, actor) {
    this.timeline.push({
      timestamp: new Date(),
      action,
      description,
      actor
    });
  }

  /**
   * Generate unique ID
   * @private
   */
  _generateId() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    return `INC-${dateStr}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      severity: this.severity,
      status: this.status,
      detectedAt: this.detectedAt,
      acknowledgedAt: this.acknowledgedAt,
      resolvedAt: this.resolvedAt,
      closedAt: this.closedAt,
      affectedServices: this.affectedServices,
      impactSummary: this.impactSummary,
      customerImpact: this.customerImpact,
      assignee: this.assignee,
      responders: this.responders,
      commander: this.commander,
      timeline: this.timeline,
      rootCause: this.rootCause,
      resolution: this.resolution,
      tags: this.tags,
      metrics: this.getMetrics()
    };
  }
}

/**
 * Runbook definition
 */
class Runbook {
  constructor(options) {
    this.id = options.id || `rb-${Date.now()}`;
    this.name = options.name;
    this.description = options.description || '';
    this.version = options.version || '1.0.0';
    this.category = options.category || 'general';
    this.tags = options.tags || [];
    this.estimatedDuration = options.estimatedDuration || '15 minutes';
    
    this.steps = (options.steps || []).map((step, index) => ({
      id: step.id || `step-${index + 1}`,
      order: step.order || index + 1,
      title: step.title,
      description: step.description || '',
      command: step.command || null,
      expectedOutput: step.expectedOutput || null,
      onFailure: step.onFailure || 'abort', // abort, continue, retry
      timeout: step.timeout || 300, // seconds
      requiresConfirmation: step.requiresConfirmation || false
    }));
    
    this.metadata = options.metadata || {};
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      version: this.version,
      category: this.category,
      tags: this.tags,
      estimatedDuration: this.estimatedDuration,
      steps: this.steps,
      metadata: this.metadata
    };
  }
}

/**
 * Runbook execution context
 */
class RunbookExecution {
  constructor(runbook, incident = null) {
    this.id = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    this.runbook = runbook;
    this.incident = incident;
    this.startedAt = new Date();
    this.completedAt = null;
    this.status = 'running';
    
    this.stepResults = runbook.steps.map(step => ({
      stepId: step.id,
      status: StepStatus.PENDING,
      startedAt: null,
      completedAt: null,
      output: null,
      error: null
    }));
    
    this.currentStepIndex = 0;
  }

  /**
   * Start executing a step
   */
  startStep(stepId) {
    const result = this.stepResults.find(r => r.stepId === stepId);
    if (result) {
      result.status = StepStatus.IN_PROGRESS;
      result.startedAt = new Date();
    }
    return this;
  }

  /**
   * Complete a step
   */
  completeStep(stepId, output = null) {
    const result = this.stepResults.find(r => r.stepId === stepId);
    if (result) {
      result.status = StepStatus.COMPLETED;
      result.completedAt = new Date();
      result.output = output;
      this.currentStepIndex++;
    }
    
    // Check if all steps completed
    if (this.currentStepIndex >= this.runbook.steps.length) {
      this.status = 'completed';
      this.completedAt = new Date();
    }
    
    return this;
  }

  /**
   * Fail a step
   */
  failStep(stepId, error) {
    const result = this.stepResults.find(r => r.stepId === stepId);
    if (result) {
      result.status = StepStatus.FAILED;
      result.completedAt = new Date();
      result.error = error;
    }
    
    // Get step config to determine action
    const step = this.runbook.steps.find(s => s.id === stepId);
    if (step && step.onFailure === 'abort') {
      this.status = 'failed';
      this.completedAt = new Date();
    } else if (step && step.onFailure === 'continue') {
      this.currentStepIndex++;
    }
    
    return this;
  }

  /**
   * Skip a step
   */
  skipStep(stepId, reason = '') {
    const result = this.stepResults.find(r => r.stepId === stepId);
    if (result) {
      result.status = StepStatus.SKIPPED;
      result.completedAt = new Date();
      result.output = reason;
      this.currentStepIndex++;
    }
    return this;
  }

  /**
   * Get current step
   */
  getCurrentStep() {
    if (this.currentStepIndex < this.runbook.steps.length) {
      return this.runbook.steps[this.currentStepIndex];
    }
    return null;
  }

  /**
   * Get execution progress
   */
  getProgress() {
    const completed = this.stepResults.filter(r => 
      r.status === StepStatus.COMPLETED || 
      r.status === StepStatus.SKIPPED
    ).length;
    
    return {
      total: this.runbook.steps.length,
      completed,
      percentage: Math.round((completed / this.runbook.steps.length) * 100),
      currentStep: this.getCurrentStep()
    };
  }

  toJSON() {
    return {
      id: this.id,
      runbookId: this.runbook.id,
      runbookName: this.runbook.name,
      incidentId: this.incident ? this.incident.id : null,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      status: this.status,
      stepResults: this.stepResults,
      progress: this.getProgress()
    };
  }
}

/**
 * Post-mortem document
 */
class PostMortem {
  constructor(incident) {
    this.id = `pm-${incident.id}`;
    this.incidentId = incident.id;
    this.title = `Post-Mortem: ${incident.title}`;
    this.createdAt = new Date();
    this.status = 'draft';
    
    // Auto-populate from incident
    this.summary = {
      severity: incident.severity,
      duration: incident.getMetrics().totalDuration,
      affectedServices: incident.affectedServices,
      customerImpact: incident.customerImpact
    };
    
    this.timeline = incident.timeline;
    this.rootCause = incident.rootCause || 'TBD';
    this.resolution = incident.resolution || 'TBD';
    
    this.detection = {
      method: 'TBD',
      timeToDetect: incident.getMetrics().timeToAcknowledge
    };
    
    this.response = {
      responders: incident.responders,
      commander: incident.commander,
      timeToMitigate: incident.getMetrics().timeToMitigate
    };
    
    this.actionItems = [];
    this.lessonsLearned = [];
    this.whatWentWell = [];
    this.whatWentPoorly = [];
  }

  /**
   * Add an action item
   */
  addActionItem(item) {
    this.actionItems.push({
      id: `ai-${this.actionItems.length + 1}`,
      title: item.title,
      description: item.description || '',
      owner: item.owner || null,
      priority: item.priority || 'medium',
      dueDate: item.dueDate || null,
      status: 'open',
      createdAt: new Date()
    });
    return this;
  }

  /**
   * Add a lesson learned
   */
  addLessonLearned(lesson) {
    this.lessonsLearned.push(lesson);
    return this;
  }

  /**
   * Add what went well
   */
  addWhatWentWell(item) {
    this.whatWentWell.push(item);
    return this;
  }

  /**
   * Add what went poorly
   */
  addWhatWentPoorly(item) {
    this.whatWentPoorly.push(item);
    return this;
  }

  /**
   * Generate markdown document
   */
  toMarkdown() {
    let md = `# ${this.title}\n\n`;
    md += `**Incident ID:** ${this.incidentId}  \n`;
    md += `**Severity:** ${this.summary.severity}  \n`;
    md += `**Duration:** ${Math.round(this.summary.duration / 60)} minutes  \n`;
    md += `**Status:** ${this.status}  \n\n`;

    md += `## Summary\n\n`;
    md += `**Affected Services:** ${this.summary.affectedServices.join(', ') || 'N/A'}  \n`;
    md += `**Customer Impact:** ${this.summary.customerImpact.percentage}% of users affected  \n\n`;

    md += `## Timeline\n\n`;
    for (const entry of this.timeline) {
      const time = new Date(entry.timestamp).toISOString();
      md += `- **${time}** - ${entry.description} (${entry.actor})\n`;
    }
    md += '\n';

    md += `## Root Cause\n\n${this.rootCause}\n\n`;
    md += `## Resolution\n\n${this.resolution}\n\n`;

    md += `## Detection\n\n`;
    md += `**Method:** ${this.detection.method}  \n`;
    md += `**Time to Detect:** ${this.detection.timeToDetect ? Math.round(this.detection.timeToDetect) + 's' : 'N/A'}  \n\n`;

    md += `## Response\n\n`;
    md += `**Commander:** ${this.response.commander || 'N/A'}  \n`;
    md += `**Responders:** ${this.response.responders.join(', ') || 'N/A'}  \n`;
    md += `**Time to Mitigate:** ${this.response.timeToMitigate ? Math.round(this.response.timeToMitigate) + 's' : 'N/A'}  \n\n`;

    if (this.whatWentWell.length > 0) {
      md += `## What Went Well\n\n`;
      for (const item of this.whatWentWell) {
        md += `- ${item}\n`;
      }
      md += '\n';
    }

    if (this.whatWentPoorly.length > 0) {
      md += `## What Went Poorly\n\n`;
      for (const item of this.whatWentPoorly) {
        md += `- ${item}\n`;
      }
      md += '\n';
    }

    if (this.lessonsLearned.length > 0) {
      md += `## Lessons Learned\n\n`;
      for (const lesson of this.lessonsLearned) {
        md += `- ${lesson}\n`;
      }
      md += '\n';
    }

    if (this.actionItems.length > 0) {
      md += `## Action Items\n\n`;
      md += `| Priority | Title | Owner | Due Date | Status |\n`;
      md += `|----------|-------|-------|----------|--------|\n`;
      for (const item of this.actionItems) {
        md += `| ${item.priority} | ${item.title} | ${item.owner || 'TBD'} | ${item.dueDate || 'TBD'} | ${item.status} |\n`;
      }
      md += '\n';
    }

    return md;
  }

  toJSON() {
    return {
      id: this.id,
      incidentId: this.incidentId,
      title: this.title,
      createdAt: this.createdAt,
      status: this.status,
      summary: this.summary,
      timeline: this.timeline,
      rootCause: this.rootCause,
      resolution: this.resolution,
      detection: this.detection,
      response: this.response,
      whatWentWell: this.whatWentWell,
      whatWentPoorly: this.whatWentPoorly,
      lessonsLearned: this.lessonsLearned,
      actionItems: this.actionItems
    };
  }
}

/**
 * Incident Manager
 */
class IncidentManager extends EventEmitter {
  constructor(options = {}) {
    super();
    this.incidents = new Map();
    this.runbooks = new Map();
    this.executions = new Map();
    this.postMortems = new Map();
    
    this.oncall = {
      primary: options.primaryOncall || null,
      secondary: options.secondaryOncall || null,
      escalation: options.escalation || []
    };
    
    this.options = {
      autoAcknowledgeTimeout: options.autoAcknowledgeTimeout || 300, // 5 minutes
      ...options
    };
  }

  /**
   * Create a new incident
   */
  createIncident(options) {
    const incident = options instanceof Incident ? options : new Incident(options);
    this.incidents.set(incident.id, incident);
    this.emit('incidentCreated', incident);
    
    // Auto-notify on-call
    if (this.oncall.primary) {
      this.emit('notify', {
        type: 'incident',
        incident,
        recipient: this.oncall.primary
      });
    }
    
    return incident;
  }

  /**
   * Get an incident by ID
   */
  getIncident(id) {
    return this.incidents.get(id);
  }

  /**
   * List incidents
   */
  listIncidents(filter = {}) {
    let incidents = [...this.incidents.values()];
    
    if (filter.status) {
      const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
      incidents = incidents.filter(i => statuses.includes(i.status));
    }
    if (filter.severity) {
      const severities = Array.isArray(filter.severity) ? filter.severity : [filter.severity];
      incidents = incidents.filter(i => severities.includes(i.severity));
    }
    if (filter.open) {
      incidents = incidents.filter(i => 
        i.status !== IncidentStatus.RESOLVED && 
        i.status !== IncidentStatus.CLOSED
      );
    }
    
    return incidents.map(i => i.toJSON());
  }

  /**
   * Acknowledge an incident
   */
  acknowledgeIncident(incidentId, responder) {
    const incident = this.incidents.get(incidentId);
    if (!incident) throw new Error(`Incident not found: ${incidentId}`);
    
    incident.acknowledge(responder);
    this.emit('incidentAcknowledged', incident);
    return incident;
  }

  /**
   * Update incident status
   */
  updateIncidentStatus(incidentId, newStatus, note = '', actor = 'system') {
    const incident = this.incidents.get(incidentId);
    if (!incident) throw new Error(`Incident not found: ${incidentId}`);
    
    incident.updateStatus(newStatus, note, actor);
    this.emit('incidentStatusChanged', { incident, newStatus });
    return incident;
  }

  /**
   * Resolve an incident
   */
  resolveIncident(incidentId, resolution, actor = 'system') {
    const incident = this.incidents.get(incidentId);
    if (!incident) throw new Error(`Incident not found: ${incidentId}`);
    
    incident.setResolution(resolution, actor);
    this.emit('incidentResolved', incident);
    return incident;
  }

  /**
   * Register a runbook
   */
  registerRunbook(options) {
    const runbook = options instanceof Runbook ? options : new Runbook(options);
    this.runbooks.set(runbook.id, runbook);
    this.emit('runbookRegistered', runbook);
    return runbook;
  }

  /**
   * Get a runbook
   */
  getRunbook(id) {
    return this.runbooks.get(id);
  }

  /**
   * List runbooks
   */
  listRunbooks(filter = {}) {
    let runbooks = [...this.runbooks.values()];
    
    if (filter.category) {
      runbooks = runbooks.filter(r => r.category === filter.category);
    }
    if (filter.tag) {
      runbooks = runbooks.filter(r => r.tags.includes(filter.tag));
    }
    
    return runbooks.map(r => r.toJSON());
  }

  /**
   * Execute a runbook
   */
  executeRunbook(runbookId, incident = null) {
    const runbook = this.runbooks.get(runbookId);
    if (!runbook) throw new Error(`Runbook not found: ${runbookId}`);
    
    const execution = new RunbookExecution(runbook, incident);
    this.executions.set(execution.id, execution);
    this.emit('runbookExecutionStarted', execution);
    
    // Link to incident if provided
    if (incident) {
      incident.addUpdate(`Runbook "${runbook.name}" execution started`, 'system');
    }
    
    return execution;
  }

  /**
   * Get execution
   */
  getExecution(id) {
    return this.executions.get(id);
  }

  /**
   * Create post-mortem for an incident
   */
  createPostMortem(incidentId) {
    const incident = this.incidents.get(incidentId);
    if (!incident) throw new Error(`Incident not found: ${incidentId}`);
    
    const postMortem = new PostMortem(incident);
    this.postMortems.set(postMortem.id, postMortem);
    incident.postMortem = postMortem.id;
    
    this.emit('postMortemCreated', postMortem);
    return postMortem;
  }

  /**
   * Get post-mortem
   */
  getPostMortem(id) {
    return this.postMortems.get(id);
  }

  /**
   * Set on-call schedule
   */
  setOncall(primary, secondary = null) {
    this.oncall.primary = primary;
    this.oncall.secondary = secondary;
    this.emit('oncallUpdated', this.oncall);
    return this;
  }

  /**
   * Get current on-call
   */
  getOncall() {
    return { ...this.oncall };
  }

  /**
   * Get incident statistics
   */
  getStatistics(options = {}) {
    const incidents = [...this.incidents.values()];
    const { since } = options;
    
    const filtered = since 
      ? incidents.filter(i => i.detectedAt >= since)
      : incidents;

    const metrics = filtered.map(i => i.getMetrics());
    const acknowledged = metrics.filter(m => m.timeToAcknowledge !== null);
    const resolved = metrics.filter(m => m.timeToResolve !== null);

    return {
      total: filtered.length,
      open: filtered.filter(i => i.status !== IncidentStatus.CLOSED && i.status !== IncidentStatus.RESOLVED).length,
      bySeverity: this._countBy(filtered, 'severity'),
      byStatus: this._countBy(filtered, 'status'),
      mttr: resolved.length > 0 
        ? resolved.reduce((sum, m) => sum + m.timeToResolve, 0) / resolved.length 
        : null,
      mtta: acknowledged.length > 0 
        ? acknowledged.reduce((sum, m) => sum + m.timeToAcknowledge, 0) / acknowledged.length 
        : null
    };
  }

  /**
   * Count by property
   * @private
   */
  _countBy(items, prop) {
    return items.reduce((acc, item) => {
      acc[item[prop]] = (acc[item[prop]] || 0) + 1;
      return acc;
    }, {});
  }
}

/**
 * Create incident manager
 */
function createIncidentManager(options = {}) {
  return new IncidentManager(options);
}

module.exports = {
  // Classes
  Incident,
  Runbook,
  RunbookExecution,
  PostMortem,
  IncidentManager,
  
  // Constants
  IncidentSeverity,
  IncidentStatus,
  StepStatus,
  
  // Factory
  createIncidentManager
};
