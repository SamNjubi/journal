import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewsRoutingModule } from './views-routing.module';
import { ViewsComponent } from './views.component';
import { LayoutSectionsModule } from '../layouts/sections/layout-sections.module';


@NgModule({
  declarations: [
    ViewsComponent
  ],
  imports: [
    CommonModule,
    ViewsRoutingModule,
    LayoutSectionsModule

  ]
})
export class ViewsModule { }
