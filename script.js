const account1 = {
  owner: 'Sophia Umukoro',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-11-23T17:01:17.194Z',
    '2024-11-25T23:36:17.929Z',
    '2024-11-26T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Toni Daada',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-11-23T17:01:17.194Z',
    '2024-11-01T23:36:17.929Z',
    '2024-11-26T10:51:36.790Z',
  ],
  currency: 'GBP',
  locale: 'en-GB',
};

const account3 = {
  owner: 'Victory Arogundade',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-11-23T17:01:17.194Z',
    '2024-11-25T23:36:17.929Z',
    '2024-11-26T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Subomi Ogunyemi',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2024-11-23T17:01:17.194Z',
    '2024-11-21T23:36:17.929Z',
    '2024-11-26T10:51:36.790Z',
  ],
  currency: 'NGN',
  locale: 'en-NG', // de-DE
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

// Functions
const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value.toFixed(5));
};
const formatLabelDate = function (currentAccount) {
  const tick = function () {
    const getCurentDate = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(getCurentDate);
  };
  tick();
  const dateTimer = setInterval(tick, 1000);
  return dateTimer;
};
const formatMovementsDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.floor(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ``;

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (value, index) {
    const type = value > 0 ? `deposit` : `withdrawal`;

    const date = new Date(acc.movementsDates[index]);
    const displayDate = formatMovementsDate(date, acc.locale);

    const formattedValue = formatCurr(value, acc.locale, acc.currency);
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
           <div class="movements__value">${formattedValue}</div>
           </div>

           
           `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const UpdateUI = function (acc) {
  // Display movements
  // Display balance
  // Display summary
  displayMovements(acc);
  calcDisplaySummary(acc);
  calcPrintBalance(acc);
};
const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, curr) {
    return acc + curr;
  });

  labelBalance.textContent = formatCurr(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const inflow = acc.movements
    .filter(value => {
      return value > 0;
    })
    .reduce(function (acc, curr) {
      return acc + curr;
    }, 0);

  labelSumIn.textContent = formatCurr(inflow, acc.locale, acc.currency);

  const outflow = acc.movements
    .filter(value => {
      return value < 0;
    })
    .reduce(function (acc, curr) {
      return acc + curr;
    }, 0);

  labelSumOut.textContent = formatCurr(
    Math.abs(outflow),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = formatCurr(interest, acc.locale, acc.currency);
  return outflow, inflow, interest;
};

const createUserName = function (account) {
  account.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(value => value.at(0))
      .join('');
  });
};
``;

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(timer / 60)).padStart(2, '0');
    const sec = String(timer % 60).padStart(2, '0');
    // In each second, update the timer UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (timer === 0) {
      clearInterval(time);
      labelWelcome.textContent = `Login to get started`;
      containerApp.style.opacity = 0;
    }
    timer--;
  };
  // Set time to 5 minutes
  let timer = 600;
  // Call the timer every second
  tick();
  const time = setInterval(tick, 1000);

  return time;
};

createUserName(accounts);
// Event Handlers

let currentAccount, time, dateTimer;
// Implementing Login Feature
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value.toLowerCase()
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 100;
    // Display movements
    // Display balance
    // Display summary
    UpdateUI(currentAccount);

    if (time) clearInterval(time);
    if (dateTimer) clearInterval(dateTimer);
    time = startLogOutTimer();
    dateTimer = formatLabelDate(currentAccount);

    inputLoginPin.value = ``;
    inputLoginUsername.value = ``;
    // To make input fields lose focus
    // inputLoginPin.blur();
    inputLoginPin.blur();
    inputLoginUsername.blur();
  } else {
    inputLoginPin.value = ``;
    inputLoginUsername.value = ``;
    inputLoginUsername.blur();
    inputLoginPin.blur();
  }
});
// Handling the Implementing Transfers Event
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferTo = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    transferTo &&
    currentAccount.balance >= amount &&
    transferTo?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    transferTo.movements.push(amount);

    // Adding transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    transferTo.movementsDates.push(new Date().toISOString());

    UpdateUI(currentAccount);
    // formatLabelDate(currentAccount);
    inputTransferTo.blur();
    inputTransferAmount.blur();
    inputTransferTo.value = inputTransferAmount.value = ``;
    clearInterval(time);
    time = startLogOutTimer();
  }
});

// Handling the Loaning Event

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  // formatLabelDate(currentAccount);
  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    // FIXME
    // Unfortunately users can cheat the alogrithm by getting loans for more than they deserve. I dont know how to do that yet tbh
    // So TODO : I need to work on that
    currentAccount.movements
      .filter(acc => acc > 0)
      .every(acc => acc >= acc * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(amount);

      // Adding Loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      UpdateUI(currentAccount);
      clearInterval(time);
      time = startLogOutTimer();
    }, 3000);
  }
  inputLoanAmount.value = ``;
  inputLoanAmount.blur();
});

//Handling the Closing of the accoount event
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const deletedAccount = accounts.find(
    acc => acc.username === inputCloseUsername.value
  );
  if (
    deletedAccount?.username === currentAccount.username &&
    deletedAccount?.pin === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    //  Delete Account

    accounts.splice(index, 1);
    // Hide UI

    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Goodbye, ${
      currentAccount.owner.split(' ')[0]
    }!`;

    inputCloseUsername.value = inputClosePin.value = ``;
    inputCloseUsername.blur();
    inputClosePin.blur();
  }
});

