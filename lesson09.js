'use strict';
const startBtn = document.getElementById('start'),
    plusIncome = document.getElementsByClassName('btn_plus income_add')[0],
    plusExpensesAdd = document.getElementsByClassName('btn_plus expenses_add')[0],
    checkBox = document.querySelector('#deposit-check'),
    additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
    budgetDayValue = document.getElementsByClassName('result-total budget_day-value')[0],
    expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
    additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
    additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
    incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
    targetMonthValue = document.getElementsByClassName('target_month-value')[0],
    budgetMonthValue = document.querySelector('.budget_month-value'),
    periodSelect = document.querySelector('.period-select'),
    targetAmount = document.querySelector('.target-amount'),
    depositAmount = document.querySelector('.deposit-amount'),
    depositPercent = document.querySelector('.deposit-percent'),
    additionalExpItem = document.querySelector('.additional_expenses-item'),
    expensesTitle = document.querySelector('input.expenses-title'),
    incomeAmount = document.querySelector('.income-amount'),
    incomeTitle = document.querySelector('input.income-title'),
    salaryAmount = document.querySelector('.salary-amount'),
    cancelBtn = document.getElementById('cancel'),
    depositBank = document.querySelector('select.deposit-bank');
let inputTypeText = document.querySelectorAll('input[type="text"]'),
    incomeItem = document.querySelectorAll('.income-items'),
    expensesItems = document.querySelectorAll('.expenses-items');

    const isNumber = function(n){
        return !isNaN(parseFloat(n)) && isFinite(n)
    };

    startBtn.disabled = true;
    salaryAmount.addEventListener('input', function(event){
        startBtn.disabled = !isNumber(event.target.value);
    });
    
class AppData {
    constructor(){
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
    }
    start(){
        this.budget = +salaryAmount.value;
        this.getExpenses();
        this.getIncome();
        this.getAddExpenses();
        this.getAddIncome();
        this.getExpensesMonth();
        this.getIncomeMonth();
        this.getInfoDeposit();
        
        if (!isNumber(this.percentDeposit) || this.percentDeposit < 0 || this.percentDeposit > 100) {
            alert ('Введите корректное значение в поле проценты');
            startBtn.disabled = true;
            depositPercent.addEventListener('input', function(event){
                startBtn.disabled = !isNumber(event.target.value);
            });
                return;
        }

        this.getBudget();
        this.showResult();
        inputTypeText = document.querySelectorAll('input[type="text"]');
        inputTypeText.forEach(item => {item.disabled = true});
        plusIncome.disabled = true;
        plusExpensesAdd.disabled = true;
        startBtn.style.display = "none";
        cancelBtn.style.display = 'block';
        checkBox.disabled = true;
    }
    showResult(){
        
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = this.budgetDay;
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(', ');
        targetMonthValue.value = this.getTargetMonth();
        incomePeriodValue.value = this.calcSavedMoney();
        periodSelect.addEventListener('change', this.dynamicIncom.bind(this));
    }
    dynamicIncom(event){
        console.log(this);
        incomePeriodValue.value = this.calcSavedMoney();
    }
    
    addExpensesBlock(){
        const cloneExpensesItem = expensesItems[0].cloneNode(true);
        expensesItems[0].parentNode.insertBefore(cloneExpensesItem, plusExpensesAdd);
        expensesItems = document.querySelectorAll('.expenses-items');
    
        if(expensesItems.length === 3){
            plusExpensesAdd.style.display = 'none';
        }
    }
    
    getExpenses(){
        expensesItems.forEach((item) => {
            let itemExpenses = item.querySelector('.expenses-title').value;
            let cashExpenses = item.querySelector('.expenses-amount').value;
            if(itemExpenses !== '' && cashExpenses !== ''){
                this.expense[itemExpenses] = cashExpenses;
            }
        });
    }
    
    addIncomeBlock(){
        const cloneIncomeItem = incomeItem[0].cloneNode(true);
        incomeItem[0].parentNode.insertBefore(cloneIncomeItem, plusIncome);
        incomeItem = document.querySelectorAll('.income-items');
        console.log(incomeItem);
        if(incomeItem.length === 3){
            plusIncome.style.display = 'none';
        }
    }
    
