$(function() {

  App = new (Backbone.View.extend({

    Models: {},
    Views: {},
    Collections: {},

    events: {
      'click a': function(e){
        e.preventDefault()
        Backbone.history.navigate(e.target.pathname, {trigger: true})
      }
    },

    template: _.template('<div id="app"></div>'),

    render: function(){
      this.$el.html(this.template());
    },

    start: function(){


      var mic = Pouch('mic')
      mic.post({title: 'mic check'}, function(err, res) {
        //$("#app").html(JSON.stringify(res))
        console.log(JSON.stringify(res))
        console.log(err)

      }) 

      // Set the initial collection
      App.setPouch('hubble')



      console.log("MIC Ch3ck")


      // Start the Router
      Backbone.history.start({pushState: false})
    },

    setPouch: function(name) {
      Backbone.sync = BackbonePouch.sync({
        db: Pouch(name),
        fetch: 'query'
      })
      App.currentPouch = name
    }

  }))

})