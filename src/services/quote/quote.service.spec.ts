import { TestBed } from '@angular/core/testing';
import { EMPTY, of, throwError } from 'rxjs';
import { QuoteService } from './quote.service';
import { QUOTE_SERVICE } from '../qoute-services/quote-provides.config';
import { IQuote } from '../../interfaces/quote.interface';
import { DEFAULT_QUOTES } from '../../consts/default-quotes';

describe('QuoteService', () => {
  let service: QuoteService;

  // mocks for underlying quote providers
  let quoteProvider1: { loadQuotes$: jasmine.Spy };
  let quoteProvider2: { loadQuotes$: jasmine.Spy };

  beforeEach(() => {
    quoteProvider1 = jasmine.createSpyObj('QuoteProvider1', ['loadQuotes$']);
    quoteProvider2 = jasmine.createSpyObj('QuoteProvider2', ['loadQuotes$']);

    TestBed.configureTestingModule({
      providers: [
        QuoteService,
        { provide: QUOTE_SERVICE, useValue: [quoteProvider1, quoteProvider2] },
      ],
    });
  });

  it('should load quotes on creation from first quote provider and assign sequential ids', () => {
    const initialQuotes: IQuote[] = [
      { id: 0, originalId: 10, quote: 'Q1', author: 'A1' } as IQuote,
      { id: 0, originalId: 11, quote: 'Q2', author: 'A2' } as IQuote,
    ];

    // first provider returns quotes, second is ignored because of take(1)
    quoteProvider1.loadQuotes$.and.returnValue(of(initialQuotes));
    quoteProvider2.loadQuotes$.and.returnValue(EMPTY);

    service = TestBed.inject(QuoteService);

    const result = service.quotes();
    expect(result.length).toBe(2);

    // ids are re-generated starting from 1
    expect(result[0]).toEqual(jasmine.objectContaining({
      quote: 'Q1',
      id: 1,
    }));
    expect(result[1]).toEqual(jasmine.objectContaining({
      quote: 'Q2',
      id: 2,
    }));
  });

  it('loadQuotes$ should append new quotes with increasing ids', () => {
    let callCount = 0;

    quoteProvider1.loadQuotes$.and.callFake(() => {
      callCount++;
      if (callCount === 1) {
        // constructor call
        return of([
          { id: 0, originalId: 10, quote: 'Q1', author: 'A1' } as IQuote,
        ]);
      }
      // explicit loadQuotes$ call in the test
      return of([
        { id: 0, originalId: 11, quote: 'Q2', author: 'A2' } as IQuote,
      ]);
    });

    quoteProvider2.loadQuotes$.and.returnValue(EMPTY);

    service = TestBed.inject(QuoteService);

    // after constructor
    let current = service.quotes();
    expect(current.length).toBe(1);
    expect(current[0]).toEqual(jasmine.objectContaining({
      quote: 'Q1',
      id: 1,
    }));

    // call loadQuotes$ explicitly → should append new quote with next id
    service.loadQuotes$().subscribe();
    current = service.quotes();

    expect(current.length).toBe(2);
    expect(current[1]).toEqual(jasmine.objectContaining({
      quote: 'Q2',
      id: 2,
    }));
  });

  it('should use fallback and error when all providers emit nothing', (done) => {
    let callCount = 0;

    // First call (from constructor) returns an empty successful array,
    // so service is created without triggering fallback yet.
    quoteProvider1.loadQuotes$.and.callFake(() => {
      callCount++;
      if (callCount === 1) {
        return of([] as IQuote[]);
      }
      // subsequent calls → EMPTY, simulating "all failed"
      return EMPTY;
    });

    quoteProvider2.loadQuotes$.and.returnValue(EMPTY);

    service = TestBed.inject(QuoteService);

    // Initially no quotes
    expect(service.quotes()).toEqual([]);

    service.loadQuotes$().subscribe({
      next: () => {
        fail('Expected error, but got value');
      },
      error: () => {
        // handleEmptyResponse should have set DEFAULT_QUOTES
        expect(service.quotes()).toEqual(DEFAULT_QUOTES);
        done();
      },
    });
  });

  it('should still succeed when first provider fails but another succeeds', () => {
    const quotesFromSecond: IQuote[] = [
      { id: 0, originalId: 20, quote: 'Q-from-2', author: 'A2' } as IQuote,
    ];

    quoteProvider1.loadQuotes$.and.returnValue(
      throwError(() => new Error('Provider 1 failed')),
    );
    quoteProvider2.loadQuotes$.and.returnValue(of(quotesFromSecond));

    service = TestBed.inject(QuoteService);

    const result = service.quotes();
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(jasmine.objectContaining({
      quote: 'Q-from-2',
      id: 1, // regenerated id
    }));
  });
});
