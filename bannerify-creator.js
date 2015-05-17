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