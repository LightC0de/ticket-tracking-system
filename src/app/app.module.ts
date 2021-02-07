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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {QuillModule} from 'ngx-quill';
import {AUTH_INTERCEPTOR} from './shared/services/auth.interceptor';
import {FAKE_BACKEND_INTERCEPTOR} from './shared/services/fake-backend.interceptor';

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
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    QuillModule.forRoot()
  ],
  providers: [AUTH_INTERCEPTOR, FAKE_BACKEND_INTERCEPTOR],
  bootstrap: [AppComponent]
})
export class AppModule { }
