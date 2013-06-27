$(function() {
  App.Router = new (Backbone.Router.extend({

    routes: {
      '': 'pageCollections',
      'collections': 'pageCollections',
      'collections/add/*url': 'collectionsAdd',
      'collection/*collectionName': 'pageCollection',
      'sync': 'replicate'
    },

    pageCollections: function() {
      if(!App.collections) {
        App.collections  = new App.Collections.Collections
      }
      App.collections.fetch({success: function() {
        App.collectionsView = new App.Views.Collections({collection: App.collections}) 
        App.collectionsView.render()
        App.$el.children('.content').html(App.collectionsView.el)        
      }})

    },

    collectionsAdd: function(url) {
      console.log("################# Bar 2")
      console.log("Adding collection : " + url)
       
      $.getJSON("http://" + url + "/whoami", function(data) {
        console.log("whoami data: " + JSON.stringify(data))
        var collection = new App.Models.Collection({url: url, name: data.name})
        collection.save(null, {success: function(){
          console.log("new collection saved")
          App.Router.navigate("collections", {trigger:true})
        }})
      })

    },

    replicate: function() {
      App.collections.each(function(collection) {
        collection.replicate()
      })
    },

    pageCollection: function(collectionName) {
    
      // This will modify PouchBackbone settings so collection fetch from correct Pouch
      App.setPouch(collectionName)

      /*
      var db = Pouch(collectionName)
      db.allDocs({include_docs: true}, function(err, response) {
        console.log(response)
      })
      */
      
      App.resources = new App.Collections.Resources()
      App.resources.fetch({success: function() {
        console.log(App.resources)
        App.resourcesView = new App.Views.Resources({collection: App.resources})
        App.resourcesView.render()
        App.$el.children('.content').html(App.resourcesView.el)
      }})

    }


  }))

})