    getIncome(){
        incomeItem.forEach((item) => {
            const itemIncome = item.querySelector('.income-title').value;
            const cashIncome = item.querySelector('.income-amount').value;
            if(itemIncome !== '' && cashIncome !== ''){
                this.income[itemIncome] = cashIncome;
            }
        });
    }
    
    getAddExpenses(){
        const addExpenses = additionalExpItem.value.split(',');
        addExpenses.forEach((item) => {
            item = item.trim();
            if(item !== ''){
                this.addExpenses.push(item);
            }
        });
    }
    
    getAddIncome(){
        const _this = this;
        additionalIncomeItem.forEach(function(item){
            let itemValue = item.value.trim();
            if(itemValue !== ''){
                _this.addIncome.push(itemValue);
            }
        });
    }
    
    getExpensesMonth() {
        for (let key in this.expense) {
            this.expensesMonth += +this.expense[key];
        }
    }
    
    getIncomeMonth(){
        for (let key in this.income) {
            this.incomeMonth += +this.income[key];
        }
    }
    
    getStatusIncome(){
        if (this.budgetDay >= 1200) {
            return ('У вас высокий уровень дохода');
        } else if (this.budgetDay>=600 && this.budgetDay<1200) {
            return ('У вас средний уровень дохода');
        } else if (this.budgetDay>=0 && this.budgetDay<600) {
            return ('К сожалению у вас уровень дохода ниже среднего');
        } else {
            return ('Что то пошло не так');
        }
    }
    
    getBudget(){
        const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
        this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
        this.budgetDay = Math.floor(this.budgetMonth / 30);
    }
    
    getTargetMonth(){
        if (!isNumber(targetAmount.value) == true){
            return 0;
        } else {
            return Math.ceil(targetAmount.value/this.budgetMonth);
        }
    }
    
    calcSavedMoney(){
        console.log('calcSaved', this);
        return this.budgetMonth * periodSelect.value;
    }
    
    displayPeriod(event){
        let _this = this;
        _this = document.querySelector('.period-amount');
        _this.textContent = event.target.value;
    }
    
    reset(){
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
        startBtn.disabled = true;
        salaryAmount.addEventListener('input', function(event){
        startBtn.disabled = !isNumber(event.target.value);
        });
        depositBank.style.display = 'none';
        depositBank.selectedIndex = 0;
        depositAmount.style.display = 'none';
        depositPercent.style.display = 'none';
    }
    getInfoDeposit(){
        if(this.deposit){
            this.percentDeposit = depositPercent.value;
            this.moneyDeposit = depositAmount.value;
        }
    }
    changePercent() {
        const valueSelect = this.value;
        if (valueSelect === 'other') {
            depositPercent.style.display = 'inline-block';
        } else (
            depositPercent.value = valueSelect
        )
    }
    depositHandler() {
        if (checkBox.checked) {
            depositBank.style.display = 'inline-block';
            depositAmount.style.display = 'inline-block';
            this.deposit = true;
            depositBank.addEventListener('change', this.changePercent);
        } else {
            depositBank.style.display = 'none';
            depositAmount.style.display = 'none';
            depositPercent.style.display = 'none';
            depositBank.value = '';
            depositAmount.value = '';
            depositPercent.value = '';
            this.deposit = false;
            depositBank.removeEventListener('change', this.changePercent);
        }
    }
    eventListeners() {
        
        startBtn.addEventListener('click', this.start.bind(this));
    
        plusExpensesAdd.addEventListener('click', this.addExpensesBlock);
        
        plusIncome.addEventListener('click', this.addIncomeBlock);
        
        periodSelect.addEventListener('input', this.displayPeriod);
        
        cancelBtn.addEventListener('click', this.reset.bind(this));

        checkBox.addEventListener('change', this.depositHandler.bind(this));
    }
};

const appData = new AppData();

appData.eventListeners();

console.log(appData);