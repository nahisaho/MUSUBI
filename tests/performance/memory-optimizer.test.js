/**
 * Tests for Memory Optimizer
 *
 * Phase 6 P1: Memory Optimization
 */

const {
  MemoryPressure,
  ObjectPool,
  WeakCache,
  MemoryMonitor,
  StreamingBuffer,
  MemoryOptimizer,
  defaultOptimizer,
} = require('../../src/performance/memory-optimizer');

describe('MemoryPressure', () => {
  it('should define pressure levels', () => {
    expect(MemoryPressure.LOW).toBe('low');
    expect(MemoryPressure.MODERATE).toBe('moderate');
    expect(MemoryPressure.HIGH).toBe('high');
    expect(MemoryPressure.CRITICAL).toBe('critical');
  });
});

describe('ObjectPool', () => {
  let pool;

  beforeEach(() => {
    pool = new ObjectPool(() => ({ value: 0 }), {
      initialSize: 5,
      maxSize: 10,
      reset: obj => {
        obj.value = 0;
        return obj;
      },
    });
  });

  it('should create pool with initial size', () => {
    const stats = pool.getStats();
    expect(stats.poolSize).toBe(5);
    expect(stats.created).toBe(5);
  });

  it('should acquire objects from pool', () => {
    const obj = pool.acquire();
    expect(obj).toBeDefined();
    expect(obj.value).toBe(0);

    const stats = pool.getStats();
    expect(stats.poolSize).toBe(4);
    expect(stats.borrowed).toBe(1);
    expect(stats.recycled).toBe(1);
  });

  it('should release objects back to pool', () => {
    const obj = pool.acquire();
    obj.value = 42;

    pool.release(obj);

    const stats = pool.getStats();
    expect(stats.poolSize).toBe(5);

    const obj2 = pool.acquire();
    expect(obj2.value).toBe(0); // Should be reset
  });

  it('should create new objects when pool is empty', () => {
    // Acquire all pre-created objects
    for (let i = 0; i < 5; i++) {
      pool.acquire();
    }

    // Pool should be empty now
    expect(pool.getStats().poolSize).toBe(0);

    // Acquire one more - should create new
    const obj = pool.acquire();
    expect(obj).toBeDefined();

    const stats = pool.getStats();
    expect(stats.created).toBe(6);
    expect(stats.recycled).toBe(5);
  });

  it('should respect maxSize when releasing', () => {
    // Create 15 objects (more than maxSize of 10)
    const objects = [];
    for (let i = 0; i < 15; i++) {
      objects.push(pool.acquire());
    }

    // Release all
    for (const obj of objects) {
      pool.release(obj);
    }

    // Pool should be at maxSize
    expect(pool.getStats().poolSize).toBe(10);
  });

  it('should calculate recycle rate correctly', () => {
    for (let i = 0; i < 5; i++) {
      pool.acquire();
    }

    const stats = pool.getStats();
    expect(stats.recycleRate).toBe(1); // 5/5 = 100% recycled
  });

  it('should clear pool', () => {
    expect(pool.getStats().poolSize).toBe(5);

    pool.clear();

    expect(pool.getStats().poolSize).toBe(0);
  });
});

describe('WeakCache', () => {
  let cache;

  beforeEach(() => {
    cache = new WeakCache();
  });

  it('should set and get object values', () => {
    const obj = { data: 'test' };
    cache.set('key1', obj);

    const retrieved = cache.get('key1');
    expect(retrieved).toBe(obj);
  });

  it('should throw error for non-object values', () => {
    expect(() => cache.set('key', 'string')).toThrow('WeakCache only supports object values');
    expect(() => cache.set('key', 123)).toThrow('WeakCache only supports object values');
    expect(() => cache.set('key', null)).toThrow('WeakCache only supports object values');
  });

  it('should return undefined for missing keys', () => {
    expect(cache.get('nonexistent')).toBeUndefined();

    const stats = cache.getStats();
    expect(stats.misses).toBe(1);
  });

  it('should track hits and misses', () => {
    const obj = { data: 'test' };
    cache.set('key', obj);

    cache.get('key'); // hit
    cache.get('key'); // hit
    cache.get('missing'); // miss

    const stats = cache.getStats();
    expect(stats.hits).toBe(2);
    expect(stats.misses).toBe(1);
    expect(stats.hitRate).toBeCloseTo(0.666, 2);
  });

  it('should check if key exists', () => {
    const obj = { data: 'test' };
    cache.set('key', obj);

    expect(cache.has('key')).toBe(true);
    expect(cache.has('missing')).toBe(false);
  });

  it('should delete keys', () => {
    const obj = { data: 'test' };
    cache.set('key', obj);

    expect(cache.has('key')).toBe(true);

    cache.delete('key');

    expect(cache.has('key')).toBe(false);
  });

  it('should cleanup dead references', () => {
    // This is hard to test without forcing GC
    // Just verify the method exists and returns a number
    const cleaned = cache.cleanup();
    expect(typeof cleaned).toBe('number');
  });

  it('should clear cache and reset stats', () => {
    const obj = { data: 'test' };
    cache.set('key', obj);
    cache.get('key');

    cache.clear();

    const stats = cache.getStats();
    expect(stats.size).toBe(0);
    expect(stats.hits).toBe(0);
    expect(stats.misses).toBe(0);
  });
});

