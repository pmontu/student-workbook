
var app = angular.module("workbook", ["ngRoute"])
app.controller("solveController", function ($scope, $routeParams, data){

	question_id = $routeParams.question_id
    question = data.Question.get(question_id)

	$scope.question = question.text
	$scope.correct = question.answer
	$scope.vars = {};
	$scope.counter = 1
	$scope.last_derived_answer = 'empty'

	$scope.next_question_id = data.Question.next(question_id)
	$scope.question_id = question_id

	populate_input_variables()

	function populate_input_variables(){
		for(i=0; i<question.inputs.length; i++){
			input = question.inputs[i]
			$scope.vars[input.name + " in " + input.unit] = input.value
		}
	}

	$scope.add = function(){
		name = "result_of_formula_" + $scope.counter
		$scope.vars[name] = ""
		$scope.counter++;
		return name
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
			string: "kilo-grams = grams / 1000",
			expression: "k=_grams_/1000",
			map:{"_grams_":-1},
			result:0,
			variable:-1,
			unit:"kilo grams"
		}, {
			string: "force = mass * acceleration",
			expression: "f = _mass_*_acceleration_",
			map:{"_mass_":-1, "_acceleration_":-1},
			result:0,
			variable:-1,
			unit:"Newton"
		}, {
			string: "distance = speed * time",
			expression: "s = _speed_*_time_",
			map:{"_speed_":-1, "_time_":-1},
			result:0,
			variable:-1,
			unit:"meter"
		}, {
			string: "s = u * t + (a * t^2) / 2",
			expression: "s = _initial-velocity_*_time_+0.5*_acceleration_*_time_*_time_",
			map:{"_initial-velocity_":-1, "_acceleration_":-1, "_time_":-1},
			result:0,
			variable:-1,
			unit:"meter"
		}]
	$scope.solution = []
	$scope.add_formula = function(formula){
		formula = formula ? formula : $scope.selected_formula
		obj = jQuery.extend(true, {}, formula)
		obj.variable = $scope.add()
		$scope.solution.push(obj)
		recalculate($scope.solution[$scope.solution.length-1])
		$scope.last_derived_answer = 'new'
	}
	$scope.evaluate = function(index, map_key, new_key){
		$scope.solution[index].map[map_key] = new_key
		recalculate($scope.solution[index])
	}
	function recalculate(formula){
		equation = formula.expression
		for(symbol in formula.map){
			// equation = equation.replace(symbol, "$scope.vars['"+formula.map[symbol]+"']")
			equation = equation.replace(new RegExp(symbol, 'g'), "$scope.vars['"+formula.map[symbol]+"']");
		}
		formula.result = eval(equation)
		if (formula.variable != -1){
			result = parseFloat(formula.result).toFixed(2)
			$scope.vars[formula.variable] = result
			if(result){
				$scope.last_derived_answer = result
			}

		}
	}
	$scope.non_null_vars = function(){
		res = {}
		for(key in $scope.vars){
			if(!isNaN($scope.vars[key]))
				res[key] = $scope.vars[key]
		}
		return res
	}
	$scope.isNaN = isNaN
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
		answer: 5000,
		inputs: [{name: "acceleration of car", value: 5,unit: "ms-2"},
			{name: "mass of car", value: 1000000, unit: "gms"}]
	}, {
		text: "If it takes a player 3 seconds to run from the batter's box to the first base at an average speed of 6.5 m/s, what is the distance she covers in that time",
		answer: 19.5,
		inputs: [{name: "average velocity", value: 6.5,unit: "m/s"},
			{name: "traveled time", value: 3, unit: "seconds"}]
	}, {
		text: "An airplane accelerates down a runway at 3.20 m/s2 for 32.8 s until is finally lifts off the ground. Determine the distance traveled before takeoff",
		answer: 1721.34,
		inputs: [{name: "acceleration", value: 3.20,unit: "m/s2"},
			{name: "time on ground", value: 32.8, unit: "seconds"},
			{name: "initial velocity", value: 0, unit: "m/s"}]
	}]


	return {
		Question: {
			get : function(id){
				return questions[id]
			},
			list : function(){
				return questions
			},
			next: function(id){
				id = parseInt(id)
				return id >= questions.length-1 ? 0 : id+1
			}
		}
	};

});

app.filter('not_empty', function() {
  return function(obj) {
    return obj && Object.keys(obj).length > 0
  };
});

app.filter('remove_underscore', function() {
  return function(str) {
    return str = str.replace(/_|-/g, " ");
  };
});