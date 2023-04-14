---
id: 663
title: 'Aggregation and awareness'
date: '2014-12-23T16:34:31+08:00'
author: 'Egor Nepomnyaschih'
layout: post
image: /static/img/2014/12/code-459070_1280.jpg
categories:
    - General
    - 'Web Development'
---

We told you about a special way to destroy objects in jWidget framework earlier in a section **Problem #1** of [the article about Front end optimization](http://www.issart.com/blog/front-end-optimization-experience/). Apparently, the framework introduces an unusual approach for object destruction and memory cleaning which we don't see in any other frameworks. We call it *object aggregation*.

#### What problem do we face in the other frameworks?

Usually you define a special method to clean the memory (let's call it “destructor”, although JavaScript doesn't provide the built-in destructors for the objects). In destructor, we revert everything that has been done in the constructor.

```
var Client = function(dispatcher) {
    Client._super.call(this);
    this.dispatcher = dispatcher;
    this.dispatcher.bind("change", this.onChange, this);
};

extend(Client, Class, {
    onChange: function() { ... },

    // destructor
    destroy: function() {
        this.dispatcher.unbind("change", this.onChange, this);
        this._super();
    }
});
```

After that, we call the destructor manually.

```
var client = new Client(dispatcher);
...
client.destroy();
```

It is getting even harder if we must check what needs to be reverted.

```
var Book = function() {
    Book._super.call(this);
    this.cover = null;
};

extend(Book, Class, {
    createCover: function() {
        this.cover = new Cover();
    },

    // destructor
    destroy: function() {
        if (this.cover) { // an extra check
            this.cover.destroy();
        }
        this._super();
    }
});
```

The resulting code turns out to be bulky and difficult to maintain. For every event binding or sub-object creation in the constructor, we must write the reverting code in the destructor, so we write twice as much code as we wanted to.

#### Problem solution with jWidget

We've found an idea to resolve this problem in the introduction to a classic book [Design Patterns: Elements of Reusable Object-Oriented Software](http://books.google.ru/books/about/Design_Patterns.html?id=6oHuKQe3TjQC). There's an impressive paragraph there about difference between object *aggregation* and *awareness*. Object A *aggregates* object B if it has a reference to object B and it is an owner of object B, i.e. it is responsible for its creation and destruction. *Awareness* is just a reference to object B without any responsibility for its creation or destruction. The only programming language among ones that I know that has a built-in syntax for object aggregation is C++. If you define a field of some class type, it is aggregation. If you define a reference or a pointer, it is most likely awareness. In the next example, Cylinder aggregates a Circle, but CircleView is aware of a Circle.

```
class Circle {
    double radius;
public:
    Circle(double r) : radius(r) { }
};

class Cylinder {
    Circle base;
    double height;
public:
    Cylinder(double r, double h) : base (r), height(h) { }
};

class CircleView {
    Circle &base;
public:
    CircleView(Circle &b) : base(b) { }
}
```

We thought about the ways to implement something similar in JavaScript. As result, we've created an “own” method and injected it into the root class of the framework.

```
var Class = function() {
    this._ownagePool = [];
    this._super = null;
};

extend(Class, Object, {
    own: function(obj) {
        this._ownagePool.push(obj);
        return obj;
    },

    destroy: function() {
        var pool = this._ownagePool;
        for (var i = pool.length - 1; i >= 0; --i) {
            pool[i].destroy();
        }
    }
});
```

Now we can avoid explicit destructor method definition in our classes. Usually it is enough to just specify that one object aggregates another one. So, the example with a book and a cover can be simplified the next way:

```
var Book = function() {
    Book._super.call(this);
    this.cover = null;
};

extend(Book, Class, {
    createCover: function() {
        this.cover = this.own(new Cover());
    }
});
```

We could remove 6 lines of code thanks to one “this.own” call.

The example with an event is not as obvious. To make use of object aggregation there, notice, that when you bind a handler to an event, you essentially allocate a new “event attachment” object. Attachment destruction results in even unbinding. So, we can modify our code the next way.

```
var Client = function(dispatcher) {
    Client._super.call(this);
    this.dispatcher = dispatcher;
    this.attachment = this.dispatcher.bind("change", this.onChange, this);
};

extend(Client, Class, {
    onChange: function() { ... },

    // destructor
    destroy: function() {
        this.attachment.destroy();
        this._super();
    }
});
```

Now, let's just aggregate the event attachment.

```
var Client = function(dispatcher) {
    Client._super.call(this);
    this.own(dispatcher.bind("change", this.onChange, this));
};

extend(Client, Class, {
    onChange: function() { ... }
});
```

Destructor has gone.

#### Automatic destruction of proxy values and collection items

We can destroy proxy values and collection items using special “ownValue” and “ownItems” methods.

```
this.proxy = new Proxy();
this.proxy.ownsValue();
this.proxy.set(new SampleValue(1));
this.proxy.set(new SampleValue(2)); // SampleValue(1) is destroyed implicitly
this.proxy.destroy();               // SampleValue(2) is destroyed implicitly

this.collection = new Collection();
this.collection.ownsItems();
this.collection.add(new SampleItem(1));
this.collection.add(new SampleItem(2));
this.collection.destroy(); // both SampleItems are destroyed implicitly here
```

#### Tricks

Object aggregation system lets us do some wacky stuff with our code.

##### Easy object refreshing

Assume that you listen to an event and create a “content” object whenever it is triggered. Before creating the new content, you must destroy the previously created one.

