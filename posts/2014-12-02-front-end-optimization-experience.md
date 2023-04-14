---
id: 575
title: 'Front end optimization experience'
date: '2014-12-02T13:44:27+08:00'
author: 'Egor Nepomnyaschih'
layout: post
image: /static/img/2014/12/1012.2.jpg
categories:
    - 'Web Development'
---

Nearly a month ago we ran into quite a challenging problem with the application that we had been developing for 2 years.

### Overview

In a first place, this was just a purely Front End application developed in JavaSscript , quite simple. The performance wasn't crucial before, and we were focusing mainly on the application appearance and reliability. To make the application friendlier to the end user, our code handles any user action instantly, without a single second of delay. Even application language can be changed at one click without any delay:

<iframe height="140" src="http://enepomnyaschih.github.io/mt/1.0.0/locale.html" style="border: 1px solid green; padding: 10px;" width="400"></iframe>

That's why we load the entire data array from the server on initialization, and don't communicate to the server after that: all the data is already in place, and JavaScript code knows all the algorithms neccessary to deliver the correct results based on this data to the user.

### Challenge

Nearly 2 months ago our customer had an opportunity to sign a very nice contract with one of his clients. But the deal required quite an effort from us. We were asked to make JavaScript front end optimization – configure the application to be running on the data array of 2200 components. Before that, the highest load our application was tested on was 400 components, and even in thatcondition it didn't really show perfect performance. It was obvious that 2200 was an enormous lot for our current code. And the time was short: we had only a couple of weeks to make all the adjustments neccessary to meet the load requirements.

But we knew that our customer trusts us, and we didn't want to let him down. The contract promised to be very profitable and we understood that it might guarantee the long-term collaboration and let us add several new members to the development team. That's why we accepted the challenge.

Here is the situation: this is an interactive JavaScript application built on model-view architecture. It means thatn all application data is stored in the "model" objects which trigger the events whenever we make any modifications. Another bunch of objects – the "view" objects – constantly listens to these events and redraws the parts of the page contents which were changed. For example, here are the steps of how we handle the change of language selection:

1. Intercept the "click" event at the language selector
2. Change the "language" property in the model and trigger a "language changed" event
3. All views which have the textual strings dependent on localization update their contents

