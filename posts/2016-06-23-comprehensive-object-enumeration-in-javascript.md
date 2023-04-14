---
id: 1710
title: 'Comprehensive object enumeration in JavaScript'
date: '2016-06-23T16:46:18+08:00'
author: 'Egor Nepomnyaschih'
layout: post
image: /static/img/2016/03/photo.jpg
categories:
    - 'Web Development'
---

This cool JS snippet implements enumerations for JS:

```js
function makeEnum(idField, indexField) {
  idField = idField || 'id';
  indexField = indexField || 'index';

  var enumeration = [];

  // Standalone object is useful for Underscore collection method usage,
  // for example:
  // _.keys(MyEnum.dict);
  var dict = {};
  enumeration.dict = dict;

  // This method can be used as a callback of map method:
  // var objects = ids.map(MyEnum.get);
  enumeration.get = function(id) {
    return enumeration[id];
  };

  // Registers a new enumeration item.
  enumeration.register = function(instance) {
    instance[indexField] = enumeration.length;
    enumeration[instance[idField]] = instance;
    dict[instance[idField]] = instance;
    enumeration.push(instance);
    return enumeration;
  };

  // Maps enumeration as dictionary:
  // MyEnum.mapDict(function(value, key) { return ...; });
  //
  // This is a shorthand for the next Underscore expression:
  // _.chain(MyEnum.dict).map(function(value, key) {
  //   return [key, ...];
  // }).object().value();
  enumeration.mapDict = function(iteratee, context) {
    var result = {};
    for (var id in dict) {
      if (dict.hasOwnProperty(id)) {
        result[id] = iteratee.call(context || this, dict[id], id, dict);
      }
    }
    return result;
  };

  return enumeration;
}
```

This code is inspired by TypeScript enumeration implementation, however, it is not limited to two-way string:index mapping. Enumeration item can be arbitrary object, not a plain string. This makes them more powerful.

Essentially, enumeration is an array of all items. Therefore, all methods of Array class are applicable to enumeration: [<tt>forEach</tt>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach), [<tt>filter</tt>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [<tt>map</tt>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) etc. In addition, makeEnum function extends the enumeration array with the next properties/methods:

- [id], .get(id) – get enumeration item by id
- .dict – pure dictionary from item id to an item
- .register – registers a new item
- .mapDict – helper mapping method (see description above)

Here's enumeration example:

```js
// Define enumeration item class.
function Outcome(id, color) {
  this.id = id; // String, enumeration key
  this.color = color; // String
  this.cls = id.toLowerCase().replace(/_/g, '-'); // String, CSS class
  this.name = $translate.instant('OUTCOME.' + id); // String
  this.index = 0; // Integer, auto-assigned by enumeration
}

// We can inherit it from something else and add methods.
Outcome.prototype = Object.create(Model.prototype);
Outcome.prototype.decorate = function(element) {
  element.css('color', this.color);
};

// Create enumeration and register the items.
var OutcomeEnum = makeEnum()
  .register(new Outcome('ON_SCHEDULE', 'green'))
  .register(new Outcome('ATTENTION', 'yellow'))
  .register(new Outcome('BEHIND_SCHEDULE', 'red'));

// Add some static methods to enumeration.
OutcomeEnum.compute = function(dueDate, estimatedDate) {
  var timeDiff = dueDate.getTime() - estimatedDate.getTime();
  if (timeDiff === 0) {
    return OutcomeEnum.ATTENTION;
  } else if (timeDiff > 0) {
    return OutcomeEnum.ON_SCHEDULE;
  } else {
    return OutcomeEnum.BEHIND_SCHEDULE;
  }
};
```

Let's review various use cases:

```js
// Parse outcome from JSON.
var outcome = OutcomeEnum[json.outcome];

// Parse outcome array from JSON.
var outcomes = json.outcomes.map(OutcomeEnum.get);

// Sort records by outcome.
records.sort(function(x, y) {
  return x.outcome.index - y.outcome.index;
});

// Compute outcome by parameters.
var outcome = OutcomeEnum.compute(new Date(2016, 2, 1), new Date(2016, 1, 1));

// Iterate through outcome array.
OutcomeEnum.forEach(function(outcome) {
  console.log(outcome.id, ' outcome has ', outcome.color, ' color');
});

// Even in AngularJS repeater.
<div ng-repeat="outcome in OutcomeEnum">
  {{outcome.name}} outcome has {{outcome.color}} color
</div>

// Compare outcomes.
if (outcome === OutcomeEnum.ATTENTION) {
  console.log('Attention!');
}

// Map outcome dictionary.
var anticipatedOutcomes = [OutcomeEnum.ON_SCHEDULE, OutcomeEnum.ATTENTION];
function isOutcomeAnticipated(outcome) {
  return anticipatedOutcomes.indexOf(outcome) !== -1;
}
var outcomeAnticipated = OutcomeEnum.mapDict(isOutcomeAnticipated);
console.log(outcomeAnticipated);
/*
  Output:
  {
    "ON_SCHEDULE": true,
    "ATTENTION": true,
    "BEHIND_SCHEDULE": false
  }
*/
```

We use these JavaScript enumerations every day and benefit a lot from their intuitive and simple API. This is a good example of how a small chunk of well-thought code can make the life easier.