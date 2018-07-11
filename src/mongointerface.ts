/** Program Name : Lab Project
 ** Name : Peter Cross
 ** Date : July 11, 2018
 ** Lab : 7
 ** Course : CPSC2261
 */

import { Item, Ingredient, Recipe } from "./app/core/core.component";
import * as mongoDb from "mongodb"

const MONGO_URL = 'mongodb://localhost:27017'
const DB_NAME = 'angularfridge'
const OPTIONS = { useNewUrlParser: true }

// Mongo Client object
let mongoClient = mongoDb.MongoClient

// Array of fridge items
let contents = new Array<Item>()

// Array of recipes
let recipes = new Array<any>()

/*
 * Class for interface methods to Mongo DB
 */
export class MongoInterface
{
    // Mongo database object
    private db: Promise<mongoDb.Db>
    
    // Collections in Mongo DB
    private mongoCollections = new Object()
        
    /*
     * Initializes interface to access Mongo DB
     */
    initMongo()
    {
        // Initialize fridge items
        // Set 2nd argument to true if you need to reset collection of Items
        this.initItems( this.displayArrayOfItems, true )
            .catch( error => console.log( 'Could not initialize Items Collection of Mongo DB \n' + error ) )
             
        // Initialize recipes
        // Set 2nd argument to true if you need to reset collection of Recipes
        this.initRecipes( this.displayArrayOfRecipes, true )
            .catch( error => console.log( 'Could not initialize Recipes Collection of Mongo DB \n' + error ) )
    }
    
    /*
     * Initializes Items collection in DB
     */
    initItems( displayCallback: any, reset: boolean = false ): Promise<any>
    {
        let itemsCollection = this.getItemsCollection()
        
        if ( reset )
            return this.deleteAllCollection( itemsCollection )
                       .then( result => 
                        {
                            result.find( {} )
                                  .toArray( ( err, arr ) => 
                                   {
                                        if ( err )
                                        {
                                            console.log( err )
                                            return
                                        }
                                     
                                        this.insertExampleItems( displayCallback )
                                        console.log( 'All Items collection deleted and added example items' )
                                   } )
                        } )
        else
            return  itemsCollection.then( result => 
                    {
                        result.find( {} )
                              .toArray( ( err, arr ) => 
                               {
                                    if ( err )
                                    {
                                        console.log( err )
                                        return
                                    }
                                  
                                    if ( arr.length == 0 )
                                        this.insertExampleItems( displayCallback ) 
                                    else
                                        displayCallback( result )  
                               } )
                    } )
    }
    
    /*
     * Initializes Recipes collection in DB
     */
    initRecipes( displayCallback: any, reset: boolean = false ): Promise<any>
    {
        let recipesCollection = this.getRecipesCollection()
        
        if ( reset )
            return this.deleteAllCollection( recipesCollection )
                       .then( result => 
                        {
                            result.find( {} )
                                  .toArray( ( err, arr ) => 
                                   {
                                        if ( err )
                                        {
                                            console.log( err )
                                            return
                                        }
                                     
                                        this.insertExampleRecipes( displayCallback )
                                        console.log( 'All Recipes collection deleted and added example recipes' )
                                   } )
                        } )
        else
            return  recipesCollection.then( result => 
                    {
                        result.find( {} )
                              .toArray( ( err, arr ) => 
                               {
                                    if ( err )
                                    {
                                        console.log( err )
                                        return
                                    }
                                     
                                    if ( arr.length == 0 )
                                        this.insertExampleRecipes( displayCallback )  
                                    else
                                        displayCallback( result )
                               } )
                    } )
    }
    
    /*
     * Displays in console array of Items
     */
    displayArrayOfItems( result: any )
    {
        result.find( {} )
              .toArray( ( err, arr ) => 
               {
                  if ( err )
                     return
                     
                  contents = arr
                  
                  console.log( '\nArray of Items:' )
                        
                  for ( let i = 0; i < arr.length; i++ )
                     console.log( 'Idx: \t' + i + '\t name: ' + arr[i].name  + '\t quantity: ' + arr[i].quantity )  
               } )
    }
    
