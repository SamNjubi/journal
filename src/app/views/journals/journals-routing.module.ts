import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JournalComponent } from './journal/journal.component';
import { JournalsComponent } from './journals.component';
import { NewJournalComponent } from './new-journal/new-journal.component';

const routes: Routes = [
  {
    path: '',
    component: JournalsComponent,
  },
  {
    path: 'add',
    component: NewJournalComponent
  },
  {
    path: ':id',
    component: JournalComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalsRoutingModule { }
