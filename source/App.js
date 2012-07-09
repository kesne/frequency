enyo.kind({
	name: "App",
	fit: true,
	classes: "onyx",
	kind: "FittableRows",
	handlers: {
		onView: "manageView"
	},
	components:[
		{kind: "Panels", name: "panels", fit: true, animate: false, draggable: false, components: [
			{kind: "freq.home"},
			{kind: "freq.employees"}
		]}
	],
	manageView: function(inSender, inEvent){
		var p = this.$.panels.getPanels();
		var index = 0;
		for(var x in p){
			if(p.hasOwnProperty(x)){
				if(p[x].kind.split(".")[1] === inEvent.name){
					this.$.panels.setIndex(index);
					break;
				}
			}
			index++;
		}
	}
});

enyo.kind({
	name: "freq.home",
	kind: "FittableRows",
	components: [
		{kind: "onyx.Toolbar", content: "Frequency Study"},
		{kind: "Scroller", fit: true, components: [
			{style: "padding: 20px", components: [
				{kind: "onyx.TouchButton", content: "Employees", ontouchtap: "employees", style: "width: 100%"},
				{tag: "br"},{tag: "br"},
				{kind: "onyx.TouchButton", content: "Activities", onclick: "employees", style: "width: 100%"},
				{tag: "br"},{tag: "br"},
				{kind: "onyx.TouchButton", content: "Manage Studies", ontouchtap: "buttonPress", style: "width: 100%"},
				{tag: "br"},{tag: "br"},{tag: "br"},{tag: "br"},
				{kind: "onyx.TouchButton", content: "Perform a Study", ontouchtap: "buttonPress", style: "width: 100%; background-color: #1E6B00; color: white;"}
			]}
		]}
	],
	employees: function(){
		this.bubble("onView", {name: "employees"});
	}
});

enyo.kind({
	name: "freq.employees",
	kind: "FittableRows",
	components: [
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
			{content: "Employees"},
			{fit: true},
			{kind: "onyx.TouchButton", content: "Back", ontouchtap: "back"}
		]},
		{kind: "Scroller", fit: true, components: [
			{content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nec massa quam, sed porttitor libero. Nunc scelerisque pulvinar varius. Aliquam in neque vel nibh tincidunt volutpat non nec dui. Pellentesque sit amet volutpat libero. Ut sapien odio, lacinia eget volutpat a, sollicitudin a orci. Nunc lacinia scelerisque lorem ut cursus. Nunc malesuada volutpat imperdiet. In lobortis quam vel ligula feugiat sit amet sollicitudin elit varius. Maecenas orci eros, volutpat sed sodales et, hendrerit nec ante. Aliquam fermentum sem in lorem sodales nec tempus lectus interdum. Cras elementum consequat scelerisque. Vivamus non bibendum ipsum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur luctus tellus vitae sem pharetra bibendum. Quisque ultricies, leo in scelerisque adipiscing, odio urna mollis elit, eget volutpat magna ipsum ut magna. Curabitur quis aliquet urna."}
		]}
	],
	back: function(){
		this.bubble("onView", {name: "home"})
	}
});

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