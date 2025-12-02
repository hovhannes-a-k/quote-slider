import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let fixture: ComponentFixture<SkeletonComponent>;
  let component: SkeletonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have skeleton host class', () => {
    const host = fixture.debugElement.nativeElement as HTMLElement;
    expect(host.classList.contains('skeleton')).toBeTrue();
  });

  it('should apply width and height with px via transform', () => {
    fixture.componentRef.setInput('width', 100);
    fixture.componentRef.setInput('height', 40);
    fixture.detectChanges();

    const host = fixture.debugElement.nativeElement as HTMLElement;
    expect(host.style.width).toBe('100px');
    expect(host.style.height).toBe('40px');
  });
});
