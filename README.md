# 1. Introdução

Este desafio foi proposto pelo LEDS e está descrito na seção abaixo (**Teste de admissão para o LEDS**). Neste desafio, tive a liberdade de escolher as tecnologias e a linguagem de programação a serem utilizadas. Esta solução será avaliada posteriormente durante a entrevista. 

As tecnologias utilizadas nesta solução incluem:

1. **Quasar Framework**: Um framework baseado em Vue.js que permite o desenvolvimento de aplicativos multiplataforma com um único código base.
2. **Vue.js**: Uma estrutura JavaScript progressiva para a construção de interfaces de usuário.
3. **Axios**: Uma biblioteca JavaScript usada para fazer solicitações HTTP a partir de navegadores e servidores Node.js.
4. **ESLint**: Uma ferramenta de linting para JavaScript que ajuda a manter a qualidade do código.
5. **Material Icons**: Uma biblioteca de ícones usada para a interface do usuário.
6. **Notify & Dialog (Plugins Quasar)**: Plugins do Quasar usados para exibir notificações e diálogos na interface do usuário.
7. **JSON Server**: Usado para a modelagem de banco de dados. É uma ferramenta simples que permite criar uma API RESTful falsa para desenvolvimento e prototipagem, julguei adequada para o prazo que se encontrava o desafio.

Além disso, o aplicativo foi configurado para ser executado em um servidor de desenvolvimento na porta **8080**.

# 2. Teste de admissão para o LEDS

O desafio é desenvolver um programa que permita realizar as seguintes buscas: 
1. Listar os **órgãos, códigos e editais dos concursos públicos** que se encaixam no perfil do candidato, tomando como base o seu **CPF**; 
2. Listar o **nome, data de nascimento e o CPF** dos candidatos que se encaixam no perfil do concurso tomando com base o **Código do Concurso** do concurso público;

O arquivo **candidatos.txt** contém as informações dos candidatos:

| Nome  | Data de Nascimento  | CPF |  Profissões|
|---|---|---|---|
| Lindsey Craft  |  19/05/1976  |  182.845.084-34  |  [carpinteiro]  | 
| Jackie Dawson  |  14/08/1970  |  311.667.973-47  |  [marceneiro, assistente administrativo]  |
| Cory Mendoza |   11/02/1957 |  565.512.353-92  |  [carpinteiro, marceneiro] |

O arquivo **concursos.txt** contém as informações dos concursos públicos:

| Órgão  | Edital  | Código do Concurso | Lista de vagas|
|---|---|---|---|
| SEDU  | 9/2016  |  61828450843  |  [analista de sistemas, marceneiro]  | 
| SEJUS | 15/2017  |  61828450843  |  [carpinteiro,professor de matemática,assistente administrativo] |
| SEJUS | 17/2017 |  95655123539  |  [professor de matemática] |


# 3.  Documentação da solução

Nesta sessão, irei detalhar a **Arquitetura da solução**, a **Implementação das Funcionalidades**, o **Uso do programa** e os **Testes** feitos para garantir que o programa funcionou corretamente.

Na arquitetura da solução, farei uma explicação das principais pastas do projeto, para que o leitor compreenda como foi projetada a solução, com o local do respectivo arquivo no começo da explicação.

## 3.1 Arquitetura da solução

### Axios.js
**local**: `src/boot/axios.js`

O arquivo  `axios.js`  é responsável por configurar o cliente HTTP Axios, que é usado para fazer solicitações para a API do servidor. O ponto mais importante deste arquivo é a definição da URL base para as solicitações da API.

```javascript
const api = axios.create({ baseURL: 'http://localhost:3000/' })
```
esta é a rota padrão para todos os endpoints que estiverem usando uma instância do Axios.

### Routes.js
**local**: `src/router/routes.js`

