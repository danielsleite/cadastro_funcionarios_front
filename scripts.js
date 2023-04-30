/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisiÃ§Ã£o GET
  --------------------------------------------------------------------------------------
*/
const getList = () => {

  let url = 'http://127.0.0.1:5000/funcionarios';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      clear_lista_tela()
      data.funcionarios.forEach(item => insertList(item.login, item.matricula))
      document.getElementById("tit_lista_funcionarios").textContent = "Funcionarios cadastrados # " + data.funcionarios.length;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisiÃ§Ã£o POST
  --------------------------------------------------------------------------------------
*/
const postItem = (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/produto';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botÃ£o close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("X");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}

/*
  --------------------------------------------------------------------------------------
  Função para criar botao load
  --------------------------------------------------------------------------------------
*/
const insertButtonLoad = (parent) => {
  let span = document.createElement("span");
  // let txt = document.createTextNode("\u00D7");
  let txt = document.createTextNode("!");
  span.className = "load";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botÃ£o close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const login = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza escluir o funcionário: " + login + "?")) {
        deleteItem(login)
        alert("Removido!")
        getList()
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para dar o load na tabela, conforme clica na lista
  --------------------------------------------------------------------------------------
*/
const loadElement = () => {
  let load = document.getElementsByClassName("load");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < load.length; i++) {
    load[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const login = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Deseja carregar as informações do funcionario: " + login + "?")) {
        prencheFicha(login)
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para preencher a tabela
  --------------------------------------------------------------------------------------
*/
const prencheFicha = (login) => {

  const formData = new FormData();
  formData.append('login', login);

  let url = 'http://127.0.0.1:5000/ficha';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {

      document.getElementById("campo_nome").value = data.nome;
      document.getElementById("campo_cpf").value = data.cpf;
      document.getElementById("campo_endereco").value = data.endereco;
      document.getElementById("campo_matricula").value = data.matricula;
      document.getElementById("campo_email").value = data.email;
      document.getElementById("campo_login_cadastro").value = data.login;
      document.getElementById("campo_funcao").value = data.funcao;
      document.getElementById("cb_reset_senha").checked = data.alterar_senha;

    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para alterar dados do usuario, baseado no login do mesmo
  --------------------------------------------------------------------------------------
*/
const altera_cadastro_usuario = () => {

  const formData = valida_cadastro();

  var tamanho = 0
  for (var value of formData.values()) {
    tamanho++;
    break;
  }

  if (tamanho > 0) {

    let url = 'http://127.0.0.1:5000/atualiza';
    fetch(url, {
      method: 'put',
      body: formData,
    })
      .then((response) => {
        alert("Atualizações feitas com sucesso");
        response.json();
        getList()
      })
      .catch((error) => {
        // alert(error("mesage"))
        alert("Erro ao tentar atualizar os dados");
        console.error('Error:', error);
      });
  }


}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisiÃ§Ã£o DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/excluir?login=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  if (inputProduct === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
    alert("Quantidade e valor precisam ser nÃºmeros!");
  } else {
    // insertList(inputProduct, inputQuantity, inputPrice)
    postItem(inputProduct, inputQuantity, inputPrice)
    alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  FunÃ§Ã£o para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (login, matricula) => {
  var item = [login, matricula]
  var table = document.getElementById('tabela_lista_usuarios');
  var row = table.insertRow();

  const imgExcluir = new Image();
  imgExcluir.src = "./img/excluir.png"
  imgExcluir.width = 20

  const imgLoad = new Image();
  imgLoad.src = "./img/carregar.png"
  imgLoad.width = 20

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  if (login != "Login" && matricula != "Matricula") {
    insertButton(row.insertCell(-1))
    insertButtonLoad(row.insertCell(-1))

  } else {
    row.insertCell(-1).appendChild(imgExcluir)
    row.insertCell(-1).appendChild(imgLoad)
  }
  removeElement()
  loadElement()

}

/*
--------------------------------------------------------------------------------------
Funcao para realizar o login do usuario
--------------------------------------------------------------------------------------
*/
const realiza_login = () => {

  let login = document.getElementById("campo_login").value;
  let senha = document.getElementById("campo_senha").value;

  if (login === '' || senha === '') {
    alert("Campos login ou senha nao podem estar em branco");
  } else {
    login_post(login, senha)
    // alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
Funcao para realizar o post dos dados do login e captura a resposta do usuario logado
  --------------------------------------------------------------------------------------
*/
const login_post = (login, senha) => {

  const formData = new FormData();
  formData.append('login', login);
  formData.append('senha', senha);

  let url = 'http://127.0.0.1:5000/login';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      let logado = data.logado;
      let reset_senha = data.alterar_senha;
      if (logado) {
        if (reset_senha) { // Caso de flag de reset, habilita o campo para mudar a senha
          document.getElementById("div_reset_senha").style.display = "";
        } else {          // login sem reset de senha
          document.getElementById("ficha").style.display = "";
          document.getElementById("lista_logins").style.display = "";
          document.getElementById("btlogout").style.display = "";
          document.getElementById("titCentral").style.display = "";
          document.getElementById("divisaTabelas").style.display = "";
          document.getElementById("campo_login").style.backgroundColor = "green";
          document.getElementById("div_reset_senha").style.display = "none";
          getList()
        }
      } else {
        document.getElementById("ficha").style.display = "none";
        document.getElementById("lista_logins").style.display = "none";
        document.getElementById("btlogout").style.display = "none";
        document.getElementById("titCentral").style.display = "none";
        document.getElementById("divisaTabelas").style.display = "none";
        document.getElementById("campo_login").style.backgroundColor = "white";
      }
      console.log(`Logado: ${logado}`);
    })
    .catch((error) => {
      alert("Falha ao realizar login");
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
Funcao para enviar dados para novo cadastro POST
  --------------------------------------------------------------------------------------
*/
const cadastra_usuario = () => {

  const formData = valida_cadastro();
  var tamanho = 0
  for (var value of formData.values()) {
    tamanho++;
    break;
  }

  if (tamanho > 0) {

    alert("Verifique a atualização da lista de funcionários para confirmar operação")

    let url = 'http://127.0.0.1:5000/funcionario';
    fetch(url, {
      method: 'post',
      body: formData
    })
      .then((response) => {
        response.json()
        getList()

      })
      .catch((error) => {
        alert(error("mesage"))
        console.error('Error:', error); 
      });
  }
}
/*
  --------------------------------------------------------------------------------------
Funcao para cadastrar novo usuario no banco
  --------------------------------------------------------------------------------------
*/

const valida_cadastro = () => {


  let nome = document.getElementById("campo_nome").value;
  let cpf = document.getElementById("campo_cpf").value;
  let endereco = document.getElementById("campo_endereco").value;
  let matricula = document.getElementById("campo_matricula").value;
  let email = document.getElementById("campo_email").value;
  let login = document.getElementById("campo_login_cadastro").value;
  let funcao = document.getElementById("campo_funcao").value;
  let cadastrado_por = document.getElementById("campo_login").value;
  let alterar_senha = document.getElementById("cb_reset_senha").checked;

  const formData = new FormData();

  if (nome === '' || cpf === '' || endereco === '' || matricula === ' ' || email === '' || funcao === '' || login === '') {
    alert("Não pode haver campos em branco, para realizar o cadastro");
  } else if (isNaN(matricula)) {
    alert("O campo matrícula de ver um número");
  } else {

    formData.append('nome', nome);
    formData.append('cpf', cpf);
    formData.append('endereco', endereco);
    formData.append('funcao', funcao);
    formData.append('matricula', matricula);
    formData.append('email', email);
    formData.append('login', login);
    formData.append('cadastrado_por', cadastrado_por);
    formData.append('alterar_senha', alterar_senha);
  }
  return formData;
}

/*
  --------------------------------------------------------------------------------------
Funcao para limpar a lista de usuarios da tela
  --------------------------------------------------------------------------------------
*/

const clear_lista_tela = () => {

  const table = document.getElementById("tabela_lista_usuarios");

  // Obtém todas as linhas da tabela
  const rows = table.getElementsByTagName("tr");

  // Itera por todas as linhas e as remove
  while (rows.length > 0) {
    table.deleteRow(0);
  }

  //Adiciona a linha de titulo na tabela zerada
  insertList("Login", "Matricula")

  // Obtém a referência para a primeira linha da tabela
  const firstRow = table.rows[0];

  // Altera a classe da priemria linha para manter a formatação da tabela
  firstRow.className = "titulo";

}

/*
  --------------------------------------------------------------------------------------
Realiza refrash na tela, fazendo assim o logtout do usuario
  --------------------------------------------------------------------------------------
*/

const realiza_logout = () => {
  window.location.reload();
}

/*
  --------------------------------------------------------------------------------------
Funcao para alterar a senha do usuario
  --------------------------------------------------------------------------------------
*/

const altera_senha = () => {

  let senha_a = document.getElementById("campo_nova_senha_1").value
  let senha_b = document.getElementById("campo_nova_senha_2").value
  if (senha_a != senha_b) {
    alert("Erro ao atualizar a senha. Os campos da nova senha possuem valores difentes. ")
  } else {

    let login = document.getElementById("campo_login").value

    const formData = new FormData();
    formData.append("login", login)
    formData.append("senha", senha_a)
    formData.append("alterar_senha", false)

    let url = 'http://127.0.0.1:5000/senha';
    fetch(url, {
      method: 'put',
      body: formData,
    })
      .then((response) => {
        response.json()
        alert("Senha atualizada com sucesso!");
        login_post(login, senha_a);
      })
      .catch((error) => {
        alert(error("mesage"))
        // alert("Erro ao tentar atualizar os dados");
        console.error('Error:', error);
      });

  }
}