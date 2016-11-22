/* --- src/article.js --- */
var Article = React.createClass({displayName: "Article",
  propTypes: {
    object: React.PropTypes.object,
    onListClick: React.PropTypes.func
  },

  render: function() {
    return (
      React.createElement("div", {className: "panel panel-default"}, 
        React.createElement("div", {className: "panel-body", style: {overflowY: "auto", maxHeight: "300px"}}, 
          React.createElement("h4", null, this.props.object.title), 
          React.createElement("img", {src: this.props.object.image, className: "img-thumbnail"}), 
          React.createElement("p", {className: "list-group-item-text"}, this.props.object.description)
        ), 
        React.createElement("div", {className: "panel-footer"}, 
          React.createElement("ul", {className: "nav nav-pills"}, 
            React.createElement("li", {className: "active"}, React.createElement("a", {href: "#"}, "Перейти к статье")), 
            React.createElement("li", null, React.createElement("a", {href: "#", onClick: this.props.onListClick}, "Назад"))
          )
        )
      )
    );
  }
});


/* --- src/list.js --- */
var List = React.createClass({displayName: "List",
  propTypes: {
    objects: React.PropTypes.array,
    onArticleClick: React.PropTypes.func,
  },

  initReadmore: function() {
    $(this.refs.list)
    .find('.list-group-item-text')
    .readmore({
      collapsedHeight: 60,
      moreLink: '<a href="#">Читать все</a>',
      lessLink: '<a href="#">Скрыть</a>'
    });
  },

  componentDidMount: function() {
    this.initReadmore();
  },

  render: function() {
    return (
      React.createElement("div", {className: "list-group", ref: "list", style: {overflowY: "auto", maxHeight: "300px"}}, 
        
          this.props.objects.map(function(object, index) {
            return (
              React.createElement("a", {key: index, href: "#", className: "list-group-item", onClick: () => this.props.onArticleClick(object)}, 
                React.createElement("h4", {className: "list-group-item-heading"}, object.title), 
                React.createElement("div", {className: "row"}, 
                  React.createElement("div", {className: "col-sm-5"}, 
                    React.createElement("img", {src: object.image, className: "img-thumbnail"})
                  ), 
                  React.createElement("div", {className: "col-sm-7"}, 
                    React.createElement("p", {className: "list-group-item-text"}, object.description)
                  )
                )
              )
            );
          }, this
        )
      )
    );
  }
});


/* --- src/map.js --- */
var Map = React.createClass({displayName: "Map",
  propTypes: {
    objects: React.PropTypes.array,
    chosen: React.PropTypes.object,
    onMarkerClick: React.PropTypes.func,
  },

  getInitialState: function() {
    return {
      map: null,
      markers: []
    }
  },

  createMap: function() {
    this.state.map = new L.Map('map', {zoomControl: false});
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 20});
    this.state.map.addLayer(osm);
  },

  fixZoomControls: function() {
    new L.control.zoom({position: 'bottomright'})
      .addTo(this.state.map);
  },

  clearMap: function() {
    //TODO clear array
    var map = this.state.map;
    this.state.markers.map(function(marker) {
      map.removeMarker(marker);
    })
  },

  addMarkersToMap: function() {
    var state = this.state;
    var onMarkerClick = this.props.onMarkerClick;
    this.props.objects.map(function(object) {
      var marker = new L.Marker([object.lat, object.lng])
        .addTo(state.map)
        .on('click', () => onMarkerClick(object));
      state.map.setView(new L.LatLng(object.lat, object.lng), 18);
      state.markers.push(marker);
    })
  },

  componentDidMount: function() {
    this.createMap();
    this.addMarkersToMap();
    this.fixZoomControls();
  },

  setCenter: function() {
    if (this.props.chosen) 
      this.state.map.setView(new L.LatLng(this.props.chosen.lat, this.props.chosen.lng), 18);
  },

  render: function() {
    this.setCenter();
    return (
      React.createElement("div", {id: "map", style: {position: "absolute", top: "0px", left: "0px", width: "100%", height: "100%"}})
    );
  }
});


/* --- src/map_interface.js --- */
var MapInterface = React.createClass({displayName: "MapInterface",
  propTypes: {
    objects: React.PropTypes.array,
    questions: React.PropTypes.array
  },

  getInitialState: function() {
    return {chosen: null};
  },

  onListClick: function() {
    this.setState({chosen: null})
  },

  onClick: function(object) {
    this.setState({chosen: object})
  },

  onAgentParamsChange: function(time) {
    console.log(time)
  },

  createViewer: function() {
    if (this.state.chosen)
      return React.createElement(Article, {object: this.state.chosen, onListClick: this.onListClick})
    else
      return React.createElement(List, {objects: this.props.objects, onArticleClick: this.onClick})
  },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(Map, {objects: this.props.objects, chosen: this.state.chosen, onMarkerClick: this.onClick}), 
        React.createElement("div", {className: "row", style: {margin: "10px"}}, 
          React.createElement("div", {className: "col-sm-5 well"}, 
            React.createElement("div", {className: "form-group"}, 
              React.createElement(QuestionLine, {onChange: this.onAgentParamsChange, questions: this.props.questions})
            ), 
            React.createElement(Timeline, {onTimeChange: this.onAgentParamsChange}), 
            this.createViewer()
          )
        )
      )
    );
  }
});


