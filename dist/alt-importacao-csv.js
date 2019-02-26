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
    }
  })
  .constant('latinize', latinize)
  .constant('_', _)
  .constant('moment', moment)
  .constant('XLS', XLS)
  .constant('XLSX', XLSX);

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
            <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
          </button>

          <h3 class="modal-title">
            {{!importacaoCsvCtrl.visualizacao ? 'Nova' : 'Detalhes da'}}
            importação - <span>{{importacaoCsvCtrl.labelTipo}}</span></h3>
        </div>
        <div class="alt-importacao-csv-wizard-menu">
          <div class="modal-body" ng-hide="importacaoCsvCtrl.visualizacao">
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
                              ng-options="campo.chave as campo.nome for campo in importacaoCsvCtrl.importacao.campos | filter: importacaoCsvCtrl.campoNaoMapeado track by campo.chave">
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
                            {{ importacaoCsvCtrl.formatarLinhaValor(linha[coluna]) }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-xs-12 alt-espacamento-bottom">
                  <label class="alt-hand alt-espacamento-top" ng-show="importacaoCsvCtrl.arquivo.linhas.length > 1">
                    <input type="checkbox"
                        ng-model="importacaoCsvCtrl.arquivoOpcoes.colunasPossuemTitulos"/>
                    <span class="alt-checkbox"></span> <span class="alt-checkbox-label">Primeira linha do arquivo são títulos das colunas</span>
                  </label>
                </div> 
              </div>

              <div class="row">
                <div class="col-xs-12 alt-importacao-csv-map-warnings">
                  <div class="alert alert-danger alert-dismissible alt-espacamento-bottom" role="alert" ng-show="importacaoCsvCtrl.exibirMensagemErro">
                    <button type="button" ng-click="importacaoCsvCtrl.removerMensagemErro()" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <p ng-repeat="campo in importacaoCsvCtrl.importacao.campos" ng-if="campo.vinculoRequisitado && importacaoCsvCtrl.exibirMensagemErro">
                      <i class="fa fa-exclamation-triangle"></i> 
                      <span>O campo <b>{{campo.nome}}</b> do ERP4ME deve ser vinculado a uma coluna do arquivo</span>
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
                  ng-if="campo.tipo.name === 'Object'"
                  ng-hide="
                    (importacaoCsvCtrl.resumoRegrasDeValor.exibir === 'regras' && campo.resumoRegrasDeValor.vinculados === 0) ||
                    (importacaoCsvCtrl.resumoRegrasDeValor.exibir === 'nulosInvalidos' && campo.resumoRegrasDeValor.nulosInvalidos === 0) ||
                    (importacaoCsvCtrl.resumoRegrasDeValor.exibir === 'nulosValidos' && campo.resumoRegrasDeValor.nulosValidos === 0)">
                  <div class="row alt-espacamento-top">
                    <div class="col-xs-12">
                      <label ng-show="importacaoCsvCtrl.obterQtdCamposRegras(importacaoCsvCtrl.importacao.campos) > 1" class="alt-importacao-csv-rules-title" data-toggle="collapse" data-target="#alt-importacao-csv-rules-field-{{campo.chave}}">
                        <i class="fa fa-angle-down"></i>
                        {{campo.nome}} 
                        <span ng-show="!!campo.coluna && importacaoCsvCtrl.arquivoOpcoes.colunasPossuemTitulos">(coluna {{importacaoCsvCtrl.nomeColuna(campo.coluna)}})</span>
                      </label>
                      <label ng-hide="importacaoCsvCtrl.obterQtdCamposRegras(importacaoCsvCtrl.importacao.campos) > 1"  class="alt-importacao-csv-rules-title no-alt-hand">
                        {{campo.nome}} 
                        <span ng-show="!!campo.coluna && importacaoCsvCtrl.arquivoOpcoes.colunasPossuemTitulos">(coluna {{importacaoCsvCtrl.nomeColuna(campo.coluna)}})</span>
                      </label>
                    </div>
                  </div>
                  <div class="alt-importacao-csv-rule-table-overflow">
                    <div class="row alt-espacamento-bottom collapse in" id="alt-importacao-csv-rules-field-{{campo.chave}}">
                      <div class="col-xs-12 alt-importacao-csv-rule-table alt-espacamento-bottom">
                        <table class="table table-responsive table-condensed table-striped">
                          <thead>
                            <tr>
                              <th class="status"></th>
                              <th>Informação arquivo</th>
                              <th>Ocorrências</th>
                              <th>Informação ERP4ME</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr ng-repeat="regra in campo.regrasDeValor"
                              ng-class="{
                                'rule-success': regra.objeto,
                                'rule-warning': !regra.objeto && !campo.obrigatorio,
                                'rule-error': !regra.objeto && campo.obrigatorio}"
                              ng-hide="
                                (!regra.objeto && importacaoCsvCtrl.resumoRegrasDeValor.exibir === 'regras') ||
                                ((!regra.objeto && campo.obrigatorio || regra.objeto) && importacaoCsvCtrl.resumoRegrasDeValor.exibir === 'nulosValidos') ||
                                ((!regra.objeto && !campo.obrigatorio || regra.objeto) && importacaoCsvCtrl.resumoRegrasDeValor.exibir === 'nulosInvalidos')">
                              <td class="status">
                                <i class="fa fa-exclamation-triangle text-warning" ng-show="!regra.objeto && campo.obrigatorio"></i>
                                <i class="fa fa-check text-success" ng-show="regra.objeto"></i>
                              </td>
                              <td ng-hide="regra.geral">{{regra.valor}}</td>
                              <td ng-show="regra.geral"><i class="text-secondary">Todas as ocorrências</i></td>
                              <td class="alt-importacao-csv-rules-td-count-field">{{regra.quantidade}}</td>
                              <td class="alt-importacao-csv-rules-td-select-field"
                                style="min-width: 180px;">
                                <select id="alt-importacao-csv-rules-select-{{campo.chave}}-{{$index}}"
                                  class="alt-importacao-csv-rules-select"
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

                    <div class="alert alert-danger alert-dismissible alt-espacamento-bottom" role="alert" ng-show="importacaoCsvCtrl.resumoRegrasDeValor.nulosInvalidos > 0 && importacaoCsvCtrl.exibirMensagemErro">
                      <button type="button" ng-click="importacaoCsvCtrl.removerMensagemErro()" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      <span ng-show="importacaoCsvCtrl.exibirMensagemErro" class="alt-importacao-csv-input-ckeck">
                        <i class="fa fa-exclamation-triangle"></i> Vincule todas as informações para prosseguir com a importação
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ng-show="importacaoCsvCtrl.steps[3].active"
            class="alt-importacao-csv-wizard-step alt-espacamento-bottom">
            <div class="modal-body">
              
              <div class="row">
                <div class="col-md-8">
                  <span class="small text-muted">Arquivo: </span> {{ importacaoCsvCtrl.lote.nomeArquivo }}
                </div>
                <div class="col-md-4">
                  <span class="small text-muted">Status: </span> {{ (importacaoCsvCtrl.lote.status > 0 ? 'processado' : 'processando') }}
                </div>
              </div>
              
              <hr style="margin-top: 15px; margin-bottom: 10px;">
              
              <div class="row">
                <div class="col-sm-12 alt-espacamento-bottom">
                  <div class="alt-importacao-registros-total"><span class="small text-muted">Total de registros: </span> {{ importacaoCsvCtrl.lote.itens.length }}</div>
                  <div class="alt-importacao-registros-sucesso"><span class="small text-muted">Registros importados: </span> <span class="text-success">{{ importacaoCsvCtrl.lote.validos }}</span></div>
                  <div class="alt-importacao-registros-erro"><span class="small text-muted">Registros não importados: </span> <span class="text-danger">{{ importacaoCsvCtrl.lote.erros }}</span></div>
                  <div class="alt-importacao-registros-conflito"><span class="small text-muted">Registros importados com observação: </span> <span class="text-warning">{{ importacaoCsvCtrl.lote.conflitos }}</span></div>
                </div>
              </div>

              <ul class="nav nav-tabs row alt-importacao-nav-tabs" role="tablist">
                <li role="presentation" ng-show="!!importacaoCsvCtrl.itensNaoImportados.length" ng-class="{'active': !!importacaoCsvCtrl.itensNaoImportados.length}" koopon-comum-toggle-aba toggle="#koopon-importacao-nao-importados" contexto="#alt-importacao-csv-modal">
                  <a href="">Registros não importados</a>
                </li>
                <li role="presentation" ng-show="!!importacaoCsvCtrl.itensImportadosComObservacao.length" ng-class="{'active': !importacaoCsvCtrl.itensNaoImportados.length}" koopon-comum-toggle-aba toggle="#koopon-importacao-importados-observacao" contexto="#alt-importacao-csv-modal">
                  <a href="">Importados com observação</a>
                </li>
              </ul>

              <div class="tab-content">
                <div role="tabpanel" class="tab-pane" ng-class="{'active': !!importacaoCsvCtrl.itensNaoImportados.length}" id="koopon-importacao-nao-importados">

                  <div class="">
                    <div class="" ng-repeat="item in importacaoCsvCtrl.itensNaoImportados">

                      <div class="alt-importacao-csv-report">
                        <div class="alt-importacao-csv-report-row-body row-body-{{ $index % 2 === 0 ? 'par' : 'impar' }}">
                          <div class="row hidden-xs hidden-sm" ng-if="$first">
                            <div ng-repeat="campo in importacaoCsvCtrl.camposOrdenados" class="col-md-{{ campo.template.width }} alt-importacao-csv-report-title">{{ campo.nome }}</div>
                            <div class="col-md-1 alt-importacao-csv-report-title text-center">Status</div>
                            <div class="col-md-1 alt-importacao-csv-report-title">&nbsp;</div>
                          </div>

                          <div class="row">
                            <div ng-repeat="campo in importacaoCsvCtrl.camposOrdenados" class="col-md-{{ campo.template.width }} alt-importacao-csv-report-row" title="{{ importacaoCsvCtrl.obterValorCampoProp(item.objeto, campo.template) }}">
                              <span class="small text-muted visible-xs-inline-block visible-sm-inline-block">{{ campo.nome }}:</span> <span ng-bind="importacaoCsvCtrl.obterValorCampoProp(item.objeto, campo.template) | LimitadorTexto:campo.template.textLimit"></span>
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
                              <div class="col-md-12 alt-importacao-csv-report-row-head">
                                <div class="alt-importacao-csv-report-row-head-title text-muted">Registro {{item.linha}}</div>
                                <div class="alert alert-sm alert-danger" ng-bind-html="importacaoCsvCtrl.obterMensagemErro(item.mensagemErro)"></div>
                              </div>
                            </div>

                            <hr>
                
                            <div class="row">
                              <div class="col-sm-6" ng-repeat="campo in importacaoCsvCtrl.campos" >
                                <span class="small text-muted"><strong>{{ campo.nome }}:</strong></span> <span>{{ importacaoCsvCtrl.obterValorCampoProp(item.objeto, campo.template) }}</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                
                <div role="tabpanel" class="tab-pane" ng-class="{'active': !importacaoCsvCtrl.itensNaoImportados.length}" id="koopon-importacao-importados-observacao">

                  <div>
                    <div class="" ng-repeat="item in importacaoCsvCtrl.itensImportadosComObservacao">

                      <div class="alt-importacao-csv-report">
                        <div class="alt-importacao-csv-report-row-body row-body-{{ $index % 2 === 0 ? 'par' : 'impar' }}">
                          <div class="row hidden-xs hidden-sm" ng-if="$first">
                            <div ng-repeat="campo in importacaoCsvCtrl.camposOrdenados" class="col-md-{{ campo.template.width }} alt-importacao-csv-report-title">{{ campo.nome }}</div>
                            <div class="col-md-1 alt-importacao-csv-report-title text-center">Status</div>
                            <div class="col-md-1 alt-importacao-csv-report-title">&nbsp;</div>
                          </div>

                          <div class="row">
                            <div ng-repeat="campo in importacaoCsvCtrl.camposOrdenados" class="col-md-{{ campo.template.width }} alt-importacao-csv-report-row" title="{{ importacaoCsvCtrl.obterValorCampoProp(item.objeto, campo.template) }}">
                              <span class="small text-muted visible-xs-inline-block visible-sm-inline-block">{{ campo.nome }}:</span>  <span ng-bind="importacaoCsvCtrl.obterValorCampoProp(item.objeto, campo.template) | LimitadorTexto:campo.template.textLimit"></span>
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
                              <div class="col-md-12 alt-importacao-csv-report-row-head">
                                <div class="alt-importacao-csv-report-row-head-title text-muted">Registro {{item.linha}}</div>
                                <div class="alert alert-sm alert-warning" ng-bind-html="importacaoCsvCtrl.obterMensagemErro(item.mensagemErro)"></div>
                              </div>
                            </div>

                            <hr>
                
                            <div class="row">
                              <div class="col-sm-6" ng-repeat="campo in importacaoCsvCtrl.campos" >
                                <span class="small text-muted"><strong>{{ campo.nome }}:</strong></span> <span>{{ importacaoCsvCtrl.obterValorCampoProp(item.objeto, campo.template) }}</span>
                              </div>
                            </div>
                          </div>

                        </div>
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
            Próximo &nbsp;<i class="fa fa-long-arrow-right"></i>
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
    }])
    .directive('altImportacaoCsvEspecifica', [function () {
      var _scope = {};
      var _restrict = 'A';
      var _replace = true;

      var _controller = [
        '$rootScope',
        '$scope',
        '$sce',
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
        function($rootScope, $scope, $sce, $timeout, modalService, selectService, alertaService, Campo, Lote, Importacao, evento, OpcoesImportacaoTituloMensagemModel, AltCarregandoInfoService, moment) {
        var self = this;

        const ID_MODAL = '#alt-importacao-csv-modal';
        const ID_COMUM_SELECTS_REGRAS = '#alt-importacao-csv-rules-select';
        const ID_MENU_REGRAS_DE_VALOR = '#alt-importacao-csv-btn-group-rules';
        const CLASS_SELECT_CAMPOS = '.alt-importacao-csv-select-field';

        var _ativarEstacaoMenu = function(idMenu, posicao) {
          var btns = $(idMenu).find('input[type="radio"]');
          btns.removeAttr('checked');
          btns.parent('label').removeClass('active');
          $(btns[posicao]).attr('checked', 'checked');
          $(btns[posicao]).parent('label').addClass('active');
        };

        var _inicializarMapeamento = function() {


          if (!!self.importacao) {
            // roda quando o valor de arquivoOpcoes.colunasPossuemTitulos é alternado
            // atualizando apenas o nome do titulo da coluna e mantendo todo o restante dos dados
            self.arquivo.colunas.map((col, i) => {
              self.importacao.colunas[i].nome = col;
            });

            self.arquivoAnterior = ng.copy(self.arquivo);
          } else {
            self.importacao = new Importacao(self.campos);

            self.arquivo.colunas.map((col, i) => {
              self.importacao.adicionarColuna(col, i);
            });
          }

          self.importacao.validarMapa();

          selectService.inicializar(CLASS_SELECT_CAMPOS);
        };

        var _inicializarRegras = function() {
          self.resumoRegrasDeValor = self.importacao.aplicarRegrasDeValor(self.arquivo.linhas);

          self.importacao.campos.forEach((campo) => {
            if (campo.tipo === Object) {
              campo.regrasDeValor.forEach((regra, index) => {
                var id = ID_COMUM_SELECTS_REGRAS + '-' + campo.chave + '-' + index;
                if (!!campo.objetoCriarNovo) {
                  self.inicializarComboComOpcaoCriarNovo(id, campo.chave, index);
                }
                else {
                  selectService.inicializar(id);
                }
              });
            }
          });

          self.resumoRegrasDeValor.exibir = 'todos';
          _ativarEstacaoMenu(ID_MENU_REGRAS_DE_VALOR, 0);
        };

        /* var _inicializarRevisao = function() {
          var loteProvisorio = self.importacao.montarLote(self.arquivo.linhas, self.arquivo.nome, self.lote);
          self.validarLote(loteProvisorio).then((lote) => {
            self.lote = lote;
            self.lote.exibir = 'todos';
            _ativarEstacaoMenu(ID_MENU_REVISAO, 0);
          });
        }; */

        var _visualizarProcessado = function(lote) {
          self.visualizacao = true;
          self.steps[0].active = false;
          self.steps[3].active = true;

          lote.itens.forEach((item) => {
            if (item.status === 2) {
              self.itensNaoImportados.push(item);
            }

            if (item.status === 3) {
              self.itensImportadosComObservacao.push(item);
            }
          });

          self.lote = new Lote(lote);
          self.lote.resumir();
        };

        var _inicializar = function(opcoes) {
          self.labelTipo = opcoes.labelTipo;
          self.labelTipoSingular = opcoes.labelTipoSingular;
          self.validarLote = opcoes.validarLote;
          self.gravarLote = opcoes.gravarLote;
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
              title:  _step3 ? _step3.title : 'Configurar vinculos',
              message: _step3 ? $sce.trustAsHtml(_step3.message) : $sce.trustAsHtml('Vincule a informação do arquivo ao <em>Campo</em> correspondente no cadastro do ERP4ME'),
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
            _visualizarProcessado(opcoes.loteProcessado);
          }

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
              invalid = self.importacao.mapaInvalido;
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
          self.removerMensagemErro();

          self.importacao.vincular(campo, coluna);
          selectService.inicializar(CLASS_SELECT_CAMPOS);
        };

        self.desvincular = function(campo) {
          self.removerMensagemErro();

          self.importacao.desvincular(campo);
          selectService.inicializar(CLASS_SELECT_CAMPOS);
        };

        self.campoNaoMapeado = function(campo) {
          return ng.isUndefined(campo.coluna);
        };

        self.resumirRegrasDeValor = function() {
          self.removerMensagemErro();

          ng.extend(self.resumoRegrasDeValor, self.importacao.resumirRegrasDeValor());
          if (self.resumoRegrasDeValor.exibir === 'nulosValidos' && self.resumoRegrasDeValor.nulosValidos === 0) {
            self.resumoRegrasDeValor.exibir = 'todos';
            _ativarEstacaoMenu(ID_MENU_REGRAS_DE_VALOR, 0);
          }
          if (self.resumoRegrasDeValor.exibir === 'nulosInvalidos' && self.resumoRegrasDeValor.nulosInvalidos === 0) {
            self.resumoRegrasDeValor.exibir = 'todos';
            _ativarEstacaoMenu(ID_MENU_REGRAS_DE_VALOR, 0);
          }
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

        self.criarNovoObjetoDeRegra = function(chaveCampo, indexRegra) {
          modalService.close(ID_MODAL);
          $timeout(() => {
            var campo = _.find(self.importacao.campos, {chave: chaveCampo});
            if (!!campo.objetoCriarNovo && !!campo.objetoCriarNovo.funcao) {
              campo.objetoCriarNovo.funcao();
              campo.atribuirNovoARegra = indexRegra;

              $scope.$on(campo.objetoCriarNovo.eventoAtualizacao, (ev, objNovo) => {
                if (campo.atribuirNovoARegra !== undefined) {
                  modalService.open(ID_MODAL);

                  $timeout(() => {
                    campo.regrasDeValor[campo.atribuirNovoARegra].objeto = objNovo;
                    var id = ID_COMUM_SELECTS_REGRAS + '-' + campo.chave + '-' + campo.atribuirNovoARegra;
                    self.inicializarComboComOpcaoCriarNovo(id, campo.chave, campo.atribuirNovoARegra);
                    campo.atribuirNovoARegra = undefined;
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

        self.inicializarComboComOpcaoCriarNovo = function(id, chaveCampo, indexRegra) {
          $timeout(() => {
            selectService.inicializarComOpcaoCriarNovo(id, {
              escopo: $scope,
              strMetodo: `importacaoCsvCtrl.criarNovoObjetoDeRegra('${chaveCampo}', ${indexRegra})`
            }, {});
          });
        };

        self.salvarImportacao = function() {
          // Chamado neste ponto pois Passo 4 foi retirado do fluxo
          // Trouxe o codigo do metodo _inicializarRevisao, pois preciso executar o restande no retorno da Promise
          AltCarregandoInfoService.exibe();

          $timeout(() => {
            var loteProvisorio = self.importacao.montarLote(self.arquivo.linhas, self.arquivo.nome, self.lote);

            self.validarLote(loteProvisorio).then((lote) => {
              self.lote = lote;
              self.lote.exibir = 'todos';

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
          let _filtro = campos.filter((campo) => {
            return (campo.exibirNaVisualizacaoListaPosicao > 0);
          });

          return _.sortBy(_filtro, 'exibirNaVisualizacaoListaPosicao');
        };

        self.obterValorCampoProp = function (obj, template) {
          if (typeof obj === 'undefined' || !template || !template.property) {
            return false;
          }
          if (typeof template.property === 'function') {
            return template.property(obj);
          }

          let _index = template.property.indexOf('.');

          if (_index > -1) {
            return self.obterValorCampoProp(obj[template.property.substring(0, _index)], {property: template.property.substr(_index + 1)});
          }

          return obj[template.property];
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

        self.limparImportacao = function () {
          self.arquivo = null;
          self.arquivoOpcoes.colunasPossuemTitulos = undefined;

          ng.element('.anexos-input-file-real').val('');
          ng.element('.anexos-input-file-real')[0] = null;

          modalService.close(ID_MODAL);
        };

        $scope.$on(evento.modal.ABRE_MODAL_IMPORTACAO_ESPECIFICA, (ev, opcoes) => {
          _inicializar(opcoes);
          modalService.open(ID_MODAL);
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
              raw: true
            };

            if (!!scope.opts && !scope.opts.colunasPossuemTitulos && !!colunas && colunas.length) {
              sheetToJsonOptions.header = colunas;
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

            if (!newValue) {
              scope.file = null;
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

          return input.trim();
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
          this.objetoOpcoesListagem = {};
          this.mensagens = [];
          this.exibirNaVisualizacaoListaPosicao = 0; // 0 = não exibir

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
            property: this.template.property ? this.template.property : this.chave
          };
        }

        _incluirMensagemValidacao(texto) {
          this.mensagens.push({
            textoHtml: $sce.trustAsHtml('O campo <u>' + this.template.label + '</u> ' + texto + '.')
          });
        }

        _validarObjeto() {
          if (this.regrasDeValor && this.regrasDeValor.length > 0) {
            var regra = _.find(this.regrasDeValor, {valor: this.dado});
            if (regra && regra.objeto) {
              this.valor = regra.objeto;
              this.referencia = regra.objeto[this.objetoReferencia];
            }
            else {
              var geral = _.find(this.regrasDeValor, {geral: true});
              if (geral && geral.objeto) {
                this.valor = geral.objeto;
                this.referencia = geral.objeto[this.objetoReferencia];
              } else {
                var msg = this.obrigatorio ? 'é obrigatório' : 'não possui regra';
                this._incluirMensagemValidacao(msg);
                $log.error(msg);
              }
            }
          }
        }

        _validarData() {
          var m = moment(this.dado, 'DD/MM/YYYY');
          if (m.isValid()) {
            this.valor = m.toDate();
            this.referencia = m.format('DD/MM/YYYY');
          } else {
            var msg = 'não é uma data válida';
            this._incluirMensagemValidacao(msg);
            $log.error(msg);
          }
        }

        _validarTexto() {
          if (this.tipo === String && typeof this.dado !== "string") {
            this.dado = this.dado.toString();
          }

          if (typeof this.dado === "string" && this.dado.length <= 255) {
            this.valor = this.dado;
            this.referencia = this.valor;
          } else {
            var msg = 'não é um texto válido';
            this._incluirMensagemValidacao(msg);
            $log.error(msg);
          }
        }

        _validarNumero() {
          this.dado = this.dado.toString().replace(',', '.');
          if ($.isNumeric(this.dado)) {
            this.valor = parseFloat(this.dado);
            this.referencia = this.monetario ? $filter('currency')(this.valor, 'R$ ') : this.valor;
          } else {
            var msg = 'não é um número válido';
            this._incluirMensagemValidacao(msg);
            $log.error(msg);
          }
        }

        _validarBoleano() {
          var dado = latinize(this.dado.toString().toLowerCase());
          if (dado === '0' || dado === 'false' || dado === 'nao' || dado === 'n' || dado === 'f') {
            this.valor = false;
            this.referencia = 'Não';
          } else if (dado === '1' || dado === 'true' || dado === 'sim' || dado === 's' || dado === 'v') {
            this.valor = true;
            this.referencia = 'Sim';
          } else {
            var msg = 'não é um "verdadeiro ou falso" válido';
            this._incluirMensagemValidacao(msg);
            $log.error(msg);
          }
        }

        validar() {
          this.valor = undefined;
          this.referencia = undefined;
          this.mensagens = [];
          if (!this.dado) {
            this.dado = '';
          }

          switch (this.tipo) {
            case Object: this._validarObjeto(); break;
            case Date: this._validarData(); break;
            case String: this._validarTexto(); break;
            case Number: this._validarNumero(); break;
            case Boolean: this._validarBoleano();
          }

          this.valido = this.valor !== undefined;
        }

        possuiRegraGeral() {
          var regra = _.find(this.regrasDeValor, {geral: true});
          return !!regra && !!regra.objeto;
        }

        possuiVinculoOuRegraGeral() {
          return !!this.coluna || this.possuiRegraGeral();
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
        constructor(linha) {
          this.objeto = {};
          this.resumo = new ResumoItemImportacao(linha);
          this.desconsiderado = false;
          this.possuiErro = false;
          this.possuiConflito = false;
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

          ng.extend(this, lote);
        }

        resumir() {
          this.processando = 0;
          this.validos = 0;
          this.erros = 0;
          this.conflitos = 0;

          this.itens.forEach((item) => {
            if (item.status === 3) {
              this.conflitos++;
            } else if (item.status === 2) {
              this.erros++;
            } else if (item.status === 1) {
              this.validos++;
            }
            else {
              this.processando++;
            }
          });
        }
      }

      return LoteImportacao;
    }]);
}(angular));

;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
  .factory('AltImportacaoCsvModel', [
    '$sce',
    '$q',
    'AltImportacaoCsvItemModel',
    'AltImportacaoCsvLoteModel',
    '_',
    function($sce, $q, ItemImportacao, LoteImportacao, _) {
      class Importacao {
        constructor(campos) {
          this.campos = campos;

          this.colunas = [];
          this.mapaInvalido = false;
        }

        validarMapa() {
          this.mapaInvalido = false;
          this.campos.forEach((campo) => {
            if (campo.tipo === Object) {
              return;
            }
            if (campo.obrigatorio && !campo.coluna) {
              campo.vinculoRequisitado = true;
              this.mapaInvalido = true;
            }
            else {
              campo.vinculoRequisitado = false;
            }
          });
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

        aplicarRegrasDeValor(linhas) {
          this.campos.forEach((campo) => {
            // if (campo.tipo !== Object || !!campo.regrasDeValor) {
            if (campo.tipo !== Object) {
              return;
            }
            if (!!campo.coluna) {
              var coluna = _.find(this.colunas, {numero: campo.coluna});
              var distinct = _.groupBy(linhas, (r) => { return r[coluna.nome]; });
              campo.regrasDeValor = Object.keys(distinct).map((key) => {
                return {
                  valor: key,
                  quantidade: distinct[key].length,
                  objeto: campo.objetoAutoVinculo(key)
                };
              });
            }
            else {
              campo.regrasDeValor = [{
                valor: null,
                geral: true,
                quantidade: linhas.length,
                objeto: null
              }];
            };
          });

          return this.resumirRegrasDeValor();
        }

        resumirRegrasDeValor() {
          var valores = 0;
          var vinculados = 0;
          var nulosValidos = 0;
          var nulosInvalidos = 0;
          this.campos.forEach((campo) => {
            if (campo.tipo !== Object) {
              return;
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
              campo.regrasDeValor.forEach((regra) => {
                if (!regra.objeto && campo.obrigatorio) {
                  campo.resumoRegrasDeValor.nulosInvalidos++;
                }
                else if (!regra.objeto) {
                  campo.resumoRegrasDeValor.nulosValidos++;
                }
                else {
                  campo.resumoRegrasDeValor.vinculados++;
                }
                campo.resumoRegrasDeValor.valores++;
              });
            }

            valores += campo.resumoRegrasDeValor.valores;
            vinculados += campo.resumoRegrasDeValor.vinculados;
            nulosValidos += campo.resumoRegrasDeValor.nulosValidos;
            nulosInvalidos += campo.resumoRegrasDeValor.nulosInvalidos;
          });

          return {
            valores: valores,
            vinculados: vinculados,
            nulosValidos: nulosValidos,
            nulosInvalidos: nulosInvalidos
          };
        }

        montarLote(linhas, nomeArquivo, loteAnterior) {
          var lote = {
            nomeArquivo: nomeArquivo
          };

          lote = new LoteImportacao(lote);

          linhas.forEach((r, i) => {
            var linha = i + 2;
            var item = new ItemImportacao(linha);

            this.campos.forEach((campo) => {
              if (!campo.possuiVinculoOuRegraGeral() && !campo.obrigatorio) {
                return;
              }

              campo.dado = undefined;
              if (!!campo.coluna) {
                var coluna = _.find(this.colunas, {numero: campo.coluna});
                campo.dado = r[coluna.nome];
              }

              campo.validar();

              if (!campo.valido) {
                if (campo.obrigatorio) {
                  item.objeto.invalido = true;
                  item.possuiErro = true;
                  item.possuiConflito = false;
                }
                else if (!item.possuiErro) {
                  /*
                    Campos "inválidos não-obrigatórios" configuram um item conflituoso se, e somente se, não haja
                    erro em outro campo do item previamente verificado. Uma vez que se ao menos um campo do
                    item estiver com erro o item inteiro estará com erro, mesmo que possua campos "inválidos não-obrigatórios".
                  */
                  item.possuiConflito = true;
                }
              }

              campo.mensagens.forEach((msg) => {
                item.resumo.mensagens.push(msg);
              });

              item.objeto[campo.chave] = campo.valor;
              item.resumo.campos.push({
                valido: campo.valido,
                chave: campo.chave,
                dado: campo.dado,
                referencia: campo.referencia,
                template: ng.copy(campo.template)
              });
            });

            if (!!loteAnterior && loteAnterior.itens[i].desconsiderado === true) {
              item.desconsiderado = true;
            }

            lote.itens.push(item);
          });

          lote.resumir();

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
    .factory('AltImportacaoCsvOpcoesModel', [function() {
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
