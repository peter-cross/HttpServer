/** Program Name : Lab Project
 ** Name : Peter Cross
 ** Date : July 5, 2018
 ** Lab : 7
 ** Course : CPSC2261
 */

import { Item, Ingredient, Recipe } from "./app/core/core.component";
import { MongoInterface } from "./mongointerface"

import * as request from "request"
import * as express from "express"
import * as cors from "cors"
import * as bodyParser from "body-parser"

const corsOptions = 
{
    origin: '*',
    optionsSuccessStatus: 200    
}
            
// Array of fridge items
let contents = new Array<Item>()

// Array of recipes
let recipes = new Array<any>()

// Object to access Mongo DB
let mongo = new MongoInterface()
      
/*
 * Class for Http Mongo Server
 */
export class HttpMongoServer
{
    private path = '/'
    private port = 3000
    private app: any
    
    /*
     * Class constructor
     */
    constructor()
    {
        this.app = express()
        this.app.use( cors( corsOptions ) )
        this.app.use( bodyParser.json() )
        
        this.startServer()
        
        let srvURL = 'http://localhost:' + this.port + this.path
        
        request.get( srvURL, ( err, resp, body ) => console.log( body + '\n\nHttp Server started ... ' ) )
    }  
    
    /*
     * Method specifies which methods will be invoked for different requests with different routes
     * Gets invoked when server starts
     */
    startServer()
    {
        this.app.get( this.path, this.callBack )
        
        this.app.get( '/recipelist', this.recipeList )
        this.app.get( '/retrieverecipe/:recipeIdx', this.retrieveRecipe )
        this.app.get( '/retrieverecipes/:recipeArray', this.retrieveRecipes )
        this.app.get( '/retrieverecipes', this.retrieveAllRecipes )
        this.app.get( '/deleterecipe/:recipeIdx', this.deleteRecipe )
        this.app.post( '/addrecipe', this.addRecipe )
        this.app.post( '/updaterecipe/:recipeIdx', this.updateRecipe )
        
        this.app.get( '/fridgecontent', this.fridgeContent )
        this.app.get( '/additemqty/:itemIdx/:qty', this.addItemQty )
        this.app.get( '/removeitemqty/:itemIdx/:qty', this.removeItemQty )
        this.app.get( '/deleteitem/:itemIdx', this.deleteItem )
        this.app.post( '/additem', this.addItem )
        
        this.initMongo() 
    }
    
    /*
     * Initializes interface to access Mongo DB
     */
    initMongo()
    {
        // Initialize fridge items
        mongo.initItems()
             .then( result =>
              {
                 mongo.displayArrayOfItems( result )
                 
                 result.find( {} )
                       .toArray( ( err, arr ) => contents = !err ? arr : contents )
              } )
             .catch( error => console.log( 'Could not initialize Items Collection of Mongo DB \n' + error ) )
             
        // Initialize recipes
        mongo.initRecipes()
             .then( result =>
              {
                 mongo.displayArrayOfRecipes( result )
                 
                 result.find( {} )
                       .toArray( ( err, arr ) => recipes = !err ? arr : recipes )
                 
                 this.app.listen( this.port )
              } )
             .catch( error => console.log( 'Could not initialize Recipes Collection of Mongo DB \n' + error ) )
    }
    
    /*
     * Method for server response for home page
     */
    callBack( request: any, response: any )
    {
        response.send( '!!! << Hello World >> !!!' ) 
    }
    
    /*
     * Method for server response on request to get fridge content
     */
    fridgeContent( request: any, response: any )
    {
        response.header( "Content-Type", "application/json" )
        response.json( contents )
    }
    
    /*
     * Method for server response on request to add item
     */
    addItem( request: any, response: any )
    {
        response.header( "Content-Type", "application/json" )
        
        try
        {
            let itm = Item.clone( request.body )
            
            console.log( '\nInserting New Item:' )
            console.log( itm )
            
            mongo.insertItem( itm )
                 .then( result => 
                  {
                     console.log( 'New Item added successfully\n' )
                     
                     contents.push( itm )
                     response.send( contents )
                  } )
                 .catch( error => console.log( error ) )
        }
        catch ( e )
        {
            console.log( e )
            response.json( false )
        }
    }
    
    /*
     * Method for server response on request to add quantity for item specified by contents index
     */
    addItemQty( request: any, response: any )
    {
        response.header( "Content-Type", "application/json" )
        
        try
        {
            let idx = request.params.itemIdx
            let qty = Number( request.params.qty )
            let cntQty = Number( contents[idx].quantity )
        
            let itm = contents[idx]
            let newOne = new Item( itm.name, (cntQty + qty) )
            
            console.log( '\nUpdating Item:' )
            console.log( itm )
            
            mongo.updateItem( { _id: (<any>itm)._id }, newOne )
                 .then( result => 
                  {
                     console.log( 'Item updated successfully\n' )
                     
                     contents[idx] = newOne
                     response.json( contents[idx].quantity )
                  } )
                 .catch( error => console.log( error ) )
        }
        catch ( e )
        {
            response.json( false )
        }
    }
    
