const API_PEDIDOS = "http://localhost:8080/pedido";
const API_CLIENTES = "http://localhost:8080/cliente";

window.onload = carregarPedidos;

let pedidos = []; // Variável para armazenar os pedidos carregados
let clientes = []; // Variável para armazenar os clientes

async function carregarPedidos() {
    try {
        const response = await fetch(`${API_PEDIDOS}/listar`);
        if (!response.ok) {
            throw new Error("Erro ao carregar os pedidos.");
        }

        pedidos = await response.json(); // Armazena os pedidos carregados
        const tabela = document.querySelector("#tabela-pedidos tbody");
        tabela.innerHTML = "";

        for (const pedido of pedidos) {
            const cliente = await buscarCliente(pedido.clienteId);
            clientes.push(cliente); // Armazena os clientes carregados

            const linha = `
                <tr>
                    <td>${pedido.descricao}</td>
                    <td>${pedido.valor}</td>
                    <td>${pedido.status}</td>
                    <td>${cliente.nome}</td>
                    <td>
                        <a href="editar-pedido.html?id=${pedido.id}" class="btn btn-warning btn-sm">Editar</a>
                        <button class="btn btn-danger btn-sm excluir-btn" data-id="${pedido.id}">Excluir</button>
                    </td>
                </tr>
            `;
            tabela.innerHTML += linha;
        }

        // Filtro de pedidos com base no nome do cliente
        document.querySelector('#btn-busca').addEventListener('click', () => {
            const busca = document.querySelector('#busca-pedido').value.toLowerCase();
            const pedidosFiltrados = pedidos.filter(pedido => {
                const cliente = clientes.find(c => c.id === pedido.clienteId);
                return cliente && (cliente.nome.toLowerCase().includes(busca) || cliente.cpf.includes(busca));
            });
            exibirPedidos(pedidosFiltrados);
        });

        // Também adicionar filtro enquanto o usuário digita
        document.querySelector('#busca-pedido').addEventListener('input', () => {
            const busca = document.querySelector('#busca-pedido').value.toLowerCase();
            const pedidosFiltrados = pedidos.filter(pedido => {
                const cliente = clientes.find(c => c.id === pedido.clienteId);
                return cliente && (cliente.nome.toLowerCase().includes(busca) || cliente.cpf.includes(busca));
            });
            exibirPedidos(pedidosFiltrados);
        });

        document.querySelectorAll('.excluir-btn').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                excluirPedido(id);
            });
        });

    } catch (error) {
        alert(`Erro ao carregar pedidos: ${error.message}`);
    }
}

async function buscarCliente(id) {
    // Verifica se o cliente já foi carregado anteriormente
    const clienteExistente = clientes.find(cliente => cliente.id === id);
    if (clienteExistente) return clienteExistente;

    try {
        const response = await fetch(`${API_CLIENTES}/${id}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar cliente.");
        }
        return await response.json();
    } catch (error) {
        console.error(`Erro ao buscar cliente: ${error.message}`);
        return { nome: "Desconhecido" };
    }
}

function exibirPedidos(pedidosFiltrados) {
    const tabela = document.querySelector("#tabela-pedidos tbody");
    tabela.innerHTML = "";
    pedidosFiltrados.forEach(pedido => {
        const cliente = clientes.find(c => c.id === pedido.clienteId);

        const linha = `
            <tr>
                <td>${pedido.descricao}</td>
                <td>${pedido.valor}</td>
                <td>${pedido.status}</td>
                <td>${cliente ? cliente.nome : "Desconhecido"}</td>
                <td>
                    <a href="editar-pedido.html?id=${pedido.id}" class="btn btn-warning btn-sm">Editar</a>
                    <button class="btn btn-danger btn-sm excluir-btn" data-id="${pedido.id}">Excluir</button>
                </td>
            </tr>
        `;
        tabela.innerHTML += linha;
    });
}

async function excluirPedido(id) {
    if (!confirm("Deseja realmente excluir este pedido?")) return;

    fetch(`http://localhost:8080/pedido/remover/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorMessage => {
                    console.error("Erro ao excluir pedido:", errorMessage);
                    throw new Error(errorMessage);
                });
            }

            alert("Pedido excluído com sucesso!");
            carregarPedidos();
        })
        .catch(error => alert(`Erro ao excluir pedido: ${error.message}`));
}
