"use strict";
/** Program Name : Lab Project
 ** Name : Peter Cross
 ** Date : July 11, 2018
 ** Lab : 7
 ** Course : CPSC2261
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mongointerface_1 = require("./mongointerface");
const request = require("request");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};
// Object to access Mongo DB
let mongo = new mongointerface_1.MongoInterface();
/*
 * Class for Http Mongo Server
 */
class HttpMongoServer {
    /*
     * Class constructor
     */
    constructor() {
        this.path = '/';
        this.port = 3000;
        this.app = express();
        this.app.use(cors(corsOptions));
        this.app.use(bodyParser.json());
        this.startServer();
        let srvURL = 'http://localhost:' + this.port + this.path;
        request.get(srvURL, (err, resp, body) => console.log(body + '\n\nHttp Server started ... '));
    }
    /*
     * Method specifies which methods will be invoked for different requests with different routes
     * Gets invoked when server starts
     */
    startServer() {
        this.app.get(this.path, this.callBack);
        this.app.get('/recipelist', this.recipeList);
        this.app.get('/retrieverecipe/:recipeIdx', this.retrieveRecipe);
        this.app.get('/retrieverecipes/:recipeArray', this.retrieveRecipes);
        this.app.get('/retrieverecipes', this.retrieveAllRecipes);
        this.app.get('/deleterecipe/:recipeIdx', this.deleteRecipe);
        this.app.post('/addrecipe', this.addRecipe);
        this.app.post('/updaterecipe/:recipeIdx', this.updateRecipe);
        this.app.get('/fridgecontent', this.fridgeContent);
        this.app.get('/additemqty/:itemIdx/:qty', this.addItemQty);
        this.app.get('/removeitemqty/:itemIdx/:qty', this.removeItemQty);
        this.app.get('/deleteitem/:itemIdx', this.deleteItem);
        this.app.post('/additem', this.addItem);
        mongo.initMongo();
        this.app.listen(this.port);
    }
    /*
     * Method for server response on request for home page
     */
    callBack(request, response) {
        response.send('!!! << Hello World >> !!!');
    }
    /*
     * Method for server response on request to get fridge content
     */
    fridgeContent(request, response) {
        response.header("Content-Type", "application/json");
        response.json(mongo.getContents());
    }
    /*
     * Method for server response on request to add item
     */
    addItem(request, response) {
        response.header("Content-Type", "application/json");
        try {
            let itm = request.body;
            mongo.addItem(itm, response);
        }
        catch (e) {
            console.log(e);
            response.json(false);
        }
    }
    /*
     * Method for server response on request to add quantity for item specified by contents index
     */
    addItemQty(request, response) {
        response.header("Content-Type", "application/json");
        try {
            let idx = Number(request.params.itemIdx);
            let qty = Number(request.params.qty);
            let cntQty = Number(mongo.getContents()[idx].quantity);
            mongo.updateItemQty(idx, (cntQty + qty), response);
        }
        catch (e) {
            console.log(e);
            response.json(false);
        }
    }
    /*
     * Method for server response on request to remove quantity of item specified by contents index
     */
    removeItemQty(request, response) {
        response.header("Content-Type", "application/json");
        try {
            let idx = Number(request.params.itemIdx);
            let qty = Number(request.params.qty);
            let cntQty = Number(mongo.getContents()[idx].quantity);
            mongo.updateItemQty(idx, (cntQty - qty), response);
        }
        catch (e) {
            console.log(e);
            response.json(false);
        }
    }
    /*
     * Method for server response on request to delete item specified by content index
     */
    deleteItem(request, response) {
        response.header("Content-Type", "application/json");
        try {
            let idx = Number(request.params.itemIdx);
            mongo.deleteItem(idx, response);
        }
        catch (e) {
            console.log(e);
            response.json(false);
        }
    }
    /*
     * Method for server response on request to get recipe list
     */
    recipeList(request, response) {
        let list = new Array();
        for (let rcp of mongo.getRecipes())
            list.push(rcp.name);
        response.header("Content-Type", "application/json");
        response.json(list);
    }
    /*
     * Method for server response on request to retrieve a recipe by recipe index
     */
    retrieveRecipe(request, response) {
        let idx = Number(request.params.recipeIdx);
        response.header("Content-Type", "application/json");
        response.json(mongo.getRecipes()[idx]);
    }
    /*
     * Method for server response on request to retrieve recipes specified as array of recipe indexes
     */
    retrieveRecipes(request, response) {
        let idxArray = eval(request.params.recipeArray);
        let resArray = [];
        let recipes = mongo.getRecipes();
        for (let i = 0; i < idxArray.length; i++)
            resArray.push(recipes[idxArray[i]]);
        response.header("Content-Type", "application/json");
        response.json(resArray);
    }
    /*
     * Method for server response on request to retrieve all recipes
     */
    retrieveAllRecipes(request, response) {
        response.header("Content-Type", "application/json");
        response.json(mongo.getRecipes());
    }
    /*
     * Method for server response on request to delete recipe specified by recipe index
     */
    deleteRecipe(request, response) {
        response.header("Content-Type", "application/json");
        try {
            let idx = Number(request.params.recipeIdx);
            mongo.deleteRecipe(idx, response);
        }
        catch (e) {
            console.log(e);
            response.json(false);
        }
    }
    /*
     * Method for server response on request to add recipe
     */
    addRecipe(request, response) {
        response.header("Content-Type", "application/json");
        try {
            let rcp = request.body;
            mongo.addRecipe(rcp, response);
        }
        catch (e) {
            console.log(e);
            response.json(false);
        }
    }
    /*
     * Method for server response on request to update recipe
     */
    updateRecipe(request, response) {
        response.header("Content-Type", "application/json");
        try {
            let idx = Number(request.params.recipeIdx);
            let newOne = request.body;
            mongo.updateRecipe(idx, newOne, response);
        }
        catch (e) {
            console.log(e);
            response.json(false);
        }
    }
}
exports.HttpMongoServer = HttpMongoServer;
// Start Http Mongo Server
new HttpMongoServer();
//# sourceMappingURL=httpmongoserver.js.map