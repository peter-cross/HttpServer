/** Program Name : Lab Project
 ** Name and ID : Peter Cross
 ** Date : June 28, 2018
 ** Lab : 6
 ** Course : CPSC2261
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CoreComponent } from './core/core.component';
import { HttpserverComponent } from './httpserver/httpserver.component';

@NgModule( 
{
  declarations: [
    AppComponent,
    CoreComponent,
    HttpserverComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ HttpdataService ],
  bootstrap: [ AppComponent ]
} )

export class AppModule { }