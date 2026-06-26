import { AppEnvironment } from '../app/core/app.config';

export const environment: AppEnvironment = {
  production: true,
  appConfig: {
    dataSources: {
      dashboard: 'api'
    }
  }
};
