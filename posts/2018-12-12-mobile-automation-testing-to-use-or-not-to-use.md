---
id: 3120
title: 'Mobile automation testing. To use or not to use?'
date: '2018-12-12T20:37:00+08:00'
author: 'Semyon Boryshev'
layout: post
image: /static/img/2018/12/adult-app-developer-business-1181244.jpg
categories:
    - 'Mobile development'
    - QA/Testing
tags:
    - appium
    - 'automated test'
    - autotest
    - Java
    - 'mobile app'
    - 'mobile automation testing'
    - 'mobile automation tools'
    - QA
    - 'quality assurance'
    - Swift
    - testing
    - 'ui tests'
    - xctest
---

To use or not to use – every customer asks themselves this question, when it comes to mobile automation testing. They say that development and supporting of UI auto tests costs too much. But let’s return to the statement a little bit later. And now we are going to discuss the following questions: what is mobile automation, who is it for, what for and do you actually need it?

In layman’s terms, Mobile automation is a process of test development in some programming language for further auto execution on a mobile device.

There are a lot of different frameworks for mobile automation testing and each of them has its pros and cons. To decide which one to use – you should understand which operating systems your app works on, it might be iOS, Android or both (there are other operating systems, for example: Windows phone, Firefox OS, Ubuntu touch etc., but we do not consider them, because their market share is less than 2%). So the list of the most popular mobile automation tools at the moment is the following:

- Appium
- Robotium
- Selendroid
- Testdroid
- XCTest

Let’s look at these tools in comparison:

