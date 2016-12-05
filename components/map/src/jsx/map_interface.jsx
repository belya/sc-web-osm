var MapInterface = React.createClass({
  propTypes: {
    questions: React.PropTypes.array
  },

  componentDidMount: function() {
    this.initChosenListener();
    this.initObjectsListener();
  },

  initChosenListener: function() {
    MapStore.on('change:chosen', (chosen) => {
      this.setState({chosen: chosen});
    });
  },

  initObjectsListener: function() {
    MapStore.on('change:objects', (objects) => {
      this.setState({objects: Object.values(objects)});
    });
  },

  getInitialState: function() {
    return {
      objects: MapStore.objects,
      chosen: MapStore.chosen
    };
  },

  onListClick: function() {
    fluxify.doAction('resetChosen');
  },

  onClick: function(object) {
    fluxify.doAction('chooseObject', object);
  },

  onAgentParamsChange: function(params) {
    console.log(params)
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
        <Map objects={this.state.objects} chosen={this.state.chosen} onMarkerClick={this.onClick}/>
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
