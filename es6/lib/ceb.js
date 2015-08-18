import customElementBuilder from './builder/CustomElementBuilder';
import propertyBuilder from './builder/PropertyBuilder';
import attributeBuilder from './builder/AttributeBuilder';
import delegateBuilder from './builder/DelegateBuilder';
import methodBuilder from './builder/MethodBuilder';
import templateBuilder from './builder/TemplateBuilder';
import onBuilder from './builder/OnBuilder';
import BuilderType from './builder/Builder';

/**
 * The base builder type
 * @type {Builder} the builder
 */
export var Builder = BuilderType;

/**
 * Get a new custom element builder.
 * @returns {CustomElementBuilder} the custom element builder
 */
export function ceb() {
    return customElementBuilder();
}

/**
 * Get a new custom element builder.
 * @returns {CustomElementBuilder} the custom element builder
 */
export default ceb;

/**
 * Get a new property builder.
 * @param {!string} propName the name of the property
 * @returns {PropertyBuilder} the property builder
 */
export function property(propName) {
    return propertyBuilder(propName);
}

/**
 * Get a new attribute builder.
 * @param {!string} attrName the name of the attribute
 * @returns {AttributeBuilder} the attribute builder
 */
export function attribute(attrName) {
    return attributeBuilder(attrName);
}

/**
 * Get a new method builder.
 * @param {!string} methName the name of the method
 * @returns {MethodBuilder} the method builder
 */
export function method(methName) {
    return methodBuilder(methName);
}

/**
 * Get a new delegate builder.
 * @param {!PropertyBuilder|AttributeBuilder} builder the property or attribute builder
 * @returns {DelegateBuilder} the delegate builder
 */
export function delegate(builder) {
    return delegateBuilder(builder);
}

/**
 * Get a new template builder.
 * @param {!string|Function} tpl the string or function template
 * @returns {TemplateBuilder} the template builder
 */
export function template(tpl) {
    return templateBuilder(tpl);
}

/**
 * Get a new on builder.
 * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
 * @returns {OnBuilder} the on builder
 */
export function on(events) {
    return onBuilder(events);
}