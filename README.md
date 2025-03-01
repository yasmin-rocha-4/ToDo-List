# To-Do List

## Equipe de desenvolvimento

|         Membros da Equipe de Desenvolvimento           |
|--------------------------------------------------------|
| Maria Emília Costa Rodrigues                           |
| Raphael Nathan Moreira                                 |
| Victoria Souza Santos                                  |
| Yasmin Maldonado Silva da Rocha                        |

## Descrição do Trabalho

Neste TFC, você desenvolverá uma aplicação web simples para gerenciar listas de tarefas. As tarefas serão categorizadas por prioridade: alta, média ou baixa. Os dados serão armazenados em um servidor web, e a comunicação entre o cliente e o servidor ocorrerá por meio de uma API Web.

## Requisitos do Cliente

A requisição cliente consiste de aplicação web implementada em HTML, CSS e JavaScript. Na aplicação cliente será possível **cadastrar novas tarefas** e **gerenciar tarefas** já cadastradas.

* **Cadastrar novas tarefas**:
    * Um campo de texto de linha única para receber o título da tarefa.
    * Um campo de texto multilinha para receber mais detalhes (descrição) da tarefa a ser executada.
    * Uma caixa de seleção para marcar a prioridade de execução da tarefa. As opções disponíveis devem ser: Alta (h), Média (m) e Baixa (l).
    * Um botão **Inserir**, que quando clicado, realiza uma requisição `POST` para o *endpoint* `/new-task` do servidor (Ver seção de [Requisitos do Servidor](#rota-new-task))

* **Gerenciar tarefas**:
    * Três listas de tarefas organizadas pelas prioridades: Alta, Média e Baixa.
    * Cada lista contém *cards* que descrevem a tarefa. As listas serão carregadas após uma requisição `GET`, na rota `/tasks`, que irá trazer a lista de todas as tarefas cadastradas no servidor. (Ver seção de [Requisitos do Servidor](#rota-tasks))
    * Cada *card* de tarefa contém os seguintes elementos:
        * Título da tarefa
        * Um *preview* da descrição da tarefa. Deve haver um jeito de expandir a descrição da tarefa.
        * Um *checkbox* para marcar o status da tarefa (i.e. Concluída/Não Concluída). Quando alterado o estado do *checkbox* a aplicação realizará uma requisição `PUT` para o *endpoint* `/chk-task` indicando se a tarefa foi ou não concluída. (Ver seção de [Requisitos do Servidor](#rota-chk-taskidboolval))
        * Um botão de lixeira (🗑️) que, quando clicado, realizará uma requisição `DELETE`, na rota `/rm-task`, para remover a tarefa da base de dados. (Ver seção de [Requisitos do Servidor](#rota-rm-taskid))

## Requisitos do Servidor

Para permitir a comunicação com o cliente, será necessário criar uma aplicação servidora que disponibilize um conjunto de funcionalidades por meio de uma API Web. O corpo (*body*) das requisições HTTP, quando aplicável, deverá ser um objeto no formato [JSON](https://pt.wikipedia.org/wiki/JSON).  
