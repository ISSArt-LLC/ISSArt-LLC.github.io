---
id: 734
title: 'ISS Art technology stack in 2015'
date: '2015-01-27T13:56:38+08:00'
author: 'Egor Nepomnyaschih'
layout: post
image: /static/img/2015/01/blackboard-573023_1280.jpg
categories:
    - General
---

New technologies appear every day, and we try to stay in step with this tendency. But we don’t jump blindly to every new fashion, because this way we can spend a lot of effort for nothing. For commercial development, it is always better to wait a little bit and make sure that the transition to a new technology will really pay off.

The table below shows our main technology stack in 2013 and 2014 years and our plans about what to try in 2015.

201320142015

| PHP framework | [Zend 1](http://framework.zend.com/) | [Zend 1](http://framework.zend.com/) + **[Doctrine](http://www.doctrine-project.org/)** | **[Symfony](http://symfony.com/)** + **[Doctrine 2](http://www.doctrine-project.org/)** |
|---|---|---|---|
| [Java](https://www.issart.com/en/lp/java-development-team/) framework | [Restlet](http://restlet.com/products/restlet-framework/) | [Restlet](http://restlet.com/products/restlet-framework/) | **[Spring](http://projects.spring.io/spring-framework/)** |
| Client language | [JavaScript](http://en.wikipedia.org/wiki/JavaScript) | [JavaScript](http://en.wikipedia.org/wiki/JavaScript) | **[TypeScript](http://www.typescriptlang.org/)** |
| Client framework | [jWidget](http://enepomnyaschih.github.io/jwidget/) | [jWidget](http://enepomnyaschih.github.io/jwidget/), **[AngularJS](https://angularjs.org/)** | [jWidget](http://enepomnyaschih.github.io/jwidget/) + **[ReactJS](http://facebook.github.io/react/)** |
| Stylesheets | [CSS](http://en.wikipedia.org/wiki/Cascading_Style_Sheets) | [CSS](http://en.wikipedia.org/wiki/Cascading_Style_Sheets), **[Stylus](http://learnboost.github.io/stylus/)** | **[LESS](http://lesscss.org/)**, [Stylus](http://learnboost.github.io/stylus/) |
| Client package manager | – | – | **[Bower](http://bower.io/)** |

#### Why Symfony?

[Zend 1](http://framework.zend.com/) doesn’t meet modern standards anymore, so we have to make a choice from [Zend 2](http://framework.zend.com/), [Symfony](http://symfony.com/) and a bunch of other PHP frameworks. Symfony seems the most solid and well-thought one for us. In particular, it has a built-in ORM [Doctrine 2](http://www.doctrine-project.org/), a good view system, code generators and dependency injection. And we haven’t forgotten about Zend 2 either.

#### Why Spring?

[Spring framework](http://projects.spring.io/spring-framework/) provides perfect implementation of IoC container implementing dependency injection principle which is crucial in backend application development. Dependency injection simplifies interaction between objects, makes mock object creation easier for unit testing. Also, Spring framework introduces MVC pattern implementation and a lot of other bonuses useful in Web development. And thanks to splitting Spring by projects it is very lightweight.

#### Why TypeScript?

For such object-oriented programming zealots as we are, it is inconvenient to develop the dynamically typed code in JavaScript. We prefer to know what fields each class has and it would be really great if IDE helped us to develop code. So, it would be really great to select some kind of a replacement for JavaScript. There are 3 well known replacements: [CoffeeScript](http://coffeescript.org/), [Dart](https://www.dartlang.org/) and [TypeScript](http://www.typescriptlang.org/).

**[CoffeeScript](http://coffeescript.org/)** is way too crazy for us and it doesn’t give us what we actually want.

**[Dart](https://www.dartlang.org/)** has a huge advantage compared to other replacements – a Virtual Machine which is much faster than JavaScript. But the VM is supported by Google Chrome only now and other browsers don’t have any plans to add Dart VM support in the nearest future. But the crucial part is that Dart is very much tied to Google now – it has an IDE from Google, a package manager from Google and package repository from Google and there’s nothing you can do in Dart without communicating to Google servers. Even if you develop your own library, you must publish it in Google repository. The language doesn’t have a big library base, and it is quite difficult to communicate between Dart and JavaScript code. So, at this point, it is way too early for us to give it a shot. Maybe in future.

**[TypeScript](http://www.typescriptlang.org/)** doesn’t have the majority of Dart advantages, but it is very safe for us to transition to it now. TypeScript is not as ambitious of a technology – it is just a superset of JavaScript syntax which gives us whatever we need: static types, interfaces, classes, generics etc. It is completely compatible to all existing JavaScript libraries and frameworks, so why not to try it?

#### Why <span style="color: red;">not</span> AngularJS?

Thanks to an aggressive advertisement campaign from Google, [AngularJS](https://angularjs.org/) has become a very fashionable technology in 2014. So we’ve given it a shot at one of our projects. The outcome wasn’t as good as Google promised us for it to be. We’ve spent twice as much time as we expected the project to take, and the code wasn’t as clear as it would be if selected Backbone or jWidget. [Several](https://medium.com/@mnemon1ck/why-you-should-not-use-angularjs-1df5ddf6fc99) [great](http://okmaya.com/2014/03/12/the-reason-angular-js-will-fail/) [articles](http://habrahabr.ru/post/246905/) explain the major AngularJS pitfalls, and I see all the pitfalls that we faced in our AngularJS development in them too.

#### Why ReactJS?

[ReactJS](http://facebook.github.io/react/) is a great replacement for AngularJS and for UI part of [jWidget framework](http://enepomnyaschih.github.io/jwidget/). It is fast, simple and clear. There are two problems with it, but they are not crucial:

- Inability to communicate directly to DOM elements rendered with ReactJS. So, for example, it is quite difficult to use [jQuery UI](http://jqueryui.com/) components inside ReactJS code. But it is possible, so we don’t care.
- Lack of model. Usually ReactJS developers take [Backbone](http://backbonejs.org/) model and inject it into ReactJS components. We are going to try a jWidget model with ReactJS, because jWidget model is essentially a powerful extension of Backbone model.

#### Why Stylus and LESS?

[Stylus](http://learnboost.github.io/stylus/) is a cute replacement for plain CSS. It has a lot of features and makes stylesheets clear, simple and easy to maintain. [LESS](http://lesscss.org/) is a bit bulky, but it has a better IDE support compared to Stylus. So, we’ll use LESS until a bunch of IDEs will provide support for Stylus. There’s one more well known CSS preprocessor – [Sass](http://sass-lang.com/), – but it has a major pitfall. The next selector doesn’t work in Sass: &-suffix, and it is crucial for us.

#### Bower

With [Bower](http://bower.io/), it is unneccessary to commit the third-party libraries to repository anymore. This is not crucial, but still awesome.

This was the list of technologies we are going to use in 2015. The list is not limited to the above mentioned technologies however.

What will you try in 2015?