/*!
    * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2023 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    // 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/clientes', {
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

        let tabelaBody = document.querySelector('#tabela-clientes tbody');
        if (!tabelaBody) {
            const tabelaClientes = document.querySelector('#tabela-clientes');
            tabelaBody = document.createElement('tbody');
            tabelaClientes.appendChild(tabelaBody);
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
});





