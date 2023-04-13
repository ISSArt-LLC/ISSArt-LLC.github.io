---
id: 2581
title: '10 Best Practices of Scripting in Apache JMeter'
date: '2018-04-11T15:07:39+08:00'
author: 'Roman Aladev'
layout: post
image: /static/img/2018/04/computer-2788918_960_720.jpg
categories:
    - QA/Testing
tags:
    - 'Apache JMeter'
---

In this article, we will discuss the best practices when using the Apache JMeter. Each tool has its own advantages and disadvantages and we will specify the points to which you should pay attention when working with this tool. Apache JMeter is one of the most popular load testing tools. It can be used to test the performance of both static and dynamic resources.

## Why Apache Jmeter?

- It can be applied to a large stack of technologies – HTTP, MQTT, XMPP, WebSockets, etc. Initially, it was developed for testing web applications, but since then it has significantly expanded to test a wide variety of protocols.
- And even if you failed to solve your issue with a standard set of JMeter components, it is highly likely that the huge [community](https://stackoverflow.com/questions/tagged/jmeter) has already solved a similar question or is ready to help you, or perhaps the issue has already been solved as an [extension](https://jmeter-plugins.org/)for the JMeter.
- Also this product is an open-source application and therefore it is free of charge and you can always see what is inside of some controller, core, plugin and if you wish (or if it is required for the project) you can modify the source code of JMeter or the components.
- And finally, of course, we should mention a convenient GUI and as a result, the tool has a low barrier to entry. For those who do not like GUI and bulky XML, you can [write](http://uttesh.blogspot.ru/2015/04/jmeter-load-testing-by-code-jmeter-api.html) tests using the JMeter libraries. It turns out to be rather laconic and compact.

**But this article is not about the pros and cons of JMeter, but about what you should and should not do using it:**

1. **Always use only new stable versions of applications.** In our case, it is Java and Apache JMeter (and its plugins too). All projects are being actively developed and their shortcomings are rectified. For instance, with a high degree of probability in JMeter <2.9 you may get a ‘Memory out’ exception or unexpected closure of the TCP socket and as a result you will get incorrect test results. The last of them is fixed in newer versions. And to see the second, you need a much greater load than before.
2. **Use GUI only for the development and debugging of JMeter scripts; To generate load, tests should be run from the console or remotely.** Do not forget that JMeter is a java app, and they are (very) demanding of resources such as CPU and Memory and JMeter is not an exception to this rule. GUI consumes a large amount of the load generator resources, and this situation can significantly affect the test results. So it’s not suitable for collecting accurate statistics.
3. **The limit for one load generator is 300/400 threads (Number of Users)**. This restriction is caused by the bandwidth of the generator and this means that if the number of competitive threads exceeds this limit, your load generator will not be able to process such a number of concurrent requests and the test results will be distorted again. For example, JMeter will have to wait for access to the CPU to process the transaction and as a result, we will get incorrect results.This is not a fixed value and it depends on the power of your load generator.
4. **Reduce the influence of the generator on test results. Structure tests.** As you may have noticed, in the items above we described the ways how to exclude the influence of the load generator on the test results. Now it’s the turn of the test design: 
    - *Do not use heavy Listeners like Visual Tree and Visual Table.* Data processing by them takes a lot of resources.
    - *Do not store absolutely all information.* Reading and writing also absorb resources. Therefore, for example, save only errors.
    - *Do not add unnecessary post / pre-processors and configuration items.* They will also need the resources of your generator.
    - *Save the results in CSV, not XML*. XML is verbose and its writing and analysis requires more resources than working with CSV.
5. **Reduce the influence of the generator on test results. JVM.** Now, remember that JMeter is a java app and let’s take care of the JVM configuration. It is very important to tune the JVM arguments, so that JMeter can work at its full capacity: 
    - *Increase Heap Size.* This parameter contains the memory size that JMeter can use during its operation. On older versions of JMeter you could often see the OutOfMemory error, which was solved and solved by increasing the value of this parameter.
    - *Enable Server mode.* Performance of JVM is higher in this mode because of more optimized compilation algorithms. Therefore, we can get a greater throughput of the load generator.
    - *Use ConcMarkSweepGC.* The topic of garbage collection is extensive, it can be the subject of a separate article series and resemble something like dark art, but in brief, this algorithm works faster than ParNewGC.
6. **Parameterize your test.** Parameterization in our case is the declaration of all necessary values like Number of Users, an address of testing environment as parameters for their subsequent modification without editing the test. 
    - *Declare all parameterized parameters in one place.* For example, all variables can be declared in a UDV or test plan, and then used throughout the test. This will greatly facilitate their support.
    - *Do not use local paths.* Otherwise, your test can not be transferred to another machine and immediately run, without editing the paths. Use relative paths – if you specify only the file name, then JMeter will look for it in the same folder with the script.
    - *To store and edit variables, use the properties file.*
7. **Do data correlation in the right way.** Correlation stands for the fetching of dynamic data from the preceding requests and posting it to the subsequent requests. For instance, you logged in and get user ID as a response, which should be used in subsequent requests. In JMeter there are a lot of data extractors and handlers and you need to understand the basic principles of their work. 
    - *Avoid the XPath extractor.* Because to extract the data it will need to build a DOM and out of this, it uses more resources than, for example, RegEx Extractor. Or you can use the CSS Extractor if the page has a too bulky DOM and not so many CSS/Styles.
    - *XML Assertion, XML Schema Assertion should be avoided too.* Because they build an XML Tree that also consumes resources. And it may be replaced with Response Assertion.
    - *Locate the data extraction location.* As a rule, in extractors, you can specify the area in which it will search for data. Do not use the whole answer for the search. If you reduce the search area, you will reduce the resources used.
    - *Use JSR223 with Groovy and caching.* One of the great abilities of JMeter is the modification of the script using programming in a good number of languages: Scala, BeanShell, Javascript, Groovy. And the fastest bundle is JSR223 with Groovy.
    - *Use the built-in functions of JMeter, instead of coding, if you can.* Using of the built-in function is less costly than adding a new pre / post-processor or a sampler to generate a new value or process a string.
8. **Stick to one consistent scripting style.**It will make life easier for you and your team, who will read and use your scripts. For example: 
    - Variables are named in the same style, for example CamelCase.
    - HTTP Samplers contain the request type and endpoint in the name – POST /api/login.
    - Post/pre-processors contain type of controller and action in the name – \[RegEx\] Extract UserId.
    - Controllers contain the controller type and the action that combines the samplers in the controller – \[Loop\] Send WS message.
    - Logical actions of the user are combined using Simple Controller – \[Simple\] Open Login Page.
    - Comment a significant part of the test and your code.
9. **Other little notes which you should pay attention to:**
    - *Follow the scope of testing.* You do not need to load third-party services like YouTube. They have their own load testing.
    - *Use the recorder to write scripts more quickly, but carefully check the results of the recording.* Also, to record the behavior of applications with a large number of concurrent requests, it is better to use a third-party proxy application like Charles, Fiddler, Burp Proxy. Because JMeter recorder takes time to create the elements and it can take a very long time.
    - *If you are writing a script for use cases, try to maximize the behavior of the user.* Use timers to delay actions in places where the user is thinking, do not run 300 users at once, do it sequentially, etc. But at the same time, do not focus too much on it, if it takes a lot of time.
    - *Before you invent anything, try searching.* StackOverflow and Google are your friends, who would help you to reduce time costs.
    - *Do not use live results.* This is due to the use of Grafana and similar services. Data transmission also uses the resources of the generator. Use the results after the test is completed.
10. **JMeter is not a cure-all.**  JMeter is a good tool with a long history, huge community and a large number of supported protocols, but there are times when it is better to change the tool. For instance, there is nothing to process Server-Sent-Events with in JMeter. But instead of writing the handler yourself, you can just use another app for load testing – Gatling. Or if you have limited resources and you need a closer integration with the programming language, you can use Locust, but it only works with HTTP Requests and the programming language is Python.