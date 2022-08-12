import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeChartComponent } from './time-chart.component';

describe('TimeChartComponent', () => {
  let component: TimeChartComponent;
  let fixture: ComponentFixture<TimeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
