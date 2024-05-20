

 
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

    const formattedNascimento = new Date(nascimento).toISOString(); // Converte a data para o formato ISO 8601

    console.log(senha);

    const apiUrl = 'http://127.0.0.1:5000/api/clientes';
    console.log(email);
    console.log(senha);
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

    const data = await response.json();

    if (response.ok) {
      alert("Usuário criado com sucesso");
      window.location.href = "index.html"; // Redireciona para index.html
    } else {
      alert("Erro ao criar usuário: " + data.error);
    }

    console.log(data);
  });
});



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
    
    

    

    const formattedNascimento = new Date(nascimento);// Converte a data para o formato ISO 8601

    console.log(senha);

    const apiUrl = 'http://127.0.0.1:5000/api/funcionarios';
    console.log(email);
    console.log(senha);
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

    const data = await response.json();

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



document.addEventListener('DOMContentLoaded' , () => {
  const form = document.getElementById('login');

  form.addEventListener('submit' , async (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value.trim();
    


      console.log(senha);

      const apiUrl = 'http://127.0.0.1:5000/api/clientes/login'
      console.log(email);
      console.log(senha)
      const response = await fetch(apiUrl, {
          method: "POST",  
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify( {
              email: email
             
          })
      });

      const data = await response.json();

          if(response.ok) {
              alert('Usuário criado com sucesso')
          }


      console.log(data);


        })

        })