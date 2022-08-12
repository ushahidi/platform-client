import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrowdsourcedSurveyTableComponent } from './crowdsourced-survey-table.component';

describe('CrowdsourcedSurveyTableComponent', () => {
  let component: CrowdsourcedSurveyTableComponent;
  let fixture: ComponentFixture<CrowdsourcedSurveyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrowdsourcedSurveyTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrowdsourcedSurveyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
