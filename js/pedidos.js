import { exibirNotificacao } from './util.js';

const apiUrlPedidos = 'http://localhost:3000/pedidos';

async function listarPedidos() {
    const resposta = await fetch(apiUrlPedidos);
    const pedidos = await resposta.json();
    const tabela = document.querySelector('#tabela-pedidos tbody');
    tabela.innerHTML = '';
    pedidos.forEach(pedido => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
      <td>${pedido.descricao}</td>
      <td>R$ ${pedido.valor.toFixed(2)}</td>
      <td>${pedido.status}</td>
      <td>${pedido.Cliente?.nome || ''}</td>
      <td>
        <button onclick="editarPedido(${pedido.id})">Editar</button>
        <button onclick="excluirPedido(${pedido.id})">Excluir</button>
      </td>`;
        tabela.appendChild(linha);
    });
}

async function excluirPedido(id) {
    const confirmacao = confirm('Tem certeza que deseja excluir este pedido?');
    if (confirmacao) {
        const resposta = await fetch(`${apiUrlPedidos}/${id}`, { method: 'DELETE' });
        if (resposta.ok) {
            exibirNotificacao('Pedido excluído com sucesso!', 'success');
            listarPedidos();
        } else {
            exibirNotificacao('Erro ao excluir pedido.', 'error');
        }
    }
}

document.addEventListener('DOMContentLoaded', listarPedidos);
