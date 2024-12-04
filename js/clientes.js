import { exibirNotificacao } from './util.js';

const apiUrl = 'http://localhost:3000/clientes';

async function listarClientes() {
    const resposta = await fetch(apiUrl);
    const clientes = await resposta.json();
    const tabela = document.querySelector('#tabela-clientes tbody');
    tabela.innerHTML = '';
    clientes.forEach(cliente => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
      <td>${cliente.nome}</td>
      <td>${cliente.cpf}</td>
      <td>${cliente.telefone}</td>
      <td>${cliente.endereco || ''}</td>
      <td>
        <button onclick="editarCliente(${cliente.id})">Editar</button>
        <button onclick="excluirCliente(${cliente.id})">Excluir</button>
      </td>`;
        tabela.appendChild(linha);
    });
}

async function criarCliente(cliente) {
    const resposta = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
    });
    if (resposta.ok) {
        exibirNotificacao('Cliente criado com sucesso!', 'success');
        listarClientes();
    } else {
        exibirNotificacao('Erro ao criar cliente.', 'error');
    }
}

async function excluirCliente(id) {
    const confirmacao = confirm('Tem certeza que deseja excluir este cliente?');
    if (confirmacao) {
        const resposta = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (resposta.ok) {
            exibirNotificacao('Cliente excluído com sucesso!', 'success');
            listarClientes();
        } else {
            exibirNotificacao('Erro ao excluir cliente.', 'error');
        }
    }
}

document.addEventListener('DOMContentLoaded', listarClientes);
