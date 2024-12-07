// URLs da API para Clientes
const API_CLIENTES = "http://localhost:8080/cliente";

// Carregar lista de clientes ao iniciar
window.onload = carregarClientes;

// Carregar clientes do banco e exibir na tabela
function carregarClientes() {
    fetch(`${API_CLIENTES}/listar`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao carregar os clientes.");
            }
            return response.json();
        })
        .then(clientes => {
            const tabela = document.querySelector("#tabela-clientes tbody");
            tabela.innerHTML = ""; // Limpa a tabela antes de preencher novamente
            clientes.forEach(cliente => {
                const linha = `
                    <tr>
                        <td>${cliente.nome}</td>
                        <td>${cliente.cpf}</td>
                        <td>${cliente.telefone || "Não informado"}</td>
                        <td>${cliente.endereco || "Não informado"}</td>
                        <td>
                            <button class="btn btn-warning btn-sm editar-btn" data-id="${cliente.id}">Editar</button>
                            <button class="btn btn-danger btn-sm excluir-btn" data-id="${cliente.id}">Excluir</button>
                        </td>
                    </tr>
                `;
                tabela.innerHTML += linha;
            });

            // Adicionar eventos de clique para os botões de Editar e Excluir
            document.querySelectorAll('.editar-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const id = this.getAttribute('data-id');
                    editarCliente(id);
                });
            });

            document.querySelectorAll('.excluir-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const id = this.getAttribute('data-id');
                    excluirCliente(id);
                });
            });
        })
        .catch(error => alert(`Erro ao carregar clientes: ${error.message}`));
}

// Criar Cliente
document.querySelector("#btn-novo-cliente").onclick = function () {
    const nome = prompt("Nome do Cliente:");
    const cpf = prompt("CPF do Cliente:");
    const telefone = prompt("Telefone do Cliente (opcional):");
    const endereco = prompt("Endereço do Cliente (opcional):");

    if (!nome || !cpf) {
        alert("Nome e CPF são obrigatórios.");
        return;
    }

    const cliente = { nome, cpf, telefone, endereco };

    fetch(`${API_CLIENTES}/salvar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
    })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao salvar cliente.");
            alert("Cliente salvo com sucesso!");
            carregarClientes();
        })
        .catch(error => alert(`Erro ao salvar cliente: ${error}`));
};

// Editar Cliente
function editarCliente(id) {
    fetch(`${API_CLIENTES}/${id}`)
        .then(response => response.json())
        .then(cliente => {
            const nome = prompt("Nome do Cliente:", cliente.nome);
            const cpf = prompt("CPF do Cliente:", cliente.cpf);
            const telefone = prompt("Telefone do Cliente:", cliente.telefone || "");
            const endereco = prompt("Endereço do Cliente:", cliente.endereco || "");

            // Validação
            if (!nome || !cpf) {
                alert("Nome e CPF são obrigatórios.");
                return;
            }

            const clienteAtualizado = { nome, cpf, telefone, endereco };

            fetch(`${API_CLIENTES}/editar`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(clienteAtualizado),
            })
                .then(response => {
                    if (!response.ok) throw new Error("Erro ao editar cliente.");
                    alert("Cliente atualizado com sucesso!");
                    carregarClientes();
                })
                .catch(error => alert(`Erro ao editar cliente: ${error.message}`));
        });
}


function excluirCliente(id) {
    if (!confirm("Deseja realmente excluir este cliente?")) return;

    fetch(`http://localhost:8080/cliente/remover/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            // Verificar se a resposta é ok (status 2xx)
            if (!response.ok) {
                return response.text().then(errorMessage => {
                    console.error("Erro ao excluir cliente:", errorMessage);
                    throw new Error(errorMessage); // Lançar a mensagem de erro como exceção
                });
            }

            alert("Cliente excluído com sucesso!");
            carregarClientes();
        })
        .catch(error => alert(`Erro ao excluir cliente: ${error.message}`));
}


