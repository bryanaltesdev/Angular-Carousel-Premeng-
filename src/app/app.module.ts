import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent }   from './app.component';

import {CarouselModule} from 'primeng/carousel';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CarouselModule,
    ButtonModule,
    ToastModule,
    DropdownModule,
    InputTextModule,
    HttpClientModule,
    FormsModule
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers: []
})

export class AppModule { }
