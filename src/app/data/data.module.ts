import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataRoutingModule } from './data-routing.module';
import { DataComponent } from './data.component';
import { CollectionsComponent } from './collections/collections.component';

@NgModule({
  declarations: [DataComponent, CollectionsComponent],
  imports: [CommonModule, DataRoutingModule],
})
export class DataModule {}
