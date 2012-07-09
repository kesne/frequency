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
		{fit: true, components: [
			{style: "padding: 20px", components: [
				{kind: "onyx.TouchButton", content: "Employees", ontouchtap: "employees", classes: "onyx-button-dark homeButton"},
				{tag: "br"},{tag: "br"},
				{kind: "onyx.TouchButton", content: "Activities", ontouchtap: "employees", classes: "onyx-button-dark homeButton"},
				{tag: "br"},{tag: "br"},
				{kind: "onyx.TouchButton", content: "Manage Studies", ontouchtap: "employees", classes: "onyx-button-dark homeButton"},
				{tag: "br"},{tag: "br"},{tag: "br"},{tag: "br"},
				{kind: "onyx.TouchButton", content: "Perform a Study", ontouchtap: "buttonPress", classes: "homeButton", style: "background-color: #1E6B00; color: white;"}
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
	employees: [
		"kesne",
		"kesne",
		"kesne",
		"kesne",
		"kesne",
		"kesne",
		"kesne",
		"kesne",
		"kesne",
		"kesne",
		"kesne",
		"kesne",
		"Jordan"
	],
	components: [
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
			{content: "Employees"},
			{fit: true},
			{kind: "onyx.TouchButton", content: "Back", ontouchtap: "back"}
		]},
		{kind: "List", fit: true, count: 13, onSetupItem: "setupItem", components: [
	        {kind: "onyx.SwipeableItem", onDelete: "deleteRow", components: [
				{name: "item", classes: "item enyo-border-box", components: [
					{name: "name"},
					{name: "index", style: "float: right;"}
				]}
			]}
	    ]},
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
			{fit: true},
			{kind: "onyx.IconButton", src: "assets/menu-icon-add.png", style: "height: 32px;"}
		]}
	],
	
	setupItem: function(inSender, inEvent) {
	    // given some available data.
	    var data = this.employees[inEvent.index];
	    // setup the controls for this item.
	    this.$.name.setContent(data);
	    this.$.index.setContent(inEvent.index);
	},
	itemTap: function(inSender, inEvent) {
	    alert("You tapped on row: " + inEvent.index);
	},
	
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