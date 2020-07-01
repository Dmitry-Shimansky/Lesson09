'use strict';

let startBtn = document.getElementById('start');
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
    incomeItem = document.querySelectorAll('.income-items'),
    inputTypeText = document.querySelectorAll('input[type="text"]'),
    cancelBtn = document.getElementById('cancel');
    
    let isNumber = function(n){
        return !isNaN(parseFloat(n)) && isFinite(n)
    };

    startBtn.disabled = true;
    salaryAmount.addEventListener('input', function(event){
        startBtn.disabled = !isNumber(event.target.value);
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
        this.budget = +salaryAmount.value;
        this.getExpenses();
        this.getIncome();
        this.getAddExpenses();
        this.getAddIncome();
        this.getExpensesMonth();
        this.getIncomeMonth();
        this.getBudget();

        this.showResult();
        inputTypeText = document.querySelectorAll('input[type="text"]');
        inputTypeText.forEach(item => {item.disabled = true});
        plusIncome.disabled = true;
        plusExpensesAdd.disabled = true;
        startBtn.style.display = "none";
        cancelBtn.style.display = 'block';
    },
    showResult: function(){
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = this.budgetDay;
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(', ');
        targetMonthValue.value = this.getTargetMonth();
        incomePeriodValue.value = this.calcSavedMoney();
        periodSelect.addEventListener('input', this.dynamicIncom);
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
        for (let key in this.expense) {
            this.expensesMonth += +this.expense[key];
        }

        /*let summ=0,
            dop=0;
        for (let key in this.expense) {
            summ = parseInt(this.expense[key]);
            dop += summ;
        }
        return dop;*/
    },
    getIncomeMonth: function(){
        for (let key in this.income) {
            this.incomeMonth += +this.income[key];
        }
        /*let summ=0,
            dop=0;
        for (let key in this.income) {
            summ = parseInt(this.income[key]);
            dop += summ;
        }
        return dop;*/
    },
    getStatusIncome: function(){
        if (this.budgetDay >= 1200) {
            return ('У вас высокий уровень дохода');
        } else if (this.budgetDay>=600 && this.budgetDay<1200) {
            return ('У вас средний уровень дохода');
        } else if (this.budgetDay>=0 && this.budgetDay<600) {
            return ('К сожалению у вас уровень дохода ниже среднего');
        } else {
            return ('Что то пошло не так');
        }
    },
    getBudget: function(){
        appData.budgetMonth = appData.budget + appData.incomeMonth - appData.expensesMonth;
        appData.budgetDay = Math.floor(appData.budgetMonth / 30);
    },
    getTargetMonth: function(){
        if (!isNumber(targetAmount.value) == true){
            return 0;
        } else {
            return Math.ceil(targetAmount.value/this.budgetMonth);
        }
    },
    getInfoDeposit: function(){
        if(this.deposit){
            this.percentDeposit = +prompt('Какой годовой процент?', '10');
            
            while (isNaN(this.moneyDeposit) || this.moneyDeposit === '' || this.moneyDeposit === null){
                this.percentDeposit = +prompt('Какой годовой процент?');
            }
            this.moneyDeposit = +prompt('Какая сумма заложена?', 13561);
            
            while (isNaN(this.moneyDeposit) || this.moneyDeposit === '' || this.moneyDeposit === null) {
                this.moneyDeposit = +prompt('Какая сумма заложена?');
            }
        }
    },
    calcSavedMoney: function(){
        return this.budgetMonth * periodSelect.value;
    },
    displayPeriod: function(event){
        
        document.querySelector('.period-amount').textContent = event.target.value;
        
    },
    reset: function(){
        inputTypeText.forEach(item => {item.value = ''});
        appData.budget = 0;
        appData.budgetDay = 0;
        appData.budgetMonth = 0;
        appData.expensesMonth = 0;
        appData.income = {};
        appData.incomeMonth = 0;
        appData.addIncome = [];
        appData.expense = {};
        appData.addExpenses = [];
        appData.percentDeposit = 0;
        appData.moneyDeposit = 0;
        appData.deposit = false;
        //appData.showResult();
        inputTypeText.forEach(item => {item.disabled = false});
        checkBox.checked = false;
        startBtn.style.display = 'block';
        cancelBtn.style.display = 'none';
        plusIncome.disabled = false;
        plusExpensesAdd.disabled = false;
    }
};

startBtn.addEventListener('click', appData.start.bind(appData));

plusExpensesAdd.addEventListener('click', appData.addExpensesBlock);

plusIncome.addEventListener('click', appData.addIncomeBlock);

periodSelect.addEventListener('input', appData.displayPeriod);

cancelBtn.addEventListener('click', appData.reset);











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