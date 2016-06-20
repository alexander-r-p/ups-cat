/**
 * Created by Alexander on 20.06.2016.
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('Todo', {
    text : String,
    done : Boolean
});