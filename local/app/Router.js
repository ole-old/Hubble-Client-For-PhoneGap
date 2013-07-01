$(function() {
  App.Router = new (Backbone.Router.extend({

    routes: {
      '': 'collections',
      'collections': 'collections',
      'collections/add/*url': 'collectionAdd',
      'collection/*collectionId': 'collection',
      'sync': 'replicate'
    },

    welcome: function() {
      // do nothing
    },

    collections: function() {
      App.setPouch('hubble')
      if(!App.collections) {
        App.collections  = new App.Collections.Collections
      }
      App.collections.fetch({success: function() {
        App.collectionsView = new App.Views.Collections({collection: App.collections}) 
        App.collectionsView.render()
        App.$el.children('.body').html(App.collectionsView.el)        
      }})

    },

    collectionAdd: function(url) {
      App.setPouch('hubble')

      console.log("Adding collection : " + url)

      var whoamiUrl = "http://" + url + "/whoami"
      console.log(whoamiUrl)
      $.getJSON(whoamiUrl, function(data) {
        console.log("whoami data: " + JSON.stringify(data))

        var remote = 'http://' + url
        var local = url.replace(new RegExp('/', 'g'), '_')
        
        // Create the Collection Model
        var collection = new App.Models.Collection({
          remote: remote,
          local: local,
          name: data.name
        })

        console.log(JSON.stringify(collection))

        // create the new local pouch
        var newPouch = new Pouch(local)

        collection.save()

        collection.on('sync', function(){
          console.log("new collection saved")
          App.trigger('collectionAdded')
          App.Router.navigate("collections", {trigger:true})
        })

      })

    },

    replicate: function() {
      App.collections.each(function(collection) {
        collection.replicate()
      })
    },

    collection: function(collectionId) {
    
      // This will modify PouchBackbone settings so collection fetch from correct Pouch
      
      var collection = new App.Models.Collection({_id: collectionId})
      collection.fetch({success: function(model, response, options) {
        App.setPouch(collection.get('local'))
        console.log("Pouch set to " + collection.get('local'))
      
        var db = Pouch(collection.get('local'))
        db.allDocs({include_docs: true}, function(err, response) {
          console.log(response)
        })
        
        
        App.resources = new App.Collections.Resources()
        App.resources.fetch({success: function() {
          console.log(JSON.stringify(App.resources.models))
          App.resourcesView = new App.Views.Resources({collection: App.resources})
          App.resourcesView.render()
          App.$el.children('.body').html(App.resourcesView.el)
        }})
    
      }})
      
    }


  }))

})