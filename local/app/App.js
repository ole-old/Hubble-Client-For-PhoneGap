$(function() {

  App = new (Backbone.View.extend({

    Models: {},
    Views: {},
    Collections: {},

    el: '#app',

    template: _.template($("#app-template").html()),

    render: function(){
      this.$el.html(this.template());
    },

    start: function(){
      App.sync()
      App.on('syncDone', function() {
        App.setPouch('hubble')
        this.render()
        Backbone.history.start({pushState: false})
      })
    },

    setPouch: function(name) {
      Backbone.Model.prototype.idAttribute = '_id'
      Backbone.sync = BackbonePouch.sync({
        db: Pouch(name),
        fetch: 'query'
      })
      App.currentPouch = name
    }


    sync: function() {
      var db = new Pouch('hubble')
      db.allDocs({include_docs: true}, function(err, response) {
        console.log("All docs in Hubble database:")
        console.log(JSON.stringify(response))
        var numberOfCollections = response.rows.length
        var count = 0
        _.each(response.rows, function(row) {
          console.log("Replications go " + row.doc.local + " <-- " + row.doc.remoteß)
          Pouch.replicate(row.doc.remote, row.doc.local, function(err,changes) {
            console.log("REPLICATION DONE")
            console.log(JSON.stringify(err))
            console.log(JSON.stringify(changes))
            count++
            if(count == numberOfCollections) {
              App.trigger('syncDone')
            }
          })
        })
      }) 
    }


  }))
  
})