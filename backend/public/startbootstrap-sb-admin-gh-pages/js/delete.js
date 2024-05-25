function fetchAndPopulateClients() {
    fetch('http://127.0.0.1:5000/api/clientes/', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const clientTable = document.getElementById('client-table').getElementsByTagName('tbody')[0];

        // Limpa os dados existentes na tabela
        clientTable.innerHTML = '';

        // Preenche a tabela com os dados dos clientes
        data.forEach(cliente => {
            const row = `
                <tr>
                    <td>${cliente.id}</td>
                    <td>${cliente.nome}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.telefone}</td>
                    <td>${cliente.cpf}</td>
                    <td class="table-action" style="width: 90px;">
                        <a href="javascript: void(0);" onclick="deleteClient(${cliente.id})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-person-fill-slash black" style="color: #332e00;" viewBox="0 0 16 16">
                                <path d="M13.879 10.414a2.501 2.501 0 0 0-3.465 3.465zm.707.707-3.465 3.465a2.501 2.501 0 0 0 3.465-3.465m-4.56-1.096a3.5 3.5 0 1 1 4.949 4.95 3.5 3.5 0 0 1-4.95-4.95ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                            </svg>
                        </a>
                    </td>
                </tr>
            `;
            clientTable.insertAdjacentHTML('beforeend', row);
        });
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao buscar clientes.');
    });
}

function deleteClient(clienteId) {
    fetch(`http://127.0.0.1:5000/api/clientes/${clienteId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Cliente deletado com sucesso!');
            fetchAndPopulateClients(); // Atualiza a tabela após a deleção
        } else {
            alert('Erro ao deletar cliente.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao deletar cliente.');
    });
}

window.onload = fetchAndPopulateClients;

