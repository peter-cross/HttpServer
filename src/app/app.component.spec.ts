/** Program Name : Lab Project
 ** Name and ID : Peter Cross
 ** Date : June 28, 2018
 ** Lab : 6
 ** Course : CPSC2261
 */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpdataService } from './httpdata.service'
import { HttpClient } from '@angular/common/http'
  
describe('AppComponent', () => 
{
    beforeEach( async( () => 
    {
        let spy = jasmine.createSpyObj( 'HttpClient', ['getValue'] )
        
        TestBed.configureTestingModule(
        {
            declarations: [ AppComponent ],
            providers: [ HttpdataService, {provide: HttpClient, useValue: spy} ]
        } )
        .compileComponents();
    }) );
  
    it( 'should create the app', async( () => 
    {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }) );
  
    it( 'should have as title "app" ', async( () => 
    {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('app');
    }) );
} );