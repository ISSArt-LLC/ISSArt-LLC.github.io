---
id: 1428
title: 'Microservices: dreams and reality'
date: '2015-12-24T12:56:05+08:00'
author: 'Irina Kolesnikova'
layout: post
image: /static/img/2015/12/board-780321_1280.jpg
categories:
    - General
    - 'Web Development'
---

**[The Microservices Architecture ](https://en.wikipedia.org/wiki/Microservices)**becomes more and more popular. The successful experience of our large-scale and well-known projects inspires us to try this approach in our enterprise applications. Deciding to implement the project in this style, we forget that systems like [Ebay](https://en.wikipedia.org/wiki/EBay), [Facebook](https://www.facebook.com/?stype=lo&jlou=AfdbbFYtg7TS6yNYS_xjvkZCy_D3XIVrw4kVnA3c9asKbdCqap1YXeXCFyphAfAY2H-owwiCRKtA6Y_C4qg4a0jvIyRFLVxM9c_ZHh8hTKCNsw&smuh=4136&lh=Ac8v0ARcUr5yqhNh), [Amazon](https://en.wikipedia.org/wiki/Amazon.com), etc have a long history, these projects are not initially implemented in the architecture, but gradually came to it.
When you don’t have the whole scope of the requirements or use cases for your system it is hardly possible to avoid errors in the design.

At the same time, the Microservices Architecture isn’t another definition for [Services Oriented Architecture](https://en.wikipedia.org/wiki/Service-oriented_architecture). SOA is about the code, micro-services is about the infrastructure and the code. You can implement the monolith application following the SOA. And it can make your life easier if you decide to split your final result into several services. However, it doesn’t mean that you can easily extract some module or group of modules of your SOA-designed monolith application as the independent service.

## The Microservices Architecture as any distributed approach has the same pros and cons.

When the distributed solution appears somebody asks: “What about the consistency?”
Most likely you won’t be able to make services completely independent of the data they manage, so you’ll have to maintain the consistency by yourself.

If you don’t develop the real-time system, the eventual consistency will be enough in the most of use cases. When your customer says that he needs the real-time update of the user profile picture, displayed with the user’s comments, most likely he doesn’t need it.
Well, it won’t be user-friendly to delay this update for several days, but several seconds can be reasonable.

At the same time, when you resolve the consistency issue it is very important to know the performance requirements. You can introduce a queue between the services to reach the eventual consistency, you can use one from the box ([RabbitMQ](https://en.wikipedia.org/wiki/RabbitMQ), [Amazon SQS](http://aws.amazon.com/ru/sqs/), etc.) or implement it by yourself. And if the queue is scalable, this solution will serve any load. But you don’t need a universal solution, you need a working one.

[![banner-1018104_1280](/static/img/2015/12/banner-1018104_1280-1024x361.jpg)](/static/img/2015/12/banner-1018104_1280.jpg)

For example, you have the collection of books. A user can rate the book. And you need to implement some kind of smart search for the books and sort the results by the average rating. The eventual consistency is sufficient for the book rating.
Thus, rating some books the user does not expect a real-time change in the sort order.

Yes, you can extract rating and search services, introduce the queue between them and thus reach the eventual consistency between these 2 services. It will be a kind of perfect solution, but you don’t need perfect, you need a working one.

For example, you are going to start with 3 million books and 100 users in production, you don’t expect an extremal increase in the number of users after the release and each user is ready to spend an hour of his/her life per day on rating the books in your application. At the same time users don’t put the rating randomly, let’s assume that they need 30 seconds to take a decision.

With simple calculation you can estimate the incoming updates. In this case you will have less than 1 % of the data updated per hour and in the worst case all updates will take ~200Kb and you can just get them on the search service side in the background task. So do you really need the queue here?

The solution of the consistency issue can be cheaper if you know your performance requirements. The consistency requirement is what you must think twice before you decide to extract the independent service.

## Conclusion

As a developer, I think the microservices architecture is a kind of optimization you can do after the successful release in production. It is the way to go from a working solution to the perfect one.

[![heart-rate-459226_1280](/static/img/2015/12/heart-rate-459226_1280-1024x724.jpg)](/static/img/2015/12/heart-rate-459226_1280.jpg)

### ***We want your feedback***

***Do you have any experience with Microservices Architecture? Let us know by leaving us a quick comment right now.***

***We’ll be glad to share expertise!***