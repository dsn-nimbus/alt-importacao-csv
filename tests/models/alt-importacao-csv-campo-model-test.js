'use strict';

describe('CampoImportacao', function() {
  var CampoImportacao, _;

  beforeEach(module('alt.importacao-csv'));

  beforeEach(inject(function($injector) {
    CampoImportacao = $injector.get('AltImportacaoCsvCampoModel');
    _ = $injector.get('_');
  }));

  describe('construtor(e)', function() {
    var campo;
    describe('- instância sem campo nome -', function() {
      it('deve lançar erro de parametro obrigatório', function() {
        var params = {};
        expect(() => {new CampoImportacao(params);}).toThrowError('Parametro "nome" é obrigatório.');
      });
    });
    describe('- instância sem campo chave -', function() {
      it('deve lançar erro de parametro obrigatório', function() {
        var params = {nome: 'Campo Teste'};
        expect(() => {new CampoImportacao(params);}).toThrowError('Parametro "chave" é obrigatório.');
      });
    });
    describe('- instância parametros mínimos -', function() {
      it('deve inicializar propriedades corretamente', function() {
        campo = new CampoImportacao({
          nome: 'Campo Teste', 
          chave: 'campoTeste'
        });

        expect(campo.obrigatorio).toBe(false);
        expect(campo.dado).toBe('');
        expect(campo.coluna).toBe(undefined);
        expect(campo.valor).toBe(undefined);
        expect(campo.referencia).toBe(undefined);
        expect(campo.valido).toBe(false);
        expect(campo.tipo).toBe(String);
        expect(campo.vinculoRequisitado).toBe(false);
        expect(campo.template).toEqual({
          label: 'Campo Teste',
          width: 12,
          textLimit: 53
        });
        expect(campo.objetoChave).toBe(undefined);
        expect(campo.objetoReferencia).toBe(undefined);
        expect(campo.objetoListagem).toBe(undefined);
        expect(campo.objetoOpcoesListagem).toEqual({});
        expect(campo.objetoAutoVinculo).toEqual(undefined);
      });
    });
    describe('- instância parametros mínimos (Number) -', function() {
      it('deve inicializar propriedades corretamente', function() {
        campo = new CampoImportacao({
          nome: 'Campo Teste', 
          chave: 'campoTeste',
          tipo: Number
        });

        expect(campo.obrigatorio).toBe(false);
        expect(campo.dado).toBe('');
        expect(campo.coluna).toBe(undefined);
        expect(campo.valor).toBe(undefined);
        expect(campo.referencia).toBe(undefined);
        expect(campo.valido).toBe(false);
        expect(campo.tipo).toBe(Number);
        expect(campo.vinculoRequisitado).toBe(false);
        expect(campo.template).toEqual({
          label: 'Campo Teste',
          width: 12,
          textLimit: 53
        });
        expect(campo.objetoChave).toBe(undefined);
        expect(campo.objetoReferencia).toBe(undefined);
        expect(campo.objetoListagem).toBe(undefined);
        expect(campo.objetoOpcoesListagem).toEqual({});
        expect(campo.objetoAutoVinculo).toEqual(undefined);
      });
    });
    describe('- instância object sem objetoChave -', function() {
      it('deve lançar erro de parametro obrigatório', function() {
        expect(() => {
          var t = new CampoImportacao({
            nome: 'Campo Teste', 
            chave: 'campoTeste',
            tipo: Object
          });
        })
        .toThrowError('Parametro "objetoChave" é obrigatório para campo Object.');
      });
    });
    describe('- instância object sem objetoReferencia -', function() {
      it('deve lançar erro de parametro obrigatório', function() {
        expect(() => {
          var t = new CampoImportacao({
            nome: 'Campo Teste', 
            chave: 'campoTeste',
            tipo: Object,
            objetoChave: 'id'
          });
        })
        .toThrowError('Parametro "objetoReferencia" é obrigatório para campo Object.');
      });
    });
    describe('- instância object sem objetoListagem -', function() {
      it('deve lançar erro de parametro obrigatório', function() {
        expect(() => {
          var t = new CampoImportacao({
            nome: 'Campo Teste', 
            chave: 'campoTeste',
            tipo: Object,
            objetoChave: 'id',
            objetoReferencia: 'descricao'
          });
        })
        .toThrowError('Parametro "objetoListagem" é obrigatório para campo Object.');
      });
    });
    describe('- instância parametros mínimos (object) -', function() {
      var produtos;
      beforeEach(function() {
        produtos = [{id: 1, descricao: 'Prod 1'}, {id: 2, descricao: 'Prod 2'}];
        campo = new CampoImportacao({
          nome: 'Produto', 
          chave: 'produto',
          tipo: Object,
          objetoChave: 'id',
          objetoReferencia: 'descricao',
          objetoListagem: () => {
            return produtos;
          }
        });
      })
      it('deve inicializar propriedades corretamente', function() {
        expect(campo.obrigatorio).toBe(false);
        expect(campo.dado).toBe('');
        expect(campo.coluna).toBe(undefined);
        expect(campo.valor).toBe(undefined);
        expect(campo.referencia).toBe(undefined);
        expect(campo.valido).toBe(false);
        expect(campo.tipo).toBe(Object);
        expect(campo.vinculoRequisitado).toBe(false);
        expect(campo.template).toEqual({
          label: 'Produto',
          width: 12,
          textLimit: 53
        });
        expect(campo.objetoChave).toBe('id');
        expect(campo.objetoReferencia).toBe('descricao');
        expect(campo.objetoListagem()).toEqual(produtos);
        expect(campo.objetoOpcoesListagem).toEqual({});
      });
      it('deve atribuir função de autoVinculo pela referência', function() {
        expect(campo.objetoAutoVinculo('Prod 1')).toBeDefined();
        expect(campo.objetoAutoVinculo('Prod 1').id).toBe(1);
        expect(campo.objetoAutoVinculo('Produto 1')).toBeUndefined();
        expect(campo.objetoAutoVinculo()).toBeUndefined();
      });
      it('deve atribuir função de autoVinculo pela referência desconsiderando acentos e letras maiúsculas e minúsculas', function() {
        expect(campo.objetoAutoVinculo('pRòD 2')).toBeDefined();
        expect(campo.objetoAutoVinculo('pRòD 2').id).toBe(2);
      });
    });
    describe('- instância parametros mínimos (object com autoVinculo invalido) -', function() {
      var produtos;
      beforeEach(function() {
        produtos = [{id: 1, descricao: 'Prod 1'}, {id: 2, descricao: 'Prod 2'}];
        campo = new CampoImportacao({
          nome: 'Produto', 
          chave: 'produto',
          tipo: Object,
          objetoChave: 'id',
          objetoReferencia: 'descricao',
          objetoListagem: () => {
            return produtos;
          },
          objetoAutoVinculo: 'produto padrão'
        });
      });
      it('deve atribuir função de autoVinculo default pela referência', function() {
        expect(campo.objetoAutoVinculo('Prod 1')).toBeDefined();
        expect(campo.objetoAutoVinculo('Prod 1').id).toBe(1);
        expect(campo.objetoAutoVinculo('Produto 1')).toBeUndefined();
        expect(campo.objetoAutoVinculo()).toBeUndefined();
      });
      it('deve atribuir função de autoVinculo default pela referência desconsiderando acentos e letras maiúsculas e minúsculas', function() {
        expect(campo.objetoAutoVinculo('pRòD 2')).toBeDefined();
        expect(campo.objetoAutoVinculo('pRòD 2').id).toBe(2);
      });
    });
    describe('- instância parametros mínimos (template) -', function() {
      it('deve inicializar propriedades corretamente', function() {
        campo = new CampoImportacao({
          nome: 'Campo Teste', 
          chave: 'campoTeste',
          template: {
            label: 'C. Teste',
            width: 6
          }
        });

        expect(campo.obrigatorio).toBe(false);
        expect(campo.dado).toBe('');
        expect(campo.coluna).toBe(undefined);
        expect(campo.valor).toBe(undefined);
        expect(campo.referencia).toBe(undefined);
        expect(campo.valido).toBe(false);
        expect(campo.tipo).toBe(String);
        expect(campo.vinculoRequisitado).toBe(false);
        expect(campo.template).toEqual({
          label: 'C. Teste',
          width: 6,
          textLimit: 53
        });
        expect(campo.objetoChave).toBe(undefined);
        expect(campo.objetoReferencia).toBe(undefined);
        expect(campo.objetoListagem).toBe(undefined);
        expect(campo.objetoOpcoesListagem).toEqual({});
        expect(campo.objetoAutoVinculo).toEqual(undefined);
      });
    });
  });

  describe('validar()', function() {
    var campo;

    describe('- campo Object', function() {
      var produtos;
      beforeEach(function() {
        produtos = [
          {id: 1, descricao: 'Notebook ABC DELL'}, 
          {id: 2, descricao: 'SMARTPHONE ABC SANSUNG'}
        ];
        campo = new CampoImportacao({
          nome: 'Produto', 
          chave: 'produto',
          tipo: Object,
          objetoChave: 'id',
          objetoReferencia: 'descricao',
          objetoListagem: () => {
            return produtos;
          }
        });
      });

      describe('- sem regras de valor, obrigatório -', function() {
        beforeEach(function() {
          campo.obrigatorio = true;
          campo.validar();
        });
        it('deve configurar campo como inválido', function() {
          expect(campo.valido).toBe(false);
        });
      });

      describe('- sem regras de valor (lista vazia), obrigatório -', function() {
        beforeEach(function() {
          campo.obrigatorio = true;
          campo.regrasDeValor = [];
          campo.validar();
        });
        it('deve configurar campo como inválido', function() {
          expect(campo.valido).toBe(false);
        });
      });

      describe('- com regra de valor, sem dado correspondente, sendo não-obrigatório -', function() {
        beforeEach(function() {
          campo.regrasDeValor = [{
            valor: '123456789',
            objeto: _.find(produtos, {id: 2})
          }];
          campo.dado = '15487555';
          campo.obrigatorio = false;
          campo.validar();
        });
        it('deve configurar campo como inválido', function() {
          expect(campo.valido).toBe(false);
        });
      });

      describe('- com regra de valor, sem dado correspondente, sendo obrigatório -', function() {
        beforeEach(function() {
          campo.regrasDeValor = [{
            valor: '123456789',
            objeto: _.find(produtos, {id: 2})
          }];
          campo.dado = '15487555';
          campo.obrigatorio = true;
          campo.validar();
        });
        it('deve configurar campo como inválido', function() {
          expect(campo.valido).toBe(false);
        });
        it('deve incluir mensagem de validação', function() {
          expect(campo.mensagens[0].textoHtml.toString()).toBe('O campo <u>Produto</u> é obrigatório.')
        });
      });

      describe('- com regra de valor inválida, com dado correspondente, sendo obrigatório -', function() {
        beforeEach(function() {
          campo.regrasDeValor = [{
            valor: '123456789',
            objeto: null
          }];
          campo.dado = '123456789';
          campo.obrigatorio = true;
          campo.validar();
        });
        it('deve configurar campo como inválido', function() {
          expect(campo.valido).toBe(false);
        });
        it('deve incluir mensagem de validação', function() {
          expect(campo.mensagens[0].textoHtml.toString()).toBe('O campo <u>Produto</u> é obrigatório.')
        });
      });

      describe('- com regra de valor, com dado correspondente, sendo obrigatório -', function() {
        beforeEach(function() {
          campo.regrasDeValor = [{
            valor: '123456789',
            objeto: _.find(produtos, {id: 2})
          }];
          campo.dado = '123456789';
          campo.obrigatorio = true;
          campo.validar();
        });
        it('deve configurar campo como válido', function() {
          expect(campo.valido).toBe(true);
        });
        it('deve configurar valor com objeto', function() {
          expect(campo.valor).toEqual(_.find(produtos, {id: 2}));
        });
        it('deve configurar referência do objeto', function() {
          expect(campo.referencia).toBe(_.find(produtos, {id: 2}).descricao);
        });
      });

      describe('- com regra geral -', function() {
        beforeEach(function() {
          campo.regrasDeValor = [{
            geral: true,
            objeto: _.find(produtos, {id: 1})
          }];
          campo.dado = 'qualquer coisa';
          campo.obrigatorio = true;
          campo.validar();
        });
        it('deve configurar campo como válido', function() {
          expect(campo.valido).toBe(true);
        });
        it('deve configurar valor com objeto', function() {
          expect(campo.valor).toEqual(_.find(produtos, {id: 1}));
        });
        it('deve configurar referência do objeto', function() {
          expect(campo.referencia).toBe(_.find(produtos, {id: 1}).descricao);
        });
      });

    });

    describe('- campo Date', function() {
      beforeEach(function() {
        campo = new CampoImportacao({
          nome: 'Data da Venda', 
          chave: 'dataVenda',
          tipo: Date
        });
      });

      describe('- sem dado -', function() {
        beforeEach(function() {
          campo.validar();
        });
        it('deve configurar campo como inválido', function() {
          expect(campo.valido).toBe(false);
        });
        it('deve incluir mensagem de validação', function() {
          expect(campo.mensagens[0].textoHtml.toString()).toBe('O campo <u>Data da Venda</u> não é uma data válida.')
        });
      });

      describe('- com dado vazio -', function() {
        beforeEach(function() {
          campo.dado = '';
          campo.validar();
        });
        it('deve configurar campo como inválido', function() {
          expect(campo.valido).toBe(false);
        });
        it('deve incluir mensagem de validação', function() {
          expect(campo.mensagens[0].textoHtml.toString()).toBe('O campo <u>Data da Venda</u> não é uma data válida.')
        });
      });

      describe('- com data válida (formato DD/MM/YYYY) -', function() {
        beforeEach(function() {
          campo.dado = '25/10/2018';
          campo.validar();
        });
        it('deve configurar campo como válido', function() {
          expect(campo.valido).toBe(true);
        });
        it('deve atribuir valor com data tipo Date', function() {
          expect(campo.valor).toEqual(new Date(2018,9,25));
        });
      });

      describe('- com data válida (formato DD-MM-YYYY) -', function() {
        beforeEach(function() {
          campo.dado = '25-10-2018';
          campo.validar();
        });
        it('deve configurar campo como válido', function() {
          expect(campo.valido).toBe(true);
        });
        it('deve atribuir valor com data tipo Date', function() {
          expect(campo.valor).toEqual(new Date(2018,9,25));
        });
      });

      describe('- com data válida (formato DDMMYYYY) -', function() {
        beforeEach(function() {
          campo.dado = '25102018';
          campo.validar();
        });
        it('deve configurar campo como válido', function() {
          expect(campo.valido).toBe(true);
        });
        it('deve atribuir valor com data tipo Date', function() {
          expect(campo.valor).toEqual(new Date(2018,9,25));
        });
      });

      describe('- com data válida (formato DDMMYY) -', function() {
        beforeEach(function() {
          campo.dado = '251018';
          campo.validar();
        });
        it('deve configurar campo como válido', function() {
          expect(campo.valido).toBe(true);
        });
        it('deve atribuir valor com data tipo Date', function() {
          expect(campo.valor).toEqual(new Date(2018,9,25));
        });
      });

      describe('- com data válida (formato YYYY-MM-DD) -', function() {
        beforeEach(function() {
          campo.dado = '2018-10-25';
          campo.validar();
        });
        it('deve configurar campo como inválido', function() {
          expect(campo.valido).toBe(false);
        });
        it('deve incluir mensagem de validação', function() {
          expect(campo.mensagens[0].textoHtml.toString()).toBe('O campo <u>Data da Venda</u> não é uma data válida.')
        });
      });

      describe('- com data válida (formato YYYY/MM/DD) -', function() {
        beforeEach(function() {
          campo.dado = '2018/10/25';
          campo.validar();
        });
        it('deve configurar campo como válido', function() {
          expect(campo.valido).toBe(true);
        });
        it('deve atribuir valor com data tipo Date', function() {
          expect(campo.valor).not.toEqual(new Date(2018,9,25));
          /** 
           * Ou seja, data é válida mas como o ano é setado 2025, YYYY/MM/DD não é um formato válido
          */
        });
      });

      describe('- com data válida (formato MM/DD/YYYY) e dia superior a 12 -', function() {
        beforeEach(function() {
          campo.dado = '10/13/2018';
          campo.validar();
        });
        it('deve configurar campo como inválido', function() {
          expect(campo.valido).toBe(false);
        });
        it('deve incluir mensagem de validação', function() {
          expect(campo.mensagens[0].textoHtml.toString()).toBe('O campo <u>Data da Venda</u> não é uma data válida.')
        });
      });

    });

    describe('- campo String', function() {
      beforeEach(function() {
        campo = new CampoImportacao({
          nome: 'Observação', 
          chave: 'observacao',
          tipo: String
        });
      });
      describe('- dado com mais de 255 caracteres -', function() {
        beforeEach(function() {
          campo.dado = '';
          for(var i=0; i<25; i++){
            campo.dado += 'observação';
          }
          campo.dado += 'abcdef';
          campo.validar();
        });
        it('deve configurar campo como inválido', function() {
          expect(campo.valido).toBe(false);
        });
        it('deve incluir mensagem de validação', function() {
          expect(campo.mensagens[0].textoHtml.toString()).toBe('O campo <u>Observação</u> não é um texto válido.')
        });
      });
      describe('- dado com até 255 caracteres -', function() {
        beforeEach(function() {
          campo.dado = '';
          for(var i=0; i<25; i++){
            campo.dado += 'observação';
          }
          campo.dado += 'abcde';
          campo.validar();
        });
        it('deve configurar campo como válido', function() {
          expect(campo.valido).toBe(true);
        });
        it('deve atribuir dado ao valor e referencia', function() {
          expect(campo.valor).toBe(campo.dado);
          expect(campo.referencia).toBe(campo.dado);
        });
      });
    });

    describe('- campo Number', function() {
      beforeEach(function() {
        campo = new CampoImportacao({
          nome: 'Valor Total', 
          chave: 'total',
          tipo: Number
        });
      });

      describe('- número inválido -', function() {
        var numbers = [
          ' ',
          '3,1,5',
          'a',
          'e',
          '890^9',
          '\t\t',
          '*',
          true,
          new Date(),
          new Object()
        ];
        numbers.forEach((n) => {
          describe(n.toString() + ' - ', function() {
            beforeEach(function() {
              campo.dado = n;
              campo.validar();
            });
            it('deve considerar número inválido', function() {
              expect(campo.valido).toBe(false);
            });
            it('deve incluir mensagem de validação', function() {
              expect(campo.mensagens[0].textoHtml.toString()).toBe('O campo <u>Valor Total</u> não é um número válido.')
            });
          });
        });
      });

      describe('- número válido -', function() {
        var numbers = [
          '0',
          '-1',
          '2e5',
          '-234.9999',
          '210,678',
          -234.9999
        ];
        numbers.forEach((n) => {
          describe(n.toString() + ' - ', function() {
            beforeEach(function() {
              campo.dado = n;
              campo.validar();
            });
            it('deve considerar número válido', function() {
              expect(campo.valido).toBe(true);
            });
            it('deve considerar número com parseFloat ao valor', function() {
              expect(parseFloat(campo.dado)).toBe(campo.valor);
            });
          });
        });
      });

      describe('- número válido monetário -', function() {
        it('deve passar o número para a referência no formato monetário', function() {
          campo.dado = '0';
          campo.monetario = true;
          campo.validar();
          expect(campo.referencia).toBe('R$ 0,00');
        });
        it('deve passar o número para a referência no formato monetário', function() {
          campo.dado = '-234.9999';
          campo.monetario = true;
          campo.validar();
          expect(campo.referencia).toBe('-R$ 235,00');
        });
        it('deve passar o número para a referência no formato monetário', function() {
          campo.dado = -234.9999;
          campo.monetario = true;
          campo.validar();
          expect(campo.referencia).toBe('-R$ 235,00');
        });
        it('deve passar o número para a referência no formato monetário', function() {
          campo.dado = '2e5';
          campo.monetario = true;
          campo.validar();
          expect(campo.referencia).toBe('R$ 200.000,00');
        });
      });

    });

    describe('- campo Boolean', function() {
      beforeEach(function() {
        campo = new CampoImportacao({
          nome: 'Venda com crediário', 
          chave: 'crediario',
          tipo: Boolean
        });
      });

      describe('- bool inválido -', function() {
        var bools = [
          'negativo',
          -1,
          'verdadeiro',
          'falso'
        ];
        bools.forEach((b) => {
          describe(b.toString() + '- ', function() {
            beforeEach(function() {
              campo.dado = b;
              campo.validar();
            });
            it('deve considerar campo inválido', function() {
              expect(campo.valido).toBe(false);
            });
            it('deve incluir mensagem de validação', function() {
              expect(campo.mensagens[0].textoHtml.toString()).toBe('O campo <u>Venda com crediário</u> não é um "verdadeiro ou falso" válido.')
            });
          });
        });
      });

      describe('- bool válido -', function() {
        var bools = [
          '0',
          'false',
          'NÃO',
          'n',
          'f',
          '1',
          'true',
          'sim',
          'S',
          'v'
        ];
        bools.forEach((b) => {
          describe(b.toString() + '- ', function() {
            beforeEach(function() {
              campo.dado = b;
              campo.validar();
            });
            it('deve considerar campo válido', function() {
              expect(campo.valido).toBe(true);
            });
            it('deve atribuir referencia corretamente', function() {
              var ref = campo.valor ? 'Sim' : 'Não';
              expect(campo.referencia).toBe(ref);
            });
          });
        });
      });
    });

    describe('- campo tipo inválido -', function() {
      beforeEach(function() {
        campo = new CampoImportacao({
          nome: 'Valor Total', 
          chave: 'total',
        });
        campo.tipo = Array;
        campo.dado = ['1', '2'];
        campo.validar();
      });
      it('deve atribuir campo como inválido', function() {
        expect(campo.valido).toBe(false);
      });
    });

  });

  describe('possuiRegraGeral()', function() {
    var campo, produtos, retorno;
    beforeEach(function() {
      produtos = [{id: 1, descricao: 'Prod 1'}, {id: 2, descricao: 'Prod 2'}];
        campo = new CampoImportacao({
          nome: 'Produto', 
          chave: 'produto',
          tipo: Object,
          objetoChave: 'id',
          objetoReferencia: 'descricao',
          objetoListagem: () => {
            return produtos;
          }
        });
    });
    describe('- sem regra -', function() {
      beforeEach(function() {
        retorno = campo.possuiRegraGeral();
      });
      it('deve retornar falso', function() {
        expect(retorno).toBe(false);
      });
    });
    describe('- com regra, sem objeto -', function() {
      beforeEach(function() {
        campo.regrasDeValor = [{geral: true}];
        retorno = campo.possuiRegraGeral();
      });
      it('deve retornar falso', function() {
        expect(retorno).toBe(false);
      });
    });
    describe('- com regra -', function() {
      beforeEach(function() {
        campo.regrasDeValor = [{geral: true, objeto: _.find(produtos, {id: 1})}];
        retorno = campo.possuiRegraGeral();
      });
      it('deve retornar true', function() {
        expect(retorno).toBe(true);
      });
    });
  });

  describe('possuiVinculoOuRegraGeral()', function() {
    var campo, produtos, retorno;
    beforeEach(function() {
      produtos = [{id: 1, descricao: 'Prod 1'}, {id: 2, descricao: 'Prod 2'}];
        campo = new CampoImportacao({
          nome: 'Produto', 
          chave: 'produto',
          tipo: Object,
          objetoChave: 'id',
          objetoReferencia: 'descricao',
          objetoListagem: () => {
            return produtos;
          }
        });
    });
    describe('- sem vinculo -', function() {
      beforeEach(function() {
        campo.coluna = undefined;
        retorno = campo.possuiVinculoOuRegraGeral();
      });
      it('deve retornar falso', function() {
        expect(retorno).toBe(false);
      });
    });
    describe('- com vinculo, sem regra -', function() {
      beforeEach(function() {
        campo.coluna = {nome: 'Col1'};
        retorno = campo.possuiVinculoOuRegraGeral();
      });
      it('deve retornar true', function() {
        expect(retorno).toBe(true);
      });
    });
    describe('- sem vinculo, com regra -', function() {
      beforeEach(function() {
        campo.coluna = undefined;
        campo.regrasDeValor = [{geral: true, objeto: _.find(produtos, {id: 1})}];
        retorno = campo.possuiVinculoOuRegraGeral();
      });
      it('deve retornar true', function() {
        expect(retorno).toBe(true);
      });
    });
  });

});