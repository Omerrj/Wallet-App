const createWallet = document.getElementById("createWalletBtn");
const createBtn = document.getElementById("create-btn");
const nameInp = document.getElementById("name-inp");
const currency1 = document.getElementById("currency-inp-1");
const currency2 = document.getElementById("currency-inp-2");
const balanceInp = document.getElementById("balance-inp");
const description = document.getElementById("description-inp");

const wallets = [];

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
  constructor(value, type, note, tags) {
    this.value = value;
    this.type = type;
    this.note = note;
    this.tags = tags;
  }
}

createBtn.onclick = () => {
  const wallet = new Wallet(
    nameInp.value,
    1,
    Number(balanceInp.value),
    description.value
  );

  wallets.push(wallet);
  console.log(wallets);
};
