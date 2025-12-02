import {Observable} from 'rxjs';
import {IQuote} from './quote.interface';

export interface IQuoteService {
  loadQuotes$(): Observable<IQuote[]>;
}
