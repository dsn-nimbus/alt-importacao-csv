# alt-importacao-csv

Componente alterdata para importação de planilhas carregadas pelo usuário. 

- [x] **Csv, Xls, Xlsx** - Importação de planilhas excel.

- [x] **Importação genérica** - Personalização para leitura de objetos de qualquer entidade.

- [x] **Validação interna** - Checagem automática dos tipos _Number, Decimal, String e Date_.

- [x] **Validação externa** - Configuração para validação personalizada com mensagens de erro e alertas.

***
## Funcionamento

O usuário pode carregar um documento, mapear as colunas da planilha aos campos da entidade e validar os itens para importação, através de um passo a passo simplificado:

1. **Seleção do arquivo**
2. **Mapeamento** - Coluna ↔ Campo
3. **Regras de valor** - Campos de objetos são vinculados à valores das respectivas colunas mapeadas formando "regras" do tipo: onde há valor 'x' use o objeto {nome: 'X', id: 1} do sistema.
4. **Revisão** - Dados submetidos à validação são exibidos agrupados pelas linhas do arquivo com status, mensagens de erro, warnings e opção de "desconsiderar item".

O passo a passo de importação é disponibilizado através de uma modal (alt-modal-service).

### Validação interna

Campo de texto - Aceitos valores com até 255 caracteres.

Campo de data - Aceitos valores nos formatos: DD/MM/YYYY, DD-MM-YYYY, DDMMYYYY, DD/MM/YY, DD-MM-YY, DDMMYY e YYYY-MM-DD

Campo numérico - Aceitos números negativos ou positivos, inteiros ou decimais.

Campo boleano - Aceitos como verdadeiro: 1, true, sim, S, V. Aceitos como falso: 0, false, não, N, F. Independente de _case_ ou acentos.

***
## Instalação

