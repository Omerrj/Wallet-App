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
const createWalletForm = getElement("createWallet-form");
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
const walletSelect = getElement("wallets");
const currencies = document.getElementsByName("Currency");


const transBtns = [incomeBtn, expenseBtn];

let wallets = [];
let selectedCurrency;
let transactionType;
let currentWallet;

const show = (element) => element.classList.remove("hide");

const hide = (element) => element.classList.add("hide");

const selectWallet = (i) => {
  walletSelect.options[i].setAttribute("selected", true);
};

// makes or updates the wallet selection
const walletSelection = (wallets) => {
  walletSelect.innerHTML = "";

  wallets.forEach((wallet, i) => {
    const walletOption = document.createElement("option");
    walletOption.text = `${wallet.name}`;
    walletOption.value = i;
    walletOption.id = i;

    walletSelect.append(walletOption);
  });

  const createOption = document.createElement("option");
  createOption.text = "Create wallet";
  createOption.value = -1;
  createOption.id = -1;
  walletSelect.append(createOption);
  selectWallet(wallets.length - 1);
};

const expandTransaction = (transaction) => {
  transaction.parentNode.childNodes.forEach((trans) => {
    trans?.childNodes?.forEach((child, i) => {
      if (i !== 0 && i !== 1)
        !child?.classList?.contains("hide")
          ? child?.classList?.add("hide")
          : null;
    });
  });

  transaction?.childNodes?.forEach((child, i) => {
    if (i !== 0 && i !== 1)
      child?.classList?.contains("hide")
        ? child?.classList?.remove("hide")
        : null;
  });
};

// used to change or refresh the wallet view
const changeWallet = (currentWallet) => {
  walletBalance.textContent = walletBalance.textContent.slice(0, 15);
  transactionsList.innerHTML = "";
  walletBalance.append(
    `${currentWallet.currency === "$" ? currentWallet.currency : ""}${
      currentWallet.balance
    }${currentWallet.currency === "IQD" ? currentWallet.currency : ""}`
  );

  if (currentWallet.transactions) {
    currentWallet.transactions.forEach((trans) => {
      const transaction = document.createElement("div");
      transaction.classList.add("transaction");

      transaction.innerHTML = `<p id='transValue' class="transValue ${
        trans.type > 0 ? "income" : "expense"
      }" >${
        trans.value
      }</p><p class="transDate" id='transDate'>${trans.date
        .toString()
        .slice(0, 15)} | ${trans.date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      })}</p><p class="transNote hide" id='transNote'>${trans.note}</p>`;
      trans.tags?.forEach((tag) => {
        transaction.innerHTML += `<span id='tags' class='tags hide'>${tag}</span> `;
      });
      transaction.onclick = (e) => expandTransaction(transaction);
      transactionsList.append(transaction);
    });
  }
};

const resetForm = () => {
  createWalletForm.reset();
  selectedCurrency = null;
};

createWallet.onclick = () => show(formCard);

closeBtn.onclick = () => hide(formCard);

currencies.forEach(
  (currency) =>
    (currency.onclick = (e) => {
      selectedCurrency = e.target.value;
    })
);

walletSelect.onchange = (e) => {
  if (Number(e.target.value) >= 0) {
    currentWallet = wallets[Number(e.target.value)];
    changeWallet(currentWallet);
  } else {
    show(formCard);
  }
};

transBtns.forEach(
  (btn) =>
    (btn.onclick = (e) => {
      e.preventDefault();
      transactionType = Number(e.target.value);
    })
);

createBtn.onclick = () => {
  if (nameInp.value && Number(balanceInp.value) && selectedCurrency) {
    const wallet = new Wallet(
      nameInp.value,
      selectedCurrency,
      Number(balanceInp.value),
      description.value
    );

    wallets.push(wallet);

    show(walletView);
    hide(noWalletView);
    hide(formCard);

    currentWallet = wallets[wallets.length - 1];
    changeWallet(currentWallet);
    walletSelection(wallets);
    show(walletSelect);
    resetForm();
  }
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

    currentWallet.transaction(transaction);
    changeWallet(currentWallet);
  }
};
