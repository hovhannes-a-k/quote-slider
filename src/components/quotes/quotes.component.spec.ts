import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { QuotesComponent } from './quotes.component';
import { QuoteService } from '../../services/quote/quote.service';
import { RatingService } from '../../services/rating/rating.service';
import { QUOTE_STUB } from '../../consts/default-quotes';
import { IQuote } from '../../interfaces/quote.interface';

describe('QuotesComponent', () => {
  let fixture: ComponentFixture<QuotesComponent>;
  let component: QuotesComponent;

  let quoteServiceMock: jasmine.SpyObj<QuoteService>;
  let ratingServiceMock: jasmine.SpyObj<RatingService>;

  const mockQuotes: IQuote[] = [
    { id: 1, originalId: 'bsk3-vss', quote: 'Q1', author: 'Author1' },
  ];

  beforeEach(async () => {
    quoteServiceMock = jasmine.createSpyObj(
      'QuoteService',
      ['quotes', 'loadQuotes$'],
    );

    quoteServiceMock.quotes.and.returnValue(mockQuotes);
    quoteServiceMock.loadQuotes$.and.returnValue(of([]));

    ratingServiceMock = jasmine.createSpyObj(
      'RatingService',
      ['updateRating'],
      { ratings: signal<Record<string, number>>({}) }
    );

    await TestBed.configureTestingModule({
      imports: [QuotesComponent],
      providers: [
        { provide: QuoteService, useValue: quoteServiceMock },
        { provide: RatingService, useValue: ratingServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compute quotes as service quotes plus QUOTE_STUB at the end', () => {
    const result = component.quotes();

    expect(result.length).toBe(mockQuotes.length + 1);
    expect(result[0]).toBe(mockQuotes[0]);
    expect(result[result.length - 1]).toBe(QUOTE_STUB);
  });

  it('should call loadQuotes$ only when last slide index is reached', () => {
    const lastIndex = component.quotes().length - 1;

    component.handleIndexChange(0);
    expect(quoteServiceMock.loadQuotes$).not.toHaveBeenCalled();

    component.handleIndexChange(lastIndex);
    expect(quoteServiceMock.loadQuotes$).toHaveBeenCalled();
  });

  it('should delegate rating changes to RatingService', () => {
    component.handleRatingChange(4, 1);

    expect(ratingServiceMock.updateRating).toHaveBeenCalledWith({
      id: 1,
      rating: 4,
    });
  });

  it('handleError should reset carousel to first slide', () => {
    const goToSpy = jasmine.createSpy('goTo');
    // override viewChild accessor
    (component as any).carouselRef = () => ({ goTo: goToSpy });

    component.handleError();

    expect(goToSpy).toHaveBeenCalledWith(0);
  });
});
