import {Injectable, signal} from '@angular/core';
import {IQuote} from '../../interfaces/quote.interface';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  private readonly _ratings = signal<Record<IQuote['id'], number>>([]);
  readonly ratings = this._ratings.asReadonly();

  updateRating({id, rating}: {id: IQuote['id'], rating: number}): void {
    this._ratings.update(ratings => {
      const result = {...ratings};

      result[id] = rating;

      return result;
    })
  }
}
