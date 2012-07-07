enyo.kind({
	name: "App",
	fit: true,
	classes: "onyx",
	kind: "FittableRows",
	//Generic Events:
	handlers: {
		onHome: "goHome",
		onView: "goView"
	},
	components:[
		// === Core Panels Kind ===
		// We disable the animations and dragging features to prevent possible issues and to keep things snappy.
		
		/**
		 * List Of Index's:
		 * 	- Home: 0
		 * 	- Study Assets: 1
		 * 	- Create Study: 2
		 */
		
		{kind: "Panels", name: "Nav", fit: true, animate: false, draggable: false, components: [
			{kind: "freq.Home"},
			{kind: "freq.Employees"},
			{kind: "freq.Activities"}
		]}
	],
	goHome: function(){
		this.$.Nav.setIndex(0);
	},
	goView: function(inSender, inEvent){
		this.$.Nav.setIndex(inEvent.index);
		var c = this.$.Nav.getPanels();
		if(c[inEvent.index]){
			this.$.Nav.setIndex(inEvent.index);
			if(c[inEvent.index].viewed && typeof(c[inEvent.index].viewed) === "function"){
				c[inEvent.index].viewed();
			}
		}else{
			console.log("Navigating to non-existant panel index " + inEvent.index + ".");
		}
	}
});

enyo.kind({
	name: "freq.Home",
	events: {
		onStudyAssets: ""
	},
	components:[
		{kind: "onyx.Toolbar", components: [
			{content: "Frequency Study"}
		]},
		{classes: "onyx-toolbar-fix button-container", components: [
			{kind: "onyx.Button", content: "Employees", ontap: "employees", classes: "big-button onyx-button-dark", style: "width: 100%"},
			{tag: "br"},{tag: "br"},
			{kind: "onyx.Button", content: "Activies", ontap: "activities", classes: "big-button onyx-button-dark", style: "width: 100%"},
			{tag: "br"},{tag: "br"},
			{kind: "onyx.Button", content: "Create A Study", ontap: "createStudy", classes: "big-button onyx-button-dark", style: "width: 100%"},
			{tag: "br"},{tag: "br"},
			{tag: "br"},{tag: "br"},
			{kind: "onyx.Button", content: "Perform A Study", ontap: "performStudy", classes: "big-button onyx-affirmative", style: "background-color: #236300; width: 100%;"}
		]}
	],
	employees: function(){
		this.bubble("onView", {index: 1})
	},
	activities: function(){
		this.bubble("onView", {index: 2});
	}
});


enyo.kind({
	name: "freq.Employees",
	kind: "FittableRows",
	employees: [
		"John",
		"Greg",
		"Jeff"
	],
	components:[
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
			{kind: "onyx.Button", content: "Back", ontap: "goBack"},
			{content: "Employees", style: "text-align: center; text-indent: -50px;", fit: true},
			{kind: "onyx.IconButton", src: "assets/menu-icon-add.png", ontap: "addEmployee", style: "height: 32px"}
		]},
		{kind: "List", fit: true, count: 0, name: "Employ", onSetupItem: "setupItem", components: [
			{classes: "employee-item", components: [
				{name: "name"}
			]}
		]},
		{kind: "onyx.Popup", name: "add", centered: true, modal: true, autoDismiss: false, floating: true, scrim: true, components: [
			{content: "Add Employee", classes: "popup-header"},
			{kind: "onyx.InputDecorator", style: "margin-top: 10px; margin-bottom: 10px; width: 250px;", components: [
				{kind: "onyx.Input", placeholder: "Employee Name", name: "addName"}
			]},
			{components: [
				{kind: "onyx.Button", content: "Cancel", ontap: "closeModal", classes: "onyx-button-dark", style: "float: left; width: 100px; margin: 5px;"},
				{kind: "onyx.Button", content: "Add", ontap: "processAdd", style: "float: right; width: 100px; margin: 5px;"}
			]}
		]}
	],
	
	addEmployee: function(){
		this.$.add.show();
		this.$.addName.focus();
	},
	closeModal: function(){
		this.$.add.hide();
	},
	processAdd: function(){
		this.employees.push(this.$.addName.getValue());
		this.$.addName.setValue("");
		this.$.add.hide();
		this.generateList();
	},
	
	viewed: function(){
		this.generateList();
	},
	
	generateList: function(){
		this.$.Employ.setCount(this.employees.length);
		this.$.Employ.reset();
	},
	
	setupItem: function(inSender, inEvent){
		this.$.name.setContent(this.employees[inEvent.index]);
	},
	
	goBack: function(){
		this.bubble("onHome");
	}
});

enyo.kind({
	name: "freq.Activities",
	kind: "FittableRows",
	components:[
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
			{kind: "onyx.Button", content: "Back", ontap: "goBack"},
			{content: "Categories", style: "text-align: center; text-indent: -50px;", fit: true},
			{kind: "onyx.IconButton", src: "assets/menu-icon-add.png", style: "height: 32px"}
		]},
		{kind: "List", fit: true, count: 0, name: "Cat", onSetupItem: "setupItem", components: [
			{name: "name"}
		]}
	],
	
	viewed: function(){
		console.log("Viewed");
		this.$.Cat.setCount(10);
		this.$.Cat.reset();
	},
	
	setupItem: function(inSender, inEvent){
		this.$.name.setContent(inEvent.index);
	},
	
	goBack: function(){
		this.bubble("onHome");
	}
});

