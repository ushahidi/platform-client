import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetedSurveyTableComponent } from './targeted-survey-table.component';

describe('TargetedSurveyTableComponent', () => {
  let component: TargetedSurveyTableComponent;
  let fixture: ComponentFixture<TargetedSurveyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TargetedSurveyTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TargetedSurveyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
