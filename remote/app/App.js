$(function() {


  App = new (Backbone.View.extend({


    Models: {},
    Views: {},
    Collections: {},
    Vars: {}, // A place to persist variables in the session

    el: "body",

    template: $("#template-app").html(),

    events: {
      // For the x button on the modal
      "click .close" : "closeModal"
    },

    start: function(){
      // Default database
      window.thisDb = document.URL.split("/")[3]
      this.$el.html(_.template(this.template))
      Backbone.history.start({pushState: false})
    },

    closeModal: function() {
      $("#modal").modal("hide")
    },

    sendResource: function(sourceDatabase, targetDatabase, sourceId, target) {
      $.couch.replicate(
        sourceDatabase, 
        targetDatabase, 
        {
          success: function() {
            target.trigger('received')
          },
          error: function(err) {
            alert('Woops, had a problem sending that.')
          }
        },
        {
          doc_ids: [ sourceId ]
        }
      )
    }


  }))


})