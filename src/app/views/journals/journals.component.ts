import { Component, Inject, OnInit } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BaseAPIService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-journals',
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.scss']
})
export class JournalsComponent implements OnInit {

  activeItemIndex = 0;
  total: any;
  loading = false;
  data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  journalcategories = [
    {
      id: 1,
      name: 'Animals',
      img: '/assets/animals.jpg',
    },
    {
      id: 2,
      name: 'Education',
      img: '/assets/education.png',
    },
    {
      id: 3,
      name: 'Music',
      img: '/assets/music.jpg',
    },
    {
      id: 4,
      name: 'Religion',
      img: '/assets/religion.png',
    }
  ];
  myjournals: any;
  // myjournals = [
  //   {
  //     JournalID: 1,
  //     Title: 'A title one',
  //     Content: 'Content here',
  //     CategoryName: 'Education',
  //     CategoryImage: '/assets/education.png'
  //   },
  //   {
  //     JournalID: 2,
  //     Title: 'A title two',
  //     Content: 'Content here',
  //     CategoryName: 'Animals',
  //     CategoryImage: '/assets/animals.jpg'
  //   },
  //   {
  //     JournalID: 3,
  //     Title: 'A title tree',
  //     Content: 'Content here',
  //     CategoryName: 'Religion',
  //     CategoryImage: '/assets/religion.png'
  //   },
  //   {
  //     JournalID: 4,
  //     Title: 'A title four',
  //     Content: 'Content here',
  //     CategoryName: 'Music',
  //     CategoryImage: '/assets/music.jpg'
  //   }
  // ];

  $journals = new BehaviorSubject<any>([]).asObservable();
  currentPage = 0;
  currentSize = 30;

  constructor(private api: BaseAPIService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
  ) { }

  onClick(item: string): void {
    this.alertService.open(item).subscribe();
  }
  ngOnInit(): void {
    this.fetchJournals();
  }
  fetchJournals(): void {
    this.$journals = this.api.listPaginated<any>(`${environment.API_HOST}`, `/journal/list`, { pageNumber: this.currentPage, recordCount: this.currentSize })
      .pipe(
        tap(
          resp => {
            this.myjournals = [];
            this.myjournals = resp.results;
          }
        )
      )
  }
  onSize(size): void {
    this.currentSize = size;
    this.fetchJournals();
  }
  onPage(page): void {
    this.currentPage = page + 1;
    this.fetchJournals();
  }

}
