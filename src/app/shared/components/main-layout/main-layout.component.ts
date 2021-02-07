import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  public userName: string;

  constructor(
    private router: Router,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('user-id');
  }

  public logout(event: Event): void {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/', 'login']);
  }

}