    /*
     * Displays in console array of Recipes
     */
    displayArrayOfRecipes( result: any )
    {
        result.find( {} )
              .toArray( ( err, arr ) => 
               {
                  if ( err )
                     return
                     
                  recipes = arr
                                  
                  console.log( '\nArray of Recipes:' )
                        
                  for ( let i = 0; i < arr.length; i++ )
                     console.log( 'Idx: \t' + i + '\t name: ' + arr[i].name  + '\t Est.time: ' + arr[i].estimatedTime )  
               } )
    }
    
    /*
     * Gets Items collection from Mongo collections
     */
    getItemsCollection(): Promise<mongoDb.Collection>
    {
        return this.getMongoCollection( 'Items' )
    }
    
    /*
     * Gets Recipes collection from Mongo collections
     */
    getRecipesCollection(): Promise<mongoDb.Collection>
    {
        return this.getMongoCollection( 'Recipes' )
    }
    
    /*
     * Inserts example items to Items collection
     */
    insertExampleItems( callback?: any )
    {
        let items = [ 'Item 1', 'Item 2', 'Item 3', 'Item 4' ]
        let qtys = [ 10, 20, 30, 40 ]
        
        let itemsArr = new Array<Item>()
        
        for ( let i = 0; i < items.length; i++ )
            itemsArr.push( new Item( items[i], qtys[i] ) )
            
        this.insertItems( itemsArr, callback )
    }
    
    /*
     * Inserts example recipes to Recipes collection
     */
    insertExampleRecipes( callback?: any )
    {
        let ingrName = [ 'Item 1', 'Item 2', 'Item 3', 'Item 4' ]
        let ingrQty = [ 11, 22, 33, 44 ]
        
        let ingr1 = new Ingredient( ingrName[0], ingrQty[0] )
        let ingr2 = new Ingredient( ingrName[1], ingrQty[1] )
        let ingr3 = new Ingredient( ingrName[2], ingrQty[2] )
        let ingr4 = new Ingredient( ingrName[3], ingrQty[3] )
        
        let ingrs1 = [ ingr1, ingr2, ingr3, ingr4 ]
        let instrs1 = [ 'Instruction 1', 'Instruction 2', 'Instruction 3' ]
        let time1 = 20
        let recipe1 = new Recipe( "Recipe 1", ingrs1, instrs1, time1 )
        
        let ingrs2 = [ ingr2, ingr1, ingr3, ingr4 ]
        let instrs2 = [ 'Instruction 2', 'Instruction 1', 'Instruction 3' ]
        let time2 = 30
        let recipe2 = new Recipe( "Recipe 2", ingrs2, instrs2, time2 )
        
        let ingrs3 = [ ingr3, ingr1, ingr2, ingr4 ]
        let instrs3 = [ 'Instruction 3', 'Instruction 1', 'Instruction 2' ]
        let time3 = 40
        let recipe3 = new Recipe( "Recipe 3", ingrs3, instrs3, time3 )
        
        let recipesArr = [ recipe1, recipe2, recipe3 ]
        
        this.insertRecipes( recipesArr, callback )
    }
    
    /*
     * Gets Mongo collection specified by name
     */
    getMongoCollection( name: string ): Promise<mongoDb.Collection>
    {
        let promise = this.mongoCollections[name]
        
        if ( promise )
            return promise
        
        return promise = new Promise<mongoDb.Collection>( ( onSuccess, onError ) => 
            this.connectToDB()
                .then( result => 
                 {
                    let mongoCollection = result.collection( name )
                    onSuccess( mongoCollection )
                 } )
                .catch( error => 
                 {
                    console.log( 'Error connecting to MongoDB \n' + error )
                    onError( error )
                 } ) )
    }
    
    /*
     * Connects to Mongo DB
     */
    connectToDB(): Promise<mongoDb.Db>
    {
        if ( this.db )
            return this.db
        
        return this.db = new Promise<mongoDb.Db>( ( onSuccess, onError ) => 
            mongoClient.connect( MONGO_URL, OPTIONS, ( err, client ) => 
            {
                if ( err )
                {
                    console.log( 'Error connecting to Mongo DB' )
                    onError( err )
                }
                else
                {
                    console.log( 'Successfully connected to Mongo DB' )
                    onSuccess( client.db( DB_NAME ) )
                }
            } ) )
    }
    
