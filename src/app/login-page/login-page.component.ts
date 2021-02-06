import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../shared/interfaces';
import {AuthService} from '../shared/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form: FormGroup;
  public submitted = false;

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

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

    this.submitted = true;

    const user: User = {
      login: this.form.value.login,
      password: this.form.value.password
    };

    this.auth.login(user).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/', 'dashboard']);
      this.submitted = false;
    }, () => {
      this.submitted = false;
    });
  }
}
