/*
 * Criamos o nosso modulo
 * Observe que estamos carregando os seguintes modulos externos:
 * ngRoute: controle de rotas
 * ngMask: criação de máscaras de entrada de dados 
 **/
var app = angular.module('contratoApp', ['ngRoute', 'ngMask'])
    //Define o roteamento de acordo com a URL informada pelo usuario
    //Dependendo da URL irá verificar se o usuario está logado
    .config(['$routeProvider', function ($routeProvider) {
        ''
        //Definindo qual view será aberta em cada rota da aplicação
        $routeProvider
            .when('/menu', {
                templateUrl: 'views/menu.html'
            })
            .when('/cadastro', {
                templateUrl: 'views/cadastro.html'
            })
            .when('/contratos', {
                templateUrl: 'views/contratos.html'
            })
            .when('/sobre', {
                templateUrl: 'views/sobre.html'
            })
            .otherwise({
                redirectTo: '/menu'
            });
    }])

app.controller('contratoController',
    function ($scope, $http, $window, $rootScope) {
        /*
         * 
         * RESTFUL SERVICES
         * 
         **********************************************************/
        var urlBase = 'http://localhost:3000';
        /*********************************************************
         *              
         */
        $scope.mensagem = { cor: 'success', titulo: '' }

        /*========================================================
         * CONTRATOS
         ========================================================*/
        
        // Carrega todos os contratos 
        $scope.carregaContratos = function () {
            getContratos();
        };
        function getContratos() {
            $scope.dados = { contratos: null, contrato: null }
            $http({
                method: 'get',
                url: urlBase + '/contratos'
            }).then(function (response) {
                $scope.dados = { contratos: response.data }
            }, function (error) {
                $scope.mensagem = { cor: 'danger', titulo: 'Não foi possível obter os contratos. Verifique o backend!' + error.data.message }
            })
        }
        // Carrega os dados do contrato pelo Id para a edição
        $scope.obtemContratoPeloId = function (idContrato) {
            $http({
                method: 'get',
                url: urlBase + '/contratos/' + idContrato
            }).then(function (response) {
                $scope.dados = { contrato: response.data, contratos: $scope.dados.contratos }
                $scope.dados.contrato.dataEmissao = new Date(response.data.dataEmissao)
                $scope.dados.contrato.dataAssinatura = new Date(response.data.dataAssinatura)
                $scope.dados.contrato.dataVencimento = new Date(response.data.dataVencimento)
            }, function (error) {
                $scope.mensagem = { cor: 'danger', titulo: error.data.message }
            });
        }
        // Exibe caixa de diálogo para a exclusão
        $scope.confirmaExclusaoContrato= function (contrato) {
            if (confirm('Confirma a exclusão do contrato ' + contrato.numeroNota + ' ?')) {
                $http({
                    method: 'delete',
                    url: urlBase + '/contratos/' + contrato._id
                }).then(function (response) {
                    $scope.mensagem = { cor: 'success', titulo: response.data.message }
                    getContratos()
                }, function (error) {
                    $scope.mensagem = { cor: 'danger', titulo: error.data.message }
                });
                
            }
        }
        // Função para salvar (insert ou update) os dados do contrato
        $scope.salvaContrato = function (contrato) {
            if (contrato._id === undefined) { //se ainda não existir o _id, iremos incluir (POST), senão alteramos pelo (PUT)
                $http({
                    method: 'post',
                    url: urlBase + '/contratos/',
                    data: contrato
                }).then(function (response) {
                    $scope.mensagem = { cor: 'success', titulo: 'Cadastro incluído com sucesso!' }
                    getContratos()
                }, function (error) {
                    $scope.mensagem = { cor: 'danger', titulo: error.data.message }
                })
            } else {
                $http({
                    method: 'put',
                    url: urlBase + '/contratos/' + contrato._id,
                    data: contrato
                }).then(function (response) {
                    $scope.mensagem = { cor: 'success', titulo: 'Contrato alterado com sucesso!' }
                    getContratos()
                }, function (error) {
                    $scope.mensagem = { cor: 'danger', titulo: error.data.message }
                })
            }
            
        }
        /*========================================================
         * FIM das Funções relacionados aos CONTRATOS
         ========================================================*/



    });

app.controller('horaController', function ($scope, $interval) {
    var tick = function () {
        $scope.clock = Date.now();
    };
    tick();
    $interval(tick, 1000);
});