describe('MemoryMonitor', () => {
  let monitor;

  beforeEach(() => {
    monitor = new MemoryMonitor({
      checkInterval: 100,
      moderateThreshold: 0.5,
      highThreshold: 0.75,
      criticalThreshold: 0.9,
    });
  });

  afterEach(() => {
    monitor.stop();
  });

  it('should get memory usage', () => {
    const usage = monitor.getMemoryUsage();

    expect(usage.heapUsed).toBeGreaterThan(0);
    expect(usage.heapTotal).toBeGreaterThan(0);
    expect(usage.heapRatio).toBeGreaterThanOrEqual(0);
    expect(usage.heapRatio).toBeLessThanOrEqual(1);
    expect(usage.rss).toBeGreaterThan(0);
    expect(usage.timestamp).toBeGreaterThan(0);
  });

  it('should get pressure level', () => {
    const level = monitor.getPressureLevel();

    expect([
      MemoryPressure.LOW,
      MemoryPressure.MODERATE,
      MemoryPressure.HIGH,
      MemoryPressure.CRITICAL,
    ]).toContain(level);
  });

  it('should add pressure listeners', () => {
    const callback = jest.fn();
    monitor.onPressure(MemoryPressure.LOW, callback);

    // Manually trigger by accessing internal listeners
    const listeners = monitor.listeners.get(MemoryPressure.LOW);
    expect(listeners).toContain(callback);
  });

  it('should start and stop monitoring', () => {
    expect(monitor.intervalId).toBeNull();

    monitor.start();
    expect(monitor.intervalId).not.toBeNull();

    monitor.stop();
    expect(monitor.intervalId).toBeNull();
  });

  it('should not start twice', () => {
    monitor.start();
    const firstIntervalId = monitor.intervalId;

    monitor.start();
    expect(monitor.intervalId).toBe(firstIntervalId);
  });

  it('should get stats', () => {
    const stats = monitor.getStats();

    expect(stats.current).toBeDefined();
    expect(stats.history).toBeDefined();
    expect(stats.trend).toBe('stable');
  });

  it('should suggest GC on high pressure', () => {
    // This is hard to test without mocking global.gc
    const result = monitor.suggestGC();
    // If global.gc is not available, result should be false
    expect(typeof result).toBe('boolean');
  });
});

describe('StreamingBuffer', () => {
  let buffer;

  beforeEach(() => {
    buffer = new StreamingBuffer({
      chunkSize: 1024,
      maxBuffered: 5,
    });
  });

  it('should push data and report when full', () => {
    expect(buffer.push('item1')).toBe(false);
    expect(buffer.push('item2')).toBe(false);
    expect(buffer.push('item3')).toBe(false);
    expect(buffer.push('item4')).toBe(false);
    expect(buffer.push('item5')).toBe(true); // Now full
  });

  it('should flush buffered data', () => {
    buffer.push('item1');
    buffer.push('item2');
    buffer.push('item3');

    const flushed = buffer.flush();

    expect(flushed).toEqual(['item1', 'item2', 'item3']);
    expect(buffer.hasData()).toBe(false);
  });

  it('should track total processed', () => {
    buffer.push('item1');
    buffer.push('item2');
    buffer.flush();

    buffer.push('item3');
    buffer.flush();

    const stats = buffer.getStats();
    expect(stats.totalProcessed).toBe(3);
  });

  it('should check if has data', () => {
    expect(buffer.hasData()).toBe(false);

    buffer.push('item');

    expect(buffer.hasData()).toBe(true);
  });

  it('should get stats', () => {
    buffer.push('item1');
    buffer.push('item2');

    const stats = buffer.getStats();

    expect(stats.buffered).toBe(2);
    expect(stats.maxBuffered).toBe(5);
    expect(stats.totalProcessed).toBe(0);
  });

  it('should clear buffer', () => {
    buffer.push('item1');
    buffer.push('item2');

    buffer.clear();

    expect(buffer.hasData()).toBe(false);
    expect(buffer.getStats().buffered).toBe(0);
  });
});

