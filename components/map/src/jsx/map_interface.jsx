var MapInterface = React.createClass({
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
      return <Article object={this.state.chosen} onListClick={this.onListClick}/>
    else
      return <List objects={this.props.objects} onArticleClick={this.onClick}/>
  },

  render: function() {
    return (
      <div>
        <Map objects={this.props.objects} chosen={this.state.chosen} onMarkerClick={this.onClick}/>
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
