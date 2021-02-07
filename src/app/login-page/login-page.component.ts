import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../shared/interfaces';
import {AuthService} from '../shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  public form: FormGroup;
  public submitted = false;
  public message: string;

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const key = 'loginAgain';
      const key2 = 'authFailed';
      if (params[key]) {
        this.message = 'Please, enter your credentials';
      } else if (params[key2]) {
        this.message = 'The session has expired. Please try logging in again';
      }
    });

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
