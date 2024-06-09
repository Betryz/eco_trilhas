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

    }
} 


// Chama a função para calcular os usuários ao carregar a página
window.onload = countUsers;


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ingresso');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Capturando os valores dos campos de entrada
    const data_disponivel = document.getElementById('data_disponivel').value;
    const preco = parseFloat(document.getElementById('preco').value.trim());
    const ingresso_disponivel = parseInt(document.getElementById('ingresso_disponivel').value.trim(), 10);

    console.log("Data disponível:", data_disponivel);
    console.log("Preço:", preco);
    console.log("Ingresso disponível:", ingresso_disponivel);

    // Garantindo que os valores são válidos
    if (isNaN(preco)) {
      alert("O preço deve ser um número válido.");
      return;
    }
    
    if (isNaN(ingresso_disponivel)) {
      alert("A quantidade de ingressos disponíveis deve ser um número válido.");
      return;
    }

    // Formatando a data para o formato ISO-8601 completo
    const validade = new Date(data_disponivel).toISOString();

    console.log("Data formatada:", validade);

    // Recuperando o ID do funcionário do localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.id) {
      alert('Erro: ID do funcionário não encontrado. Faça login novamente.');
      return;
    }
    const funcionarioId = userData.id;
    console.log("ID do funcionário:", funcionarioId);

    // URL da API
    const apiUrl = 'http://127.0.0.1:5000/api/ingressos';

    try {
      // Enviando os dados para a API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingresso_disponivel: ingresso_disponivel.toString(),  // Convertendo para string
          data_disponivel: validade,
          preco: preco.toString(),  // Convertendo para string
          funcionarioId: parseInt(funcionarioId, 10)  // Incluindo o ID do funcionário
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Ingresso cadastrado com sucesso");
      } else {
        alert("Erro ao cadastrar ingresso: " + data.error);
      }

      console.log("Resposta da API:", data);
    } catch (error) {
      console.error('Erro:', error);
      alert("Erro ao cadastrar ingresso: " + error.message);
    }
  });
});





function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}


document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.nome) { // Certifique-se de que a propriedade de nome está correta
    const usernameElement = document.getElementById('username');
    usernameElement.textContent = user.nome; // Atualize esta linha com a propriedade correta do nome do usuário
  } else {
    console.error('Usuário não encontrado no localStorage.');
  }
});
