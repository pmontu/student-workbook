
var app = angular.module("workbook", [])
app.controller("variables", function ($scope){
	$scope.correct = 5000
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

	$scope.question = "Calculate the force needed to speed up a car with a rate of 5ms-2(x), if the mass of the car is 1000000 g(y)."

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
		// recalculate($scope.selected_formula)
		obj = jQuery.extend(true, {}, formula)
		obj.variable = $scope.add(true)
		$scope.solution.push(obj)
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