    /*
     * Inserts single item into Items collection
     */
    addItem( itm: any, response: any )
    {
        console.log( '\nAdding New Item:' )
        console.log( itm.name )
        
        let collection = this.getItemsCollection()
        
        let callback = array => response.send( contents = array )
        
        this.insertCollectionElement( itm, collection, callback )
            .then( ok => console.log( 'New Item added successfully\n' ) )
            .catch( error => console.log( error ) )
    }
    
    /*
     * Removes single item from Items collection
     */
    deleteItem( idx: number, response: any )
    {
        let itm = <any>contents[idx]
            
        console.log( '\nDeleting Item:' )
        console.log( itm.name )
        
        let collection = this.getItemsCollection()
        
        let callback = array => response.json( contents = array )
        
        this.deleteCollectionElement( { _id: itm._id }, collection, callback )
            .then( ok => console.log( 'Item deleted successfully\n' ) )
            .catch( error => console.log( error ) )
    }
    
    /*
     * Updates single item quantity in Items collection
     */
    updateItemQty( idx: number, newQty: number, response: any )
    {
        let itm = <any>contents[idx]
        let newOne = new Item( itm.name, newQty )
        
        console.log( '\nUpdating Item quantity:' )
        console.log( itm.name )
        
        let collection = this.getItemsCollection()
        
        let callback = array => 
        {
            contents = array
            response.json( contents[idx].quantity )
        }
        
        this.updateCollectionElement( { _id: itm._id }, newOne, collection, callback )
            .then( ok => console.log( 'Item quantity updated successfully\n' ) )
            .catch( error => console.log( error ) )
    }
    
    /*
     * Inserts single recipe into Recipes collection
     */
    addRecipe( rcp: any, response: any )
    {
        console.log( '\nAdding New Recipe:' )
        console.log( rcp.name )
        
        let collection = this.getRecipesCollection()
        
        let callback = array => response.send( recipes = array )
        
        this.insertCollectionElement( rcp, collection, callback )
            .then( ok => console.log( 'New Recipe added successfully\n' ) )
            .catch( error => console.log( error ) )
    }
    
    /*
     * Removes single recipe from Recipes collection
     */
    deleteRecipe( idx: number, response: any )
    {
        let rcp = <any>recipes[idx]
            
        console.log( '\nDeleting Recipe:' )
        console.log( rcp.name )
        
        let collection = this.getRecipesCollection()
        
        let callback = array => response.json( recipes = array )
        
        this.deleteCollectionElement( { _id: rcp._id }, collection, callback )
            .then( ok => console.log( 'Recipe deleted successfully\n' ) )
            .catch( error => console.log( error ) )    
    }
    
    /*
     * Updates single recipe in Recipes collection
     */
    updateRecipe( idx: number, newOne: any, response: any )
    {
        let rcp = <any>recipes[idx]
        console.log( '\nUpdating Recipe:' )
        console.log( rcp.name )
        
        let collection = this.getRecipesCollection()
        
        let callback = array => response.send( recipes = array )
        
        this.updateCollectionElement( { _id: rcp._id }, newOne, collection, callback )
            .then( ok => console.log( 'Recipe updated successfully\n' ) )
            .catch( error => console.log( error ) )
    }
    
    /*
     * Inserts array of items into Items collection
     */
    insertItems( items: Item[], callback?: any ): Promise<mongoDb.Collection>
    {
        let collection = this.getItemsCollection()
        
        return this.insertCollectionElements( items, collection )
                   .then( result => 
                        result.find( {} )
                              .toArray( ( err, arr ) => 
                               {
                                  if ( err )
                                  {
                                     console.log( 'Error adding new elements to collection of Items' + err )  
                                     return
                                  }
                                     
                                  callback( result )
                               } ) )
    }
    
    /*
     * Inserts array of recipes into Recipes collection
     */
    insertRecipes( recipesArray: Recipe[], callback ): Promise<mongoDb.Collection>
    {
        let collection = this.getRecipesCollection()
        
        return this.insertCollectionElements( recipesArray, collection )
                   .then( result => 
                        result.find( {} )
                              .toArray( ( err, arr ) => 
                               {
                                  if ( err )
                                  {
                                     console.log( 'Error adding new elements to collection of Recipes' + err )  
                                     return
                                  }
                                     
                                  callback( result )
                               } ) )
    }
    
