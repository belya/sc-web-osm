MapStore = {
  create: function() {
    return fluxify.createStore({
      id: this.generateId(),
      initialState: {
        objects: [],
        chosen: null
      },
      actionCallbacks: {
        changeObject: function(updater, object) {
          var objects = Object.assign({}, this.objects);
          objects[object.id] = Object.assign({}, objects[object.id], object);
          updater.set({objects: objects});
        },
        chooseObject: function(updater, object) {
          updater.set({chosen: object})
        },
        resetChosen: function(updater) {
          updater.set({chosen: null})
        }
      }
    });
  },

  generateId: function() {
    var text = "MapStore";
    
    for( var i=0; i < 10; i++ )
        text += Math.floor(Math.random() * 15).toString(16);

    return text;
  }
}