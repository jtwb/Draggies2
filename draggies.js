var new_draggie_prototype = function() {
  return {
    pos: {
      x: 100,
      y: 0
    },
    value: String.fromCharCode(Math.floor(Math.random() * 26 + 0x61))
  };
};

var drag_config = function(draggie) {
    return {
      stop: function(e, ui) {
        Draggies.update(draggie._id, {$set: {pos: {x: ui.position.left, y: ui.position.top}}});
      }
    };
};

var dragify = function(draggie) {
    setTimeout(function() {
            console.log(draggie._id);
        var el = $('#'+draggie._id);
        if ('draggable' in el.data()) { el.data('draggable', null); }
        $('#'+draggie._id).draggable(drag_config(draggie));
    }, 10);
};

Draggies = new Meteor.Collection("draggies");

if (Meteor.is_client) {

  Draggies.find({}).observe({
    added: dragify,
    changed: dragify
  });

  Template.draggieset.draggies = function () {
      return Draggies.find({});
  };

  Template.controlpanel.events = {
      'click .new-draggie' : function() {
          Draggies.insert(new_draggie_prototype());
      }
  };

  Template.draggie.events = {
      'blur input' : function(e) {
          Draggies.update(this._id, {$set: {value: $(e.target).val() } });
      }
  };
}

