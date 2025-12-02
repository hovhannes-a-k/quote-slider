import {inject, Injectable} from '@angular/core';
import {IQuoteService} from '../../../interfaces/quote-service.interface';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IQuote} from '../../../interfaces/quote.interface';
import {z} from 'zod';
import {verifyResponseType} from '../../../utils/rxjs.utils';

const QUOTABLE_SCHEMA = z.object({
  _id: z.string(),
  author: z.string(),
  content: z.string(),
})

type QuotableQuote = z.infer<typeof QUOTABLE_SCHEMA>;

@Injectable()
export class QuotableQuoteService implements IQuoteService {
  private readonly http = inject(HttpClient);
  private readonly url = 'https://api.quotable.io/random';

  loadQuotes$(): Observable<IQuote[]> {
    return this.http.get<unknown>(`${this.url}`).pipe(
      verifyResponseType(QUOTABLE_SCHEMA),
      map(data => [this.adaptSchema(data)]),
    );
  }

  private adaptSchema({ _id, content, author }: QuotableQuote): IQuote {
    return {
      id: 0,
      originalId: _id,
      quote: content,
      author,
    }
  }
}
