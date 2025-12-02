import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, viewChild} from '@angular/core';
import {QuoteService} from '../../services/quote/quote.service';
import {CarouselComponent} from '../shared/carousel/carousel.component';
import {IQuote} from '../../interfaces/quote.interface';
import {SkeletonComponent} from '../shared/skeleton/skeleton.component';
import {RatingComponent} from '../shared/rating/rating.component';
import {RatingService} from '../../services/rating/rating.service';
import {QUOTE_STUB} from '../../consts/default-quotes';
import {catchError} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-quotes',
  imports: [
    CarouselComponent,
    SkeletonComponent,
    RatingComponent
  ],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotesComponent {
  private readonly quoteService = inject(QuoteService);
  private readonly ratingService = inject(RatingService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly carouselRef = viewChild(CarouselComponent);

  readonly quotes = computed(() => [...this.quoteService.quotes(), QUOTE_STUB]);
  readonly ratings = this.ratingService.ratings;

  handleIndexChange(index: number): void {
    if (index !== this.quotes().length - 1) {
      return;
    }

    this.quoteService.loadQuotes$()
      .pipe(
        catchError(error => {
          this.handleError();
          throw error;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  handleRatingChange(rating: number, quoteId: IQuote['id']): void {
    this.ratingService.updateRating({id: quoteId, rating});
  }

  handleError(): void {
    this.carouselRef()?.goTo(0);
  }
}
