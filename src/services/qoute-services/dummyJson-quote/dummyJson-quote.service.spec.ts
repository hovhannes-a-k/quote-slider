import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DummyJsonQuoteService } from './dummyJson-quote.service';
import { IQuote } from '../../../interfaces/quote.interface';

describe('DummyJsonQuoteService', () => {
  let service: DummyJsonQuoteService;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://dummyjson.com/quotes/random/2';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DummyJsonQuoteService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(DummyJsonQuoteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call correct URL and adapt response to IQuote[]', () => {
    const apiResponse = [
      { id: 10, quote: 'Hello', author: 'John' },
      { id: 20, quote: 'World', author: 'Jane' },
    ];

    let result: IQuote[] | undefined;

    service.loadQuotes$().subscribe(res => (result = res));

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(apiResponse);

    expect(result).toEqual([
      { id: 0, originalId: 10, quote: 'Hello', author: 'John' },
      { id: 0, originalId: 20, quote: 'World', author: 'Jane' },
    ]);
  });
});
