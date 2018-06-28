/** Program Name : Lab Project
 ** Name and ID : Peter Cross
 ** Date : June 28, 2018
 ** Lab : 6
 ** Course : CPSC2261
 */

import { HttpdataService } from '../httpdata.service';
import { Component, OnInit } from '@angular/core';

@Component( {
  selector: 'app-httpserver',
  templateUrl: './httpserver.component.html',
  styleUrls: ['./httpserver.component.css']
} )

export class HttpserverComponent implements OnInit 
{
  constructor( public dataService: HttpdataService ) 
  { }

  ngOnInit() 
  { }   
}