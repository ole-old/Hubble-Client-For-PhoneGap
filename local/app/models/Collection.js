$(function() {

  App.Models.Collection = Backbone.Model.extend({
    defaults: {
      kind: 'collection'
    },

    replicate: function () {
      console.log(JSON.stringify(this))
      var remote = this.get('remote')
      var local = this.get('local')
      console.log('sync started started for ' + local + ' <-> ' + remote)

      // Pull
      this.trigger('pulling')
      Pouch.replicate(remote, local, function(err, doc) {
        console.log('pull replication complete for ' + local + " <- " + remote)

        /*
        var db = new Pouch(local)
        db.get('whoami', function(err, doc) {
          console.log(JSON.stringify(doc))
        })
        // Push
        this.trigger('push')
        Pouch.replicate(local, remote, function(err, doc) {
          console.log('push replication complete for ' + local + ' -> ' + remote)
        })   
        */
        
      })


    }

  })

})