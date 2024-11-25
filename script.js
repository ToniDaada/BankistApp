const account1 = {
  owner: 'Sophia Umukoro',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Toni Daada',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Victory Arogundade',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Subomi Ogunyemi',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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
const displayMovements = function (movements) {
  containerMovements.innerHTML = ``;

  movements.forEach(function (value, index) {
    const type = value > 0 ? `deposit` : `withdrawal`;

    const html = `
     <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
           <div class="movements__value">${value}€</div>
          </div>
    
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const UpdateUI = function (acc) {
  // Display movements
  // Display balance
  // Display summary
  displayMovements(acc.movements);
  calcDisplaySummary(acc);
  calcPrintBalance(acc);
};
const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, curr) {
    return acc + curr;
  });

  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
  const inflow = acc.movements
    .filter(value => {
      return value > 0;
    })
    .reduce(function (acc, curr) {
      return acc + curr;
    }, 0);
  labelSumIn.textContent = `${inflow}€`;

  const outflow = acc.movements
    .filter(value => {
      return value < 0;
    })
    .reduce(function (acc, curr) {
      return acc + curr;
    }, 0);
  labelSumOut.textContent = `${Math.abs(outflow)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov);

  labelSumInterest.textContent = `${interest}€`;
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

createUserName(accounts);
// Implementing Login Feature
let currentAccount, currentAccountPin;

// Event Handlers
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
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

// Implementing Transfers
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
    UpdateUI(currentAccount);
    inputTransferTo.blur();
    inputTransferAmount.blur();
    inputTransferTo.value = inputTransferAmount.value = ``;
  }
});

// Closing the accoount
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

btnSort.addEventListener('click', function () {});
