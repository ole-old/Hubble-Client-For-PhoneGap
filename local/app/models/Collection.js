$(function() {

  App.Models.Collection = Backbone.Model.extend({
    defaults: {
      kind: 'collection'
    },

    replicate: function () {

      console.log('sync started started for ' + this.get('collectionId'))

      // Pull
      this.trigger('pulling')
      Pouch.replicate(this.get('collectionId'), 'http://' + this.get('url'), {
        continuous: false,
        complete: function(resp) {
          console.log('pull replication complete for ' + this.get('collectionId'))
          this.trigger('pullComplete')
       
          // Push
          this.trigger('push')
          Pouch.replicate('http://' + this.get('url'), this.get('collectionId'), {
            continuous: false,
            complete: function(resp) {
              console.log('push replication complete for ' + this.get('collectionId'))
              this.trigger('pushComplete')
            }
          })   

        }
      })


    }

  })

})