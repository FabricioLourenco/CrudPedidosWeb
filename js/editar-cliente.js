const API_CLIENTES = "http://localhost:8080/cliente";
const urlParams = new URLSearchParams(window.location.search);
const clienteId = urlParams.get("id");


fetch(`${API_CLIENTES}/${clienteId}`)
    .then(response => response.json())
    .then(cliente => {
        document.querySelector("#nome").value = cliente.nome;
        document.querySelector("#cpf").value = cliente.cpf;
        document.querySelector("#telefone").value = cliente.telefone;
        document.querySelector("#endereco").value = cliente.endereco;
    })
    .catch(error => {
        console.error("Erro ao carregar cliente:", error);
        alert("Erro ao carregar os dados do cliente.");
    });


document.querySelector("#form-editar-cliente").onsubmit = function (e) {
    e.preventDefault();

    const nome = document.querySelector("#nome").value;
    const cpf = document.querySelector("#cpf").value;
    const telefone = document.querySelector("#telefone").value;
    const endereco = document.querySelector("#endereco").value;

    if (!nome || !cpf || !telefone) {
        alert("Nome , CPF e telefone são obrigatórios.");
        return;
    }

    const cliente = { nome, cpf, telefone, endereco };

    fetch(`${API_CLIENTES}/editar/${clienteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
    })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao editar cliente.");
            alert("Cliente editado com sucesso!");
            window.location.href = "clientes.html";
        })
        .catch(error => alert(`Erro ao editar cliente: ${error}`));
};
