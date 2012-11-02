/*global $:true, Backbone:true, _:true, module:true, proxy:true, test:true, equal: true,  ok:true, deepEqual: true, notEqual: true*/

$(document).ready(function() {

  module("Backbone.SingletonModel");

  var lastRequest;
  Backbone.sync = function() {
    lastRequest = _.toArray(arguments);
  };

  var attrs = {
    id     : '1-the-tempest',
    title  : "The Tempest",
    author : "Bill Shakespeare",
    length : 123
  };

  var opts = {
    stuff: 2
  };

  test("SingletonModel: init", function() {
    var model = new Backbone.SingletonModel(attrs);
    deepEqual(model.attributes, attrs, 'initialize a new model');
  });


  test("SingletonModel: extend", function() {
    var Model = Backbone.SingletonModel.extend({
      initialize: function(atr,opt) {
        deepEqual(this.attributes, attrs, 'attributes are assigned');
	ok(this.attributes !== attrs, 'attributes are cloned');
        deepEqual(opt, opts, 'options are passed');
      }
    });

    var model = new Model(attrs, opts);
    deepEqual(model.attributes, attrs, 'attributes are retrievable');
  });

  test("SingletonModel: singleton test", function() {
    var SingletonModel = Backbone.SingletonModel.extend({});

    var a = new SingletonModel(attrs);
    var b = new SingletonModel(attrs);
    deepEqual(a, b, 'two Models with the same key are the same model');
  });

  test("SingletonModel: subclass stores", function() {
    var SingletonModel = Backbone.SingletonModel;
    var CoolModel = SingletonModel.extend({});
    var AwesomeModel = SingletonModel.extend({});

    var a = new SingletonModel(attrs);
    var b = new CoolModel(attrs);
    var c = new AwesomeModel(attrs);
    notEqual(a, b, "Parent Class doesn't share models with children");
    notEqual(b, c, "Subclasss don't share models with eachother");
    notEqual(a._singleton.store, b._singleton.store, "Parents don't share stores with children");
    notEqual(b._singleton.store, c._singleton.store, "subclasses don't share stores");
    notEqual(SingletonModel.prototype._singleton, CoolModel.prototype._singleton, "Prototypes of children don't share meta class with parent");
    notEqual(CoolModel.prototype._singleton, AwesomeModel.prototype._singleton, "Prototypes of subclasses don't share meta class");
  });

  test("SingletonModel: update on new", function() {
    var CoolModel = Backbone.SingletonModel.extend({});

    var a = new CoolModel({
      id: 'bob'
    });

    var data = {
      id: 'bob',
      data: 'classy!'
    };

    var b = new CoolModel(data);

    equal(a.cid,b.cid, "Model client ids are the same");
    deepEqual(a,b, "Models are the same");
    deepEqual(a.attributes, data, "Attributes were updated");
  });

  test("SingletonModel: idAttribute", function() {
    var CoolModel = Backbone.SingletonModel.extend({
      idAttribute: 'key'
    });

    var data = {
      key: 'bob',
      data: 'classy!'
    };

    var a = new CoolModel({
      key: 'bob'
    });
    var b = new CoolModel(data);

    deepEqual(a, b, "Models are pulled by their idAttribute");
    deepEqual(b.attributes, data, "Attributes are updated");
    deepEqual(a.attributes, data, "Attributes are updated");
  });

  test("SingletonModel: capture - new model", function() {
    var CoolModel = Backbone.SingletonModel.extend({});

    var data = {
      respectlevel: 'classy!'
    };

    var a = new CoolModel(data);

    equal(a.singleton, false, 'Model not a singleton');
    a.set({id:1});
    a.capture();
    equal(a.singleton, true, "Capture was successful");
  });
});