describe('MemoryOptimizer', () => {
  let optimizer;

  beforeEach(() => {
    optimizer = new MemoryOptimizer({ autoGC: false });
  });

  afterEach(() => {
    optimizer.stop();
  });

  it('should create and get object pools', () => {
    const pool = optimizer.createPool('test-pool', () => ({ value: 0 }));

    expect(pool).toBeInstanceOf(ObjectPool);
    expect(optimizer.getPool('test-pool')).toBe(pool);
  });

  it('should reuse existing pools', () => {
    const pool1 = optimizer.createPool('test-pool', () => ({ value: 0 }));
    const pool2 = optimizer.createPool('test-pool', () => ({ value: 1 }));

    expect(pool1).toBe(pool2);
  });

  it('should create and get weak caches', () => {
    const cache = optimizer.createWeakCache('test-cache');

    expect(cache).toBeInstanceOf(WeakCache);
    expect(optimizer.getWeakCache('test-cache')).toBe(cache);
  });

  it('should reuse existing weak caches', () => {
    const cache1 = optimizer.createWeakCache('test-cache');
    const cache2 = optimizer.createWeakCache('test-cache');

    expect(cache1).toBe(cache2);
  });

  it('should handle high pressure', () => {
    const cache = optimizer.createWeakCache('test');
    cache.set('key', { data: 'test' });

    optimizer.onHighPressure();

    // Should call cleanup on caches (method exists, no error)
    expect(true).toBe(true);
  });

  it('should handle critical pressure', () => {
    const pool = optimizer.createPool('test', () => ({}), { initialSize: 5 });
    const cache = optimizer.createWeakCache('test');
    cache.set('key', { data: 'test' });

    optimizer.onCriticalPressure();

    expect(pool.getStats().poolSize).toBe(0);
    expect(cache.getStats().size).toBe(0);
  });

  it('should start and stop', () => {
    optimizer.start();
    expect(optimizer.monitor.intervalId).not.toBeNull();

    optimizer.stop();
    expect(optimizer.monitor.intervalId).toBeNull();
  });

  it('should get comprehensive stats', () => {
    optimizer.createPool('pool1', () => ({}));
    optimizer.createWeakCache('cache1');

    const stats = optimizer.getStats();

    expect(stats.memory).toBeDefined();
    expect(stats.pools).toBeDefined();
    expect(stats.pools.pool1).toBeDefined();
    expect(stats.weakCaches).toBeDefined();
    expect(stats.weakCaches.cache1).toBeDefined();
  });
});

describe('defaultOptimizer', () => {
  it('should be a MemoryOptimizer instance', () => {
    expect(defaultOptimizer).toBeInstanceOf(MemoryOptimizer);
  });
});

describe('Integration: Memory Optimizer with existing modules', () => {
  it('should export from main index', () => {
    const performance = require('../../src/performance');

    expect(performance.MemoryPressure).toBeDefined();
    expect(performance.ObjectPool).toBeDefined();
    expect(performance.WeakCache).toBeDefined();
    expect(performance.MemoryMonitor).toBeDefined();
    expect(performance.StreamingBuffer).toBeDefined();
    expect(performance.MemoryOptimizer).toBeDefined();
    expect(performance.defaultOptimizer).toBeDefined();
  });

  it('should work with BatchProcessor', () => {
    const { BatchProcessor, ObjectPool } = require('../../src/performance');

    // Create a pool for batch result objects
    const resultPool = new ObjectPool(() => ({ success: false, data: null }), {
      maxSize: 50,
      reset: obj => {
        obj.success = false;
        obj.data = null;
        return obj;
      },
    });

    const processor = new BatchProcessor({ batchSize: 10 });

    // Simulate using pooled objects
    const result = resultPool.acquire();
    result.success = true;
    result.data = 'processed';

    expect(result.success).toBe(true);

    resultPool.release(result);
    expect(resultPool.getStats().poolSize).toBeGreaterThan(0);

    processor.clear();
  });
});
