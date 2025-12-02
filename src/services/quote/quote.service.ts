import {DestroyRef, inject, Injectable, signal} from '@angular/core';
import {QUOTE_SERVICE} from '../qoute-services/quote-provides.config';
import {IQuote} from '../../interfaces/quote.interface';
import {
  catchError,
  EMPTY,
  merge,
  Observable,
  take,
  tap,
  throwIfEmpty,
} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {filterUniqueBy} from '../../utils/utils';
import {DEFAULT_QUOTES} from '../../consts/default-quotes';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private readonly quoteServices = inject(QUOTE_SERVICE);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _quotes = signal<IQuote[]>([]);
  readonly quotes = this._quotes.asReadonly();

  constructor() {
    this.loadQuotes$()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  /**
   * Runs all quote requests in parallel and returns the first successful result.
   * - Failed requests are ignored (converted to EMPTY).
   * - If none succeed → fallback via handleEmptyResponse() and throw error.
   * - On success → merge new quotes into state with updated IDs.
   */
  loadQuotes$(): Observable<IQuote[]> {
    const streams$ = this.quoteServices.map(s =>
      s.loadQuotes$().pipe(
        catchError(() => EMPTY)
      )
    );

    return merge(...streams$).pipe(
      take(1),
      throwIfEmpty(() => {
        this.handleEmptyResponse();
        new Error('ALL concurrent HTTP requests failed.')
      }),
      tap((quotes) => {
        if (quotes.length) {
          this._quotes.update((prev) => this.insertQuotes(prev, quotes));
        }
      }),
    )
  }

  private insertQuotes(allQuotes: IQuote[], quotes: IQuote[]): IQuote[] {
    if (!quotes.length) {
      return allQuotes;
    }

    if (!allQuotes.length) {
      return this.generateQuoteId(quotes, 0);
    }

    const uniqueQuotes = filterUniqueBy(allQuotes, quotes, 'quote');
    const lastQuoteId = allQuotes.at(-1)?.id;

    if (!lastQuoteId) {
      return this.generateQuoteId([...allQuotes, ...uniqueQuotes], 0);
    }

    return [...allQuotes, ...this.generateQuoteId(uniqueQuotes, lastQuoteId)];
  }

  private generateQuoteId(quotes: IQuote[], lastId: number): IQuote[] {
    return quotes.map((quote, i) => ({
      ...quote,
      id: lastId + (i + 1),
    }))
  }

  private handleEmptyResponse() {
    if (!this.quotes().length) {
      this._quotes.set(DEFAULT_QUOTES);
      return;
    }
  }
}
