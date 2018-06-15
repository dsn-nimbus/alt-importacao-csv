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

      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <div class="modal-header alt-cor-principal">
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
            </button>

            <h3 class="modal-title">Nova Importação - {{importacaoCsvCtrl.labelTipo}}</h3>
          </div>
          <div class="alt-importacao-csv-wizard-menu">
            <div class="modal-body">
              <div class="row">
                <div ng-repeat="step in importacaoCsvCtrl.steps" class="col-xs-3 text-center alt-importacao-csv-step-title-wrap" ng-hide="step.menuHidden">
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
                  <uib-progressbar class="progress-striped active" value="importacaoCsvCtrl.progress" type="info">
                  </uib-progressbar>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-12 alt-espacamento-top text-center alt-importacao-csv-file-label">
                  <span ng-show="!!importacaoCsvCtrl.arquivo">{{importacaoCsvCtrl.arquivo.nome}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="alt-importacao-csv-wrapper">
            <div ng-show="importacaoCsvCtrl.steps[0].active"
              class="alt-importacao-csv-wizard-step alt-espacamento-bottom">
              <div class="modal-body">
                <form name="importacaoCsvCtrl.formStepOne">
                  <div class="row">
                    <div class="col-xs-12">
                      <div class="alt-importacao-csv-wizard-title">Selecione o arquivo</div>
                      <p class="alt-importacao-csv-wizard-obs alt-espacamento-top">
                        <i class="fa fa-info-circle text-secondary"></i>&nbsp; São aceitos documentos de extensão xls, xlsx, ods ou csv.
                      <p>
                      <div class="alt-espacamento-top">
                          <div class="anexos-input-file-escondido-container">
                            <button type="button" class="col-xs-12 col-sm-3 btn btn-default alt-espacamento-bottom alt-espacamento-top anexos-input-file-fake">
                              <i class="fa fa-file-excel-o"></i>&nbsp; Selecionar arquivo
                            </button>

                            <input type="file" class="anexos-input-file-real alt-hand col-xs-12 col-sm-3 ng-isolate-scope" 
                              ng-model="importacaoCsvCtrl.arquivo" 
                              id="alt-importacao-csv-input-file-step1"
                              accept=".xls,.xlsx,.csv,.ods"
                              alt-importacao-csv-leitor
                              ng-change="importacaoCsvCtrl.arquivoAlterado(0)"
                              required>
                          </div>
                          <span ng-show="importacaoCsvCtrl.arquivo.valido" class="text-success alt-importacao-csv-input-ckeck">
                            <i class="fa fa-check-circle"></i>&nbsp; {{importacaoCsvCtrl.arquivo.nome}}
                          </span>
                          <span ng-show="importacaoCsvCtrl.formStepOne.file.$valid && !importacaoCsvCtrl.arquivo.valido" 
                            class="text-danger alt-importacao-csv-input-ckeck">
                            <i class="fa fa-times-circle"></i>&nbsp; {{importacaoCsvCtrl.arquivo.mensagem}}
                          </span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div ng-show="importacaoCsvCtrl.steps[1].active"
              class="alt-importacao-csv-wizard-step alt-espacamento-bottom">
              <div class="modal-body">
                <div class="row">
                  <div class="col-xs-12">
                    <div class="alt-importacao-csv-wizard-title">Mapeie os campos com as colunas do arquivo</div>
                  </div>
                </div>
                <div class="row alt-importacao-csv-form-binding">
                  <form name="importacaoCsvCtrl.formBinding">
                    <div class="col-md-4">
                      <label>Campo</label>
                      <select id="alt-importacao-csv-select-field"
                        name="field" ng-model="importacaoCsvCtrl.campoSelecionado"
                        ng-options="campo as campo.nome for campo in importacaoCsvCtrl.importacao.campos | filter: importacaoCsvCtrl.campoNaoMapeado track by campo.chave"
                        ng-change="importacaoCsvCtrl.validarMapeamentoColunas()"
                        required>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label>Coluna</label>
                      <select id="alt-importacao-csv-select-column"
                        name="column" ng-model="importacaoCsvCtrl.colunaSelecionada"
                        ng-options="c as c.titulo for c in importacaoCsvCtrl.importacao.colunas"
                        required>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="alt-visibility-hidden alt-display-block">.</label>
                      <button type="button" class="btn btn-default"
                        ng-disabled="!importacaoCsvCtrl.campoSelecionado.chave || !importacaoCsvCtrl.colunaSelecionada.numero"
                        ng-click="importacaoCsvCtrl.vincular(
                          importacaoCsvCtrl.campoSelecionado.chave,
                          importacaoCsvCtrl.colunaSelecionada.numero)">
                        <i class="fa fa-exchange"></i>&nbsp; Vincular
                      </button>
                      <button type="button" class="btn btn-default pull-right text-secondary"
                        ng-click="importacaoCsvCtrl.deParaDefault()">
                        <i class="fa fa-list"></i>
                      </button>
                    </div>
                  </form>
                </div>
                <div class="row alt-espacamento-top">
                  <div class="col-xs-12">
                    <table class="table table-responsive table-condensed table-striped">
                      <thead>
                        <tr>
                          <th>Campo</th>
                          <th>Nome Coluna</th>
                          <th>Nº Coluna</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr ng-repeat="campo in importacaoCsvCtrl.importacao.campos" ng-show="campo.coluna">
                          <td>{{campo.nome}}</td>
                          <td>{{campo.coluna.nome}}</td>
                          <td>{{campo.coluna.numero}}</td>
                          <td><button type="button" class="btn btn-default pull-right" ng-click="importacaoCsvCtrl.desvincular(campo.chave)">Desvincular</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="row">
                  <div class="col-xs-12 alt-importacao-csv-map-warnings">
                    <p ng-repeat="campo in importacaoCsvCtrl.importacao.campos" ng-if="campo.vinculoRequisitado">
                      <i class="fa fa-exclamation-triangle"></i> 
                      <span>O campo <b>{{campo.nome}}</b> deve ser vinculado a uma coluna do documento.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div ng-show="importacaoCsvCtrl.steps[2].active"
              class="alt-importacao-csv-wizard-step alt-espacamento-bottom">
              <div class="modal-body">
                <div class="row">
                  <div class="col-xs-12">
                    <div class="alt-importacao-csv-wizard-title">Configure as regras de valor para os campos de cadastros</div>
                  </div>
                </div>
                <div class="row alt-espacamento-bottom">
                  <div class="col-md-12 alt-espacamento-bottom">
                    <div class="btn-group" data-toggle="buttons" id="alt-importacao-csv-btn-group-rules">
                      <label class="btn btn-default text-secondary" ng-click="importacaoCsvCtrl.resumoRegrasDeValor.exibir = 'todos';" >
                        <input type="radio" name="toggleRulesMenu" autocomplete="off">
                        {{importacaoCsvCtrl.resumoRegrasDeValor.valores}} valores
                      </label>
                      <label class="btn btn-default text-success" 
                        ng-show="importacaoCsvCtrl.resumoRegrasDeValor.vinculados > 0"
                        ng-click="importacaoCsvCtrl.resumoRegrasDeValor.exibir = 'regras';">
                        <input type="radio" name="toggleRulesMenu" id="menu1" autocomplete="off">
                        <i class="fa fa-check-circle"></i>&nbsp; {{importacaoCsvCtrl.resumoRegrasDeValor.vinculados}} regras
                      </label>
                      <label class="btn btn-default text-warning" 
                        ng-show="importacaoCsvCtrl.resumoRegrasDeValor.nulosInvalidos > 0"
                        ng-click="importacaoCsvCtrl.resumoRegrasDeValor.exibir = 'nulosInvalidos';" >
                        <input type="radio" name="toggleRulesMenu" id="menu2" autocomplete="off">
                        <i class="fa fa-exclamation-circle"></i>&nbsp; {{importacaoCsvCtrl.resumoRegrasDeValor.nulosInvalidos}} valores obrigatórios sem regra
                      </label>
                      <label class="btn btn-default" 
                        ng-show="importacaoCsvCtrl.resumoRegrasDeValor.nulosValidos > 0"
                        ng-click="importacaoCsvCtrl.resumoRegrasDeValor.exibir = 'nulosValidos';">
                        <input type="radio" name="toggleRulesMenu" id="menu3" autocomplete="off">
                        <i class="fa fa-info-circle text-secondary"></i>&nbsp; {{importacaoCsvCtrl.resumoRegrasDeValor.nulosValidos}} valores opcionais sem regra
                      </label>
                    </div>
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
                        <label class="alt-importacao-csv-rules-title" data-toggle="collapse" data-target="#alt-importacao-csv-rules-field-{{campo.chave}}">
                          <i class="fa fa-angle-down"></i>
                          {{campo.nome}} 
                          <span ng-show="!!campo.coluna">(coluna {{campo.coluna.nome.toLowerCase()}})</span>
                        </label>
                      </div>
                    </div>
                    <div class="row alt-espacamento-bottom collapse in" id="alt-importacao-csv-rules-field-{{campo.chave}}">
                      <div class="col-xs-12 alt-importacao-csv-rule-table">
                        <table class="table table-responsive table-condensed table-striped">
                          <thead>
                            <tr>
                              <th class="status"></th>
                              <th>Valor</th>
                              <th>Ocorrências</th>
                              <th>Regra</th>
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
                              <td class="alt-importacao-csv-rules-td-select-field">
                                <select id="alt-importacao-csv-rules-select-{{campo.chave}}-{{$index}}"
                                  class="alt-importacao-csv-rules-select"
                                  style="width: 100%;"
                                  ng-model="regra.objeto"
                                  ng-change="importacaoCsvCtrl.resumirRegrasDeValor()"
                                  ng-options="{{importacaoCsvCtrl.ngOptionsRegraDeCampo(campo)}}">
                                </select>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
                  <div class="col-xs-12">
                    <div class="alt-importacao-csv-wizard-title">Confira o relatório de {{importacaoCsvCtrl.labelTipo.toLowerCase()}}</div>
                  </div>
                </div>
                <div class="row alt-espacamento-bottom">
                  <div class="col-md-12 alt-espacamento-bottom">
                    <div class="btn-group" data-toggle="buttons" id="alt-importacao-csv-btn-group-review">
                      <label class="btn btn-default text-secondary" ng-click="importacaoCsvCtrl.lote.exibir = 'todos';" >
                        <input type="radio" name="toggleRulesMenu" autocomplete="off">
                        {{importacaoCsvCtrl.lote.itens.length}} linhas
                      </label>
                      <label class="btn btn-default text-success" 
                        ng-show="importacaoCsvCtrl.lote.validos > 0"
                        ng-click="importacaoCsvCtrl.lote.exibir = 'validos';">
                        <input type="radio" name="toggleLoteMenu" id="menuLote1" autocomplete="off">
                        <i class="fa fa-check-circle"></i>&nbsp; {{importacaoCsvCtrl.lote.validos}} válidas
                      </label>
                      <label class="btn btn-default text-danger" 
                        ng-show="importacaoCsvCtrl.lote.erros > 0"
                        ng-click="importacaoCsvCtrl.lote.exibir = 'erros';" >
                        <input type="radio" name="toggleLoteMenu" id="menuLote2" autocomplete="off">
                        <i class="fa fa-times-circle"></i>&nbsp; {{importacaoCsvCtrl.lote.erros}} com erro
                      </label>
                      <label class="btn btn-default" 
                        ng-show="importacaoCsvCtrl.lote.conflitos > 0"
                        ng-click="importacaoCsvCtrl.lote.exibir = 'conflitos';">
                        <input type="radio" name="toggleLoteMenu" id="menuLote3" autocomplete="off">
                        <i class="fa fa-exclamation-circle text-secondary"></i>&nbsp; {{importacaoCsvCtrl.lote.conflitos}} com aviso
                      </label>
                      <label class="btn btn-default" 
                        ng-show="importacaoCsvCtrl.lote.desconsiderados > 0"
                        ng-click="importacaoCsvCtrl.lote.exibir = 'desconsiderados';">
                        <input type="radio" name="toggleLoteMenu" id="menuLote4" autocomplete="off">
                        <i class="fa fa-info-circle text-secondary"></i>&nbsp; {{importacaoCsvCtrl.lote.desconsiderados}} desconsideradas
                      </label>
                    </div>
                  </div>
                </div>
                <div class="row alt-espacamento-top">
                  <div class="col-xs-12">
                    <div class="row"
                      ng-repeat="item in importacaoCsvCtrl.lote.itens"
                      ng-hide="
                        ((item.possuiErro || item.possuiConflito || item.desconsiderado) && importacaoCsvCtrl.lote.exibir === 'validos') || 
                        ((!item.possuiErro || item.desconsiderado) && importacaoCsvCtrl.lote.exibir === 'erros') || 
                        ((!item.possuiConflito || item.desconsiderado) && importacaoCsvCtrl.lote.exibir === 'conflitos') ||
                        (item.desconsiderado !== true && importacaoCsvCtrl.lote.exibir === 'desconsiderados')">
                      <div class="col-xs-12">
                        <div class="col-xs-12 alt-importacao-csv-report"
                          ng-class="{
                            'alt-importacao-csv-report--error': item.possuiErro,
                            'alt-importacao-csv-report--warning': item.possuiConflito,
                            'alt-importacao-csv-report--disabled': item.desconsiderado}">
                          <div class="row">
                            <div class="col-md-12 alt-importacao-csv-report-row-head">
                              <span>Linha</span> <span ng-bind="item.resumo.linha"></span>
                              <a class="pull-right" ng-hide="item.desconsiderado" ng-click="importacaoCsvCtrl.lote.desconsiderarItem($index)">Desconsiderar</a>
                              <a class="pull-right" ng-show="item.desconsiderado" ng-click="importacaoCsvCtrl.lote.considerarItem($index)">Habilitar</a>
                            </div>
                          </div>
                          <div class="row alt-importacao-csv-report-row-body">
                            <div ng-repeat="campo in item.resumo.campos" class="col-md-{{campo.template.width}}">
                              <label ng-bind="campo.template.label"></label>
                                <span ng-show="campo.valido" ng-bind="campo.referencia"></span>
                                <span ng-hide="campo.valido">
                                  {{campo.dado}} <i class="fa fa-times-circle text-danger"></i>
                                </span>
                            </div>
                          </div>
                          <div class="row" ng-show="item.resumo.mensagens.length > 0">
                            <div class="col-md-12 alt-importacao-csv-report-row-footer">
                              <div class="alt-importacao-csv-report-message" ng-repeat="msg in item.resumo.mensagens">
                                <i class="fa fa-exclamation-triangle text-warning"></i>&nbsp;
                                <span ng-bind-html="msg.textoHtml" ng-show="!!msg.textoHtml"></span>
                                <span ng-bind="msg.texto" ng-show="!msg.textoHtml"></span>
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
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" 
              ng-click="importacaoCsvCtrl.prevStep()"
              ng-hide="importacaoCsvCtrl.steps[0].active">
              <i class="fa fa-long-arrow-left"></i>&nbsp; Anterior
            </button>
            <div class="anexos-input-file-escondido-container anexos-input-file-escondido-container-inline" ng-show="importacaoCsvCtrl.permiteAlteracaoArquivo()">
              <button type="button" class="col-xs-12 btn btn-default anexos-input-file-fake">
                <span><i class="fa fa-refresh"></i>&nbsp; Recarregar arquivo</span>
              </button>
              <input type="file" class="anexos-input-file-real alt-hand col-xs-12 ng-isolate-scope" 
                  ng-model="importacaoCsvCtrl.arquivo"
                  accept=".xls,.xlsx,.csv,.ods"
                  name="file"
                  alt-importacao-csv-leitor
                  ng-change="importacaoCsvCtrl.arquivoAlterado()"
                  required>
            </div>
            <button type="button" class="btn btn-primary"
              ng-hide="importacaoCsvCtrl.steps[3].active"
              ng-disabled="importacaoCsvCtrl.invalidStep()"
              ng-click="importacaoCsvCtrl.nextStep()">
              Próximo &nbsp;<i class="fa fa-long-arrow-right"></i>
            </button>
            <button type="button" class="btn btn-primary"
              ng-show="importacaoCsvCtrl.steps[3].active"
              ng-disabled="importacaoCsvCtrl.invalidStep()"
              ng-click="importacaoCsvCtrl.salvarImportacao()">
              Gravar
            </button>
            <button type="button" class="btn btn-default"
              data-dismiss="modal">
              Cancelar
            </button>
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
          'AltImportacaoCsvModel',
          'AltImportacaoCsvEvento',
          function($rootScope, $scope, $sce, $timeout, modalService, selectService, alertaService, Campo, Importacao, evento) {
          var self = this;

          const ID_MODAL = '#alt-importacao-csv-modal';
          const ID_SELECT_CAMPOS = '#alt-importacao-csv-select-field';
          const ID_SELECT_COLUNAS = '#alt-importacao-csv-select-column';
          const ID_COMUM_SELECTS_REGRAS = '#alt-importacao-csv-rules-select';
          const ID_MENU_REGRAS_DE_VALOR = '#alt-importacao-csv-btn-group-rules';
          const ID_MENU_REVISAO = '#alt-importacao-csv-btn-group-review';
          const CLASSE_BODY_WRAPPER = '.alt-importacao-csv-wrapper';

          var _ajustarJanela = function() {
            var modalHeight = ($(window).height() - 60);
            var bodyHeight = (modalHeight - 220);
            $(ID_MODAL).find('.modal-content').css('max-height', `${modalHeight}px`);
            $(ID_MODAL).find(CLASSE_BODY_WRAPPER).css('max-height', `${bodyHeight}px`);
          };

          var _ativarEstacaoMenu = function(idMenu, posicao) {
            var btns = $(idMenu).find('input[type="radio"]');
            btns.removeAttr('checked');
            btns.parent('label').removeClass('active');
            $(btns[posicao]).attr('checked', 'checked');
            $(btns[posicao]).parent('label').addClass('active');
          };

          var _inicializarMapeamento = function() {
            self.importacao = new Importacao(self.campos);

            var linhaTitulo = self.arquivo.linhas[0];
            Object.keys(linhaTitulo).map((col, i) => {
              self.importacao.adicionarColuna(col, i);
            });
            self.importacao.validarMapa();

            selectService.inicializar(ID_SELECT_CAMPOS);
            selectService.inicializar(ID_SELECT_COLUNAS);
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

          var _inicializarRevisao = function() {
            var loteProvisorio = self.importacao.montarLote(self.arquivo.linhas, self.lote);
            self.validarLote(loteProvisorio).then((lote) => {
              self.lote = lote;
              self.lote.exibir = 'todos';
              _ativarEstacaoMenu(ID_MENU_REVISAO, 0);
            });
          };

          var _inicializar = function(opcoes) {
            self.labelTipo = opcoes.labelTipo;
            self.validarLote = opcoes.validarLote;
            self.gravarLote = opcoes.gravarLote;
            self.eventoCriacao = opcoes.eventoCriacao;
            self.campos = ng.copy(opcoes.campos);
            self.camposConfigurados = ng.copy(opcoes.campos);

            self.campoSelecionado = null;
            self.colunaSelecionada = null;
            self.arquivoAnterior = null;
            self.arquivo = null;
            self.lote = null;

            self.steps = [
              {
                name: 'Arquivo',
                number: 1,
                active: true,
                progress: 12.6
              },
              {
                name: 'Mapeamento',
                number: 2,
                progress: 37.5,
                init: _inicializarMapeamento
              },
              {
                name: 'Regras',
                number: 3,
                progress: 62.5,
                init: _inicializarRegras
              },
              {
                name: 'Revisão',
                init: _inicializarRevisao,
                number: 4,
                progress: 87.7
              }
            ];
            self.progress = self.steps[0].progress;

            _ajustarJanela();
          };

          self.nextStep = function() {
            var current = _.findIndex(self.steps, {active: true});
            var currentStep = self.steps[current];
            var nextStep = self.steps[current + 1];

            currentStep.active = false;
            currentStep.completed = true;
            nextStep.active = true;
            self.progress = nextStep.progress;
            nextStep.init();
          };

          self.prevStep = function() {
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

          self.invalidStep = function() {
            var index = _.findIndex(self.steps, {active: true});
            switch (index) {
              case 0:
                return !self.arquivo || !self.arquivo.valido;
              case 1:
                return self.importacao.mapaInvalido;
              case 2:
                return self.resumoRegrasDeValor.nulosInvalidos > 0;
              case 3:
                return self.lote && self.lote.erros !== 0;
              default:
                return false;
            }
          };

          self.vincular = function(campo, coluna) {
            self.importacao.vincular(campo, coluna);
            self.colunaSelecionada = {};
            self.campoSelecionado = {};
            selectService.inicializar(ID_SELECT_CAMPOS);
            selectService.inicializar(ID_SELECT_COLUNAS);
            self.formBinding.$setPristine();

            $timeout(() => {
              $($(ID_SELECT_CAMPOS).next('span').find('.select2-selection')).focus();
            }, 300);
          };

          self.desvincular = function(campo) {
            self.importacao.desvincular(campo);
            self.colunaSelecionada = {};
            self.campoSelecionado = {};
            selectService.inicializar(ID_SELECT_CAMPOS);
            selectService.inicializar(ID_SELECT_COLUNAS);
            self.formBinding.$setPristine();
          };

          self.deParaDefault = function() {
            self.vincular('pessoa', 9);
            self.vincular('categoria', 10);
            self.vincular('dataEmissao', 1);
            self.vincular('data', 7);
            self.vincular('valor', 8);
            self.vincular('baixa_conta', 3);
          };

          self.campoNaoMapeado = function(campo) {
            return ng.isUndefined(campo.coluna);
          };

          self.resumirRegrasDeValor = function() {
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
            var index = _.findIndex(self.steps, {active: true});
            var etapaInicial = index === 0;
            var etapaRegras = index === 2;
            var etapaRevisao = index === 3;

            if (!!self.arquivoAnterior && self.arquivoAnterior.nome !== self.arquivo.nome && !etapaInicial) {
              self.arquivo = ng.copy(self.arquivoAnterior);
              return alertaService.exibe({msg: 'O nome do documento deve coincidir com o do arquivo da importação.'});
            }
            if (etapaInicial && (self.arquivoAnterior ? self.arquivoAnterior.nome !== self.arquivo.nome : false)) {
              self.campos = ng.copy(self.camposConfigurados); // reinicializa campos p/ limpar colunas vinculadas.
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

          self.inicializarComboComOpcaoCriarNovo = function(id, chaveCampo, indexRegra) {
            $timeout(() => {
              selectService.inicializarComOpcaoCriarNovo(id, {
                escopo: $scope,
                strMetodo: `importacaoCsvCtrl.criarNovoObjetoDeRegra('${chaveCampo}', ${indexRegra})`
              }, {});
            });
          };

          self.salvarImportacao = function() {
            var lotePersistencia = ng.copy(self.lote);
            _.remove(lotePersistencia.itens, (item) => {return item.desconsiderado;});

            self.gravarLote(lotePersistencia, self.arquivo.nome).then((resp) => {
              modalService.close(ID_MODAL);
              $rootScope.$broadcast(self.eventoCriacao, resp);
            });
            return true;
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

          function workbookToJson(workbook) {
            var result = {};
            workbook.SheetNames.forEach((sheetName) => {
              var row = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
              if (row.length > 0) {
                result[sheetName] = row;
              }
            });
            return result;
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

          el.on('change', (changeEvent) => {
            carregandoService.exibe();
            var reader = new FileReader();
            reader.onload = function (e) {
              var bstr = e.target.result;
              var workbook = XLSX.read(bstr, {type:'binary'});
              var fileObject = workbookToJson(workbook);
              var linhas = fileObject[Object.keys(fileObject)[0]];
              var path = $(el[0]).val();
              var nome = path ? path.split('\\')[2] : '';
              var extensao = nome.split('.')[1];
              var valido = extensaoValida(extensao);
              var mensagem = valido ? '' : 'Tipo de arquivo inválido.';

              scope.$apply(() => {
                ngModel.$setViewValue({
                  nome: nome,
                  linhas: linhas,
                  extensao: extensao,
                  valido: valido,
                  mensagem: mensagem
                });
                ngModel.$render();
                $(el).val('');
                carregandoService.esconde();
              });
            };
            reader.readAsBinaryString(changeEvent.target.files[0]);
          });
        }
      };
    }
  ]);

}(angular));

