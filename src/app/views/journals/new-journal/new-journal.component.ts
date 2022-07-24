import { Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiDialogService, TuiAlertService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject } from 'rxjs';
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
      id: 1,
      name: 'Animals',
      img: '/assets/animals.jpg',
      description: 'Animals category'
    },
    {
      id: 2,
      name: 'Education',
      img: '/assets/education.png',
      description: 'Education category'
    },
    {
      id: 3,
      name: 'Music',
      img: '/assets/music.jpg',
      description: 'Music category'
    },
    {
      id: 4,
      name: 'Religion',
      img: '/assets/religion.png',
      description: 'Religion category'
    }
  ];
  journalContent: string;
  addJournalForm: FormGroup;
  loading = false;
  dialog: any;
  selectedCategory: { id: number; name: string; img: string; description: string; }[];
  $categories = new BehaviorSubject<any>([]).asObservable();
  $submitResp = new BehaviorSubject<any>([]).asObservable();

  constructor(
    private fb: FormBuilder,
    private api: BaseAPIService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,) {
    this.addJournalForm = this.fb.group({
      title: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      content: new FormControl(null, Validators.required)
    })
  }

  ngOnInit(): void {
    this.fetchCategories()
  }
  fetchCategories(): void {
    this.$categories = this.api.listPaginated<any>(`${environment.API_HOST}`, `/categories`, { page: 1, page_size: 50 });
  }

  onPreview(): void {
    this.selectedCategory = this.journalcategories.filter(val => val.id === this.addJournalForm.value.category);
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
        console.info(`Dialog emitted data = ${data}`);
      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }

  addJournal(): void {
    console.log(this.addJournalForm.value);
    this.$submitResp = this.api.post<any>(`${environment.API_HOST}`, `/journals`, this.addJournalForm.value);
  }

}