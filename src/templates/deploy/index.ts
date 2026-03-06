// Deploy templates
export {
  generateVercelConfig,
  generateNetlifyConfig,
  generateRailwayToml,
  generateRenderYaml,
  generateDockerfile,
  generateNginxConfig,
  generateDeployGuide,
} from './platforms';

export {
  generateSentryConfig,
  generateDatadogConfig,
  generateNewRelicConfig,
  generatePrometheusConfig,
  generateGrafanaDashboard,
  generateMonitoringGuide,
} from './monitoring';
