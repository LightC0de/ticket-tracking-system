import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../shared/interfaces';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form: FormGroup;

  constructor() { }

  public ngOnInit(): void {
    this.form = new FormGroup({
      login: new FormControl(null, [
        Validators.required
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  public submit(): void {
    if (this.form.invalid) {
      return null;
    }

    const user: User = {
      login: this.form.value.login,
      password: this.form.value.password
    };

  }

}
