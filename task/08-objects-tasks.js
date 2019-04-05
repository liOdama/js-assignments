
/** ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  Rectangle.prototype.getArea = () => width * height;
}


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
  return  JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and
 * pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and
 * implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear
 * and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify() =>
 *    '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify() =>
 *    'a[href$=".png"]:focus'
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
 *  ).stringify() =>
 *      'div#main.container.draggable + table#data ~ tr:nth-of-type(even) td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CreateSelector {
  constructor (value, obj) {
    this.value = value;
    this.result = obj;
  }
  
  checkOneMoreTime(value, check) {
    const selector = value.split('');
    switch(true) {
    case selector.filter(c => c === '#').length > 1:
      throw CreateSelector.prototype.throwSelectorMoreOneTimes;
    case value.includes('::'):
      throw CreateSelector.prototype.throwSelectorMoreOneTimes;
    case check !== undefined:
      throw CreateSelector.prototype.throwSelectorMoreOneTimes;
    default:
      break;
    }
    
  }

  checkOrder(value, check) {
    value = value.split('');
    let wrongOrder = [];
    let storeSelectors = ['#', '.', '[', ':' ];
    switch(check) {
    case 'element':
      wrongOrder = value.filter(c => {
        return storeSelectors.some(curr => c === curr);
      });
      break;
    case '#':
      storeSelectors = storeSelectors.slice(1);
      wrongOrder = value.filter(c => {
        return storeSelectors.some(curr => c === curr);
      });
      break;
    case '.':
      storeSelectors = storeSelectors.slice(2);
      wrongOrder = value.filter(c => {
        return storeSelectors.some(curr => c === curr);
      });
      break;
    case '[':
      storeSelectors = [storeSelectors.pop()];
      wrongOrder = value.filter(c => {
        return storeSelectors.some(curr => c === curr);
      });
      break;
    case ':':
      if(value.join('').includes('::') === true) {
        throw CreateSelector.prototype.throwWrongOrder;
      }
      break;
    default:
      break;
    }
    if(wrongOrder.length > 0){throw CreateSelector.prototype.throwWrongOrder;}
  }
  element(value) {
    this.value = value;
    if (this.result === undefined) {
      const temp = 
      Object.create(CreateSelector.prototype, 
        {result: {writable:true, value:[this.value]}});
      return temp;
    }
    const resultForCheck = this.result.join('');
    this.checkOrder(resultForCheck, 'element');
    this.checkOneMoreTime(resultForCheck, this.value);
  }

  id(value) {
    this.value = `#${value}`;
    const temp = Object.create(CreateSelector.prototype);
    if (this.result === undefined) {
      temp.result = [this.value];
      return temp;
    } 
    this.result.push(this.value);
    const resultForCheck = this.result.join('');
    this.checkOrder(resultForCheck, '#');
    this.checkOneMoreTime(resultForCheck); 
    temp.result = this.result;
    return temp;
    
  }

  class(value) {
    const temp = Object.create(CreateSelector.prototype);
    this.value = `.${value}`;
    if (this.result === undefined) {
      temp.result = [this.value];
      return temp;
    } 
    this.result.push(this.value);
    const resultForCheck = this.result.join('');
    this.checkOrder(resultForCheck, '.');
    temp.result = this.result;
    return temp; 
    
  }

  attr(value) {
    const temp = Object.create(CreateSelector.prototype);
    this.value = `[${value}]`;
    if (this.result === undefined) {
      temp.result = [this.value];
      return temp;
    } 
    this.result.push(this.value);
    const resultForCheck = this.result.join('');
    this.checkOrder(resultForCheck, '[');
    temp.result = this.result;
    return temp;
    
  }

  pseudoClass(value) {
    const temp = Object.create(CreateSelector.prototype);
    this.value = `:${value}`;
    if (this.result === undefined) {
      temp.result = [this.value];
      return temp;
    } 
    this.result.push(this.value);
    const resultForCheck = this.result.join('');
    this.checkOrder(resultForCheck, ':');
    temp.result = this.result;
    return temp; 
    
  }

  pseudoElement(value) {
    const temp = Object.create(CreateSelector.prototype);
    this.value = `::${value}`;
    if (this.result === undefined) {
      temp.result = [this.value];
      return temp;
    }
    const resultForCheck = this.result.join(''); 
    this.checkOneMoreTime(resultForCheck);
    this.result.push(this.value);
    temp.result = this.result;
    return temp; 
    
  }

  combine(selector1, combinator, selector2) {
    const temp = 
      Object.create(CreateSelector.prototype,
        {result: {writable:true, value: [...selector1.result,
          ` ${combinator} `, ...selector2.result]}});
    return temp;
  }
  stringify() {
    return this.result.join('');
  }
}
CreateSelector.prototype.throwSelectorMoreOneTimes =
 'Element, id and pseudo-element should not'+
 ' occur more then one time inside the selector';
CreateSelector.prototype.throwWrongOrder = 
 'Selector parts should be arranged in the following order:'+
 ' element, id, class, attribute, pseudo-class, pseudo-element';

const cssSelectorBuilder = new CreateSelector();

module.exports = {
  Rectangle: Rectangle,
  getJSON: getJSON,
  fromJSON: fromJSON,
  cssSelectorBuilder: cssSelectorBuilder
};
