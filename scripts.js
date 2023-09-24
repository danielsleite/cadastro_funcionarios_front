/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisiÃ§Ã£o GET
  --------------------------------------------------------------------------------------
*/
const getList = () => {

  let url = 'http://127.0.0.1:5002/funcionarios';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      clear_lista_tela()
      data.funcionarios.forEach(item => insertList(item.login, item.matricula, item.cpf))
      document.getElementById("tit_lista_funcionarios").textContent = "Funcionarios cadastrados # " + data.funcionarios.length;
    })
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
  Função para preencher a a ficha completa do funcionario
  --------------------------------------------------------------------------------------
*/
const prencheFicha = (login) => {

  const formData = new FormData();
  formData.append('login', login);

  let url = 'http://127.0.0.1:5002/ficha_completa';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {

      document.getElementById("campo_nome").value = data.nome;
      document.getElementById("campo_cpf").value = data.cpf;
      document.getElementById("campo_cep_cadastro").value = data.cep;
      document.getElementById("campo_rua_cadastro").value = data.rua;
      document.getElementById("campo_bairro_cadastro").value = data.bairro;
      document.getElementById("campo_cidade_cadastro").value = data.cidade;
      document.getElementById("campo_estado_cadastro").value = data.estado;
      document.getElementById("campo_matricula").value = data.matricula;
      document.getElementById("campo_email").value = data.email;
      document.getElementById("campo_login_cadastro").value = data.login;
      document.getElementById("campo_funcao").value = data.funcao;
      document.getElementById("cb_reset_senha").checked = Boolean(data.alterar_senha);

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

const altera_cadastro_pessoa = () => {
  const formData = valida_cadastro_pessoa();

  var tamanho = 0
  for (var value of formData.values()) {
    tamanho++;
    break;
  }

  if (tamanho > 0) {

    let url = 'http://127.0.0.1:5001/pessoa_atualiza';
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
  Atualiza os dados cadastrar dos campos funcionarios da api funcionario
*/

const altera_cadastro_funcionario = () => {

  const formData = valida_cadastro_funcionario();

  var tamanho = 0
  for (var value of formData.values()) {
    tamanho++;
    break;
  }

  if (tamanho > 0) {

    let cpf = document.getElementById("campo_cpf").value;
    let url = 'http://127.0.0.1:5002/atualiza?cpf=' + cpf;
    fetch(url, {
      method: 'put',
      body: formData,
    })
      .then((response) => {
        alert("Atualizações feitas com sucesso do funcionário de cpf: " + cpf);
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
  Atualiza dados cadastras da api de cadastro de pessoa e de cadastro de funcionario
*/

const altera_cadastro_usuario = () => {

  const formData = valida_cadastro();

  var tamanho = 0
  for (var value of formData.values()) {
    tamanho++;
    break;
  }

  if (tamanho > 0) {
    altera_cadastro_pessoa();
    altera_cadastro_funcionario();
    let alterar_senha = Boolean(document.getElementById("cb_reset_senha").checked);
    if (alterar_senha) {
      reset_senha()
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisiÃ§Ã£o DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5002/excluir?login=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });

  let url_login = 'http://127.0.0.1:5000/login_excluir?login=' + item;
  fetch(url_login, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  FunÃ§Ã£o para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (login, matricula, cpf) => {
  var item = [login, matricula, cpf]
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

  let url = 'http://127.0.0.1:5000/login_validacao';
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
        alert("Erro ao tentar fazer o login. Verifique campos login e senha")
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
Funcao para enviar dados para novo login
  --------------------------------------------------------------------------------------
*/
const cadastra_login = () => {

  const formData = valida_cadastro_login();
  var tamanho = 0
  for (var value of formData.values()) {
    tamanho++;
    break;
  }

  if (tamanho > 0) {

    alert("Verifique a atualização da lista de funcionários para confirmar operação")

    let url = 'http://127.0.0.1:5000/login_cadastro';
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
Funcao para validar ficha de cadastro de login
  --------------------------------------------------------------------------------------
*/

const valida_cadastro_login = () => {

  let email = document.getElementById("campo_email").value;
  let login = document.getElementById("campo_login_cadastro").value;
  let cadastrado_por = document.getElementById("campo_login").value;
  let alterar_senha = "True";

  const formData = new FormData();

  if (email === '' || login === '' || cadastrado_por === '') {
    alert("Não pode haver campos em branco, para realizar o cadastro");
  } else {

    formData.append('email', email);
    formData.append('login', login);
    formData.append('cadastrado_por', cadastrado_por);
    formData.append('alterar_senha', alterar_senha);
  }
  return formData;
}

/*
  --------------------------------------------------------------------------------------
Funcao para enviar dados para novo cadastro POST
  --------------------------------------------------------------------------------------
*/
const cadastra_pessoa = () => {

  const formData = valida_cadastro();
  var tamanho = 0
  for (var value of formData.values()) {
    tamanho++;
    break;
  }

  if (tamanho > 0) {

    alert("Verifique a atualização da lista de funcionários para confirmar operação")

    let url = 'http://127.0.0.1:5001/pessoa';
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
Funcao para validar ficha de cadastro completo
  --------------------------------------------------------------------------------------
*/

const valida_cadastro_pessoa = () => {


  let nome = document.getElementById("campo_nome").value;
  let cpf = document.getElementById("campo_cpf").value;
  let cep = document.getElementById("campo_cep_cadastro").value;
  let rua = document.getElementById("campo_rua_cadastro").value;
  let bairro = document.getElementById("campo_bairro_cadastro").value;
  let cidade = document.getElementById("campo_cidade_cadastro").value;
  let estado = document.getElementById("campo_estado_cadastro").value;

  const formData = new FormData();

  if (nome === '' || cpf === '' || rua === '' || bairro === '' || cidade === '' || estado === '') {
    alert("Não pode haver campos em branco, para realizar o cadastro");
  } else {

    formData.append('nome', nome);
    formData.append('cpf', cpf);
    formData.append('cep', cep);
    formData.append('rua', rua);
    formData.append('cidade', cidade);
    formData.append('bairro', bairro);
    formData.append('estado', estado);
  }
  return formData;
}

/*
  --------------------------------------------------------------------------------------
Funcao para enviar dados para novo cadastro POST basico funcionario
  --------------------------------------------------------------------------------------
*/
const cadastra_funcionario = () => {

  const formData = valida_cadastro_funcionario();
  var tamanho = 0
  for (var value of formData.values()) {
    tamanho++;
    break;
  }

  if (tamanho > 0) {

    alert("Verifique a atualização da lista de funcionários para confirmar operação")

    let url = 'http://127.0.0.1:5002/funcionario';
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
Funcao para validar ficha de cadastro funcionario
  --------------------------------------------------------------------------------------
*/

const valida_cadastro_funcionario = () => {


  let nome = document.getElementById("campo_nome").value;
  let cpf = document.getElementById("campo_cpf").value;
  let matricula = document.getElementById("campo_matricula").value;
  let email = document.getElementById("campo_email").value;
  let login = document.getElementById("campo_login_cadastro").value;
  let funcao = document.getElementById("campo_funcao").value;


  const formData = new FormData();

  if (nome === '' || cpf === '' || matricula === ' ' || email === '' || funcao === '' || login === '') {
    alert("Não pode haver campos em branco, para realizar o cadastro");
  } else if (isNaN(matricula)) {
    alert("O campo matrícula de ver um número");
  } else {

    formData.append('nome', nome);
    formData.append('cpf', cpf);
    formData.append('funcao', funcao);
    formData.append('matricula', matricula);
    formData.append('email', email);
    formData.append('login', login);
  }
  return formData;
}


/*
    Concatena as trez rotas de cadastro para realizar o castro nas tres diferentes apis

*/

const cadastra_usuario_completo = () => {

  cadastra_login();
  cadastra_funcionario();
  cadastra_pessoa();

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

    let url = 'http://127.0.0.1:5002/funcionario';
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
Funcao para validar ficha de cadastro completo
  --------------------------------------------------------------------------------------
*/

const valida_cadastro = () => {


  let nome = document.getElementById("campo_nome").value;
  let cpf = document.getElementById("campo_cpf").value;
  let cep = document.getElementById("campo_cep_cadastro").value;
  let rua = document.getElementById("campo_rua_cadastro").value;
  let bairro = document.getElementById("campo_bairro_cadastro").value;
  let cidade = document.getElementById("campo_cidade_cadastro").value;
  let estado = document.getElementById("campo_estado_cadastro").value;
  let matricula = document.getElementById("campo_matricula").value;
  let email = document.getElementById("campo_email").value;
  let login = document.getElementById("campo_login_cadastro").value;
  let funcao = document.getElementById("campo_funcao").value;
  let cadastrado_por = document.getElementById("campo_login").value;
  let alterar_senha = document.getElementById("cb_reset_senha").checked;

  const formData = new FormData();

  if (nome === '' || cpf === '' || cep === '' || matricula === ' ' || email === '' || funcao === '' || login === '' || rua === '' || bairro === '' || cidade === '' || estado === '') {
    alert("Não pode haver campos em branco, para realizar o cadastro");
  } else if (isNaN(matricula)) {
    alert("O campo matrícula de ver um número");
  } else {

    formData.append('nome', nome);
    formData.append('cpf', cpf);
    formData.append('cep', cep);
    formData.append('rua', rua);
    formData.append('cidade', cidade);
    formData.append('bairro', bairro);
    formData.append('estado', estado);
    formData.append('funcao', funcao);
    formData.append('matricula', matricula);
    formData.append('email', email);
    formData.append('login', login);
    formData.append('cadastrado_por', cadastrado_por);
    formData.append('alterar_senha', Boolean(alterar_senha));
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
  insertList("Login", "Matricula", "CPF")

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

    let url = 'http://127.0.0.1:5000/login_senha';
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
        alert("Erro ao tentar atualizar os dados");
        console.error('Error:', error);
      });

  }
}


/*
  --------------------------------------------------------------------------------------
Funcao para reset de senha do usuario
  --------------------------------------------------------------------------------------
*/

const reset_senha = () => {

  let login = document.getElementById("campo_login_cadastro").value

  const formData = new FormData();
  formData.append("login", login)
  formData.append("senha", "123456")
  formData.append("alterar_senha", true)

  let url = 'http://127.0.0.1:5000/login_senha';
  fetch(url, {
    method: 'put',
    body: formData,
  })
    .then((response) => {
      response.json()
      alert("Senha resetada com sucesso! login: " + login);
    })
    .catch((error) => {
      alert(error("mesage"))
      alert("Erro ao tentar atualizar os dados");
      console.error('Error:', error);
    });

}

/*
--------------------------------------------------------------------------------------
Função para buscar endereco, baseado no CEP
--------------------------------------------------------------------------------------
*/


const busca_cep = () => {

  let cep = document.getElementById("campo_cep_cadastro").value;

  if (cep === '') {
    alert("Campo CEP nao podem estar em branco");
  } else {
    cep_get(cep)
    // alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
Funcao para buscar o endereço a partir do valor do cep
  --------------------------------------------------------------------------------------
*/
const cep_get = (cep) => {

  let url = 'http://127.0.0.1:5001/pessoa_cep?cep=' + cep;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.rua != null) {
        preenche_endereco(data);
        alert("Encontrado endereco para o CEP: " + cep);
      } else {
        alert("Não foi encontrado endereço para o CEP informado. Verifique o formado ta b buca: XXXXX-XXX");
      }
      console.log(`CEP encontrado: ${cep}`);
    })
    .catch((error) => {
      alert("Falha ao localizar o CEP: " + cep);
      console.error('Error:', error);
      alert('Error:', error);
    });
}


/*
  Função para preencher endereço no form
*/
const preenche_endereco = (data) => {
  document.getElementById("campo_rua_cadastro").value = data.rua;
  document.getElementById("campo_cidade_cadastro").value = data.cidade;
  document.getElementById("campo_bairro_cadastro").value = data.bairro;
  document.getElementById("campo_estado_cadastro").value = data.estado;
}

/*
--------------------------------------------------------------------------------------
Função para buscar dados pessoais do usuário, baseado no CPF
--------------------------------------------------------------------------------------
*/


const busca_cpf = () => {

  let cpf = document.getElementById("campo_cpf").value;

  if (cpf === '') {
    alert("Campo CPF nao podem estar em branco");
  } else {
    cpf_get(cpf)
    // alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
Rota para buscar o dados pessoais a partir do valor do cpf
  --------------------------------------------------------------------------------------
*/
const cpf_get = (cpf) => {

  let url = 'http://127.0.0.1:5001/pessoa?cpf=' + cpf;
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.nome != null) {
        prenche_dados_pessoais(data);
        alert("Encontrado cadastro para o CPF: " + cpf);
        console.log(`CPF encontrado: ${cpf}`);

      } else {
        alert("Falha ao localizar o cpf: " + cpf);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert("Erro ao executar a busca:", error);
    });
}

/*
  Preenche as informações correspondentes ao banco dos dados pessoais na ficha de cadastro
*/

const prenche_dados_pessoais = (data) => {

  document.getElementById("campo_nome").value = data.nome;
  document.getElementById("campo_cep_cadastro").value = data.cep;
  document.getElementById("campo_rua_cadastro").value = data.rua;
  document.getElementById("campo_bairro_cadastro").value = data.bairro;
  document.getElementById("campo_cidade_cadastro").value = data.cidade;
  document.getElementById("campo_estado_cadastro").value = data.estado;

}