;(function(ng) {
  "use strict";

  ng.module('alt.importacao-csv')
    .factory('AltImportacaoCsvCampoModel', [
      '$sce',
      '$filter',
      'moment',
      'latinize',
      function($sce, $filter, moment, latinize) {
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
            label: this.template.label ? this.template.label : this.nome
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
              }
              else {
                this._incluirMensagemValidacao(this.obrigatorio ? 'é obrigatório' : 'não possui regra');
              }
            }
          }
        }

        _validarData() {
          var m = moment(this.dado, 'DD/MM/YYYY');
          if (m.isValid()) {
            this.valor = m.toDate();
            this.referencia = m.format('DD/MM/YYYY');
          }
          else {
            this._incluirMensagemValidacao('não é uma data válida');
          }
        }

        _validarTexto() {
          if (typeof this.dado === "string" && this.dado.length <= 255) {
            this.valor = this.dado;
            this.referencia = this.valor;
          }
          else {
            this._incluirMensagemValidacao('não é um texto válido');
          }
        }

        _validarNumero() {
          this.dado = this.dado.toString().replace(',', '.');
          if ($.isNumeric(this.dado)) {
            this.valor = parseFloat(this.dado);
            this.referencia = this.monetario ? $filter('currency')(this.valor, 'R$ ') : this.valor;
          }
          else {
            this._incluirMensagemValidacao('não é um número válido');
          }
        }

        _validarBoleano() {
          var dado = latinize(this.dado.toString().toLowerCase());
          if (dado === '0' || dado === 'false' || dado === 'nao' || dado === 'n' || dado === 'f') {
            this.valor = false;
            this.referencia = 'Não';
          }
          else if (dado === '1' || dado === 'true' || dado === 'sim' || dado === 's' || dado === 'v') {
            this.valor = true;
            this.referencia = 'Sim';
          }
          else {
            this._incluirMensagemValidacao('não é um "verdadeiro ou falso" válido');
          }
        }

        validar() {
          this.valor = undefined;
          this.referencia = undefined;
          this.mensagens = [];

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
        constructor() {
          this.itens = [];
          this.erros = 0;
          this.conflitos = 0;
          this.validos = 0;
        }

        resumir() {
          this.validos = 0;
          this.erros = 0;
          this.conflitos = 0;
          this.desconsiderados = 0;
          this.itens.forEach((item) => {
            if (item.possuiErro) {
              if (item.desconsiderado) {
                this.desconsiderados++;
              }
              else {
                this.erros++;
              }
            }
            else if (item.possuiConflito) {
              if (item.desconsiderado) {
                this.desconsiderados++;
              }
              else {
                this.conflitos++;
              }
            }
            else {
              if (item.desconsiderado) {
                this.desconsiderados++;
              }
              else {
                this.validos++;
              }
            }
          });
        }

        aplicarStatusErro(index) {
          var item = this.itens[index];
          item.objeto.invalido = true;
          item.possuiErro = true;
          item.possuiConflito = false;
          this.resumir();
        }

        aplicarStatusAlerta(index) {
          var item = this.itens[index];
          if (!item.possuiErro) {
            item.possuiConflito = true;
          }
          this.resumir();
        }

        desconsiderarItem(index) {
          var item = this.itens[index];
          item.desconsiderado = true;
          this.resumir();
        }

        considerarItem(index) {
          var item = this.itens[index];
          item.desconsiderado = false;
          this.resumir();
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
            titulo: 'Coluna ' + (index + 1) + ' – ' + nome
          });
        }

        vincular(campo, coluna) {
          var campoObj = _.find(this.campos, {chave: campo});
          if (!!campoObj) {
            campoObj.coluna = _.find(this.colunas, {numero: coluna});
            this.validarMapa();
          }
        }

        desvincular(campo) {
          var campoObj = _.find(this.campos, {chave: campo});
          campoObj.coluna = undefined;
          campoObj.regrasDeValor = undefined;
          this.validarMapa();
        }

        aplicarRegrasDeValor(linhas) {
          this.campos.forEach((campo) => {
            if (campo.tipo !== Object || !!campo.regrasDeValor) {
              return;
            }
            if (!!campo.coluna) {
              var distinct = _.groupBy(linhas, (r) => { return r[campo.coluna.nome]; });
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

        montarLote(linhas, loteAnterior) {
          var lote = new LoteImportacao();

          linhas.forEach((r, i) => {
            var linha = i + 2;
            var item = new ItemImportacao(linha);

            this.campos.forEach((campo) => {
              if (!campo.possuiVinculoOuRegraGeral() && !campo.obrigatorio) {
                return;
              }

              campo.dado = campo.coluna ? r[campo.coluna.nome] : undefined;

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
          this.eventoCriacao = '';
          this.campos = [];
          this.validarLote = undefined;
          this.gravarLote = undefined;

          ng.extend(this, obj);
        }
      }

      return OpcoesImportacao;
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
