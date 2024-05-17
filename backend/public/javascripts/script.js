window.addEventListener('DOMContentLoaded', () => {
    const scrollBtn = document.querySelector('.back-top');
    const header = document.querySelector('header');

    const addClassOnScroll = () => {
      if (window.scrollY > header.offsetHeight) {
        scrollBtn.style.display = 'block';
      } else {
        scrollBtn.style.display = 'none';
      }
    };

    window.addEventListener('scroll', () => {
      addClassOnScroll();
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });


  

    function search(event) {
      event.preventDefault(); // Evita o comportamento padrão de envio do formulário

      var query = document.getElementById('searchInput').value;

      // Redirecionar para páginas diferentes com base na consulta de pesquisa
      if (query.toLowerCase() === "guia") {
        window.location.href = "info.html";
      } else if (query.toLowerCase() === "ingressos") {
        window.location.href = "ingresso.html";
      } else if (query.toLowerCase() === "contatos") {
        window.location.href = "contatos.html";
      }
      else if (query.toLowerCase() === "visitas") {
        window.location.href = "index.html";
      }
      else if (query.toLowerCase() === "mudanças") {
        window.location.href = "mudanças.html";
      } else if (query.toLowerCase() === "ajuda") {
        window.location.href = "ajuda.html";
      }




      else {
        // Se a consulta não corresponder a nenhum produto, redirecionar para uma página de resultados genérica
        window.location.href = "pagina_resultados.html?query=" + encodeURIComponent(query);
      }
    }

    document.addEventListener("DOMContentLoaded", function () {
      // Associar a função search ao evento de envio do formulário
      var form = document.querySelector("form");
      form.addEventListener("submit", search);
    });
  
    // Função para mudar a cor de fundo do site
    function changeBackgroundColor(color) {
      document.body.style.backgroundColor = color;
    }







    document.querySelectorAll('.mode-switch').forEach(function (button) {
      button.addEventListener('click', function () {
        var mode = this.parentElement.getAttribute('data-bs-theme-value');
        switch (mode) {
          case 'light':
            changeTheme('#EBE8CE', '#332e00', 'logo_light.png');
            break;
          case 'dark':
            changeTheme('#332e00', '#fff', 'logo_dark.png');
            // Atualizar estilos dos elementos de navegação para o modo escuro
            document.querySelectorAll('.nav-link').forEach(function(link) {
              link.classList.add('dark-mode-link'); // Adiciona classe para estilos de modo escuro
            });
            break;
          case 'auto':
            changeTheme('#c0bb91', '#332e00', 'logo_auto.png');
            break;
        }
        localStorage.setItem('site_theme', mode); // Salvar o tema selecionado
      });
    });
    
    function changeTheme(bgColor, textColor, imgSrc) {
      // Altera a cor de fundo do corpo
      document.body.style.backgroundColor = bgColor;
      // Altera a cor do texto de todos os elementos do corpo
      document.body.style.color = textColor;
      // Altera a fonte do logotipo
      document.getElementById('logoImg').src = imgSrc;
      // Você também pode adicionar mais estilos para outras partes do seu site, como links, botões, etc.
    }
    
    // Carregar o tema ao carregar a página
    document.addEventListener('DOMContentLoaded', function () {
      var savedTheme = localStorage.getItem('site_theme');
      if (savedTheme) {
        // Se um tema estiver salvo, carregar o tema correspondente
        switch (savedTheme) {
          case 'light':
            changeTheme('#EBE8CE', '#332e00', 'logo_light.png');
            break;
          case 'dark':
            changeTheme('#332e00', '#fff', 'logo_dark.png');
            // Atualizar estilos dos elementos de navegação para o modo escuro
            document.querySelectorAll('.nav-link').forEach(function(link) {
              link.classList.add('dark-mode-link'); // Adiciona classe para estilos de modo escuro
            });
            break;
          case 'auto':
            changeTheme('#c0bb91', '#332e00', 'logo_auto.png');
            break;
        }
      } else {
        // Se nenhum tema estiver salvo, usar o tema padrão (light)
        changeTheme('#EBE8CE', '#332e00', 'logo_light.png');
      }
    });
    
 

    function enviarSelecoes() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const selecoes = Array.from(checkboxes).map(checkbox => {
          return {
            nome: checkbox.parentNode.querySelector('span').textContent.trim(),
            selecionado: checkbox.checked
          };
        });
        const queryParams = new URLSearchParams();
        selecoes.forEach((selecao, index) => {
          queryParams.append(`selecao${index}`, `${selecao.nome}:${selecao.selecionado}`);
        });
        const queryString = queryParams.toString();
        window.location.href = `compra.html?${queryString}`;
      }


 
      document.addEventListener("DOMContentLoaded", function () {
        const currentMonthElement = document.getElementById("currentMonth");
        const prevMonthBtn = document.getElementById("prevMonthBtn");
        const nextMonthBtn = document.getElementById("nextMonthBtn");
        const daysContainer = document.getElementById("daysContainer");
  
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let currentMonthIndex = months.indexOf(currentMonthElement.textContent);
  
        // Função para atualizar os dias do calendário com base no mês atual
        function updateCalendar() {
          const daysInMonth = new Date(new Date().getFullYear(), currentMonthIndex + 1, 0).getDate();
          const firstDayOfMonth = new Date(new Date().getFullYear(), currentMonthIndex, 1).getDay();
  
          daysContainer.innerHTML = ""; // Limpa o conteúdo anterior dos dias do calendário
  
          for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement("button");
            emptyDay.className = "btn cal-btn";
            emptyDay.disabled = true;
            daysContainer.appendChild(emptyDay);
          }
  
          for (let i = 1; i <= daysInMonth; i++) {
            const dayButton = document.createElement("button");
            dayButton.className = "btn cal-btn";
            dayButton.textContent = i;
            daysContainer.appendChild(dayButton);
          }
        }
  
        // Atualizar o mês e recarregar o calendário ao clicar nos botões de navegação
        prevMonthBtn.addEventListener("click", function () {
          currentMonthIndex = (currentMonthIndex === 0) ? 11 : currentMonthIndex - 1;
          currentMonthElement.textContent = months[currentMonthIndex];
          updateCalendar();
        });
  
        nextMonthBtn.addEventListener("click", function () {
          currentMonthIndex = (currentMonthIndex === 11) ? 0 : currentMonthIndex + 1;
          currentMonthElement.textContent = months[currentMonthIndex];
          updateCalendar();
        });
  
        // Inicializar o calendário
        updateCalendar();
      });


    


    const getPreferredTheme = () => {
      if (storedTheme) {
        return storedTheme
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    const setTheme = function (theme) {
      if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
      } else {
        document.documentElement.setAttribute('data-bs-theme', theme)
      }
    }

    setTheme(getPreferredTheme())

    window.addEventListener('DOMContentLoaded', () => {
      var el = document.querySelector('.theme-icon-active');
      if (el != 'undefined' && el != null) {
        const showActiveTheme = theme => {
          const activeThemeIcon = document.querySelector('.theme-icon-active use')
          const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
          const svgOfActiveBtn = btnToActive.querySelector('.mode-switch use').getAttribute('href')

          document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
            element.classList.remove('active')
          })

          btnToActive.classList.add('active')
          activeThemeIcon.setAttribute('href', svgOfActiveBtn)
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
          if (storedTheme !== 'light' || storedTheme !== 'dark') {
            setTheme(getPreferredTheme())
          }
        })

        showActiveTheme(getPreferredTheme())

        document.querySelectorAll('[data-bs-theme-value]')
          .forEach(toggle => {
            toggle.addEventListener('click', () => {
              const theme = toggle.getAttribute('data-bs-theme-value')
              localStorage.setItem('theme', theme)
              setTheme(theme)
              showActiveTheme(theme)
            })
          })

      }
    })

   
    window.onload = function() {
        const urlParams = new URLSearchParams(window.location.search);
        const precoTotal = urlParams.get('preco');
        document.getElementById('valoresSelecionados').innerText = 'Preço Total: $' + precoTotal;
    }



document.getElementById("btn").addEventListener("click", () => {
let text = document.getElementById("text").value;
JsBarcode("#barcode", text);
});


document.addEventListener("click", function(event) {
  var dropdownMenu = document.querySelector(".tp");
  var button = document.querySelector(".navbar-toggler");

  // Verifica se o clique foi fora do menu e se o menu está aberto
  if (!dropdownMenu.contains(event.target) && dropdownMenu.classList.contains("show")) {
      // Fecha o menu
      var bsDropdown = new bootstrap.Dropdown(button);
      bsDropdown.hide();
  }
});


      document.addEventListener('click', function(event) {
            var dmPer = document.getElementById('dm-per');
            var toggleButton = document.getElementById('toggleButton');
            var target = document.getElementById('navbarToggleExternalContent');
    
            // Se o clique ocorrer fora da div dm-per e do botão de colapso, fecha a caixa de conteúdo
            if (!dmPer.contains(event.target) && !toggleButton.contains(event.target)) {
                target.classList.remove('show');
                toggleButton.setAttribute('aria-expanded', 'false');
            }
        });