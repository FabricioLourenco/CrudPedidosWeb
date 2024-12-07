// URLs da API para Pedidos
const API_PEDIDOS = "http://localhost:8080/pedido";

// Carregar lista de pedidos ao iniciar
window.onload = carregarPedidos;

// Carregar pedidos do banco e exibir na tabela
function carregarPedidos() {
    fetch(`${API_PEDIDOS}/listar`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao carregar os pedidos.");
            }
            return response.json();
        })
        .then(pedidos => {
            const tabela = document.querySelector("#tabela-pedidos tbody");
            tabela.innerHTML = "";
            pedidos.forEach(pedido => {
                const linha = `
                    <tr>
                        <td>${pedido.descricao}</td>
                        <td>${pedido.valor}</td>
                        <td>${pedido.status}</td>
                        <td>${pedido.cliente.nome}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editarPedido(${pedido.id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="excluirPedido(${pedido.id})">Excluir</button>
                        </td>
                    </tr>
                `;
                tabela.innerHTML += linha;
            });
        })
        .catch(error => alert(`Erro ao carregar pedidos: ${error.message}`));
}

// Criar Pedido
document.querySelector("#btn-novo-pedido").onclick = function () {
    const descricao = prompt("Descrição do Pedido:");
    const valor = prompt("Valor do Pedido:");
    const status = prompt("Status do Pedido:");

    if (!descricao || !valor || !status) {
        alert("Descrição, Valor e Status são obrigatórios.");
        return;
    }

    const pedido = { descricao, valor, status };

    fetch(`${API_PEDIDOS}/salvar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
    })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao salvar pedido.");
            alert("Pedido salvo com sucesso!");
            carregarPedidos();
        })
        .catch(error => alert(`Erro ao salvar pedido: ${error.message}`));
};

// Editar Pedido
function editarPedido(id) {
    fetch(`${API_PEDIDOS}/${id}`)
        .then(response => response.json())
        .then(pedido => {
            const descricao = prompt("Descrição do Pedido:", pedido.descricao);
            const valor = prompt("Valor do Pedido:", pedido.valor);
            const status = prompt("Status do Pedido:", pedido.status);

            if (!descricao || !valor || !status) {
                alert("Descrição, Valor e Status são obrigatórios.");
                return;
            }

            const pedidoAtualizado = { descricao, valor, status };

            fetch(`${API_PEDIDOS}/atualizar/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pedidoAtualizado),
            })
                .then(response => {
                    if (!response.ok) throw new Error("Erro ao editar pedido.");
                    alert("Pedido atualizado com sucesso!");
                    carregarPedidos();
                })
                .catch(error => alert(`Erro ao editar pedido: ${error.message}`));
        });
}

// Excluir Pedido
function excluirPedido(id) {
    if (!confirm("Deseja realmente excluir este pedido?")) return;
    fetch(`${API_PEDIDOS}/excluir/${id}`, { method: "DELETE" })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao excluir pedido.");
            alert("Pedido excluído com sucesso!");
            carregarPedidos();
        })
        .catch(error => alert(`Erro ao excluir pedido: ${error.message}`));
}
