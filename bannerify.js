angular.module('bannerify', [])
	.controller('BannerCreationController', ['$scope', function ($scope) {
		"use strict";
		$scope.id = "sj893icvox60";
		$scope.delay = 2000;
		$scope.width = 620;
		$scope.height = 444;
		
		$scope.steps = [];
		
		$scope.bannerify = new Object();
		
		$scope.setup = function setup () {
			//embed the prezi
			$scope.bannerify = new Bannerify('player-api-intro', { //id of div to embed into
				preziId: this.id, //id of prezi, visible in the url when you load the prezi on Prezi.com 
				width: this.width,
				height: this.height
			});
			
			$scope.bannerify.player.on(PreziPlayer.EVENT_STATUS, this.getStepsData);
		};
	
		$scope.getStepsData = function getStepsData (data) {
			$scope.steps = [];
			if (data.value == PreziPlayer.STATUS_CONTENT_READY) {
				$scope.animationSteps = $scope.bannerify.player.getAnimationCountOnSteps();
				var stepCount = $scope.animationSteps.length;
				for (var i=0; i<stepCount; i++) {
					var actualStep = new Object();
					var animations = [];
					for (var j=0; j<$scope.animationSteps[i]; j++) {
						animations.push({delay: $scope.delay});
					}
					actualStep.delay = $scope.delay;
					actualStep.animations = animations;	
					$scope.steps.push(actualStep);
				}
			}
			$scope.$apply();
		}
		
		$scope.stepTo = function stepTo (n) {
			if ($scope.bannerify && typeof $scope.bannerify.player.getStatus === "function" && $scope.bannerify.player.getStatus() == PreziPlayer.STATUS_CONTENT_READY) {
				switch (n) {
					case 1:
						$scope.bannerify.player.flyToNextStep();
						break;
					case -1:
						$scope.bannerify.player.flyToPreviousStep();
						break;
				}
			}
		}
		
		$scope.play = function play () {
			$scope.bannerify.setSteps($scope.steps);
			$scope.bannerify.play();
		}
		
		$scope.stop = function stop () {
			$scope.bannerify.stop();
		}
	
	}]);

(function() {
	"use strict";
	var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	window.Bannerify = (function() {

  		function Bannerify(id, options, steps) {
	  		this.player = new PreziPlayer(id, options);
			this.player.on(PreziPlayer.EVENT_STATUS, __bind(this.initValues, this));
			
			this.animationSteps = [];
			this.stepCount = 0;
			this.timer = null;
			
			steps = steps || [];
			this.steps = steps;
	  	}
		
		Bannerify.prototype.setSteps = function (steps) {
			this.steps = steps;
		}
		
		Bannerify.prototype.initValues = function (data) {
			console.log(this);
			if (data.value == PreziPlayer.STATUS_CONTENT_READY) {
				this.animationSteps = this.player.getAnimationCountOnSteps();
				this.stepCount = this.animationSteps.length;
			}
		}
		
		Bannerify.prototype.play = function (defaultDelayInMilliSec) {
			if (this.steps.length == 0) {
				this.player.play();
			} else {
				this.player.on(PreziPlayer.EVENT_CURRENT_STEP, __bind(this.handleStepChange, this));
				this.player.on(PreziPlayer.EVENT_CURRENT_ANIMATION_STEP, __bind(this.handleStepChange, this));
				this.handleStepChange({type: PreziPlayer.EVENT_CURRENT_STEP, value: 0});
			}
		}	
		
		Bannerify.prototype.stop = function () {
			if (this.steps.length == 0) {
				this.player.stop();
			} else {
				this.player.off(PreziPlayer.EVENT_CURRENT_STEP);
				this.player.off(PreziPlayer.EVENT_CURRENT_ANIMATION_STEP);
				clearTimeout(this.timer);
				this.player.flyToStep(0);
			}
		}
		
		Bannerify.prototype.handleStepChange = function (data) {
			var currentStep, delay;
			if (data.type == PreziPlayer.EVENT_CURRENT_STEP) {
				currentStep = data.value;
				delay = this.steps[currentStep].delay;
			} else if (data.type == PreziPlayer.EVENT_CURRENT_ANIMATION_STEP && data.value > 0) {
				currentStep = this.player.getCurrentStep();
				delay = this.steps[currentStep].animations[data.value-1].delay;
			} else {
				return;
			}
			
			console.log(data);
			
			if (this.animationSteps[currentStep] > 0 || this.stepCount > (currentStep+1)) {
				console.log("delay: "+delay);
				this.timer = setTimeout(__bind(function () { this.player.flyToNextStep() }, this), delay);
			} else {
				this.timer = setTimeout(__bind(function () { this.player.flyToStep(0) }, this), delay);
			}
		}

		return Bannerify;

	})();

})();