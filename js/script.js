// Botão das +novas transação e tambem do calcelar
const Modal = {
  open() {
    // Quando click no botão '+nova transação' vai abrir o Modal
    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    // Quando click no botão 'Cancelar' vai fechar o Modal
    document.querySelector(".modal-overlay").classList.remove("active");
  },
};

// =============================================
const Storage = {
	get(){
		return JSON.parse(localStorage.getItem("dev.finances:transction")) || [];
	},

	set(transaction){
		localStorage.setItem("dev.finances:transction", JSON.stringify(transaction));
	},
}
// Funcão para calcular entrada e saidas de dados De add e remove as entradas e saidas de dados.
const Transaction = {
  all: Storage.get(),
  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },
  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },
  income() {
    // Soma da Entradas
    let income = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });
    return income;
  },
  expense() {
    // Soma das saidas
    let expense = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });
    return expense;
  },
  total() {
    // Entradas - saidas
    return Transaction.income() + Transaction.expense();
  },
};

// =============================================

//A função 'aadTransaction' Pegar as minhas 'transactions' e colocar no codico HTML.
//A função 'innerHTMLTransactions' responsavel por fazer o modelo do HTML.
const DOM = {
  transactionsContent: document.querySelector("#data-table tbody"),

  aadTransaction(transactions, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransactions(transactions, index);
    tr.dataset.index = index;
    DOM.transactionsContent.appendChild(tr);
  },

  innerHTMLTransactions(transaction, index) {
    const CSSClass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
		<td class="description">${transaction.description}</td>
		<td class="${CSSClass}">${amount}</td>
		<td class="date">${transaction.date}</td>
		<td>
			<img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remove as transações">
		</td>
		`;
    return html;
  },

  updateBalence() {
    document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(
      Transaction.income()
    );
    document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(
      Transaction.expense()
    );
    document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },

  clearTransactions() {
    DOM.transactionsContent.innerHTML = "";
  },
};
// =============================================

// 'Utils' é uma função para ajuda na fomartação dos numeros
const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },

  formatAmout(value) {
    value = Number(value) * 100;

    return value;
  },

  formatDate(date) {
    const slittedDate = date.split("-");

    return `${slittedDate[2]}/${slittedDate[1]}/${slittedDate[0]}`;
  },
};
// =============================================
const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getvalues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  valideteField() {
    const { description, amount, date } = Form.getvalues();
    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos.");
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getvalues();

    amount = Utils.formatAmout(amount);

    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },

  clearFiedl() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.valideteField();

      const transaction = Form.formatValues();

      Transaction.add(transaction);

      Form.clearFiedl();

      Modal.close();
    } catch (error) {
      alert(error.message);
    }
  },
};


// A função 'App' esta colocado as informações na tela com o 'froEach'
const App = {
  init() {
    Transaction.all.forEach(DOM.aadTransaction);

	DOM.updateBalence();
	
	Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

App.init();
