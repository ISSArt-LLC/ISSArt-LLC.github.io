---
id: 1832
title: 'How to Reach Performance Optimization in the Cloud'
date: '2016-08-26T17:48:58+08:00'
author: 'Grigoriy Kosyanenko'
layout: post
image: /static/img/2016/08/cloud-it-concept.jpg
categories:
    - 'Web Development'
tags:
    - 'cloud infrastructure'
    - 'cloud perfomance management'
    - 'Java application'
    - 'performance optimization'
---

*The cloud is becoming more and more important, so organizations need to make sure they reach performance optimization. This article shares some challenges with the cloud and offers solutions.*

More and more companies are embracing the flexibility, low barrier-to-entry, and collaboration that the cloud offers. The Infrastructure as a Service market has been growing by more than 40% in revenue every year since 2011, according to [Gartner](https://www.gartner.com/newsroom/id/3354117). This trend is only expected to continue to grow more than 25% per year through 2019.

The [cloud](https://www.issart.com/blog/propagating-cloud-based-application-development/), which has been dismissed as a fad, is quickly becoming the default method for delivering IT solutions. Everything from infrastructure design to [Java](https://www.issart.com/en/lp/java-development-team/) application development needs to take the cloud into account.

This rapid development of the cloud has made the deployment of scalable architectural systems much easier than traditional methods. While there are a lot of benefits to cloud computing, it isn't without its unique challenges.

For example, infrastructure providers like AWS have demonstrated they can handle large scale hosting, they have geographical backup resiliency, and can take care of operational details like load balancing and server capacity, but you're still on your own when it comes to managing and achieving performance optimization.

In this article, we're going to look at some of the challenges of deploying a cloud infrastructure, specifically making sure different components of your system are communicating. Then, we'll explore some of the tools and solutions that exist for making sure that you optimize your cloud infrastructure.

**The Main Challenge of a Cloud Infrastructure**
You could probably cite many challenges — like privacy, security, and data ownership — that come with adopting the cloud. For the sake of this article, I'm going to focus only on performance optimization and management.

Poor performance is typically linked to poor application performance. To a user, poor performance is the same as service being unavailable or slow. We all know that poor application performance can cause your organization to lose customers, reduce employee productivity, and reduce the bottom.

Cloud performance management is going to continue to be one of the major problems that impedes cloud adoption. For example, virtual machines can experience increased degradation from a neighboring core on the same physical host — known as noisy neighbor effect.

On top of that, when you invoke a service in a cloud-based infrastructure is a much more difficult problem than trying to invoke the same service on a physical infrastructure.

On a cloud-based infrastructure, service instance have dynamic network location assigned to them. To make matters worse, a set of services typically changes has a network auto-scales or upgrades. All of this makes service discovery on the cloud very difficult.

You might think this is just another reason not to migrate to the cloud, but the cloud is quickly dominating the marketplace. It's only a matter of time before the cloud becomes necessary for all organizations.

While performance optimization is certainly a concern — along with security, data governance, and more — the progressive CIO needs to address these issues like any other IT problems. We need to be proactive at creating contingency plans and give thought to our architectural design.

**Service Discovery to Improve Performance**

As I mentioned earlier, one of the problems with a cloud infrastructure is trying to invoke a service. Due to dynamic network locations, designing your architecture with service is discovery in mind is an absolute must.

You can pick a client-side or server-side discovery pattern, but either way, you'll need a service registry. This is a database containing the network locations of service instances. In order to discover service instance, the registry needs to be highly available and up to date.

Some examples of service registries include:

● [Zookeeper](https://zookeeper.apache.org/?utm_source=service-discovery-in-a-microservices-architecture&utm_medium=blog): Originally a sub-project of Hadoop, Zookeeper is a widely used coordination service for distributed applications.
● [Etcd](https://coreos.com/etcd/): A distributed, consistent key-value store that is used to share configuration and service discovery. A simple use-case is to store database connection details.
● [Consul](https://www.consul.io/): A distributed, highly available service discovery tool. It allows organizations to gain a high-level awareness into their applications and architecture. It also performs regular health checks to determine service availability.

You might wonder which one is the best. That depends on your organization, but Consul does have an advantage over their competitors.

When it comes to registering and deregistering service instances from the registry, one option is for a service instance to register themselves. The other option is for some other system to handle the registration on behalf of the service.

Unlike Consul's competitors, Zookeeper, Etcd, and others, Consul doesn't require you to build your own service discovery system — it has a self-registration pattern.

Your organization only needs to register services and perform discovery using the DNS interface or HTTP REST API. Other tools require you to build hand-made solutions or use third-party tools.

**More About Consul**

Consul is a distributed, highly available service discovery tool and key value store. Meaning:

● Distributed, Highly available: It just means that Consul runs as a cluster of systems so that it removes any single point of failure.
● Service Discovery Tool: This is the biggest advantage to using Consul. It acts as a database containing the network locations of service instances. Part of the service discovery tool is a [health checking component](https://aws.amazon.com/ru/blogs/apn/aws-codedeploy-deployments-with-hashicorp-consul/) that ensures that the provider of a service is working as expected. If it's not, it routes traffic away from the unhealthy host.
● Key/Value Store: Flexible key/value store for dynamic configuration, feature flagging, coordination, leader election, and more.

**Conclusion:**

Cloud computing isn't going away. If the trends continue, we can expect cloud computing to become a large part of every organization. So, it's important that we begin to design our architecture in relationship with the future of the cloud.

The cloud isn't without its challenges. Finding service instance on a cloud-based infrastructure isn't as simple as finding them on physical hardware. However, it's not a good reason to delay migrating to the cloud. Every organization has to begin planning and using tools that will address the issues with cloud computing.

Tools like Apache Zookeeper, Etcd, and Consul can help organizations discover and make sure their services are available. They can gain a high-level awareness into their applications.

Before your organization starts a performance optimization, you will want to do an analysis. This will help you identify the parts of your system that need to be optimized.

ISS Art can help you conduct an analysis on your system. An improved system will mean an improved bottom line, greater employee productivity, and higher customer retention. If you're ready to move your business forward, [contact us](https://www.issart.com/en/lp/java-development-team/) today.