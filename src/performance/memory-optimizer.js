/**
 * Memory Optimizer
 *
 * Phase 6 P1: Memory Optimization for enterprise-grade performance
 *
 * Features:
 * - Object pooling for frequently created objects
 * - Weak reference caching for large objects
 * - Memory pressure monitoring
 * - Automatic garbage collection hints
 *
 * @module src/performance/memory-optimizer
 */

'use strict';

/**
 * Memory pressure levels
 */
const MemoryPressure = {
  LOW: 'low', // < 50% heap used
  MODERATE: 'moderate', // 50-75% heap used
  HIGH: 'high', // 75-90% heap used
  CRITICAL: 'critical', // > 90% heap used
};

/**
 * Object Pool for reusable objects
 * Reduces GC pressure by recycling objects
 */
class ObjectPool {
  /**
   * @param {Function} factory - Factory function to create new objects
   * @param {Object} options
   * @param {number} options.initialSize - Initial pool size
   * @param {number} options.maxSize - Maximum pool size
   * @param {Function} options.reset - Reset function for recycled objects
   */
  constructor(factory, options = {}) {
    this.factory = factory;
    this.maxSize = options.maxSize || 100;
    this.reset = options.reset || (obj => obj);
    this.pool = [];
    this.created = 0;
    this.recycled = 0;
    this.borrowed = 0;

    // Pre-populate pool
    const initialSize = options.initialSize || 10;
    for (let i = 0; i < Math.min(initialSize, this.maxSize); i++) {
      this.pool.push(this.factory());
      this.created++;
    }
  }

  /**
   * Acquire an object from the pool
   * @returns {*} Object from pool or newly created
   */
  acquire() {
    this.borrowed++;
    if (this.pool.length > 0) {
      this.recycled++;
      return this.pool.pop();
    }
    this.created++;
    return this.factory();
  }

  /**
   * Release an object back to the pool
   * @param {*} obj - Object to release
   */
  release(obj) {
    if (this.pool.length < this.maxSize) {
      this.reset(obj);
      this.pool.push(obj);
    }
    // If pool is full, let GC handle it
  }

  /**
   * Get pool statistics
   * @returns {Object}
   */
  getStats() {
    return {
      poolSize: this.pool.length,
      maxSize: this.maxSize,
      created: this.created,
      recycled: this.recycled,
      borrowed: this.borrowed,
      recycleRate: this.borrowed > 0 ? this.recycled / this.borrowed : 0,
    };
  }

  /**
   * Clear the pool
   */
  clear() {
    this.pool = [];
  }
}

/**
 * Weak Cache for large objects
 * Allows GC to collect objects when memory is needed
 */
