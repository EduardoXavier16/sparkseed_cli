import type { ProjectConfig } from '../types';

export function generateSentryConfig(config: ProjectConfig): string {
  return `import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: process.env.NODE_ENV || 'development',
  release: "${config.projectName}@${process.env.npm_package_version || '1.0.0'}",
});

// Error tracking for Express
export function setupSentryErrorHandler(app: unknown) {
  const expressApp = app as any; // Express app type
  expressApp.use(Sentry.Handlers.requestHandler());
  expressApp.use(Sentry.Handlers.tracingHandler());
  
  // Error handler (must be before any other error middleware)
  expressApp.use(Sentry.Handlers.errorHandler({
    shouldHandleError(error: unknown) {
      // Capture all 4xx and 5xx errors
      const err = error as Error & { status?: number };
      return !err.status || parseInt(String(err.status)) >= 400;
    },
  }));
}

export default Sentry;
`;
}

export function generateDatadogConfig(config: ProjectConfig): string {
  return `import tracer from 'dd-trace';
import dogstatsd from 'hot-shots';

// Initialize Datadog APM
tracer.init({
  service: '${config.projectName}',
  env: process.env.NODE_ENV || 'production',
  version: '${process.env.npm_package_version || '1.0.0'}',
  logInjection: true,
  runtimeMetrics: true,
  profiling: true,
});

// Initialize StatsD client
export const statsd = new dogstatsd.Client({
  host: process.env.DD_AGENT_HOST || 'localhost',
  port: parseInt(process.env.DD_DOGSTATSD_PORT || '8125'),
  prefix: '${config.projectName.replace(/-/g, '_')}.',
  globalTags: {
    env: process.env.NODE_ENV || 'production',
  },
});

// Track custom metrics
export function trackMetric(name: string, value: number, tags?: string[]) {
  statsd.gauge(name, value, tags);
}

// Track timing
export function trackTiming(name: string, startTime: number, tags?: string[]) {
  const duration = Date.now() - startTime;
  statsd.timing(name, duration, tags);
}

// Track errors
export function trackError(error: Error, context?: Record<string, string>) {
  tracer.scope().active()?.setBaggageItem('error', 'true');
  statsd.increment('errors', 1, [
    \`type:\${error.name}\`,
    ...(context ? Object.entries(context).map(([k, v]) => \`\${k}:\${v}\`) : []),
  ]);
}

export default tracer;
`;
}

export function generateNewRelicConfig(config: ProjectConfig): string {
  return `/**
 * New Relic configuration
 * This file should be required BEFORE any other imports in your app
 */

exports.config = {
  app_name: ['${config.projectName}'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info',
    filepath: 'stdout',
  },
  rules: {
    ignore: [
      '^/health$',
      '^/ready$',
      '^/favicon.ico$',
    ],
  },
  transaction_tracer: {
    enabled: true,
    transaction_threshold: 'apdex_f',
    record_sql: 'obfuscated',
    stack_trace_threshold: 0.5,
    explain_enabled: true,
    explain_threshold: 0.5,
    top_n: 20,
  },
  error_collector: {
    enabled: true,
    ignore_status_codes: [404, 429],
  },
  distributed_tracing: {
    enabled: true,
  },
  span_events: {
    enabled: true,
  },
  custom_insights_events: {
    enabled: true,
    max_samples_stored: 10000,
  },
};

// Custom instrumentation example
// const newrelic = require('newrelic');

// newrelic.recordCustomEvent('CustomEventType', {
//   property1: 'value1',
//   property2: 'value2',
// });

// newrelic.addCustomAttribute('attributeName', 'attributeValue');

// newrelic.noticeError(new Error('Custom error'));
`;
}

export function generatePrometheusConfig(config: ProjectConfig): string {
  return `# Prometheus configuration for ${config.projectName}

global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: '${config.projectName}'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'

  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']

# Alert rules
rule_files:
  - "alerts.yml"

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - localhost:9093
`;
}

