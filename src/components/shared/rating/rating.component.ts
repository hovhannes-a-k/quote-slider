import {ChangeDetectionStrategy, Component, input, linkedSignal, output} from '@angular/core';

@Component({
  selector: 'app-rating',
  imports: [],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent {
  readonly rating = input(0);
  readonly disabled = input(false);

  readonly ratingChange = output<number>();

  readonly currentRating = linkedSignal(() => this.rating());

  readonly stars = 5;


  setRating(value: number): void {
    this.currentRating.set(value);
    this.ratingChange.emit(value);
  };
}
