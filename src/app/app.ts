import {ChangeDetectionStrategy, Component} from '@angular/core';
import {QuotesComponent} from '../components/quotes/quotes.component';

@Component({
  selector: 'app-root',
  imports: [
    QuotesComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
}
