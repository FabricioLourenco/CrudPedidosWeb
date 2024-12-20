const API_CLIENTES = "http://localhost:8080/cliente";
const API_PEDIDOS = "http://localhost:8080/pedido";

window.onload = carregarClientes;

function carregarClientes() {
    fetch(`${API_CLIENTES}/listar`)
        .then(response => {
            if (!response.ok) throw new Error("Erro ao carregar clientes.");
            return response.json();
        })
        .then(clientes => {
            const selectCliente = document.getElementById("cliente");
            clientes.forEach(cliente => {
                const option = document.createElement("option");
                option.value = cliente.id;
                option.textContent = cliente.nome;
                selectCliente.appendChild(option);
            });
        })
        .catch(error => alert(`Erro ao carregar clientes: ${error.message}`));
}

document.getElementById("form-novo-pedido").addEventListener("submit", function (event) {
    event.preventDefault();

    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const status = document.getElementById("status").value;
    const clienteId = document.getElementById("cliente").value;

    if (!clienteId) {
        alert("Por favor, selecione um cliente.");
        return;
    }

    const novoPedido = { descricao, valor, status, clienteId };

    fetch(`${API_PEDIDOS}/salvar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(novoPedido),
    })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao salvar pedido.");
            alert("Pedido salvo com sucesso!");
            window.location.href = "pedidos.html";
        })
        .catch(error => alert(`Erro ao salvar pedido: ${error.message}`));
});
