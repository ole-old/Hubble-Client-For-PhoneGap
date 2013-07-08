$(function() {

  /*
   *
   * Note: "cx" refers to a Hubble Collection. Anywhere "collection" is used, it refers to Backbone Collections.
   */

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
      App.syncCxs()
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
    },

    // Get all Hubble Collections
    getCxs: function() {
      return (!localStorage.Cxs) 
        ? {} 
        : localStorage.Cxs
    },

    // Add a new Hubble Collection
    addCx: function(id, cx) {
      var cxs = App.getCxs()
      cxs[id] = cx
      localStorage.Cxs = cxs
    },

    deleteCx: function(id) {
      var cxs = App.getCxs()
      delete cxs[id]
      localStorage.cxs = cxs
    },

    syncCxs: function() {
      var cxs = App.getCxs()
      console.log("All cx in cxs:")
      console.log(JSON.stringify(cxs))
      var numberOfCollections = cxs.length
      if (numberOfCollections === 0) {
        App.trigger('syncDone')
      }
      var count = 0
      _.each(cxs, function(id, cx) {
        console.log("Replications go " + cx.local + " <-- " + cx.remote)
        Pouch.replicate(cx.remote, cx.local, function(err,changes) {
          console.log("REPLICATION DONE")
          console.log(JSON.stringify(err))
          console.log(JSON.stringify(changes))
          count++
          if(count == numberOfCollections) {
            App.trigger('syncDone')
          }
        })
      }) 
    }


  }))
  
})