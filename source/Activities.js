enyo.kind({
	name: "freq.activities",
	kind: "FittableRows",
	activities: {},
	components: [
		{kind: "onyx.Toolbar", name: "Header", layoutKind: "FittableColumnsLayout", components: [
			{content: "Activity Categories", name: "HeaderContent"},
			{fit: true},
			{kind: "onyx.TouchButton", content: "Back", ontouchtap: "back"}
		]},
		{kind: "Panels", name: "panels", fit: true, draggable: false, animate: false, components: [
			{kind: "List", name: "act", count: 0, onSetupItem: "setupItem", components: [
		        {kind: "onyx.SwipeableItem", onDelete: "deleteRow", ontap: "selectRow", components: [
					{name: "item", classes: "item enyo-border-box", components: [
						{name: "name"}
					]}
				]}
		    ]},
		    {content: "Activities List!"}
		]},
		{kind: "onyx.Toolbar", name: "footer", layoutKind: "FittableColumnsLayout", components: [
			{fit: true},
			{kind: "onyx.IconButton", src: "assets/menu-icon-add.png", ontap: "addCategory", classes: "onyx-icon-right", style: "height: 32px; width: 150px;"}
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
	selectRow: function(){
		this.$.panels.setIndex(1);
		this.$.HeaderContent.setContent("Activities");
		this.$.Header.reflow();
	},
	
	back: function(){
		if(this.$.panels.getIndex() === 0){
			this.bubble("onView", {name: "home"});
		}else{
			this.$.panels.setIndex(0);
			this.$.HeaderContent.setContent("Activity Categories");
			this.$.Header.reflow();
		}
	}
});