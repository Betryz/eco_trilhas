document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar Simple-DataTables
    const datatablesSimple = document.getElementById('datatablesSimple');
    if (datatablesSimple) {
        new simpleDatatables.DataTable(datatablesSimple);
    }

    // Função para carregar dados na tabela
    async function loadTableData(id = '') {
        try {
            let url = 'http://127.0.0.1:5000/api/clientes';
            if (id) {
                url += `?id=${id}`;
            }
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const clientes = await response.json();

            let tabelaBody = document.querySelector('#datatablesSimple tbody');
            if (!tabelaBody) {
                tabelaBody = document.createElement('tbody');
                datatablesSimple.appendChild(tabelaBody);
            } else {
                tabelaBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados
            }

            let html = '';
            clientes.forEach(cliente => {
                html += `
                    <tr>
                        <td>${cliente.id}</td>
                        <td>${cliente.nome}</td>
                        <td>${cliente.cpf}</td>
                        <td>${cliente.email}</td>
                        <td>${cliente.nascimento}</td>
                        <td>${cliente.telefone}</td>
                      
                    </tr>
                `;
            });
            tabelaBody.innerHTML = html; // Adiciona todos os elementos de uma vez
        } catch (error) {
            console.error('Erro ao carregar clientes:', error.message);
            // Trate o erro conforme necessário
        }
    }

    // Carregar dados iniciais
    loadTableData();

    // Adicionar evento de pesquisa
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim();
        loadTableData(searchTerm);
    });
});







