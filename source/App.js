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
				{kind: "onyx.TouchButton", content: "Employees", onclick: "employees", style: "width: 100%"},
				{tag: "br"},{tag: "br"},
				{kind: "onyx.TouchButton", content: "Activities", onTouchTap: "buttonPress", style: "width: 100%"},
				{tag: "br"},{tag: "br"},
				{kind: "onyx.TouchButton", content: "Manage Studies", onTouchTap: "buttonPress", style: "width: 100%"},
				{tag: "br"},{tag: "br"},{tag: "br"},{tag: "br"},
				{kind: "onyx.TouchButton", content: "Perform a Study", onTouchTap: "buttonPress", style: "width: 100%; background-color: #1E6B00; color: white;"}
			]}
		]}
	],
	employees: function(){
		this.bubble("onView", {name: "employees"})
	}
});

enyo.kind({
	name: "freq.employees",
	kind: "FittableRows",
	components: [
		{kind: "onyx.Toolbar", content: "Employees"},
		{kind: "Scroller", fit: true, touch: false, components: [
			{kind: "onyx.TouchButton", content: "Employees", onTouchTap: "employees", style: "width: 100%"},
			{tag: "br"},{tag: "br"},
			{kind: "onyx.TouchButton", content: "Activities", onTouchTap: "buttonPress", style: "width: 100%"},
			{tag: "br"},{tag: "br"},
			{kind: "onyx.TouchButton", content: "Manage Studies", onTouchTap: "buttonPress", style: "width: 100%"},
			{tag: "br"},{tag: "br"},{tag: "br"},{tag: "br"},
			{kind: "onyx.TouchButton", content: "Perform a Study", onTouchTap: "buttonPress", style: "width: 100%; background-color: #1E6B00; color: white;"},
			{kind: "onyx.TouchButton", content: "Employees", onTouchTap: "employees", style: "width: 100%"},
			{tag: "br"},{tag: "br"},
			{kind: "onyx.TouchButton", content: "Activities", onTouchTap: "buttonPress", style: "width: 100%"},
			{tag: "br"},{tag: "br"},
			{kind: "onyx.TouchButton", content: "Manage Studies", onTouchTap: "buttonPress", style: "width: 100%"},
			{tag: "br"},{tag: "br"},{tag: "br"},{tag: "br"},
			{kind: "onyx.TouchButton", content: "Perform a Study", onTouchTap: "buttonPress", style: "width: 100%; background-color: #1E6B00; color: white;"},
			{kind: "onyx.TouchButton", content: "Employees", onTouchTap: "employees", style: "width: 100%"},
			{tag: "br"},{tag: "br"},
			{kind: "onyx.TouchButton", content: "Activities", onTouchTap: "buttonPress", style: "width: 100%"},
			{tag: "br"},{tag: "br"},
			{kind: "onyx.TouchButton", content: "Manage Studies", onTouchTap: "buttonPress", style: "width: 100%"},
			{tag: "br"},{tag: "br"},{tag: "br"},{tag: "br"},
			{kind: "onyx.TouchButton", content: "Perform a Study", onTouchTap: "buttonPress", style: "width: 100%; background-color: #1E6B00; color: white;"}
		]}
	],
	employees: function(){
		this.bubble("onView", {name: "employees"})
	}
});

enyo.kind({
	name: "onyx.TouchButton",
	kind: "onyx.Button",
	events: {
		onTouchTap: ""
	},
	handlers: {
		ontouchstart: "handleTouchstart",
		ontouchmove: "handleTouchmove",
		ontouchend: "handleTouchend"
	},
	moving: false,
	
	handleTouchstart: function(){
		this.moving = false;
	},
	handleTouchmove: function(){
		this.moving = true;
	},
	handleTouchend: function(){
		if(this.moving !== true){
			this.bubble("onTouchTap");
		}
	}
});
