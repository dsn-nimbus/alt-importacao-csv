;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv', [
    'alt.modal-service',
    'alt.select-service',
    'alt.alerta-flutuante',
    'alt.carregando-info'
  ])
  .constant('AltImportacaoCsvEvento', {
    modal: {
      ABRE_MODAL_IMPORTACAO_ESPECIFICA: 'alt-importacao-csv:abrir_modal_importacao_especifica'
    },
    processamento: {
      ATUALIZAR_LOTE: 'alt-importacao-csv:atualizar_processamento_lote'
    }
  })
  .constant('latinize', latinize)
  .constant('_', _)
  .constant('moment', moment)
  .constant('XLS', XLS)
  .constant('XLSX', XLSX);

}(angular));

;
(function (ng) {
  'use strict';

  /**
   * @desc Contador para display de labels numéricos.
   */
  ng.module('alt.importacao-csv')
    .directive('altImportacaoCsvContador', ['$timeout', function ($timeout) {
      return {
        scope: {
          countFrom: '=',
          countTo: '=',
          duration: '@'
        },
        link: function (scope, element, attrs) {

          let e = element[0];
          let num, refreshInterval, duration, steps, step, countTo, value, increment;

          let calculate = function () {
            refreshInterval = 30;
            step = 0;
            scope.timoutId = null;
            countTo = parseInt(scope.countTo) || 0;
            scope.value = parseInt(scope.countFrom) || 0;
            duration = (parseFloat(attrs.duration) * 1000) || 0;

            steps = Math.ceil(duration / refreshInterval);
            increment = ((countTo - scope.value) / steps);
            num = scope.value;
          }

          let tick = function () {
            scope.timoutId = $timeout(function () {
              num += increment;
              step++;
              if (step >= steps) {
                $timeout.cancel(scope.timoutId);
                num = countTo;
                e.textContent = countTo;
              } else {
                e.textContent = Math.round(num);
                tick();
              }
            }, refreshInterval);

          }

          let start = function () {
            if (scope.timoutId) {
              $timeout.cancel(scope.timoutId);
            }
            calculate();
            tick();
          }

          scope.$watch('countTo', (newVal) => {
            if (!!newVal) {
              start();
            }
          });

          return true;
        }
      };
    }
    ])
}(angular));
;(function (ng) {
  "use strict";

  const TEMPLATE = `
  <div class="modal fade"
    id="alt-importacao-csv-modal"
    role="dialog"
    aria-hidden="true">

    <div class="modal-dialog modal-lg modal-xl-custom">
      <div class="modal-content">

        <div class="modal-header alt-cor-principal">
          <button type="button" class="close" ng-click="importacaoCsvCtrl.limparImportacao()">
            <i class="fa fa-times"></i><span class="sr-only">Close</span>
          </button>

          <h3 class="modal-title">
            {{!importacaoCsvCtrl.visualizacao ? 'Nova' : 'Detalhes da'}}
            importação - <span>{{importacaoCsvCtrl.labelTipo}}</span></h3>
        </div>
        <div class="alt-importacao-csv-wizard-menu">
          <div class="modal-body alt-importacao-csv-wizard-menu-importacao" ng-hide="importacaoCsvCtrl.visualizacao">
            <div class="row">
              <div ng-repeat="step in importacaoCsvCtrl.steps"
                      class="text-center alt-importacao-csv-step-title-wrap"
                      ng-class="{'col-xs-4': !!importacaoCsvCtrl.exibeEtapaRegras, 'col-xs-6': !importacaoCsvCtrl.exibeEtapaRegras}"
                      ng-hide="step.menuHidden">
                <div class="row">
                  <div class="col-xs-12">
                    <button type="button" class="alt-importacao-csv-step-title" 
                      ng-class="{
                        'alt-importacao-csv-step-title-completed': step.completed, 
                        'alt-importacao-csv-step-title-active': step.active,
                        'alt-importacao-csv-step-title-invalid': !step.valid}">
                        {{step.number}}
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-xs-12 alt-importacao-csv-step-subtitle"
                    ng-class="{
                      'alt-importacao-csv-step-subtitle-completed': step.completed, 
                      'alt-importacao-csv-step-subtitle-active': step.active,
                      'alt-importacao-csv-step-subtitle-invalid': !step.valid}">
                    <span class="text-uppercase text-center">{{step.name}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12 alt-importacao-csv-progress-wrapper">
                <uib-progressbar class="progress-striped" value="importacaoCsvCtrl.progress" type="info">
                </uib-progressbar>
              </div>
            </div>
          </div>

          <div class="modal-body alt-importacao-csv-wizard-menu-detalhes" ng-show="importacaoCsvCtrl.visualizacao">
            <div class="row alt-importacao-csv-menu-detalhes">
              <div class="col-md-4 bold">
                <span title="{{importacaoCsvCtrl.lote.nomeArquivo}}">{{importacaoCsvCtrl.lote.nomeArquivo | LimitadorTexto:28}}</span>
              </div>
              <div class="col-md-4">
                <b alt-importacao-csv-contador count-to="importacaoCsvCtrl.lote.quantidadeRegistros" duration="1" count-from="0"></b> registros
              </div>
              <div class="col-md-4">
                <b>{{((importacaoCsvCtrl.lote.quantidadeProcessados/importacaoCsvCtrl.lote.quantidadeRegistros)*100).toFixed(0)}}%</b> processado
              </div>
            </div>
          </div>
        </div>
        <div class="alt-importacao-csv-wrapper">
          <div ng-show="importacaoCsvCtrl.steps[0].active"
            class="alt-importacao-csv-wizard-step">
            <div class="modal-body">
              <form name="importacaoCsvCtrl.formStepOne">
                <div class="row">
                  <div class="col-xs-12">
                    <div class="alt-importacao-csv-wizard-title" ng-bind="importacaoCsvCtrl.getTitle()"></div>
                    <p class="alt-importacao-csv-wizard-obs alt-espacamento-top" ng-bind-html="importacaoCsvCtrl.getMessage()"><p>
                    <div class="alt-espacamento-top alt-espacamento-bottom clearfix">
                      <div class="col-xs-12 col-sm-4 col-sm-offset-4 anexos-input-file-escondido-container text-center">
                        <button type="button" class="btn btn-block btn-default alt-espacamento-bottom alt-espacamento-top anexos-input-file-fake">
                          Selecionar arquivo
                        </button>
                        <span class="small microcopy text-muted">Tamanho máximo: 2MB ou 3.000 registros</span>

                        <input type="file" class="anexos-input-file-real alt-hand ng-isolate-scope" 
                          ng-model="importacaoCsvCtrl.arquivo"
                          id="alt-importacao-csv-input-file-step1"
                          accept=".xls,.xlsx,.csv,.ods"
                          alt-importacao-csv-leitor
                          data-opts="importacaoCsvCtrl.arquivoOpcoes"
                          ng-change="importacaoCsvCtrl.arquivoAlterado()"
                          required>
                      </div>
                    </div>
                    <div class="text-center" ng-show="!!importacaoCsvCtrl.arquivo && importacaoCsvCtrl.arquivo.valido">
                      <span class="text-success alt-importacao-csv-input-ckeck">
                        <i class="fa fa-check-circle"></i> {{importacaoCsvCtrl.arquivo.nome}}
                      </span>
                    </div>

                    <div class="text-center" ng-show="!!importacaoCsvCtrl.arquivo && !importacaoCsvCtrl.arquivo.valido">
                      <span class="text-muted alt-importacao-csv-input-ckeck" ng-hide="importacaoCsvCtrl.exibirMensagemErro">
                        <i class="fa fa-check-circle"></i> {{importacaoCsvCtrl.arquivo.nome}}
                      </span>
                    </div>

                    <div class="alert alert-danger alert-dismissible alt-espacamento-bottom" role="alert" ng-show="importacaoCsvCtrl.exibirMensagemErro">
                      <button type="button" ng-click="importacaoCsvCtrl.removerMensagemErro()" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      
                      <div class="" ng-show="!!importacaoCsvCtrl.arquivo && !importacaoCsvCtrl.arquivo.valido">
                        <span class="text-danger alt-importacao-csv-input-ckeck">
                          <i class="fa fa-exclamation-triangle"></i> {{importacaoCsvCtrl.arquivo.mensagem}}
                        </span>
                      </div>
                      <div class="" ng-show="!importacaoCsvCtrl.arquivo && importacaoCsvCtrl.exibirMensagemErro">
                        <span class="alt-importacao-csv-input-ckeck">
                          <i class="fa fa-exclamation-triangle"></i> Selecione um arquivo para prosseguir
                        </span>
                      </div>

                    </div>


                  </div>
                </div>
              </form>
            </div>
          </div>
          <div ng-show="importacaoCsvCtrl.steps[1].active"
            class="alt-importacao-csv-wizard-step">
            <div class="modal-body">
              <div class="row">
                <div class="col-xs-12">
                  <div class="alt-importacao-csv-wizard-title" ng-bind="importacaoCsvCtrl.getTitle()"></div>
                  <div class="alt-espacamento-bottom" ng-bind-html="importacaoCsvCtrl.getMessage()"></div>
                </div>
              </div>
 
              <div class="row">
                <div class="col-xs-12 alt-espacamento-top">
                  <div class="alt-importacao-csv-planilha-mapeamento">
                    <table class="table">
                      <thead>
                        <tr>
                          <th ng-repeat="coluna in importacaoCsvCtrl.importacao.colunas" ng-class="{'alt-importacao-csv-coluna-possui-campo-mapeado': !!coluna.campos && coluna.campos.length}">
                            <select class="alt-importacao-csv-select-field"
                              name="field"
                              data-placeholder="Selecione"
                              ng-model="coluna.campoSelecionado"
                              ng-change="importacaoCsvCtrl.vincular(coluna.campoSelecionado, coluna.numero)"
                              ng-options="campo.chave as campo.nome group by campo.grupo for campo in importacaoCsvCtrl.importacao.campos | filter: importacaoCsvCtrl.campoNaoMapeado track by campo.chave">
                              <option value=""></option>
                            </select>
                          </th>
                        </tr>
                      </thead>
                      <thead>
                        <tr>
                          <th ng-repeat="coluna in importacaoCsvCtrl.importacao.colunas" ng-class="{'alt-importacao-csv-coluna-possui-campo-mapeado': !!coluna.campos && coluna.campos.length}">
                            <span class="small"><i ng-show="coluna.campos.length == 0">Nenhum campo selecionado</i></span>

                            <div ng-repeat="c in coluna.campos" class="alt-importacao-csv-lb-campo-mapeado">
                              <b>{{c.nome}}</b>
                              <span ng-click="importacaoCsvCtrl.desvincular(c.chave)" title="Desvincular">
                                <i class="fa fa-times"></i>
                              </span>
                            </div>

                          </th>
                        </tr>
                      </thead>
                      <tbody class="cabecalho-planilha" ng-show="importacaoCsvCtrl.arquivoOpcoes.colunasPossuemTitulos">
                        <tr>
                          <td ng-repeat="coluna in importacaoCsvCtrl.importacao.colunas">
                            {{coluna.nome}}
                          </td>
                        </tr>
                      </tbody>
                      <tbody>
                        <tr ng-repeat="linha in importacaoCsvCtrl.arquivo.dezPrimeirasLinhas">
                          <td ng-repeat="coluna in importacaoCsvCtrl.arquivo.colunas track by $index" 
                            ng-class="{'alt-importacao-csv-coluna-possui-campo-mapeado': !!importacaoCsvCtrl.importacao.colunas[$index].campos && importacaoCsvCtrl.importacao.colunas[$index].campos.length}">
                            {{importacaoCsvCtrl.formatarLinhaValor(linha[coluna]).toString() | LimitadorTexto:40}}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-xs-12 alt-espacamento-bottom">
                  <label class="alt-hand alt-espacamento-top" ng-show="importacaoCsvCtrl.arquivo.linhas.length > 1 || importacaoCsvCtrl.arquivoOpcoes.colunasPossuemTitulos">
                    <input type="checkbox"
                        ng-model="importacaoCsvCtrl.arquivoOpcoes.colunasPossuemTitulos"/>
                    <span class="alt-checkbox"></span> <span class="alt-checkbox-label">Primeira linha do arquivo são títulos das colunas</span>
                  </label>
                </div> 
              </div>

              <div class="row">
                <div class="col-xs-12 alt-importacao-csv-map-warnings">
                  <div class="alert alert-danger alert-dismissible alt-espacamento-bottom" role="alert" ng-show="importacaoCsvCtrl.importacao.mapaInvalido && importacaoCsvCtrl.exibirMensagemErro">
                    <button type="button" ng-click="importacaoCsvCtrl.removerMensagemErro()" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <p ng-repeat="msg in importacaoCsvCtrl.importacao.mensagensMapa">
                      <i class="fa fa-exclamation-triangle"></i>&nbsp;
                      <span ng-bind-html="msg"></span>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div ng-show="importacaoCsvCtrl.steps[2].active"
            class="alt-importacao-csv-wizard-step">
            <div class="modal-body">
              <div class="row">
                <div class="col-xs-12">
                  <div class="alt-importacao-csv-wizard-title" ng-bind="importacaoCsvCtrl.getTitle()"></div>
                  <div class="alt-espacamento-bottom" ng-bind-html="importacaoCsvCtrl.getMessage()"></div>
                </div>
              </div>

              <div class="row alt-espacamento-top">
                <div class="col-xs-12 alt-importacao-csv-rules-field" 
                  ng-repeat="campo in importacaoCsvCtrl.importacao.campos track by campo.chave" 
                  ng-if="campo.tipo.name === 'Object' && campo.quantidadeRegrasSemVinculo > 0"
                  ng-hide="importacaoCsvCtrl.ocultarCampo(campo)">
                  <div class="row alt-espacamento-top">
                    <div class="col-xs-12">
                      <label ng-show="importacaoCsvCtrl.obterQtdCamposRegras(importacaoCsvCtrl.importacao.campos) > 1" class="alt-importacao-csv-rules-title" data-toggle="collapse" data-target="#alt-importacao-csv-rules-field-{{campo.chave}}">
                        <i class="fa fa-angle-down"></i>
                        {{campo.nome}} 
                        <span ng-show="campo.possuiColunaMapeada() && importacaoCsvCtrl.arquivoOpcoes.colunasPossuemTitulos">(coluna {{importacaoCsvCtrl.nomeColuna(campo.coluna)}})</span>
                      </label>
                    </div>
                  </div>
                  <div class="alt-importacao-csv-rule-table-overflow">
                    <div class="row alt-espacamento-bottom collapse in" id="alt-importacao-csv-rules-field-{{campo.chave}}">
                      <div class="col-xs-12 alt-importacao-csv-rule-table">
                        <table class="table table-responsive table-condensed table-striped">
                          <thead>
                            <tr>
                              <th class="status"></th>
                              <th>Informação arquivo</th>
                              <th>Ocorrências</th>
                              <th>{{campo.nome}}</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr ng-repeat="regra in campo.regrasDeValor | filter: {autoVinculoAplicado: false}"
                              ng-class="{
                                'rule-success': regra.objeto,
                                'rule-warning': !regra.objeto && !regra.obrigatoria,
                                'rule-error': !regra.objeto && regra.obrigatoria}">
                              <td class="status">
                                <i class="fa fa-exclamation-triangle text-warning" ng-show="!regra.objeto && regra.obrigatoria" title="Vínculo obrigatório"></i>
                                <i class="fa fa-check text-success" ng-show="regra.objeto"></i>
                              </td>
                              <td ng-hide="regra.geral" title="{{regra.valor}}">{{(regra.valor === null ? '' : regra.valor)| LimitadorTexto:28 }}</td>
                              <td ng-show="regra.geral"><i class="text-secondary">Todas as ocorrências</i></td>
                              <td class="alt-importacao-csv-rules-td-count-field">{{regra.quantidade}}</td>
                              <td class="alt-importacao-csv-rules-td-select-field"
                                style="min-width: 180px;"
                                ng-class="{'has-error': !regra.objeto && regra.obrigatoria && importacaoCsvCtrl.exibirMensagemErro}">
                                <select id="alt-importacao-csv-rules-select-{{campo.chave}}-{{$index}}"
                                  class="alt-importacao-csv-rules-select form-control"
                                  style="width: 100%;"
                                  ng-model="regra.objeto"
                                  ng-change="importacaoCsvCtrl.resumirRegrasDeValor()"
                                  ng-options="{{importacaoCsvCtrl.ngOptionsRegraDeCampo(campo)}}">
                                </select>
                              </td>
                              <td class="alt-importacao-csv-rules-td-actions-field">
                                <button type="button" class="btn btn-default pull-right" 
                                  ng-disabled="!regra.objeto"
                                  ng-click="importacaoCsvCtrl.limparRegra(campo, $index)">
                                  Limpar
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div class="row alt-espacamento-bottom">
                      <div class="col-xs-12 alt-espacamento-bottom" ng-show="campo.obrigatorio && campo.resumoRegrasDeValor.nulosInvalidos > 0 && importacaoCsvCtrl.exibirMensagemErro">
                        <span class="text-danger">É necessário vincular todos os registros de <b>{{campo.nome}}</b></span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div class="row alt-espacamento-top">
                <div class="col-xs-12 alt-espacamento-top" role="alert" ng-show="importacaoCsvCtrl.resumoRegrasDeValor.nulosInvalidos > 0 && importacaoCsvCtrl.exibirMensagemErro">
                  <div class="alert alert-danger alert-dismissible">
                    <button type="button" ng-click="importacaoCsvCtrl.removerMensagemErro()" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <span class="alt-importacao-csv-input-ckeck">
                      <i class="fa fa-exclamation-triangle"></i> Configure todos os vinculos obrigatórios para importar o arquivo.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div ng-show="importacaoCsvCtrl.steps[3].active"
            class="alt-importacao-csv-wizard-step">
            <div class="modal-body">

              <div class="row" ng-show="importacaoCsvCtrl.lote.quantidadeProcessados !== importacaoCsvCtrl.lote.quantidadeRegistros">
                <div class="col-xs-12 alt-importacao-csv-progress-details" ng-show="importacaoCsvCtrl.lote.quantidadeProcessados != 0">
                  <uib-progressbar class="progress-striped active" value="(importacaoCsvCtrl.lote.quantidadeProcessados/importacaoCsvCtrl.lote.quantidadeRegistros)*100" type="info">
                    <b>{{((importacaoCsvCtrl.lote.quantidadeProcessados/importacaoCsvCtrl.lote.quantidadeRegistros)*100).toFixed(0)}}%</b>&nbsp; processando...
                  </uib-progressbar>
                </div>
                <div class="col-xs-12 alt-importacao-csv-progress-details" ng-show="importacaoCsvCtrl.lote.quantidadeProcessados == 0">
                  <uib-progressbar class="progress-striped active" value="15" type="info">
                    processando...
                  </uib-progressbar>
                </div>
              </div>

              <div class="row alt-espacamento-bottom alt-importacao-registros-info">
                <div class="col-md-4" ng-show="!!importacaoCsvCtrl.lote.quantidadeImportadosSucesso">
                  <span class="alt-importacao-registros-numero text-success alt-espacamento-left" alt-importacao-csv-contador count-to="importacaoCsvCtrl.lote.quantidadeImportadosSucesso" duration="1" count-from="importacaoCsvCtrl.countFromImportadosSucesso"></span> registros importados
                </div>
                <div class="col-md-4" ng-show="!!importacaoCsvCtrl.lote.quantidadeImportadosAviso">
                  <span class="alt-importacao-registros-numero text-warning" alt-importacao-csv-contador count-to="importacaoCsvCtrl.lote.quantidadeImportadosAviso" duration="1" count-from="importacaoCsvCtrl.countFromImportadosAviso"></span> importados com aviso
                </div>
                <div class="col-md-4" ng-show="!!importacaoCsvCtrl.lote.quantidadeErros">
                  <span class="alt-importacao-registros-numero text-danger" alt-importacao-csv-contador count-to="importacaoCsvCtrl.lote.quantidadeErros" duration="1" count-from="importacaoCsvCtrl.countFromNaoImportados"></span> não importados
                </div>
              </div>

              <div class="row alt-espacamento-top" ng-show="importacaoCsvCtrl.lote.status == 1">
                <div class="col-md-12 alt-espacamento-left">
                  <h3 class="text-muted"><i class="fa fa-thumbs-up thumbs-success alt-espacamento-right"></i> Todos os registros foram importados!</h3>
                </div>
              </div>

              <div class="row alt-espacamento-top" ng-show="importacaoCsvCtrl.carregandoLogsItens">
                <div class="col-md-12 alt-espacamento-left text-center">
                  <br/><i class="text-muted fa fa-refresh fa-spin fa-3x fa-fw"></i>
                </div>
              </div>

              <div class="row alt-espacamento-top" ng-show="importacaoCsvCtrl.lote.status == 2">
                <div class="col-md-12">
                  <ul class="nav nav-tabs row alt-importacao-nav-tabs alt-espacamento-top" role="tablist">
                    <li class="alt-importacao-registros-conflito" role="presentation" ng-show="!!importacaoCsvCtrl.itensImportadosComAviso.length" ng-class="{'active': !importacaoCsvCtrl.itensNaoImportados.length}" koopon-comum-toggle-aba toggle="#koopon-importacao-importados-observacao" contexto="#alt-importacao-csv-modal">
                      <a href="">Importados com aviso ({{importacaoCsvCtrl.lote.quantidadeImportadosAviso}})</a>
                    </li>
                    <li class="alt-importacao-registros-erro" role="presentation" ng-show="!!importacaoCsvCtrl.itensNaoImportados.length" ng-class="{'active': !!importacaoCsvCtrl.itensNaoImportados.length}" koopon-comum-toggle-aba toggle="#koopon-importacao-nao-importados" contexto="#alt-importacao-csv-modal">
                      <a href="">Registros não importados ({{importacaoCsvCtrl.lote.quantidadeErros}})</a>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="row">

                <div class="col-md-12 alt-espacamento-top alt-espacamento-bottom">
                  <div class="tab-content alt-espacamento-top alt-espacamento-bottom" ng-show="importacaoCsvCtrl.lote.status == 2">
                    <div role="tabpanel" class="tab-pane" ng-class="{'active': !!importacaoCsvCtrl.itensNaoImportados.length}" id="koopon-importacao-nao-importados">

                      <div class="">
                        <div class="" ng-repeat="item in importacaoCsvCtrl.itensNaoImportados">

                          <div class="alt-importacao-csv-report row-{{ $index % 2 === 0 ? 'par' : 'impar' }}">
                            <div class="alt-importacao-csv-report-row-body">
                              <div class="row hidden-xs hidden-sm" ng-if="$first">
                                <div ng-repeat="campo in importacaoCsvCtrl.camposOrdenados" class="col-md-{{ campo.template.width }} alt-importacao-csv-report-title">{{ campo.nome }}</div>
                                <div class="col-md-1 alt-importacao-csv-report-title text-center">Status</div>
                                <div class="col-md-1 alt-importacao-csv-report-title">&nbsp;</div>
                              </div>

                              <div class="row">
                                <div ng-repeat="campo in importacaoCsvCtrl.camposOrdenados" class="col-md-{{ campo.template.width }} alt-importacao-csv-report-row" title="{{ importacaoCsvCtrl.obterPropriedadeTemplate(item.objeto, campo) }}">
                                  <span class="text-muted visible-xs-inline-block visible-sm-inline-block">{{ campo.nome }}:</span> <span ng-bind="importacaoCsvCtrl.obterPropriedadeTemplate(item.objeto, campo) | LimitadorTexto:campo.template.textLimit"></span>
                                </div>
                                <div class="col-xs-9 col-sm-9 col-md-1 alt-importacao-csv-report-row alt-importacao-csv-report-row-status" ng-switch="item.status">
                                  <span class="text-muted visible-xs-inline-block visible-sm-inline-block">Status:</span> 
                                  <i ng-switch-default class="fa fa-clock-o" aria-hidden="true"></i>
                                  <i ng-switch-when="1" class="fa fa-check-circle text-success" aria-hidden="true"></i>
                                  <i ng-switch-when="2" class="fa fa-times-circle text-danger" aria-hidden="true"></i>
                                  <i ng-switch-when="3" class="fa fa-exclamation-triangle text-warning" aria-hidden="true"></i>
                                  <span ng-switch-when="2" class="visible-xs-inline-block visible-sm-inline-block"> não importado</span>
                                  <span ng-switch-when="3" class="visible-xs-inline-block visible-sm-inline-block"> importado com observação</span>
                                </div>
                                <div class="col-xs-3 col-sm-3 col-md-1 alt-importacao-csv-report-row" ng-init="item.collapse = true">
                                  <button class="btn btn-sm btn-default pull-right alt-importacao-csv-report-row-button" ng-click="item.collapse = !item.collapse">
                                    <i ng-class="{'fa fa-angle-down': item.collapse, 'fa fa-angle-up': !item.collapse }"></i>
                                  </button>
                                </div>
                              </div>

                              <div ng-show="!item.collapse" class="alt-importacao-csv-report-row-detalhes">

                                <div class="row">
                                  <div class="alt-importacao-csv-report-row-head">
                                    <div class="alt-importacao-csv-report-row-head-title">Linha {{item.linha}}</div>
                                    <div class="alert alert-sm alert-danger" ng-bind-html="importacaoCsvCtrl.obterMensagemErro(item.mensagemErro)"></div>
                                  </div>
                                </div>

                                <div class="row">
                                  <div class="col-sm-6" ng-repeat="campo in importacaoCsvCtrl.campos" >
                                    <strong>{{ campo.nome }}:</strong> <span>{{ importacaoCsvCtrl.obterPropriedadeTemplate(item.objeto, campo) }}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                        <div class="ng-scope">
                          <div class="alt-importacao-detalhes-itens-footer">
                            <span ng-show="importacaoCsvCtrl.itensNaoImportados.length > 0 && importacaoCsvCtrl.itensNaoImportados.length === importacaoCsvCtrl.itensNaoImportados[0].qtdItens">
                              Exibindo todos os {{importacaoCsvCtrl.itensNaoImportados.length}} itens
                            </span>
                            <span ng-hide="importacaoCsvCtrl.itensNaoImportados.length > 0 && importacaoCsvCtrl.itensNaoImportados.length === importacaoCsvCtrl.itensNaoImportados[0].qtdItens">
                              Exibindo {{importacaoCsvCtrl.itensNaoImportados.length}} de
                              {{importacaoCsvCtrl.itensNaoImportados.length > 0 ? importacaoCsvCtrl.itensNaoImportados[0].qtdItens : 0}}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="alt-espacamento-top">
                        <koopon-comum-mais-resultados
                          visivel="importacaoCsvCtrl.itensNaoImportados.length > 0 && importacaoCsvCtrl.itensNaoImportados[0].qtdItens > importacaoCsvCtrl.itensNaoImportados.length"
                          busca="importacaoCsvCtrl.obterMaisItensNaoImportados()">
                        </koopon-comum-mais-resultados>
                      </div>
                    </div>

                    <div role="tabpanel" class="tab-pane" ng-class="{'active': !importacaoCsvCtrl.itensNaoImportados.length}" id="koopon-importacao-importados-observacao">

                      <div>
                        <div class="" ng-repeat="item in importacaoCsvCtrl.itensImportadosComAviso">

                          <div class="alt-importacao-csv-report row-{{ $index % 2 === 0 ? 'par' : 'impar' }}">
                            <div class="alt-importacao-csv-report-row-body">
                              <div class="row hidden-xs hidden-sm" ng-if="$first">
                                <div ng-repeat="campo in importacaoCsvCtrl.camposOrdenados" class="col-md-{{ campo.template.width }} alt-importacao-csv-report-title">{{ campo.nome }}</div>
                                <div class="col-md-1 alt-importacao-csv-report-title text-center">Status</div>
                                <div class="col-md-1 alt-importacao-csv-report-title">&nbsp;</div>
                              </div>

                              <div class="row">
                                <div ng-repeat="campo in importacaoCsvCtrl.camposOrdenados" class="col-md-{{ campo.template.width }} alt-importacao-csv-report-row" title="{{ importacaoCsvCtrl.obterPropriedadeTemplate(item.objeto, campo) }}">
                                  <span class="small text-muted visible-xs-inline-block visible-sm-inline-block">{{ campo.nome }}:</span>  <span ng-bind="importacaoCsvCtrl.obterPropriedadeTemplate(item.objeto, campo) | LimitadorTexto:campo.template.textLimit"></span>
                                </div>
                                <div class="col-xs-9 col-sm-9 col-md-1 alt-importacao-csv-report-row alt-importacao-csv-report-row-status" ng-switch="item.status">
                                  <span class="small text-muted visible-xs-inline-block visible-sm-inline-block">Status:</span> 
                                  <i ng-switch-default class="fa fa-clock-o" aria-hidden="true"></i>
                                  <i ng-switch-when="1" class="fa fa-check-circle text-success" aria-hidden="true"></i>
                                  <i ng-switch-when="2" class="fa fa-times-circle text-danger" aria-hidden="true"></i>
                                  <i ng-switch-when="3" class="fa fa-exclamation-triangle text-warning" aria-hidden="true"></i>
                                  <span ng-switch-when="2" class="visible-xs-inline-block visible-sm-inline-block"> não importado</span>
                                  <span ng-switch-when="3" class="visible-xs-inline-block visible-sm-inline-block"> importado com observação</span>
                                </div>
                                <div class="col-xs-3 col-sm-3 col-md-1 alt-importacao-csv-report-row" ng-init="item.collapse = true">
                                  <button class="btn btn-sm btn-default pull-right alt-importacao-csv-report-row-button" ng-click="item.collapse = !item.collapse">
                                    <i ng-class="{'fa fa-angle-down': item.collapse, 'fa fa-angle-up': !item.collapse }"></i>
                                  </button>
                                </div>
                              </div>

                              <div ng-show="!item.collapse" class="alt-importacao-csv-report-row-detalhes">

                                <div class="row">
                                  <div class="alt-importacao-csv-report-row-head">
                                    <div class="alt-importacao-csv-report-row-head-title">Registro {{item.linha}}</div>
                                    <div class="alert alert-sm alert-warning" ng-bind-html="importacaoCsvCtrl.obterMensagemErro(item.mensagemErro)"></div>
                                  </div>
                                </div>

                                <div class="row">
                                  <div class="col-sm-6" ng-repeat="campo in importacaoCsvCtrl.campos" >
                                    <strong>{{ campo.nome }}:</strong> <span>{{ importacaoCsvCtrl.obterPropriedadeTemplate(item.objeto, campo) }}</span>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                        <div class="ng-scope">
                          <div class="alt-importacao-detalhes-itens-footer">
                            <span ng-show="importacaoCsvCtrl.itensImportadosComAviso.length > 0 && importacaoCsvCtrl.itensImportadosComAviso.length === importacaoCsvCtrl.itensImportadosComAviso[0].qtdItens">
                              Exibindo todos os {{importacaoCsvCtrl.itensImportadosComAviso.length}} itens
                            </span>
                            <span ng-hide="importacaoCsvCtrl.itensImportadosComAviso.length > 0 && importacaoCsvCtrl.itensImportadosComAviso.length === importacaoCsvCtrl.itensImportadosComAviso[0].qtdItens">
                              Exibindo {{importacaoCsvCtrl.itensImportadosComAviso.length}} de
                              {{importacaoCsvCtrl.itensImportadosComAviso.length > 0 ? importacaoCsvCtrl.itensImportadosComAviso[0].qtdItens : 0}}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="alt-espacamento-top">
                        <koopon-comum-mais-resultados
                          visivel="importacaoCsvCtrl.itensImportadosComAviso.length > 0 && importacaoCsvCtrl.itensImportadosComAviso[0].qtdItens > importacaoCsvCtrl.itensImportadosComAviso.length"
                          busca="importacaoCsvCtrl.obterMaisItensImportadosComAviso()">
                        </koopon-comum-mais-resultados>
                      </div>

                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
        <div class="modal-footer" ng-hide="importacaoCsvCtrl.visualizacao">
          <button type="button" class="btn btn-default pull-left" 
            ng-click="importacaoCsvCtrl.prevStep()"
            ng-hide="importacaoCsvCtrl.steps[0].active">
            <i class="fa fa-long-arrow-left"></i> Anterior
          </button>

          <button type="button" class="btn btn-primary"
            ng-show="importacaoCsvCtrl.steps[0].active || (importacaoCsvCtrl.exibeEtapaRegras && importacaoCsvCtrl.steps[1].active)"
            ng-click="importacaoCsvCtrl.invalidStep(importacaoCsvCtrl.nextStep)">
            Importar
          </button>

          <button type="button" class="btn btn-primary"
            ng-hide="importacaoCsvCtrl.steps[0].active || (importacaoCsvCtrl.exibeEtapaRegras && importacaoCsvCtrl.steps[1].active)"
            ng-click="importacaoCsvCtrl.invalidStep(importacaoCsvCtrl.salvarImportacao)">
            Importar
          </button>

          <button type="button" class="btn btn-default" ng-click="importacaoCsvCtrl.limparImportacao()">Cancelar</button>
        </div>
        <div class="modal-footer" ng-show="importacaoCsvCtrl.visualizacao">
          <button type="button" class="btn btn-default" ng-click="importacaoCsvCtrl.limparImportacao()">Fechar</button>
        </div>
      </div>
    </div>
  </div>`;

  ng.module('alt.importacao-csv')
    .service('AltImportacaoCsvEspecificaService', ['$rootScope', 'AltImportacaoCsvEvento', function ($rootScope, evento) {
      this.exibe = function (opcoes) {
        $rootScope.$broadcast(evento.modal.ABRE_MODAL_IMPORTACAO_ESPECIFICA, opcoes);
      };
      this.atualizarProcessamento = function (opcoes) {
        $rootScope.$broadcast(evento.processamento.ATUALIZAR_LOTE, opcoes);
      };
    }])
    .directive('altImportacaoCsvEspecifica', [function () {
      var _scope = {};
      var _restrict = 'A';
      var _replace = true;

      var _controller = [
        '$rootScope',
        '$scope',
        '$sce',
        '$q',
        '$timeout',
        'AltModalService',
        'AltSelectService',
        'AltAlertaFlutuanteService',
        'AltImportacaoCsvCampoModel',
        'AltImportacaoCsvLoteModel',
        'AltImportacaoCsvModel',
        'AltImportacaoCsvEvento',
        'AltImportacaoCsvOpcoesTituloMensagemModel',
        'AltCarregandoInfoService',
        'moment',
        function($rootScope, $scope, $sce, $q, $timeout, modalService, selectService, alertaService, Campo, Lote, Importacao, evento, OpcoesImportacaoTituloMensagemModel, AltCarregandoInfoService, moment) {
        var self = this;

        const ID_MODAL = '#alt-importacao-csv-modal';
        const ID_COMUM_SELECTS_REGRAS = '#alt-importacao-csv-rules-select';
        const CLASS_SELECT_CAMPOS = '.alt-importacao-csv-select-field';
        const CLASS_PLANILHA_MAPEAMENTO = '.alt-importacao-csv-planilha-mapeamento';
        const QTD_MAXIMA_VINCULO_REGRAS_MANUAIS = 10;

        self.itensNaoImportados = [];
        self.itensImportadosComAviso = [];

        var _inicializarMapeamento = function() {

          if (!!self.importacao) {
            // roda quando o valor de arquivoOpcoes.colunasPossuemTitulos é alternado
            // atualizando apenas o nome do titulo da coluna e mantendo todo o restante dos dados
            self.arquivo.colunas.map((col, i) => {
              self.importacao.colunas[i].nome = col;
            });

            self.arquivoAnterior = ng.copy(self.arquivo);
          } else {
            self.importacao = new Importacao(self.campos, self.validarMapa);

            self.arquivo.colunas.map((col, i) => {
              self.importacao.adicionarColuna(col, i);
            });
          }

          self.importacao.validarMapa();

          selectService.inicializar(CLASS_SELECT_CAMPOS);
          $timeout(() => {
            $(CLASS_PLANILHA_MAPEAMENTO)[0].scrollLeft = 0;
          });
        };

        var _inicializarRegras = function() {
          self.importacao.aplicarRegrasDeValor(self.arquivo.linhas).then((resumo) => {
            self.resumoRegrasDeValor = resumo;

            var camposRegrasRequisitadas = _.filter(self.importacao.campos, (campo) =>
              campo.tipo === Object &&
              campo.quantidadeRegrasSemVinculo > 0 &&
              campo.obrigatorio);
  
            if (camposRegrasRequisitadas.length === 0) {
              return self.salvarImportacao();
            }
  
            for (var i=0; i< camposRegrasRequisitadas.length; i++) {
              var campo = camposRegrasRequisitadas[i];
  
              if (campo.quantidadeRegrasSemVinculo > QTD_MAXIMA_VINCULO_REGRAS_MANUAIS) {
                self.prevStep();
                self._exibeMensagemExcessoRegras(campo);
                break;
              }

              var indexPendente = 0;
              campo.regrasDeValor.forEach((regra, index) => {
                if (regra.autoVinculoAplicado) {
                  return;
                }

                var id = ID_COMUM_SELECTS_REGRAS + '-' + campo.chave + '-' + indexPendente;
                if (!!campo.objetoCriarNovo) {
                  self.inicializarComboComOpcaoCriarNovo(id, campo.chave, index);
                }
                else {
                  selectService.inicializar(id);
                }
                indexPendente++;
              });
            }
          });
        };

        var _focoInicialAbasDetalhes = function() {
          if (self.lote.quantidadeErros > 0) {
            $('.alt-importacao-registros-erro a').click();
          }
          else if (self.lote.quantidadeImportadosAviso > 0) {
            $('.alt-importacao-registros-conflito a').click();
          }
        }

        var _visualizarProcessado = function(opcoes) {
          self.visualizacao = true;
          self.steps[0].active = false;
          self.steps[3].active = true;

          self.itensNaoImportados = [];
          self.itensImportadosComObservacao = [];

          self.lote = new Lote(opcoes.loteProcessado);
          self.obterItensNaoImportados = opcoes.obterItensNaoImportados;
          self.obterItensImportadosComAviso = opcoes.obterItensImportadosComAviso;

          self.carregandoLogsItens = true;
          $q.all([
            self.obterItensNaoImportados(self.lote.idLoteImportacao),
            self.obterItensImportadosComAviso(self.lote.idLoteImportacao) 
          ])
          .then((resultado) => {
            self.itensNaoImportados = resultado[0];
            self.itensImportadosComAviso = resultado[1];
            _focoInicialAbasDetalhes();
          })
          .finally(() => self.carregandoLogsItens = false);
        };

        var _atualizarProcessamentoLote = function(opcoes) {
          if (!self.lote) return;

          if (opcoes.loteProcessado.status != 0) {
            _visualizarProcessado(opcoes);
          }
          else {
            self.countFromImportadosSucesso = self.lote.quantidadeImportadosSucesso;
            self.countFromImportadosAviso = self.lote.quantidadeImportadosAviso;
            self.countFromNaoImportados = self.lote.quantidadeErros;
  
            self.lote.quantidadeImportadosSucesso = opcoes.loteProcessado.quantidadeImportadosSucesso;
            self.lote.quantidadeImportadosAviso = opcoes.loteProcessado.quantidadeImportadosAviso;
            self.lote.quantidadeErros = opcoes.loteProcessado.quantidadeErros;
            self.lote.quantidadeProcessados = opcoes.loteProcessado.quantidadeProcessados;
            self.lote.status = opcoes.loteProcessado.status;
          }
        };

        var _inicializar = function(opcoes) {
          self.labelTipo = opcoes.labelTipo;
          self.labelTipoSingular = opcoes.labelTipoSingular;
          self.validarLote = opcoes.validarLote;
          self.gravarLote = opcoes.gravarLote;
          self.validarMapa = opcoes.validarMapa;
          self.eventoCriacao = opcoes.eventoCriacao;
          self.campos = ng.copy(opcoes.campos);
          self.camposConfigurados = ng.copy(opcoes.campos);

          self.arquivoAnterior = null;
          self.arquivo = null;
          self.arquivoOpcoes = {
            colunasPossuemTitulos: false
          };
          self.colunasSelecao = null;
          self.lote = null;
          self.visualizacao = false;
          self.importacao = undefined;
          self.resumoRegrasDeValor = undefined;
          self.itensNaoImportados = [];
          self.itensImportadosComObservacao = [];
          self.exibirMensagemErro = false;
          self.countFromImportadosSucesso = 0;
          self.countFromImportadosAviso = 0;
          self.countFromNaoImportados = 0;

          self.exibeEtapaRegras = _.filter(self.camposConfigurados, {tipo: Object}).length !== 0;

          let _step1 = null;
          let _step2 = null;
          let _step3 = null;

          if (!!opcoes.titulosMensagensCustomizadas && opcoes.titulosMensagensCustomizadas.length) {
            _step1 = opcoes.obterTitulosMensagensPorStep(1);
            _step2 = opcoes.obterTitulosMensagensPorStep(2);
            _step3 = opcoes.obterTitulosMensagensPorStep(3);
          }

          self.steps = [
            {
              name: 'Passo 1',
              number: 1,
              active: true,
              progress: self.exibeEtapaRegras ? 16.65 : 25,
              init: null,
              title: _step1 ? _step1.title : 'Importar dados',
              message: _step1 ? $sce.trustAsHtml(_step1.message) : $sce.trustAsHtml('Selecione o arquivo para importação com extensão xls, xlsx, ods ou csv')
            },
            {
              name: 'Passo 2',
              number: 2,
              active: false,
              progress: self.exibeEtapaRegras ? 49.95 : 75,
              init: _inicializarMapeamento,
              title:  _step2 ? _step2.title : 'Configurar importação',
              message: _step2 ? $sce.trustAsHtml(_step2.message) : $sce.trustAsHtml('Selecione o(s) campo(s) do ERP4ME correspondente(s) a cada coluna do arquivo para realizar a importação')
            },
            {
              name: 'Passo 3',
              number: 3,
              active: false,
              progress: self.exibeEtapaRegras ? 83.28 : 100,
              init: _inicializarRegras,
              title:  _step3 ? _step3.title : 'Configurar vínculos',
              message: _step3 ? $sce.trustAsHtml(_step3.message) : $sce.trustAsHtml('Vincule a informação do arquivo ao cadastro do ERP for Me!'),
              menuHidden: !self.exibeEtapaRegras
            },
            {
              name: 'Visualização',
              number: 4,
              active: false,
              progress: 100,
              init: null, // _inicializarRevisao,
              title: '',
              message: $sce.trustAsHtml(''),
              menuHidden: true
            }
          ];

          self.progress = self.steps[0].progress;
          self.camposOrdenados = self.gerarCamposOrdenadosListaVisualizacao(opcoes.campos);

          if (!!opcoes.visualizacao) {
            _visualizarProcessado(opcoes);
          }

        };

        var _ajustaAlturaModal = function() {
          $('.alt-importacao-csv-wrapper').css('max-height', `${($(window).height() - 270)}px`);
        };

        self.obterMaisItensNaoImportados = function () {
          return self.obterItensNaoImportados(self.lote.idLoteImportacao, true).then((itens) => {
            itens.forEach((i) => {
              self.itensNaoImportados.push(i);
            });
          });
        };

        self.obterMaisItensImportadosComAviso = function () {
          return self.obterItensImportadosComAviso(self.lote.idLoteImportacao, true).then((itens) => {
            itens.forEach((i) => {
              self.itensImportadosComAviso.push(i);
            });
          });
        };

        self.getTitle = function () {
          let step = _.find(self.steps, (item) => { return item.active === true; });
          return step ? step.title : '';
        };

        self.getMessage = function () {
          let step = _.find(self.steps, (item) => { return item.active === true; });
          return step ? step.message : '';
        };

        self.nextStep = function() {
          self.removerMensagemErro();

          AltCarregandoInfoService.exibe();

          $timeout(() => {
            var current = _.findIndex(self.steps, {active: true});
            var currentStep = self.steps[current];
            var nextStep = self.steps[current + 1];

            currentStep.active = false;
            currentStep.completed = true;
            nextStep.active = true;
            self.progress = nextStep.progress;
            nextStep.init();

            AltCarregandoInfoService.esconde();
          }, 200);
        };

        self.prevStep = function() {
          self.removerMensagemErro();

          var current = _.findIndex(self.steps, {active: true});
          self.steps[current].active = false;
          self.steps[current].completed = false;
          self.steps[current - 1].active = true;
          self.progress = self.steps[current - 1].progress;
        };

        self.reloadStep = function(index) {
          var step = self.steps[index];
          if (!!step && !!step.init) {
            step.init();
          }
        };

        self.invalidStep = function(fn) {
          var index = _.findIndex(self.steps, {active: true});
          var invalid = false;

          switch (index) {
            case 0:
              invalid = (!self.arquivo || !self.arquivo.valido);
              break;
            case 1:
              invalid = self.importacao.validarMapa();
              break;
            case 2:
              invalid = self.resumoRegrasDeValor.nulosInvalidos > 0;
              break;
            case 3:
              invalid = (self.lote && self.lote.erros !== 0);
              break;
          }

          if (invalid) {
            self.exibirMensagemErro = true;
            return invalid;
          }

          fn();
          return invalid;
        };

        self.vincular = function(campo, coluna) {
          self.importacao.vincular(campo, coluna);
          selectService.inicializar(CLASS_SELECT_CAMPOS);
        };

        self.desvincular = function(campo) {
          self.importacao.validarMapa();

          self.importacao.desvincular(campo);
          selectService.inicializar(CLASS_SELECT_CAMPOS);
        };

        self.campoNaoMapeado = function(campo) {
          return ng.isUndefined(campo.coluna);
        };

        self.resumirRegrasDeValor = function() {
          self.importacao.resumirRegrasDeValor().then((resumo) => {
            ng.extend(self.resumoRegrasDeValor, resumo);

            if (self.resumoRegrasDeValor.nulosInvalidos === 0) {
              self.removerMensagemErro();
            }
          });
        };

        self.permiteAlteracaoArquivo = function() {
          var current = _.findIndex(self.steps, {active: true});
          return current === 2 || current === 3;
        };

        self.arquivoAlterado = function() {
          self.removerMensagemErro();

          var index = _.findIndex(self.steps, {active: true});
          var etapaInicial = index === 0;
          var etapaMapa = index === 1;
          var etapaRegras = index === 2;
          var etapaRevisao = index === 3;

          if (!!self.arquivoAnterior && self.arquivoAnterior.nome !== self.arquivo.nome && !etapaInicial) {
            self.arquivo = ng.copy(self.arquivoAnterior);
            return alertaService.exibe({msg: 'O nome do documento deve coincidir com o do arquivo da importação.'});
          }

          if (!!self.arquivoAnterior && self.arquivoAnterior.nome !== self.arquivo.nome) {
            self.importacao = undefined;
          }

          if (etapaInicial && (self.arquivoAnterior ? self.arquivoAnterior.nome !== self.arquivo.nome : false)) {
            self.campos = ng.copy(self.camposConfigurados); // reinicializa campos p/ limpar colunas vinculadas.
          }

          if (etapaMapa) {
            _inicializarMapeamento();
            return;
          }

          if (etapaRegras) {
            self.campos.forEach((campo) => {
              campo.regrasDeValor = undefined; // limpa regras para não serem reaproveitadas, já não se pode garantir a equivalência dos dados.
            });
          }

          if (etapaRevisao) {
            self.lote = undefined; // limpa lote para que não seja reaproveitada informação de linhas desconsideradas.
          }

          self.arquivoAnterior = ng.copy(self.arquivo);
          self.reloadStep(index);
        };

        self.criarNovoObjetoDeRegra = function(chaveCampo, idRegra, indexRegra) {
          modalService.close(ID_MODAL);
          $timeout(() => {
            var campo = _.find(self.importacao.campos, {chave: chaveCampo});
            if (!!campo.objetoCriarNovo && !!campo.objetoCriarNovo.funcao) {
              campo.objetoCriarNovo.funcao();
              campo.atribuirNovoARegra = indexRegra;
              campo.atribuirNovoARegraId = idRegra;

              $scope.$on(campo.objetoCriarNovo.eventoAtualizacao, (ev, objNovo) => {
                if (campo.atribuirNovoARegra !== undefined) {
                  modalService.open(ID_MODAL);

                  $timeout(() => {
                    campo.regrasDeValor[campo.atribuirNovoARegra].objeto = objNovo;
                    self.inicializarComboComOpcaoCriarNovo(campo.atribuirNovoARegraId, campo.chave, campo.atribuirNovoARegra);
                    campo.atribuirNovoARegra = undefined;
                    campo.atribuirNovoARegraId = undefined;
                    self.resumirRegrasDeValor();
                  }, 200);
                }
              });
            }
          }, 200);
        };

        self.limparRegra = function(campo, indexRegra) {
          var regra = campo.regrasDeValor[indexRegra];
          regra.objeto = undefined;
          var id = ID_COMUM_SELECTS_REGRAS + '-' + campo.chave + '-' + indexRegra;
          if (!!campo.objetoCriarNovo) {
            self.inicializarComboComOpcaoCriarNovo(id, campo.chave, indexRegra);
          }
          else {
            selectService.inicializar(id);
          }
          self.resumirRegrasDeValor();
        };

        self.ocultarCampo = function(campo) {
          var totalRegras = _.sumBy(campo.regrasDeValor, 'quantidade');
          return (!campo.obrigatorio && !campo.possuiColunaMapeada()) || totalRegras === 0;
        }

        self.inicializarComboComOpcaoCriarNovo = function(id, chaveCampo, indexRegra) {
          $timeout(() => {
            selectService.inicializarComOpcaoCriarNovo(id, {
              escopo: $scope,
              strMetodo: `importacaoCsvCtrl.criarNovoObjetoDeRegra('${chaveCampo}', '${id}', ${indexRegra})`
            }, {});
          });
        };

        self.salvarImportacao = function() {
          AltCarregandoInfoService.exibe();

          $timeout(() => {
            var loteProvisorio = self.importacao.montarLote(self.arquivo.linhas, self.arquivo.nome, self.lote);

            self.validarLote(loteProvisorio).then((lote) => {
              self.lote = lote;

              var lotePersistencia = ng.copy(self.lote);
              // _.remove(lotePersistencia.itens, (item) => {return item.desconsiderado;});

              self.gravarLote(lotePersistencia)
              .then((resp) => {
                self.limparImportacao();

                $rootScope.$broadcast(self.eventoCriacao, resp);
              })
              .catch((erro) => {
                if (erro && erro.data && erro.data.informacaoDuplicada) {
                  self.limparImportacao();
                }
              });

              return true;
            });
          }, 200);
        };

        self.editarObjeto = function(item) {
          if (typeof item.editar === 'function') {
            modalService.close(ID_MODAL);
            item.editar(item.idObjeto, item.objeto);
            $scope.$on(item.eventoEdicaoConcluida, () => {
              modalService.open(ID_MODAL);
            });
          }
        };

        self.nomeColuna = function(numero) {
          var coluna = _.find(self.importacao.colunas, {numero: numero});
          return coluna ? coluna.nome : '';
        };

        self.ngOptionsRegraDeCampo = function(campo) {
          var select = 'obj as obj[campo.objetoReferencia]';
          var from = 'for obj in campo.objetoListagem()';
          var trackBy = 'track by obj[campo.objetoChave]';
          var groupBy = '';
          var orderBy = '';

          if (!!campo.objetoOpcoesListagem.groupBy) {
            groupBy = 'group by obj[campo.objetoOpcoesListagem.groupBy] ';
          }
          if (!!campo.objetoOpcoesListagem.orderBy && $.isArray(campo.objetoOpcoesListagem.orderBy)) {
            orderBy = `| orderBy:[${_.map(campo.objetoOpcoesListagem.orderBy, (str) => { return "'" + str + "'"; }).toString()}]`;
          }

          return `${select} ${groupBy} ${from} ${orderBy} ${trackBy}`;
        };

        self.obterQtdCamposRegras = function (campos) {
          return campos.filter((campo) => {
            return campo.tipo.name === 'Object';
          }).length;
        };

        self.gerarCamposOrdenadosListaVisualizacao = function (campos) {
          let _filtro = campos.filter((campo) => campo.template.column !== undefined);

          return _.sortBy(_filtro, 'template.column');
        };

        self.obterPropriedadeTemplate = function (obj, campo) {
          if (typeof obj === 'undefined' || !campo || !campo.template || !campo.template.property) {
            return false;
          }
          if (typeof campo.template.property === 'function') {
            return campo.template.property(obj);
          }

          let _index = campo.template.property.indexOf('.');

          if (_index > -1) {
            var campoExibicao = angular.copy(campo);
            campoExibicao.property = campo.template.property.substr(_index + 1);
            return self.obterPropriedadeTemplate(obj[campo.template.property.substring(0, _index)], campoExibicao);
          }

          if (campo.tipo === Date) {
            var template = obj[campo.template.property];
            var m = moment(template);
            return m.isValid() ? m.format('DD/MM/YYYY') : template;
          }

          return obj[campo.template.property];
        };

        self.obterMensagemErro = function (msg) {
          return $sce.trustAsHtml(msg);
        };

        self.formatarLinhaValor = function (valor) {
          if (valor instanceof Date) {
            let m = moment(valor).add(1, 'days').format('DD/MM/YYYY');
            return m;
          }

          return valor;
        };

        self.removerMensagemErro = function () {
          self.exibirMensagemErro = false;
        };

        self._exibeMensagemExcessoRegras = function(campo) {
          alertaService.exibe({
            tipo: 'warning',
            titulo: 'Atenção',
            msg: campo.mensagemExcessoRegras(QTD_MAXIMA_VINCULO_REGRAS_MANUAIS)
          });
        };

        self.limparImportacao = function () {
          self.arquivo = null;
          self.arquivoAnterior = null;
          self.lote = null;
          self.arquivoOpcoes.colunasPossuemTitulos = undefined;

          ng.element('.alt-importacao-csv-wrapper .anexos-input-file-real').val('');
          ng.element('.alt-importacao-csv-wrapper .anexos-input-file-real')[0] = null;

          modalService.close(ID_MODAL);
        };

        $scope.$on(evento.modal.ABRE_MODAL_IMPORTACAO_ESPECIFICA, (ev, opcoes) => {
          _inicializar(opcoes);
          _ajustaAlturaModal();
          modalService.open(ID_MODAL);
        });

        $scope.$on(evento.processamento.ATUALIZAR_LOTE, (ev, opcoes) => {
          _atualizarProcessamentoLote(opcoes);
        });
      }];

      return {
        restrict: _restrict,
        replace: _replace,
        template: TEMPLATE,
        scope: _scope,
        controller: _controller,
        controllerAs: 'importacaoCsvCtrl'
      };
    }
  ]);
}(angular));
;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
  .directive('altImportacaoCsvLeitor', [
    'XLS',
    'XLSX',
    'AltCarregandoInfoService',
    function(XLS, XLSX, carregandoService) {
      return {
        require: 'ngModel',
        scope: {opts: '='},
        link: (scope, el, attrs, ngModel) => {
          var MAX_SIZE = 2097152;
          var MAX_SIZE_TEXT = '2MB';
          var MAX_REGS = 3000;
          var MAX_REGS_TEXT = '3.000';

          scope.dadosArquivo = null;
          scope.file = null;
          scope.path = null;

          function workbookToJson(workbook, sheetToJsonOptions) {
            var result = {};
            workbook.SheetNames.forEach((sheetName) => {
              var row = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName], sheetToJsonOptions);
              
              if (row.length > 0) {
                result[sheetName] = row;
              }
            });

            return result;
          }

          function obterExtensao (name) {
            return name.substring(name.lastIndexOf('.') + 1, name.length).toLowerCase();
          }

          function extensaoValida(extensao) {
            switch (extensao) {
              case 'xls':
                return true;
              case 'xlsx':
                return true;
              case 'csv':
                return true;
              case 'ods':
                return true;
              default:
                return false;
            }
          }

          function obterColunas(sheet) {
            var headers = [];

            if (!sheet) {
              return headers;
            }

            var range = XLSX.utils.decode_range(sheet['!ref']);
            var C, R = range.s.r;

            for (C = range.s.c; C <= range.e.c; ++C) {
              var hdr = '';

              if (!!scope.opts && scope.opts.colunasPossuemTitulos) {
                var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})];

                if (cell && cell.t) {
                  hdr = XLSX.utils.format_cell(cell);
                } else {
                  hdr = 'coluna ' + (C + 1);
                }
              } else {
                hdr = 'coluna ' + (C + 1);
              }

              headers.push(hdr);
            }
            return headers;
          }

          function obterLinhas (workbook, colunas) {
            let sheetToJsonOptions = {
              raw: true,
              range: 1,
              header: colunas
            };

            if (!!scope.opts && !scope.opts.colunasPossuemTitulos && !!colunas && colunas.length) {
              sheetToJsonOptions.range = 0;
            }

            var fileObject = workbookToJson(workbook, sheetToJsonOptions);

            return fileObject[Object.keys(fileObject)[0]];
          }

          function fileReaderHandler (file) {
            var reader = new FileReader();

            carregandoService.exibe();

            reader.onload = function (e) {
              var bstr = undefined;
              var workbook = undefined;
              var colunas = [];
              var linhas = [];

              scope.path = scope.path ? scope.path : ng.element(el[0]).val();

              var nome = scope.path ? scope.path.split('\\')[2] : '';
              var extensao = obterExtensao(nome);
              var size = file.size;

              var valido = true;
              var mensagem = '';

              // valida extensao
              if (!extensaoValida(extensao)) {
                valido = false;
                mensagem = 'Selecione um arquivo válido, tipos permitidos: XLS, XLSX, CSV e ODS';
              }

              // valida tamanho do arquivo
              else if (size > MAX_SIZE) {
                valido = false;
                mensagem = 'Selecione um arquivo válido, o tamanho máximo de arquivo permitido é de ' + MAX_SIZE_TEXT;
              }

              else {
                // le o arquivo e monta colunas e linhas
                bstr = e.target.result;
                workbook = XLSX.read(bstr, {type: 'binary', cellDates: true});
                colunas = obterColunas(workbook.Sheets[workbook.SheetNames[0]]);
                linhas = obterLinhas(workbook, colunas);
              }

              // valida quantidade de registros
              if (linhas.length > MAX_REGS) {
                valido = false;
                mensagem = 'Selecione um arquivo válido, a quantidade máxima permitida para importação é de ' + MAX_REGS_TEXT + ' registros';
              }

              scope.dadosArquivo = {
                colunas: colunas,
                linhas: linhas,
                dezPrimeirasLinhas: linhas.slice(0, 10),
                nome: nome,
                extensao: extensao,
                valido: valido,
                mensagem: mensagem
              };

              scope.$apply(() => {
                ngModel.$setViewValue(scope.dadosArquivo);
                ngModel.$render();
                ng.element(el).val('');

                carregandoService.esconde();
              });
            };

            reader.readAsBinaryString(file);
          }

          function onChangeHandler (changeEvent) {
            carregandoService.exibe();

            scope.dadosArquivo = null;
            scope.file = null;
            scope.path = null;

            scope.file = changeEvent.target.files[0];
            fileReaderHandler(scope.file);
          }

          el.on('change', onChangeHandler);

          scope.$watch('opts.colunasPossuemTitulos', (newValue, oldValue) => {
            if (!scope.dadosArquivo) {
              ng.element(el).val('');
              scope.file = null;
            } else if ((!!newValue || !!oldValue) && newValue !== undefined && !!scope.file) {
              fileReaderHandler(scope.file);
            } else {
              scope.dadosArquivo = undefined;
              ng.element(el).val('');
            }
          });
        }
      };
    }
  ]);
}(angular));

