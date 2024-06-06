document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.nome) { // Certifique-se de que a propriedade de nome está correta
      const usernameElement = document.getElementById('username');
      usernameElement.textContent = user.nome; // Atualize esta linha com a propriedade correta do nome do usuário
    } else {
      console.error('Usuário não encontrado no localStorage.');
    }
  });