class WeakCache {
  constructor() {
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Set a value with weak reference
   * @param {string} key
   * @param {Object} value - Must be an object (for WeakRef)
   */
  set(key, value) {
    if (typeof value !== 'object' || value === null) {
      throw new Error('WeakCache only supports object values');
    }
    this.cache.set(key, new WeakRef(value));
  }

  /**
   * Get a value (may return undefined if GC collected it)
   * @param {string} key
   * @returns {Object|undefined}
   */
  get(key) {
    const ref = this.cache.get(key);
    if (!ref) {
      this.misses++;
      return undefined;
    }
    const value = ref.deref();
    if (value === undefined) {
      this.cache.delete(key);
      this.misses++;
      return undefined;
    }
    this.hits++;
    return value;
  }

  /**
   * Check if key exists and is still valid
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    const ref = this.cache.get(key);
    if (!ref) return false;
    const value = ref.deref();
    if (value === undefined) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Delete a key
   * @param {string} key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clean up dead references
   * @returns {number} Number of cleaned entries
   */
  cleanup() {
    let cleaned = 0;
    for (const [key, ref] of this.cache) {
      if (ref.deref() === undefined) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    return cleaned;
  }

  /**
   * Get cache statistics
   * @returns {Object}
   */
  getStats() {
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits + this.misses > 0 ? this.hits / (this.hits + this.misses) : 0,
    };
  }

  /**
   * Clear the cache
   */
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

/**
 * Memory Monitor for tracking heap usage
 */
class MemoryMonitor {
  constructor(options = {}) {
    this.checkInterval = options.checkInterval || 30000; // 30 seconds
    this.thresholds = {
      moderate: options.moderateThreshold || 0.5,
      high: options.highThreshold || 0.75,
      critical: options.criticalThreshold || 0.9,
    };
    this.history = [];
    this.maxHistory = options.maxHistory || 100;
    this.listeners = new Map();
    this.intervalId = null;
  }

  /**
   * Get current memory usage
   * @returns {Object}
   */
  getMemoryUsage() {
    const usage = process.memoryUsage();
    const heapUsed = usage.heapUsed;
    const heapTotal = usage.heapTotal;
    const heapRatio = heapTotal > 0 ? heapUsed / heapTotal : 0;

    return {
      heapUsed,
      heapTotal,
      heapRatio,
      external: usage.external,
      rss: usage.rss,
      arrayBuffers: usage.arrayBuffers || 0,
      timestamp: Date.now(),
    };
  }

  /**
   * Get current pressure level
   * @returns {string}
   */
  getPressureLevel() {
    const { heapRatio } = this.getMemoryUsage();

    if (heapRatio >= this.thresholds.critical) return MemoryPressure.CRITICAL;
    if (heapRatio >= this.thresholds.high) return MemoryPressure.HIGH;
    if (heapRatio >= this.thresholds.moderate) return MemoryPressure.MODERATE;
    return MemoryPressure.LOW;
  }

  /**
   * Add a pressure level listener
   * @param {string} level - Pressure level to listen for
   * @param {Function} callback - Callback function
   */
  onPressure(level, callback) {
    if (!this.listeners.has(level)) {
      this.listeners.set(level, []);
    }
    this.listeners.get(level).push(callback);
  }

  /**
   * Start monitoring
   */
  start() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      const usage = this.getMemoryUsage();
      this.history.push(usage);

      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }

      const pressure = this.getPressureLevel();
      const callbacks = this.listeners.get(pressure) || [];
      for (const callback of callbacks) {
        try {
          callback(usage, pressure);
        } catch (_e) {
          // Ignore callback errors
        }
      }
    }, this.checkInterval);
  }

  /**
   * Stop monitoring
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Get memory statistics
   * @returns {Object}
   */
  getStats() {
    if (this.history.length === 0) {
      return { current: this.getMemoryUsage(), history: [], trend: 'stable' };
    }

    const current = this.getMemoryUsage();
    const avgHeapRatio =
      this.history.reduce((sum, h) => sum + h.heapRatio, 0) / this.history.length;
    const recentAvg =
      this.history.slice(-10).reduce((sum, h) => sum + h.heapRatio, 0) /
      Math.min(10, this.history.length);

    let trend = 'stable';
    if (recentAvg > avgHeapRatio * 1.1) trend = 'increasing';
    if (recentAvg < avgHeapRatio * 0.9) trend = 'decreasing';

    return {
      current,
      pressure: this.getPressureLevel(),
      avgHeapRatio,
      recentAvgHeapRatio: recentAvg,
      trend,
      historyLength: this.history.length,
    };
  }

  /**
   * Suggest garbage collection
   * @returns {boolean} Whether GC was suggested
   */
  suggestGC() {
    const pressure = this.getPressureLevel();
    if (pressure === MemoryPressure.HIGH || pressure === MemoryPressure.CRITICAL) {
      if (global.gc) {
        global.gc();
        return true;
      }
    }
    return false;
  }
}

/**
 * Streaming Buffer for memory-efficient large data processing
 */
class StreamingBuffer {
  /**
   * @param {Object} options
   * @param {number} options.chunkSize - Size of each chunk
   * @param {number} options.maxBuffered - Maximum buffered chunks
   */
  constructor(options = {}) {
    this.chunkSize = options.chunkSize || 1024 * 64; // 64KB
    this.maxBuffered = options.maxBuffered || 10;
    this.chunks = [];
    this.totalProcessed = 0;
  }

