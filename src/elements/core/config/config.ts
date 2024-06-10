import type { DateAdapter } from '../datetime.js';

export interface SbbIconConfig {
  interceptor?: (parameters: {
    namespace: string;
    name: string;
    url: string;
    request: () => Promise<string>;
  }) => Promise<string>;
  namespaces?: Map<string, string>;
}

export interface SbbDatetimeConfig {
  dateAdapter?: DateAdapter;
}

export interface SbbConfig {
  language?: string;
  icon?: SbbIconConfig;
  datetime?: SbbDatetimeConfig;
}

export function readConfig(): SbbConfig {
  if (!('sbbConfig' in globalThis)) {
    (globalThis as any).sbbConfig = {}; // FIXME any type
  }
  return (globalThis as any).sbbConfig as SbbConfig; // FIXME any type
}

export function mergeConfig(config: Partial<SbbConfig>): void {
  const oldConfig = readConfig();
  Object.assign(oldConfig, config);
}
