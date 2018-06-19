module.exports.extendUnderscore = function(grunt){
    grunt.util._.mixin({deepExtend: deepExtend});

    /**
     * Extension method for underscore for deep copying data from one object to another.
     * Code from : https://gist.github.com/kurtmilam/1868955
     *
     * @param {Object}  obj - The object we want to extend.
     * @returns {Object}    - The extended object.
     */

    function deepExtend(obj) {
        var _ = grunt.util._,
            parentRE = /#{\s*?_\s*?}/,
            slice = Array.prototype.slice,
            hasOwnProperty = Object.prototype.hasOwnProperty;

        grunt.util._.each(slice.call(arguments, 1), function(source) {
            for (var prop in source) {
                if (hasOwnProperty.call(source, prop)) {
                    if (_.isUndefined(obj[prop]) || _.isFunction(obj[prop]) || _.isNull(source[prop])) {
                        obj[prop] = source[prop];
                    }
                    else if (_.isString(source[prop]) && parentRE.test(source[prop])) {
                        if (_.isString(obj[prop])) {
                            obj[prop] = source[prop].replace(parentRE, obj[prop]);
                        }
                    }
                    else if (_.isArray(obj[prop]) || _.isArray(source[prop])){
                        if (!_.isArray(obj[prop]) || !_.isArray(source[prop])){
                            throw 'Error: Trying to combine an array with a non-array (' + prop + ')';
                        } else {
                            obj[prop] = _.reject(_.deepExtend(obj[prop], source[prop]), function (item) { return _.isNull(item);});
                        }
                    }
                    else if (_.isObject(obj[prop]) || _.isObject(source[prop])){
                        if (!_.isObject(obj[prop]) || !_.isObject(source[prop])){
                            throw 'Error: Trying to combine an object with a non-object (' + prop + ')';
                        } else {
                            obj[prop] = _.deepExtend(obj[prop], source[prop]);
                        }
                    } else {
                        obj[prop] = source[prop];
                    }
                }
            }
        });
        return obj;
    }
};