// Handling the sorting of account event
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  if (!sorted) {
    displayMovements(currentAccount, sorted);
    btnSort.innerHTML = `
   <button class="btn--sort">&uparrow; SORT</button>
  `;
    sorted = !sorted;
  } else {
    displayMovements(currentAccount, sorted);
    btnSort.innerHTML = `
   <button class="btn--sort">&downarrow; SORT</button>
  `;
    sorted = !sorted;
  }
});

// Handling new accounts
/*
const signupApp = document.querySelector('.signup');

const btnSignUp = document.querySelector('.form__btn--signup');
const inputSignUpName = document.querySelector('.signup__input--name');
const inputSignUpPin = document.querySelector('.signup__input--pin');
const inputSignUpInterest = document.querySelector('.signup__input--interest');
const inputSignUpCurrency = document.querySelector('.signup__input--currency');
const inputSignUpLocale = document.querySelector('.signup__input--locale');

btnSignUp.addEventListener('click', function (e) {
  e.preventDefault();

  const name = inputSignUpName.value.trim();
  const pin = Number(inputSignUpPin.value.trim());
  const interestRate = Number(inputSignUpInterest.value.trim());
  const currency = inputSignUpCurrency.value.trim();
  const locale = inputSignUpLocale.value.trim();

  // Validate inputs
  if (!name || !pin || !interestRate || !currency || !locale) {
    alert('Please fill all fields!');
    return;
  }

  // Check for unique username
  const usernameExists = accounts.some(
    acc => acc.owner.toLowerCase() === name.toLowerCase()
  );
  if (usernameExists) {
    alert('Username already exists! Please choose a different name.');
    return;
  }

  // Create new account
  const newAccount = {
    owner: name,
    movements: [],
    interestRate: interestRate,
    pin: pin,
    movementsDates: [],
    currency: currency,
    locale: locale,
  };

  // Add username property
  newAccount.username = name
    .toLowerCase()
    .split(' ')
    .map(value => value.at(0))
    .join('');

  // Add account to accounts array
  accounts.push(newAccount);

  // Update UI
  alert('Sign-up successful! Please log in.');

  // Clear inputs
  inputSignUpName.value =
    inputSignUpPin.value =
    inputSignUpInterest.value =
    inputSignUpCurrency.value =
    inputSignUpLocale.value =
      '';
});
*/
