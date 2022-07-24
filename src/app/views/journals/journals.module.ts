import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JournalsRoutingModule } from './journals-routing.module';
import { JournalsComponent } from './journals.component';
import { JournalComponent } from './journal/journal.component';
import { NewJournalComponent } from './new-journal/new-journal.component';
import { TuiBreadcrumbsModule, TuiInputCountModule, TuiInputModule, TuiIslandModule, TuiLineClampModule } from '@taiga-ui/kit';
import { TuiTabsModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLoaderModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { NgSelectModule } from '@ng-select/ng-select';
import { TuiEditorModule, TuiEditorSocketModule } from '@taiga-ui/addon-editor';
import { PreviewJournalSubmissionDialog } from './dialogs/preview-journal-submission/preview-journal-submission.dialog';
import { TuiLetModule } from '@taiga-ui/cdk';


@NgModule({
  declarations: [
    JournalsComponent,
    JournalComponent,
    NewJournalComponent,
    PreviewJournalSubmissionDialog
  ],
  imports: [
    CommonModule,
    JournalsRoutingModule,

    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,

    TuiBreadcrumbsModule,
    TuiTabsModule,
    TuiInputModule,
    TuiInputCountModule,
    TuiSvgModule,
    TuiLoaderModule,
    TuiTablePaginationModule,
    TuiLineClampModule,
    TuiIslandModule,
    TuiButtonModule,
    TuiTextfieldControllerModule,
    TuiEditorModule,
    TuiEditorSocketModule,
    TuiLetModule
  ],
  entryComponents: [
    PreviewJournalSubmissionDialog
  ]
})
export class JournalsModule { }
