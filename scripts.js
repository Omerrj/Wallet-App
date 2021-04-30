class Wallet {
  constructor(name, currency, balance, description) {
    this.name = name;
    this.currency = currency;
    this.balance = balance;
    this.description = description;
    this.transactions = [];
  }

  transaction(transaction) {
    const { value, type } = transaction;
    this.transactions.push(transaction);
    this.balance += value * type;
  }
}

class Transaction {
  constructor(value, type, note, tags, date) {
    this.value = value;
    this.type = type;
    this.note = note;
    this.tags = tags;
    this.date = date;
  }
}

const getElement = (id) => document.getElementById(id);

const createWallet = getElement("createWalletBtn");
const walletView = getElement("walletView");
const noWalletView = getElement("NoWalletView");
const formCard = getElement("form-card");
const createBtn = getElement("create-btn");
const closeBtn = getElement("close-btn");

const nameInp = getElement("name-inp");
const balanceInp = getElement("balance-inp");
const description = getElement("description-inp");
const addTransaction = getElement("addTransaction");
const transactionValue = getElement("transactionValue");
const transNotes = getElement("transNotes");
const transTags = getElement("transTags");
const incomeBtn = getElement("incomeBtn");
const expenseBtn = getElement("expenseBtn");
const walletBalance = getElement("walletBalance");
const transactionsList = getElement("transactions");
const currencies = document.getElementsByName("Currency");

const transBtns = [incomeBtn, expenseBtn];

let wallets = [];
let selectedCurrency;
let transactionType;
let currentWallet;

const show = (element) => element.classList.remove("hide");

const hide = (element) => element.classList.add("hide");

const changeWallet = (currentWallet) => {
  walletBalance.textContent = walletBalance.textContent.slice(0, 15);
  transactionsList.innerHTML = "";
  walletBalance.append(
    `${selectedCurrency === "$" ? selectedCurrency : ""}${
      currentWallet.balance
    }${selectedCurrency === "IQD" ? selectedCurrency : ""}`
  );

  currentWallet.transactions.forEach((trans) => {
    const transaction = document.createElement("div");
    transaction.classList.add(["transaction", "collapsed"]);

    transaction.innerHTML = `<p class="transValue ${
      trans.type > 0 ? "income" : "expense"
    }" >${trans.value}</p><p class="transDate">${trans.date
      .toString()
      .slice(0, 15)} | ${trans.date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    })}</p><p class="transNote">${trans.note}</p>`;

    transactionsList.append(transaction);
  });

  // const data = { wallets, currentWallet };
  // window.localStorage.setItem("data", JSON.stringify(data));
};

// window.onload = (e) => {
//   const data = JSON.parse(window.localStorage.getItem("data"));

//   if (data) {
//     console.log(data);
//     wallets = data.wallets;
//     currentWallet = data.currentWallet;

//     console.log(currentWallet);
//     show(walletView);
//     hide(noWalletView);
//     hide(formCard);
//     changeWallet(currentWallet);
//   }
// };

createWallet.onclick = () => show(formCard);

closeBtn.onclick = () => hide(formCard);

currencies.forEach(
  (currency) =>
    (currency.onclick = (e) => {
      selectedCurrency = e.target.value;
    })
);

transBtns.forEach(
  (btn) =>
    (btn.onclick = (e) => {
      e.preventDefault();
      transactionType = Number(e.target.value);
    })
);

createBtn.onclick = () => {
  const wallet = new Wallet(
    nameInp.value,
    selectedCurrency,
    Number(balanceInp.value),
    description.value
  );

  wallets.push(wallet);
  console.log(wallets);

  show(walletView);
  hide(noWalletView);
  hide(formCard);

  currentWallet = wallets[wallets.length - 1];
  changeWallet(currentWallet);
};

addTransaction.onclick = (e) => {
  e.preventDefault();
  if (Number(transactionValue.value) && transactionType) {
    const transaction = new Transaction(
      Number(transactionValue.value),
      transactionType,
      transNotes.value,
      transTags.value.split(","),
      new Date()
    );

    console.log(currentWallet);
    currentWallet.transaction(transaction);
    changeWallet(wallets[0]);
    console.log(wallets);
  }
};
