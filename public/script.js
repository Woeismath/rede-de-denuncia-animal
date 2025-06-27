function showPage(page) {
  let content = '';
  switch (page) {
    case 'denuncia':
      content = `
        <section class="formulario">
          <h2>Formulário de Denúncia</h2>
          <p>Use o formulário abaixo para relatar casos de maus tratos aos animais.</p>
          <form id="denuncia-form">
            <label for="nome">Nome:</label>
            <input type="text" id="nome" name="nome" required>
            <label for="email">E-mail:</label>
            <input type="email" id="email" name="email" required>
            <label for="telefone">Telefone:</label>
            <input type="tel" id="telefone" name="telefone" placeholder="(XX) XXXXX-XXXX" required>
            <label for="mensagem">Mensagem:</label>
            <textarea id="mensagem" name="mensagem" rows="5" required></textarea>
            <button type="submit">ENVIAR</button>
          </form>
          <p id="mensagem-status" style="margin-top: 15px;"></p>
        </section>
      `;
      break;
    case 'leis':
      content = `
        <section class="leis">
          <h2>Leis de Proteção Animal</h2>
          <p>Conheça algumas das principais leis que protegem os direitos dos animais no Brasil e em Londrina.</p>

          <div class="lei">
            <h3>Leis Municipais de Londrina</h3>
            <p>A Prefeitura de Londrina mantém uma legislação própria voltada à proteção e bem-estar dos animais, incluindo regras sobre maus-tratos, controle populacional e guarda responsável.</p>
            <p><strong>Mais informações:</strong> <a href="https://portal.londrina.pr.gov.br/legislacao-comupda" target="_blank">Legislação COMUPDA</a></p>
          </div>

          <div class="lei">
            <h3>Direitos dos Animais - Ministério do Meio Ambiente</h3>
            <p>O Ministério do Meio Ambiente apresenta diretrizes e políticas públicas voltadas à proteção da fauna, promoção do bem-estar animal e combate aos maus-tratos.</p>
            <p><strong>Mais informações:</strong> <a href="https://www.gov.br/mma/pt-br/assuntos/biodiversidade-e-biomas/direitos-animais" target="_blank">Direitos Animais - MMA</a></p>
          </div>

          <div class="lei">
            <h3>Leis Federais de Proteção Animal</h3>
            <p>Há diversas leis em vigor no Brasil que protegem os animais, como a Lei de Crimes Ambientais (Lei nº 9.605/98), que criminaliza os maus-tratos e abandono.</p>
            <p><strong>Mais informações:</strong> <a href="https://vereadorafernandamoreno.com.br/leis-que-protegem-os-animais-no-brasil/" target="_blank">Leis que Protegem os Animais</a></p>
          </div>

          <div class="lei">
            <h3>Compilado de Leis de Proteção Animal</h3>
            <p>O Parque Francisco de Assis disponibiliza um compilado de legislações voltadas à proteção animal, abrangendo leis municipais, estaduais e federais.</p>
            <p><strong>Mais informações:</strong> <a href="https://www.parquefranciscodeassis.com.br/leis/" target="_blank">Leis - Parque Francisco de Assis</a></p>
          </div>
        </section>
      `;
      break;
    case 'organizacoes':
      content = `
        <section class="organizacoes">
          <h2>Organizações de Resgate</h2>
          <p>Encontre abrigos e organizações de resgate de animais na sua área.</p>
          <a href="https://www.abrigos.org.br" target="_blank">Encontre organizações aqui.</a>

          <div class="ong">
            <h3>SOS Vida Animal</h3>
            <p>A SOS Vida Animal é uma ONG de Londrina dedicada ao resgate e cuidado de animais em situação de risco, promovendo adoções responsáveis e campanhas de castração.</p>
            <p><strong>Site:</strong> <a href="https://www.sosvidaanimal.org.br/" target="_blank">www.sosvidaanimal.org.br</a></p>
            <p><strong>Contato:</strong> contato@sosvidaanimal.org.br</p>
            <p><strong>Telefone:</strong> (43) 99999-0001</p>
          </div>

          <div class="ong">
            <h3>Projeto Animalize</h3>
            <p>O Projeto Animalize atua em Londrina na proteção, resgate e bem-estar dos animais, com foco em educação e conscientização da sociedade.</p>
            <p><strong>Instagram:</strong> <a href="https://www.instagram.com/projetoanimalize/" target="_blank">@projetoanimalize</a></p>
            <p><strong>Voluntariado:</strong> Envolva-se em ações de resgate e eventos.</p>
            <p><strong>Telefone:</strong> (43) 98888-1234</p>
          </div>

          <div class="ong">
            <h3>Associação Amigo Bicho</h3>
            <p>Associação de proteção animal com foco em adoções, castração e apoio a animais abandonados em Londrina e região.</p>
            <p><strong>Facebook:</strong> <a href="https://www.facebook.com/associacaoamigobicho/" target="_blank">Associação Amigo Bicho</a></p>
            <p><strong>Contato:</strong> amigobicho@gmail.com</p>
            <p><strong>Telefone:</strong> (43) 97777-4567</p>
          </div>

          <div class="ong">
            <h3>ADA - Adote na ADA</h3>
            <p>A ADA é uma organização independente que promove feiras de adoção e apoio à causa animal em Londrina, divulgando pets disponíveis via Instagram.</p>
            <p><strong>Instagram:</strong> <a href="https://www.instagram.com/adote_na_ada/" target="_blank">@adote_na_ada</a></p>
            <p><strong>Informação extra:</strong> A ADA realiza feiras regulares no Shopping Boulevard de Londrina.</p>
            <p><strong>Telefone:</strong> (43) 96666-7890</p>
          </div>
        </section>
      `;
      break;
    default:
      content = `<p>Seção não encontrada.</p>`;
      break;
  }

  document.getElementById('main-content').innerHTML = content;

  if (page === 'denuncia') {
    document.getElementById('denuncia-form').addEventListener('submit', async function (e) {
      e.preventDefault();
      let nome = document.getElementById('nome').value;
      let email = document.getElementById('email').value;
      let telefone = document.getElementById('telefone').value;
      let mensagem = document.getElementById('mensagem').value;

      try {
        const response = await fetch('/enviar-denuncia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, telefone, mensagem })
        });

        const statusText = document.getElementById('mensagem-status');
        if (response.ok) {
          statusText.style.color = 'green';
          statusText.innerText = 'Denúncia enviada com sucesso!';
          document.getElementById('denuncia-form').reset();
        } else {
          statusText.style.color = 'red';
          statusText.innerText = 'Erro ao enviar denúncia. Tente novamente.';
        }
      } catch (error) {
        console.error(error);
        const statusText = document.getElementById('mensagem-status');
        statusText.style.color = 'red';
        statusText.innerText = 'Erro ao conectar com o servidor.';
      }
    });
  }
}

window.onload = function () {
  showPage('denuncia');
};
