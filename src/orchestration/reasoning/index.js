/**
 * @file index.js
 * @description Agentic reasoning module exports
 * @version 1.0.0
 */

'use strict';

const { 
  ReasoningEngine, 
  createReasoningEngine, 
  reason,
  STRATEGY,
  STEP_TYPE
} = require('./reasoning-engine');

const {
  PlanningEngine,
  createPlanningEngine,
  createPlan,
  PLAN_STATUS,
  TASK_STATUS,
  PRIORITY
} = require('./planning-engine');

const {
  SelfCorrection,
  createSelfCorrection,
  correctError,
  SEVERITY,
  CORRECTION_STRATEGY,
  DEFAULT_PATTERNS
} = require('./self-correction');

module.exports = {
  // Reasoning Engine
  ReasoningEngine,
  createReasoningEngine,
  reason,
  STRATEGY,
  STEP_TYPE,
  
  // Planning Engine
  PlanningEngine,
  createPlanningEngine,
  createPlan,
  PLAN_STATUS,
  TASK_STATUS,
  PRIORITY,
  
  // Self-Correction
  SelfCorrection,
  createSelfCorrection,
  correctError,
  SEVERITY,
  CORRECTION_STRATEGY,
  DEFAULT_PATTERNS
};
