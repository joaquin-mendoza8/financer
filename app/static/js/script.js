const MAX_FIELDS = 6;
var expenseInputs;

// check if DOM is loaded
$(document).ready(function() {

    // get reset button
    var resetButton = document.getElementById('reset-btn');

    // reload the page when reset button clicked
    resetButton.addEventListener('click', function() {
        sessionStorage.clear();
        window.location.reload();
    })

    // get all income input fields
    var incomeInputs = document.querySelector('#income-inputs').children;

    // get progress bar elements
    const actualProgressBar = document.getElementById('actual-progress-bar');
    const expectedProgressBar = document.getElementById('expected-progress-bar');

    // loop through all income input fields
    for (var i = 0; i < incomeInputs.length; i++) {

        var input = incomeInputs[i];

        // populate input field with saved user input if available
        const savedInput = sessionStorage.getItem(input.id);
        if (savedInput !== null && !isNaN(savedInput)) {
            input.value = savedInput;
        }

        // display all saved user inputs
        // console.log("Retrieved =>", input.id + ":", sessionStorage.getItem(input.id));

        input.addEventListener('change', function(input) {

            // save user input to session storage
            saveUserInput(input);

            // recalculate total income
            reCalculateTotal('total-monthly-income-value', "income-inputs");
            reCalculateNetAmount();

            // update progress bar for expected progress
            updateProgressBar(actualProgressBar);

            // update target budget
            updateTarget();

            updateWeeklyBudget();
        });

    }

    // console.log("---");

    // add event listener to all expense input fields
    var expenseInputs = document.querySelector('#expense-inputs').children;

    // loop through all expense input fields
    for (int = 0; int < expenseInputs.length; int++) {

        var input = expenseInputs[int];

        // populate input field with saved user input if available
        const savedInput = sessionStorage.getItem(input.id);
        if (savedInput !== null && !isNaN(savedInput)) {
            input.value = savedInput;
        }

        // display all saved user inputs
        // console.log("Retrieved =>", input.id + ":", sessionStorage.getItem(input.id));

        input.addEventListener('change', function(input) {

            // save user input to session storage
            saveUserInput(input);

            // recalculate total expenses
            reCalculateTotalExpenses('total-monthly-expense-value', "expense-inputs");
            reCalculateNetAmount();

            // update progress bar for actual progress
            updateProgressBar(actualProgressBar);

            updateTarget();

            updateWeeklyBudget();
        })
            
    }

    // set all values to session storage when page is refreshed
    setAllValues();

    // dynamically add new expense fields
    let incomeFieldCount = 4;
    let expenseFieldCount = 3;

    const addIncomeBtn = document.getElementById('add-income-btn');
    const addMonthlyExpenseBtn = document.getElementById('add-expense-btn');

    // add field for income
    addIncomeBtn.addEventListener('click', function() {
        addField('income', 'add-income-btn', incomeFieldCount);
        incomeFieldCount++;
        reCalculateTotal('total-monthly-income-value', "income-inputs");
    });

    // add field for expense
    addMonthlyExpenseBtn.addEventListener('click', function() {
        addField('expense', 'add-expense-btn', expenseFieldCount);
        expenseFieldCount++;
        reCalculateTotalExpenses('total-monthly-expense-value', "expense-inputs");
    });

});

// set all values to session storage when page is refreshed
function setAllValues() {

    const savedTotalIncome = sessionStorage.getItem('total-monthly-income-value');
    const savedTotalExpense = sessionStorage.getItem('total-monthly-expense-value');

    if (savedTotalIncome !== null && !isNaN(savedTotalIncome)) {
        document.getElementById('total-monthly-income-value').innerHTML = savedTotalIncome;
    }

    if (savedTotalExpense !== null && !isNaN(savedTotalExpense)) {
        document.getElementById('total-monthly-expense-value').innerHTML = savedTotalExpense;
    }

    reCalculateTotal('total-monthly-income-value', "income-inputs");
    reCalculateTotalExpenses('total-monthly-expense-value', "expense-inputs");
    reCalculateNetAmount();

    const actualProgressBar = document.getElementById('actual-progress-bar');
    const expectedProgressBar = document.getElementById('expected-progress-bar');

    updateProgressBar(actualProgressBar);
    updateProgressBar(expectedProgressBar);

    updateTarget();

    updateWeeklyBudget();

    incomeVal = parseInt(document.getElementById('total-monthly-income-value').innerHTML);
    expenseVal = parseInt(document.getElementById('total-monthly-expense-value').innerHTML);

    updateGraph(incomeVal, expenseVal);
}

// send user input to server for storage
function saveUserInput(input) {

    // parse user input to integer
    const numericalInput = parseInt(document.getElementById(input.target.id).value);

    // get input field id
    const inputId = input.target.id;

    // get total value elements
    const totalMonthlyIncomeValue = parseInt(document.getElementById('total-monthly-income-value').innerHTML);
    const totalMonthlyExpenseValue = parseInt(document.getElementById('total-monthly-expense-value').innerHTML);
    
    // console.log("Total Monthly Income:", totalMonthlyIncomeValue);
    // console.log("Total Monthly Expense:", totalMonthlyExpenseValue);

    if (!isNaN(totalMonthlyIncomeValue)) {
        sessionStorage.setItem('total-monthly-income-value', totalMonthlyIncomeValue);
        // console.log("Saved =>", 'total-monthly-income-value:', totalMonthlyIncomeValue);
    }

    if (!isNaN(totalMonthlyExpenseValue)) {
        sessionStorage.setItem('total-monthly-expense-value', totalMonthlyExpenseValue);
        // console.log("Saved =>", 'total-monthly-expense-value:', totalMonthlyExpenseValue);
    }

    // check if input is valid and save to session storage
    if (!isNaN(numericalInput)) {
        sessionStorage.setItem(inputId, numericalInput);
        // console.log("Saved =>", inputId + ":", numericalInput);
    } else if (numericalInput === 0 || isNaN(numericalInput)) {
        sessionStorage.setItem(inputId, null);
    } else {
        console.error('Invalid input', numericalInput, "for", inputId);
    }

}

// function to handle adding new input fields
function addField(fieldType, fieldId, fieldCount) {
    const addBtn = document.getElementById(fieldId);
    if (fieldCount < MAX_FIELDS) {

        // construct new input field
        const newField = document.createElement('input');
        newField.type = 'number';
        newField.className = 'form-control';
        newField.id = `${fieldType}-${fieldCount}`;

        // add field and update respective field count
        document.querySelector(`#${fieldType}-inputs`).appendChild(newField);
        fieldCount++;

        // remove add button if max fields reached
        if (fieldCount === MAX_FIELDS) {
            addBtn.style.display = 'none';
        }
    
    }
        
}


// function to recalculate total expenses
function reCalculateTotalExpenses(totalElementId, inputGroupId) {
    var inputFields = document.getElementById(inputGroupId).children;
    var sum = 0;

    // get total value element
    var totalValue = document.getElementById(totalElementId);

    // loop through all input fields
    for (int = 0; int < inputFields.length; int++) {
        var value = inputFields[int].value;

        // check if value is valid
        if (value === '' || isNaN(value)) {
            continue;
        }

        // add value to sum
        sum += parseInt(value);
    }

    // update total value
    totalValue.innerHTML = sum;

}

// function to calculate total income
function reCalculateTotal(totalElementId, inputGroupId) {

    // initialize sum to 0
    var sum = 0;

    // flag to check if input fields are valid
    var valid = true;

    // get all input fields
    var inputFields = document.getElementById(inputGroupId).children;
    var values = [];

    // check if first 3 input fields are valid
    for (var i = 0; i < inputFields.length - 1; i++) {
        var value = inputFields[i].value;
        if (value === '' || isNaN(value)) {
            valid = false;
            break;
        } else {
            values.push(parseInt(inputFields[i].value));
        }
    }

    // calculate total income
    if (valid) {
        var hours = values[0];
        var rate = values[1];
        var percentage = values[2] / 100;
        var tax = 0.25;
        var payPeriods = 2;

        sum = hours * payPeriods * rate * percentage * (1 - tax);

    }

    // Check if "Other" income field exists and has a valid value
    if (inputFields[3].value !== '' && !isNaN(inputFields[3].value)) {

        // add value to sum
        var other = parseInt(inputFields[3].value);
        sum += other;

    }

    // round off to whole number
    sum = Math.round(sum);

    // get total value element
    var totalValue = document.getElementById(totalElementId);

    // update total
    totalValue.innerHTML = sum;
}


// recalculate income - expense = net amount
function reCalculateNetAmount() {

    // get income and expense values
    var income = parseInt(document.getElementById('total-monthly-income-value').innerHTML);
    var expense = parseInt(document.getElementById('total-monthly-expense-value').innerHTML);

    // get net amount element
    var netAmount = document.getElementById('net-amount-value');

    // get negative sign element
    var negativeSign = document.getElementById('negative-sign');

    // calculate net amount
    var newNetAmount = income - expense;
    var newNetAmountAbs = Math.abs(newNetAmount); 

    // check if net amount is negative
    if (newNetAmount < 0) {

        // force negative sign to be visible
        negativeSign.style.display = 'inline-block';

    } else if (newNetAmount >= 0) {
            
        // force negative sign to be hidden
        negativeSign.style.display = 'none';

    }

    // check if net amount is greater than 1M
    if (newNetAmountAbs > 1000000) {

        // display net amount in millions
        netAmount.innerHTML = (newNetAmountAbs / 1000000).toFixed(2) + 'M';

    } else {

        // display net amount
        netAmount.innerHTML = newNetAmountAbs;

    }

}

// function to update days to break even and today's budget
function updateTarget() {
    const income = parseInt(document.getElementById('total-monthly-income-value').innerHTML);
    const expenses = parseInt(document.getElementById('total-monthly-expense-value').innerHTML);

    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const currentDayOfMonth = currentDate.getDate();
    
    const targetExpenses = Math.round((income / daysInMonth) * currentDayOfMonth);
    const budgetPerDay = Math.round((income - expenses) / daysInMonth);

    const targetValue = document.getElementById('target-value');

    const budgetValue = document.getElementById('budget-amount-value');
    
    if (expenses > targetExpenses) {
        const daysToBreakEven = Math.round((expenses - targetExpenses) / budgetPerDay);
        targetValue.innerHTML = daysToBreakEven;

        budgetValue.innerHTML = 0;
    } else {
        targetValue.innerHTML = "";

        budgetValue.innerHTML = budgetPerDay;
    }
}

// update weekly budget based on user input
function updateWeeklyBudget() {
    const income = parseInt(document.getElementById('total-monthly-income-value').innerHTML);
    const expenses = parseInt(document.getElementById('total-monthly-expense-value').innerHTML);

    const currentDate = new Date();
    const weeksInMonth = Math.ceil(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() / 7);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const currentDayOfMonth = currentDate.getDate();

    const weeklyBudgetValue = document.getElementById('weekly-budget-value');
    const weeklyBudget = Math.round((income - expenses) / weeksInMonth);

    const targetExpenses = Math.round((income / daysInMonth) * currentDayOfMonth);

    if (expenses > targetExpenses) {
        weeklyBudgetValue.innerHTML = 0;
    } else {
        weeklyBudgetValue.innerHTML = weeklyBudget;
    }
}

function updateProgressBar(progressBar) {
    const income = parseInt(document.getElementById('total-monthly-income-value').innerHTML);
    const expenses = parseInt(document.getElementById('total-monthly-expense-value').innerHTML);

    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const currentDayOfMonth = currentDate.getDate();
    
    // Calculate actual progress fill percentage
    if (progressBar.id === 'expected-progress-bar') {
        const expectedProgressPercentage = (currentDayOfMonth / daysInMonth) * 100;
        progressBar.style.width = expectedProgressPercentage + '%';

        // Update the expected progress value
        document.getElementById('expected-progress-value').innerHTML = expectedProgressPercentage.toFixed(0) + '%';
    } else {
        const actualProgressPercentage = (expenses / income) * 100;
        progressBar.style.width = actualProgressPercentage + '%';

        // Update the actual progress value
        document.getElementById('actual-progress-value').innerHTML = actualProgressPercentage.toFixed(0) + '%';
    }

    // Check if progress is greater than 100%
    if (progressBar.id === 'actual-progress-bar') {
        if (parseFloat(progressBar.style.width) > 100) {
            // reset the progress to 100%
            progressBar.style.width = '100%';

            // change the progress bar color to red
            progressBar.style.backgroundColor = '#ce3636';
        } else if(parseFloat(progressBar.style.width) > parseFloat(document.getElementById('expected-progress-bar').style.width)) {
            progressBar.style.backgroundColor = '#ce9136';
        } else {
            progressBar.style.backgroundColor = '#4c82af';
        }
    }
}
  