A rota base  `'/'`  carrega o componente  `MainLayout.vue`, uma rota pai que serve como o layout principal da aplicação e é a página que contém os botões "candidatos" e "concursos" para navegabilidade. O layout contém **4 rotas filho**, que representam duas tabelas apresentando os dados do banco e dois formulários de criação e edição de concursos/candidatos, os formulários são acessíveis ao tentar **editar ou criar** um novo dado. Foi feito um **CRUD** de candidatos e concursos, veremos posteriormente como são feitos na pasta composables.
```javascript
component: () =>  import('layouts/MainLayout.vue'),
children: [
{ path:  'candidatos', name:  'candidatos', component: () =>  import('src/pages/CandidatosPage.vue') },
{ path:  'form-Candidatos/:id?', name:  'formCandidatos', component: () =>  import('pages/formCandidatos.vue') },
{ path:  'concursos', name:  'concursos', component: () =>  import('src/pages/ConcursosPage.vue') },
{ path:  'form-Concursos/:id?', name:  'formConcursos', component: () =>  import('pages/formConcursos.vue') }
]
```
### db.json

**Local**: `projetoLEDS3\db.json`

O arquivo  `db.json`  é um arquivo de dados em formato JSON que atua como um banco de dados local para uma aplicação.

Cada objeto no arquivo `db.json` representa um recurso que pode ser acessado através de uma rota específica, por exemplo, a rota localhost:3000/candidatos/ae21 retorna uma instância do dado candidato baseado no seu ID (ae21) 
```javascript
{
    "name": "Miranda Stokes",
    "dataNascimento": "21/03/1955",
    "cpf": "551.235.392-12",
    "profissoes": [
        "carpinteiro",
        "assistente administrativo",
        "professor de matemática"
    ],
    "id": "ae21"
}
```
para que seja possível encontrar um candidato pelo seu CPF ou um concurso pelo codigo de concurso, basta usar essa diretiva ``` GET /posts?views_gt=9000```  essa lógica de URL foi utilizada nos métodos **getbycpf e getBycodigoConcurso** que estão na camada service, detalharei melhor posteriormente na **sessão 4** de implementação das funcionalidades.

### Services
**local**: `src\services\candidatos.js e src\services\concursos.js`

Foi feita uma separação lógica na criação de cada serviço, elas estão localizadas na pasta services e são responsáveis por fornecer os serviços de API para os recursos de candidatos e concursos, respectivamente.
Ambos os arquivos importam um composable chamado `useApi`, que carrega funções reutilizáveis.
Então a pasta services basicamente pega os métodos que desejar dos composables. Essa estrutura permite que as operações da API sejam facilmente reutilizadas em todo o aplicativo, é muito eficaz para tarefas muito parecidas, que nesse caso, foi utilizado para o crud das tabelas e os gets necessários.

#### Exemplo de candidatos.js na pasta service:
```javascript
import  useApi  from  'src/composables/UseApi'
export  default  function  candidatosService () {
  const { list, post, update, remove, getById, getBycpf } =  useApi('candidatos')
    return {
	  list,
	  post,
	  update,
	  remove,
	  getById,
	  getBycpf
    }
}
```

## 3.2 Implementação das funcionalidades

### Composables
**local:** ```src\composables\UseApi.js```
como já foi explicado na sessão anterior, o composable é uma pasta com um conjunto de funções reutilizáveis, tem uma relação direta com os services de candidatos e concursos e contém os métodos mais primordiais para a API. Então vamos falar das funcionalidades.

1.  **list**: Este método é usado para obter uma lista de todos os itens de um recurso específico da API. Ele faz uma solicitação GET para a URL do recurso.
    
2.  **getById**: Este método é usado para obter um item específico de um recurso pela sua ID. Ele faz uma solicitação GET para a URL do recurso, anexando a ID do item à URL.
    
3.  **getBycpf**: Este método é usado para obter itens de um recurso que correspondem a um CPF específico. Ele faz uma solicitação GET para a URL do recurso, passando o CPF como um parâmetro de consulta, esse service é apenas usado pelo service de candidatos.
    
4.  **getBycodigoConcurso**: Este método é semelhante ao  `getBycpf`, mas obtém itens que correspondem a um código de concurso específico, este método é usado apenas pelo service de concursos.
    
5.  **post**: Este método é usado para criar um novo item em um recurso. Ele faz uma solicitação POST para a URL do recurso, enviando os dados do novo item no corpo da solicitação.
    
6.  **update**: Este método é usado para atualizar um item existente em um recurso. Ele faz uma solicitação PUT para a URL do recurso, anexando a ID do item à URL e enviando os dados atualizados do item no corpo da solicitação.
    
