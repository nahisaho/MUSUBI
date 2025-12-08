# Performance Optimization Playbook

## Overview

Step-by-step guide for identifying and resolving performance issues.

---

## Phase 1: Baseline Measurement

### 1.1 Establish Metrics

```javascript
// Performance metrics to track
const metrics = {
  // Response Time
  responseTime: {
    p50: 'median response',
    p95: '95th percentile',
    p99: '99th percentile'
  },
  
  // Throughput
  throughput: {
    rps: 'requests per second',
    tps: 'transactions per second'
  },
  
  // Resources
  resources: {
    cpu: 'CPU utilization %',
    memory: 'Memory usage MB',
    disk: 'Disk I/O ops/sec',
    network: 'Network bandwidth MB/s'
  },
  
  // Application
  application: {
    errorRate: 'errors per minute',
    gcTime: 'garbage collection time',
    activeConnections: 'db/cache connections'
  }
};
```

### 1.2 Load Testing Setup

```yaml
# k6 load test configuration
scenarios:
  baseline:
    executor: 'ramping-vus'
    startVUs: 0
    stages:
      - duration: '2m'
        target: 50
      - duration: '5m'
        target: 50
      - duration: '2m'
        target: 0
    gracefulRampDown: '30s'

thresholds:
  http_req_duration:
    - 'p(95)<500'
    - 'p(99)<1000'
  http_req_failed:
    - 'rate<0.01'
```

```javascript
// k6 test script
import http from 'k6/http';
import { check, sleep } from 'k6';

export default function() {
  const res = http.get('https://api.example.com/users');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

---

## Phase 2: Identify Bottlenecks

### 2.1 Common Bottleneck Patterns

| Pattern | Symptoms | Root Cause |
|---------|----------|------------|
| CPU Bound | High CPU, low I/O wait | Computation intensive code |
| I/O Bound | Low CPU, high I/O wait | Database/file operations |
| Memory Bound | High memory, GC pauses | Memory leaks, large objects |
| Network Bound | High latency, low CPU | External API calls |
| Lock Contention | Thread blocking | Synchronization issues |

### 2.2 Profiling Checklist

```bash
# Node.js CPU profiling
node --prof app.js
node --prof-process isolate-*.log > profile.txt

# Node.js heap profiling
node --inspect app.js
# Use Chrome DevTools Memory tab

# Linux system profiling
top -H -p $(pgrep node)
strace -p <pid> -c
perf record -p <pid>
perf report
```

### 2.3 Database Analysis

```sql
-- PostgreSQL slow query log
ALTER SYSTEM SET log_min_duration_statement = 100;

-- Find slow queries
SELECT query, calls, mean_time, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;

-- Missing indexes
SELECT schemaname, tablename, seq_scan, seq_tup_read,
       idx_scan, idx_tup_fetch
FROM pg_stat_user_tables
WHERE seq_scan > 1000
ORDER BY seq_scan DESC;
```

---

## Phase 3: Optimization Techniques

### 3.1 Code Optimization

```javascript
// ❌ N+1 Query Problem
async function getUsers() {
  const users = await User.findAll();
  for (const user of users) {
    user.orders = await Order.findByUserId(user.id);
  }
  return users;
}

// ✅ Eager Loading
async function getUsers() {
  const users = await User.findAll({
    include: [{ model: Order }]
  });
  return users;
}

// ❌ Synchronous file processing
function processFiles(files) {
  return files.map(f => fs.readFileSync(f));
}

// ✅ Parallel async processing
async function processFiles(files) {
  return Promise.all(files.map(f => fs.promises.readFile(f)));
}
```

### 3.2 Caching Strategy

```javascript
// Multi-tier caching
class CacheManager {
  constructor() {
    this.l1 = new Map(); // In-memory (fastest)
    this.l2 = redis;     // Redis (fast)
    this.l3 = database;  // Database (source of truth)
  }

  async get(key) {
    // Check L1
    if (this.l1.has(key)) {
      return this.l1.get(key);
    }

    // Check L2
    const l2Value = await this.l2.get(key);
    if (l2Value) {
      this.l1.set(key, l2Value);
      return l2Value;
    }

    // Get from L3
    const value = await this.l3.findByKey(key);
    if (value) {
      await this.l2.setex(key, 3600, value);
      this.l1.set(key, value);
    }
    return value;
  }
}
```

### 3.3 Database Optimization

```sql
-- Add composite index
CREATE INDEX CONCURRENTLY idx_orders_user_status 
ON orders (user_id, status, created_at DESC);

-- Partial index for common queries
CREATE INDEX CONCURRENTLY idx_orders_pending
ON orders (user_id, created_at)
WHERE status = 'pending';

-- Query optimization
-- ❌ Before
SELECT * FROM orders WHERE YEAR(created_at) = 2024;

-- ✅ After (index-friendly)
SELECT * FROM orders 
WHERE created_at >= '2024-01-01' 
  AND created_at < '2025-01-01';
```

---

## Phase 4: Validate Improvements

### 4.1 A/B Comparison

```javascript
// Compare before/after metrics
const comparison = {
  before: {
    p50: 250,   // ms
    p95: 800,
    p99: 1500,
    rps: 100,
    errorRate: 0.02
  },
  after: {
    p50: 80,    // ms
    p95: 200,
    p99: 400,
    rps: 350,
    errorRate: 0.005
  },
  improvement: {
    p50: '-68%',
    p95: '-75%',
    p99: '-73%',
    rps: '+250%',
    errorRate: '-75%'
  }
};
```

### 4.2 Regression Testing

```yaml
# CI performance gate
performance-test:
  script:
    - k6 run --out json=results.json load-test.js
  artifacts:
    paths:
      - results.json
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
```

---

## Quick Reference

### Response Time Targets

| Tier | p50 | p95 | p99 |
|------|-----|-----|-----|
| Fast | <50ms | <100ms | <200ms |
| Normal | <200ms | <500ms | <1000ms |
| Acceptable | <500ms | <2000ms | <5000ms |

### Memory Guidelines

| App Type | Heap Size | GC Pause Target |
|----------|-----------|-----------------|
| API Server | 512MB-2GB | <50ms |
| Worker | 1GB-4GB | <100ms |
| Batch | 2GB-8GB | <500ms |

### Caching TTL Guidelines

| Data Type | TTL | Strategy |
|-----------|-----|----------|
| Static config | 1h-24h | Cache-aside |
| User session | 15m-30m | Write-through |
| API response | 1m-5m | Cache-aside |
| Search results | 30s-5m | Cache-aside |
