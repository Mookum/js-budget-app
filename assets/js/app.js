/**
 * Startdate: 08-01-2020
 * Creator: Porschmann David
 *
 * Budget app
 * ------------------
 *
 * This app will keep track of our income and outgoing budget.
 *
 * --------------------------------------------
 * DONE: [x] Add event handler
 * DONE: [x] Get input values
 * TODO: [] Add the new item to our data structure
 * TODO: [] Add the new item to the UI
 * TODO: [] Calculate budget
 * TODO: [] Update the UI
 * --------------------------------------------
 *
 * Modules
 * ------------------
 * Data module: data manipulation module
 * UI module: manipulation module
 * Controller module: controle the entire app
 * --------------------------------------------
 *
 */

// Domstrings
let DomStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
};

// Budget controller
let budgetController = (function() {

    // some code

})();

// UI controller
let UIController = (function() {

    // Get the values from the form
    // A: + / -
    // B: Description
    // C: Value

    return {
        getInput: function() {
            return {
                type: document.querySelector(DomStrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DomStrings.inputDescription).value,
                value: document.querySelector(DomStrings.inputValue).value,
            }
        }
    };

})();

// Global APP controller
let appController = (function(fn1, fn2) {

    // variables
    let input, addItem, setupEventListeners;

    // EventListeners
    setupEventListeners = function() {

        // Get value when click the button
        document.querySelector(DomStrings.inputBtn).addEventListener('click', addItem);

        // Get value when press return key
        document.addEventListener('keypress', function(event) {

            // variables
            let keyCode = 13; // 13 = Enter key

            // noinspection JSDeprecatedSymbols
            if(event["keyCode"] === keyCode || event.which === keyCode) {
                addItem();
            }
        });
    };

    addItem = function() {

        // 1. Get the field input data
        input = UIController.getInput();
        console.log(input);

        // 2. Add the item tot the budget controller

        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Display the bucget on the UI

    };

    return {
        init: function() {
            console.log('Yep');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

appController.init();
