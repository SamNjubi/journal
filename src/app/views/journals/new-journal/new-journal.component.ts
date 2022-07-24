import { Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiDialogService, TuiAlertService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, tap } from 'rxjs';
import { BaseAPIService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { PreviewJournalSubmissionDialog } from '../dialogs/preview-journal-submission/preview-journal-submission.dialog';

@Component({
  selector: 'app-new-journal',
  templateUrl: './new-journal.component.html',
  styleUrls: ['./new-journal.component.scss']
})
export class NewJournalComponent implements OnInit {


  breadcrumbitems = [
    {
      caption: 'Journals',
      routerLink: '/views/journals',
    },
    {
      caption: 'New Journal',
      routerLink: '/views/journals/add',
      routerLinkActiveOptions: { exact: true },
    },
  ];

  journalcategories = [
    {
      CategoryID: 1,
      Name: 'Animals',
      img: '/assets/animals.jpg',
      description: 'Animals category'
    },
    {
      CategoryID: 2,
      Name: 'Education',
      img: '/assets/education.png',
      description: 'Education category'
    },
    {
      CategoryID: 3,
      Name: 'Music',
      img: '/assets/music.jpg',
      description: 'Music category'
    },
    {
      CategoryID: 4,
      Name: 'Religion',
      img: '/assets/religion.png',
      description: 'Religion category'
    }
  ];
  journalContent: string;
  addJournalForm: FormGroup;
  loading = false;
  dialog: any;
  selectedCategory: any;
  $categories = new BehaviorSubject<any>([]).asObservable();
  $submitResp = new BehaviorSubject<any>([]).asObservable();

  constructor(
    private fb: FormBuilder,
    private api: BaseAPIService,
    private router: Router,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,) {
    this.addJournalForm = this.fb.group({
      Title: new FormControl(null, Validators.required),
      CategoryID: new FormControl(null, Validators.required),
      Content: new FormControl(null, Validators.required)
    })
  }

  ngOnInit(): void {
    this.fetchCategories()
  }
  fetchCategories(): void {
    // this.$categories = this.api.listPaginated<any>(`${environment.API_HOST}`, `/journal/category-list`, { pageNumber: 1, recordCount: 50 })
    //   .pipe(
    //     tap(
    //       resp => {
    //         this.journalcategories = [];
    //         this.journalcategories = resp.results;
    //       }
    //     )
    //   )
  }

  onPreview(): void {
    this.selectedCategory = this.journalcategories.filter(val => val.CategoryID === this.addJournalForm.value.CategoryID);
    this.dialog = this.dialogService.open<number>(
      new PolymorpheusComponent(PreviewJournalSubmissionDialog, this.injector),
      {
        data: [this.addJournalForm.value, this.selectedCategory],
        dismissible: true,
        label: 'Preview Ticket',
      },
    );
    this.dialog.subscribe({
      next: data => {
      },
      complete: () => {
      },
    });
  }

  addJournal(): void {
    this.delay(2000);
    this.alertService.open('Successfully added journal').subscribe();
    this.router.navigate(['/views/journals']);
    this.$submitResp = this.api.post<any>(`${environment.API_HOST}`, `/journal`, this.addJournalForm.value)
      .pipe(
        tap(resp => {
        })
      )
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  onCancel(): void {
    this.router.navigate(['/views/journals']);
  }

}
