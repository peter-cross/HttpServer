/** Program Name : Lab Project
 ** Name and ID : Peter Cross
 ** Date : June 28, 2018
 ** Lab : 6
 ** Course : CPSC2261
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Item, Recipe, Ingredient } from './core/core.component';

/*
 * Class for service that gets data from Http Server
 */
@Injectable()
export class HttpdataService 
{
    // Array for storing fridge contents
    private contents: Item[]
    
    // Array for storing recipes
    private recipes: Recipe[]
    
    private srvURL = 'http://localhost:3000'
    
    /*
     * Class constructor
     */
    constructor( private http: HttpClient ) 
    { 
        this.contents = new Array<Item>()
        this.recipes = new Array<Recipe>()
    }
    
    /*
     * Method to get fridge content as array of items
     */
    getContents(): Item[]
    {
        return this.contents
    }
    
    /*
     * Method to get quantity of fridge items
     */
    qtyOfItems(): number
    {
        return this.contents.length
    }
    
    /*
     * Method to add new item to fridge contents
     */
    addNewItem( itm: Item )
    {
        this.http.post( this.srvURL + '/additem', itm )
                 .toPromise()
                 .catch( error => error )
                 .then( result => 
                 {
                    this.contents = result.map( (val) => new Item( val.name, val.quantity ) )
                 } )
    }
    
    /*
     * Method to add quantity to specified by index fridge item
     */
    addItemQty( idx: number, qty: number )
    {
        this.addItemQtyRequest( idx, qty ).then( result => this.contents[idx].quantity = result.body )
                                          .catch( error => error )
    }
    
    /*
     * Method to remove quantity from specified by index fridge item
     */
    removeItemQty( idx: number, qty: number )
    {
        this.removeItemQtyRequest( idx, qty ).then( result => this.contents[idx].quantity = result.body )
                                             .catch( error => error )
    }
    
    /*
     * Method to delete item from fridge contents by item index
     */
    deleteItem( idx: number )
    {
        this.deleteItemRequest( idx ).then( result => this.contents = result.body )
                                     .catch( error => error )
    }
    
    /*
     * Method to get fridge item name by item index
     */
    itemName( idx: number ): string
    {
        return this.contents[idx].name
    }
    
    /*
     * Method to get fridge item quantity by item index
     */
    itemQty( idx: number ): number
    {
        return this.contents[idx].quantity
    }
    
    /*
     * Method to get system recipes as array
     */
    getRecipes(): Recipe[]
    {
        return this.recipes
    }
    
    getInfo(): string
    {
        return this.info
    }
    
    /*
     * Method to get number of recipes stored in the system
     */
    numberOfRecipes(): number
    {
        return this.recipes.length
    }
    
    /*
     * Method to get recipe object by recipe index
     */
    getRecipe( idx: number ): Recipe
    {
        return this.recipes[idx]
    }
    
    /*
     * Method to get recipe names as array
     */
    getRecipeNames(): string[]
    {
        let list = new Array<string>()
        
        for( let rcp of this.recipes )
            list.push( rcp.name )
        
        return list
    }
    
    /*
     * Method to add new recipe specified as object to Http Server
     */
    addNewRecipe( rcp: Recipe )
    {
        this.http.post( this.srvURL + '/addrecipe', rcp )
                 .toPromise()
                 .catch( error => error )
                 .then( result => 
                 {
                    this.recipes = result.map( (val) => new Recipe( val.name, val.ingredients, val.instructions, val.estimatedTime ) )
                 } )
    }
    
    /*
     * Method to remove recipe specified by index from Http Server
     */
    deleteRecipe( idx: number )
    {
        this.delRecipe( idx ).then( result => this.recipes = result.body )
                             .catch( error => error )
    }
    
    /*
     * Method to change recipe information for existing recipe
     */
    changeRecipeInfo( idx: number, name: string, ingredients: Ingredient[], instructions: string[], estTime: number )
    {
        let rcp = new Recipe( name, ingredients, instructions, estTime )
        
        this.http.post( this.srvURL + '/changerecipe/' + idx, rcp )
                 .toPromise()
                 .catch( error => error )
                 .then( result => 
                 {
                    this.recipes = result.map( (val) => new Recipe( val.name, val.ingredients, val.instructions, val.estimatedTime ) )
                 } )
    }
    
