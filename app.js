
// BUDGET CONTROLLER
const budgetController = (() => {

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }


    };

    class Expenses {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }
        calculatePercentage(totalInc) {
            if (totalInc > 0) {
                this.percentage = Math.round((this.value / totalInc) * 100);
            } else {
                this.percentage = -1;
            }

        }
        getPercentage() {
            return this.percentage;
        }
    };

    calculateTotal = (type) => {

        const sum = data.allItems[type].reduce((prev, curr) => prev + curr.value, 0);
        data.totals[type] = sum;

    };

    //Our global data
    const data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, des, value) {
            let newItem, ID;

            //figure out the ID number
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Create new object based on the type of input
            if (type === 'inc') {
                newItem = new Income(ID, des, value);
            } else if (type === 'exp') {
                newItem = new Expenses(ID, des, value);
            }

            //Push the new item to the correspandant array
            data.allItems[type].push(newItem);

            //Return the nwly created item
            return newItem;

        },

        deleteItem: function (type, id) {
            let index;
            index = data.allItems[type].findIndex(curr => curr.id === id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }


        },

        calculateBudget: function () {
            //calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            //calculatethe budget: income - expenses
            data.budget = (data.totals.inc - data.totals.exp).toFixed(2);

            //calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentages: function () {

            data.allItems.exp.forEach(curr => curr.calculatePercentage(data.totals.inc));


        },

        getPercentages: function () {

            const perArray = data.allItems.exp.map(curr => curr.getPercentage());
            return perArray;

        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        test: function () {
            console.log(data);
        }
    };

})();




// UI CONTROLLER
const UIController = (() => {

    const domStrings = {
        form: '.add__form',
        type: '.add__type',
        description: '.add__description',
        value: '.add__value',
        ulExpenses: '.expenses__ul',
        ulIncome: '.income__ul',
        budgetLabel: '.budget__value',
        expLabel: '.budget__expenses--value',
        incLabel: '.budget__income--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        percentagesList: '.item__percentage',
        dateLabel: '.budget__title--month',
        inputbtn: '.add__btn'
    };

    const formatNumber = function (num, type) {
        let numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }


        dec = numSplit[1];
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };


    return {

        getInput: function () {

            return {
                type: document.querySelector(domStrings.type).value, //returns either inc or exp
                description: document.querySelector(domStrings.description).value,
                value: parseFloat(document.querySelector(domStrings.value).value)
            }
        },

        addListItem: function (obj, type) {
            let html, newHtml, element;
            //Prepare the placeholder html
            if (type === 'inc') {
                element = domStrings.ulIncome;
                html = `<li class="income__li">
                            <div class="item clearfix" id="inc-%id%">
                                <div class="item__description">%description%</div>
                                <div class="right clearfix">
                                    <div class="item__value">%value%</div>
                                    <div class="item__delete">
                                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                    </div>
                                </div>
                            </div>
                        </li>`

            } else if (type === 'exp') {
                element = domStrings.ulExpenses;
                html = `<li class="expenses__li">
                          <div class="item clearfix" id="exp-%id%">
                            <div class="item__description">%description%</div>
                            <div class="right clearfix">
                                <div class="item__value">%value%</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                          </div>
                        </li>`
            }

            //replace the placeholder html with actual html
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //insert html into the correspandant ul
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearInputFields: function () {
            let fields;
            fields = document.querySelectorAll(`${domStrings.description}, ${domStrings.value}`);
            fields.forEach(curr => curr.value = '');

            fields[0].focus();

        },

        displayPercentages: function (percentages) {
            let fields;
            fields = document.querySelectorAll(domStrings.percentagesList);

            fields.forEach((curr, index) => {
                if (percentages[index]) {
                    curr.textContent = percentages[index] + `%`;
                } else {
                    curr.textContent = '--';
                }
            })
        },

        displayMonth: function () {
            let now, year, month;

            now = new Date();
            months = ['january', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(domStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        displayBudget: function (obj) {
            let type;
            obj.budget > 0 ? type === 'inc' : type = 'exp';
            document.querySelector(domStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(domStrings.expLabel).textContent = formatNumber(obj.totalExp, 'exp');
            document.querySelector(domStrings.incLabel).textContent = formatNumber(obj.totalInc, 'inc');


            if (obj.percentage > 0 || obj.totalExp > obj.totalInc) {
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + `%`;
            } else {
                document.querySelector(domStrings.percentageLabel).textContent = `--`;
            }
        },

        getDomStrings: function () {
            return domStrings;
        },

        changeType: function () {
            let fields = document.querySelectorAll(
                domStrings.type + ',' +
                domStrings.description + ',' +
                domStrings.value
            );

            fields.forEach(curr => curr.classList.toggle('red-focus'));
            document.querySelector(domStrings.inputbtn).classList.toggle('red');
        },


    }

})();


// APP CONTROLLER
const appController = ((bdgtctr, uictr) => {

    const setupEventListeners = () => {
        const DOM = uictr.getDomStrings();

        document.querySelector(DOM.form).addEventListener('submit', e => {
            //Prevent default browsing refresh
            e.preventDefault();

            //Add Item
            ctrlAddItem();

        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.type).addEventListener('change', uictr.changeType);

    };

    const ctrlDeleteItem = (e) => {

        let itemID, splitID, type, ID;
        itemID = e.target.parentElement.parentElement.parentElement.parentElement.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        }

        //Delete the item from the data structure
        bdgtctr.deleteItem(type, ID);

        //Delete the item from the UI
        if (e.target.tagName === 'I') {
            e.target.parentElement.parentElement.parentElement.parentElement.remove();
        }

        //update the budget after delete
        updateBudget();

        //update percentages
        updatePercentages();
    };

    const updateBudget = () => {
        let budgetData;

        //1- Calculate the budget
        bdgtctr.calculateBudget();

        //2- return the budget
        budgetData = bdgtctr.getBudget();

        //3- Display the budget on the UI
        uictr.displayBudget(budgetData);
    };

    const updatePercentages = () => {
        //calculate percentages
        bdgtctr.calculatePercentages();

        //read percentages from the budget controller
        const allPer = bdgtctr.getPercentages();

        //Update the UI with the new percentages
        uictr.displayPercentages(allPer);
    };

    const ctrlAddItem = () => {
        let newItem;

        //1- Get the field input data
        const { type: inputType, description: inputDescription, value: inputValue } = uictr.getInput();

        if (inputDescription !== '' && !isNaN(inputValue) && inputValue > 0) {
            //2- add the item to the budget controller
            newItem = bdgtctr.addItem(inputType, inputDescription, inputValue);

            //3- add the item to the UI
            uictr.addListItem(newItem, inputType);

            //4-Clear input fields
            uictr.clearInputFields();

            //5-Calculate and update budget
            updateBudget();

            //6- Update percentages
            updatePercentages();
        }




    };


    return {
        init: function () {
            console.log('app has started');
            uictr.displayMonth();
            uictr.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);

appController.init();