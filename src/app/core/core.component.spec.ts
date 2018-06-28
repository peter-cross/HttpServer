/** Program Name : Lab Project
 ** Name and ID : Peter Cross
 ** Date : June 28, 2018
 ** Lab : 6
 ** Course : CPSC2261
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreComponent } from './core.component';
import { Item, Ingredient , Recipe, Fridge } from "./core.component";

describe( 'CoreComponent', () => 
{
  let component: CoreComponent;
  let fixture: ComponentFixture<CoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    it('should create CoreComponent', () => {
        expect(component).toBeTruthy();
    } );
    
    classItemTest()
    classIngredientTest()
    classRecipeTest()
    classFridgeTest() 
} );

function classItemTest()
{
    let itmName = 'Item name'
    let itmQty = 5

    let itmObj = new Item( itmName, itmQty )

    it( 'creates Item object', async(() => 
    {
        expect( itmObj ).not.toBe( null )
    }) );

    it( 'initializes Item name', async(() => 
    {
        expect( itmObj.name ).toBe( itmName )
    }) );

    it( 'initializes Item quantity', async(() => 
    {
        expect( itmObj.quantity ).toBe( itmQty )
    }) ); 
}
       
function classIngredientTest()
{
    let ingrName = 'Ingredient name'
    let ingrQty = 5
     
    let ingrObj = new Ingredient( ingrName, ingrQty )
    
    it( 'creates Ingredient object', () => 
    {
        expect( ingrObj ).not.toBe( null )
    } );
    
    let addQty = 20
    let subtQty = 15
    
    it( 'adds Ingredient quantity ' + addQty, () => 
    {
        ingrObj.add( addQty )
        
        expect( ingrObj.quantity ).toBe( ingrQty + addQty )
    
    } );
    
    it( 'subtracts Ingredient quantity ' + subtQty, () => 
    {
        ingrObj.subtract( subtQty )
        
        expect( ingrObj.quantity ).toBe( ingrQty + addQty - subtQty )
    } );
}
    
function classRecipeTest()
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
    } );
       
    it( 'verifies that ingredients are stored correctly in Recipe object', () => 
    {
        for ( var i = 0; i < ingredients.length; i++ )
        {
            let ingr = rcpObj.ingredients[i]
            
            expect( ingr ).toBe( ingredients[i] )
            expect( ingr.name ).toBe( ingredients[i].name )
            expect( ingr.quantity ).toBe( ingredients[i].quantity )
        }
    } );
    
    it( 'verifies that instructions are stored correctly in Recipe object', () => 
    {
        for ( var i = 0; i < instructions.length; i++ )
        {
            let instr = rcpObj.instructions[i]
            
            expect( instr ).toBe( instructions[i] )
        }
    } );
    
    it( 'verifies that estimted time is stored correctly in Recipe object', () => 
    {
        let estTime = rcpObj.estimatedTime
        
        expect( estTime ).toBe( estimatedTime )
    } );
    
    it( 'adds item to recipe ', () => 
    {
        let newIngr = new Ingredient( 'New ingredient', 50 )
        
        rcpObj.addItem( newIngr )
        
        let addedItem = rcpObj.ingredients[ rcpObj.ingredients.length-1 ]
        
        expect( addedItem ).toBe( newIngr )
    } );
    
    it( 'adds instruction to recipe ', () => 
    {
        let newInstr = 'New instruction'
        
        rcpObj.addInstruction( newInstr )
        
        let addedInstr = rcpObj.instructions[ rcpObj.instructions.length-1 ]
        
        expect( addedInstr ).toBe( newInstr )
    } );
}
    
function classFridgeTest()
{
    let itmName = [ 'Item 1', 'Item 2', 'Item 3', 'Item 4' ]
    let itmQty = [ 10, 20, 30, 40 ]
    
    let itm1 = new Item( itmName[0], itmQty[0] )
    let itm2 = new Item( itmName[1], itmQty[1] )
    let itm3 = new Item( itmName[2], itmQty[2] )
    let itm4 = new Item( itmName[3], itmQty[3] )
    
    let itms = [ itm1, itm2, itm3, itm4 ]
    
    let frgObj = new Fridge( itms )
    
    it( 'creates Fridge object', async( () => 
    {
        expect( frgObj ).not.toBe( null )
    } ) );
    
    it( 'verifies that Fridge content is created properly', async( () => 
    {
        for ( var i = 0; i < itms.length; i++ )
        {
            let itm = itms[i]
            let frgItm = frgObj.contents[i]
            
            expect( frgItm ).toBe( itm )
            expect( frgItm.name ).toBe( itm.name )
            expect( frgItm.quantity ).toBe( itm.quantity )
        }
    } ) );
    
    let toAddQty = 5
    
    it( 'adds quantity of Item to the Fridge', async( () => 
    {
        for ( var i = 0; i < itms.length; i++ )
        {
            let itm = itms[i]
            let frgItm = frgObj.contents[i]
            
            frgObj.add( itm.name, toAddQty )
            
            expect( frgItm.quantity ).toBe( itmQty[i] + toAddQty )
        }
    } ) );
    
    
    let toRmvQty = 3
    
    it( 'removes quantity of Item from the Fridge', async( () => 
    {
        for ( var i = 0; i < itms.length; i++ )
        {
            let itm = itms[i]
            let frgItm = frgObj.contents[i]
            
            frgObj.remove( itm.name, toRmvQty )
            
            expect( frgItm.quantity ).toBe( itmQty[i] + toAddQty - toRmvQty )
        }
    } ) );
    
    let ingrName = [ 'Item 1', 'Item 2', 'Item 3', 'Item 4' ]
    let ingrQty = [ 5, 10, 15, 20 ]
    
    let ingr1 = new Ingredient( ingrName[0], ingrQty[0] )
    let ingr2 = new Ingredient( ingrName[1], ingrQty[1] )
    let ingr3 = new Ingredient( ingrName[2], ingrQty[2] )
    let ingr4 = new Ingredient( ingrName[3], ingrQty[3] )
    
    let ingrs = [ ingr1, ingr2, ingr3, ingr4 ]
    let instrs = [ 'Instruction 1', 'Instruction 2', 'Instruction 3' ]
    let time = 20
    
    let recipe = new Recipe( "Recipe 2", ingrs, instrs, time )
    
    it( 'checks Recipe for fridge ingredients', async( () => 
    {
        expect( recipe ).not.toBe( null )
    } ) );
    
    let items = frgObj.checkRecipe( recipe )
    
    it( 'checks lists for Recipe are created', async( () => 
    {
        expect( items ).not.toBe( null )
    } ) );
    
    it( 'checks Shopping list for Recipe is created', async( () => 
    {
        expect( items.shoppingList ).not.toBe( null )
        expect( items.shoppingList.length ).toBeGreaterThanOrEqual( 0 )
    } ) );
    
    it( 'checks in Fridge List for Recipe is created', async( () => 
    {
        expect( items.inFridge ).not.toBe( null )
        expect( items.inFridge.length ).toBeGreaterThan( 0 )
    } ) );
}