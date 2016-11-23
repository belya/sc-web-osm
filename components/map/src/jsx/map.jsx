var Map = React.createClass({
  propTypes: {
    objects: React.PropTypes.array,
    chosen: React.PropTypes.object,
    onMarkerClick: React.PropTypes.func,
  },

  createMap: function() {
    this.map = new L.Map('map', {zoomControl: false});
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 17});
    this.map.addLayer(osm);
  },

  fixZoomControls: function() {
    new L.control.zoom({position: 'bottomright'}).addTo(this.map);
  },

  clearMap: function() {
    this.map.removeLayer(this.markers);
  },

  addMarkersToMap: function() {
    var markers = [];
    var onMarkerClick = this.props.onMarkerClick;
    this.props.objects.map(function(object) {
      if (object.geojson) {
        var marker = L.geoJSON(object.geojson).on('click', () => onMarkerClick(object));
        markers.push(marker);
      }
    });
    this.markers = L.featureGroup(markers); 
    this.markers.addTo(this.map);
    this.map.fitBounds(this.markers.getBounds());
  },

  componentDidMount: function() {
    this.createMap();
    this.addMarkersToMap();
    this.fixZoomControls();
  },

  setCenter: function() {
    if (this.props.chosen && this.props.chosen.geojson) 
      this.map.fitBounds(L.geoJSON(this.props.chosen.geojson).getBounds());
  },

  render: function() {
    this.setCenter();
    return (
      <div id="map" style={{position: "absolute", top: "0px", left: "0px", width: "100%", height: "100%"}}></div>
    );
  }
});
