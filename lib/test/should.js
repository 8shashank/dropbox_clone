var assert = require("assert");

var thisValue = function(val){

    var theVal = val;
    var negate = false;

    var self = {
        should: function(){
            return self;
        },
        equal: function (val2) {
            if (!negate) {
                assert(theVal === val2);
            }
            else {
                assert(theVal !== val2);
            }
        },
        not: function () {
            negate = true;
            return self;
        }
    };

    return self;
}

module.exports = {
    thisValue:thisValue
}