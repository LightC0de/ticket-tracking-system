import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Ticket} from '../shared/interfaces';
import {TicketsService} from '../shared/services/tickets.service';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

  public form: FormGroup;
  public submitted: boolean;

  constructor(private ticketsService: TicketsService) { }

  ngOnInit(): void {
    this.submitted = false;
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      assignee: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required)
    });
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    const ticket: Ticket = {
      title: this.form.value.title,
      assignee: this.form.value.assignee,
      reporter: localStorage.getItem('user-id'),
      description: this.form.value.description,
      isClosed: false
    };

    this.submitted = true;
    this.ticketsService.create(ticket).subscribe(newTicket => {
      console.log(newTicket);
      this.form.reset();
      this.submitted = false;
    }, (error) => {
      throwError(error);
      this.submitted = false;
    });
  }

}
