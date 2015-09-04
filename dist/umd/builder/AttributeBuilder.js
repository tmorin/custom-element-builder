(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../utils.js', './PropertyBuilder.js'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('../utils.js'), require('./PropertyBuilder.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.utils, global.PropertyBuilder);
        global.AttributeBuilder = mod.exports;
    }
})(this, function (exports, _utilsJs, _PropertyBuilderJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    exports.getAttValue = getAttValue;
    exports.setAttValue = setAttValue;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    /**
     * Get the value from an attribute.
     * @param {!HTMLElement} el an HTML element
     * @param {!string} attrName the name of the attribute
     * @param {!boolean} isBoolean true is the returned value should be a boolean
     * @returns {string|boolean}
     */

    function getAttValue(el, attrName, isBoolean) {
        if (isBoolean) {
            //let value = el.getAttribute(attrName);
            return el.hasAttribute(attrName);
        }
        return el.getAttribute(attrName);
    }

    /**
     * Set the value of an attribute.
     * @param {!HTMLElement} el an HTML element
     * @param {!string} attrName the name of the attribute
     * @param {!boolean} isBoolean true is the value should be a boolean
     * @param {string|boolean} value the value to set
     */

    function setAttValue(el, attrName, isBoolean, value) {
        if (isBoolean) {
            // Handle boolean value
            if (value && !el.hasAttribute(attrName)) {
                el.setAttribute(attrName, '');
            } else if (!value && el.hasAttribute(attrName)) {
                el.removeAttribute(attrName);
            }
        } else {
            // Handle none boolean value
            if (((0, _utilsJs.isUndefined)(value) || (0, _utilsJs.isNull)(value)) && el.hasAttribute(attrName)) {
                // There is no value, so the attribute must be removed
                el.removeAttribute(attrName);
            } else if (!(0, _utilsJs.isUndefined)(value) && !(0, _utilsJs.isNull)(value) && el.getAttribute(attrName) !== value) {
                // Sync the attribute value with value
                el.setAttribute(attrName, value);
            }
        }
    }

    function getterFactory(attrName, isBoolean) {
        return function (el) {
            return getAttValue(el, attrName, isBoolean);
        };
    }

    function setterFactory(attrName, isBoolean, attSetter) {
        return function (el, value) {
            var attValue = (0, _utilsJs.isFunction)(attSetter) ? attSetter.call(el, el, value) : value;
            return setAttValue(el, attrName, isBoolean, attValue);
        };
    }

    /**
     * The attribute builder.
     * Its goal is to provide a way to define an attribute.
     * @extends {PropertyBuilder}
     */

    var AttributeBuilder = (function (_PropertyBuilder) {
        _inherits(AttributeBuilder, _PropertyBuilder);

        /**
         * @param {!string} attrName the name of the attribute
         */

        function AttributeBuilder(attrName) {
            _classCallCheck(this, AttributeBuilder);

            _get(Object.getPrototypeOf(AttributeBuilder.prototype), 'constructor', this).call(this, (0, _utilsJs.camelCase)(attrName));
            /**
             * @ignore
             */
            (0, _utilsJs.assign)(this.data, {
                attrName: attrName,
                getterFactory: getterFactory,
                setterFactory: setterFactory,
                descriptorValue: false,
                getAttValue: getAttValue,
                setAttValue: setAttValue
            });
        }

        /**
         * To handle the attribute/property value as a boolean:
         * Attribute is present when true and missing when false.
         * @returns {AttributeBuilder} the builder
         */

        _createClass(AttributeBuilder, [{
            key: 'boolean',
            value: function boolean() {
                this.data.boolean = true;
                return this;
            }

            /**
             * To override the property name.
             * @param {!string} propName the property name
             * @returns {AttributeBuilder}
             */
        }, {
            key: 'property',
            value: function property(propName) {
                this.data.propName = propName;
                return this;
            }

            /**
             * @override
             */
        }, {
            key: 'build',
            value: function build(proto, on) {
                var _this = this;

                var attGetter = this.data.getter,
                    attSetter = this.data.setter,
                    defaultValue = (0, _utilsJs.result)(this.data, 'value');

                this.data.value = undefined;

                this.data.getter = this.data.getterFactory(this.data.attrName, this.data.boolean, attGetter);
                this.data.setter = this.data.setterFactory(this.data.attrName, this.data.boolean, attSetter);

                _get(Object.getPrototypeOf(AttributeBuilder.prototype), 'build', this).call(this, proto, on);

                on('after:createdCallback').invoke(function (el) {
                    var attrValue = getAttValue(el, _this.data.attrName, _this.data.boolean);
                    if (_this.data.boolean) {
                        el[_this.data.propName] = !!defaultValue ? defaultValue : attrValue;
                    } else if (!(0, _utilsJs.isNull)(attrValue) && !(0, _utilsJs.isUndefined)(attrValue)) {
                        el[_this.data.propName] = attrValue;
                    } else if (!(0, _utilsJs.isUndefined)(defaultValue)) {
                        el[_this.data.propName] = defaultValue;
                    }
                });

                on('before:attributeChangedCallback').invoke(function (el, attName, oldVal, newVal) {
                    // Synchronize the attribute value with its properties
                    if (attName === _this.data.attrName) {
                        var value = _this.data.boolean ? newVal === '' : newVal;
                        if (el[_this.data.propName] !== value) {
                            el[_this.data.propName] = value;
                        }
                    }
                });
            }
        }]);

        return AttributeBuilder;
    })(_PropertyBuilderJs.PropertyBuilder);

    exports.AttributeBuilder = AttributeBuilder;
});