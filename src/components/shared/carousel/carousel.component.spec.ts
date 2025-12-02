import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CarouselComponent } from './carousel.component';

describe('CarouselComponent', () => {
  let fixture: ComponentFixture<CarouselComponent<string>>;
  let component: CarouselComponent<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselComponent<string>);
    component = fixture.componentInstance;
  });

  it('should render nothing when there are no items', () => {
    // signal input via setInput
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('.carousel-card'));
    expect(card).toBeNull();
  });

  it('should render first item and nav buttons only when there are many items', () => {
    fixture.componentRef.setInput('items', ['one']);
    fixture.detectChanges();

    // one item → no nav
    expect(fixture.debugElement.query(By.css('.carousel-card'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.carousel-nav-area.left'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.carousel-nav-area.right'))).toBeNull();

    // multiple items → nav visible
    fixture.componentRef.setInput('items', ['one', 'two']);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.carousel-nav-area.left'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.carousel-nav-area.right'))).not.toBeNull();

    // default template should show first item
    const defaultItem = fixture.debugElement.query(By.css('.default-item'));
    expect(defaultItem.nativeElement.textContent).toContain('one');
  });

  it('should move next/prev and respect loop flag', () => {
    fixture.componentRef.setInput('items', ['a', 'b', 'c']);
    fixture.componentRef.setInput('loop', false);
    fixture.detectChanges();

    expect(component.currentIndex()).toBe(0);

    component.next();
    expect(component.currentIndex()).toBe(1);

    component.next();
    expect(component.currentIndex()).toBe(2);

    // at last index, loop=false → stay
    component.next();
    expect(component.currentIndex()).toBe(2);

    // enable loop and go forward from last → wrap
    fixture.componentRef.setInput('loop', true);
    fixture.detectChanges();

    component.next();
    expect(component.currentIndex()).toBe(0);

    // from first with loop=true and prev() → wrap to last
    component.prev();
    expect(component.currentIndex()).toBe(2);
  });

  it('should auto-play when enabled', fakeAsync(() => {
    fixture.componentRef.setInput('items', ['a', 'b', 'c']);
    fixture.componentRef.setInput('autoPlay', true);
    fixture.componentRef.setInput('intervalMs', 500);
    fixture.detectChanges();

    component.ngOnInit();

    expect(component.currentIndex()).toBe(0);

    tick(500 + 1);
    expect(component.currentIndex()).toBe(1);

    tick(500);
    expect(component.currentIndex()).toBe(2);
  }));

  it('should pause and resume auto-play', fakeAsync(() => {
    fixture.componentRef.setInput('items', ['a', 'b', 'c']);
    fixture.componentRef.setInput('autoPlay', true);
    fixture.componentRef.setInput('intervalMs', 500);
    fixture.detectChanges();

    component.ngOnInit();

    tick(500 + 1);
    expect(component.currentIndex()).toBe(1);

    component.pause();
    tick(1000);
    expect(component.currentIndex()).toBe(1); // no change while paused

    component.resume();
    tick(500 + 1);
    expect(component.currentIndex()).toBe(2);
  }));
});

/**
 * Host component to verify projected template overrides default template
 */
@Component({
  standalone: true,
  imports: [CarouselComponent],
  template: `
    <app-carousel [items]="items">
      <ng-template let-item>
        <div class="projected">Projected: {{ item }}</div>
      </ng-template>
    </app-carousel>
  `,
})
class HostWithTemplateComponent {
  items = ['x', 'y'];
}

describe('CarouselComponent with projected template', () => {
  let fixture: ComponentFixture<HostWithTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostWithTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostWithTemplateComponent);
    fixture.detectChanges();
  });

  it('should render projected template instead of default template', () => {
    const projected = fixture.debugElement.query(By.css('.projected'));
    expect(projected).not.toBeNull();
    expect(projected.nativeElement.textContent).toContain('Projected: x');

    const defaultItem = fixture.debugElement.query(By.css('.default-item'));
    expect(defaultItem).toBeNull();
  });
});
