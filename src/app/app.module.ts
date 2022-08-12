import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActivityModule } from './activity/activity.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, SharedModule, ActivityModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
