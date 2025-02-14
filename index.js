let _drinkAmount = 0
const addButton = document.querySelector(".add-button");
const submitButton = document.querySelector(".submit-button");

addButton.onclick = () => {
    const form = createForm();
    appendForm(form);
};

submitButton.onclick = () => {
    const modal = new ModalWindow();
    modal.show()
};

function appendForm(form) {
    document.body.insertBefore(form, document.getElementById("add-button-container"));
    mergeTextWithForm(form);
    const formHeader = form.querySelector(".beverage-header");
    formHeader.appendChild(createRemoveButton(form));
    _drinkAmount++;
}

function createRemoveButton(form) {
    const removeButton = document.createElement("div");

    removeButton.classList.add("remove-button");
    removeButton.textContent = "X";
    removeButton.onclick = () => {
        if (_drinkAmount <= 1) return;
        document.body.removeChild(form);
        _drinkAmount--;
        updateDrinkNumbers();
    };

    return removeButton;
}

function mergeTextWithForm(form) {
    const wordsToHighlight = /срочно|быстрее|побыстрее|скорее|поскорее|очень нужно/gmi;

    const container = form.querySelector(".wishes-container");
    const textArea = container.querySelector(".wishes-text");

    textArea.oninput = () => { container.querySelector(".wishes-view").innerHTML
        = textArea.value.replace(wordsToHighlight, word => `<b>${word}</b>`); };
}

function updateDrinkNumbers() {
    const drinkNumbers = document.querySelectorAll(".beverage-count");
    for (let i = 0; i < drinkNumbers.length; i++)
        drinkNumbers[i].textContent = `Напиток №${i + 1}`;
}

function createForm() {
    const form = document.createElement("form")
    form.classList.add("beverage-form")

    form.innerHTML =
        `<fieldset class="beverage">
        <div class="beverage-header">
        <h3 class="beverage-count">Напиток №${_drinkAmount + 1}</h3>
        </div>
        <label class="field">
          <span class="label-text">Я буду</span>
          <select name="coffee">
            <option value="espresso">Эспрессо</option>
            <option value="capuccino" selected>Капучино</option>
            <option value="cacao">Какао</option>
          </select>
        </label>
        <div class="field">
          <span class="checkbox-label">Сделайте напиток на</span>
          <label class="checkbox-field">
            <input type="radio" name="milk" value="usual" checked />
            <span>обычном молоке</span>
          </label>
          <label class="checkbox-field">
            <input type="radio" name="milk" value="no-fat" />
            <span>обезжиренном молоке</span>
          </label>
          <label class="checkbox-field">
            <input type="radio" name="milk" value="soy" />
            <span>соевом молоке</span>
          </label>
          <label class="checkbox-field">
            <input type="radio" name="milk" value="coconut" />
            <span>кокосовом молоке</span>
          </label>
        </div>
        <div class="field">
          <span class="checkbox-label">Добавьте к напитку:</span>
          <label class="checkbox-field">
            <input type="checkbox" name="options" value="whipped cream" />
            <span>взбитых сливок</span>
          </label>
          <label class="checkbox-field">
            <input type="checkbox" name="options" value="marshmallow" />
            <span>зефирок</span>
          </label>
          <label class="checkbox-field">
            <input type="checkbox" name="options" value="chocolate" />
            <span>шоколад</span>
          </label>
          <label class="checkbox-field">
            <input type="checkbox" name="options" value="cinnamon" />
            <span>корицу</span>
          </label>
        </div>
        <div class="field">
            <h3>И еще вот что</h3>
            <div class = "wishes-container">
                <textarea class="wishes-input wishes-text" id="wishes"></textarea>
                <div class="wishes-view wishes-text"></div>
            </div>
        </div>
      </fieldset>`;

    return form;
}

class ModalWindow {

    constructor() {
        this.modalContainer = document.querySelector(".modal-container");

        const modalClose = document.getElementById("modal-close");
        modalClose.onclick = () => this.hide();

        const modalText = this.modalContainer.querySelector(".modal-text");
        const ending = _drinkAmount % 10 === 1 ? "ок" :
            _drinkAmount % 10 >= 2 && _drinkAmount % 10 <= 4 ? "ка" : "ков";
        modalText.textContent = `Вы заказали ${_drinkAmount} напит${ending}`;

        this.modalContainer.querySelector(".modal-body").appendChild(this.createOrderTable());

        const form = this.modalContainer.querySelector("form");
        form.onsubmit = (event) => {
            event.preventDefault();
            const data = new FormData(form);
            const pickedDate = Date.parse(data.get("order-date"));
            const today = new Date().setHours(0,0,0,0);

            if (pickedDate > today) {
                document.getElementById("order-date").style.borderColor = "black";
                this.hide();
            }
            else {
                document.getElementById("order-date").style.borderColor = "red";
                alert("Мы не умеем перемещаться во времени. Выберите время позже, чем текущее.");
            }
        };
    };

    createOrderTable() {
        const table = document.createElement("table");
        table.classList.add("order-table");
        table.innerHTML = `
            <thead><tr>
            <th>Напиток</th>
            <th>Молоко</th>
            <th>Дополнительно</th>
            <th>Пожелания</th>
            </tr></thead>
        `;

        for (let form of document.querySelectorAll(".beverage-form")) {
            const formData = new FormData(form);
            const tableRow = document.createElement("tr");
            const dataKeys = ["coffee", "milk", "options"];

            for (let key of dataKeys) {
                const column = document.createElement("td");
                const values = formData.getAll(key).map(e => ModalWindow.#translate(e));
                column.textContent = values.join(", ");
                tableRow.appendChild(column);
            }
            const column = document.createElement("td");
            column.textContent = form.querySelector(".wishes-input").value ?? "";
            tableRow.appendChild(column);

            table.appendChild(tableRow);
        }

        return table;
    }

    show() { this.modalContainer.style.visibility = "visible"; };

    hide() {
        this.modalContainer.querySelector(".order-table").remove();
        this.modalContainer.style.visibility = "hidden";
    };

    static #translate(word) {
        switch(word) {
            case "espresso": return "Эспрессо";
            case "capuccino": return "Капучино";
            case "cacao": return "Какао";

            case "usual": return "Обычное молоко";
            case "no-fat": return "Обезжиренное молоко";
            case "soy": return "Соевое молоко";
            case "coconut": return "Кокосовое молоко";

            case "whipped-cream": return "Взбитые сливки";
            case "marshmallow": return "Зефирки";
            case "chocolate": return "Шоколад";
            case "cinnamon": return "Корица";
        }
    }
}