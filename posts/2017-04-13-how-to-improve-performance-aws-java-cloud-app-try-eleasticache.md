---
id: 2092
title: 'How to Improve Performance of AWS Java Cloud App? Try ElastiCache'
date: '2017-04-13T18:27:47+08:00'
author: 'Irina Svirkina'
layout: post
image: /static/img/2017/04/database.jpg
categories:
    - 'Web Development'
tags:
    - elasticache
    - 'java cloud'
    - memcached
    - 'performance optimization'
---

Usually startup projects grow gradually starting as prototypes. The load increase unnoticed, so at one point your server might lay down, because it didn't manage to handle the number of incoming requests. Fine. We can hide a web application behind an http-server/servers to optimize work with static content. Additionally, we can create several instances of our web application for load balancing and fault tolerance. Some more options to improve performance of AWS Java cloud app is described in my colleague's [article](https://www.issart.com/blog/reach-performance-optimization-cloud/). But what to do if your database is a bottleneck? If you have a lot of information frequently asked, which can be cached in the memory, then it's worthwhile to try Memcached.

### What is Memcached?

Memcached is a caching system aimed to speed up a web application by storing small fragments of any information. In short, this is a client-server system helping as much as possible to avoid extra requests to a database. Instead it returns data stored to the memory of a Memcached server (or a Memcached cluster) located nearby.

Data segmentation by a key hash is the solution to achieve Memcached distribution.

Asked to retrieve data by a key:

- a client library first calculates the key hash;
- secondly, chooses a Memcached node based on the key hash;
- finally, retrieves the data required.

A node failure must be seen as a cache miss, i.e. like a normal situation. This allows admins to do hot swapping and hot plugging of Memcached nodes, so a Memcached cluster can be changed/increased in runtime without any problem. So it can be used to create scalable solutions.

### How do we use it?

In our Java enterprise web application we use Memcached for throttling and long-term storage of sessionIds which, additionally, solves the problem of sharing sessionIds between several web-server instances.

Memcached protocol doesn't require authentication, so a Memcached server can be used by any client, who knows the host and port (provided that the port is open for the client).

Usually Amazon ElastiCache is used as Memcached server by applications located in AWS cloud. As for local development I recommend working without memcached server to simplify the setup of developer's environment. So your web application should adapt and work correctly with and without Memcached server. We use [spymemcached](http://code.google.com/p/spymemcached/) as a Memcached client library.

### SessionId

SessionId is an id of the client's session. It's usually stored in the client's Cookies. By default sessionId expires in 2 days in our web application. Also the max number of sessionIds can't exceed 250 000.

Before our web application stored sessionIds in the database, but over time this became the cause of performance decrease. That's why it was decided to store sessionIds in the memory (in Memcached).

### Throttling

Throttling is a limit to the number of API calls on behalf of one user or on behalf of an anonymous user from the same IP.

A logic of our throttling filter is the following:

- if Memcached doesn't contain a value for the sessionId, add the pair (the client's sessionId and 1) to Memcached;
- if Memcached contains a value-counter for the sessionId, then increment the counter;
- the same for an anonymous user, who has IP instead of sessionId;
- handlers of any API call firstly check, whether corresponding counter exceeds the limit of 200 requests per 300 sec. If it's exceeded, then the API call is rejected with an error status.

### Conclusion

I think Memcached is a worthwhile and an easy in use technique helping to decrease the load of your database. So if you have a lot of users, then their temporal information should be stored in Memcached.