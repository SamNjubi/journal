import { Component, Inject } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
    selector: 'preview-journal-submission-dialog',
    templateUrl: './preview-journal-submission.dialog.html'
})

export class PreviewJournalSubmissionDialog {
    today: Date;
    journal: any;
    subcategory: any;
    category: any;

    constructor(
        @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
        @Inject(POLYMORPHEUS_CONTEXT)
        private readonly context: TuiDialogContext<any, any>,
    ) {
        this.today = new Date();
        this.journal = this.data[0];
        this.category = this.data[1]
    }

    get data(): any {
        return this.context.data;
    }

    onDone(): void {
        this.context.completeWith('');
    }
} 
