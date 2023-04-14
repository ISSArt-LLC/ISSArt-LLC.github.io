---
id: 1571
title: 'Challenges of Amazon MWS API: ISS Art experience'
date: '2016-02-19T13:24:14+08:00'
author: 'Dmitry Tyutyunnikov'
layout: post
image: /static/img/2016/02/amazon-447034_1280.jpg
categories:
    - General
    - 'Web Development'
---

This article is focused on Amazon MWS API and some challenges related to its integration.
If you plan to integrate Amazon MWS into your PHP project, you should think twice whether you need this functionality or not.
In our Symfony project such integration is needed. However, there are a lot of hidden dangers. In the article I will try to give you a heads up how to avoid the pitfalls.

**First of all, what exactly is Amazon MWS API?**
Amazon Marketplace Web Service (Amazon MWS) is an API which helps Amazon sellers to exchange information on listings, orders, payments, buyers, reports, and more. XML data integration with Amazon makes higher levels of selling automation possible, and this helps sellers significantly grow their business. With Amazon MWS being applied, sellers get an opportunity to increase their selling efficiency, decrease labor effort, and improve response time to customers.

[![graph-163549_1280](/static/img/2016/02/graph-163549_1280-300x240.jpg)](/static/img/2016/02/graph-163549_1280.jpg)

**Сhallenge №1**

The first and, in my opinion, the most challenging task is the lack of API testing sandbox. What does it mean? Amazon doesn’t enable us to create a test account or transfer a real account in test mode. Amazon allows developing and testing integration using live data with live payments. Such a large enterprise and such a big omission!
As a result, we have registered an account and faced the following challenge:

**Сhallenge №2**

Amazon distributes its SDK (software development kit) for MWS API only as a zip-file. In our project we use Composer to connect with third-party libraries; and we faced an issue how to connect the Amazon MWS SDK and not to store it in our repository.

[![puzzle-1020057_1280](/static/img/2016/02/puzzle-1020057_1280-300x300.jpg)](/static/img/2016/02/puzzle-1020057_1280.jpg)
In addition, there is one more issue: how to load a library with legacy code which doesn’t use autoloader. To store the SDK, we created a separate git repository and added this repository in composer.json. At this stage it’s necessary to resolve the issue with loading the library. There are at least two options:

- *Modify SDK so that PSR-0 avtoloader could work.* Therefore, we have to replace all relative paths to library code with dirname (\_\_ FILE\_\_). SDK spreads under the Apache license, so the modification is authorized.

Pros:
Everything looks good and correct.

Cons:
When a new iteration is released, we will have to monitor in manual mode that all our changes are not overwritten.

- *Use such option as “include-path” in composer.json .* But it is marked as DEPRECATED. As mentioned in the documentation:

This is only present to support legacy projects, and all new code should preferably use autoloading. As such it is a deprecated practice, but the feature itself will not likely disappear from Composer.

Pros:
Easy to update SDK.

Cons:
We have to use the deprecated parameter composer.json, it doesn’t look good.

**Сhallenge №3**

Amazon MWS API looks like Frankenstein! It’s made up of different parts (modules with different working models).

[![matrix-1013612_1280](/static/img/2016/02/matrix-1013612_1280-300x300.jpg)](/static/img/2016/02/matrix-1013612_1280.jpg)
For example, “Section Orders API” works as “request-> response” model, where we get the requested information immediately.
A “Section Reports API” works as “request-> queue-> response” model, where our request gets in line. Thus, to receive the requested data, we need to monitor its status in the queue.

Such situation made us write our own wrappers over the SDK and we’ve written … We have created a bundle for Symfony to work with Amazon MWS.
Meanwhile the services are limited by the needs of our project. That’s why we decided not to put it online at the moment.

We should also say some words about the documentation. It’s very informative with detailed description, examples, etc. However, it’s very hard to understand how to get some particular information about a product or an order (probably it’s a consequence of the third challenge).

***Conclusion:***

The process was rather difficult, but finally we won and integrated our project with Amazon MWS!

[![road-sign-940628_1280](/static/img/2016/02/road-sign-940628_1280-300x176.jpg)](/static/img/2016/02/road-sign-940628_1280.jpg)

**And what about you? Have you got the courage to fight with such a giant as the Amazon MWS? ;-)**