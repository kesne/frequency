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
	create: function(){
		this.inherited(arguments);
		this.store = new Lawnchair({name: "frequency"}, function(store){
			store.exists('employees', function(exists) {
				if(exists === false){
					console.log("Employees store doesn't exist, creating it.");
					store.save({key: "employees", options: []})
				}
			});
			
			store.exists('activities', function(exists) {
				if(exists === false){
					console.log("Activities store doesn't exist, creating it.");
					store.save({key: "activities", options: []})
				}
			});
			
			store.exists('studies', function(exists) {
				if(exists === false){
					console.log("Studies store doesn't exist, creating it.");
					store.save({key: "studies", options: []})
				}
			});
			
			store.exists('records', function(exists) {
				if(exists === false){
					console.log("Records store doesn't exist, creating it.");
					store.save({key: "records", options: []})
				}
			});
		});
	},
	manageView: function(inSender, inEvent){
		var p = this.$.panels.getPanels();
		var index = 0;
		for(var x in p){
			if(p.hasOwnProperty(x)){
				if(p[x].kind.split(".")[1] === inEvent.name){
					this.$.panels.setIndex(index);
					if(p[x].onViewed && typeof(p[x].onViewed) === "function"){
						p[x].onViewed();
					}
					break;
				}
			}
			index++;
		}
	}
});