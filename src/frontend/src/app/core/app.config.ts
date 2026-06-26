export type DataSourceMode = 'fake' | 'api';

export interface AppConfig {
  dataSources: {
    dashboard: DataSourceMode;
  };
}

export interface AppEnvironment {
  production: boolean;
  appConfig: AppConfig;
}
