import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityRoutingModule } from './activity-routing.module';
import { ActivityTimelineComponent } from './activity-timeline/activity-timeline.component';
import { ActivityComponent } from './activity.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { CrowdsourcedSurveyTableComponent } from './crowdsourced-survey-table/crowdsourced-survey-table.component';
import { TargetedSurveyTableComponent } from './targeted-survey-table/targeted-survey-table.component';
import { TimeChartComponent } from './time-chart/time-chart.component';

@NgModule({
  declarations: [
    ActivityComponent,
    ActivityTimelineComponent,
    BarChartComponent,
    CrowdsourcedSurveyTableComponent,
    TargetedSurveyTableComponent,
    TimeChartComponent,
  ],
  imports: [CommonModule, ActivityRoutingModule],
})
export class ActivityModule {}
