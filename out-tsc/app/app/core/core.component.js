"use strict";
/** Program Name : Lab Project
 ** Name and ID : Peter Cross
 ** Date : June 28, 2018
 ** Lab : 6
 ** Course : CPSC2261
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let CoreComponent = class CoreComponent {
    constructor() { }
    ngOnInit() { }
};
CoreComponent = __decorate([
    core_1.Component({
        selector: 'app-core',
        templateUrl: './core.component.html',
        styleUrls: ['./core.component.css']
    }),
    __metadata("design:paramtypes", [])
], CoreComponent);
exports.CoreComponent = CoreComponent;
class Item {
    constructor(nm, qty) {
        this.name = nm;
        this.quantity = qty;
    }
}
exports.Item = Item;
class Ingredient extends Item {
    constructor(nm, qty) {
        super(nm, qty);
    }
    add(qty) {
        this.quantity += qty;
    }
    subtract(qty) {
        this.quantity -= qty;
    }
}
exports.Ingredient = Ingredient;
class Recipe {
    constructor(name, ingrs, instrs, time) {
        this.name = name;
        this.ingredients = ingrs;
        this.instructions = instrs;
        this.estimatedTime = time;
    }
    addItem(ingr) {
        this.ingredients.push(ingr);
    }
    addInstruction(instr) {
        this.instructions.push(instr);
    }
}
exports.Recipe = Recipe;
class Fridge {
    constructor(itms) {
        this.contents = new Array(itms.length);
        for (let i = 0; i < itms.length; i++)
            this.contents[i] = itms[i];
    }
    findItem(itmName) {
        for (let i = 0; i < this.contents.length; i++)
            if (this.contents[i].name == itmName)
                return i;
        return -1;
    }
    add(itmName, itmQty) {
        const idx = this.findItem(itmName);
        if (idx < 0)
            this.contents.push(new Item(itmName, itmQty));
        else
            this.contents[idx].quantity += itmQty;
    }
    remove(itmName, itmQty) {
        const idx = this.findItem(itmName);
        if (idx >= 0) {
            this.contents[idx].quantity -= itmQty;
            if (this.contents[idx].quantity < 0)
                this.contents = this.contents.splice(idx, 1);
        }
    }
    checkRecipe(recipe) {
        const shoppingList = [];
        const inFridge = [];
        for (let i = 0; i < recipe.ingredients.length; i++) {
            const ingr = recipe.ingredients[i];
            const idx = this.findItem(ingr.name);
            if (idx < 0)
                shoppingList.push(ingr);
            else {
                inFridge.push(this.contents[idx]);
                if (ingr.quantity < this.contents[idx].quantity) {
                    const qtyShort = ingr.quantity - this.contents[idx].quantity;
                    shoppingList.push(new Ingredient(ingr.name, qtyShort));
                }
            }
        }
        return { shoppingList: shoppingList, inFridge: inFridge };
    }
}
exports.Fridge = Fridge;
//# sourceMappingURL=core.component.js.map