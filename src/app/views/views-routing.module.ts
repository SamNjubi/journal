import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JournalsComponent } from './journals/journals.component';
import { ViewsComponent } from './views.component';

const routes: Routes = [
  {
    path: '',
    component: ViewsComponent,
    children: [
      {
        path: '',
        redirectTo: 'journals',
        pathMatch: 'full'
      },
      {
        path: 'journals',
        loadChildren: () => import('./journals/journals.module').then((m) => m.JournalsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewsRoutingModule { }
