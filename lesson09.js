'use strict';

let start = document.getElementById('start');
let plusIncome = document.getElementsByClassName('btn_plus income_add')[0];
let plusExpensesAdd = document.getElementsByClassName('btn_plus expenses_add')[0];
let checkBox = document.querySelector('#deposit-check');
let additionalIncomeItem = document.querySelectorAll('.additional_income-item');
let budgetDayValue = document.getElementsByClassName('result-total budget_day-value')[0];
let expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0];
let additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0];
let additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0];
let incomePeriodValue = document.getElementsByClassName('income_period-value')[0];
let targetMonthValue = document.getElementsByClassName('target_month-value')[0];
let budgetMonthValue = document.querySelector('.budget_month-value');
let periodSelect = document.querySelector('.period-select');
let targetAmount = document.querySelector('.target-amount');
let depositAmount = document.querySelector('.deposit-amount');
let depositPercent = document.querySelector('.deposit-percent');
let additionalExpItem = document.querySelector('.additional_expenses-item');
let expensesItems = document.querySelectorAll('.expenses-items');
let expensesTitle = document.querySelector('input.expenses-title');
let incomeAmount = document.querySelector('.income-amount');
let incomeTitle = document.querySelector('input.income-title');
let salaryAmount = document.querySelector('.salary-amount'),
    incomeItem = document.querySelectorAll('.income-items');
    
    let isNumber = function(n){
        return !isNaN(parseFloat(n)) && isFinite(n)
    };

    start.disabled = true;
    salaryAmount.addEventListener('input', function(){
        start.disabled = !isNumber(event.target.value);
    });

let appData = {
    budget: 0,
    budgetDay: 0,
    budgetMonth: 0,
    expensesMonth: 0,
    income: {},
    incomeMonth: 0,
    addIncome: [],
    expense: {},
    addExpenses: [],
    percentDeposit: 0,
    moneyDeposit: 0,
    deposit: false,
    start: function(){
        appData.budget = +salaryAmount.value;
        console.log('salaryAmount.value: ', salaryAmount.value);
        
        appData.getExpenses();
        appData.getIncome();
        appData.getAddExpenses();
        appData.getAddIncome();
        appData.getBudget();

        appData.showResult();
    },
    showResult: function(){
        budgetMonthValue.value = appData.budgetMonth;
        budgetDayValue.value = appData.budgetDay;
        expensesMonthValue.value = appData.expensesMonth;
        additionalExpensesValue.value = appData.addExpenses.join(', ');
        additionalIncomeValue.value = appData.addIncome.join(', ');
        targetMonthValue.value = Math.ceil(appData.getTargetMonth());
        incomePeriodValue.value = appData.calcSavedMoney();
        periodSelect.addEventListener('input', appData.dynamicIncom);

    },
    dynamicIncom: function(event){
        incomePeriodValue.value = appData.calcSavedMoney();
    },
    addExpensesBlock: function(){
        
        let cloneExpensesItem = expensesItems[0].cloneNode(true);
        expensesItems[0].parentNode.insertBefore(cloneExpensesItem, plusExpensesAdd);
        expensesItems = document.querySelectorAll('.expenses-items');

        if(expensesItems.length === 3){
            plusExpensesAdd.style.display = 'none';
        }
    },
    getExpenses: function(){
        expensesItems.forEach(function(item){
            let itemExpenses = item.querySelector('.expenses-title').value;
            let cashExpenses = item.querySelector('.expenses-amount').value;
            if(itemExpenses !== '' && cashExpenses !== ''){
                appData.expense[itemExpenses] = cashExpenses;
            }
        });
    },
    addIncomeBlock: function(){
        let cloneIncomeItem = incomeItem[0].cloneNode(true);
        incomeItem[0].parentNode.insertBefore(cloneIncomeItem, plusIncome);
        incomeItem = document.querySelectorAll('.income-items');

        if(incomeItem.length === 3){
            plusIncome.style.display = 'none';
        }
    },
    getIncome: function (){
        incomeItem.forEach(function(item){
            let itemIncome = item.querySelector('.income-title').value;
            let cashIncome = item.querySelector('.income-amount').value;
            if(itemIncome !== '' && cashIncome !== ''){
                appData.income[itemIncome] = cashIncome;
            }
        });
    },
    getAddExpenses: function (){
        let addExpenses = additionalExpItem.value.split(',');
        addExpenses.forEach(function(item){
            item = item.trim();
            if(item !== ''){
                appData.addExpenses.push(item);
            }
        });
    },
    getAddIncome: function (){
        additionalIncomeItem.forEach(function(item){
            let itemValue = item.value.trim();
            if(itemValue !== ''){
                appData.addIncome.push(itemValue);
            }
        });
    },
    getExpensesMonth: function () {
        /*for (let key in appData.expense) {
            appData.expensesMonth += +appData.expense[key];
        }*/

        let summ=0,
            dop=0;
        for (let key in appData.expense) {
            summ = parseInt(appData.expense[key]);
            dop += summ;
        }
        return dop;
    },
    getIncomeMonth: function(){
        /*for (let key in appData.income) {
            appData.incomeMonth += +appData.income[key];
        }*/
        let summ=0,
            dop=0;
        for (let key in appData.income) {
            summ = parseInt(appData.income[key]);
            dop += summ;
        }
        return dop;
    },
    getStatusIncome: function(){
        if (appData.budgetDay >= 1200) {
            return ('У вас высокий уровень дохода');
        } else if (appData.budgetDay>=600 && appData.budgetDay<1200) {
            return ('У вас средний уровень дохода');
        } else if (appData.budgetDay>=0 && appData.budgetDay<600) {
            return ('К сожалению у вас уровень дохода ниже среднего');
        } else {
            return ('Что то пошло не так');
        }
    },
    getBudget: function(){
        appData.budgetMonth = appData.budget + appData.getIncomeMonth() - appData.getExpensesMonth();
        appData.budgetDay = Math.floor(appData.budgetMonth / 30);
    },
    getTargetMonth: function(){
        /*let monthCount = a/b;
        if (monthCount >= 0) {
            console.log('Цель будет достигнута ' + Math.ceil(monthCount) + ' months');
        } else {
            console.log('Цель не будет достигнута ' + Math.ceil(monthCount) + ' months');
        }*/
            return targetAmount.value/appData.budgetMonth;
    },
    getInfoDeposit: function(){
        if(appData.deposit){
            appData.percentDeposit = +prompt('Какой годовой процент?', '10');
            
            while (isNaN(appData.moneyDeposit) || appData.moneyDeposit === '' || appData.moneyDeposit === null){
                appData.percentDeposit = +prompt('Какой годовой процент?');
            }
            appData.moneyDeposit = +prompt('Какая сумма заложена?', 13561);
            
            while (isNaN(appData.moneyDeposit) || appData.moneyDeposit === '' || appData.moneyDeposit === null) {
                appData.moneyDeposit = +prompt('Какая сумма заложена?');
            }
        }
    },
    calcSavedMoney: function(){
        return appData.budgetMonth * periodSelect.value;
    },
    displayPeriod: function(event){
        
        document.querySelector('.period-amount').textContent = event.target.value;
        
    },
};

start.addEventListener('click', appData.start);

plusExpensesAdd.addEventListener('click', appData.addExpensesBlock);

plusIncome.addEventListener('click', appData.addIncomeBlock);

periodSelect.addEventListener('input', appData.displayPeriod);

/*
console.log ('Расходы за месяц: ' + appData.getExpensesMonth());
console.log(appData.getStatusIncome());

console.log('Наша программа включает в себя данные:');

for (let key in appData){
console.log('Ключ: ' + key + ' Значение: ', appData[key]);
}

appData.getInfoDeposit();
console.log(appData.percentDeposit, appData.moneyDeposit, appData.calcSavedMoney());

let str = appData.addExpenses.join(', ').toString();

function ucFirstAllWords(str)
{
    var pieces = str.split(" ");
    for ( var i = 0; i < pieces.length; i++ )
    {
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1).toLowerCase();
    }
    return pieces.join(" ");
}

console.log(ucFirstAllWords(str));
*/