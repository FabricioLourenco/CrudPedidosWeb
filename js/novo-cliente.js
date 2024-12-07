const API_CLIENTES = "http://localhost:8080/cliente";

document.querySelector("#form-novo-cliente").addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.querySelector("#nome").value;
    const cpf = document.querySelector("#cpf").value;
    const telefone = document.querySelector("#telefone").value;
    const endereco = document.querySelector("#endereco").value || "";


    if (!nome || !cpf || !telefone) {
        alert("Nome, CPF e telefone são obrigatórios.");
        return;
    }

    if (cpf.length !== 11) {
        alert("O CPF deve conter 11 dígitos.");
        return;
    }

    const cliente = { nome, cpf, telefone, endereco };

    console.log(JSON.stringify(cliente));

    fetch(`${API_CLIENTES}/salvar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorMessage => {
                    console.error("Erro ao excluir cliente:", errorMessage);
                    throw new Error(errorMessage);
                });
            }

            alert("Cliente salvo com sucesso!");
            window.location.href = "clientes.html"; // Redireciona para a página de clientes
        })
        .catch(error => alert(`Erro ao salvar cliente: ${error.message}`));
});
