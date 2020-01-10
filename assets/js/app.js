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
 *
 *
 * DomStrings
 * // Here we can easy assign ForExample: a html element
 *
 * @type {{inputDescription: string, inputValue: string, inputType: string, inputBtn: string}}
 */
let DomStrings = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
};

// Budget controller
let budgetController = (function () {

    // Variables
    let Item, data;

    /**
     * Create item object datatype to use for each item we add or delete
     */
    Item = function (id, type, desc, val) {
        this.id = id; // Unique id
        this.type = type; // type of item: income or expense
        this.desc = desc; // Item description
        this.val = val; // value of the item
    };

    data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function (type, desc, val) {
            let newItem, id;
            // create new id, get the length of the array and count + 1
            id = data.allItems[type] > 0 ? data.allItems[type][data.allItems[type].length - 1].id + 1 : 1;

            newItem = new Item(id, type, desc, val);
            data.allItems[type].push(newItem);

            return newItem;
        },

        testing: function () {
            console.log(data);
        }
    }


})();

// UI controller
let UIController = (function () {

    // Get the values from the form
    // A: + / -
    // B: Description
    // C: Value

    return {
        getInput: function () {
            return {
                type: document.querySelector(DomStrings.inputType).value, // will be either inc or exp
                desc: document.querySelector(DomStrings.inputDesc).value,
                value: document.querySelector(DomStrings.inputValue).value,
            }
        },
        addListItem: function (obj) {
            let html, string, el;
            // Create html string with placeholder text
            switch (obj.type) {
                case 'inc':
                    el = DomStrings.incomeContainer;
                    html =  '<div class="item clearfix" id="income-%id%">' +
                                '<div class="item__description">%desc%</div>' +
                                '<div class="right clearfix"> ' +
                                    '<div class="item__value">%value% &euro;</div> ' +
                                    '<div class="item__delete"> ' +
                                        '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> ' +
                                    '</div>' +
                                '</div>' +
                            '</div>';
                    break;
                default:
                    el = DomStrings.expensesContainer;
                    html =  '<div class="item clearfix" id="expense-%id%">\n' +
                                '<div class="item__description">%desc%</div>\n' +
                                '<div class="right clearfix">\n' +
                                    '<div class="item__value">- %value% &euro;</div>\n' +
                                    '<div class="item__percentage">10%</div>\n' +
                                    '<div class="item__delete">\n' +
                                        '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                                    '</div>\n' +
                                '</div>\n' +
                             '</div>';
            }

            // replace the placeholdertext with actual data
            String.prototype.allReplace = function(obj) {
                let retStr, x;
                retStr = this;
                for (x in obj) {
                    retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
                }
                return retStr;
            };
            string = html.allReplace({'%id%': obj.id, '%desc%': obj.desc, '%value%': obj.val});

            // Insert the html into the DOM
            document.querySelector(el).insertAdjacentHTML('beforeend', string);

        },

        clearForm: function() {
            let form, formArr;

            form = document.querySelectorAll(DomStrings.inputDesc + ',' + DomStrings.inputValue);
            formArr = Array.prototype.slice.call(form);

            formArr.forEach(function(current, i, arr) {
                current.value = "";
            });
            formArr[0].focus();
        }
    };
})();

// Global APP controller
let appController = (function (fn1, fn2) {

    // variables
    let input, addItem, setupEventListeners, newItem;

    // EventListeners
    setupEventListeners = function () {

        // Get value when click the butto
        document.querySelector(DomStrings.inputBtn).addEventListener('click', addItem);

        // Get value when press return ke
        document.addEventListener('keypress', function (event) {

            // variables
            let keyCode = 13; // 13 = Enter key

            // noinspection JSDeprecatedSymbols
            if (event["keyCode"] === keyCode || event.which === keyCode) {
                addItem();
            }
        });
    };

    addItem = function () {

        // 1. Get the field input data
        input = UIController.getInput();

        console.log(input);
        // 2. Add the item to the budget controller
        newItem = budgetController.addItem(input.type, input.desc, input.value);

        // 3. Add the item to the UI
        UIController.addListItem(newItem);

        // 4. clear fields
        UIController.clearForm();

        // 5. Calculate the budget

        // 6. Display the bucget on the UI

    };

    return {
        init: function () {
            setupEventListeners();
            console.log('Application has started.');
        }
    };

})(budgetController, UIController);

appController.init();
