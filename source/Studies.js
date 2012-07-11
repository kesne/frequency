enyo.kind({
	name: "freq.studies",
	kind: "FittableRows",
	handlers: {
		onNewBack: "gotBack"
	},
	components: [
		{kind: "Panels", name: "panels", fit: true, animate: false, draggable: false, components: [
			{kind: "FittableRows", components: [
				{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
					{content: "Studies"},
					{fit: true},
					{kind: "onyx.TouchButton", content: "Back", ontouchtap: "back"}
				]},
				{kind: "List", onChange: "changeList", name: "studies", fit: true, count: 0, onSetupItem: "setupItem", components: [
			        {kind: "onyx.SwipeableItem", onDelete: "deleteRow", components: [
						{name: "item", classes: "item enyo-border-box", components: [
							{name: "name"}
						]}
					]}
			    ]},
			    {kind: "onyx.Toolbar", name: "footer", layoutKind: "FittableColumnsLayout", components: [
					{fit: true},
					{kind: "onyx.IconButton", src: "assets/menu-icon-add.png", ontap: "newStudy", classes: "onyx-icon-right", style: "height: 32px; width: 150px;"}
				]}
		    ]},
		    {kind: "freq.newstudy", name: "newstudy"}
	    ]}
	],
	
	onViewed: function(){
		this.store = new Lawnchair({name: "frequency"}, enyo.bind(this, function(store){
			store.get("studies", enyo.bind(this, function(studies){
				this.gotStudies(studies.options);
			}));
		}));
	},
	
	gotStudies: function(studies){
		
	},
	
	
	newStudy: function(){
		this.$.newstudy.onViewed();
		this.$.panels.setIndex(1);
	},
	
	
	setupItem: function(){
		
	},
	
	
	gotBack: function(){
		//Update data:
		this.onViewed();
		//Change view:
		this.$.panels.setIndex(0);
	},
	
	back: function(){
		this.bubble("onView", {name: "home"});
	}
});


enyo.kind({
	name: "freq.newstudy",
	kind: "FittableRows",
	studies: {},
	components: [
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
			{content: "Create New Study"},
			{fit: true},
			{kind: "onyx.TouchButton", content: "Back", ontouchtap: "back"}
		]},
		{kind: "Scroller", fit: true, style: "padding: 20px", components: [
			//{content: "Create a new study.", tag: "h3"},
			{kind: "onyx.Groupbox", components: [
				{kind: "onyx.GroupboxHeader", content: "Study Name"},
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", name: "studyName", style: "width: 100%", placeholder: "name..."}
				]}
			]},
			{tag: "br"},
			{kind: "onyx.Groupbox", components: [
				{kind: "onyx.GroupboxHeader", content: "Assets"},
				{kind: "onyx.Button", classes: "groubox-button", layoutKind: "FittableColumnsLayout", components: [
					{content: "Select Employees"},
					{fit: true},
					{content: "None Selected", style: "font-size: 0.8em; color: #666;"}
				]},
				{kind: "onyx.Button", classes: "groubox-button", layoutKind: "FittableColumnsLayout", components: [
					{content: "Select Activities"},
					{fit: true},
					{content: "10 Selected", style: "font-size: 0.8em; color: #666;"}
				]}
			]},
			{tag: "br"},
			{kind: "onyx.Groupbox", components: [
				{kind: "onyx.GroupboxHeader", content: "Study Options"},
				{classes: "groupbox-item", components: [
					{content: "Randomize Employees"},
					{kind: "onyx.ToggleButton", value: true}
				]},
				{classes: "groupbox-item", components: [
					{content: "Operational Interval"},
					{style: "width: 200px;", components: [
						{content: "minutes", tag: "span", style: "float: right; font-size: 0.8em; color: #666; padding-left: 10px;"},
						{kind: "onyx.Input", placeholder: "#", type: "number", attributes: {min: 0}, classes: "enyo-input-decorator onyx-input-decorator", style: "outline: none; border: 1px solid silver; width: 50px; float: right;"},
					]}
				]}
			]},
			{tag: "br"}, {tag: "br"},
			{kind: "onyx.Button", classes: "homeButton", ontap: "createStudy", content: "Create Study", style: "background-color: #1E6B00; color: #F2F2F2;"}
		]},
		{kind: "onyx.Popup", name: "alreadyExists", modal: true, floating: true, centered: true, scrim: true, components: [
			{content: "Error"},
			{content: "A study by that name already exists.", name: "errorCode"}
		]}
	],
	
	onViewed: function(){
		//TODO: Reset all of the fields on view!
		this.store = new Lawnchair({name: "frequency"}, enyo.bind(this, function(store){
			store.get("studies", enyo.bind(this, function(studies){
				this.gotStudies(studies.options);
			}));
		}));
	},
	
	gotStudies: function(studies){
		this.studies = studies;
	},
	
	createStudy: function(){
		var name = this.$.studyName.getValue();
		if(!this.studies[name]){
			this.$.alreadyExists.show();
		}
	},
	
	back: function(){
		this.bubble("onNewBack");
	}
});