7.  **remove**: Este método é usado para remover um item existente de um recurso. Ele faz uma solicitação DELETE para a URL do recurso, anexando a ID do item à URL.
    

Todos esses métodos são assíncronos, o que significa que eles retornam uma promessa que se resolve para os dados da resposta da API. Se ocorrer um erro durante a solicitação, a promessa será rejeitada com um objeto de erro simples. ```catch (error) {throw  new  Error(error)}```


### Páginas principais
**Local:**```src/pages/CandidatosPage.vue``` e ```src/pages/ConcursosPage.vue```

### Tabelas
Como já foi explicado na sessão **router**, existem 4 rotas filhas de ```mainLayout.vue```, essas páginas quem consomem as funcionalidades de composables e são responsáveis por carregar a tabela e os formulários. As páginas de candidatos e concursos têm uma estrutura e lógica muito semelhantes, o que facilita a manutenção e a compreensão do código.

-   A página é composta por um componente  `q-table`  que exibe uma tabela de candidatos. Os dados para a tabela (`candidatos`) são obtidos do serviço  `candidatosService`  usando o método  `list`.
-   A tabela tem várias colunas, incluindo ‘Id’, ‘Nome’, ‘Data de Nascimento’, ‘CPF’ e ‘Ações’. A coluna ‘Ações’ contém botões para editar e excluir candidatos.
-    A página também inclui um campo de **‘Search’**. Quando o usuário digita um valor no campo de pesquisa e clica no botão de pesquisa, o aplicativo busca concursos que correspondam ao valor de pesquisa. Se um concurso correspondente for encontrado, a tabela é atualizada para mostrar apenas os candidatos que se encaixam no concurso, essa lógica está relacionada aos métodos: **onSearch()** e **filterprofissoesByconcursos()/filterConcursosByProfissoes()**
-   A página também inclui um botão **‘Novo’** que redireciona o usuário para o formulário de candidatos, onde eles podem adicionar um novo candidato.
 ```<q-btn  color="primary" :disable="loading"  label="Novo" :to="{ name: 'formCandidatos' }" ```
-   A lógica para buscar candidatos, filtrar candidatos por concurso, e deletar candidatos é implementada usando os métodos do serviço  `candidatosService`.

Aqui estão os principais métodos usados nessa página:

-   `onMounted`: Este método é chamado quando a página é carregada, e chama o método  `getCandidatos`  para preencher a tabela com os dados dos candidatos.
    
-   `filterprofissoesByconcursos`: Este método é usado para filtrar os candidatos com base no concurso selecionado. Ele retorna uma lista de candidatos cujas profissões correspondem às vagas do concurso.

-   `filterConcursosByProfissoes`: Este método é usado para filtrar os concursos com base nas profissões selecionadas. Ele retorna uma lista de concursos cujas vagas correspondem às profissões do candidato.
    
-   `onSearch`: Este método é chamado quando o usuário clica no botão de pesquisa. Ele busca o concurso com base no valor de pesquisa e atualiza a tabela para mostrar apenas os candidatos que se encaixam no concurso.
    
-   `getCandidatos`: Este método é usado para obter a lista de todos os candidatos e atualizar a tabela.
    
-   `handleDeletePost`: Este método é chamado quando o usuário clica no botão de excluir de um candidato. Ele exibe um diálogo de confirmação e, se o usuário confirmar, deleta o candidato e atualiza a tabela.
    
-   `handleEditPost`: Este método é chamado quando o usuário clica no botão de editar de um candidato. Ele redireciona o usuário para o formulário de candidatos com os dados do candidato preenchidos.

### Formulários
**Local:**```src/pages/formConcursos.vue``` e ```src/pages/formCandidatos.vue```

O arquivo `formCandidatos.vue` é responsável por exibir o formulário para adicionar ou editar candidatos. Só é possível acessa-lo se você passar primeiro nas tabelas. O formulário contém os campos necessários para preencher cada uma das diferentes tabelas, por exemplo, em formCandidatos, existe um campo para preencher cpf, data de nascimento e nome. Quando o usuário vai editar um campo, seus dados originais se mantém, ele tem que apagar o dado e escrever o que deseja editar, ele pode cancelar ou salvar.
Dentro de todo esse fluxo, existem mensagens e notificações para tornar a experiência de uso mais satisfatória (não queremos excluir um candidato sem querer).

