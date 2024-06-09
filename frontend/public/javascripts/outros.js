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
