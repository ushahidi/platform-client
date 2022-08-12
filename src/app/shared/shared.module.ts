import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MaterialModule } from './material.module';
import { LogoComponent } from './components/logo/logo.component';

const components = [SidebarComponent, ToolbarComponent, LogoComponent];

const modules = [MaterialModule];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, ...modules, RouterModule],
  exports: [...components, ...modules],
})
export class SharedModule {}
