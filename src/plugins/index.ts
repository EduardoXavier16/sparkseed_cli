// Plugin Commands
export { registerPluginCommands } from './plugin-commands';

// Plugin Registry
export {
  generatePluginConfig,
  generateGraphQLPlugin,
  generateWebSocketPlugin,
  generateI18nPlugin,
  generateAnalyticsPlugin,
  generatePaymentPlugin,
  getAvailablePlugins,
  installPlugin,
} from './plugin-registry';

export type { Plugin, PluginFile } from './plugin-registry';