    /*
     * Method for server response on request to remove quantity of item specified by contents index
     */
    removeItemQty( request: any, response: any )
    {
        response.header( "Content-Type", "application/json" )
        
        try
        {
            let idx = request.params.itemIdx
            let qty = Number( request.params.qty )
            let cntQty = Number( contents[idx].quantity )
        
            let itm = contents[idx]
            let newOne = new Item( itm.name, (cntQty - qty) )
            
            console.log( '\nUpdating Item:' )
            console.log( itm )
            
            mongo.updateItem( { _id: (<any>itm)._id }, newOne )
                 .then( result => 
                  {
                     console.log( 'Item updated successfully\n' )
                     
                     contents[idx] = newOne
                     response.json( contents[idx].quantity )
                  } )
                 .catch( error => console.log( error ) )
        }
        catch ( e )
        {
            response.json( false )
        }
    }
    
    /*
     * Method for server response on request to delete item specified by content index
     */
    deleteItem( request: any, response: any )
    {
        response.header( "Content-Type", "application/json" )
        
        try
        {
            let idx = request.params.itemIdx
            let itm = contents[idx]
            
            console.log( '\Deleting Item:' )
            console.log( itm )
            
            mongo.removeItem( { _id: (<any>itm)._id } )
                 .then( result => 
                  {
                     console.log( 'Item deleted successfully\n' )
                     
                     contents.splice( idx, 1 )
                     response.json( contents )
                  } )
                 .catch( error => console.log( error ) )
        }
        catch ( e )
        {
            response.json( false )
        }
    }
    
    /*
     * Method for server response on request to get recipe list
     */
    recipeList( request: any, response: any )
    {
        let list = new Array<string>()
        
        for( let rcp of recipes )
            list.push( rcp.name )
        
        response.header( "Content-Type", "application/json" )
        response.json( list ) 
    }  
    
    /*
     * Method for server response on request to retrieve a recipe by recipe index
     */
    retrieveRecipe( request: any, response: any )
    {
        let idx = request.params.recipeIdx
        
        response.header( "Content-Type", "application/json" )
        response.json( recipes[idx] ) 
    }
    
    /*
     * Method for server response on request to retrieve recipe specified as array of recipe indexes
     */
    retrieveRecipes( request: any, response: any )
    {
        let idxArray = eval( request.params.recipeArray )
        let resArray: Recipe[] = []
        
        for ( let i = 0; i < idxArray.length; i++ )
            resArray.push( recipes[ idxArray[i] ] )
        
        response.header( "Content-Type", "application/json" )
        response.json( resArray )
    }
    
    /*
     * Method for server response on request to retrieve all recipes
     */
    retrieveAllRecipes( request: any, response: any )
    {
        response.header( "Content-Type", "application/json" )
        response.json( recipes )
    }
    
    /*
     * Method for server response on request to delete recipe specified by recipe index
     */
    deleteRecipe( request: any, response: any )
    {
        response.header( "Content-Type", "application/json" )
        
        try
        {
            let idx = request.params.recipeIdx
            let rcp = recipes[idx]
            
            console.log( '\Deleting Recipe:' )
            console.log( rcp )
            
            mongo.removeRecipe( { _id: (<any>rcp)._id } )
                 .then( result => 
                  {
                     console.log( 'Recipe deleted successfully\n' )
                     
                     recipes.splice( idx, 1 )
                     response.json( recipes )
                  } )
                 .catch( error => console.log( error ) )
        }
        catch ( e )
        {
            response.json( false )
        }
    }
    
    /*
     * Method for server response on request to add recipe
     */
    addRecipe( request: any, response: any )
    {
        response.header( "Content-Type", "application/json" )
        
        try
        {
            let rcp = <Recipe>request.body
            
            console.log( '\nInserting New Recipe:' )
            console.log( rcp )
            
            mongo.insertRecipe( rcp )
                 .then( result => 
                  {
                     console.log( 'New Recipe added successfully\n' )
                     
                     recipes.push( rcp )
                     response.send( recipes )
                  } )
                 .catch( error => console.log( error ) )
        }
        catch ( e )
        {
            console.log( e )
            response.json( false )
        }
    }
    
    /*
     * Method for server response on request to update recipe
     */
    updateRecipe( request: any, response: any )
    {
        response.header( "Content-Type", "application/json" )
        
        try
        {
            let idx = request.params.recipeIdx
            let rcp = recipes[idx]
            let newOne = <Recipe>request.body
            
            console.log( '\nUpdating Recipe:' )
            console.log( rcp )
            
            mongo.updateRecipe( { _id: (<any>rcp)._id }, newOne )
                 .then( result => 
                  {
                     console.log( 'Recipe updated successfully\n' )
                     
                     recipes[idx] = newOne
                     response.send( recipes )
                  } )
                 .catch( error => console.log( error ) )
        }
        catch ( e )
        {
            response.json( false )
        }
    }
}

// Start Http Mongo Server
new HttpMongoServer()