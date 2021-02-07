import { Component, OnInit } from '@angular/core';
import {TicketsService} from '../shared/services/tickets.service';
import {Ticket} from '../shared/interfaces';
import {ActivatedRoute, Router} from '@angular/router';
import {throwError} from 'rxjs';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-ticket-page',
  templateUrl: './ticket-page.component.html',
  styleUrls: ['./ticket-page.component.scss']
})
export class TicketPageComponent implements OnInit {

  public title: string;
  public assignee: string;
  public reporter: string;
  public description: string;
  public isAdmin: boolean;
  public isClosed: boolean;

  public submitted: boolean;
  private ticketId: string;

  constructor(
    private ticketsService: TicketsService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.submitted = false;
    this.ticketId = this.route.snapshot.paramMap.get('id');
    this.ticketsService.getTicket(this.ticketId).subscribe((ticket: Ticket) => {
      this.title = ticket.title;
      this.assignee = ticket.assignee;
      this.reporter = ticket.reporter;
      this.description = ticket.description;
      this.isClosed = ticket.isClosed;
      this.isAdmin = this.auth.isAdmin();
    });
  }

  public close(): void {
    this.submitted = true;
    this.ticketsService.close(this.ticketId).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/', 'dashboard']);
      this.submitted = false;
      }, (error) => {
        throwError(error);
        this.submitted = false;
      }
    );
  }

  public delete(): void {
    this.submitted = true;
    this.ticketsService.delete(this.ticketId).subscribe((res) => {
        console.log(res);
        this.router.navigate(['/', 'dashboard']);
        this.submitted = false;
      }, (error) => {
        throwError(error);
        this.submitted = false;
      }
    );
  }

}
