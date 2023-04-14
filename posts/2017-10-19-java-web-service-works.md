---
id: 2314
title: 'How Java Web Service Works'
date: '2017-10-19T12:53:49+08:00'
author: 'Olga Rekovskaya'
layout: post
image: /static/img/2017/10/monitor-862116_960_720.jpg
categories:
    - General
---

In this post we will uncover a Java web service concept. In particular, we will begin with Java advantages, then we will proceed with web server and web application concepts, and finally we will take a look at how a Java web service processes the request. We will also share some practical recommendations on tools and technologies that can be utilized when working with web services.

## Good things about Java

Let's start with taking a look at Java basics.

Before this language appeared, C++ was a widespread means of solving many programming tasks. What are the biggest challenges associated with it?

1. Memory management is a real problem. That is, programmers need to allocate and free up memory manually. A common mistake (even among the experienced programmers) is to forget to free up memory. In addition, in C ++, the contents of memory can be accessed directly by the address, which means that, when working in one part of the program, the data of another part of it can be corrupted.
2. Program needs to be compiled for each platform (operating system and hardware) that we want to use it on.

Java was developed to resolve these issues.

First, it allows to free a developer from memory management. Second, Java code is capable of working on different platforms. This is achieved thanks to Java Virtual Machine (JVM) which acts as an intermediate layer between compiled Java code and platform. So all the developers need to run the code is having JVM for the platform needed. Fortunately, it's most likely that this JVM exists yet as it is provided by either Oracle or platform vendor. That is, we compile a class (or set of classes), and transfer it to JVM for execution.

This was briefly about Java advantages. Now we'd like to describe shortly how web servers operate.

## How web servers and web apps operate

A user goes to the Internet, enters a web address into the address bar… How does a user get the desired web page?

There are DNS servers. They act as a dictionary: there is a match list between the site name and the IP of the server where the site content is located (that is called "resolve name by IP"). This is for public servers. Which DNS servers exactly will be used for search (their IP addresses) depends on the connection to the network and on the provider.

Then, as soon as we found the address, our request from the browser is sent there. There is a special application installed on the computer with the specified IP address – a web server. Its task is to produce content. DNS servers can "tell" at which address a website is located. Then a web server returns the required content to a user.

There can be several applications present in one system. In this case, not only an IP address matters; such an abstraction as port is involved as well. Port is actually a certain number. So, when we see an IP address and a port, we address to a web server. To make this process more clear: different applications on the same computer have their own port (a unique number). For example, a web server typically has a port number 80 or 443 (for SSL). This is some kind of arrangement. So, when we type "http:\\ address" in the browser, in fact the request will go to the address on port 80, and if we type "https:\\ address", then it will go to the address on port 443. This way a server "understands" that this is an external request. Therefore, the task is to generate the requested content – e.g. images, PDFs, JavaScript objects. A web server produces static content only.

In cases when dynamic content is requested, however, a web server isn't capable of generating it. Say, in case of an E-shop content is dynamic: a catalog is constantly changing, users have their personal pages that differ from one another. Therefore, the dynamics needs to be recreated.

### How to achieve this?

A web server "understands" that it cannot do it on its own, and thus it redirects a request to an application. What kind of an application is it?

It should receive HTTP requests and produce content which cannot be defined statically. In addition, , it returns a web page (HTML).

In fact, any language can be used to create an application. But usually it's Java/Scala, PHP, Ruby, and Javascript (NodeJS) which is gaining popularity now. Normally we use the following programming languages to build such an app: PHP, Ruby, Java.

However, every time a web server needs to redirect a request to a web application, we deal with the same type of procedure:

- To receive a request from the web server;
- To transfer control over it to some business logic implemented using some programming language, which then generates a response;
- To return this response.

So, do you think it's reasonable to write the same kind of app every time? We don't think so either. It's much better for a developer to focus on the logic, but not on the low-level infrastructure.

In order not to do the same stuff over and over again, special standards and application servers were developed. In the application server, each application is run in a container and uses the infrastructure and libraries of the server application.

The application server acts like an infrastructure intermediate layer between the web server and the compiled code that would process the request. Moreover, modern app servers include a built-in web server.
![null](/static/img/2017/10/webappserv-Page-1.png)
Authorization is an essential part of many programming solutions. As our experience shows, application server can be of much help in implementing this feature as well, especially when we deal with larger systems. That is, application server can implement authorization by the lists of users that can be kept in some third-party storage. How is this actually achieved? A server can be configured in such a way that allows to check users for compliance with the certain criteria.

And, a few words about requests. Based on a URL, a server "understands" what kind of request is received, and transfers this request further for processing.

Let's give an example. Say, there is an online store. The page \\delivery will show the delivery methods. It is static, so, the web server will generate it directly, without the participation of the app server.

The page \\goods will show the list of goods, it is dynamic. The page \\top10 will show the top 10 products, it is dynamic.

This sample should make the process more clear for you.

## Java web service workflow

Now, let's take a look at a typical Java web service. What is the key difference between a web service and a web application? A web application returns HTML, and a web service can return any object, but, as a rule, this is XML/JSON.

So, a Java web service receives a HTTP request as an input, and generates a structured XML/JSON as an output. A request is parsed, then what needs to be done is defined based on the parameters, and a response is generated.

When working with web services, developers often apply Simple Object Access Protocol (SOAP) and Representational State Transfer (REST). Which one to choose? We would say that your choice will depend mostly on a project specifics and its complexity level.

The message object in SOAP is XML, and in REST – JSON. JSON is compact, and Javascript works with it perfectly. In SOAP you can use more complex messages and, for example, add a digital signature.
In case you deal with UI-server interaction, we recommend using REST services. And if there is a complex case (say, a system you have communicate with a couple of other systems, and transfers data further to another ones), our advice would be to use SOAP.

In addition, there are special frameworks that work with web services. To name a few:

- Apache CXF and Apache Axis that are applicable for SOAP services;
- Jersey and Spring frameworks that are suitable for REST services.

We've covered the basics of how a Java web service operates. Do you have something to add? Probably you had some outstanding examples in your programming practice that you would like to share. Feel free to do this into the comments box below!