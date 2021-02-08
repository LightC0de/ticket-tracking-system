import {Pipe, PipeTransform} from '@angular/core';
import {Ticket} from './interfaces';

@Pipe({
  name: 'filterTickets'
})
export class FilterPipe implements PipeTransform {
  transform(tickets: Ticket[], filter = 0): Ticket[] {
    if (filter !== 1 && filter !== 2) {
      return tickets;
    }

    if (filter === 1) {
      return tickets.filter(ticket => {
        return ticket.isClosed;
      });
    }

    return tickets.filter(ticket => {
      return !ticket.isClosed;
    });
  }

}
