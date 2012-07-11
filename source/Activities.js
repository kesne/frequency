enyo.kind({
	name: "freq.activities",
	kind: "FittableRows",
	activities: {},
	handlers: {
		onActivityBack: "onGotBack"
	},
	components: [
		{kind: "Panels", name: "panels", fit: true, draggable: false, animate: false, components: [
			{kind: "FittableRows", components: [
				{kind: "onyx.Toolbar", name: "Header", layoutKind: "FittableColumnsLayout", components: [
					{content: "Activity Categories", name: "HeaderContent"},
					{fit: true},
					{kind: "onyx.TouchButton", content: "Back", ontouchtap: "back"}
				]},
				{kind: "List", fit: true, name: "act", count: 0, onSetupItem: "setupItem", components: [
			        {kind: "onyx.SwipeableItem", onDelete: "deleteRow", ontap: "selectRow", components: [
						{name: "item", classes: "item enyo-border-box", components: [
							{name: "name"}
						]}
					]}
			    ]},
			    {kind: "onyx.Toolbar", name: "footer", layoutKind: "FittableColumnsLayout", components: [
					{fit: true},
					{kind: "onyx.IconButton", src: "assets/menu-icon-add.png", ontap: "addCategory", classes: "onyx-icon-right", style: "height: 32px; width: 150px;"}
				]}
			]},
		    {kind: "freq.subactivity", name: "subactivity"}
		]},
		
		//
		//Add/Delete Dialogs:
		//
		{kind: "onyx.Popup", name: "addCategory", centered: true, autoDismiss: false, modal: true, scrim: true, floating: true, style: "width: 320px;", components: [
			{content: "Add Category", style: "font-size: 1.2em; font-weight: bold; padding: 5px;"},
			{content: "Enter the name of the new category.", style: "padding: 5px;"},
			
			//{kind: "onyx.InputDecorator", components: [
				//We fake this so that the styling looks better on mobile devices:
				{kind: "onyx.Input", name: "categoryName", onkeyup: "checkEnter", classes: "enyo-tool-decorator onyx-input-decorator", placeholder: "category name...", style: "width: 300px; outline: none; margin-bottom: 15px;"},
			//]},
			{components: [
				//FIXME: We can swap these over to TouchButtons if we see performance issues with tap events.
				{kind: "onyx.Button", content: "Cancel", ontap: "closeAdd", classes: "onyx-button-dark", style: "width: 150px; height: 38px; float: left;"},
				{kind: "onyx.Button", content: "Add", ontap: "confirmAdd", classes: "onyx-button-dark", style: "width: 150px; height: 38px; float: right;"}
			]}
		]},
		{kind: "onyx.Popup", name: "errorPopup", centered: true, autoDismiss: false, modal: true, scrim: true, floating: true, style: "width: 320px;", components: [
			{content: "Error", style: "font-size: 1.2em; font-weight: bold; padding: 5px;"},
			{content: "A category by that name already exists, please use a different name.", style: "padding: 5px; margin-bottom: 10px;"},
			{components: [
				{kind: "onyx.Button", content: "Okay", ontap: "closeError", classes: "onyx-button-dark", style: "width: 320px; height: 38px;"}
			]}
		]},
		{kind: "onyx.Popup", name: "deleteConfirm", centered: true, autoDismiss: false, modal: true, scrim: true, floating: true, style: "width: 320px;", components: [
			{content: "Delete Category", style: "font-size: 1.2em; font-weight: bold; padding: 5px;"},
			{content: "", name: "deleteConfirmContent", style: "padding: 5px;", allowHtml: true},
			{content: "Please note that all of the activities in the category will also be deleted.", style: "padding: 5px; margin-bottom: 10px;"},
			{components: [
				{kind: "onyx.Button", content: "Cancel", ontap: "cancelDelete", classes: "onyx-button-dark", style: "width: 150px; height: 38px; float: left;"},
				{kind: "onyx.Button", content: "Delete", ontap: "deleteCat", classes: "onyx-button-dark", style: "width: 150px; height: 38px; float: right;"}
			]}
		]}
	],
	
	/*
	 * Delete Functions:
	 */
	deleteRow: function(inSender, inEvent){
		this.deleting = this.activitiesArray[inEvent.index];
		this.$.deleteConfirmContent.setContent('Are you sure you want to delete the category "<strong>' + this.deleting + '</strong>"?');
		this.$.deleteConfirm.show();
	},
	cancelDelete: function(){
		this.$.deleteConfirm.hide();
	},
	deleteCat: function(){
		delete this.activities[this.deleting];
		this.saveActivities();
		this.gotActivities();
		this.$.deleteConfirm.hide();
	},
	
	/*
	 * Add Functions:
	 */
	addCategory: function(){
		this.$.addCategory.show();
	},
	closeAdd: function(){
		this.$.categoryName.setValue("");
		this.$.addCategory.hide();
		this.reflow();
	},
	confirmAdd: function(){
		var val = this.$.categoryName.getValue();
		if(val.trim() !== ""){
			if(this.activities[val]){
				this.closeAdd();
				this.showError();
			}else{
				this.activities[val] = [];
				this.saveActivities();
				this.closeAdd();
				this.gotActivities();
			}
		}else{
			this.closeAdd();
		}
	},
	checkEnter: function(inSender, inEvent){
		//Add if enter is pressed in the input box:
		if(inEvent.keyCode === 13){
			this.confirmAdd();
		}
	},
	
	/*
	 * Utility functions to show and hide the error dialog:
	 */
	showError: function(){
		this.$.errorPopup.show();
	},
	closeError: function(){
		this.$.errorPopup.hide();
	},
	
	//Utility function that saves this.employees to the store.
	saveActivities: function(){
		this.store.save({key: "activities", options: this.activities});
	},
	
	//Triggered when the panel is viewed:
	onViewed: function(){
		this.store = new Lawnchair({name: "frequency"}, enyo.bind(this, function(store){
			store.get("activities", enyo.bind(this, function(act){
				this.gotActivities(act.options);
			}));
		}));
	},
	
	//Sets the data, if it is provided, and displays the list:
	gotActivities: function(act){
		if(act){
			this.activities = act;
		}
		var arr = [];
		for(var x in this.activities){
			arr.push(x);
		}
		this.activitiesArray = arr;
		this.$.act.setCount(arr.length);
		this.$.act.reset();
	},
	
	//Sets up a list item:
	setupItem: function(inSender, inEvent) {
		// given some available data.
	    var data = this.activitiesArray[inEvent.index];
	    // setup the controls for this item.
	    this.$.name.setContent(data);
	},
	
	//Select a category:
	selectRow: function(inSender, inEvent){
		//Put it in view:
		this.$.panels.setIndex(1);
		//Call the activate function with the name of the category:
		this.$.subactivity.onViewed(this.activitiesArray[inEvent.index]);
	},
	
	//Bubbled up from the sub kind:
	onGotBack: function(){
		//Refresh our data (needed because of the universal activities object):
		this.onViewed();
		//Swap views:
		this.$.panels.setIndex(0);
		return true;
	},
	
	//Pressed back button:
	back: function(){
		this.bubble("onView", {name: "home"});
	}
});

