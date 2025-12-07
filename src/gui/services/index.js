/**
 * @fileoverview Service Index
 * @module gui/services
 */

const ProjectScanner = require('./project-scanner');
const FileWatcher = require('./file-watcher');
const WorkflowService = require('./workflow-service');
const TraceabilityService = require('./traceability-service');

module.exports = {
  ProjectScanner,
  FileWatcher,
  WorkflowService,
  TraceabilityService,
};
