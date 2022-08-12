import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataRoutingModule } from './data-routing.module';
import { DataComponent } from './data.component';

@NgModule({
  declarations: [DataComponent],
  imports: [CommonModule, DataRoutingModule],
})
export class DataModule {}
