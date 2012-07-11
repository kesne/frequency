enyo.kind({
	name: "freq.home",
	kind: "FittableRows",
	components: [
		{kind: "onyx.Toolbar", content: "Frequency Study"},
		{fit: true, components: [
			{style: "padding: 20px", components: [
				{kind: "onyx.TouchButton", content: "Employees", ontouchtap: "employees", classes: "onyx-button-dark homeButton"},
				{tag: "br"},{tag: "br"},
				{kind: "onyx.TouchButton", content: "Activities", ontouchtap: "activities", classes: "onyx-button-dark homeButton"},
				{tag: "br"},{tag: "br"},
				{kind: "onyx.TouchButton", content: "Manage Studies", ontouchtap: "studies", classes: "onyx-button-dark homeButton"},
				{tag: "br"},{tag: "br"},{tag: "br"},{tag: "br"},
				{kind: "onyx.TouchButton", content: "Perform a Study", ontouchtap: "buttonPress", classes: "homeButton", style: "background-color: #1E6B00; color: #F2F2F2;"}
			]}
		]}
	],
	employees: function(){
		this.bubble("onView", {name: "employees"});
	},
	activities: function(){
		this.bubble("onView", {name: "activities"});
	},
	studies: function(){
		this.bubble("onView", {name: "studies"})
	}
});