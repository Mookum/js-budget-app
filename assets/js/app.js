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
 * Done: [x] Add the new item to our data structure
 * Done: [x] Add the new item to the UI
 * Done: [x] Calculate budget
 * Done: [x] Update the UI
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
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    inPercantageLabel: '.budget__income--percentage',
    expensesLabel: '.budget__expenses--value',
    exPercentageLabel: '.budget__expenses--percentage'
};

// Budget controller
let budgetController = (function () {

    // Variables
    let Item, data, calculateTotal;

    /**
     * Create item object datatype to use for each item we add or delete
     */
    Item = function (id, type, desc, val) {
        this.id = id; // Unique id
        this.type = type; // type of item: income or expense
        this.desc = desc; // Item description
        this.val = val; // value of the item
    };

    calculateTotal = function(type) {
        let sum;
        sum = 0;

        data.allItems[type].forEach(function(cur) {
            sum += cur.val;
        });

        data.totals[type] = sum;
    };

    data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, desc, val) {
            let newItem, id;
            // create new id, get the length of the array and count + 1
            id = data.allItems[type].length > 0 ? data.allItems[type][data.allItems[type].length - 1].id + 1 : 1;

            newItem = new Item(id, type, desc, val);
            data.allItems[type].push(newItem);

            return newItem;
        },

        calculateBudget: function() {

            // calculate total inc. and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            data.percentage = data.totals.inc > 0 ? Math.round((data.totals.exp / data.totals.inc) * 100) : -1;

        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
                value: parseFloat(document.querySelector(DomStrings.inputValue).value),
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
        },

        displayBudget: function(obj) {

            document.querySelector(DomStrings.budgetLabel).innerHTML = obj.budget + '&euro;';
            document.querySelector(DomStrings.incomeLabel).innerHTML = obj.totalInc + '&euro;';
            document.querySelector(DomStrings.expensesLabel).innerHTML = obj.totalExp + '&euro;';


            if(obj.percentage > 0)
            {
                document.querySelector(DomStrings.exPercentageLabel).innerHTML = obj.percentage + '&percnt;';
            } else
                {
                 document.querySelector(DomStrings.exPercentageLabel).innerHTML = '---';
            }
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

    updateBudget = function() {
        let budget;
        // 1. Calculate the budget
        budgetController.calculateBudget();

        // 2. Return the budget
        budget = budgetController.getBudget();

        // 3. Display the bucget on the UI
        UIController.displayBudget(budget);

        // return {
        //
        // }
    };

    addItem = function () {

        // 1. Get the field input data
        input = UIController.getInput();

        if(input.desc !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to the budget controller
            newItem = budgetController.addItem(input.type, input.desc, input.value);

            // 3. Add the item to the UI
            UIController.addListItem(newItem);

            // 4. clear fields
            UIController.clearForm();

            // 5. calculate budget and update UI
            updateBudget();
        }
    };

    return {
        init: function () {
            setupEventListeners();
            UIController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            console.log('Application has started.');
        }
    };

})(budgetController, UIController);

appController.init();