export function generateGrafanaDashboard(config: ProjectConfig): string {
  return JSON.stringify(
    {
      dashboard: {
        id: null,
        uid: config.projectName.replace(/-/g, '_'),
        title: `${config.projectName} Dashboard`,
        tags: ['application', config.projectName],
        timezone: 'browser',
        schemaVersion: 38,
        version: 1,
        refresh: '5s',
        panels: [
          {
            id: 1,
            title: 'Request Rate',
            type: 'graph',
            gridPos: { h: 8, w: 12, x: 0, y: 0 },
            targets: [
              {
                expr: 'rate(http_requests_total{job="${config.projectName}"}[5m])',
                legendFormat: '{{method}} {{status}}',
              },
            ],
          },
          {
            id: 2,
            title: 'Response Time (p95)',
            type: 'graph',
            gridPos: { h: 8, w: 12, x: 12, y: 0 },
            targets: [
              {
                expr: 'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job="${config.projectName}"}[5m]))',
                legendFormat: 'p95',
              },
            ],
          },
          {
            id: 3,
            title: 'Error Rate',
            type: 'graph',
            gridPos: { h: 8, w: 8, x: 0, y: 8 },
            targets: [
              {
                expr: 'rate(http_requests_total{job="${config.projectName}",status=~"5.."}[5m])',
                legendFormat: '5xx errors',
              },
            ],
          },
          {
            id: 4,
            title: 'Active Connections',
            type: 'gauge',
            gridPos: { h: 8, w: 8, x: 8, y: 8 },
            targets: [
              {
                expr: 'nodejs_eventloop_lag_seconds{job="${config.projectName}"}',
                legendFormat: 'Event loop lag',
              },
            ],
          },
          {
            id: 5,
            title: 'Memory Usage',
            type: 'graph',
            gridPos: { h: 8, w: 8, x: 16, y: 8 },
            targets: [
              {
                expr: 'nodejs_heap_size_used_bytes{job="${config.projectName}"}',
                legendFormat: 'Heap used',
              },
              {
                expr: 'nodejs_heap_size_total_bytes{job="${config.projectName}"}',
                legendFormat: 'Heap total',
              },
            ],
          },
        ],
      },
    },
    null,
    2
  );
}

export function generateMonitoringGuide(config: ProjectConfig): string {
  return `# Monitoring Guide

This guide covers setting up monitoring and observability for ${config.projectName}.

## Error Tracking

### Sentry

1. Create a project at [sentry.io](https://sentry.io)
2. Get your DSN from Project Settings
3. Set environment variable:
   \`\`\`bash
   export SENTRY_DSN="your-dsn-here"
   \`\`\`
4. The SDK is already configured in \`src/lib/sentry.ts\`

**Features:**
- Automatic error capture
- Performance monitoring
- Release tracking
- Source maps

## APM (Application Performance Monitoring)

### Datadog

1. Create account at [datadoghq.com](https://datadoghq.com)
2. Get API key from API Settings
3. Set environment variables:
   \`\`\`bash
   export DD_API_KEY="your-api-key"
   export DD_SERVICE="${config.projectName}"
   export DD_ENV="production"
   \`\`\`
4. Import in your app: \`import './lib/datadog';\`

**Features:**
- Distributed tracing
- Custom metrics
- Log aggregation
- Real-time profiling

### New Relic

1. Create account at [newrelic.com](https://newrelic.com)
2. Get license key from API keys
3. Set environment variable:
   \`\`\`bash
   export NEW_RELIC_LICENSE_KEY="your-license-key"
   \`\`\`
4. Require at the very top of your app: \`require('newrelic');\`

**Features:**
- Automatic instrumentation
- Database query analysis
- External service calls
- Error analytics

## Metrics & Dashboards

### Prometheus + Grafana

1. Run Prometheus:
   \`\`\`bash
   docker run -p 9090:9090 prom/prometheus
   \`\`\`

2. Run Grafana:
   \`\`\`bash
   docker run -p 3000:3000 grafana/grafana
   \`\`\`

3. Import the dashboard from \`monitoring/grafana-dashboard.json\`

**Metrics collected:**
- Request rate
- Response time (p50, p95, p99)
- Error rate
- Memory usage
- Event loop lag
- Active connections

## Alerts

### Recommended Alerts

1. **High Error Rate**
   - Trigger: Error rate > 1% for 5 minutes
   - Action: Page on-call engineer

2. **High Response Time**
   - Trigger: p95 latency > 2s for 10 minutes
   - Action: Create incident

3. **Low Memory**
   - Trigger: Available memory < 10%
   - Action: Scale up or investigate

4. **Service Down**
   - Trigger: Health check fails 3 times
   - Action: Page immediately

## Logging

### Structured Logging

The app uses Winston for structured logging:

\`\`\`typescript
import logger from './lib/logger';

logger.info('User logged in', { userId: '123' });
logger.error('Database connection failed', { error });
\`\`\`

### Log Aggregation

Send logs to your preferred platform:
- Datadog Logs
- New Relic Logs
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Loki + Grafana

## Health Checks

- \`GET /health\` - Basic health check
- \`GET /ready\` - Readiness probe (includes DB connection)
- \`GET /metrics\` - Prometheus metrics

## Runbooks

Create runbooks for common scenarios:

1. **High Error Rate**
   - Check Sentry for new errors
   - Review recent deployments
   - Check database connections
   - Verify external services

2. **Slow Response Times**
   - Check database query performance
   - Review slow transaction traces
   - Check for memory pressure
   - Verify cache hit rates

3. **Service Unavailable**
   - Check container/pod status
   - Review recent changes
   - Check resource limits
   - Verify network connectivity
`;
}