;(function(ng) {
    'use strict';

    ng.module('alt.importacao-csv')
    /**
    * @description Filtro que retorna o texto limitado
    * @class alt.importacao-csv.LimitadorTexto
    * @memberof alt.importacao-csv
    */
    .filter('LimitadorTexto', ['_', function (_) {
      /**
       * @description Retorna o texto limitado
       * @memberof alt.importacao-csv.LimitadorTexto
       * @function limitadorTexto
       * @param {string} o texto a ser filtrado
       * @param {number} o número do limite
       * @returns {string} retorna a string limitada
       * @inner
       */
      return function (input, val) {
          if (!input) {
              return;
          }

          var _tamanho = val || 53;

          if (input.length > _tamanho) {
              input = _.truncate(input, {
                  length: _tamanho
              });
          }

          return typeof input === "string" ? input.trim() : input;
      };
    }]);
}(angular));

;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvCampoModel', [
      '$sce',
      '$filter',
      '$log',
      'moment',
      'latinize',
      function($sce, $filter, $log, moment, latinize) {
      class CampoImportacao {
        constructor(e) {
          this.nome = '';
          this.chave = '';
          this.obrigatorio = false;
          this.dado = '';
          this.coluna = undefined;
          this.valor = undefined;
          this.referencia = undefined;
          this.valido = false;
          this.tipo = undefined;
          this.vinculoRequisitado = false;
          this.template = {};
          this.objetoChave = undefined;
          this.objetoListagem = undefined;
          this.objetoReferencia = undefined;
          this.objetoAutoVinculo = undefined;
          this.objetoCriarNovo = undefined;
          this.possuiRegrasSemVinculo = false;
          this.objetoOpcoesListagem = {};
          this.mensagens = [];

          ng.extend(this, e);

          this._parseObrigatorio();
          this._parseObjetoAutoVinculo();
          this._parseTipo();
          this._parseTemplate();
          this._validarOpcoes();
        }

        _validarOpcoes() {
          if (!this.nome) {
            throw new Error('Parametro "nome" é obrigatório.');
          }
          if (!this.chave) {
            throw new Error('Parametro "chave" é obrigatório.');
          }
          if (this.tipo === Object && !this.objetoChave) {
            throw new Error('Parametro "objetoChave" é obrigatório para campo Object.');
          }
          if (this.tipo === Object && !this.objetoReferencia) {
            throw new Error('Parametro "objetoReferencia" é obrigatório para campo Object.');
          }
          if (this.tipo === Object && !this.objetoListagem) {
            throw new Error('Parametro "objetoListagem" é obrigatório para campo Object.');
          }
        }

        _parseObrigatorio() {
          this.obrigatorio = !!this.obrigatorio;
        }

        _parseObjetoAutoVinculo() {
          if (this.tipo === Object && (!this.objetoAutoVinculo || typeof this.objetoAutoVinculo !== "function")) {
            this.objetoAutoVinculo = (valor) => {
              var obj = undefined;
              if (valor) {
                valor = latinize(valor.toLowerCase());
                this.objetoListagem().forEach((o) => {
                  if (latinize(o[this.objetoReferencia]).toLowerCase() === valor) {
                    obj = o;
                    return;
                  }
                });
              }
              return obj;
            };
          }
        }

        _parseTipo() {
          if (this.tipo !== Object && this.tipo !== Date && this.tipo !== Boolean && this.tipo !== Number) {
            this.tipo = String;
          }
        }

        _parseTemplate() {
          this.template = {
            width: typeof this.template.width === "number" ? this.template.width : 12,
            label: this.template.label ? this.template.label : this.nome,
            textLimit: this.template.textLimit ? this.template.textLimit : 53,
            property: this.template.property ? this.template.property : this.chave,
            column: !!this.template.column ? parseInt(this.template.column) : undefined
          };
        }

        _incluirMensagemValidacao(texto) {
          this.mensagens.push({
            textoHtml: $sce.trustAsHtml('O campo <u>' + this.template.label + '</u> ' + texto + '.')
          });
        }

        possuiColunaMapeada() {
          return !!this.coluna;
        }

        possuiRegraGeral() {
          var regra = _.find(this.regrasDeValor, {geral: true});
          return !!regra && !!regra.objeto;
        }

        possuiVinculoOuRegraGeral() {
          return this.possuiColunaMapeada() || this.possuiRegraGeral();
        }
      }

      return CampoImportacao;
    }]);
}(angular));

