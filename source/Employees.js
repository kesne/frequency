enyo.kind({
	name: "freq.employees",
	kind: "FittableRows",
	components: [
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
			{content: "Employees"},
			{fit: true},
			{kind: "onyx.TouchButton", content: "Back", ontouchtap: "back"}
		]},
		{kind: "List", onChange: "changeList", name: "emp", fit: true, multiSelect: true, count: 0, onSetupItem: "setupItem", components: [
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
		
		//
		//Add/Delete Dialogs:
		//
		{kind: "onyx.Popup", name: "deleteConfirm", centered: true, autoDismiss: false, modal: true, scrim: true, floating: true, style: "width: 320px;", components: [
			{content: "Remove Employees", style: "font-size: 1.2em; font-weight: bold; padding: 5px;"},
			{name: "removeText", style: "padding: 5px; margin-bottom: 10px;"},
			{components: [
				//FIXME: We can swap these over to TouchButtons if we see performance issues with tap events.
				{kind: "onyx.Button", content: "Cancel", classes: "onyx-button-dark", style: "width: 150px; height: 38px; float: left;", ontap: "closeDelete"},
				{kind: "onyx.Button", content: "Delete", classes: "onyx-button-dark", style: "width: 150px; height: 38px; float: right;", ontap: "confirmDelete"}
			]}
		]},
		{kind: "onyx.Popup", name: "addEmployee", centered: true, autoDismiss: false, modal: true, scrim: true, floating: true, style: "width: 320px;", components: [
			{content: "Add Employee", style: "font-size: 1.2em; font-weight: bold; padding: 5px;"},
			{content: "Enter the name of the new employee.", style: "padding: 5px;"},
			
			//{kind: "onyx.InputDecorator", components: [
				//We fake this so that the styling looks better on mobile devices:
				{kind: "onyx.Input", name: "employeeName", onkeyup: "checkEnter", classes: "enyo-tool-decorator onyx-input-decorator", placeholder: "name...", style: "width: 300px; outline: none; margin-bottom: 15px;"},
			//]},
			{components: [
				//FIXME: We can swap these over to TouchButtons if we see performance issues with tap events.
				{kind: "onyx.Button", content: "Cancel", ontap: "closeAdd", classes: "onyx-button-dark", style: "width: 150px; height: 38px; float: left;"},
				{kind: "onyx.Button", content: "Add", ontap: "confirmAddEmployee", classes: "onyx-button-dark", style: "width: 150px; height: 38px; float: right;"}
			]}
		]}
	],
	
	addEmployee: function(){
		this.$.addEmployee.show();
		this.$.employeeName.focus();
	},
	confirmAddEmployee: function(){
		var val = this.$.employeeName.getValue();
		if(val.trim() !== ""){
			this.employees.push(val);
			this.saveEmployees();
			this.gotEmployees();
		}
		this.closeAdd();
	},
	closeAdd: function(){
		this.$.employeeName.setValue("");
		this.$.addEmployee.hide();
	},
	checkEnter: function(inSender, inEvent){
		if(inEvent.keyCode === 13){
			this.confirmAddEmployee();
		}
	},
	
	//Utility function that saves this.employees to the store.
	saveEmployees: function(){
		this.store.save({key: "employees", options: this.employees});
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
	
	removeSelected: function() {
		for (var l=this.$.emp.getSelection().getSelected(), i=l.length-1; i>=0; i--) {
			if (l[i]) {
				this._removeItem(i);
			}
		}
		this.gotEmployees();
		this.saveEmployees();
	},
	
	confirmDelete: function(){
		this.removeSelected();
		this.closeDelete();
	},
	
	//Close the mass delete dialog:
	closeDelete: function(){
		this.$.deleteConfirm.hide();
	},
	
	deleteRow: function(inSender, inEvent){
		this.removeItem(inEvent.index);
		return true;
	},
	
	//Removes an item:
	removeItem: function(inIndex) {
		//Actually remove the item from the array:
		this._removeItem(inIndex);
		//Refresh the list:
		this.gotEmployees();
		//Refresh the minus button state:
		this.changeList();
		//Push updates to the db:
		this.saveEmployees();
	},
	//Utility function that actually removes the item:
	_removeItem: function(inIndex) {
		this.employees.splice(inIndex, 1);
	},
	
	//Triggered when the panel is viewed:
	onViewed: function(){
		this.store = new Lawnchair({name: "frequency"}, enyo.bind(this, function(store){
			store.get("employees", enyo.bind(this, function(emp){
				this.inited = true;
				this.gotEmployees(emp.options);
			}));
		}));
	},
	
	gotEmployees: function(emp){
		if(emp){
			this.employees = emp;
		}
		this.$.emp.setCount(this.employees.length);
		this.$.emp.reset();
	},
	
	//Show/Hide the remove button:
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