Neste caso, temos apenas 2 métodos.

1.  **onMounted**: Este é um gancho de ciclo de vida do Vue que é chamado quando o componente é montado (ou seja, quando ele é adicionado ao DOM). Neste método, se um ID de candidato for fornecido na URL (indicado por  `route.params.id`), o formulário é preenchido com os dados do candidato existente. Isso é feito chamando o método  `getById`  do serviço  `candidatosService`.
    
2.  **onSubmit**: Este método é chamado quando o formulário é submetido. Ele verifica se todos os campos obrigatórios foram preenchidos. Se estiverem, ele envia os dados do formulário para a API do servidor usando os métodos  `post`  ou  `update`  do serviço  `candidatosService`, dependendo se um novo candidato está sendo adicionado ou um candidato existente está sendo editado. Se ocorrer um erro durante a submissão, uma notificação é exibida para o usuário.

# 4. uso do programa

Para rodar o programa, basta executar 2 comandos, um para inicializar o json-server e outro para inicializar a aplicação do quasar:

1. ```npx json-server db.json``` 
2. ```npx quasar dev``` 


# 5. Testes

Os testes foram conduzidos de maneira empírica, utilizando uma abordagem direta e prática. Foram realizados testes individuais com vários CPFs e códigos de concurso, contabilizando manualmente os resultados. Dada a natureza compacta da base de dados utilizada, foi possível realizar um número satisfatório de verificações para assegurar a funcionalidade do programa. Através deste método, foi possível confirmar a precisão e a eficácia das operações implementadas.


# 6. Lista dos diferenciais implementados


### Criação de um serviço

Neste projeto, foi implementada uma camada de composables e services. Esta estrutura permite uma separação clara entre a lógica de negócios e a interface do usuário, facilitando a manutenção e a expansão do projeto.

### Utilização de banco de dados

Para este projeto, foi utilizado o  `json-server`, uma ferramenta simples que permite criar uma API RESTful falsa para desenvolvimento e prototipagem. Embora o  `json-server`  seja útil para prototipagem rápida e desenvolvimento inicial, ele não é adequado para uso em produção.

Para substituir o  `json-server`  por um banco de dados real, você precisaria criar um servidor HTTP em Node.js (ou outra tecnologia de sua escolha) que se conecte ao banco de dados. Cada requisição feita ao servidor resultaria em uma consulta ao banco de dados, e os resultados seriam retornados como JSON.
Devido ao prazo apertado desse projeto, preferi utilizar o json-server para começar a programar o mais rápido possível.

### Implementar Clean Code

No desenvolvimento deste projeto, foi utilizado o **ESLint**. O ESLint é uma ferramenta de linting para JavaScript que ajuda a manter a qualidade do código. Ele verifica o código em busca de erros de programação, bugs, estilo de programação inconsistente e construções suspeitas, além de comentários tentando deixar o raciocínio o mais conciso possível.
### Implementar o padrão de programação da tecnologia escolhida

Neste projeto, o código foi baseado na documentação oficial do Quasar [Documentation | Quasar Framework](https://quasar.dev/docs). O Quasar é um framework Vue.js que fornece uma variedade de componentes e funcionalidades prontas para uso. Seguir a documentação oficial do Quasar garante que o código esteja alinhado com as melhores práticas e padrões recomendados pelo framework.

Isso inclui a estrutura do projeto, a organização dos arquivos, a utilização de componentes Quasar, a implementação de rotas e a gestão de estado.
### Qualidade de  [Código com SonarQube](https://about.sonarcloud.io/)
![image](https://github.com/underscores027/venhaparaoleds/assets/116377043/005fea6a-de10-4702-b1c3-df5916295a16)

### Implementar testes unitários
Não foi implementado.
### Implementar testes comportamentais
Não foi implementado.
### Implementar integração com  [Github Action](https://github.com/features/actions)
Não foi implementado.
### Implementar integração com Github Action + SonarQube
Não foi implementado.
### Implementar usando Docker
Foi implementado, basta rodar docker-compose up.
