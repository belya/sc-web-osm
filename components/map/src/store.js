var MapStore = fluxify.createStore({
  id: 'MapStore',
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