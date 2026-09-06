import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CourseCardComponent } from './course-card.component';

describe('CourseCardComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should display the course title', async () => {
    const fixture = TestBed.createComponent(CourseCardComponent);

    fixture.componentRef.setInput('course', {
      id: 1,
      code: 'CSE-101',
      title: 'Advanced Web Dev',
      maxCapacity: 30,
      enrollmentCount: 12,
    });

    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Advanced Web Dev');
  });

  it('should emit enrollClicked event when button is clicked', async () => {
    const fixture = TestBed.createComponent(CourseCardComponent);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('course', {
      id: 1,
      code: 'CSE-101',
      title: 'Advanced Web Dev',
      maxCapacity: 30,
      enrollmentCount: 12,
    });

    await fixture.whenStable();

    let emittedCourse: any = null;
    component.enrollClicked.subscribe((c: any) => (emittedCourse = c));

    const button = fixture.nativeElement.querySelector(
      'button'
    ) as HTMLButtonElement;
    button.click();
    await fixture.whenStable();

    expect(emittedCourse).toBeTruthy();
    expect(emittedCourse.title).toBe('Advanced Web Dev');
  });
});