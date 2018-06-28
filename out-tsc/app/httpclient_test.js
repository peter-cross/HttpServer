"use strict";
/** Program Name : Lab Project
 ** Name : Peter Cross
 ** Date : June 28, 2018
 ** Lab : 6
 ** Course : CPSC2261
 */
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const core_component_1 = require("./app/core/core.component");
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};
// Constants to specify where tested Http Server is located
const path = '/';
const port = 3000;
const host = 'http://localhost';
/*
 * Class for testing Http Server from client side
 */
class HttpClientTest {
    constructor() {
        try {
            describe('HttpClientTest', () => {
                it('should create HttpClientTest', () => {
                    expect(this).toBeTruthy();
                });
                this.testGetRecipeList();
                this.testGetRetrieveRecipe();
                this.testGetRetrieveRecipes();
                this.testGetDeleteRecipe();
                this.testPostAddRecipe();
            });
        }
        catch (e) {
            console.log('Can not run jasmine methods ...');
        }
    }
    /*
     * Method to test getting list of recipes by GET method
     */
    testGetRecipeList() {
        let url = host + ':' + port + '/recipelist';
        describe('Get Recipe List', () => {
            it('should retrieve Recipe List', (done) => {
                console.log('\n== Testing retrieving Recipe List ==');
                request.get(url, (err, resp, body) => {
                    let list = JSON.parse(body);
                    console.log('\nRecipe List: ' + list);
                    expect(list[0]).toBe('Recipe 1');
                    expect(list[1]).toBe('Recipe 2');
                    expect(list[2]).toBe('Recipe 3');
                    done();
                });
            });
        });
    }
    /*
     * Method to test retrieving a recipe specified by index by GET method
     */
    testGetRetrieveRecipe() {
        let url = host + ':' + port + '/retrieverecipe/0';
        describe('Retrieve Recipe by index', () => {
            it('should retrieve Recipe by index', (done) => {
                console.log('\n== Testing retrieving Recipe by Index ==');
                request.get(url, (err, resp, body) => {
                    let recipe = JSON.parse(body);
                    let name = recipe.name;
                    let estimatedTime = recipe.estimatedTime;
                    let ingredients = recipe.ingredients;
                    let instructions = recipe.instructions;
                    console.log('\n Recipe name: ' + name);
                    expect(name).toBe('Recipe 1');
                    console.log('\n estimatedTime: ' + estimatedTime);
                    expect(estimatedTime).toBe(20);
                    console.log('\n ingredients: \n');
                    for (let i = 0; i < ingredients.length; i++) {
                        console.log('\t item: ' + ingredients[i].name + ' quantity: ' + ingredients[i].quantity);
                        expect(ingredients[i].name).toBe("Item " + (i + 1));
                        expect(ingredients[i].quantity).toBe((i + 1) * 11);
                    }
                    console.log('\n instructions: \n');
                    for (let i = 0; i < instructions.length; i++) {
                        console.log('\t ' + instructions[i]);
                        expect(instructions[i]).toBe("Instruction " + (i + 1));
                    }
                    done();
                });
            });
        });
    }
    /*
     * Method to test retrieving recipes specified by array of recipe indexes by GET method
     */
    testGetRetrieveRecipes() {
        let idxArr = [0, 1];
        let url = host + ':' + port + '/retrieverecipes/[0,1]';
        describe('Retrieve Recipe by array of recipe indexes', () => {
            it('should retrieve Recipes by specified array of recipe indexes', (done) => {
                console.log('\n== Testing retrieving Recipes by array of recipe indexes ==');
                request.get(url, (err, resp, body) => {
                    let recipes = JSON.parse(body);
                    for (let i = 0; i < recipes.length; i++) {
                        let recipe = recipes[i];
                        let name = recipe.name;
                        let estimatedTime = recipe.estimatedTime;
                        let ingredients = recipe.ingredients;
                        let instructions = recipe.instructions;
                        let rcpIdx = idxArr[i];
                        console.log('\n Recipe name: ' + name);
                        expect(name).toBe('Recipe ' + (rcpIdx + 1));
                        console.log('\n estimatedTime: ' + estimatedTime);
                        expect(estimatedTime).toBe(20 + rcpIdx * 10);
                        console.log('\n ingredients: \n');
                        console.log('\t item: ' + ingredients[0].name + ' quantity: ' + ingredients[0].quantity);
                        expect(ingredients[0].name).toBe("Item " + (rcpIdx + 1));
                        expect(ingredients[0].quantity).toBe((rcpIdx + 1) * 11);
                        for (let k = 1; k < ingredients.length; k++)
                            // Display for information purposes only: difficult to verify
                            console.log('\t item: ' + ingredients[k].name + ' quantity: ' + ingredients[k].quantity);
                        console.log('\n instructions: \n');
                        console.log('\t ' + instructions[0]);
                        expect(instructions[0]).toBe("Instruction " + (rcpIdx + 1));
                        for (let k = 0; k < instructions.length; k++)
                            // Display for information purposes only: difficult to verify
                            console.log('\t ' + instructions[k]);
                    }
                    done();
                });
            });
        });
    }
    /*
     * Method to test deleting a recipe specified by index by GET method
     */
    testGetDeleteRecipe() {
        let url = host + ':' + port + '/deleterecipe/1';
        describe('Delete Recipe by recipe index', () => {
            it('should delete Recipes by specified recipe index', (done) => {
                console.log('\n== Testing deleting Recipe by recipe index ==');
                request.get(url, (err, resp, body) => {
                    let recipes = JSON.parse(body);
                    let remainingRecipes = new Array();
                    for (let i = 0; i < recipes.length; i++)
                        remainingRecipes.push(recipes[i].name);
                    console.log('\nRemaining recipes: ' + remainingRecipes);
                    expect(remainingRecipes[0]).toBe('Recipe 1');
                    expect(remainingRecipes[1]).toBe('Recipe 3');
                    done();
                });
            });
        });
    }
    /*
     * Method to test adding a recipe object by POST method
     */
    testPostAddRecipe() {
        let ingr1 = new core_component_1.Ingredient('Ingredient 2', 20);
        let ingr2 = new core_component_1.Ingredient('Ingredient 1', 10);
        let ingr3 = new core_component_1.Ingredient('Ingredient 3', 30);
        let ingredients = [ingr1, ingr2, ingr3];
        let instr1 = 'Instruction 2';
        let instr2 = 'Instruction 1';
        let instr3 = 'Instruction 3';
        let instructions = [instr1, instr2, instr3];
        let estimatedTime = 30;
        let rcpObj = new core_component_1.Recipe("Recipe 2", ingredients, instructions, estimatedTime);
        let url = host + ':' + port + '/addrecipe';
        let reqOptions = { uri: url,
            method: 'POST',
            json: rcpObj };
        describe('Add Recipe object', () => {
            it('should add Recipe object', (done) => {
                console.log('\n== Testing adding Recipe object ==');
                request.post(reqOptions, (err, resp, body) => {
                    let recipes = body;
                    let recipeList = new Array();
                    for (let i = 0; i < recipes.length; i++)
                        recipeList.push(recipes[i].name);
                    console.log('\nNew Recipe List: ' + recipeList);
                    expect(recipeList[0]).toBe('Recipe 1');
                    expect(recipeList[1]).toBe('Recipe 3');
                    expect(recipeList[2]).toBe('Recipe 2');
                    done();
                });
            });
        });
    }
}
// Instantiate class to start testing
new HttpClientTest();
//# sourceMappingURL=httpclient_test.js.map