```
var Client = function(dispatcher) {
    Client._super.call(this);
    this.content = null;
    this.initContent();
    this.own(dispatcher.bind("change", this.refreshContent, this));
};

extend(Client, Class, {
    destroy: function() {
        this.doneContent();
        this._super();
    },
  
    initContent: function() {
        this.content = new Content();
    },
  
    doneContent: function() {
        this.content.destroy();
    },
  
    refreshContent: function() {
        this.doneContent();
        this.initContent();
    }
});
```

Thanks to proxy's “ownValue” method, this code can be cut a half.

```
var Client = function(dispatcher) {
    Client._super.call(this);
    this.content = this.own(new Proxy()).ownValue();
    this.refreshContent();
    this.own(dispatcher.bind("change", this.refreshContent, this));
};

extend(Client, Class, {
    refreshContent: function() {
        this.content.set(new Content());
    }
});
```

##### Bulk object destruction

Let's complicate the previous example a little bit. Assume that you must create a bunch of objects instead of a single content object. And these objects should be created all at once in a separate class (factory).

```
var Client = function(dispatcher, factory) {
    Client._super.call(this);
    this.factory = factory;
    this.object1 = null;
    this.object2 = null;
    this.object3 = null;
    this.initObjects();
    this.own(dispatcher.bind("change", this.refreshObjects, this));
};

extend(Client, Class, {
    destroy: function() {
        this.doneObjects();
        this._super();
    },
  
    initObjects: function() {
        var objects = this.factory.createObjects();
        this.object1 = objects.object1;
        this.object2 = objects.object2;
        this.object3 = objects.object3;
    },
  
    doneObjects: function() {
        this.object3.destroy();
        this.object2.destroy();
        this.object1.destroy();
    },
  
    refreshObjects: function() {
        this.doneObjects();
        this.initObjects();
    }
});

var Factory = {
    createObjects: function() {
        return {
            object1: new Object1(),
            object2: new Object2(),
            object3: new Object3()
        };
    }
};
```

The code seems very complicated, doesn't it? Fear not, my friend, look how can we deal with that.

```
var Client = function(dispatcher, factory) {
    Client._super.call(this);
    this.factory = factory;
    this.objects = this.own(new Proxy()).ownValue();
    this.refreshObjects();
    this.own(dispatcher.bind("change", this.refreshObjects, this));
};

extend(Client, Class, {
    refreshObjects: function() {
        this.objects.set(this.factory.createObjects());
    }
});

var Factory = {
    createObjects: function() {
        var objects = new Class();
        objects.own(new Object1());
        objects.own(new Object2());
        objects.own(new Object3());
        return objects;
    }
};
```

##### Object driver destruction

Assume that you want to implement a method returning a string proxy which can be changed over time. String is changed on some events – let's call attachments to these events as “drivers”. As soon as this proxy is not needed anymore, all these drivers must be destroyed. Usually, to make it possible, you put all these drivers along with the resulting proxy to an object and return this object. As an example, let's look how dynamic localization change can be achieved.

```
var Header = function(locale) {
    Header._super.call(this);
    this.locale = locale;
};

extend(Header, Class, {
    render: function() {
        this.titleDriver = this.locale.getDriver("title");
        this.bindText(this.element, this.titleDriver.text);
    },
  
    unrender: function() {
        this.titleDriver.destroy();
    }
});

var Locale = function(data) {
    Locale._super.call(this);
    this.data = data;
    this.language = new Proxy("en");
};

extend(Locale, Class, {
    getDriver: function(key) {
        return new Driver(this.language, function(language) {
            return this.data[language][key];
        }, this);
    }
});
```

Here, we have only one driver for a localization string, and it is already difficult. But imagine if you have multiple drivers that give you a single value in result – it will be even more difficult. You just want to get a string proxy, you don't want to manage all these drivers in your Header class!

We've got a solution for you – just aggregate the drivers inside the proxy.

```
var Header = function(locale) {
    Header._super.call(this);
    this.locale = locale;
};

extend(Header, Class, {
    render: function() {
        this.bindText(this.element, this.own(this.locale.getText("title")));
    }
});

var Locale = function(data) {
    Locale._super.call(this);
    this.data = data;
    this.language = new Proxy("en");
};

extend(Locale, Class, {
    getText: function(key) {
        var text = new Proxy();
        text.own(new Driver(this.language, function(language) {
            return this.data[language][key];
        }, this, {text: text}));
        return text;
    }
});
```

Locale's implementation is a little bit more complicated, but it is reusable! You can use the same “getText” method everywhere in your application and save hundreds lines of code. As a side effect, you will make your code clear and easy to maintain.
<link href="//cdn-images.mailchimp.com/embedcode/slim-081711.css" rel="stylesheet" type="text/css"></link><style type="text/css">
	#mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; }
	/* Add your own MailChimp form style overrides in your site stylesheet or in this style block.
	   We recommend moving this block and the preceding CSS link to the HEAD of your HTML file. */
</style>

<div id="mc_embed_signup"><form action="//issart.us8.list-manage.com/subscribe/post?u=27b4bef1d5ce0a19dc5a471f5&id=9fce49f49e" class="validate" id="mc-embedded-subscribe-form" method="post" name="mc-embedded-subscribe-form" novalidate="" target="_blank"><div id="mc_embed_signup_scroll"> <label for="mce-EMAIL">Subscribe to our mailing list</label>  #### Conclusion

With object aggregation system, you don't need to define class destructors explicitly anymore. All the destructors stay in the low-level classes of the framework, and all the high-level classes of your application can aggregate each other to gain all the purposes.

By the replacement of all class destructors with the aggregation system at one of our projects we've managed to delete 1000 lines of code of 15000 (7% win).