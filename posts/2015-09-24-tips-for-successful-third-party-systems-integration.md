---
id: 1251
title: 'Tips for successful third-party systems integration'
date: '2015-09-24T13:56:33+08:00'
author: 'Anna Melkova'
layout: post
image: /static/img/2015/09/network-440738_1280.jpg
categories:
    - General
    - 'Web Development'
---

At the moment, there is a great number of various applications already developed. Most of them are connected with providing processed information, taken from different third-party sources.

First of all, let’s review common services that newly developed applications are often integrated with:

- Social networks, such as: Facebook,Twitter,Google+,LinkedIn;
- Delivery services: UPS,USPS,FedEx,DHL,Canadian Post,EMS;
- Online payment systems: Authorize.net, PayPal, Moneybookers, Alertpay, WebMoney, QIWI, video streaming services – YouTube, Vimeo.

We have significant experience with third-party systems integration. And, as long as, this process is rather difficult, sometimes we face various issues. Our successful experience of resolving such issues allows us to develop some recommendations for dealing with third-party systems.

 **Here are some tips for integration.**

Please note: this is not a strict step-by-step guide; this is a list of points you need to pay attention to. It is possible (or even necessary) to carry out certain parts of work simultaneously.

**1. Business requirements and the ground for integration**

At first, you have to estimate profit of integration and it’s compliance to the business requirements. For this purpose you should answer the following questions:

- Will the integration carry out its mission?
- How your company’s aims will be achieved?
- And, at last, what profit will the company get after such integration?

After getting answers to these questions, you can choose the right direction in studying of integration requirements and find right solutions; the value added estimation let you predict the payback of integration.

**2. Risks**

From the very beginning, on the stage of discussions, you should create the list of risks of a new integration and constantly update it.

And, I must admit, usually new integrations involve certain risks which have to be managed:

- You should write them down;
- Reveal conditions that influence on their appearance;
- To define weakening and reacting strategies.

The weakening strategy should be begun with risks with high probability and serious influence.  
The weakening of these risks can be done through various measures: from hiring a lawyer to writing a prototype. Risk management is an important system of measures which helps you to look at the integration more precisely.

If you have deadlines on integration from this or that system, it’s not absolutely correct. A lot of things in this case depend on third-party system, but not on you. That’s why I recommend you to study integration process (and it doesn’t take 5 minutes, the integration can proceed 2 days or even more), and only after that to put down deadlines.

A significant number of risks is not a reason to abandon the idea of integration.  
Overcoming a barrier of risks (that, perhaps, is insuperable for your competitors), let you occupy one of the leading positions on the market.

So, the winner is the one, who works with risks more correctly!

**3. Studying of requirements**

Before starting the integration, you should define requirements more precisely. This measure gives you an opportunity to reduce the number of works and evaluate them. In order to monitor the process, you can use different classifications of requirements as a checklist. As an example we can use such a model as FURPS (+).

**3.1 Functional requirements**

Solving this issue, you should:

- Register scripts, which will be available for different user roles. These scripts have to explain what the system should do with certain queries from users. On the first stage, you can do it without any details as «user stories» and, thereafter, describe the detailed «use cases»;
- Check compatibility of new functional requirements with each other and with already existing features of information system.

 Another important aspect is the information security requirements. This particular field of knowledge requires special attention and can define the success of the project. Very often this important step determines the number of works.

**3.2 Usability**

You should determine the requirements for usability for final users, such as: human factor, aesthetics, sequence, documentation. The more user’s time interaction with the system is expected, the more attention should be paid to this issue, including formulation of tasks for user interface designers and monitoring of their work.

**3.3 Reliability**

You should define the acceptable permissible frequency of possible failures, fault tolerance, disaster recoverability, and predictability of system stability. This and the following issues are resolved by architects, developers.

**3.4 Productivity**

You should remember, usually only fast running systems satisfy the growing users’ demands. Therefore, carrying out the integration, it’s necessary to set the following indicators:

- Required speed,
- Efficiency,
- Utilization of system resources,
- Capacity,
- Scalability.

**3.5 The system of support**

 At this stage, you should describe such indicators, as:

- Required support,
- Maintainability,
- Flexibility,
- Modifiability,
- Modularity,
- Expandability,
- Localization.

Working with the integration requirements is the responsibility of analysts. They can rely on different methodologies and guidelines, such as [BABOK](http://www.iiba.org/babok-guide.aspx).

Evaluating the requirements for different integrations at the same time, you should consider that some individual integrations with two different systems can be incompatible with each other. Several simultaneous integrations may lead to the need to create more complex system, which gives an opportunity to work with all systems at once.

Particular caution should be exercised when such simultaneous integrations lie in the same subject area or provide related services (integration with several payment systems or music content providers, etc). Often each provider offers a special programming interface, which differs from the others.

**3.6 Development from a prototype to the finished system**

The best way to test the key requirements is to create a prototype of integration. In the first prototype are only the most important requirements for this project. Such approach allows you to work with risk reduction on the very first steps and to control the budget more precisely. There are some cases when in addition to the key integration, you have to fulfill the requirements for additional functionality at once. But if the key integration is unworkable, the time and money, spent on all works, will be lost.

In order to avoid such issues, you can take the useful practice of incremental system changes, when the individual iterations give a workable system, and new requirements are implemented in the system from iteration to iteration. You have to be ready that the first prototypes usually look ugly (from the user interface’s point of view). But the main requirements are worked out.

**3.7 Quality**

To control the quality of integration you can use different types of testing. Just as in the situation with the system development and design, at first, you should test requirements with the highest priority, and then – the others. A set of test events can be extensive: from specifications quality control and test design to manual testing, automated testing, load testing and security testing, etc. But the description of different test events is the subject for our other articles.

Do you have any experience in this area?  
Which techniques have worked, and which haven’t?

We would be glad, if you share your experiences with us.