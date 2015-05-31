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
			
			options = options || {};
			this.options = options;
			
			steps = steps || [];
			this.steps = steps;
	  	}
		
		Bannerify.prototype.setSteps = function (steps) {
			this.steps = steps || [];
		}
		
		Bannerify.prototype.setOptions = function (options) {
			this.options = options || [];
		}
		
		Bannerify.prototype.initValues = function (data) {
			if (data.value == PreziPlayer.STATUS_CONTENT_READY) {
				this.animationSteps = this.player.getAnimationCountOnSteps();
				this.stepCount = this.animationSteps.length;
				if (this.steps.length > 0) {
					this.play();
				}
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
				this.player.off(PreziPlayer.EVENT_CURRENT_STEP, __bind(this.handleStepChange, this));
				this.player.off(PreziPlayer.EVENT_CURRENT_ANIMATION_STEP, __bind(this.handleStepChange, this));
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
				delay = this.steps[currentStep].anim[data.value-1].delay;
			} else {
				return;
			}
			
			clearTimeout(this.timer);
			
			if (this.animationSteps[currentStep] > 0 || this.stepCount > (currentStep+1)) {
				this.timer = setTimeout(__bind(function () { this.flyToNextStep() }, this.player), delay);
			} else if (!this.options.once) {
				this.timer = setTimeout(__bind(function () { this.flyToStep(0) }, this.player), delay);
			}
		}

		return Bannerify;

	})();

})();