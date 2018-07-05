/** Program Name : Lab Project
 ** Name and ID : Peter Cross
 ** Date : June 28, 2018
 ** Lab : 6
 ** Course : CPSC2261
 */

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})

export class CoreComponent implements OnInit 
{

  constructor() 
  { }

  ngOnInit() 
  { }

}

export class Item 
{
    name: string
    quantity: number
    
    constructor( nm: string, qty: number )
    {
        this.name = nm
        this.quantity = qty
    } 
      
    static clone( itm: any ): Item
    {
        return new Item( itm.name, Number(itm.quantity) )
    }
}

export class Ingredient extends Item
{
    constructor( nm: string, qty: number )
    {
        super(nm, qty)
    }
    
    add( qty: number )
    {
        this.quantity += qty
    } 
  
    subtract( qty: number )
    {
        this.quantity -= qty
    }  
}

export class Recipe 
{
    name: string
    ingredients: Ingredient[]
    instructions: string[]
    estimatedTime: number
   
    constructor( name: string, ingrs?: Ingredient[], instrs?: string[], time?: number )
    {
        this.name = name
        this.ingredients = ingrs
        this.instructions = instrs
        this.estimatedTime = time
    }
    
    addItem( ingr: Ingredient )
    {
        this.ingredients.push( ingr )
    }
      
    addInstruction( instr: string )
    {
        this.instructions.push( instr )
    }
}

export class Fridge 
{
    contents: Array<Item> 
      
    constructor( itms: Item[] )
    {
        this.contents = new Array<Item>( itms.length )
        
        for ( let i = 0; i <  itms.length; i++ )
            this.contents[i] = itms[i]
    }
    
    
    findItem( itmName: string ): number
    {
        for ( let i = 0; i < this.contents.length; i++ )
            if ( this.contents[i].name == itmName )
                return i
        
        return -1
    }
    
    
    add( itmName: string, itmQty: number )
    {
        const idx = this.findItem( itmName )
        
        if ( idx < 0 )
            this.contents.push( new Item( itmName, itmQty ) )
        else
            this.contents[idx].quantity +=  itmQty
    }
    
    
    remove( itmName: string, itmQty: number )
    {
        const idx = this.findItem( itmName )
        
        if ( idx >= 0 )
        {
            this.contents[idx].quantity -= itmQty
                
            if ( this.contents[idx].quantity < 0 )
                this.contents = this.contents.splice( idx, 1 )
        }
    }
    
    
    checkRecipe( recipe: Recipe )
    {
        const shoppingList = []
        const inFridge = []
        
        for ( let i = 0; i < recipe.ingredients.length; i++ )
        {
            const ingr = recipe.ingredients[i]
            
            const idx = this.findItem( ingr.name )
            
            if ( idx < 0 )
                shoppingList.push( ingr )
            else 
            {
                inFridge.push( this.contents[idx] )
                
                if ( ingr.quantity < this.contents[idx].quantity )
                {
                    const qtyShort = ingr.quantity - this.contents[idx].quantity
                    
                    shoppingList.push( new Ingredient( ingr.name, qtyShort ) )
                }
            }
        }
          
        return { shoppingList: shoppingList, inFridge: inFridge }
    }
}