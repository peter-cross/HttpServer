/** Program Name : Lab Project
 ** Name and ID : Peter Cross
 ** Date : June 28, 2018
 ** Lab : 6
 ** Course : CPSC2261
 */

import { Component } from '@angular/core';
import { HttpdataService } from './httpdata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent 
{
    title = 'app';
    
    constructor( private dataService: HttpdataService )
    { }
    
    ngOnInit() 
    {
        this.dataService.retrieveData()
    }
}