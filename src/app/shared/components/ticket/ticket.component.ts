import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  @Input() id: string;
  @Input() title: string;
  @Input() reporter: string;
  @Input() assignee: string;

  constructor() { }

  ngOnInit(): void {
  }

}