/* --- src/question_line.js --- */
var QuestionLine = React.createClass({displayName: "QuestionLine",
  propTypes: {
    questions: React.PropTypes.array,
    onChange: React.PropTypes.func
  },

  getInitialState: function() {
    return {question: ''}
  },

  matchStateToTerm: function(state, value) {
    return state.toLowerCase().indexOf(value.toLowerCase()) !== -1;
  },

  sortStates: function(a, b, value) {
    return a.toLowerCase().indexOf(value.toLowerCase()) > b.toLowerCase().indexOf(value.toLowerCase()) ? 1 : -1;
  },

  onChange: function(value, notify) {
    if (notify)
      this.props.onChange({question: value});
    this.setState({question: value});
  },

  render: function() {
    return (
      React.createElement(ReactAutocomplete, {
        wrapperStyle: {display: 'block'}, 
        inputProps: {placeholder: "Задайте вопрос", className: "form-control"}, 
        menuStyle: {
          zIndex: "1000000",
          borderRadius: '3px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
          background: '#ffffff',
          border: '1px solid #dddddd',
          color: '#555555',
          padding: '2px 0',
          position: 'fixed',
          overflow: 'auto',
          maxHeight: '50%'
        }, 
        items: this.props.questions, 
        value: this.state.question, 
        shouldItemRender: this.matchStateToTerm, 
        sortItems: this.sortStates, 
        onChange: (event, value) => this.onChange(value), 
        onSelect: value => this.onChange(value, true), 
        getItemValue: (item) => item, 
        renderItem: (item, isHighlighted) => (
          React.createElement("div", {className: "question"}, item)
        )}
      )
    );
  }
});


/* --- src/timeline.js --- */
var Timeline = React.createClass({displayName: "Timeline",
  propTypes: {
    year: React.PropTypes.number,
    onTimeChange: React.PropTypes.func
  },

  initSlider: function() {
    this.slider = $(this.refs.slider)
    .slider({
      formatter: function(value) {
        return 'Год: ' + value;
      }
    })
  },

  initSliderCallback: function() {
    var self = this;
    this.slider.on('slideStop', function(value) {
      self.props.onTimeChange({year: value})
    });
  },

  componentDidMount: function() {
    this.initSlider();
    this.initSliderCallback();
  },

  render: function() {
    return (
      React.createElement("div", {className: "form-group row", style: {margin: "10px"}}, 
        React.createElement("div", {className: "text-left col-xs-2"}, "1067"), 
        React.createElement("div", {className: "text-center col-xs-8"}, 
          React.createElement("input", {ref: "slider", type: "text", "data-slider-min": "1067", "data-slider-max": "2016", "data-slider-step": "1", "data-slider-value": "1887"})
        ), 
        React.createElement("div", {className: "text-right col-xs-2"}, "2016")
      )
    );
  }
});


/* --- src/map-component.js --- */
Map.Component = {
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
    this.initCallback();
    this.createReactComponent();
    this.sandbox.updateContent();
};

MapViewer.prototype.initCallback = function() {
    this.sandbox.eventDataAppend = $.proxy(this.receiveData, this);
}

MapViewer.prototype.createReactComponent = function() {
    var mapInterface = React.createElement(MapInterface, {objects: this.getObjects(), questions: this.getQuestions()});
    ReactDOM.render(mapInterface, document.getElementById(this.sandbox.container));
}

MapViewer.prototype.eventStructUpdate = function(added, contour, arc) {
    var deferred = new jQuery.Deferred();
    //TODO receive json from KB
    deferred.resolve();
    return deferred.promise();
};

MapViewer.prototype.getObjects = function() {
    return [
      {
        "title": "Здание мужского базилианского монастыря",
        "image": "http://farm3.static.flickr.com/2153/2842876054_ea95f1ab31_o.jpg",
        "description": "Корпус мужского базилианского монастыря начал строиться в 1617 году и принадлежал ордену униатов. В 1795 году униатские монастыри были закрыты, а в здании разместилась Минская мужская гимназия и Присутственные места.",
        "lat": 53.903, 
        "lng": 27.557
      }, 
      {
        "title": "Здание женского базилианского монастыря",
        "image": "http://minsk-old-new.com/Image/exkursia/x-051-Muzic-School-1.jpg",
        "description": "Строительство здания началось в 1641 году по фундации трокской кастелянши Зузаны Гансевской. Во время его строительства были использованы подвалы и стены тех жилых зданий, которые находились на этом месте ранее. В здании располагался монастырь Святого духа базилианок.",
        "lat": 53.90373, 
        "lng": 27.55768
      },
      {
        "title": "Здание Минского железнодорожного вокзала",
        "image": "http://history.rw.by/uploads/stations/1300x550_tt/minsk_sh.jpg",
        "description": "Минск-Пассажирский — пассажирский железнодорожный терминал, расположенный в столице Белоруссии Минске. Главный железнодорожный вокзал города.",
        "lat": 53.890572, 
        "lng": 27.550837
      },
      {
        "title": "Дом Монюшко",
        "image": "http://problr.by/assets/components/phpthumbof/cache/43900cd9a6686a1a1c1bd735627ed5bd.5404702a2b75d3bc16912ae5f4655747.jpg",
        "description": "Здание было построено в 1797 году. В 20-х годах XIXвека дом принадлежал Климкевичу, а в начале XXвека – М. Френкелю. Первоначально здание было двухэтажным. Третий этаж был пристроен в начале XXвека.",
        "lat": 53.903776, 
        "lng": 27.558306
      }
    ]
};

MapViewer.prototype.getQuestions = function() {
    return [
      "Как выглядел объект в 2016 году?",
      "Какая организация здесь располагается?",
      "Какие здания находятся в радиусе 1000м?",
      "Как сюда пройти?"
    ]
};


SCWeb.core.ComponentManager.appendComponentInitialize(Map.Component);


