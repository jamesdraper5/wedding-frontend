class QueryString {

    constructor() {

        /**
        * Object#toString() ref for stringify().
        */

        var toString = Object.prototype.toString;

        /**
        * Cache non-integer test regexp.
        */

        var isint = /^[0-9]+$/;

        this.promote = (parent, key) => {
            if (parent[key].length == 0) return parent[key] = {};
            var t = {};
            for (var i in parent[key]) t[i] = parent[key][i];
            parent[key] = t;
            return t;
        }

        this.parse = (parts, parent, key, val) => {
            var part = parts.shift();
            // end
            if (!part) {
                if (Array.isArray(parent[key])) {
                    parent[key].push(val);
                } else if ('object' == typeof parent[key]) {
                    parent[key] = val;
                } else if ('undefined' == typeof parent[key]) {
                    parent[key] = val;
                } else {
                    parent[key] = [parent[key], val];
                }
                // array
            } else {
                var obj = parent[key] = parent[key] || [];
                if (']' == part) {
                    if (Array.isArray(obj)) {
                        if ('' != val) obj.push(val);
                    } else if ('object' == typeof obj) {
                        obj[Object.keys(obj).length] = val;
                    } else {
                        obj = parent[key] = [parent[key], val];
                    }
                    // prop
                } else if (~part.indexOf(']')) {
                    part = part.substr(0, part.length - 1);
                    if (!isint.test(part) && Array.isArray(obj)) obj = this.promote(parent, key);
                    this.parse(parts, obj, part, val);
                    // key
                } else {
                    if (!isint.test(part) && Array.isArray(obj)) obj = this.promote(parent, key);
                    this.parse(parts, obj, part, val);
                }
            }
        }

        /**
        * Merge parent key/val pair.
        */

        this.merge = (parent, key, val) => {
            if (~key.indexOf(']')) {
                var parts = key.split('['),
                len = parts.length,
                last = len - 1;
                this.parse(parts, parent, 'base', val);
                // optimize
            } else {
                if (!isint.test(key) && Array.isArray(parent.base)) {
                    var t = {};
                    for (var k in parent.base) t[k] = parent.base[k];
                    parent.base = t;
                }
                this.set(parent.base, key, val);
            }

            return parent;
        }

        /**
        * Parse the given obj.
        */

        this.parseObject = (obj) => {
            var ret = {
                base: {}
            };
            Object.keys(obj).forEach((name) => {
                this.merge(ret, name, obj[name]);
            });
            return ret.base;
        }

        /**
        * Parse the given str.
        */

        this.parseString = (str) => {
            return String(str)
            .split('&')
            .reduce((ret, pair) => {
                try {
                    pair = decodeURIComponent(pair.replace(/\+/g, ' '));
                } catch (e) {
                    // ignore
                }

                var eql = pair.indexOf('='),
                brace = this.lastBraceInKey(pair),
                key = pair.substr(0, brace || eql),
                val = pair.substr(brace || eql, pair.length),
                val = val.substr(val.indexOf('=') + 1, val.length);

                // ?foo
                if ('' == key) key = pair, val = '';

                return this.merge(ret, key, val);
            }, {
                base: {}
            }).base;
        }

        /**
        * Stringify the given `str`.
        *
        * @param {String} str
        * @param {String} prefix
        * @return {String}
        * @api private
        */

        this.stringifyString = (str, prefix) => {
            if (!prefix) throw new TypeError('stringify expects an object');
            return prefix + '=' + encodeURIComponent(str);
        }

        /**
        * Stringify the given `arr`.
        *
        * @param {Array} arr
        * @param {String} prefix
        * @return {String}
        * @api private
        */

        this.stringifyArray = (arr, prefix) => {
            var ret = [];
            if (!prefix) throw new TypeError('stringify expects an object');
            for (var i = 0; i < arr.length; i++) {
                ret.push(stringify(arr[i], prefix + '[' + i + ']'));
            }
            return ret.join('&');
        }

        /**
        * Stringify the given `obj`.
        *
        * @param {Object} obj
        * @param {String} prefix
        * @return {String}
        * @api private
        */

        this.stringifyObject = (obj, prefix) => {
            var ret = [],
            keys = Object.keys(obj),
            key;

            for (var i = 0, len = keys.length; i < len; ++i) {
                key = keys[i];
                ret.push(stringify(obj[key], prefix ?
                    prefix + '[' + encodeURIComponent(key) + ']' :
                    encodeURIComponent(key)));
            }

            return ret.join('&');
        }

        /**
        * Set `obj`'s `key` to `val` respecting
        * the weird and wonderful syntax of a qs,
        * where "foo=bar&foo=baz" becomes an array.
        *
        * @param {Object} obj
        * @param {String} key
        * @param {String} val
        * @api private
        */

        this.set = (obj, key, val) => {
            var v = obj[key];
            if (undefined === v) {
                obj[key] = val;
            } else if (Array.isArray(v)) {
                v.push(val);
            } else {
                obj[key] = [v, val];
            }
        }

        /**
        * Locate last brace in `str` within the key.
        *
        * @param {String} str
        * @return {Number}
        * @api private
        */

        this.lastBraceInKey = (str) => {
            var len = str.length,
            brace, c;
            for (var i = 0; i < len; ++i) {
                c = str[i];
                if (']' == c) brace = false;
                if ('[' == c) brace = true;
                if ('=' == c && !brace) return i;
            }
        }

    }


	/**
	 * Parse the given query `str` or `obj`, returning an object.
	 *
	 * @param {String} str | {Object} obj
	 * @return {Object}
	 * @api public
	 */

	Parse(str) {
		if (null == str || '' == str) return {};
		return 'object' == typeof str ?
			this.parseObject(str) :
			this.parseString(str);
	}

	/**
	 * Turn the given `obj` into a query string
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api public
	 */

	Stringify(obj, prefix) {
		if (Array.isArray(obj)) {
			return this.stringifyArray(obj, prefix);
		} else if ('[object Object]' == toString.call(obj)) {
			return this.stringifyObject(obj, prefix);
		} else if ('string' == typeof obj) {
			return this.stringifyString(obj, prefix);
		} else {
			return prefix + '=' + obj;
		}
	}


}

export default QueryString;
