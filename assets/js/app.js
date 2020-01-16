/*
 * Copyright (c) 2020. -  Porschmann David
 */

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
 * DomStrings object
 * // Here we can easy assign ForExample: html elements
 * @type {{container: string, itemPercentage: string, expensesLabel: string, inputDesc: string, expensesContainer:
 *     string, exPercentageLabel: string, dateLabel: string, incomeContainer: string, inputValue: string, incomeLabel:
 *     string, inPercentageLabel: string, inputType: string, budgetLabel: string, inputBtn: string}}
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
    inPercentageLabel: '.budget__income--percentage',
    expensesLabel: '.budget__expenses--value',
    exPercentageLabel: '.budget__expenses--percentage',
    container: '.container',
    itemPercentage: '.item__percentage',
    dateLabel: '.budget__title--month'
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
        this.percentage = -1;
    };

    Item.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0 )
        {
            this.percentage = Math.round((this.val / totalIncome) *100);
        } else
            {
                this.percentage = -1;
        }

    };

    Item.prototype.getPercentage = function() {
        return this.percentage;
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

        deleteItem: function(itemType, itemId) {

            let ids, index;

            ids = data.allItems[itemType].map( function(current) {
               return current.id;
            });

            index = ids.indexOf(itemId);

            if (index !== -1) {
                data.allItems[itemType].splice(index, 1);
            }
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

        calculatePercentages: function() {

            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            let allPercentages;
            allPercentages = data.allItems.exp.map(function(cur) {
               return cur.getPercentage();
            });
            return allPercentages;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        // testing: function () {
        //     console.log(data);
        // }
    }


})();

// UI controller
let UIController = (function () {

    let reFormatNumbers, nodeListForEach;

    // Get the values from the form
    // A: + / -
    // B: Description
    // C: Value

    reFormatNumbers = function(type, num) {
        let numSplit, int, dec;
        /*
        * + or - before number
        * 2 decimal points
        * comma seperating the thousands
        * */

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    nodeListForEach = function(list, callback) {
        let i;
        for(i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

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
            if (obj.type === 'inc') {
                el = DomStrings.incomeContainer;
                html =  '<div class="item clearfix" id="inc-%id%">' +
                            '<div class="item__description">%desc%</div>' +
                            '<div class="right clearfix"> ' +
                                '<div class="item__value">%value% &euro;</div> ' +
                                '<div class="item__delete" data-type="inc" data-id="%id%"> ' +
                                    '<button class="item__delete--btn">' +
                                        '<i class="ion-ios-close-outline"></i>' +
                                    '</button> ' +
                                '</div>' +
                            '</div>' +
                        '</div>';
            } else {
                el = DomStrings.expensesContainer;
                html =  '<div class="item clearfix" id="exp-%id%">\n' +
                            '<div class="item__description">%desc%</div>\n' +
                            '<div class="right clearfix">\n' +
                                '<div class="item__value">%value% &euro;</div>\n' +
                                '<div class="item__percentage">10%</div>\n' +
                                '<div class="item__delete" data-type="exp" data-id="%id%">\n' +
                                    '<button class="item__delete--btn">' +
                                        '<i class="ion-ios-close-outline"></i>' +
                                    '</button>\n' +
                                '</div>\n' +
                            '</div>\n' +
                         '</div>';
            }

            // replace the placeholdertext with actual data
            String.prototype.allReplace = function(obj) {
                let retStr;
                retStr = this;
                for (let x in obj) {
                    // noinspection JSUnfilteredForInLoop
                    retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
                }
                return retStr;
            };
            string = html.allReplace({'%id%': obj.id, '%desc%': obj.desc, '%value%': reFormatNumbers(obj.type, obj.val)});

            // Insert the html into the DOM
            document.querySelector(el).insertAdjacentHTML('beforeend', string);

        },

        deleteListItem: function(itemType, itemId) {
            let item;

            item = document.getElementById(itemType + '-' + itemId);

            item.parentNode.removeChild(item);
        },

        clearForm: function() {
            let form, formArr;

            form = document.querySelectorAll(DomStrings.inputDesc + ',' + DomStrings.inputValue);
            formArr = Array.prototype.slice.call(form);

            formArr.forEach(function(current) {
                current.value = "";
            });
            formArr[0].focus();
        },

        displayBudget: function(obj) {

            document.querySelector(DomStrings.budgetLabel).innerHTML = reFormatNumbers(obj.type, obj.budget) + '&euro;';
            document.querySelector(DomStrings.incomeLabel).innerHTML = reFormatNumbers(obj.type, obj.totalInc) + '&euro;';
            document.querySelector(DomStrings.expensesLabel).innerHTML = obj.totalExp + '&euro;';

            if(obj.percentage > 0)
            {
                document.querySelector(DomStrings.exPercentageLabel).innerHTML = obj.percentage + '&percnt;';
            } else
                {
                 document.querySelector(DomStrings.exPercentageLabel).innerHTML = '---';
            }
        },

        displayPercentages: function(percentages) {
            let fields;

            fields = document.querySelectorAll(DomStrings.itemPercentage);

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.innerHTML = percentages[index] + ' &percnt;';
                }
                else {
                    current.innerHTML = '---';
                }
            });

        },

        displayMonth: function() {
            let now, year, month, months;
            months = ['Januari', 'Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'];
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();


            document.querySelector(DomStrings.dateLabel).innerHTML = months[month] + ' ' + year;
        },

        changedType: function() {
            let fields;

            fields = document.querySelectorAll(DomStrings.inputType + ',' + DomStrings.inputDesc + ',' + DomStrings.inputValue);

            nodeListForEach(fields, function(cur) {
               cur.classList.toggle('red-focus');
            });
            document.querySelector(DomStrings.inputBtn).classList.toggle('red');
        }
    };
})();

// Global APP controller
let appController = (function () {

    // variables
    let input, addItem, setupEventListeners, newItem, deleteItem, updateBudget, updatePercentages;

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

        // delete a Item
        document.querySelector(DomStrings.container).addEventListener('click', deleteItem);

        document.querySelector(DomStrings.inputType).addEventListener('change', UIController.changedType);
    };

    updateBudget = function() {
        let budget;
        // 1. Calculate the budget
        budgetController.calculateBudget();

        // 2. Return the budget
        budget = budgetController.getBudget();

        // 3. Display the bucget on the UI
        UIController.displayBudget(budget);

    };

    updatePercentages = function() {
        let percentages;
        budgetController.calculatePercentages();
        percentages = budgetController.getPercentages();

        UIController.displayPercentages(percentages);
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

            // 6. update percentages
            updatePercentages();

        }
    };

    deleteItem = function (e) {
        let itemId, itemType;

        // item thats clicked
        itemId = parseInt(e.target.parentNode.parentNode.getAttribute('data-id'));

        // check item type income or expense
        if (itemId) {
            itemType = e.target.parentNode.parentNode.getAttribute('data-type');

            UIController.deleteListItem(itemType, itemId);

            budgetController.deleteItem(itemType, itemId);
        }

        updateBudget();
    };

    return {
        init: function () {
            setupEventListeners();
            UIController.displayMonth();
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
