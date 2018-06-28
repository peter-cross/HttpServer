/** Program Name : Lab Project
 ** Name : Peter Cross
 ** Date : June 28, 2018
 ** Lab : 6
 ** Course : CPSC2261
 */

import { Item, Ingredient, Recipe } from "./app/core/core.component";

import * as request from "request"
import * as express from "express"
import * as cors from "cors"

const corsOptions = 
{
    origin: '*',
    optionsSuccessStatus: 200    
}

const path = '/'
const port = 4000
const host = 'http://localhost'

const app = express()
app.use( cors( corsOptions ) )

app.get( path, function( request, response )
{
    response.send( '!!! << Http Server Testing >> !!!' ) 
} )

app.listen( port )

/*
 * Class for testing Http Server from server side
 */
class HttpServerTest
{
    constructor()
    {
        let url = host + ':' + port + path
        
        request.get( url, ( err, resp, body ) => console.log( body + '\nStarted in Http Server mode on port ' + port + ' ... ' ) )
    
        try
        {
            describe( 'HttpServerTest', () => 
            {
                it( 'should create HttpServerTest', () => 
                {
                    expect( this ).toBeTruthy();
                } )
                
                this.classItemTest()
                this.classIngredientTest()
                this.classRecipeTest()
            } )
        }
        catch ( e )
        {
            console.log( 'Can not run jasmine methods in httpserver mode' ) 
        }
    }    
        
    /*
     * Method for testing methods of class Item
     */
    classItemTest()
    {
        let itmName = 'Item name'
        let itmQty = 5
    
        let itmObj = new Item( itmName, itmQty )
    
        it( 'creates Item object', () => 
        {
            expect( itmObj ).not.toBe( null )
        } )
    
        it( 'initializes Item name', () => 
        {
            expect( itmObj.name ).toBe( itmName )
        } )
    
        it( 'initializes Item quantity', () => 
        {
            expect( itmObj.quantity ).toBe( itmQty )
        } )
    }
    
    /*
     * Method for testing methods of class Ingredient
     */
    classIngredientTest()
    {
        let ingrName = 'Ingredient name'
        let ingrQty = 5
         
        let ingrObj = new Ingredient( ingrName, ingrQty )
        
        it( 'creates Ingredient object', () => 
        {
            expect( ingrObj ).not.toBe( null )
        } )
        
        let addQty = 20
        let subtQty = 15
        
        it( 'adds Ingredient quantity ' + addQty, () => 
        {
            ingrObj.add( addQty )
            
            expect( ingrObj.quantity ).toBe( ingrQty + addQty )
        
        } )
        
        it( 'subtracts Ingredient quantity ' + subtQty, () => 
        {
            ingrObj.subtract( subtQty )
            
            expect( ingrObj.quantity ).toBe( ingrQty + addQty - subtQty )
        } )
    }
    
    /*
     * Method for testing methods of class Recipe
     */
    classRecipeTest()
    {
        let ingr1 = new Ingredient( 'Ingredient 1', 10 )
        let ingr2 = new Ingredient( 'Ingredient 2', 20 )
        let ingr3 = new Ingredient( 'Ingredient 3', 30 )
        
        let ingredients = [ ingr1, ingr2, ingr3 ]
        
        let instr1 = 'Instruction 1'
        let instr2 = 'Instruction 2'
        let instr3 = 'Instruction 3'
        
        let instructions = [ instr1, instr2, instr3 ]
        
        let estimatedTime = 30
        
        let rcpObj = new Recipe( "Recipe 1", ingredients, instructions, estimatedTime )
        
        it( 'creates Recipe object', () => 
        {
            expect( rcpObj ).not.toBe( null )
        } )
           
        it( 'verifies that ingredients are stored correctly in Recipe object', () => 
        {
            for ( let i = 0; i < ingredients.length; i++ )
            {
                let ingr = rcpObj.ingredients[i]
                
                expect( ingr ).toBe( ingredients[i] )
                expect( ingr.name ).toBe( ingredients[i].name )
                expect( ingr.quantity ).toBe( ingredients[i].quantity )
            }
        } )
        
        it( 'verifies that instructions are stored correctly in Recipe object', () => 
        {
            for ( let i = 0; i < instructions.length; i++ )
            {
                let instr = rcpObj.instructions[i]
                
                expect( instr ).toBe( instructions[i] )
            }
        } )
        
        it( 'verifies that estimted time is stored correctly in Recipe object', () => 
        {
            let estTime = rcpObj.estimatedTime
            
            expect( estTime ).toBe( estimatedTime )
        } )
        
        it( 'adds item to recipe ', () => 
        {
            let newIngr = new Ingredient( 'New ingredient', 50 )
            
            rcpObj.addItem( newIngr )
            
            let addedItem = rcpObj.ingredients[ rcpObj.ingredients.length-1 ]
            
            expect( addedItem ).toBe( newIngr )
        } )
        
        it( 'adds instruction to recipe ', () => 
        {
            let newInstr = 'New instruction'
            
            rcpObj.addInstruction( newInstr )
            
            let addedInstr = rcpObj.instructions[ rcpObj.instructions.length-1 ]
            
            expect( addedInstr ).toBe( newInstr )
        } )
    }
}

// Instantiate class to start testing
new HttpServerTest()