enyo.kind({
	name: "freq.subactivity",
	kind: "FittableRows",
	activities: {},
	components: [
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
			{content: "Activities"},
			{fit: true},
			{kind: "onyx.TouchButton", content: "Back", ontouchtap: "back"}
		]},
		{kind: "List", onChange: "changeList", name: "act", fit: true, multiSelect: true, count: 0, onSetupItem: "setupItem", components: [
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
			{kind: "onyx.IconButton", src: "assets/menu-icon-add.png", ontap: "addActivity", classes: "onyx-icon-right", style: "height: 32px; width: 150px;"}
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
		{kind: "onyx.Popup", name: "addActivity", centered: true, autoDismiss: false, modal: true, scrim: true, floating: true, style: "width: 320px;", components: [
			{content: "Add Activity", style: "font-size: 1.2em; font-weight: bold; padding: 5px;"},
			{content: "Enter the name of the new activity.", style: "padding: 5px;"},
			
			//{kind: "onyx.InputDecorator", components: [
				//We fake this so that the styling looks better on mobile devices:
				{kind: "onyx.Input", name: "activityName", onkeyup: "checkEnter", classes: "enyo-tool-decorator onyx-input-decorator", placeholder: "name...", style: "width: 300px; outline: none; margin-bottom: 15px;"},
			//]},
			{components: [
				//FIXME: We can swap these over to TouchButtons if we see performance issues with tap events.
				{kind: "onyx.Button", content: "Cancel", ontap: "closeAdd", classes: "onyx-button-dark", style: "width: 150px; height: 38px; float: left;"},
				{kind: "onyx.Button", content: "Add", ontap: "confirmAddActivity", classes: "onyx-button-dark", style: "width: 150px; height: 38px; float: right;"}
			]}
		]}
	],
	
	addActivity: function(){
		this.$.addActivity.show();
		this.$.activityName.focus();
	},
	confirmAddActivity: function(){
		var val = this.$.activityName.getValue();
		if(val.trim() !== ""){
			this.activitiesArray.push(val);
			//Pass true to have it push the activities array into the activities object.
			this.saveActivities(true);
			this.gotActivities();
		}
		this.closeAdd();
	},
	closeAdd: function(){
		this.$.activityName.setValue("");
		this.$.addActivity.hide();
		this.reflow();
	},
	checkEnter: function(inSender, inEvent){
		if(inEvent.keyCode === 13){
			this.confirmAddActivity();
		}
	},
	
	//Utility function that saves this.employees to the store.
	saveActivities: function(s){
		if(s === true){
			this.activities[this.category] = this.activitiesArray;
		}
		this.store.save({key: "activities", options: this.activities});
	},
	
	massDelete: function(){
		var s = this.$.act.getSelection();
		if(s.selected.join("") !== ""){
			//Length of selected doesn't work, so we implement our own solution:
			var length = s.selected.join(" ").match(/true/g).length;
			this.$.removeText.setContent("Remove these " + length + " activities?");
			this.$.deleteConfirm.show();
		}
	},
	
	removeSelected: function() {
		for (var l=this.$.act.getSelection().getSelected(), i=l.length-1; i>=0; i--) {
			if (l[i]) {
				this._removeItem(i);
			}
		}
		this.gotActivities();
		this.saveActivities(true);
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
		this.gotActivities();
		//Refresh the minus button state:
		this.changeList();
		//Push updates to the db (pass true to have it perform the setting!):
		this.saveActivities(true);
	},
	//Utility function that actually removes the item:
	_removeItem: function(inIndex) {
		this.activitiesArray.splice(inIndex, 1);
	},
	
	//Triggered when the panel is viewed:
	onViewed: function(cat){
		this.category = cat;
		this.store = new Lawnchair({name: "frequency"}, enyo.bind(this, function(store){
			store.get("activities", enyo.bind(this, function(act){
				this.inited = true;
				this.gotActivities(act.options);
			}));
		}));
	},
	
	//Sets activity object if it's passed, and generates the list:
	gotActivities: function(act){
		if(act){
			this.activities = act;
			this.activitiesArray = this.activities[this.category];
		}
		this.$.act.setCount(this.activitiesArray.length);
		this.$.act.reset();
	},
	
	//Show/Hide the remove button:
	changeList: function(){
		if(this.inited){
			var s = this.$.act.getSelection();
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
	    var data = this.activitiesArray[inEvent.index];
	    // setup the controls for this item.
	    this.$.name.setContent(data);
	    this.$.item.addRemoveClass("item-selected", inSender.isSelected(inEvent.index));
	},
	
	//Go back to category list:
	back: function(){
		this.bubble("onActivityBack");
	}
});