var MapKeynodes = {
  
}

MapKeynodes.IDENTIFIERS = [
  'concept_terrain_object',
  'concept_building',
  'nrel_geographical_location',
  'nrel_WGS_84_translation',
  'concept_coordinate', 
  'nrel_WGS_84_translation',
  'rrel_latitude',
  'rrel_longitude',
  'nrel_value',
  'nrel_main_idtf',
  'lang_ru',
  'rrel_key_sc_element',
  'sc_illustration',
  'sc_definition',
  'nrel_sc_text_translation',
  'rrel_example',
  'nrel_osm_query'
];

MapKeynodes.init = function() {
  var deferred = $.Deferred();
  var self = this;
  SCWeb.core.Server.resolveScAddr(MapKeynodes.IDENTIFIERS, function (keynodes) {
    self.keynodes = keynodes;
    deferred.resolve();
  });
  return deferred;
};


MapKeynodes.get = function(identifier) {
  return this.keynodes[identifier];
};