---
id: 2151
title: 'How to grow your project without failing at architecture, scalability and system integration'
date: '2017-06-19T20:10:59+08:00'
author: 'Alexey Mozhenin'
layout: post
image: /static/img/2017/06/growing-project.jpeg
categories:
    - General
tags:
    - 'project architecture'
    - scalability
    - 'system integration'
---

Today I would like to talk about problems of project growth. Suppose you're doing the right things as we did. We ate lots of pizzas, had lots of fun and worked very hard. And the first project architecture design was made on a napkin during a lunch break. But even if you're doing all of the above, there is no guarantee to reach the goals of the project. The project can still ruin under the weight of circumstances. This article is about things that may help to avoid that. It also focuses on project scalability and system integration issues.

## Project architecture of the first stage

If you thought that my phrase about a napkin was a joke, it wasn't. Okay, it is not a requirement, but the idea is good indeed. By doing that we are trying to reach several goals. At the project start we usually have very limited understanding as to what we are going to implement. Also we want to avoid specifying too many details not to have to change them in the future. A napkin helps all this to happen – we can put there just the most general details and make clarifications later when we have more information.

## Project modularization

Try using a napkin to put there the main system components. Usually they are defined in "natural" way. In our case, we had the data that should have passed several phases in its lifecycle. In that case "natural" way was to separate services responsible for different phases.

*Shall we introduce software project scalability from the beginning?*

Here is my answer – don't try to make a scalable project the main goal. Usually, at the beginning you don't need scalability, because you don't have such high loads that require several servers. Usually one server survives the load. To get project scalability we introduce changes into the code and sometimes in system architecture. These changes often involve compromises or even flaws that influence future growth and functioning of the project. You could also make a mistake of introducing preliminary optimization. Suppose you've started a new [Java](https://www.issart.com/en/lp/java-development-team/) project. You expect a great number of users and start to optimize the frontend to handle huge load (and spend lots of resources on that) from the very beginning. And then the first production release comes and it appears that your backend can survive only 10 users (we are not discussing the cause of it in this article). Obviously frontend optimization could be a little postponed. We should not make [performance optimization](https://www.lp.issart-site.issart.com/java-expertise/backend-performance-optimization) before we have found performance problems and the cause of the problem, because you don't know yet where these problems are. It often happens that our predictions about possible bottlenecks turn out to be wrong. We should take care of scalability only when we already have real observations of the system behavior which lead to problems. On our project we haven't reached the state yet where we need to introduce horizontal scaling. Yes, we run our services on different servers but that is more like splitting of services to different groups by functionality than horizontal scaling.

## Integration versus scalability

I'd say these are opposing goals. When we do a simple master/slave replication on the database, we make the system configuration more complex. When we horizontally scale our service, we increase the number of instances of our services and make the system configuration more complex. It seems obvious that complex system integration is more complicated than the integration of a more simple system. If our service is at the same time stateful, this will make the system integration even more complicated. We can consider it as another reason against making the system scalable from the very beginning. On the other hand, occasionally we reach the point when we need to take care about scalability. What to do when your application works with a third party service? The answer depends on the details. Suppose on your project you made an agreement with your friend John who wrote a cool service which appeared to be very helpful for you. This service is hosted on John's home server because John feels more comfortable having it there. And then comes the time when your project's load has increased and you want to scale your services. Then a problem arises: John is not ready for the high load and he doesn't want to migrate from his home server. Oops… To prevent such situations we try to isolate work with external 3<sup>rd</sup> party systems into separate services or at least separate parts of code. In the situation with John this potentially allows us to not scale the service working with his server. It's true that this is not always possible (when we do not scale work with John's service, we can have problems within our system that are not so easy to solve), but this will allow us to have more options and some possibilities to solve such problems.

## Conclusion

Summing up, here are main ideas.

*First*, let the project architecture grow. Good architecture is the one where the final decision can be postponed. After making architectural decision, in order to change it you will spend significant resources.

*Second*, try splitting the system into modules. Modularity will help to control your system. If you see any "natural" split, make use of it.

*Third*, say 'no' to preliminary optimization. If you don't have any performance problems, don't try to optimize. You don't know yet where the bottleneck is. Add scalability when you have problems and you have information where scalability is necessary.

Try to make parts of the system integration with 3<sup>rd</sup> party systems as separate services.

Have you got any problems while growing your project up? Add your comments below.