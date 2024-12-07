const API_CLIENTES = "http://localhost:8080/cliente";

window.onload = carregarClientes;

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
            tabela.innerHTML = "";

            // Função para exibir os clientes na tabela
            function exibirClientes(clientesFiltrados) {
                tabela.innerHTML = "";
                clientesFiltrados.forEach(cliente => {
                    const linha = `
                        <tr>
                            <td>${cliente.nome}</td>
                            <td>${cliente.cpf}</td>
                            <td>${cliente.telefone || "Não informado"}</td>
                            <td>${cliente.endereco || "Não informado"}</td>
                            <td>
                                <a href="editar-cliente.html?id=${cliente.id}" class="btn btn-warning btn-sm">Editar</a>
                                <button class="btn btn-danger btn-sm excluir-btn" data-id="${cliente.id}">Excluir</button>
                            </td>
                        </tr>
                    `;
                    tabela.innerHTML += linha;
                });

                document.querySelectorAll('.excluir-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        const id = this.getAttribute('data-id');
                        excluirCliente(id);
                    });
                });
            }

            // Exibir todos os clientes inicialmente
            exibirClientes(clientes);

            // Buscar clientes com base no nome ou CPF
            document.querySelector('#btn-busca').addEventListener('click', () => {
                const busca = document.querySelector('#busca-cliente').value.toLowerCase();
                const clientesFiltrados = clientes.filter(cliente =>
                    cliente.nome.toLowerCase().includes(busca) || cliente.cpf.includes(busca)
                );
                exibirClientes(clientesFiltrados);
            });

            // Também adicionar filtro enquanto o usuário digita
            document.querySelector('#busca-cliente').addEventListener('input', () => {
                const busca = document.querySelector('#busca-cliente').value.toLowerCase();
                const clientesFiltrados = clientes.filter(cliente =>
                    cliente.nome.toLowerCase().includes(busca) || cliente.cpf.includes(busca)
                );
                exibirClientes(clientesFiltrados);
            });
        })
        .catch(error => alert(`Erro ao carregar clientes: ${error.message}`));
}

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

            if (!response.ok) {
                return response.text().then(errorMessage => {
                    console.error("Erro ao excluir cliente:", errorMessage);
                    throw new Error(errorMessage);
                });
            }

            alert("Cliente excluído com sucesso!");
            carregarClientes();
        })
        .catch(error => alert(`Erro ao excluir cliente: ${error.message}`));
}