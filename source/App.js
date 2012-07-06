enyo.kind({
	name: "App",
	fit: true,
	classes: "onyx",
	kind: "FittableRows",
	//Generic Events:
	handlers: {
		onHome: "goHome"
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
			{kind: "freq.Home", onStudyAssets: "viewAssets"},
			{kind: "freq.Assets"}
		]}
	],
	goHome: function(){
		this.$.Nav.setIndex(0);
	},
	viewAssets: function(){
		this.$.Nav.setIndex(1);
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
			{kind: "onyx.Button", content: "Study Assets", ontap: "studyAssets", classes: "big-button onyx-button-dark", style: "width: 100%"},
			{tag: "br"},{tag: "br"},
			{kind: "onyx.Button", content: "Create A Study", ontap: "createStudy", classes: "big-button onyx-button-dark", style: "width: 100%"},
			{tag: "br"},{tag: "br"},
			{tag: "br"},{tag: "br"},
			{kind: "onyx.Button", content: "Perform A Study", ontap: "performStudy", classes: "big-button onyx-affirmative", style: "background-color: #236300; width: 100%;"}
		]}
	],
	studyAssets: function(){
		this.bubble("onStudyAssets");
	}
});


enyo.kind({
	name: "freq.Assets",
	kind: "FittableRows",
	components:[
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
			{kind: "onyx.Button", content: "Back", ontap: "goBack"},
			{content: "Categories", style: "text-align: center; text-indent: -50px;", fit: true},
			{kind: "onyx.IconButton", src: "assets/menu-icon-add.png", style: "height: 32px"}
		]},
		{kind: "List", fit: true, name: "Cat", onSetupItem: "setupItem", components: [
			{name: "name"}
		]}
	],
	
	rendered: function(){
		this.inherited(arguments);
		this.$.Cat.setCount(100);
	},
	
	setupItem: function(inSender, inEvent){
		this.$.name.setContent(inEvent.index);
	},
	
	goBack: function(){
		this.bubble("onHome");
	}
});