    findRecipe( rcpName: string ): number
    {
        if ( rcpName.trim()  == '' )
            return -1
        
        for ( let i = 0; i < this.recipes.length; i++ )
            if ( this.recipes[i].name == rcpName )
                return i
        
        return -1
    }
    
    /*
     * Method to find item specified by name in fridge content
     */
    findItem( itmName: string ): number
    {
        for ( let i = 0; i < this.contents.length; i++ )
            if ( this.contents[i].name == itmName )
                return i
        
        return -1
    }
    
    /*
     * Method to get shopping list for recipe specified by index
     */
    shoppingList( rcpIdx: number ): Item[]
    {
        let ingr: Ingredient
        let idx: number
        let qtyShort: number
        
        let recipe = this.recipes[rcpIdx]
        let shpList = new Array<Item>()
        let inFridge = new Array<Item>()
        
        for ( let i = 0; i < recipe.ingredients.length; i++ )
        {
            ingr = recipe.ingredients[i]
            idx = this.findItem( ingr.name )
            
            if ( idx < 0 )
                shpList.push( ingr )
            else 
            {
                let qtyIn = Math.min( this.contents[idx].quantity, ingr.quantity )
                inFridge.push( new Ingredient( ingr.name, qtyIn ) )
                
                if ( ingr.quantity > this.contents[idx].quantity )
                {
                    qtyShort = ingr.quantity - this.contents[idx].quantity
                    shpList.push( new Ingredient( ingr.name, qtyShort ) )
                }
            }
        }
        
        if ( shpList.length == 0 )
        {
            shpList.push( new Ingredient( "Ingredients for recipe " , recipe.ingredients.length ) )
            shpList.push( new Ingredient( "Ingredients in fridge " , inFridge.length ) )
        }
          
        return shpList 
    }
    
    /*
     * Method to retrieve all data from Http Server
     */
    retrieveData()
    {
        this.getAllRecipes().then( result => this.recipes = result.body )
                            .catch( error => error )
        
        this.getFridgeContent().then( result => this.contents = result.body )
                               .catch( error => error )
    }
    
    /*
     * Method for get request to retrieve all recipes
     */
    getAllRecipes(): Promise<any>
    {
        return this.httpGetRequest( this.srvURL + '/retieverecipes' )
    }
    
    /*
     * Method for get request to obtain list of recipes
     */
    getRecipeList(): Promise<any>
    {
        return this.httpGetRequest( this.srvURL + '/recipelist' )
    }
    
    /*
     * Method for get request to delete recipe specified by index
     */
    delRecipe( idx: number ): Promise<any>
    {
        return this.httpGetRequest( this.srvURL + '/deleterecipe/' + idx )
    }
    
    /*
     * Method for get request to obtain fridge content
     */
    getFridgeContent(): Promise<any>
    {
        return this.httpGetRequest( this.srvURL + '/fridgecontent' )
    }
    
    addItemQtyRequest( idx: number, qty: number ): Promise<any>
    {
        return this.httpGetRequest( this.srvURL + '/additemqty/' + idx + '/' + qty )
    }
    
    removeItemQtyRequest( idx: number, qty: number ): Promise<any>
    {
        return this.httpGetRequest( this.srvURL + '/removeitemqty/' + idx + '/' + qty )
    }
    
    deleteItemRequest( idx: number ): Promise<any>
    {
        return this.httpGetRequest( this.srvURL + '/deleteitem/' + idx  )
    }
    
    /*
     * Method for performing GET request to Http Server
     */
    private httpGetRequest( url: string ): Promise<any>
    {
        return this.http.request( new HttpRequest( 'GET', url ) )
                        .toPromise()
                        .catch( error => error )
                        .then( result => result )
    }
    
    /*
     * Method for performing POST request to Http Server
     */
    private httpPostRequest( url: string, obj: any, func: any ): Promise<any>
    {
        return this.http.post( url, obj )
                        .toPromise()
                        .catch( error => error )
                        .then( result => func( result ) )
    }
}