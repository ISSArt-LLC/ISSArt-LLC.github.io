---
id: 2280
title: 'Benchmarking: Best Practice For Code Optimization'
date: '2017-10-10T18:48:37+08:00'
author: 'Irina Kolesnikova'
layout: post
image: /static/img/2017/10/microscope.jpg
categories:
    - QA/Testing
tags:
    - benchmark
    - benchmarking
    - codeoptimization
    - performancetesting
---

For most developers performance testing sounds like something really difficult to get started on. It might come to mind that some special and usually expensive environment and tools to test the performance.

Well, sometimes you do indeed need them to test the network communications impact, or if you have a cluster and want to measure its capacity, for example. But if you have some small system or you don't have a lot of money, you may still face performance problems. Sometimes you can't scale the environment, because it is expensive or your code has bugs preventing it from scaling.

Scaling doesn't mean just increasing the environment, but also making it **efficient**. If you add an additional node to handle incoming load, but your performance increases by 5%, it isn't the scaling, it is wasting of resources. Or if you spent weeks optimizing some part of the code, but finally got results even worse than before, that doesn't sound optimistic.

Sometimes the code works slowly. Or you think that some part works slowly and if you change it, the performance will increase significantly. How will you find the exact place in the code which should be optimized? How will you check if the performance has indeed increased? To answer these questions you need to write some performance tests, i.e. benchmarks.

## Micro and macro benchmarks

Generally, there are 2 types of benchmarks: micro and macro. The difference between them is similar to the difference between unit and integration tests, but generally, it is difficult to say that this benchmark is micro/macro, but another one isn't.

***Example 1.*** Imagine you have some special environment, where you emulate the load from thousands of users and analyze the throughput, response time, etc. Most likely this is a macro benchmark.
***Example 2***. Imagine you have a method in the code executing other methods and you call the first method with the real execution of all the other methods multiple times and measure the throughput and execution time. This can be either a macro benchmark or micro benchmark.

The benchmark depends on the functionality scope. For example, if you develop some business logic of a web application, your micro benchmark can check the method, writing some object to the database, however, if you develop the database driver, the same case for you will be the macro benchmark.

So, macro and micro benchmarks are relative.

However, there is a common pattern about the benchmarks. Usually you start writing macro benchmarks and gradually they evolve into micro benchmarks when you optimize the code.

## Correctness of the benchmark

Generally it is quite difficult to write your first benchmark for a real application, however, it contributes to a better understanding of the platform, your application and the third party code which you are using. Thus, I would say, it is easier to write benchmarks, as well as any other tests, when the code decomposition is clean enough.

Regarding the Java benchmarking frameworks, there is a good tool named [JMH](http://openjdk.java.net/projects/code-tools/jmh/). And [here](http://hg.openjdk.java.net/code-tools/jmh/file/tip/jmh-samples/src/main/java/org/openjdk/jmh/samples/) you can find a lot of samples with explanations how to write jmh benchmarks **correctly**.

Correctness is usually the most complex and controversial aspect of any benchmarking. It has the same theoretical problem as any other automated tests. Any significant mistake makes it useless. And in the case of benchmarks it is easy to fail especially when you analyze the results. Thus, the key parts of measurements to make a reasonable conclusion are *accuracy* and *sustainability*. Both depend on the code you want to test.

For example, if you want to measure the throughput of some 3rd party remote service or some database transaction, firstly, it doesn't matter if you save or lose 30 nanoseconds (accuracy) on each iteration, when such communications can take seconds, so any measurement (even timestamp before and timestamp after the call) can help you to understand what is going on in your code. And indeed you don't need to create some vacuum conditions to notice the improvement or degradation by seconds.

At the same time, if you see an extremal performance change (thousandfold, for example) in test results after some optimization it should be suspicious (sustainability). Or on the contrary, you don't see any divergence after some significant code change (for example you removed a long thirdparty execution) it should be suspicious.

Sometimes it is useful to have some baseline to analyze the benchmark results. For example, you want to measure the deserialization performance, most likely you will need a lot of different examples of the source data to have a more realistic emulation. Let's imagine you want to measure how quickly your algorithm can consume 100Gb of data.

Most likely you won't load all this data into the memory before the benchmarking starts. So you will have some overhead on the file reading which depends 99.9% on the capacity of your IO and the platform you are using. In this case it is useful to have the base line, so you can run the benchmark test on different environments and compare the algorithm's performance, but not the hardware.

You can write a simple benchmark to test IO throughput, just reading the same file without any parsing. So each time you run the parser's benchmark you can compare it to the “ideal” case. It will make your benchmark sustainable.

But what can you do if it seems that your code has some performance gaps? If you have benchmarks close to the code (like jmh tests module in the same project) it costs nothing to run your benchmark with the profiler. At the same time small benchmarks to some isolated parts of the code allow you to understand the performance profile better. Most likely you won't see that the most of time your code executes the Object.wait() or Unsafe.park(), but something more reasonable.
Also benchmark + profiler allows you to estimate the profit of the code changes you want to apply. Well it isn't a very reliable approach in terms of accuracy, when +-3 nanoseconds are crucial for your code, but it is very useful when you want to understand why some operation takes enormous time.

The result of a benchmark itself doesn't mean anything, however, you can sometimes use it to prove your viewpoint. The analysis of the benchmark results is mandatory and the conclusion must answer your initial question regarding the performance and/or optimization. Thus, it makes benchmarking one of the most significant parts of the performance engineering.

If you have some questions or want to share your experience, drop a line in our contact form.