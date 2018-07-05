/** Program Name : Lab Project
 ** Name : Peter Cross
 ** Date : July 5, 2018
 ** Lab : 7
 ** Course : CPSC2261
 */

import { Item, Ingredient, Recipe } from "./app/core/core.component";

import * as mongoDb from "mongodb"
import * as assert from "assert"

const mongoClient = mongoDb.MongoClient

const mongoUrl = 'mongodb://localhost:27017'
const options = { useNewUrlParser: true }
const dbName = 'angularfridge'

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
     * Initializes Items collection in DB
     */
    initItems(): Promise<any>
    {
        let itemsCollection = this.getItemsCollection()
        
        // Uncomment if you need to reset Items Collection to initial example
        //this.deleteAllCollection( itemsCollection )
        
        itemsCollection
            .then( result => 
                result.find( {} )
                      .toArray( ( err, arr ) => 
                       {
                          if ( err )
                             return
                             
                          if ( arr.length == 0 )
                            this.insertExampleItems()   
                       } ) )
        
        return itemsCollection   
    }
    
    /*
     * Initializes Recipes collection in DB
     */
    initRecipes(): Promise<any>
    {
        let recipesCollection = this.getRecipesCollection()
        
        // Uncomment if you need to reset Recipes Collection to initial example
        //this.deleteAllCollection( recipesCollection )
        
        recipesCollection
            .then( result => 
                result.find( {} )
                      .toArray( ( err, arr ) => 
                       {
                          if ( err )
                             return
                             
                          if ( arr.length == 0 )
                            this.insertExampleRecipes()  
                       } ) )
        
        return recipesCollection   
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
    insertExampleItems()
    {
        let items = [ 'Item 1', 'Item 2', 'Item 3', 'Item 4' ]
        let qtys = [ 10, 20, 30, 40 ]
        
        let itemsArr = new Array<Item>()
        
        for ( let i = 0; i < items.length; i++ )
            itemsArr.push( new Item( items[i], qtys[i] ) )
            
        this.insertItems( itemsArr )
    }
    
    /*
     * Inserts example recipes to Recipes collection
     */
    insertExampleRecipes()
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
        
        this.insertRecipes( recipesArr )
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
            mongoClient.connect( mongoUrl, ( err, client ) => 
            {
                if ( err )
                {
                    console.log( 'Error connecting to Mongo DB' )
                    onError( err )
                }
                else
                {
                    console.log( 'Successfully connected to Mongo DB' )
                    onSuccess( client.db( dbName ) )
                }
            } ) )
    }
    
    /*
     * Inserts single item into Items collection
     */
    insertItem( item: any ): Promise<mongoDb.Collection>
    {
        let collection = this.getItemsCollection()
        
        return this.insertCollectionElement( item, collection )
    }
    
    /*
     * Removes single item from Items collection
     */
    removeItem( item: any ): Promise<mongoDb.Collection>
    {
        let collection = this.getItemsCollection()
        
        return this.deleteCollectionElement( item, collection )
    }
    
    /*
     * Updates single item in Items collection
     */
    updateItem( item: any, newOne: any ): Promise<mongoDb.Collection>
    {
        let collection = this.getItemsCollection()
        
        return this.updateCollectionElement( item, newOne, collection )
    }
    
    /*
     * Inserts single recipe into Recipes collection
     */
    insertRecipe( recipe: any ): Promise<mongoDb.Collection>
    {
        let collection = this.getRecipesCollection()
        
        return this.insertCollectionElement( recipe, collection )
    }
    
    /*
     * Removes single recipe from Recipes collection
     */
    removeRecipe( recipe: any ): Promise<mongoDb.Collection>
    {
        let collection = this.getRecipesCollection()
        
        return this.deleteCollectionElement( recipe, collection )
    }
    
    /*
     * Updates single recipe in Recipes collection
     */
    updateRecipe( recipe: any, newOne: any ): Promise<mongoDb.Collection>
    {
        let collection = this.getRecipesCollection()
        
        return this.updateCollectionElement( recipe, newOne, collection )
    }
    
    /*
     * Inserts array of items into Items collection
     */
    insertItems( items: Item[] ): Promise<mongoDb.Collection>
    {
        let collection = this.getItemsCollection()
        
        collection = this.insertCollectionElements( items, collection )
        
        collection.then( result => 
                result.find( {} )
                      .toArray( ( err, arr ) => 
                       {
                          if ( err )
                          {
                             console.log( 'Error adding new elements to collection of Items' + err )  
                             return
                          }
                             
                          console.log( '\nNew Array of Items:' )
                                
                          for ( let i = 0; i < arr.length; i++ )
                             console.log( 'Idx: \t' + i + '\t name: ' + arr[i].name  + '\t quantity: ' + arr[i].quantity )  
                       } ) )
        
        return collection
    }
    
    /*
     * Inserts array of recipes into Recipes collection
     */
    insertRecipes( recipes: Recipe[] ): Promise<mongoDb.Collection>
    {
        let collection = this.getRecipesCollection()
        
        collection = this.insertCollectionElements( recipes, collection )
        
        collection.then( result => 
                result.find( {} )
                      .toArray( ( err, arr ) => 
                       {
                          if ( err )
                          {
                             console.log( 'Error adding new elements to collection of Recipes' + err )  
                             return
                          }
                             
                          console.log( '\nNew Array of Recipes:' )
                                
                          for ( let i = 0; i < arr.length; i++ )
                             console.log( 'Idx: \t' + i + '\t name: ' + arr[i].name  + '\t Est.time: ' + arr[i].estimatedTime )  
                       } ) )
        
        return collection
    }
    
    /*
     * Inserts new element into collection
     */
    insertCollectionElement( element: any, collection: any ): Promise<mongoDb.Collection>
    {
        return collection.then( result => new Promise( ( onSuccess, onError ) => 
            result.insertOne( element, (err, result) => 
            {
                if ( err )
                {
                    console.log( 'Error inserting new collection element to Mongo DB' )
                    onError( err )
                }
                else
                    onSuccess( result )
            } ) ) )
            .then( result => 
            {
                console.log( 'Result of inserting new collection element: ' )
                console.log( result.ops )
            } )  
    }
    
    /*
     * Deletes specified by filter element from collection
     */
    deleteCollectionElement( element: any, collection: any ): Promise<mongoDb.Collection>
    {
        return collection.then( result => new Promise( ( onSuccess, onError ) => 
            result.deleteOne( element, (err, result) => 
            {
                if ( err )
                {
                    console.log( 'Error deleting collection element from Mongo DB' )
                    onError( err )
                }
                else
                    onSuccess( result )
            } ) ) )
            .then( result => 
            {
                console.log( 'Result of deleting collection element: ' )
                console.log( 'Deleted collection elements: ' + result.deletedCount )
            } )  
    }
    
    /*
     * Updates specified by filter element in collection
     */
    updateCollectionElement( element: any, newOne: any, collection: any ): Promise<mongoDb.Collection>
    {
        return collection.then( result => new Promise( ( onSuccess, onError ) => 
        {
            result.updateOne( element, { $set: newOne } )
                  .then( result => 
                   {
                        console.log( 'Result of updating collection element: ' )
                        console.log( 'Updated collection elemnts: ' + result.modifiedCount )
                        
                        if ( result.modifiedCount > 0 )
                            onSuccess( result )
                        else
                            onError( result )
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
                    console.log( 'Error deleting record from Mongo DB' )
                    onError( err )
                }
                else
                    onSuccess( result )
            } ) ) ) 
        
        return this.getAllCollectionArray( collection )
    }
    
    /*
     * Gets array of all collection elements
     */
    getAllCollectionArray( collection: any ): Promise<mongoDb.Collection>
    {
        return  collection.then( result => new Promise( ( onSuccess, onError ) =>
                    result.find( {} ) // Retrieve all collection elements
                          .toArray( (err, array) => 
                           {
                                if ( err )
                                {
                                    console.log( 'Error retrieving collection from Mongo DB' )
                                    onError( err )
                                }
                                else
                                    onSuccess( array )
                            } ) ) )
    }
}