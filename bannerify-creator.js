angular.module('bannerify', [])
	.controller('BannerCreationController', ['$scope', function ($scope) {
		"use strict";
		$scope.id = "sj893icvox60";
		$scope.delay = 2000;
		$scope.width = 620;
		$scope.height = 444;
		$scope.embedCode = null;
		
		$scope.steps = [];
		$scope.options = {
			once: false
		};
		
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
			var editSteps = [];
			if (data.value == PreziPlayer.STATUS_CONTENT_READY) {
				$scope.animationSteps = $scope.bannerify.player.getAnimationCountOnSteps();
				var stepCount = $scope.animationSteps.length;
				for (var i=0; i<stepCount; i++) {
					var actualStep = new Object();
					var anim = [];
					for (var j=0; j<$scope.animationSteps[i]; j++) {
						anim.push({delay: $scope.delay});
					}
					actualStep.delay = $scope.delay;
					actualStep.anim = anim;	
					editSteps.push(actualStep);
				}
				$scope.$apply(function () {
					$scope.steps = editSteps;
				});
			}
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
			$scope.bannerify.player.flyToStep(0);
			
			$scope.bannerify.setSteps($scope.steps);
			$scope.bannerify.setOptions($scope.options);
			$scope.bannerify.play();
		}
		
		$scope.stop = function stop () {
			$scope.bannerify.stop();
		}
		
		$scope.createEmbedCode = function createEmbedCode () {	
			var strPart1 = "<script>var d=document.createElement('div'), p=document.createElement('script'), pp=document.createElement('script'), ppp=document.createElement('script'), incl, ld1, ld2; incl = function(){ d.id=\"prezi_player_"+$scope.id+"\"; ppp.innerHTML=\"var player = new Bannerify('\"+d.id+\"', {preziId: '"+$scope.id+"', width: '"+$scope.width+"', height: '"+$scope.height+"', once: '"+$scope.options.once.toString()+"'}, ";
			var strPart2 = angular.toJson($scope.steps).replace(/\"/g,"\\\"").replace(/\'/g,"\\'");
			var strPart3 = ");\"; document.body.appendChild(d); document.body.appendChild(ppp); }; ld1 = function(){ if (!window.PreziPlayer) { p.src=\"http://prezi.github.io/prezi-player/lib/PreziPlayer/prezi_player.js\"; document.body.appendChild(p); p.onload = ld2; } else { ld2(); } }; ld2 = function(){ if (!window.Bannerify) { pp.src=\"https://raw.githubusercontent.com/alaplap/bannerify/master/bannerify.js\"; document.body.appendChild(pp); pp.onload = incl; } else { incl(); } }; if (!window.PreziPlayer || !window.Bannerify) { ld1(); } else { incl(); }</script>";
			
			$scope.embedCode = strPart1.concat(strPart2,strPart3);
		}
		
		$scope.createJSON = function createJSON () {	
			$scope.embedCode = angular.toJson($scope.steps);
		}
	
	}]);