import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';

import {provideHttpClient} from '@angular/common/http';
import {QUOTE_SERVICE_PROVIDERS} from '../services/qoute-services/quote-provides.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    ...QUOTE_SERVICE_PROVIDERS,
  ]
};
