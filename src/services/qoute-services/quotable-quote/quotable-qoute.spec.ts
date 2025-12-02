import {TestBed} from '@angular/core/testing';
import {
  HttpTestingController, provideHttpClientTesting,
} from '@angular/common/http/testing';

import {QuotableQuoteService} from './quotable-quote.service';
import {IQuote} from '../../../interfaces/quote.interface';
import {provideHttpClient} from '@angular/common/http';

describe('QuotableQuoteService', () => {
  let service: QuotableQuoteService;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://api.quotable.io/random';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuotableQuoteService, provideHttpClient(),
        provideHttpClientTesting(),],
    });

    service = TestBed.inject(QuotableQuoteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call correct URL and adapt response to IQuote[]', () => {
    const apiResponse = {
      _id: 'abc123',
      content: 'Test quote',
      author: 'Tester',
    };

    let result: IQuote[] | undefined;

    service.loadQuotes$().subscribe(res => (result = res));

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(apiResponse);

    expect(result).toBeTruthy();
    expect(result!.length).toBe(1);

    expect(result![0]).toEqual({
      id: 0,
      originalId: 'abc123',
      quote: 'Test quote',
      author: 'Tester',
    });
  });
});
