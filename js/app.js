import { User, VIPUser, getCurrencyRate , getCurrencyRateEuro } from "./main.js";

let currentUser = null;

let savedData = localStorage.getItem('atm_users');

const loginScreen = document.getElementById("login-screen");
const dashboardScreen = document.getElementById("dashboard-screen");

const welcomeText = document.getElementById("welcome-text");
const balanceDisplay = document.getElementById("balance-display");
const balanceDisplayUSD = document.getElementById("balance-display-USD");


const sum = document.getElementById('amount-input');
const cardNum = document.getElementById("card-input");
const pinCode = document.getElementById("pin-input");

const loginButton = document.getElementById('login-btn');
const takeCash = document.getElementById('withdraw-btn');

const deposit = document.getElementById('deposit-btn');

const logOut = document.getElementById('logout-btn');

const historyList = document.getElementById('history-list');

const CurrentRate = document.getElementById('currentRate');
const CurrentRateEuro = document.getElementById('currentRateEuro');

const usd = document.getElementById('buyUS');
const sellUSD = document.getElementById('sellUS');


let users = [];

if(savedData === null){
    users.push(new User("Денис", 1111, 1234, 1000 , 0));
    users.push(new VIPUser("Олена (VIP)", 2222, 7777, 500, 500,10000));
}
else{
    const zombi = JSON.parse(savedData);
    
    for( const zoo of zombi){
        if(zoo.creditLimit !== undefined){
        const recoveryVIP = new VIPUser(zoo.name , zoo.card , zoo.pin , zoo.balance, zoo.balanceUSD , zoo.creditLimit);
        recoveryVIP.history = zoo.history;
        users.push(recoveryVIP);
        }
        else {
            const recoveredUser = new User(zoo.name, zoo.card, zoo.pin, zoo.balance, zoo.balanceUSD);
            recoveredUser.history = zoo.history; 
            users.push(recoveredUser);
        }
    }
}


function parseData (element) {
    const data = parseInt(element.value);
    if(isNaN(data)||data <= 0){
        return null;
    }
    return data
}

function updateHistory () {
    historyList.innerHTML = "";
    for (const row of currentUser.history){
        const li = document.createElement('li');
        li.textContent = row;
        historyList.appendChild(li);
    }
}

function addFocusEffect (element) {
    element.addEventListener('focus', () => {
        element.style.borderColor = '#4CAF50';
        element.style.backgroundColor = '#e8f5e9';
        element.style.outline = 'none';
    })
    element.addEventListener('blur', () => {
        element.style.borderColor = '';
        element.style.backgroundColor = '';
    })
}

addFocusEffect(cardNum);
addFocusEffect(pinCode);
addFocusEffect(sum);


function handleLogin() {
    const parseCard = parseData(cardNum);
    const parsePin = parseData(pinCode);
    currentUser = null;
    for(let i = 0; i < users.length ; i++){
        if(parseCard === users[i].card && parsePin === users[i].getPin()){
            currentUser = users[i];
            break;
        }
    }

    if(currentUser === null){
        console.log("naaaaaa");
        return;
    }

    loginScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');
    welcomeText.textContent = currentUser.name;
    balanceDisplay.textContent = currentUser.getBalance().toFixed(2);
    balanceDisplayUSD.textContent = currentUser.getBalanceUSD().toFixed(2);
    updateHistory ();
}


loginButton.addEventListener('click', handleLogin);

pinCode.addEventListener('keydown', (key) => {
    if (key.key ==='Enter'){
        handleLogin();
    }
});


sum.addEventListener('input', () => {
    const getSUM = parseData (sum);
    if(getSUM <= 0){
        takeCash.disabled = true;
        deposit.disabled = true;
        usd.disabled = true;
        sellUSD.disabled = true;
    }
    if(getSUM === "" || getSUM === null){
        return console.log("Incorrect data");
    }
    if(getSUM >=1){
        takeCash.disabled = false;
        deposit.disabled = false;
        usd.disabled = false;
        sellUSD.disabled = false;
    }
    
})

takeCash.addEventListener('click', () => {
    const getSUM = parseData (sum);
    currentUser.takeCash(getSUM);
    balanceDisplay.textContent = currentUser.getBalance();
    sum.value = "";
    updateHistory ();
    saveData();
})

deposit.addEventListener('click', () => {
    const getSUM = parseData (sum);
    if(getSUM === null) return;
    currentUser.makePaymentForAcc(getSUM);
    balanceDisplay.textContent = currentUser.getBalance();
    sum.value = "";
    updateHistory ();
    saveData();
})

logOut.addEventListener('click', () => {
    loginScreen.classList.remove('hidden');
    dashboardScreen.classList.add('hidden');
    currentUser = null;
    cardNum.value = "";
    pinCode.value = "";
    sum.value = "";
})

function saveData () {
    localStorage.setItem('atm_users',JSON.stringify(users));
}
let us;
let eur;
try{
    const responseUS = await getCurrencyRate();
    if(responseUS){
    CurrentRate.innerText += responseUS;
    us = responseUS;
    }
}
catch(error){
    console.log("error");
}


try{
    const responseEUR = await getCurrencyRateEuro();
    if(responseEUR){
    CurrentRateEuro.innerText += responseEUR;
    }
}
catch(error){
    console.log("error");
}

usd.addEventListener('click', () => {
    const getSUM = parseData (sum);
    if(getSUM === null) return;
    currentUser.transferUAtoUSD(getSUM,us);
    balanceDisplay.textContent = currentUser.getBalance().toFixed(2);
    balanceDisplayUSD.textContent = currentUser.getBalanceUSD().toFixed(2);
    sum.value = "";
    updateHistory ();
    saveData();
})

sellUSD.addEventListener('click' , () => {
    const getSUM = parseData (sum);
    if(getSUM === null) return;
    currentUser.transferUSDtoUA(getSUM,us);
    balanceDisplay.textContent = currentUser.getBalance().toFixed(2);
    balanceDisplayUSD.textContent = currentUser.getBalanceUSD().toFixed(2);
    sum.value = "";
    updateHistory ();
    saveData();
})
