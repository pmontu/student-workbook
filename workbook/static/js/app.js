
var app = angular.module("workbook", ["ngRoute"])
app.controller("solveController", function ($scope, $routeParams, data){

	question_id = $routeParams.question_id
    question = data.Question.get(question_id)

	$scope.question = question.text
	$scope.correct = question.answer
	$scope.vars = {};
	$scope.counter = 1
	$scope.add = function(isFormulaVariable){
		$scope.vars[$scope.counter] = isFormulaVariable == true ? 0 : $scope.new_value
		return $scope.counter++;
	}
	$scope.submit = function(){
		if($scope.answer == $scope.correct){
			alert("Good Job")
		} else {
			alert("Try Again")
		}
	}

	$scope.formulas = [
		{
			string: "k=g/1000",
			expression: "k=_g_/1000",
			map:{"_g_":-1},
			result:0,
			variable:-1
		}, {
			string: "f = m*a",
			expression: "f = _m_*_a_",
			map:{"_m_":-1, "_a_":-1},
			result:0,
			variable:-1
		}]
	$scope.solution = []
	$scope.add_formula = function(formula){
		formula = formula ? formula : $scope.selected_formula
		obj = jQuery.extend(true, {}, formula)
		obj.variable = $scope.add(true)
		$scope.solution.push(obj)
		recalculate($scope.solution[$scope.solution.length-1])
	}
	$scope.evaluate = function(index, map_key, new_key){
		$scope.solution[index].map[map_key] = new_key
		recalculate($scope.solution[index])
	}
	function recalculate(formula){
		equation = formula.expression
		for(symbol in formula.map){
			equation = equation.replace(symbol, "$scope.vars["+formula.map[symbol]+"]")
		}
		formula.result = eval(equation)
		if (formula.variable >=0){
			$scope.vars[formula.variable] = formula.result
		}
	}
})

app.controller("homeController", function ($scope, data){
	$scope.questions = data.Question.list()
})

app.config(['$routeProvider', function($routeProvider) {
   $routeProvider.
   
   when('/', {
      templateUrl: 'views/dashboard.html', controller: 'homeController'
   }).
   
   when('/solve/:question_id', {
      templateUrl: 'views/solve.html', controller: 'solveController'
   }).
   
   otherwise({
      redirectTo: '/'
   });
	
}]);

app.factory('data', function(){
	
	questions = [{
		text: "Calculate the force needed to speed up a car with a rate of 5ms-2, if the mass of the car is 1000000 g.",
		answer: 5000
	}, {
		text: "Calculate the force needed to speed up a car with a rate of 10ms-2, if the mass of the car is 1000000 g.",
		answer: 10000
	}]

	return {
		Question: {
			get : function(id){
				return questions[id]
			},
			list : function(){
				return questions
			}
		}
	};

});