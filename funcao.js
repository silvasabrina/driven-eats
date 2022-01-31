const selectedItens = new Array(undefined, undefined, undefined);
let finishOrderAvailable = false;

function getIndex(dataIdentifier) {
    switch (dataIdentifier) {
        case "dishes": return 0;
        case "drinks": return 1;
        case "desserts": return 2;
    }
}

function selectItem(itemSelecionado) {
    const index = getIndex(itemSelecionado.parentElement.getAttribute("data-identifier"));

    if (selectedItens[index] == itemSelecionado) {
        selectedItens[index] = undefined;
    } else {
        if (selectedItens[index] != undefined) {
            selectedItens[index].classList.toggle("item-selecionado");
        }
        selectedItens[index] = itemSelecionado;
    }

    itemSelecionado.classList.toggle("item-selecionado");
    finishOrderHandler();
}


function finishOrderHandler() {
    const finishButton = document.getElementById("finalizar-pedido");
    if (selectedItens.every(item => item != undefined)) {
        finishButton.textContent = "Fechar pedido";
        finishButton.classList.add("item-clicavel");
        finishButton.classList.add("pedido-pronto");
        finishOrderAvailable = true;
    } else {
        finishButton.textContent = "Selecione os 3 itens para finalizar o pedido";
        finishButton.classList.remove("item-clicavel");
        finishButton.classList.remove("pedido-pronto");
        finishOrderAvailable = false;
    }
}


function abrirTelaConfirmacao() {
    if (finishOrderAvailable) {
        const nome = prompt("Qual seu nome? 🤔")
        const endereco = prompt("Diga seu endereço 👀")

        const orderInfo = document.querySelectorAll(".informacao-pedido");
        const itemNames = [];
        console.log(orderInfo)

      
        let precoTotal = 0;
        for (let i = 0; i < selectedItens.length; i++) {
            const selectedOption = selectedItens[i];

            const itemName = selectedOption.querySelector("h1");
            const itemPrice = selectedOption.querySelector("h2");

            const itemInfo = orderInfo[i].querySelectorAll("h3");
            itemInfo[0].textContent = itemName.textContent;
            itemInfo[1].textContent = itemPrice.textContent.replace("R$ ", "");
            itemNames.push(itemName.textContent);

            precoTotal += parseFloat(itemInfo[1].textContent.replace(",", "."));
        }

        const precoFinalElement = document.getElementById("preco-final");
        const precoFinalString = precoTotal.toFixed(2).toString().replace('.', ',');
        precoFinalElement.textContent = "R$ " + precoFinalString;

        const telaConfirmacao = document.getElementById("background-confirmacao");
        telaConfirmacao.style.display = "flex";

        const confirmButton = document.getElementById("botao-confirmar");
        confirmButton.addEventListener("click", function () {
            redirectToWhatsApp(itemNames, precoTotal.toFixed(2), nome, endereco);
        });
    }
}

function cancelarPedido() {
    const telaConfirmacao = document.getElementById("background-confirmacao");
    telaConfirmacao.style.display = "none";
}

function redirectToWhatsApp(itemNames, precoFinal, nome, endereco) {
    let message = "Olá, gostaria de fazer o pedido:"
        + "\n - Prato: " + itemNames[0]
        + "\n - Bebida: " + itemNames[1]
        + "\n - Sobremesa: " + itemNames[2]
        + "\nTotal: R$ " + precoFinal;

    if (nome != "" || endereco != "") {
        message += "\n";
        if (nome != "") message += "\nNome: " + nome;
        if (endereco != "") message += "\nEndereço: " + endereco;
    }

    const url = "https://wa.me/5521999521936?text="
        + encodeURIComponent(message)

    window.open(url, "_blank")
}