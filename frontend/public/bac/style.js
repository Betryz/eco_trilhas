document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastro');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
    const nascimento = document.getElementById('nascimento').value;
    const telefone = document.getElementById('telefone').value.replace(/\D/g, '');
    const senha = document.getElementById('senha').value.trim();
    const senha2 = document.getElementById('senha1').value.trim();

    // Validações
    if (senha !== senha2) {
      alert("Senhas não conferem!");
      return;
    }
    if (senha.length < 8) {
      alert("A senha deve ter no mínimo 8 caracteres");
      return;
    }
    if (!isValidDate(nascimento)) {
      alert("Data de nascimento inválida!");
      return;
    }

    const formattedNascimento = new Date(nascimento).toISOString();

    const apiUrl = 'http://127.0.0.1:5000/api/clientes';

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          cpf: cpf,
          telefone: telefone,
          nascimento: formattedNascimento,
          email: email,
          password: senha
        })
      });
      // Verifique o status da resposta
      if (response.ok) {
        const responseData = await response.json();
        console.log('Dados da resposta:', responseData); // Debug da resposta da API
       
          localStorage.setItem('user', JSON.stringify(responseData.user));
          localStorage.setItem('token', responseData.token);
          alert('Cadastro bem-sucedido');
          window.location.href = "fora.html"; 
        
      } else {
        const errorData = await response.json();
        console.error('Erro na solicitação:', errorData); // Debug do erro na solicitação
        alert(errorData.error || 'Falha no cadastro. Verifique os dados.');
      }
    } catch (error) {
      console.error('Erro inesperado:', error); // Tratamento de erro inesperado
      alert('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    }
  });
});
// Função para validar a data
function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastra');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
    const nascimento = document.getElementById('nascimento').value;
    const telefone = document.getElementById('telefone').value.replace(/\D/g, '');
    const senha = document.getElementById('senha').value.trim();
    const senha2 = document.getElementById('senha1').value.trim();
    if (senha !== senha2) {
      alert("Senhas não conferem!");
      throw new Error("Senhas não conferem");
    }
    const formattedNascimento = new Date(nascimento).toISOString().split('T')[0];
    const apiUrl = 'http://127.0.0.1:5000/api/funcionarios';
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: nome,
        cpf: cpf,
        telefone: telefone,
        nascimento: formattedNascimento, // Use a data formatada
        email: email,
        password: senha
      })
    });
    if (response.ok) {
      alert("Usuário criado com sucesso");
      window.location.href = "index.html"; 
    
    } else {
      alert("Erro ao criar usuário: " + data.error);
    }
    console.log(data);
  });
});
// Função para validar a data
function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}



document.addEventListener('DOMContentLoaded', () => {
  // Selecionar o formulário correto com base no valor do botão
  const formCliente = document.getElementById('loginCliente');
  const formFuncionario = document.getElementById('loginFuncionario');
  if (formCliente) {
    formCliente.addEventListener('submit', async (event) => {
      event.preventDefault();
      const emailInput = document.getElementById('emailCliente');
      const senhaInput = document.getElementById('senhaCliente');
      // Verifica se os campos de email e senha existem
      if (emailInput && senhaInput) {
        const email = emailInput.value;
        const senha = senhaInput.value.trim();
        const apiUrl = 'http://127.0.0.1:5000/api/clientes/login';
        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password: senha })
          });
          if (response.ok) {
            const data = await response.json();
            if (data.user && data.token) {
              localStorage.setItem('user', JSON.stringify(data.user));
              localStorage.setItem('token', data.token); // Armazene o token JWT no localStorage
              alert('Login bem-sucedido');
              window.location.href = "index.html"; //
             // Redireciona para index.html
            } else {
              alert('Falha no login. Dados de resposta inválidos.');
            }
          } else {
            const errorData = await response.json();
            alert(errorData.error || 'Falha no login. Verifique suas credenciais.');
          }
        } catch (error) {
          console.error('Erro na solicitação:', error);
          alert('Erro ao tentar fazer login. Por favor, tente novamente.');
        }
      } else {
        console.error('Elementos de email ou senha não encontrados.');
      }
    });
  }

  if (formFuncionario) {
    formFuncionario.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('emailFuncionario').value;
      const senha = document.getElementById('senhaFuncionario').value.trim();

      const apiUrl = 'http://127.0.0.1:5000/api/funcionarios/login';

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password: senha })
        });
        if (response.ok) {
          const data = await response.json();
          // Verificando os dados recebidos
          console.log("Dados recebidos do backend:", data);
          // Salvando os dados do usuário no localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token); // Armazene o token JWT no localStorage
          alert('Login bem-sucedido');
          // Redireciona para index.html
          window.location.href = "../../../backend/public/startbootstrap-sb-admin-gh-pages/index.html";
          // Inserir código para pegar o ID do funcionário e preencher o campo hidden do formulário de ingresso
          const funcionarioId = data.user.id; // ID do funcionário
          console.log("ID do funcionário:", funcionarioId);
        } else {
          const errorData = await response.json();
          console.log("Erro de resposta da API:", errorData); // Adiciona log para erros da API
          alert(errorData.error || 'Falha no login. Verifique suas credenciais.');
        }
      } catch (error) {
        console.error('Erro na solicitação:', error);
        alert('Erro ao tentar fazer login. Por favor, tente novamente.');
      }
    });
  }
});
// Função para validar a data
function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}
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
      const apiUrl = `http://127.0.0.1:5000/api/clientes/${tokenData.id}`;
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
      const apiUrl = `http://127.0.0.1:5000/api/clientes/${tokenData.id}`;
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
        window.location.href = "cadastro.html"; // Redirecione para a página de login
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
      const apiUrl = `http://127.0.0.1:5000/api/clientes/${tokenData.id}`;
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
