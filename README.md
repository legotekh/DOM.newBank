# OOP Banking System

## Overview
A web-based ATM and banking dashboard simulation built to demonstrate advanced Object-Oriented Programming (OOP) concepts in Vanilla JavaScript. This project handles user authentication, balance management, currency exchange rates via a live API, and persistent data storage.

## Key Technical Features
* **OOP Architecture:** Implements core principles such as Encapsulation (private fields for `#balance` and `#pin`), Inheritance (`VIPUser` extending `User`), and Polymorphism (overriding cash withdrawal logic for VIPs with credit limits).
* **Live API Integration:** Uses `async/await` and the `fetch` API to retrieve real-time USD and EUR exchange rates from the National Bank of Ukraine (NBU) API.
* **State Persistence:** Implements custom parsing logic to save and reconstruct complex class instances (objects with prototypes and methods) to and from `localStorage`.
* **Dynamic DOM Manipulation:** Real-time updates for transaction history, balance conversions, and conditional UI rendering based on input validation.

## Technologies Used
* **Logic:** Vanilla JavaScript (ES6+), Object-Oriented Programming
* **API:** RESTful API (NBU)
* **Storage:** Browser LocalStorage
* **Frontend:** HTML5, CSS3

## Core Functionalities
* Secure mock login using Card Number and PIN.
* Withdraw and Deposit funds with real-time balance updates.
* Currency conversion (UAH to USD and vice versa) using live exchange rates.
* Separate logic for Standard Users and VIP Users (Credit Limits).
* Comprehensive transaction history tracking.
