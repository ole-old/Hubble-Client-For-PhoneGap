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
      App.setPouch('hubble')
      this.render()
      Backbone.history.start({pushState: false})
    },

    setPouch: function(name) {
      Backbone.Model.prototype.idAttribute = '_id'
      Backbone.sync = BackbonePouch.sync({
        db: Pouch(name),
        fetch: 'query'
      })
      App.currentPouch = name
    }

  }))
  
})