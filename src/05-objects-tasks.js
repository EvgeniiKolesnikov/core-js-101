/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  Rectangle.prototype.getArea = function getArea() {
    return this.width * this.height;
  };
}

//  class Rectangle {
//   constructor(width, height) {
//     this.width = width;
//     this.height = height;
//   }
//   getArea() {
//     return this.width * this.height;
//   }
// }

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return new proto.constructor(...Object.values(JSON.parse(json)));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class MySuperBaseElementSelector {
  constructor(value, type) {
    this.value = value;
    this.type = type;
  }

  stringify() {
    return this.value.toString();
  }

  element(value) {
    if (this.type === 'element') this.error('repeatSelector');
    if (this.type.length > 0) this.error('orderSelector');
    return new MySuperBaseElementSelector(`${this.value}${value}`, `${this.type} element`);
  }

  id(value) {
    if (this.type.includes('id')) this.error('repeatSelector');
    if (this.type.replace(/element/g, '').trim().length > 0) this.error('orderSelector');
    return new MySuperBaseElementSelector(`${this.value}#${value}`, `${this.type} id`);
  }

  class(value) {
    if (this.type.replace(/element|id|class/g, '').trim().length > 0) this.error('orderSelector');
    return new MySuperBaseElementSelector(`${this.value}.${value}`, `${this.type} class`);
  }

  attr(value) {
    if (this.type.replace(/element|id|class|attr/g, '').trim().length > 0) this.error('orderSelector');
    return new MySuperBaseElementSelector(`${this.value}[${value}]`, `${this.type} attr`);
  }

  pseudoClass(value) {
    if (this.type.replace(/element|id|class|attr|pseudoClass/g, '').trim().length > 0) this.error('orderSelector');
    return new MySuperBaseElementSelector(`${this.value}:${value}`, `${this.type} pseudoClass`);
  }

  pseudoElement(value) {
    if (this.type.includes('pseudoElement')) this.error('repeatSelector');
    if (this.type.replace(/element|id|class|attr|pseudoClass/g, '').trim().length > 0) this.error('orderSelector');
    return new MySuperBaseElementSelector(`${this.value}::${value}`, `${this.type} pseudoElement`);
  }

  error(messageType) {
    this.message = '';
    if (messageType === 'repeatSelector') {
      this.message = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    }
    if (messageType === 'orderSelector') {
      this.message = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
    }
    throw new Error(this.message);
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new MySuperBaseElementSelector(value, 'element');
  },

  id(value) {
    return new MySuperBaseElementSelector(`#${value}`, 'id');
  },

  class(value) {
    return new MySuperBaseElementSelector(`.${value}`, 'class');
  },

  attr(value) {
    return new MySuperBaseElementSelector(`[${value}]`, 'attr');
  },

  pseudoClass(value) {
    return new MySuperBaseElementSelector(`:${value}`, 'pseudoClass');
  },

  pseudoElement(value) {
    return new MySuperBaseElementSelector(`::${value}`, 'pseudoElement');
  },

  combine(selector1, combinator, selector2) {
    return new MySuperBaseElementSelector(`${selector1.value} ${combinator} ${selector2.value}`);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
