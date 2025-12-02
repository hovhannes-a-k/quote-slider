import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RatingComponent } from './rating.component';

describe('RatingComponent', () => {
  let fixture: ComponentFixture<RatingComponent>;
  let component: RatingComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
  });

  it('should render 5 stars and reflect initial rating', () => {
    fixture.componentRef.setInput('rating', 2);
    fixture.detectChanges();

    const stars = fixture.debugElement.queryAll(By.css('.star-rating span'));
    expect(stars.length).toBe(5);

    const filled = stars.filter(s => s.nativeElement.classList.contains('filled'));
    expect(filled.length).toBe(2);
  });

  it('should update rating and emit ratingChange on click when enabled', () => {
    fixture.componentRef.setInput('rating', 1);
    fixture.detectChanges();

    const ratingSpy = jasmine.createSpy('ratingChange');
    component.ratingChange.subscribe(ratingSpy);

    const stars = fixture.debugElement.queryAll(By.css('.star-rating span'));
    // click 4th star → rating = 4
    stars[3].nativeElement.click();
    fixture.detectChanges();

    expect(component.currentRating()).toBe(4);
    expect(ratingSpy).toHaveBeenCalledWith(4);
  });

  it('should not change rating when disabled', () => {
    fixture.componentRef.setInput('rating', 1);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const ratingSpy = jasmine.createSpy('ratingChange');
    component.ratingChange.subscribe(ratingSpy);

    const stars = fixture.debugElement.queryAll(By.css('.star-rating span'));
    stars[2].nativeElement.click();
    fixture.detectChanges();

    // still initial
    expect(component.currentRating()).toBe(1);
    expect(ratingSpy).not.toHaveBeenCalled();
  });

  it('should change rating on Enter key', () => {
    fixture.componentRef.setInput('rating', 1);
    fixture.detectChanges();

    const ratingSpy = jasmine.createSpy('ratingChange');
    component.ratingChange.subscribe(ratingSpy);

    const stars = fixture.debugElement.queryAll(By.css('.star-rating span'));
    const thirdStar = stars[2].nativeElement as HTMLElement;

    thirdStar.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(component.currentRating()).toBe(3);
    expect(ratingSpy).toHaveBeenCalledWith(3);
  });
});
