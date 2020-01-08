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
 * TODO: [] Add event handler
 * TODO: [] Get input values
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

// Budget controller
let budgetController = (function() {

    // some code

})();

// UI controller
let UIController = (function() {

    // Get the values from the form
    // + / -
    // Description
    // Value
    return {
        getInput: function() {
            return {
                type: document.querySelector('.add__type').value, // will be either inc or exp
                description: document.querySelector('.add__description').value,
                value: document.querySelector('.add__value').value
            }
        }
    };


})();

// Global APP controller
let appController = (function(fn1, fn2) {

    // variables
    let input;

    let addItem = function() {

        // 1. Get the field input data
        input = UIController.getInput();

        // 2. Addthe item tot the budget controller

        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Display the bucget on the UI

    };

    document.querySelector('.add__btn').addEventListener('click', addItem);

    document.addEventListener('keypress', function(event) {

        // variables
        let keyCode = 13; // 13 = Enter key

        if(event["keyCode"] === keyCode || event.which === keyCode) {
            addItem();
        }
    });

})(budgetController, UIController);

