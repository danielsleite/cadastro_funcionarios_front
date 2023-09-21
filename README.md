# Front para cadastro de funcionários

Esse projeto apresenta o MVP de requisido para conclusão da sprint 3 da curso de  **Engenharia de Softaware**  oferecido pela **PUC-Rio**

Para realizar o cadastro do funcinário, é necessário ter criado um login. Para tal, utilize as ferramentas da API, ou insira manualmente almenos um usuário no banco, caso o mesmo esteja vazio

Para o funcionamento da aplicação, esse front, desenvolvido em html, ccs e javascript, se comunica com três APIs:

* [api_login](https://github.com/danielsleite/api_login) - Responsável pela função de gerenciamento de login e senha
* [api_cadastro_pessoas](https://github.com/danielsleite/api_cadastro_pessoas) - Responsável pelo cadastro dos dados pessoais, como endereço, nome e cpf
* [api_cadastro_funcionarios](https://github.com/danielsleite/cadastro_funcionarios_api) - Reponsável pelo cadastro de dados do funcionários como: matrícula, função e e-mail

A aplicação foi dividida em pequenos serviços, separando as funções de gerenciamento de login, para a api [api_login](https://github.com/danielsleite/api_login), e as informações do funcionário foram divididas entre pessoais, pela [api_cadastro_pessoas](https://github.com/danielsleite/api_cadastro_pessoas), e referentes a empresa, pela [api_cadastro_funcionarios](https://github.com/danielsleite/cadastro_funcionarios_api). Essa escolha de negócio, da separação dos dados do funcionário em duas api, foi feita pois a base dos dados pessoais será mantida, idependente da perda do vínculo do funcionário com a empresa, e os dados referentes a empresa, serão incrementados futuramente com informações salariais. Com isso, a separação permiti uma melhor restrição de acesso as informações, além da utilização dos dados pessoais cadastrados em outras aplicações futuras.

---
## Integração do front-end com as APIs

Para o correto funcionamento do front-end com as APIs, o mesmo espera que cada API esteja sendo executada em um IP e PORTA previamentes definidos nas rodas do arquivo script.js desse repositório. Em resumo, para cada API temos:

* [api_login](https://github.com/danielsleite/api_login) -- [http://127.0.0.1:5000]( http://127.0.0.1:5000)
* [api_cadastro_pessoas](https://github.com/danielsleite/api_cadastro_pessoas) -- [http://127.0.0.1:5001]( http://127.0.0.1:5001)
* [api_cadastro_funcionarios](https://github.com/danielsleite/cadastro_funcionarios_api) -- [http://127.0.0.1:5002]( http://127.0.0.1:5002)

---
## Como executar em modo de desenvolvimento

Basta fazer o download do projeto e abrir o arquivo index.html no seu browser, uma vez o que aplicação back-end do servidor esteja rodando.

## Como executar através do Docker

Certifique-se de ter o [Docker](https://docs.docker.com/engine/install/) instalado e em execução em sua máquina.

Navegue até o diretório que contém o Dockerfile no terminal e seus arquivos de aplicação e
Execute **como administrador** o seguinte comando para construir a imagem Docker:

```
$ docker build -t font-cadastro .
```

Uma vez criada a imagem, para executar o container basta executar, **como administrador**, seguinte o comando:

```
$ docker run -d -p 8080:80 font-cadastro
```

Uma vez executando, para acessar o front-end, basta abrir o [http://localhost:8080/#/](http://localhost:8080/#/) no navegador.