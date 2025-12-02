import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input, OnInit,
  output, signal,
  TemplateRef,
  viewChild
} from '@angular/core';
import {CdkTrapFocus} from '@angular/cdk/a11y';
import {MatIcon} from '@angular/material/icon';
import {JsonPipe, NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-carousel',
  imports: [
    CdkTrapFocus,
    MatIcon,
    JsonPipe,
    NgTemplateOutlet,
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(keydown.arrowRight)': 'next()',
    '(keydown.arrowLeft)': 'prev()',
  },
})
export class CarouselComponent<T = unknown> implements OnInit {
  readonly items = input<ReadonlyArray<T>>([]);
  readonly autoPlay = input(true);
  readonly intervalMs = input(5_000);
  readonly loop = input(false);

  readonly activeIndexChange = output<number>();

  private readonly projectedTemplate = contentChild<TemplateRef<any>>(TemplateRef);
  private readonly defaultItemTemplate = viewChild<TemplateRef<any>>('defaultItem');

  readonly resolvedTemplate = computed(
    () => this.projectedTemplate() ?? this.defaultItemTemplate()
  );

  readonly currentIndex = signal(0);

  readonly currentItem = computed(() => {
    const list = this.items();
    const idx = this.currentIndex();
    if (!list.length) return null;
    const safeIndex = Math.max(0, Math.min(idx, list.length - 1));
    return list[safeIndex];
  });

  private intervalId: number | null = null;
  private paused = false;

  ngOnInit(): void {
    this.setupAutoPlay();
  }

  next(): void {
    const len = this.items().length;
    if (!len) return;

    const lastIndex = len - 1;
    const current = this.currentIndex();

    if (current === lastIndex && !this.loop()) {
      return;
    }

    const nextIndex = (current + 1) % len;
    this.currentIndex.set(nextIndex);
    this.activeIndexChange.emit(nextIndex);
  }

  prev(): void {
    const len = this.items().length;
    if (!len) return;

    const current = this.currentIndex();

    if (current === 0 && !this.loop()) {
      return;
    }

    const prevIndex = (current - 1 + len) % len;
    this.currentIndex.set(prevIndex);
    this.activeIndexChange.emit(prevIndex);
  }

  goTo(index: number): void {
    const len = this.items().length;
    if (!len) return;
    if (index < 0 || index >= len) return;
    this.currentIndex.set(index);
    this.activeIndexChange.emit(index);
  }

  pause(): void {
    this.paused = true;
    this.clearInterval();
  }

  resume(): void {
    this.paused = false;
    this.setupAutoPlay();
  }

  private setupAutoPlay(): void {
    this.clearInterval();

    if (!this.autoPlay() || this.items().length <= 1 || this.paused) {
      return;
    }

    this.intervalId = window.setInterval(() => {
      this.next();
    }, this.intervalMs());
  }

  private clearInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
