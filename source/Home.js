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