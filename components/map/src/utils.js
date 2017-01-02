var MapUtils = {
  empty: function(geojson) {
    return !geojson || !geojson.features || !geojson.features.length;
  },
  extractor: function(contour, arc) {
    return {
      extract: function() {
        window.sctpClient.get_arc(arc)
        .done((nodes) => {
          this.checkTerrainObject(nodes[1])
          .done(() => {
            this.extractIdentifier(nodes[1]);
            this.extractDescription(nodes[1]);
            this.extractImage(nodes[1]);
            this.extractCoordinates(nodes[1]);
          })
        });
      },
      checkTerrainObject: function(object) {
        var deferred = $.Deferred();
        window.sctpClient.iterate_constr(
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                        [
                          object,
                          sc_type_arc_common | sc_type_const,
                          sc_type_link,
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("nrel_osm_query")
                        ])
        ).done(function(results) {
          if (results.exist())
            deferred.resolve();
          else
            deferred.reject();
        })
        .fail(deferred.reject);
        return deferred.promise();
      },
      extractIdentifier: function(object) {
        window.sctpClient.iterate_constr(
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                        [
                          object,
                          sc_type_arc_common | sc_type_const,
                          sc_type_link,
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("nrel_main_idtf")
                        ], {"identifier": 2}),
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_F,
                        [
                          MapKeynodes.get("lang_ru"),
                          sc_type_arc_pos_const_perm,
                          "identifier"
                        ])
        ).done(function(results) {            
          window.sctpClient.get_link_content(results.get(0, "identifier"))
          .done(function (title) {
            fluxify.doAction('changeObject', {id: object, title: title});   
          });
        });
      },
      extractImage: function(object) {
        window.sctpClient.iterate_constr(
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5A_A_F_A_F,
                        [
                          sc_type_node,
                          sc_type_arc_pos_const_perm,
                          object,
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("rrel_key_sc_element")
                        ], {"image_node": 0}),
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_F,
                        [
                          MapKeynodes.get("sc_illustration"),
                          sc_type_arc_pos_const_perm,
                          "image_node"
                        ]),
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5A_A_F_A_F,
                        [
                          sc_type_node,
                          sc_type_arc_common | sc_type_const,
                          "image_node",
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("nrel_sc_text_translation")
                        ], {"translation_node": 0}),
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                        [
                          "translation_node",
                          sc_type_arc_pos_const_perm,
                          sc_type_link,
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("rrel_example")
                        ], {"image": 2})
        ).done(function(results) {            
          var image = "api/link/content/?addr=" + results.get(0, "image");
          fluxify.doAction('changeObject', {id: object, image: image});   
        });
      },
      extractDescription: function(object) {
        window.sctpClient.iterate_constr(
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5A_A_F_A_F,
                        [
                          sc_type_node,
                          sc_type_arc_pos_const_perm,
                          object,
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("rrel_key_sc_element")
                        ], {"description_node": 0}),
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_F,
                        [
                          MapKeynodes.get("sc_definition"),
                          sc_type_arc_pos_const_perm,
                          "description_node"
                        ]),
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5A_A_F_A_F,
                        [
                          sc_type_node,
                          sc_type_arc_common | sc_type_const,
                          "description_node",
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("nrel_sc_text_translation")
                        ], {"translation_node": 0}),
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                        [
                          "translation_node",
                          sc_type_arc_pos_const_perm,
                          sc_type_link,
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("rrel_example")
                        ], {"description": 2}),
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_F,
                        [
                          MapKeynodes.get("lang_ru"),
                          sc_type_arc_pos_const_perm,
                          "description"
                        ])
        ).done(function(results) {            
          window.sctpClient.get_link_content(results.get(0, "description"))
          .done(function (description) {
            fluxify.doAction('changeObject', {id: object, description: description});   
          });
        });
      },
      extractCoordinates: function(object) {
        var self = this;
        window.sctpClient.iterate_constr(
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                        [
                          object,
                          sc_type_arc_common | sc_type_const,
                          sc_type_link,
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("nrel_osm_query")
                        ], {"query": 2})
        ).done(function(results) {
          window.sctpClient.get_link_content(results.get(0, "query"))
          .done((query) => {
            self.extractGeoJSON(object, query);   
          });
        });
      },
      extractGeoJSON: function(id, query) {
        $.ajax({
          method: 'POST',
          url: "http://overpass-api.de/api/interpreter",
          data: {
            data: this.getOSMQuery(query)
          },
          success: function(data) {
            fluxify.doAction('changeObject', {id: id, geojson: osmtogeojson(data)});
          }
        })  
      },
      getOSMQuery: function(query) {
        if (/\[out:json\];/.test(query)) return query;
        if (/\([^)]+\);/.test(query)) return '[out:json];' + query + 'out body; >; out skel qt;';
        return '[out:json];(' + query + '); out body; >; out skel qt;';
      }
    }
  }
}