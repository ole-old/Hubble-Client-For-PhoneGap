$(function() {

  App.Collections.Collections = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: App.Models.Collection,

    // Include collections in Map Reduce response. Order by `url`.
    pouch: {
      options: {
        query: {
          fun: {
            map: function(doc) {
              if (doc.kind === 'collection') {
                emit(doc._id, null)
              }
            }
          }
        },
        changes: {
          filter: function(doc) {
            return doc._deleted || doc.kind === 'collection'
          }
        }
      }
    }

  })

})