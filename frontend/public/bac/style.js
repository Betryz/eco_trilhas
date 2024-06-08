
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

    if (senha !== senha2) {
      alert("Senhas não conferem!");
      throw new Error("Senhas não conferem");
    }
    if (senha.length < 8) {
      alert("A senha deve ter no mínimo 8 caracteres");
      throw new Error("A senha deve ter no mínimo 8 caracteres");
    }

    if (!isValidDate(nascimento)) {
      alert("Data de nascimento inválida!");
      throw new Error("Data de nascimento inválida!");
    }

    const formattedNascimento = new Date(nascimento).toISOString();

    console.log(senha);

    const apiUrl = 'http://127.0.0.1:5000/api/clientes';
  
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
      const responseData = await response.json();
      console.log('Dados da resposta:', responseData); // Adicione esta linha para depurar a resposta da API
      if (responseData.user) {
        localStorage.setItem('user', JSON.stringify(responseData.user));
        localStorage.setItem('token', responseData.token);
        alert('Login bem-sucedido');
        window.location.href = "../../../backend/public/startbootstrap-sb-admin-gh-pages/index.html";
      } else {
        alert('Erro: dados de usuário não encontrados na resposta da API.');
      }
    } else {
      const errorData = await response.json();
      console.error('Erro na solicitação:', errorData); // Adicione esta linha para depurar o erro na solicitação
      alert(errorData.error || 'Falha no login. Verifique suas credenciais.');
    }
    
    
    console.log(data);
  });
});

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
      window.location.href = "index.html"; // Redireciona para index.html
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