So, the application components live in constant synchronization with each other. There are a lot of frameworks which let you setup this architecture in your application. The most popular ones nowadays are [AngularJS](https://angularjs.org/) and [Backbone.JS](http://backbonejs.org/), but there are many ones of them in fact. You can find the majority of them on this site [todomvc.com](http://todomvc.com/)

This architecture makes our life easier but it is not a pitfall proof solution. If you just connect two objects together via an event mindlessly, the outcome can be disasterous in performance regard. Especially with such high-level solutions like AngularJS, where you don't have a direct access to the application components, and the communication
mechanism is not smooth at all. We use our own solution – [jWidget](http://enepomnyaschih.github.io/jwidget) which is similar to Backbone but is more powerful and well-structurized. And still it doesn't make our code invincible. But we know our job and knew exactly what to do.

### Solution

**Problem #1. Memory leaks**

Let me give you an example. A view is listening to an event of the model. What should we do if the user selects another component so that this view is needed no more? We can blindly remove the view from the Web page. But in fact, it is still alive, because it is listening to an event of the model. The model still has a reference to the view, so internal
garbage collector of the browser cannot clear the memory occupied by this view. Moreover, if the model triggers the event, this "zombie" view will receive this event for handling, so we can run into some unexpected effects. That's why we cannot just remove the view from the Web page. Instead, we must destroy it completely by also unsubscribing from
the model's event. It will guarantee the reliability and memory consistency.

We found the memory leaks very fast in our application. The symptoms are simple: Google Chrome's "Aw, Snap!" message is the first sign that probably you run out of memory. So, if several jumps between components brings you to this screen, then some parts of your component view are not destroyed for sure.

![](http://content.screencast.com/users/enepomnyaschih/folders/Jing/media/ea3cb099-6d62-4861-b1bd-5ec7da3daac4/2014-11-21_1803.png)

For us, it was enough to jump two times between the largest screens of our application and we already saw this message. So, the problem was clear.

In jWidget, we knew how to destroy the objects correctly and tried to follow this instruction constantly during [application development](https://www.issart.com/en/services/details/service/web-development). But we could have missed something and there wasn't an immediate sign of what we did wrong. So, we've decided to implement this sign.

We've added several lines of code in jWidget framework, which showed us exactly which views were not in the Web page at the moment, but they weren't destroyed. After that, zombie hunting appeared to be easy and fast.

**Problem #2. Large grid rendering**

We had a screen in our application which shows the consolidated report showing all 2200 components at once in a grid. The simple grid that we had did not perform well in these circumstances. We knew some UI component libraries which provide a solution for this problem – buffered grid. But our grid had very unusual functionality and design, that's why
we couldn't use any third party solutions. So we've decided to implement an own buffered grid!

The idea of buffered grid is to render only a visible part of it at the moment. Whenever the user scrolls the contents up or down, we render all new rows that appeared in result to the grid. To make it possible, all the rows must have a fixed height in order to calculate the range of the rows that are visible in the current Y coordinates
segment. To make the scrollbar visible, we forcibly set the grid contents block height to the number of rows multiplied
by the row height.

The outcome was incredible. The grid rendering time was improved from 20 seconds to less than a second.

**Problem #3. Data binding handlers accumulation**

Here is one more pitfall of the model-view architecture. Let me give you an example. We have 2200 components, each component consists of 15 details. The components are grouped by units, 4 components in each unit.

Each detail has a property "condition". This is just a number showing you how much this detail is worn out. Detail conditions are taken from the JSON file, which can be updated from time to time. We extend this term to higher levels of the hierarchy by the next rule: condition of a component is the worst condition among all its details, condition
of a unit is the worst condition among all its components, and condition of the entire unit set is the worst condition among all units.

Any detail, component or unit can be excluded from the calculation process manually by the user. That's why we use data binding technique to calculate the consolidated condition of the higher levels in the hierarchy. In other words, whenever the condition of some object is changed (for example, the user has excluded some object from the calculation process),
we immediately recalculate the condition of all the objects which depend on this one.

And it works perfectly while we are changing the object conditions one by one. But here is a problem. If we perform a bulk modification of the component conditions (for example, JSON file has been updated and we must reload it), the algorithm gets stuck badly.

Look: we run the loop though all the details, and change their conditions. When we change the condition of the first detail, it triggers data binding handler to recalculate the condition of the component which includes this detail. To do that, we must iterate through all the details in this component and select the worst one.After that we trigger the unit to recalculate its condition. To do that, we must iterate though all the components in this unit etc.

And this is how we update just the first detail! And we have 33000 of them! The computational difficulty of this algorithm appears to be very high. So, for us, it took about 3 minutes to handle a JSON file update in these circumstances.

The solution was quite difficult to implement. For the time of bulk operation handling, we suspend all the data binding in our application:

this.suspendSynchronization();
this.loadDataFromJson();
this.resumeSynchronization();

It looks simple but contains quite a lot of code under the hood. The problem is that we still must recalculate everything after this bulk operation, and with the synchronization disabled it doesn't seem to be easy. We didn't want to duplicate the code which is already used for data binding, so we fixed the problem the next way.

Before, we had a single "condition changed" event in each of the objects in the hierarchy. We decided to split it to two: "condition reset" and "condition recalculated". First one is used for hierarchical data binding: whenever the condition of a detail is reset, we reset the condition for its component, unit and the unit set above in the
hierarchy. The second one is used for view data binding: whenever the condition of an object is recalculated, we
redraw it on the screen (so, its color is changed from green to red or so on).

If the synchronization is active, these two events are triggered simultaneously, so the application works as before. If the synchronization is suspended, then we just trigger the "condition reset" event and put the object to the calculation queue to be recalculated as soon as synchronization is resumed (unless this object is already in queue). So, when we resume the synchronization, we already have the up-to-date info about the condition of all the details, and we also know all their dependencies that must be recalculated one by one. This algorithm is linear and it is the fastest one that can get the job done correctly.**To be continued…**

This is just a first half of improvements that we've made in two intense weeks of optimization challenge. Wait for the
[next article](https://www.issart.com/blog/front-end-optimization-experience-part-2/) where we'll cover deferred rendering, on-demand calculations and PHP memory utilization optimization using JSON streaming.