var List = React.createClass({
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
      <div className="list-group" ref="list" style={{overflowY: "auto", maxHeight: "300px"}}>
        {
          this.props.objects.map(function(object, index) {
            return (
              <a key={index} href="#" className="list-group-item" onClick={() => this.props.onArticleClick(object)}>
                <h4 className="list-group-item-heading">{object.title}</h4>
                <div className="row">
                  <div className="col-sm-5">
                    <img src={object.image} className="img-thumbnail"></img>
                  </div>
                  <div className="col-sm-7">
                    <p className="list-group-item-text">{object.description}</p>
                  </div>
                </div>
              </a>
            );
          }, this
        )}
      </div>
    );
  }
});
