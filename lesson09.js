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
    
const AppData = function () {
    
    this.budget =  0;
    this.budgetMonth =  0;
    this.expensesMonth =  0;
    this.income =  {};
    this.incomeMonth = 0;
    this.addIncome =  [];
    this.expense =  {};
    this.addExpenses = [];
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.deposit = false;
};

AppData.prototype.start = function(){
    console.log(this);
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
    checkBox.disabled = true;
};

AppData.prototype.showResult = function(){
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = this.calcSavedMoney();
    periodSelect.addEventListener('change', this.dynamicIncom.bind(this));
};

AppData.prototype.dynamicIncom = function(event){

    console.log(this);
    incomePeriodValue.value = this.calcSavedMoney();
};

AppData.prototype.addExpensesBlock = function(){
    let cloneExpensesItem = expensesItems[0].cloneNode(true);
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, plusExpensesAdd);
    expensesItems = document.querySelectorAll('.expenses-items');

    if(expensesItems.length === 3){
        plusExpensesAdd.style.display = 'none';
    }
};

AppData.prototype.getExpenses = function(){
    
    expensesItems.forEach((item) => {
        let itemExpenses = item.querySelector('.expenses-title').value;
        let cashExpenses = item.querySelector('.expenses-amount').value;
        if(itemExpenses !== '' && cashExpenses !== ''){
            this.expense[itemExpenses] = cashExpenses;
        }
    });
};

AppData.prototype.addIncomeBlock = function(){
    let cloneIncomeItem = incomeItem[0].cloneNode(true);
    incomeItem[0].parentNode.insertBefore(cloneIncomeItem, plusIncome);
    incomeItem = document.querySelectorAll('.income-items');
    console.log(incomeItem);
    if(incomeItem.length === 3){
        plusIncome.style.display = 'none';
    }
};

AppData.prototype.getIncome = function (){
    
    incomeItem.forEach((item) => {
        let itemIncome = item.querySelector('.income-title').value;
        let cashIncome = item.querySelector('.income-amount').value;
        if(itemIncome !== '' && cashIncome !== ''){
            this.income[itemIncome] = cashIncome;
        }
    });
};

AppData.prototype.getAddExpenses = function (){
    
    let addExpenses = additionalExpItem.value.split(',');
    addExpenses.forEach((item) => {
        item = item.trim();
        if(item !== ''){
            this.addExpenses.push(item);
        }
    });
};

AppData.prototype.getAddIncome = function (){
    const _this = this;
    additionalIncomeItem.forEach(function(item){
        let itemValue = item.value.trim();
        if(itemValue !== ''){
            _this.addIncome.push(itemValue);
        }
    });
};

AppData.prototype.getExpensesMonth = function () {
    for (let key in this.expense) {
        this.expensesMonth += +this.expense[key];
    }
};

AppData.prototype.getIncomeMonth = function(){
    for (let key in this.income) {
        this.incomeMonth += +this.income[key];
    }
};

AppData.prototype.getStatusIncome = function(){
    if (this.budgetDay >= 1200) {
        return ('У вас высокий уровень дохода');
    } else if (this.budgetDay>=600 && this.budgetDay<1200) {
        return ('У вас средний уровень дохода');
    } else if (this.budgetDay>=0 && this.budgetDay<600) {
        return ('К сожалению у вас уровень дохода ниже среднего');
    } else {
        return ('Что то пошло не так');
    }
};

AppData.prototype.getBudget = function(){
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
    this.budgetDay = Math.floor(this.budgetMonth / 30);
};

AppData.prototype.getTargetMonth = function(){
    if (!isNumber(targetAmount.value) == true){
        return 0;
    } else {
        return Math.ceil(targetAmount.value/this.budgetMonth);
    }
};

AppData.prototype.getInfoDeposit = function(){
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
};

AppData.prototype.calcSavedMoney = function(){
    console.log('calcSaved', this);
    return this.budgetMonth * periodSelect.value;
};

AppData.prototype.displayPeriod = function(event){
    let _this = this;
    _this = document.querySelector('.period-amount');
    _this.textContent = event.target.value;
};

AppData.prototype.reset = function(){
    inputTypeText.forEach(item => {item.value = ''});
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expense = {};
    this.addExpenses = [];
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.deposit = false;
    inputTypeText.forEach(item => {item.disabled = false});
    checkBox.checked = false;
    checkBox.disabled = false;
    startBtn.style.display = 'block';
    cancelBtn.style.display = 'none';
    plusIncome.disabled = false;
    plusExpensesAdd.disabled = false;
    periodSelect.value = 1;
    document.querySelector('.period-amount').textContent = '1';
    expensesItems.forEach( (item, index) => {
        if (index > 0) {
            item.remove()
        }
    });
    plusExpensesAdd.style.display = 'block';
    incomeItem.forEach( (item, index) => {
        if (index > 0) {
            item.remove()
        }
    });
    plusIncome.style.display = 'block';
};

AppData.prototype.eventListeners = function () {
    
    startBtn.addEventListener('click', this.start.bind(this));

    plusExpensesAdd.addEventListener('click', this.addExpensesBlock);
    
    plusIncome.addEventListener('click', this.addIncomeBlock);
    
    periodSelect.addEventListener('input', this.displayPeriod);
    
    cancelBtn.addEventListener('click', this.reset);
};

const appData = new AppData();

appData.eventListeners();

console.log(appData);

