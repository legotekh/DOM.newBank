export class User {
    #balance;
    #balanceUSD;
    #pin;
    constructor(name, card, pin, balance, balanceUSD, creditLimit){
        this.name = name;
        this.card = card;
        this.#pin = pin;
        this.#balance = balance;
        this.creditLimit = creditLimit;
        this.history = [];
        this.#balanceUSD = balanceUSD;
    }

    checkBalance(){
        return this.#balance;
    }

    setBalance(newBalance) {
        this.#balance = newBalance;
    }

    getBalance(){
        return this.#balance;
    }
    getBalanceUSD(){
        return this.#balanceUSD;
    }

    getPin(){
        return this.#pin;
    }

    takeCash(amount){
        if(amount > this.#balance){
            return console.log("you don't have enought money");
        } else {
            this.history.push(`${this.name} has sent money to their account`);
            return this.#balance -= amount;
        }
    }

    makePaymentForAcc(amount) {
        this.history.push(`${this.name} has sent money to their account`);
        return this.#balance += amount;
    }

    watchHistory() {
    console.log(this.history);
    }

    exitFromAcc(){
        this.history.push(`${this.name} has exited from their account`);
        return `${this.name} has exited from their account`;
    }

    transferUAtoUSD(sumUS,rate){
        const needUA = sumUS * rate;
        if(needUA <= this.#balance){
            this.#balance -= needUA;
            this.history.push(`${this.name} has bought USD`);
            return this.#balanceUSD += sumUS;
        }
        else{
            console.log("ERROR");
        }
    }

    transferUSDtoUA(needUSD,rate){
        const UA = needUSD * rate;
        if(needUSD <= this.#balanceUSD){
            this.#balanceUSD -= needUSD;
            this.history.push(`${this.name} has bought USD`);
            return this.#balance += UA;
        }
        else{
            console.log("ERROR");
        }
    }

    toJSON() {
        return {
            name: this.name,
            card: this.card,
            pin: this.#pin,
            balance: this.#balance,
            balanceUSD: this.#balanceUSD,
            history: this.history,
            creditLimit: this.creditLimit 
        };
    }
}

export class VIPUser extends User {
    constructor(name, card, pin, balance, balanceUSD,creditLimit){
        super(name, card, pin, balance, balanceUSD,creditLimit);
    }
    takeCash(amount) {
        const currentBalance = this.getBalance();
        const allMoney = currentBalance + this.creditLimit;
        if(allMoney >= amount){
            const newBalance = currentBalance - amount;
            this.setBalance(newBalance);
            console.log(`Успіх! Новий баланс: ${newBalance}`);  
        }
        else{
            return console.log("you don't have enought money");
        }
    }
}

export async function getCurrencyRate(){
    try{
        const current = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json');
        const data  = await current.json();
        const currentRate = data[0].rate;
        return currentRate;
    }
    catch(error){
        return console.log(error);
    }
}

export async function getCurrencyRateEuro(){
    try{
        const current = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=EUR&json');
        const data  = await current.json();
        const currentRate = data[0].rate;
        return currentRate;
    }
    catch(error){
        return console.log(error);
    }
}