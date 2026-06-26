import { AppEnvironment } from '../app/core/app.config';

export const environment: AppEnvironment = {
  production: false,
  appConfig: {
    dataSources: {
      dashboard: 'api'
    }
  }
};
