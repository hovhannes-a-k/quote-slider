import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'app-skeleton',
  imports: [],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'skeleton',
    '[style.width]': 'width()',
    '[style.height]': 'height()',
  }
})
export class SkeletonComponent {
  width = input('', {transform: appendPx});
  height = input('', {transform: appendPx})

}

function appendPx(value: number): string {
  return `${value}px`;
}
