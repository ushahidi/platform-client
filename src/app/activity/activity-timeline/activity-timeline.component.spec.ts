import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTimelineComponent } from './activity-timeline.component';

describe('ActivityTimelineComponent', () => {
  let component: ActivityTimelineComponent;
  let fixture: ComponentFixture<ActivityTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivityTimelineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
