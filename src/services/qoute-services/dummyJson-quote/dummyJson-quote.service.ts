import {inject, Injectable} from '@angular/core';
import {IQuoteService} from '../../../interfaces/quote-service.interface';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IQuote} from '../../../interfaces/quote.interface';
import {z} from 'zod';
import {verifyResponseType} from '../../../utils/rxjs.utils';

const DUMMY_JSON_SCHEMA = z.array(z.object({
  id: z.number(),
  quote: z.string(),
  author: z.string(),
}))

type DummyJsonResponse = z.infer<typeof DUMMY_JSON_SCHEMA>;
type DummyJsonQuote = DummyJsonResponse[0];

@Injectable()
export class DummyJsonQuoteService implements IQuoteService {
  private readonly http = inject(HttpClient);
  private readonly url = 'https://dummyjson.com/quotes/random/2';

  loadQuotes$(): Observable<IQuote[]> {
    return this.http.get<unknown>(`${this.url}`).pipe(
      verifyResponseType(DUMMY_JSON_SCHEMA),
      map(data => data.map(this.adaptSchema)),
    );
  }

  private adaptSchema({id, quote, author}: DummyJsonQuote): IQuote {
    return {
      id: 0,
      originalId: id,
      quote,
      author,
    }
  }
}
