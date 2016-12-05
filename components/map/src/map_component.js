MapComponent = {
  ext_lang: 'openstreetmap_view',
  formats: ['format_openstreetmap'],
  struct_support: true,
  factory: function(sandbox) {
    var viewer = new MapViewer(sandbox);
    viewer.init();
    return viewer;
  }
};

MapViewer = function(sandbox) {
  this.sandbox = sandbox;
};

MapViewer.prototype.init = function() {
  var self = this;
  MapKeynodes.init().done(function() {
    self.initCallback();
    self.createReactComponent();
    self.sandbox.updateContent();
  });
};

MapViewer.prototype.initCallback = function() {
  this.sandbox.eventStructUpdate = $.proxy(this.eventStructUpdate, this);
}

MapViewer.prototype.createReactComponent = function() {
  var mapInterface = React.createElement(MapInterface, {questions: this.getQuestions()});
  ReactDOM.render(mapInterface, document.getElementById(this.sandbox.container));
}

MapViewer.prototype.eventStructUpdate = function(added, contour, arc) {
  if (added) MapUtils.extractor(contour, arc).extract();
};

MapViewer.prototype.getQuestions = function() {
  return [
    "Как выглядел объект в 2016 году?",
    "Какая организация здесь располагается?",
    "Какие здания находятся в радиусе 1000м?",
    "Как сюда пройти?"
  ]
};


SCWeb.core.ComponentManager.appendComponentInitialize(MapComponent);