  /**
   * Add data to buffer
   * @param {*} data
   * @returns {boolean} Whether buffer is full
   */
  push(data) {
    this.chunks.push(data);
    return this.chunks.length >= this.maxBuffered;
  }

  /**
   * Get and clear buffered chunks
   * @returns {Array}
   */
  flush() {
    const data = this.chunks;
    this.totalProcessed += data.length;
    this.chunks = [];
    return data;
  }

  /**
   * Check if buffer has data
   * @returns {boolean}
   */
  hasData() {
    return this.chunks.length > 0;
  }

  /**
   * Get buffer statistics
   * @returns {Object}
   */
  getStats() {
    return {
      buffered: this.chunks.length,
      maxBuffered: this.maxBuffered,
      totalProcessed: this.totalProcessed,
    };
  }

  /**
   * Clear the buffer
   */
  clear() {
    this.chunks = [];
  }
}

/**
 * Memory Optimizer - Main coordinator
 */
class MemoryOptimizer {
  constructor(options = {}) {
    this.monitor = new MemoryMonitor(options.monitor || {});
    this.pools = new Map();
    this.weakCaches = new Map();
    this.autoGC = options.autoGC !== false;

    if (this.autoGC) {
      this.monitor.onPressure(MemoryPressure.HIGH, () => this.onHighPressure());
      this.monitor.onPressure(MemoryPressure.CRITICAL, () => this.onCriticalPressure());
    }
  }

  /**
   * Create or get an object pool
   * @param {string} name - Pool name
   * @param {Function} factory - Object factory
   * @param {Object} options - Pool options
   * @returns {ObjectPool}
   */
  createPool(name, factory, options = {}) {
    if (!this.pools.has(name)) {
      this.pools.set(name, new ObjectPool(factory, options));
    }
    return this.pools.get(name);
  }

  /**
   * Get an existing pool
   * @param {string} name
   * @returns {ObjectPool|undefined}
   */
  getPool(name) {
    return this.pools.get(name);
  }

  /**
   * Create or get a weak cache
   * @param {string} name - Cache name
   * @returns {WeakCache}
   */
  createWeakCache(name) {
    if (!this.weakCaches.has(name)) {
      this.weakCaches.set(name, new WeakCache());
    }
    return this.weakCaches.get(name);
  }

  /**
   * Get an existing weak cache
   * @param {string} name
   * @returns {WeakCache|undefined}
   */
  getWeakCache(name) {
    return this.weakCaches.get(name);
  }

  /**
   * Handle high memory pressure
   */
  onHighPressure() {
    // Clean up weak caches
    for (const cache of this.weakCaches.values()) {
      cache.cleanup();
    }
  }

  /**
   * Handle critical memory pressure
   */
  onCriticalPressure() {
    // Clear all pools
    for (const pool of this.pools.values()) {
      pool.clear();
    }

    // Clear all weak caches
    for (const cache of this.weakCaches.values()) {
      cache.clear();
    }

    // Suggest GC
    this.monitor.suggestGC();
  }

  /**
   * Start memory monitoring
   */
  start() {
    this.monitor.start();
  }

  /**
   * Stop memory monitoring
   */
  stop() {
    this.monitor.stop();
  }

  /**
   * Get comprehensive statistics
   * @returns {Object}
   */
  getStats() {
    const poolStats = {};
    for (const [name, pool] of this.pools) {
      poolStats[name] = pool.getStats();
    }

    const cacheStats = {};
    for (const [name, cache] of this.weakCaches) {
      cacheStats[name] = cache.getStats();
    }

    return {
      memory: this.monitor.getStats(),
      pools: poolStats,
      weakCaches: cacheStats,
    };
  }
}

// Default instance
const defaultOptimizer = new MemoryOptimizer();

module.exports = {
  MemoryPressure,
  ObjectPool,
  WeakCache,
  MemoryMonitor,
  StreamingBuffer,
  MemoryOptimizer,
  defaultOptimizer,
};
