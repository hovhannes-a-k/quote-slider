import {InjectionToken, Provider} from '@angular/core';
import {IQuoteService} from '../../interfaces/quote-service.interface';
import {DummyJsonQuoteService} from './dummyJson-quote/dummyJson-quote.service';
import {QuotableQuoteService} from './quotable-quote/quotable-quote.service';

export const QUOTE_SERVICE = new InjectionToken<IQuoteService[]>('QUOTE_SERVICE');

export const QUOTE_SERVICE_PROVIDERS: Provider[] = [
  { provide: QUOTE_SERVICE, useClass: QuotableQuoteService, multi: true },
  { provide: QUOTE_SERVICE, useClass: DummyJsonQuoteService, multi: true },
]
