var MapInterface = React.createClass({
  propTypes: {
    questions: React.PropTypes.array,
    store: React.PropTypes.object
  },

  componentDidMount: function() {
    this.cleanModel();
    this.initChosenListener();
    this.initObjectsListener();
  },

  cleanModel: function() {
    fluxify.doAction('clean');
  },

  initChosenListener: function() {
    this.props.store.on('change:chosen', (chosen) => {
      this.setState({chosen: chosen});
    });
  },

  initObjectsListener: function() {
    this.props.store.on('change:objects', (objects) => {
      this.setState({objects: Object.values(objects)});
    });
  },

  getInitialState: function() {
    return {
      objects: Object.values(this.props.store.objects),
      chosen: this.props.store.chosen
    };
  },

  onListClick: function() {
    fluxify.doAction('resetChosen');
  },

  onClick: function(object) {
    fluxify.doAction('chooseObject', object);
  },

  onMapClick: function(coordinates) {
    fluxify.doAction('importObject', coordinates);
  },

  //TODO remove hard-coded question
  onAgentParamsChange: function(params) {
    SCWeb.core.Main.doCommand(MapKeynodes.get('ui_menu_file_for_finding_persons'), [this.state.chosen.id]);
  },

  createViewer: function() {
    if (this.state.chosen)
      return <Article object={this.state.chosen} onListClick={this.onListClick}/>
    else
      return <List objects={this.state.objects} onArticleClick={this.onClick}/>
  },

  render: function() {
    return (
      <div>
        <Map objects={this.state.objects} chosen={this.state.chosen} onMarkerClick={this.onClick} onMapClick={this.onMapClick}/>
        <div className="row" style={{margin: "10px"}}>
          <div className="col-sm-5 well">
            <div className="form-group">
              <QuestionLine onChange={this.onAgentParamsChange} questions={this.props.questions}/>
            </div>
            <Timeline onTimeChange={this.onAgentParamsChange}/>
            {this.createViewer()}
          </div>
        </div>
      </div>
    );
  }
});