    /*
     * Inserts new element into collection
     */
    insertCollectionElement( element: any, collection: any, callback: any ): Promise<mongoDb.Collection>
    {
        return collection.then( result => new Promise( ( onSuccess, onError ) => 
            result.insertOne( element, (err, result) => 
            {
                if ( err )
                {
                    console.log( '\nError inserting new collection element to Mongo DB' )
                    onError( err )
                }
                else
                    onSuccess( result )
            } ) ) )
            .then( result => 
             {
                console.log( '\nResult of inserting new collection element: ' )
                let elmt = <any>result.ops[0] 
                
                console.log( '_id: ' + elmt._id + '\t name: \'' + elmt.name + '\'')
                
                this.getAllCollectionArray( collection, callback )
             } )  
    }
    
    /*
     * Deletes specified by filter element from collection
     */
    deleteCollectionElement( element: any, collection: any, callback: any ): Promise<mongoDb.Collection>
    {
        return collection.then( result => new Promise( ( onSuccess, onError ) => 
            result.deleteOne( element, (err, result) => 
            {
                if ( err )
                {
                    console.log( '\nError deleting collection element from Mongo DB' )
                    onError( err )
                }
                else
                    onSuccess( result )
            } ) ) )
            .then( result => 
             {
                console.log( '\nResult of deleting collection element: ' )
                console.log( 'Deleted collection elements: ' + result.deletedCount )
                
                this.getAllCollectionArray( collection, callback )
             } )  
    }
    
    /*
     * Updates specified by filter element in collection
     */
    updateCollectionElement( element: any, newOne: any, collection: any, callback: any ): Promise<mongoDb.Collection>
    {
        return collection.then( result => new Promise( ( onSuccess, onError ) => 
        {
            result.updateOne( element, { $set: newOne } )
                  .then( result => 
                   {
                        console.log( '\nResult of updating collection element: ' )
                        console.log( 'Updated collection elements: ' + result.modifiedCount )
                        
                        if ( result.modifiedCount > 0 )
                            onSuccess( result )
                        else
                            onError( result )
                      
                        this.getAllCollectionArray( collection, callback )
                   } )
                  .catch( error => onError( error ) )            
        } ) )
    }
    
    /*
     * Inserts array of elements into collection
     */
    insertCollectionElements( elements: any[], collection: any ): Promise<mongoDb.Collection>
    {
        collection.then( result => new Promise( ( onSuccess, onError ) => 
                                result.insertMany( elements, (err, result) => 
                                {
                                    if ( err )
                                    {
                                        console.log( 'Error adding records to Mongo DB' )
                                        onError( err )
                                    }
                                    else
                                        onSuccess( result )
                                } ) ) )   
        return collection
    }
    
    /*
     * Deletes all collection elements
     */
    deleteAllCollection( collection: any ): Promise<mongoDb.Collection>
    {
        collection.then( result => new Promise( ( onSuccess, onError ) => 
                            result.deleteMany( {}, (err, result) => 
                            {
                                if ( err )
                                {
                                    console.log( 'Error deleting records from Mongo DB' )
                                    onError( err )
                                }
                                else
                                    onSuccess( result )
                            } ) ) )
            
        return collection
    }
    
    /*
     * Gets array of all collection elements
     */
    getAllCollectionArray( collection: any, callback?: any ): Promise<mongoDb.Collection>
    {
        return collection.then( result => new Promise( ( onSuccess, onError ) =>
                    result.find( {} ) // Retrieve all collection elements
                          .toArray( (err, arr) => 
                           {
                                if ( err )
                                {
                                    console.log( 'Error retrieving collection from Mongo DB' )
                                    onError( err )
                                }
                                else
                                    onSuccess( arr )
                            } ) ) )
                           .then( array => callback ? callback( array ) : '' )
    }
    
    /*
     * Gets array of fridge contents
     */   
    getContents()
    {
        return contents
    }
        
    /*
     * Gets array of recipes
     */
    getRecipes()
    {
        return recipes
    }
}