Dependências:
- [alt-modal-service](https://github.com/dsn-nimbus/alt-modal-service)
- [alt-select-service](https://github.com/dsn-nimbus/alt-select-service)
- [alt-alerta-flutuante-service](https://github.com/dsn-nimbus/alt-alerta-flutuante)
- [alt-carregando-info](https://github.com/dsn-nimbus/alt-carregando-info/blob/master/src/alt-carregando-info.js)
- [js-xlsx](https://github.com/sheetjs/js-xlsx)
- [latinize](https://github.com/dundalek/latinize)
- [lodash](https://github.com/lodash/lodash)
- [moment](https://github.com/moment/moment)

Instalação dependencias com bower:
````
$ bower install alt-modal-service alt-select-service alt-alerta-flutuante alt-carregando-info js-xlsx latinize lodash moment
````
Instalação com bower:
````
$ bower install alt-importacao-csv
````
***

## Utilização

Inclusão dos arquivos:

CSS:
````html
<link rel="stylesheet" href="bower_components/alt-importacao-csv/dist/alt-importacao-csv.min.css" />
````
JS:
````html
<script src="bower_components/alt-importacao-csv/dist/alt-importacao-csv.min.js"></script>
````
A _directive_ da modal de importação é carregada no DOM através do atributo:
````html
<div alt-importacao-csv-especifica></div>
````

Na controller da aplicação inclua os módulos:

````javascript
angular.module('myModule', [
  'AltImportacaoCsvEspecificaService',
  'AltImportacaoCsvOpcoesModel'
  'AltImportacaoCsvCampoModel',
]);
````

E execute a chamada do serviço importacaoEspecificaService - _AltImportacaoCsvEspecificaService_:
````javascript
importacaoEspecificaService.exibe(opcoesImportacao); // opcoesImportacao - objeto do tipo AltImportacaoCsvOpcoesModel
````

### OpcoesImportacao - _AltImportacaoCsvOpcoesModel_ - parametros:

| Parametro     | Tipo     | Obrigatório | Descrição                                                                                 |
| ------------- | -------- | ----------- | ----------------------------------------------------------------------------------------- |
| labelTipo     | String   | Sim         | label da entidade.                                                                        |
| campos        | Array    | Sim         | Lista de campos da entidade.                                                              |
| validarLote   | Function | Sim         | Submete lote as regras externas ao componente. Deve retornar _promise_ da funcionalidade. |
| gravarLote    | Function | Sim         | Grava o lote de objetos. Deve retornar _promise_ da funcionalidade.                       |
| eventoCriacao | String   | Sim         | Evento que será transmitido na conclusão com resposta da gravação.                        |

Usando como exemplo uma importação de _Vendas_:

````javascript
let opcoesImportacao = new OpcoesImportacao({
  labelTipo: 'vendas',
  campos: campos,
  validarLote: validarLote,
  gravarLote: gravarLote,
  eventoCriacao: EVENTO_IMPORTACAO_CRIADA
});
````

### CampoImportacao - _AltImportacaoCsvCampoModel_ - parametros:

| Parametro            | Tipo       | Obrigatório            | Descrição                                                                 |
| -------------------- | ---------- | ---------------------- | ------------------------------------------------------------------------- |
| nome                 | _String_   | Sim                    | Nome do campo.                                                            |
| chave                | _String_   | Sim                    | Identificação única do campo.                                             |
| obrigatorio          | _Boolean_  | Não                    | Informa se campo é obrigatório para importação ou não.                    |
| tipo                 | _Function_ | Não                    | Enum da função que representa o tipo do campo.¹                           |
| monetario            | _Boolean_  | Não                    | Indica que se trata de um monetário quando o tipo é _Number_.             |
| objetoChave          | _String_   | Quando tipo é _Object_ | Propriedade única do objeto.                                              |
| objetoReferencia     | _String_   | Quando tipo é _Object_ | Propriedade label do objeto (nome, descrição ou equivalente).             |
| objetoListagem       | _Function_ | Quando tipo é _Object_ | Retorna a lista de objetos do tipo em questão para seleção no componente. |
| objetoAutoVinculo    | _Function_ | Não                    | Personaliza o vinculo automático da estapa de regras de valor.²           |
| objetoOpcoesListagem | _Object_   | Não                    | Opções select2.                                                           |
| ↳ groupBy            | _String_   | Não                    | Nome da propriedade de agrupamento no select2.                            |
| ↳ orderBy            | _Array_    | Não                    | Lista de propriedades com prioridade de ordenação no select2.             |
| objetoCriarNovo      | _Object_   | Não                    | Opções funcionalidade "criar novo" pelo combo do campo.                   |
| ↳ funcao             | _Function_ | Não                    | Responsável por criar novo objeto para inclusão na listagem.              |
| ↳ eventoAtualizacao  | _String_   | Não                    | Evento que é emitido quando um Novo produto é criado.                     |
| template             | _Object_   | Não                    | Opções template da revisão.                                               |
| ↳ label              | _String_   | Não                    | Label do campo na revisão (quando ausente parametro 'nome' é utilizado).  |
| ↳ width              | _Number_   | Não                    | Largura do campo no template da revisão (1 a 12). Default 12.             |

¹ tipo - Tipos atualmente tratados são _Number_, _String_, _Date_, _Boolean_ e _Object_. Na ausência do parametro o campo é considerado _String_.

² objetoAutoVinculo - Esta função por default aplica a regra de valor de campos de objeto, sem que o usuário precise selecionar objeto manualmente. Ou seja, regras do tipo "onde há valor 'x' use {nome: 'x', id: 1}" são aplicadas automáticamente, o componente traz a função padrão que aplica a regra quando o __valor__ do campo e a prpriedade __objetoReferencia__ do objeto forem "iguais" desconsiderando letras maiúsculas e minúsculas e acentos. Esse método pode ser personalizado por qualquer função que receba um valor (String) e retorne um objeto da lista (mesma lista fornecida em __objetoListagem__). Por exemplo, no caso de produto pode-se decidir por vincular automaticamente quando valor for igual também ao código de barras, etc.

Mantendo entidade _Venda_ como exemplo:

````javascript
const campos = [
  new CampoImportacao({
    nome: 'Produto',
    chave: 'produto',
    obrigatorio: true,
    tipo: Object,
    objetoChave: 'id', 
    objetoReferencia: 'descricao',
    objetoListagem: () => {return this.produtos;},
    objetoOpcoesListagem: {
      groupBy: 'nomeCategoria',
      orderBy: ['descricao', 'preco']
    },
    objetoCriarNovo: {
      funcao: abrirModalNovoProduto,
      eventoAtualizacao: 'importacao_produtos_atualizados'
    }
  }),
  new CampoImportacao({
    nome: 'Data',
    chave: 'dataVenda',
    obrigatorio: true,
    tipo: Date,
    template: {
      width: 4
    }
  }),
  new CampoImportacao({
    nome: 'Valor Total',
    chave: 'total',
    obrigatorio: true,
    tipo: Number,
    monetario: true
  }),
  new CampoImportacao({
    nome: 'Observações',
    chave: 'observacoes',
    template: {
      label: 'OBS'
    }
  })
];

/**
Importante: É necessário atualizar a listagem de objetos para os campos com opção CRIAR NOVO, e notificar alteração da listagem:
*/
$scope.$on('modulo_produto:produto_criado', (evento, produto) => {
  this.produtos.push(produto);
  $rootScope.$broadcast('importacao_vendas:produtos_atualizados', produto);
});
````
### Validação externa e gravação

Ilustrando funções de validação e gravação com o exemplo de vendas:
````javascript
const validarLote = (lote) => {
  return $q((resolve) => {
    lote.itens.forEach((item, i) => {
      let venda = item.objeto;
      /*
        O objeto "venda" aqui terá como propriedades os valores do parametro "chave" na configuração dos campos, ou seja, esperamos:
        - venda.produto {Object}
        - venda.dataVenda {Date}
        - venda.total {Number}
        - venda.observacoes {String} (opcional)
      */

      // Exemplo de validação:
      if (dataVendaInferiorADoisAnos(venda.dataVenda)) {
        var limite = moment().subtract(2, 'years').format('DD/MM/YYYY');
        lote.aplicarStatusErro(i); // Aplica status inválido no item e ajusta o resumo (totais) do lote.
        item.resumo.mensagens.push({
          textoHtml: $sce.trustAsHtml('O campo <u>Data da Venda</u> deve conter data superior a <u>' + limite + '</u>')
        });
      }

      /*
        Obs 1: lote.aplicarStatusAlerta também é disponível. Para itens com status "alerta" mensagens são exibidas mas 
        usuário não é impedido de submeter lote à gravação. Já com status erro a opção de gravarLote é desabilitada.
        Obs 2: Objeto "mensagem" pode conter html como ilustrado acima (propriedade 'textoHtml'), ou, string normal (propriedade 'texto');
      */
    });
    resolve(lote);
  };
};
const gravarLote = (lote, nomeArquivo) => { // Função recebe lote de objetos e nome do documento de origem da importação.
  return $q((resolve) => {
    let loteGenerico = {};
    loteGenerico.nomeArquivo = nomeArquivo;
    loteGenerico.itens = [];
    lote.itens.forEach((item) => {
      const venda = item.objeto;
      const itemDeImportacao = {conteudo: venda, linha: item.linha};
      /*
        Aqui vale a regra de contrato estabelecida com o back-end para gravação do lote.
      */
      loteGenerico.itens.push(itemDeImportacao);
    });

    carregandoService.exibe();
    vendasService.gravarLoteImportacao(loteGenerico)
    .then((resp) => {
      resolve(resp);
    })
    .catch((erro) => {
      alertaFlutuanteService.exibe({msg: 'Houve um problema ao gravar lote de vendas.'});
    })
    .finally(() => {
      carregandoService.esconde();
    });
  });
};

/*
  Quando "gravarLote" for finalizado, a janela (modal) de importação é fechada 
  altomaticamente, e, é transmitido o evento de importação criada (evento definido nas opções 
  de importação "eventoCriacao"). A resposta do "gravarLote" é repassada na transmissao do evento.
*/
$scope.$on(EVENTO_IMPORTACAO_CRIADA, (ev, resp) => {
  _atualizarListagemLotesImportacao(resp);
});
````