enyo.kind({
	name: "onyx.TouchButton",
	kind: "onyx.Button",
	events: {
		ontouchtap: ""
	},
	handlers: {
		ontouchstart: "handleTouchstart",
		ontouchmove: "handleTouchmove",
		ontouchend: "handleTouchend",
		
		//Desktop catch:
		ontap: "desktopCatch"
	},
	//Prevent drag interference
	moving: false,
	
	//Bubble for non-touch devices:
	desktopCatch: function(inSender, inEvent){
		if(!enyo.platform.touch){
			this.bubble("ontouchtap", inEvent);
		}
	},
	
	//Touch Button Logic:
	handleTouchstart: function(){
		this.moving = false;
	},
	handleTouchmove: function(){
		this.moving = true;
	},
	handleTouchend: function(inSender, inEvent){
		if(this.moving !== true){
			//Bubble up the ontouchtap event:
			this.bubble("ontouchtap", inEvent);
		}
	}
});

if (!String.prototype.trim) {
	String.prototype.trim = function(){
		return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	};
}