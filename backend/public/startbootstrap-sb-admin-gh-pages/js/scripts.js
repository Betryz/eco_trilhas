/*!
    * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2023 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    // 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

  
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {

        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});







  

// Função para buscar clientes
async function fetchClientes() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/clientes', {
            method: 'GET'
        });
        const clientes = await response.json();
        return clientes;
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        throw error;
    }
}

// Função para buscar funcionários
async function fetchFuncionarios() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/funcionarios', {
            method: 'GET'
        });
        const funcionarios = await response.json();
        return funcionarios;
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        throw error;
    }
}

// Função para calcular quantos usuários são clientes e quantos são funcionários
async function countUsers() {
    try {
        // Busca clientes e funcionários
        const clientes = await fetchClientes();
        const funcionarios = await fetchFuncionarios();

        // Conta quantos usuários são clientes e quantos são funcionários
        const totalClientes = clientes.length;
        const totalFuncionarios = funcionarios.length;
        
        // Calcula o total de usuários
        const totalUsuarios = totalClientes + totalFuncionarios;

        // Atualiza os valores nos elementos HTML
        document.getElementById('total-usuarios').innerText = totalUsuarios;
        document.getElementById('total-clientes').innerText = totalClientes;
        document.getElementById('total-funcionarios').innerText = totalFuncionarios;

    } catch (error) {
        console.error('Erro ao calcular os usuários:', error);
        alert('Erro ao calcular os usuários.');
    }
} 


// Chama a função para calcular os usuários ao carregar a página
window.onload = countUsers;






