import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { CreatePageComponent } from './create-page/create-page.component';
import { EditPageComponent } from './edit-page/edit-page.component';
import { TicketComponent } from './shared/components/ticket/ticket.component';
import { TicketPageComponent } from './ticket-page/ticket-page.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardPageComponent,
    MainLayoutComponent,
    LoginPageComponent,
    CreatePageComponent,
    EditPageComponent,
    TicketComponent,
    TicketPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
