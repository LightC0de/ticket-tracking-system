import {Component, OnDestroy, OnInit} from '@angular/core';
import {TicketsService} from '../shared/services/tickets.service';
import {Ticket} from '../shared/interfaces';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  public ticketsImAssignee: Ticket[];
  public ticketsImReporter: Ticket[];
  private tSub: Subscription;

  constructor(
    private ticketsService: TicketsService
  ) { }

  public ngOnInit(): void {
    const userId = localStorage.getItem('user-id');
    this.tSub = this.ticketsService.getAll(userId).subscribe((tickets: Ticket[]) => {

      this.ticketsImAssignee = tickets.filter((ticket: Ticket) => {
        return ticket.assignee.toString() === userId;
      });

      this.ticketsImReporter = tickets.filter((ticket: Ticket) => {
        return ticket.reporter.toString() === userId;
      });
    });
  }

  public ngOnDestroy(): void {
    if (this.tSub) {
      this.tSub.unsubscribe();
    }
  }

}
