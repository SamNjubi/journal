import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BaseAPIService } from 'src/app/shared/services';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {

  breadcrumbitems = [
    {
      caption: 'Journals',
      routerLink: '/views/journals',
    },
    {
      caption: 'Journal',
      routerLinkActiveOptions: { exact: true },
    },
  ];
  journal = {
    Title: 'Journal one',
    Content: `WYSIWYG (What you see is what you get) — Rich Text Editor for using with Angular forms.<p><font size="6">Heading</font></p><font size="4">Lorem ipsum dolor sit amet <font color="#ff78a7">consectetur adipiscing elit</font>, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <span style="background-color: rgb(163, 129, 255);">Ut enim </span></font><blockquote>ad minim veniam, <u>quis nostrud exercitation</u> <b>ullamco</b>, laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</blockquote><p style="text-align: right;">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
    CategoryName: 'Religion',
    CategoryImage: '/assets/education.png',
    created_at: new Date()
  }
  journalId: string;
  $journal = new BehaviorSubject<any>([]).asObservable();

  constructor(
    private route: ActivatedRoute,
    private api: BaseAPIService
  ) {
    this.journalId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.fetchJournal()
  }
  fetchJournal(): void {
    this.$journal = this.api.fetch(`/journals/${this.journalId}`);
  }

}
