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
				{kind: "onyx.Button", content: "Activities", onclick: "employees", classes: "onyx-button-dark homeButton"},
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
		{kind: "List", onChange: "changeList", name: "emp", fit: true, multiSelect: true, count: 13, onSetupItem: "setupItem", components: [
	        {kind: "onyx.SwipeableItem", onDelete: "deleteRow", components: [
				{name: "item", classes: "item enyo-border-box", components: [
					{name: "name"}
				]}
			]}
	    ]},
		{kind: "onyx.Toolbar", name: "footer", layoutKind: "FittableColumnsLayout", components: [
			//FIXME: We can create a touch version of the iconbutton if performance is a problem.
			{kind: "onyx.IconButton", showing: false, name: "deleter", ontap: "massDelete", src: "assets/menu-icon-remove.png", style: "height: 32px; width: 150px;"},
			{fit: true},
			{kind: "onyx.IconButton", src: "assets/menu-icon-add.png", ontap: "addEmployee", classes: "onyx-icon-right", style: "height: 32px; width: 150px;"}
		]},
		{kind: "onyx.Popup", name: "deleteConfirm", centered: true, autoDismiss: false, modal: true, scrim: true, floating: true, style: "width: 320px;", components: [
			{content: "Remove Employees", style: "font-size: 1.2em; font-weight: bold; padding: 5px;"},
			{name: "removeText", style: "padding: 5px; margin-bottom: 10px;"},
			{components: [
				//FIXME: We can swap these over to TouchButtons if we see performance issues with tap events.
				{kind: "onyx.Button", content: "Cancel", classes: "onyx-button-dark", style: "width: 150px; height: 38px; float: left;", ontap: "closeDelete"},
				{kind: "onyx.Button", content: "Delete", classes: "onyx-button-dark", style: "width: 150px; height: 38px; float: right;", ontap: "closeDelete"}
			]}
		]},
		{kind: "onyx.Popup", name: "addEmployee", centered: true, autoDismiss: false, modal: true, scrim: true, floating: true, style: "width: 320px;", components: [
			{content: "Add Employee", style: "font-size: 1.2em; font-weight: bold; padding: 5px;"},
			{content: "Enter the name of the new employee.", style: "padding: 5px;"},
			
			//{kind: "onyx.InputDecorator", components: [
				//We fake this so that the styling looks better:
				{kind: "onyx.Input", name: "employeeName", classes: "enyo-tool-decorator onyx-input-decorator", placeholder: "name...", style: "width: 300px; outline: none; margin-bottom: 15px;"},
			//]},
			{components: [
				//FIXME: We can swap these over to TouchButtons if we see performance issues with tap events.
				{kind: "onyx.Button", content: "Cancel", classes: "onyx-button-dark", style: "width: 150px; height: 38px; float: left;", ontap: "closeAdd"},
				{kind: "onyx.Button", content: "Add", classes: "onyx-button-dark", style: "width: 150px; height: 38px; float: right;", ontap: "closeAdd"}
			]}
		]}
	],
	
	addEmployee: function(){
		this.$.addEmployee.show();
	},
	closeAdd: function(){
		this.$.addEmployee.hide();
	},
	
	massDelete: function(){
		var s = this.$.emp.getSelection();
		if(s.selected.join("") !== ""){
			//Length of selected doesn't work, so we implement our own solution:
			var length = s.selected.join(" ").match(/true/g).length;
			this.$.removeText.setContent("Remove these " + length + " employees?");
			this.$.deleteConfirm.show();
		}
	},
	
	//This allows the onChange event to trigger properly:
	rendered: function(){
		this.inherited(arguments);
		this.inited = true;
	},
	changeList: function(){
		if(this.inited){
			var s = this.$.emp.getSelection();
			if(s.selected.join("") !== ""){
				this.$.deleter.setShowing(true);
				this.$.footer.reflow();
			}else{
				this.$.deleter.setShowing(false);
				this.$.footer.reflow();
			}
		}
	},
	
	closeDelete: function(){
		this.$.deleteConfirm.hide();
	},
	
	setupItem: function(inSender, inEvent) {
		// given some available data.
	    var data = this.employees[inEvent.index];
	    // setup the controls for this item.
	    this.$.name.setContent(data);
	    this.$.item.addRemoveClass("item-selected", inSender.isSelected(inEvent.index));
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