[![](https://issart.com/blog/wp-content/uploads/2018/12/2018-12-12_1904.png)](https://issart.com/blog/wp-content/uploads/2018/12/2018-12-12_1904.png)


From this table you can see that only one framework is designed for testing iOS applications only. Most of them are used to test Android apps only. But two of them are cross-platform and only one is free. That’s why Appium is the most popular framework for mobile automation testing. On the other hand, they use XCTest more often for testing iOS apps because of the following reasons:

- Fewer compatibility issues after updating XCode/iOS;
- Grey box testing (deeply integrated with development);
- Tests run more efficiently (faster and fewer random errors);
- It allows executing performance testing of an app;
- Easier to install than Appium.

Let’s find out who needs mobile automation testing. On the one hand, this process is necessary for testers to optimise testing, it allows unifying repeatable operations, to free more time for other types of testing (i.e. exploratory), besides, it excludes human error, which can be both good and bad:

Good: a tester can miss some checks either because of forgetfulness or thinking that those checks were successfully validated during the previous build of the app and so should be successful in the present build too.

Bad: only a human is able to verify some unique cases, for instance: place five fingers on the screen and try interacting with the app with the other hand. 

On the other hand, the process of mobile automation testing is needed for a customer. The first and the main goal is to save money. Yes, everyone knows that UI tests are the most expensive tests and their development takes a lot of time, more than other types of tests. You must have seen the testing pyramid:[![](https://issart.com/blog/wp-content/uploads/2018/12/To-use-or-not-to-use-этим-вопросом-задаются-все-заказчики-когда-речь-касается-автоматизации-тестирования-мобильных-приложений-e1544614179106-300x228.png)](https://issart.com/blog/wp-content/uploads/2018/12/To-use-or-not-to-use-этим-вопросом-задаются-все-заказчики-когда-речь-касается-автоматизации-тестирования-мобильных-приложений-e1544614179106.png)What does this pyramid mean? Unit tests take the least time for development, but you need a bunch of unit tests. With integration tests – you need fewer of those, but their development takes more time, which increases the price. With UI tests there is the smallest number of tests, but the longest time of development, as a result, the highest price. So, UI tests are the most expensive of all tests, but in a long term it justifies the cost. First of all, an auto test passes much faster compared with the case when a manual tester performs this test. It means that the number of passed auto tests will be much larger than that of manual tests over the same time span, keeping in mind that a manual tester can perform tests only during a work day, but a computer can perform the tests during a whole day (24 hours), then the benefit becomes obvious, even considering the fact that an auto tester has a higher salary than a manual tester.[![](https://issart.com/blog/wp-content/uploads/2018/12/roi-300x225-300x225.png)](https://issart.com/blog/wp-content/uploads/2018/12/roi-300x225.png)One more important thing: if a customer wants to be sure that their application works stably on any device with any resolution of the screen and version of the operating system, the mobile automation testing is the best way to achieve this, since most frameworks have a cloud testing feature. What is cloud testing? Here is a definition from Wikipedia:* Cloud testing is a form of software testing in which web applications use cloud computing environments (a “cloud”) to simulate real-world user traffic. Cloud testing uses cloud infrastructure for software testing. Organizations pursuing testing in general and load, performance testing and production service monitoring in particular are challenged by several problems like limited test budget, meeting deadlines, high costs per test, large number of test cases, and little or no reuse of tests and geographical distribution of users add to the challenges. Moreover, ensuring high quality service delivery and avoiding outages requires testing in one’s datacenter, outside the data-center, or both. Cloud Testing is the solution to all these problems. Effective unlimited storage, quick availability of the infrastructure with scalability, flexibility and availability of distributed testing environment reduce the execution time of testing of large applications and lead to cost-effective solutions.*

There are the most popular clouds and available devices in them:

- AWS Device Farm: 206 Android and Fire OS devices; 152 iOS devices. [An interactive device list](http://awsdevicefarm.info/) is available.
- Firebase Test Lab for Android: the list of available Android devices is available through a command-line tool.
- Xamarin Test Cloud: it currently lists 2,624 devices, running iOS 8 through iOS 11 and many Android versions from Honeycomb to Oreo.
- Sauce Labs: 308 devices are available, featuring Android from version 2.2.2 to 7.1.1 and iOS from 7.1.2 to 11.2.
- Kobiton: 160 devices are available in several families, including iPhone 7, Google Pixel, Galaxy S7 Edge and iPads.
- Perfecto: More than 10,000 smartphones, tablets and phablets.
- Experitest: The company says it provides access to hundreds of remote mobile devices hosted at Experitest datacenters. The online test cloud page lists 56 devices that are available, including a Fire HD 8 device from Amazon, iPhones, iPads, many Android phones, Blackberry devices and more.

Finally, one more advantage for a customer is that the customer is able to observe reports and manage the testing process, while he can’t watch how every manual tester is working. The reports of mobile automation tests are clear and convenient.

At the moment, mobile applications take over the market, the popularity percentage of websites and desktop apps decreases every year, whereas mobile applications, on the contrary, become more demanded. We can see how most of popular companies such as eBay, Youtube, Facebook produce their own apps, to make it more convenient for users to interact with an app beside a site. As a result of this increased popularity of mobile applications, testing becomes more required, either manual or automated. While exploratory testing must be performed manually, functional regression testing is perfectly suitable for automation. Then why not facilitate the tester’s work and provide more time for useful and interesting activities. Yes, definitely, more interesting, as functional regression testing might be quite boring, since the tester has to perform the same tests every new build, what if a new build is issued once a week or even more often. It will be better if testers could perform security testing, exploratory testing, improve their programming skills and subsequently develop mobile automation or integration tests. 

So, we are returning to the main question: “Mobile automation: to use or not to use?”. If you are a tester, then I will answer: “Yes, of course!” – it will make your work and life easier :) also it gives you a greater flexibility. Anyway, a customer makes the final decision, because the customer allocates money to all types of work.

If you are a customer, here is a little questionnaire to help you understand if you need to spend your money on mobile automation testing:

1. Should your application work with a big pool of devices and operating systems?
2. Do you need to have a consistent, steady and thorough process of testing?
3. How often do you change the design of your app?

If you answered “Yes” to the first two questions, it means you should have mobile automation testing. But it depends on the 3rd answer, if you change the design of your app too often, it will take much time to maintain tests according to the design, as a result you will spend a lot of money.

Manual testers were required in the market several years ago, because testing is a relatively new field in IT and there were few automation tools then, also at that time they thought a tester didn’t have to know programming languages. There were enough manual testers, because of the popularity of web and desktop apps. But everything changes over time, more and more apps and sites move to mobile phones, it requires a lot of devices to be tested and new versions of the apps are released more often. It’s better, easier and cheaper to automate regression testing and cover a large pool of devices. We can’t look into the future and say how product development will change and in which direction the focus of the market will be shifted. But for now we can say that neural networks, artificial intelligence and augmented reality will be a vector for the next few years. The focus will shift to voice assistants, smart cars and homes. I’m absolutely sure, that the value of testers with mobile automation skills and experience will increase every day. So start your own way in mobile automation testing right now!