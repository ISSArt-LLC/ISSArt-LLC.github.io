---
id: 2350
title: 'The Best Practices in Organization of QA Process for a Software Development Project'
date: '2017-12-22T14:08:29+08:00'
author: 'Alexandr Malyshkin'
layout: post
image: /static/img/2017/12/QA-Process.jpg
categories:
    - QA/Testing
tags:
    - QA
    - 'QA process'
    - quality
    - 'quality assurance'
    - software
---

This article describes our best practices in building the QA process for a software development project. What are our main goals in it?

## Fast and featureful

First, the delivery of new software versions to end users as fast as possible is vital for software development nowadays. Fierce competition in the software market compels software companies to release new features sooner than their rivals to attract users. As a result, the Agile techniques have spread widely as they combine flexibility and short delivery cycles.

Testing or in a broader sense, QA (quality assurance) is a stage of software development. This stage is essential for software development, so the workflow of QA process has to be simple, flexible and fast.

## Use what is already there

Second, the cost of the process matters. Of course, there are many big and expensive systems which provide a complete set of tools for testing in the agile environment. But what can we do if our start-up is still small and we need a solution which is as fast and cheap as possible? There is a solution: we can use Atlassian Jira that is already being used in our company as a bug tracking system. What advantages does [Jira](https://www.atlassian.com/software/jira) provide? Let's take a look at them.

## Jira's advantages

### Filters

Filters are designed for a quick selection of tickets by some criteria. Queries for Jira filters are written in JQL (Jira Query Language). Using the right filter, we can get the exact subset of tickets we need. Filters are separate objects in Jira (they are named “stored filters”) which can be reused and shared among users. But what is more valuable for us, a filter can also be presented as an HTTP link and thus be embedded into the description of a ticket.

### Cloning

Any ticket in Jira can be cloned. Cloning means that an exact copy of the source ticket is created. That gives us a way to make templates i.e. tickets with the preset fields, summary, description, etc. Using such templates, we can create tickets for repetitive tasks quickly. Do we have any repetitive tasks or activities in QA process flow? Yes, we do!

## Rounds of testing

The cornerstone of the Agile methodology is splitting the development into short phases each of which has to end with the delivery of a new release. These phases are called sprints or rounds or iterations. All the changes, such as new features or bug fixes which have been implemented during a round, should be tested within it. So we need to perform testing as a repetitive task each round, and each such task will be similar to the previous one. It is a good place to use templates. So we are going to talk about QA process template.

In our scheme, each testing round is represented by a separate ticket of `Task` type. Such round ticket contains all the information about this particular round and has got all the necessary sub-tasks. To make the history of testing available, all the round tickets should be linked to a chain by using Jira links. We're using “follows” -> “is followed by” link. When a new round has been started, the QA lead clones the template ticket to create a testing ticket for this round. Then QA lead updates the summary, description and any necessary fields according to the needs of this particular round. After that, they link the round ticket to the previous one.

The testing round template has a particular structure, so let's look into it in more details.

## Preconditions for testing

The main developers' goal is to attach the value to the product. In such tough conditions like short rounds, the risk of a mistake is high, so testers cannot be sure that all the tickets which should be tested in the current round have correct values in their fields and even more, some tickets can get lost or get stuck in the workflow. For the fast screening of the ticket set, we can use Jira filters which will sift tickets out and bring the broken ones to the surface. We can create as many filters as we need for filtering all the possible mistakes, unfilled fields, discrepancies between fields and so on depending on the QA process flow we use and the desired level of confidence.

Filters form the first section of the testing round template – `Preconditions` section. As it was said above, filters may be used in the form of HTTP links, so each filter is added to the template as a link which contains the full [JQL](https://confluence.atlassian.com/jirasoftwarecloud/advanced-searching-764478330.html) query.

### Shared filters vs. filter links

Why don't we use shared filters, while Jira provides such a feature? There are two reasons for that:

- shared filters can be shared with read-only permissions only. As a result, only the author of a filter can update it;
- in each particular round, we may need to change a filter in some way for some reason. Using a shared filter in such situation will mean that the filter is changed for all the rounds: for both past and future.

Cloning the testing round template into a new round ticket creates a new set of filters which can be updated or removed according to our needs in this round.

## Drawing the boundaries

At first sight, it seems easy to define which tickets exactly we need to test in the current round. You might say 'All the tickets which have `Ready for testing` status' and you wouldn't be right. You should know that one of the values in '[Agile Manifesto](http://agilemanifesto.org/)' is “Individuals and interactions over processes and tools”. That means that the rules may be violated and some tickets may fall out of the workflow because of some immediate needs. As a result, every round we may have some exceptions among the ready for testing tickets for some reasons. And moreover, some tickets can be moved from one status to another, be added to the round, or be removed from it. As a result, there is no way to create some magic Jira filter that will show such and only such tickets which should be tested. After all, when the round comes to an end, many if not all tickets are moved out of `Ready for testing` status. But despite that, we need a way to see the complete scope of tasks of the current round.

### Scope of the testing round

To make the scope of the round immutable and persistent we need a way to make a set of tickets in Jira. The simplest (and the wrong) way is to add a unique label to all the round tickets. It seems to be an easy task to assign a label to tickets using Jira's bulk operation and then filter tickets by this label. But this easiness is the weak side of this way.

Have you ever removed all the labels from a ticket in trying to add a new one, especially when using a bulk operation? Often people don't even realize that they have removed some labels accidentally. So the best way we found is to link tickets to the round ticket by a particular type of link. But it will be even better to link them to a “scope holder” sub-task of the round ticket. That will prevent mixing of the links to the scope tickets with other links which the round ticket can have, e.g., links to the previous/next round ticket.

JQL allows selecting tickets which are linked to the specified ticket using linkedIssues() function, so we can use a link with a particular type to a particular ticket as a search criterion. We are using “contains” -> “is included into” link type. Based on this criterion, we build the filter for the scope as well as filters for any required subsets of the scope e.g. a sub-scope defined by the platform. All these filters form the second section of the testing round template – `Scope` section.

## How to parallelize work

OK, we have defined the scope of the round to be tested. Can testers use the scope filter for picking tickets up for testing now? After all, we can treat the scope filter as a queue with free access, right? Testers might pick up any ticket they want from the queue, test this ticket, and return for the next one until the queue is empty.

Alas, such free queues work only if we have plenty of time for testing. So it is not our case as Agile means a strict time box. Experience has proven that the first tickets which are picked up from the free queue are usually the easiest and the most interesting ones. Hard-testable, complex and boring tickets inevitably sink to the bottom of the queue. However, they must be tested anyway and sometimes they should be tested even sooner than others.

To prevent such stuck tickets from appearing and to balance the load of testers in the team, tickets should be distributed between testers by the QA lead. On the other hand, if the QA lead processes tickets on the one-by-one basis, it will take much time and will be very difficult to maintain such set of tickets.

### Retest sets

The solution is to aggregate tickets into packs which we call retest sets. Each such retest set is a sub-task of the testing round ticket and contains some tickets to be tested, usually from 6 to 10. The description of a retest set can be filled with some useful info e.g. instructions which describe the correct way for testing and processing tickets of the round. The QA lead is able to combine tickets from the scope into retest sets using any attribute, such as a platform, priority, complexity and so on.

Having in mind abilities, availability, and competences of each tester in the team, the QA lead can distribute tickets between testers as even as possible. At the same time, there is always an opportunity to re-assign a retest set from one tester to another, create a new retest set, or leave some retest sets unassigned to make a decision later. Besides, if your team logs time using Jira tracking feature, testers can log time directly into retest sets so the logged time won't scatter among many tested tickets but will be compiled in one place.

### …and templates for them

Retest sets look like repetitive tasks so are you going to ask about templates for retest-sets? Yes, you're absolutely right! We can make templates for retest sets especially if there are some different variants of the description e.g. for testing on different platforms. The QA lead creates retest sets as sub-tasks of the round template ticket and they are being cloned together with the parent ticket when a new round is being created. There is a wide room for QA process improvements: you can create a sub-task for any task which repeats in each round and cloning the round template ticket will bring it to the new round every time. We shouldn't also hesitate to create templates for tasks which may be or may not be in a particular round as excessive sub-tasks can always be deleted from the cloned round ticket.

## Control over the testing process

As the testing proceeds, statuses of tickets are changing, but we still need to be able to view a snapshot of the current state of testing. As the scope is immutable, we can use it as the base point for Jira filters which will select the needed sets of tickets. The common list of such filters is the following:

- Resolved – tickets which belong to the scope and have `Resolved` status;
- Reopened – tickets which belong to the scope and have any status except `Resolved` and `Ready for testing`;
- In testing – tickets which belong to the scope and have `Ready for testing` status;
- Come recently – tickets which don't belong to the scope but have `Ready for testing` status.

These filters form the third section of the testing round template – `Status` section. They show all the vital metrics of the round, namely:

- how many tickets were tested successfully (`Resolved`);
- how many tickets were returned back to developers (`Reopened`);
- how many tickets remain untested (`In testing`);
- how many tickets are ready to be added to retest sets (`Come recently`).

## Let's start a testing round!

So, we have just created a template for a testing round with all needed sections and sub-tasks. It seems quite logical that the next step should be to start using this template in the real work and see how our practices allow us to control the testing in such flexible and fast-changing environment as the Agile software development. Are you interested in how to do that? Great! Let's read our next article which will describe the whole QA process and procedures we are using during testing. And even more, we're going to do the following:

- tell you what “blocked” tickets are and how we can process them flexibly;
- give you a step-by-step instruction for implementing the process;
- and share some more tips and tricks.

Stay in touch, the next article is coming soon!