;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvItemModel', ['AltImportacaoCsvResumoItemModel', function(ResumoItemImportacao) {
      class ItemImportacao {
        constructor(linha, objeto) {
          this.linha = linha;
          this.objeto = objeto;
        }
      }

      return ItemImportacao;
    }]);
}(angular));

;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvLoteModel', [function() {
      class LoteImportacao {
        constructor(lote) {
          this.itens = [];
          this.processando = 0;
          this.validos = 0;
          this.erros = 0;
          this.conflitos = 0;
          this.nomeArquivo = '';
          this.quantidadeImportadosSucesso = 0;
          this.quantidadeImportadosAviso = 0;
          this.quantidadeErros = 0;

          ng.extend(this, lote);
        }
      }

      return LoteImportacao;
    }]);
}(angular));

;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
  .factory('AltImportacaoCsvModel', [
    '$q',
    '$sce',
    'AltImportacaoCsvItemModel',
    'AltImportacaoCsvLoteModel',
    'AltImportacaoCsvRegraModel',
    '_',
    function($q, $sce, ItemImportacao, LoteImportacao, RegraImportacao, _) {
      class Importacao {
        constructor(campos, validacaoEspecifica) {
          this.campos = campos;

          this.colunas = [];
          this.mapaInvalido = false;
          this.mensagensMapa = [];
          this.validacaoEspecifica = angular.noop;

          if (typeof validacaoEspecifica === 'function') {
            this.validacaoEspecifica = validacaoEspecifica;
          }
        }

        validarMapa() {
          this.mapaInvalido = false;
          this.mensagensMapa = [];

          this.campos.forEach((campo) => {
            if (campo.tipo === Object) {
              return;
            }
            if (campo.obrigatorio && !campo.coluna) {
              this.mapaInvalido = true;
              this.mensagensMapa.push($sce.trustAsHtml(`O campo <b>${campo.nome}</b> deve ser vinculado a uma coluna do arquivo.`));
            }
          });

          var erros = this.validacaoEspecifica(this.campos);
          if (Array.isArray(erros) && erros.length > 0) {
            this.mapaInvalido = true;
            this.mensagensMapa = this.mensagensMapa.concat(erros);
          }

          return this.mapaInvalido;
        }

        adicionarColuna(nome, index) {
          this.colunas.push({
            nome: nome,
            numero: index + 1,
            titulo: 'Coluna ' + (index + 1) + ' – ' + nome,
            campos: []
          });
        }

        vincular(chaveCampo, numeroColuna) {
          var campo = _.find(this.campos, {chave: chaveCampo});
          var coluna = _.find(this.colunas, {numero: numeroColuna});
          if (!!campo && !!coluna) {
            campo.coluna = numeroColuna;
            coluna.campos.push(campo);
            this.validarMapa();
          }
        }

        desvincular(chaveCampo) {
          var campo = _.find(this.campos, {chave: chaveCampo});
          var coluna = _.find(this.colunas, {numero: campo.coluna});
          if (!!campo && !!coluna) {
            _.remove(coluna.campos, {chave: campo.chave});
            campo.coluna = undefined;
            campo.regrasDeValor = undefined;
            this.validarMapa();
          }
        }

        formataObjeto(valor, campo) {
          if (campo.regrasDeValor && campo.regrasDeValor.length > 0) {
            var regra = _.find(campo.regrasDeValor, {valor: valor});
            if (regra && regra.objeto) {
              return regra.objeto;
            }

            var geral = _.find(campo.regrasDeValor, {geral: true});
            if (geral && geral.objeto) {
              return geral.objeto;
            }
          }
        }

        formataData(valor) {
          var data = valor;

          if (valor instanceof Date === false) {
            data = moment(valor, [
              'DD/MM/YYYY',
              'DD-MM-YYYY',
              'DD.MM.YYYY',
              'YYYY/MM/DD',
              'YYYY-MM-DD',
              'YYYY.MM.DD',
              'DD/MM/YY',
              'DD-MM-YY',
              'DD.MM.YY'
            ]);
          }

          if (moment(data).isValid()) {
            return moment(data).utc().format('YYYY-MM-DD');
          }

          return valor === undefined ? '' : valor;
        }

        formataTexto(valor) {
          if (typeof valor !== "string") {
            valor = valor === undefined ? '' : valor.toString();
          }

          return valor.length <= 255 ? valor : valor.substring(255, 0);
        }

        formataValor(valor, campo) {
          switch(campo.tipo) {
            case Date:
              return this.formataData(valor);
            case String:
              if (!campo.tamanhoCompleto) {
                return this.formataTexto(valor);
              }
            default:
              return valor;
          }
        }

        mapearLinhas(linhas, formatar) {
          var itens = [];
          linhas.forEach((linha) => {
            var item = {};
            this.campos.forEach((campo) => {
              if (!!campo.coluna) {
                var coluna = _.find(this.colunas, {numero: campo.coluna});
                var valor = linha[coluna.nome];

                item[campo.chave] = formatar ? this.formataValor(valor, campo) : valor;
              }
            });
            itens.push(item);
          });
          return itens;
        }

        aplicarRegrasDeValor(linhas) {
          return $q((res) => {
            var linhasMapeadas = this.mapearLinhas(linhas);

            for (var c = 0; c < this.campos.length; c++) {
              var campo = this.campos[c];
              if (campo.tipo !== Object) {
                continue;
              }
  
              if (campo.objetoRegraFiltroLinhas) {
                linhasMapeadas = _.filter(linhasMapeadas, campo.objetoRegraFiltroLinhas);
              }
  
              // Força obrigatoriedade de colunas que tenham linhas mapeadas para vínculo e remove dos
              // que não tem linhas quando a coluna do arquivo não foi mapeada.
              if (campo.obrigatorio) {
                campo.obrigatorio = linhasMapeadas.length > 0;
              }
              campo.quantidadeRegrasSemVinculo = 0;
  
              if (!!campo.coluna) {
                var distinct = _.groupBy(linhasMapeadas, (l) => { return l[campo.chave]; });

                campo.regrasDeValor = Object.keys(distinct).map((key, index) => {
                  var valor = key === 'undefined' ? '' : key;
                  var regra = new RegraImportacao({
                    valor: valor,
                    quantidade: distinct[key].length,
                    objeto: campo.objetoAutoVinculo(key),
                    obrigatoria: campo.obrigatorio
                  });
                  if (!regra.autoVinculoAplicado) {
                    campo.quantidadeRegrasSemVinculo++;
                  }
                  return regra;
                });
              }
              else {
                campo.regrasDeValor = [new RegraImportacao({
                  valor: null,
                  geral: true,
                  quantidade: linhasMapeadas.length,
                  objeto: null,
                  obrigatoria: campo.obrigatorio
                })];
                campo.quantidadeRegrasSemVinculo++;
              }
            }

            this.resumirRegrasDeValor().then((resumo) => res(resumo));
          });
        }

        resumirRegrasDeValor() {
          return $q((res) => {
            var valores = 0;
            var vinculados = 0;
            var nulosValidos = 0;
            var nulosInvalidos = 0;

            for (var c = 0; c < this.campos.length; c++) {
              var campo = this.campos[c];
              if (campo.tipo !== Object) {
                continue;
              }

              if (!campo.coluna) {
                var possuiRegra = !!campo.regrasDeValor[0].objeto;
                campo.resumoRegrasDeValor = {
                  valores: 1,
                  vinculados: possuiRegra ? 1 : 0,
                  nulosValidos: !possuiRegra && !campo.obrigatorio ? 1 : 0,
                  nulosInvalidos: !possuiRegra && campo.obrigatorio ? 1 : 0
                };
              }
              else {
                campo.resumoRegrasDeValor = {
                  valores: 0,
                  vinculados: 0,
                  nulosValidos: 0,
                  nulosInvalidos: 0
                };

                for (var r = 0; r < campo.regrasDeValor.length; r++) {
                  var regra = campo.regrasDeValor[r];
                  if (!regra.objeto && regra.obrigatoria) {
                    campo.resumoRegrasDeValor.nulosInvalidos++;
                  }
                  else if (!regra.objeto) {
                    campo.resumoRegrasDeValor.nulosValidos++;
                  }
                  else {
                    campo.resumoRegrasDeValor.vinculados++;
                  }
                  campo.resumoRegrasDeValor.valores++;
                }
              }
  
              valores += campo.resumoRegrasDeValor.valores;
              vinculados += campo.resumoRegrasDeValor.vinculados;
              nulosValidos += campo.resumoRegrasDeValor.nulosValidos;
              nulosInvalidos += campo.resumoRegrasDeValor.nulosInvalidos;
            }
  
            res({
              valores: valores,
              vinculados: vinculados,
              nulosValidos: nulosValidos,
              nulosInvalidos: nulosInvalidos
            });
          });
        }

        montarLote(linhas, nomeArquivo) {
          var lote = new LoteImportacao({
            nomeArquivo: nomeArquivo,
            itens: []
          });

          this.mapearLinhas(linhas, true).forEach((obj, index) => {

            this.campos.forEach((campo) => {
              if (campo.tipo !== Object) {
                return;
              }
              if (campo.objetoRegraFiltroLinhas && _.filter([obj], campo.objetoRegraFiltroLinhas).length === 0) {
                obj[campo.chave] = undefined;
                return;
              }

              var valor = obj[campo.chave] === undefined ? '' : obj[campo.chave];
              obj[campo.chave] = this.formataObjeto(valor, campo);
            });

            lote.itens.push(new ItemImportacao(index + 2, obj));
          });

          return lote;
        }

      }

      return Importacao;
    }
  ]);
}(angular));

