$(function() {

  App = new (Backbone.View.extend({

    Models: {},
    Views: {},
    Collections: {},

    el: 'body',

    template: _.template('<div id="app"></div>'),

    render: function(){
      this.$el.html(this.template());
    },

    start: function(){

      // Set the initial collection
      App.setPouch('hubble')

      this.render()

      // Start the Router
      Backbone.history.start({pushState: false})
    },

    setPouch: function(name) {
      Backbone.Model.prototype.idAttribute = '_id'
      Backbone.sync = BackbonePouch.sync({
        db: Pouch(name),
        fetch: 'query'
      })
      App.currentPouch = name
    },

    generateGUID: function() {
      var d = new Date()
      return 'test-' + d.getTime()
    },

    testPouch: function() {
      console.log('Running testPouch')
      var testPouch = Pouch(this.generateGUID())
      testPouch.post({title: 'mic check'}, function(err, res) {
        console.log(JSON.stringify(res))
        console.log(err)
        console.log('Finished testPouch')

      }) 
    },

    testPouchPostAndGet: function() {
      var dbId = this.generateGUID()
      var docId = this.generateGUID()
      var db = Pouch(dbId)
      db.put({_id: docId, title: 'foo'}, function(err, res) {
        db.get(docId, function(err, doc) {
          console.log(JSON.stringify(doc))
          console.log(err)
        })
      })

    },


    testPouchQuery: function() {
      console.log('Running testPouchAllDocs')
      function map(doc) {
        if(doc.title) {
          emit(doc.title, null);
        }
      }
      var date = new Date()
      var testPouch = Pouch('test-' + date.getTime())
      testPouch.post({title: '1'}, function(err, res) {
        console.log('Pouch post 1:')
        console.log(JSON.stringify(res))
        console.log(err)
        testPouch.get(res.id, function(err, res) {
          console.log('Pouch get 1:')
          console.log(JSON.stringify(res))
          console.log(err)
          testPouch.post({title: '2'}, function(err, res) {
            console.log('Pouch post 2:')
            console.log(JSON.stringify(res))
            console.log(err)
            testPouch.get(res.id, function(err, res) {
              console.log('Pouch get 2:')
              console.log(JSON.stringify(res))
              console.log(err)
              testPouch.query({map: map}, {reduce: false}, function(err, response) {
                console.log('Pouch query:')
                console.log(JSON.stringify(response))
                console.log(err)
              })
            })
          })
        })
      })
    },

    testPouchAllDocs: function() {
      console.log('Running testPouchAllDocs')
      var date = new Date()
      var testPouch = Pouch('test-' + date.getTime())
      testPouch.post({title: '1'}, function(err, res) {
        console.log('Pouch post 1:')
        console.log(JSON.stringify(res))
        console.log(err)
        testPouch.get(res.id, function(err, res) {
          console.log('Pouch get 1:')
          console.log(JSON.stringify(res))
          console.log(err)
          testPouch.post({title: '2'}, function(err, res) {
            console.log('Pouch post 2:')
            console.log(JSON.stringify(res))
            console.log(err)
            testPouch.get(res.id, function(err, res) {
              console.log('Pouch get 2:')
              console.log(JSON.stringify(res))
              console.log(err)
              testPouch.allDocs({include_docs: true}, function(err, response) {
                console.log('Pouch allDocs:')
                console.log(JSON.stringify(response))
                console.log(err)
              })
            })
          })
        })
      })
    },

    testPouchBackboneModels: function() {
      console.log('Running testPouchBackboneModels')

      this.setPouch('testPouchBackboneModels')

      console.log('starting #1')
      var one = new Backbone.Model()
      one.set('foo', 'bar')
      one.on('sync', function(model, err) {
        console.log('#1')
        console.log(_.keys(model))
        console.log(JSON.stringify(model))
        console.log(err)
        
        console.log('starting #2')
        var two = new Backbone.Model({_id:model.id})
        two.fetch({success: function(model, response, options) {
          console.log('#2')
          console.log(_.keys(model))
          console.log(JSON.stringify(model))
          console.log(response)
          console.log('Finished testPouchBackbone')
        }})
      })
      one.save()

    },


    testPouchBackboneCollections: function() {
      console.log('Running testPouchBackboneCollections2')

      this.setPouch('testPouchBackboneCollections2')

      console.log('starting #1')
      var one = new Backbone.Model()
      one.set('foo', 'bar')
      one.on('sync', function(model, err) {
        console.log('starting #2')
        var two = new Backbone.Model()
        two.on('sync', function(model, err) {
          console.log('starting #3')
          var Collection = Backbone.Collection.extend({
            pouch: { options: { query: { fun: { map: function(doc) {
              //if(doc.foo === "bar") {
                emit(doc._id, null)
              //}
            }}}}},
          })

          var three = new Collection()

          three.fetch({success: function(collection, response, options){
            console.log('finished #3')
            console.log('collection.models.length: ' + collection.models.length) // <-- returning as 0 on Android 4.0.4
            if (collections.length < 1) {
              console.log("TEST FAILED")
            }
            console.log('collection.models: ' + JSON.stringify(collection.models))
            var four = Pouch('testPouchBackboneCollections2')
            var c = 1
            four.allDocs({include_docs: true}, function(err, response) {
              if(c == 1) {
                console.log('Pouch allDocs:')
                console.log(JSON.stringify(response))
                console.log(err)
                c++
              }
            })
          }})
          /*
          */
          console.log('finished #2')
        })
        two.save()
      })
      one.save()

    }


  }))

})