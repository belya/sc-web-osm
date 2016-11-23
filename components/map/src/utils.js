MapUtils = {
  getGeoJSON: function(query, callback) {
    $.ajax({
      method: 'POST',
      //TODO Enable async
      async: false,
      url: "http://overpass-api.de/api/interpreter",
      data: {
        data: this.createQuery(query)
      },
      success: function(data) {
        callback(osmtogeojson(data));
      }
    })
  },
  createQuery: function(query) {
    return '[out:json];(' + query + '); out body; >; out skel qt;'
  }
}