import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainLayoutComponent} from './shared/components/main-layout/main-layout.component';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {CreatePageComponent} from './create-page/create-page.component';
import {EditPageComponent} from './edit-page/edit-page.component';
import {TicketPageComponent} from './ticket-page/ticket-page.component';

const routes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', component: LoginPageComponent},
      {path: 'dashboard', component: DashboardPageComponent},
      {path: 'create', component: CreatePageComponent},
      {path: 'ticket/:id', component: TicketPageComponent},
      {path: 'ticket/:id/edit', component: EditPageComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
