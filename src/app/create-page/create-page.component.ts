import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Ticket} from '../shared/interfaces';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

  public form: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      responsiblePerson: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required)
    });
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    const ticket: Ticket = {
      title: this.form.value.title,
      responsiblePerson: this.form.value.title,
      description: this.form.value.description
    };
  }

}
