---
id: 1889
title: 'Automated Tests: Why and How'
date: '2016-11-10T19:58:09+08:00'
author: 'Irina Kolesnikova'
layout: post
image: /static/img/2016/11/TestingAutomation.png
categories:
    - QA/Testing
tags:
    - 'automated test'
    - autotest
    - 'quality assurance'
    - testing
---

If you aren't implementing a prototype for some quick demo in some 8 hours, 3 days, etc. to archive it in a folder like the "trash" right after that, then you will have to think about the quality assurance, finding bugs, etc. Somebody will have to do this job after all. Whether you include the automated tests in the code development process or you totally rely on the testers, the automated tests will appear in your system sooner or later (or the project will die aborning).

The worst thing is that auto tests are also the code, i.e. all problems relating to the code development (the design, bugs, usability, performance, etc.) exist in tests. When you automate the testing, you actually **implement the new functionality in your system**. Thus, you should develop tests as any other features.

**Firstly**, you should understand the issue you want to resolve by automating the tests. "Improve the quality", "Reduce the number of bugs"… these goals are too general for developing the feature.

So what is the goal? "I have some [use cases](http://searchsoftwarequality.techtarget.com/definition/use-case) with an expected behavior, I would like to automate the validation of these use cases".

It doesn't matter how complex the use case is, it can be just a method call or a complex sequence of the user's actions, however, the use case must be clear and the developer must understand it.

It seems obvious that the use case, which you are going to check in tests, is defined by the functionality, which you are implementing; however, there are a lot of examples when the developer forgets about it completely while writing the tests (and sometimes implementing the feature). It results in unclear, unsupportable pieces of code, which make anything except checking the necessary use case, or contain some serious defects destroying the business value of the automated tests as a feature.

**Secondly**, any automated tests have additional requirements to meet:

1. The tests should be executed and passed;
2. If the test fails, its result allows us to find the cause of the error easily;
3. If the reason of failing is the changed use case, then you should modify the test, else you should fix another part of the functionality.

So the automated tests are an additional feature of the system, but why do we need it?

Every time you change the existent code you have a risk to break the working functionality. And it is quite difficult to write unchangeable code, especially at the start. Use cases are generally more stable than the code implementing them, so the code testing them will be more stable as well. It means you can significantly reduce the risk to make an error with the coming implementation change.

It is important to understand the difference between the business requirements and the use case. Business requirements can change a lot, but you will identify the most important and stable use cases to build the core of the system. And you can check these use cases automatically. For example, the use case can be "the data format can change any time and system should handle it correctly", however, it doesn't mean that your customer requires this. Perhaps he/she calls you unexpectedly and asks to make a small change.

The core use cases are stable and automated tests covering these use cases are stable as well.

Auto testing is a large area, thus I'll dwell upon some **advice** for anybody involved in the development process.

1. Start automating the tests as early as possible. It will allow you to identify the use cases and evaluate their importance and usability for the architecture. If you understand that you can't automate the testing of this use case on your level you have the possibility to modify and decompose this use case before you have it implemented. It will allow you reach the better architecture and save time.

For example, you have a requirement "a customer places an order in the system and in 5 minutes he should be connected with the operator". You can write a fast implementation and it seems working, however, you can't easily automate the testing of such use case, so you will probably need to split the original requirement to various use cases.

2. Modify the use case tests before you modify the use case implementation. If you find out that the automated tests support becomes costly, you perhaps should think about the refactoring of the use cases and tests. Probably you haven't taken into account some important non-functional use cases (like the code flexibility or clarity) and you should add them to the system.

3. Any test is an experiment. Any experiment has limits (limited environment, limited time, limited precision, etc.). You should define an appropriate limit of the test, if you isolate the use case too much, you can finally create the test which does nothing and doesn't meet its business goal. For example, you want to automate the functionality by sending the query to some database and receiving the result. This process can look simple, however, it contains various layers. The highest layer is your code declaring the executable method. The next layer can be [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping) or any other facade over the database driver. Then there is the driver, native environment and jungles. If your code doesn't have any additional functionality except the facade calling, it doesn't make sense to test this invocation isolated from the facade. Well, you can write the mock-verification, but it is the same as if you tested [POJO](https://en.wikipedia.org/wiki/Plain_Old_Java_Object), for example.

Thus, you should define the isolation level for the database tests. One solution I have met is the connection stub with the fake commit method. This solution isn't simple and isn't universal, but it is efficient in some cases.

4. You should isolate experiments from each other. You can introduce the dependency between tests to keep the performance (in case you can't objectively scale tests). It makes sense for some difficult algorithms or if you combine both unit and integration tests for the same component. Generally, you have a group of tests making the health check (the [sanity](http://www.dictionary.com/browse/sanity-check), minimal, etc. check) of the functionality, and if this group fails, it doesn't make sense to execute another group, because it will fail as well. This is likely to be the single case when the dependency between tests helps you to improve them as a business feature. In all other cases test dependency is the risk of the data race, randomly failed tests, etc., so beware of it.

Generally, I would like to say that the ability of the development team to write automated tests qualitatively relates directly to the final quality of the product implemented and supported by this team.

ISS Art developed a universal framework for creating automated tests for [web applications](https://www.issart.com/en/services/details/service/web-development) that can reduce your budget for testing by 35 per cent.

Do you want to know more about this framework? Please fill the contact form above.