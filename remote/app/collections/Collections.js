$(function() {

  App.Collections.Collections = Backbone.Collection.extend({

    url: "http://192.168.0.111:5984/hubble/_design/hubble-server/_view/Collections?include_docs=true",

    parse: function(response) {
      var docs = _.map(response.rows, function(row) {
        return row.doc
      })
      return docs
    },
     
    model: App.Models.Collection,

    comparator: function(model) {
      var title = model.get('name')
      if (title) return title.toLowerCase()
    },


  })

})