;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvOpcoesModel', ['$q', function($q) {
      class OpcoesImportacao {
        constructor(obj) {
          this.labelTipo = '';
          this.labelTipoSingular = '';
          this.eventoCriacao = '';
          this.campos = undefined;
          this.validarLote = undefined;
          this.gravarLote = undefined;
          this.visualizacao = false;
          this.loteProcessado = undefined;
          this.titulosMensagensCustomizadas = [];
          this.obterItensNaoImportados = () => $q.resolve([]);
          this.obterItensImportadosComAviso = () => $q.resolve([]);

          ng.extend(this, obj);

          this._parseVisualizacao();
          this._validarOpcoes();
        }

        _parseVisualizacao() {
          this.visualizacao = !!this.visualizacao;
        }

        _validarOpcoes() {
          if (!this.labelTipo) {
            throw new Error('Parametro "labelTipo" é obrigatório.');
          }
          if (!this.campos) {
            throw new Error('Parametro "campos" é obrigatório.');
          }
          if (this.visualizacao) {
            if (!this.labelTipoSingular) {
              throw new Error('Parametro "labelTipoSingular" é obrigatório quando em visualização.');
            }
            if (!this.loteProcessado) {
              throw new Error('Parametro "loteProcessado" é obrigatório quando em visualização.');
            }
          }
          else {
            if (!this.eventoCriacao) {
              throw new Error('Parametro "eventoCriacao" é obrigatório quando em importação.');
            }
            if (!this.validarLote) {
              throw new Error('Parametro "validarLote" é obrigatório quando em importação.');
            }
            if (!this.gravarLote) {
              throw new Error('Parametro "gravarLote" é obrigatório quando em importação.');
            }
          }
        }

        obterTitulosMensagensPorStep (step) {
          if (!this.titulosMensagensCustomizadas || !this.titulosMensagensCustomizadas.length) {
            return null;
          }

          let _retorno = this.titulosMensagensCustomizadas.filter((item) => {
            return item.step === step;
          });

          if (!!_retorno && !!_retorno.length) {
            return _retorno[0];
          }

          return null;
        }

      }

      return OpcoesImportacao;
    }]);
}(angular));

;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvOpcoesTituloMensagemModel', [function() {
      class OpcoesTituloMensagemModel {
        constructor(step, title, message) {
          this.step = step;
          this.title = title;
          this.message = message;
        }
      }

      return OpcoesTituloMensagemModel;
    }]);
}(angular));

; (function (ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvRegraModel', [function () {
      class RegraImportacao {
        constructor(obj) {
          this.valor = '';
          this.geral = false;
          this.quantidade = 0;
          this.objeto = null;
          this.autoVinculoAplicado = false;
          this.obrigatoria = () => false;

          ng.extend(this, obj);

          this._parseAutoVinculoAplicado();
        }

        _parseAutoVinculoAplicado() {
          this.autoVinculoAplicado = !!this.objeto;
        }
      }

      return RegraImportacao;
    }]);
}(angular));
;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvResumoItemModel', [function() {
      class ResumoItemImportacao {
        constructor(linha) {
          this.linha = linha;
          this.status = '';
          this.campos = [];
          this.mensagens = [];
        }
      }

      return ResumoItemImportacao;
    }]);
}(angular));
