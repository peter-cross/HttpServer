/** Program Name : Lab Project
 ** Name and ID : Peter Cross
 ** Date : June 28, 2018
 ** Lab : 6
 ** Course : CPSC2261
 */

import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpserverComponent } from './httpserver.component'
import { HttpdataService } from '../httpdata.service'
import { HttpClient } from '@angular/common/http'
import { Item, Ingredient , Recipe } from "../core//core.component";

import * as parser from "body-parser"
import * as request from 'request'
    
describe( 'HttpserverComponent', () => 
{
    let component: HttpserverComponent
    let fixture: ComponentFixture<HttpserverComponent>

    let srvURL = 'http://localhost:3000'
    
    let dataService: any
    let serviceSpy: jasmine.SpyObj<HttpClient>
    
    let serverComponent: HttpserverComponent
    
    beforeEach( async( () => 
    {
        let spy = jasmine.createSpyObj( 'HttpClient', ['getValue'] )
        
        TestBed.configureTestingModule(
        {
            declarations: [ HttpserverComponent ],
            providers: [ HttpdataService, {provide: HttpClient, useValue: spy} ]
        } )
        .compileComponents()
        
        serviceSpy = TestBed.get( HttpClient )
        dataService = TestBed.get( HttpdataService )
        //dataService.retrieveData()
    } ) )

    beforeEach( () => 
    {
        fixture = TestBed.createComponent( HttpserverComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } )

    it( 'component should be created', () => 
    {
        expect( component ).toBeTruthy();
    } )
    
    it( 'data service of component should be defined', () => 
    {
        expect( component.dataService ).not.toBe( null );
    } )
    
    it( 'http data service should be created', () => 
    {
        expect( dataService ).not.toBe( null )
    } )
    
    it( 'http client should be created', () => 
    {
        expect( serviceSpy ).not.toBe( null )
    } )
    
    let recipes: Recipe[]
    
    it( 'data service recipes should be retrieved', () => 
    {
        recipes = component.dataService.getRecipes()
        expect( recipes ).not.toBe( null )
    } )
    
    /*
    it( 'recipes array length should be greater than 0', () => 
    {   
        expect( recipes.length ).not.toBe( 0 )
    } )
    */
} )