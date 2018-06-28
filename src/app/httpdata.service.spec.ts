/** Program Name : Lab Project
 ** Name and ID : Peter Cross
 ** Date : June 28, 2018
 ** Lab : 6
 ** Course : CPSC2261
 */

import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { HttpdataService } from './httpdata.service';

describe('HttpdataService', () => 
{
    let spy = jasmine.createSpyObj( 'HttpClient', ['getValue'] )
        
    beforeEach( () => 
    {
        TestBed.configureTestingModule(
        {
            providers: [ HttpClient, {provide: HttpClient, useValue: spy} ]
        } );
    } );

    it( 'should be created', inject([HttpClient], (service: HttpClient) => 
    {
        expect( service ).toBeTruthy();
    }) );
});