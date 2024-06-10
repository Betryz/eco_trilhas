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

        // Conta quantos usuários são clientes e quantos são funcionário
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
//get do nome do usuario
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    if (user.nome) {
      updateUserNameDisplay(user.nome);
    } else if (user.email) {
      updateUserNameDisplay(user.email);
    } else {
      console.error('Nome de usuário ou email não encontrados no localStorage.');
    }
  } else {
    console.error('Usuário não encontrado no localStorage.');
  }
});

function updateUserNameDisplay(data) {
  const usernameElement = document.getElementById('username');
  const userEmailElement = document.getElementById('userEmail');
  
  if (usernameElement) {
    usernameElement.textContent = data;
  }
  
  if (userEmailElement) {
    userEmailElement.textContent = data;
  }
}




document.addEventListener("DOMContentLoaded", () => {
  const saveChangesButton = document.querySelector("#saveChanges");
  const cancelButton = document.querySelector("#cancel");

  saveChangesButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const nome = document.querySelector("#nome").value;
    const email = document.querySelector("#email").value;
    const telefone = document.querySelector("#telefone").value;
    const cpf = document.querySelector("#cpf").value;
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado.');
      alert('Por favor, faça login novamente.');
      return;
    }
    if (isTokenExpired(token)) {
      console.error('Token expirado.');
      alert('Sua sessão expirou. Por favor, faça login novamente.');
      return;
    }
    const tokenData = decodeToken(token);
    if (!tokenData) {
      console.error('Token inválido.');
      return;
    }
    console.log(tokenData);
    try {
      const apiUrl = `http://127.0.0.1:5000/api/funcionarios/${tokenData.id}`;
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          telefone: telefone,
          cpf: cpf,
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro ao atualizar usuário:', errorText);
        alert(`Erro ao atualizar usuário: ${errorText}`);
        return;
      }
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data));
      alert('Usuário atualizado com sucesso!');
      // Atualiza a exibição do nome no frontend
      const usernameElement = document.getElementById('username');
      if (usernameElement) {
        usernameElement.textContent = data.nome;
      }
      // Recarrega a página
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error.message);
      alert('Erro ao atualizar usuário. Por favor, tente novamente.');
    }
  });
  cancelButton.addEventListener("click", () => {
    document.querySelector("#nome").value = '';
    document.querySelector("#email").value = '';
    document.querySelector("#telefone").value = '';
    document.querySelector("#cpf").value = '';
  });
});

function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Erro ao decodificar token:', e);
    return null;
  }
}

function isTokenExpired(token) {
  const tokenData = decodeToken(token);
  if (!tokenData || !tokenData.exp) {
    return true;
  }
  const currentTime = Math.floor(Date.now() / 1000);
  return tokenData.exp < currentTime;
}


document.addEventListener("DOMContentLoaded", () => {
  const deleteAccountBtn = document.querySelector("#deleteAccountBtn");
  deleteAccountBtn.addEventListener("click", async () => {
    const confirmCheckbox = document.querySelector("#confirm");
    if (!confirmCheckbox.checked) {
      alert('Por favor, confirme que deseja deletar sua conta.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token não encontrado. Por favor, faça login novamente.');
      return;
    }
    const tokenData = decodeToken(token);
    if (!tokenData) {
      alert('Token inválido. Por favor, faça login novamente.');
      return;
    }
    if (isTokenExpired(token)) {
      alert('Sua sessão expirou. Por favor, faça login novamente.');
      return;
    }
    try {
      const apiUrl = `http://127.0.0.1:5000/api/funcionarios/${tokenData.id}`;
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.ok) {
        alert('Conta deletada com sucesso.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = "../../../frontend/public/site/fora.html"; // Redirecione para a página de login
      } else {
        const errorText = await response.text();
        console.error('Erro ao deletar conta:', errorText);
        alert(`Erro ao deletar conta: ${errorText}`);
      }
    } catch (error) {
      console.error('Erro ao deletar conta:', error.message);
      alert('Erro ao deletar conta. Por favor, tente novamente.');
    }
  });
});

function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Erro ao decodificar token:', e);
    return null;
  }
}

function isTokenExpired(token) {
  const tokenData = decodeToken(token);
  if (!tokenData || !tokenData.exp) {
    return true;
  }
  const currentTime = Math.floor(Date.now() / 1000);
  return tokenData.exp < currentTime;
}
document.addEventListener("DOMContentLoaded", () => {
  const saveChangesBtn = document.querySelector("#saveChangesBtn");
  const cancelButton = document.querySelector("#cancelBtn");
  saveChangesBtn.addEventListener("click", async () => {
    const currentPass = document.querySelector("#current-pass").value;
    const newPass = document.querySelector("#new-pass").value;
    const confirmPass = document.querySelector("#confirm-pass").value;
    if (newPass !== confirmPass) {
      alert('A nova senha e a confirmação de senha não coincidem.');
      return;
    }
    if (newPass.length < 8) {
      alert('A nova senha deve ter no mínimo 8 caracteres.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token não encontrado. Por favor, faça login novamente.');
      return;
    }
    const tokenData = decodeToken(token);
    if (!tokenData) {
      alert('Token inválido. Por favor, faça login novamente.');
      return;
    }
    if (isTokenExpired(token)) {
      alert('Sua sessão expirou. Por favor, faça login novamente.');
      return;
    }
    try {
      const apiUrl = `http://127.0.0.1:5000/api/funcionarios/${tokenData.id}`;
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPass })
      });
      if (response.ok) {
        alert('Senha alterada com sucesso.');
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Erro ao alterar senha: ${errorData.error || 'Erro desconhecido.'}`);
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error.message);
      alert('Erro ao alterar senha. Por favor, tente novamente.');
    }
  });
  cancelButton.addEventListener("click", () => {
    document.querySelector("#current-pass").value = '';
    document.querySelector("#new-pass").value = '';
    document.querySelector("#confirm-pass").value = '';
  });
});

function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Erro ao decodificar token:', e);
    return null;
  }
}

function isTokenExpired(token) {
  const tokenData = decodeToken(token);
  if (!tokenData || !tokenData.exp) {
    return true;
  }
  const currentTime = Math.floor(Date.now() / 1000);
  return tokenData.exp < currentTime;
}
