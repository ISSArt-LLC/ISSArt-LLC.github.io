---
id: 2039
title: 'Database: How To Make a Bad Thing Work Well'
date: '2017-03-22T20:26:44+08:00'
author: 'Grigoriy Kosyanenko'
layout: post
image: /static/img/2017/03/boxbarimage5.jpg
categories:
    - General
tags:
    - database
    - 'database management system'
---

Our team uses [software development](https://www.issart.com) and database best practice and it turned out that developers got used to some of it and stopped looking at it with a critical eye.

There is a widely known opinion that implementing a business logic on the DB side is a bad idea. In most cases it is true, and can be explained in many ways.

- First of all, languages used in database management systems are less expressive and no-one would expect object-oriented or functional features from simple script tools.
- Secondly, they are less efficient and one would never think of using an embedded language of the database management system to write software that is CPU sensitive or memory consumption sensitive
- Finally, they are not that widely used. One does not often mention T-SQL or PL/SQL in their resumes, which just proves the fact that community of embedded languages cannot be compared in size to general purpose programming language community.

If you consider the possibility of splitting the code between the database management systems and the server there comes the problem of sharing responsibility, coordinating updates, etc.

### If It Ain’t Broke, Don’t Fix It

That’s why when the team encountered an issue where to place the business logic on another large project, it seemed there could not be two opinions – only the server.
![](/static/img/2017/03/Do-Not-Fix.png)
The project, alongside the other solutions, also suggested the integration with major music providers, such as [Apple Music](http://www.apple.com/music/) or [Spotify](https://www.spotify.com/int/why-not-available/). Also there was supposed to be the functionality enabling data matching for tracks, albums and artists received from different providers. Storage formats and implicit assumptions made by providers made us be thinking hard how to use the available data effectively. Anyway, the solution was found, formalized and implemented on the server side.

### A Good Beginning Is Half The Battle

![](/static/img/2017/03/Dia05.jpg)
As the load testing time approached, it turned out that its matching velocity left much to be desired. Engineers started discussing possible ways to optimize the code, whereas the project delivery deadline was approaching. It is worth mentioning that the matching functional was intended for gradual data income, but at the beginning of work a large amount of customer’s data was to be processed. Considering the factors received while load testing, the process could have taken days, or even weeks, which was completely unacceptable.

### We Need To Go Deeper

Having studied the work of the algorithm that was using complex heuristics and a large amount of metadata we came to a conclusion that it was database interaction that created a bottleneck. It was logical to transfer the data matching to the database. Regardless the complexity of the algorithm, it did not require advanced structures usage and massive calculations, which made the amount of expressive means of the database management system sufficient.
![](/static/img/2017/03/godeeper.jpg)
Several elegant SQL-requests allowed reducing the initial data matching time to several hours. Besides, when using intermediate results to analyse the effectiveness of each algorithm stage it became possible to improve the matching algorithm.

Scripts which were used to match the data in their turn became a prototype for stored procedures that encapsulated the matching algorithm.

### Conclusion

Summing up the above said, let us emphasize two main ideas.

*First:* habits are bad, even if they are good habits. Superstitions can be a block when making proper decisions, that is why in order to make a good decision one should consider different arguments and alternatives.

*Second:* if you are working with complex structure data or a large amount of data, it is more effective to use an instrument which is meant for that, namely database management system tools. Such functional segments should be clearly defined and, if possible, should not be large. Placing business logic on the database side is not a regular solution but can sometimes be really helpful.