---
id: 2412
title: 'The Best Practices in Organization of QA Process for a Software Development Project (Part II)'
date: '2018-01-17T19:45:31+08:00'
author: 'Alexandr Malyshkin'
layout: post
image: /static/img/2018/01/QA-Process_Part-II.jpg
categories:
    - QA/Testing
tags:
    - QA
    - 'QA process'
    - quality
    - 'quality assurance'
    - software
---

Our previous article described how to build a template for a testing round and what and why we need for that. But such template is just a tool and it is useless when not used correctly. So let’s drill down into QA process and its procedures we are using to let the testing be flowing fast and easily. Below, we are going to share the detailed instructions as well as some QA process improvement ideas.

## Building from scratch

However, before we begin, we have to recall in detail what our template is. This template is a Jira ticket and it has the following structure:

1. `Preconditions` section. This section contains a collection of Jira filters for the fast screening of the ticket set;
2. `Scope` section. This section contains a collection of Jira filters that displays the whole scope of the testing round as well as any necessary sub-scopes of it;
3. `Status` section. This section contains a collection of Jira filters that displays sets of the processed tickets split according to the results of their testing.

To build all the sections in the right way we will provide you with a box of short and precise instructions. Such boxes starting from here and further below are named `Step-by-step instructions box`. You can simply follow instructions in these boxes to build your own QA process workflow quickly and efficiently.

![Step-by-step instructions](/static/img/2018/01/Step-by-step-instructions_1.3.jpg)

## When testing got stuck

“May I ask a question?” – “Yes, you may.” – “What are `Blocked` and `Blocked recently` filters in the box above?”. It’s a good and timely question. `Testing blocked` status is set to a ticket when this ticket cannot be tested because of some external conditions e.g. some infrastructure problems. And this status is a paradoxical one. On the one hand, such tickets are in testing at the moment so they have to be included in the scope. But on the other hand, they cannot be tested right now, so they don’t have to be included in the scope. Fortunately, we can treat them as ordinary tickets of the scope which have an additional attribute – `blocked` flag. This flag can also be represented by a link, we are using “blocks” -> “is blocked by” link type. As a result, the set of blocked tickets forms a “blocked ticket pool” which is a part of the scope rather than a separate scope. To be clear: blocked tickets are included in the scope so each blocked ticket is linked to the “scope holder” sub-task twice: one time as a part of the scope and another time as a ticket of the “blocked ticket pool”.

### How to filter blocked tickets

To process blocked tickets we have added two mentioned above filters: `Blocked` and `Blocked recently`. They also affect `Come recently` filter:

- Blocked are tickets which belong to both the scope and the “blocked ticket pool”;
- Blocked recently are tickets in `Testing blocked` status which belong to the scope but don’t belong to the “blocked ticket pool”;
- Come recently are tickets which don’t belong to the scope but have `Ready for testing` status PLUS tickets which belong to the “blocked ticket pool” but aren’t in `Testing blocked` status anymore.

And now these filters show the following metrics of the round:

- how many tickets are blocked at the moment including tickets which were blocked during testing (`Blocked`);
- how many tickets were blocked during testing (`Blocked recently`);
- how many tickets are ready to be added to retest sets (`Come recently`).

### And how to process them

An attentive reader may notice that these filters give us a way to distinguish the case when a blocked ticket became unblocked as well as the case when an unblocked ticket became blocked. Yes, they do. And even more, there are clear ways to process such tickets:

- if a blocked ticket became unblocked, it appears in `Come recently` filter. In this case, the QA lead removes such ticket from the “blocked ticket pool” i.e. unlinks “is blocked by” link type of it out of the “scope holder” sub-task. After that the QA lead can add the ticket to some retest set, existing or new, to let it be tested;
- if an unblocked ticket became blocked, it appears in `Blocked recently` filter. In this case, the QA lead adds such ticket to the “blocked ticket pool” i.e. links it to the “scope holder” subtask by “is blocked by” link type.

In both cases, such processed tickets disappear from the mentioned filters. Simply, fast and comfortably.

## Launch!

Our template for the testing round is staffed with all the needed things, so let’s start a new round. The QA lead clones the template with all its subtasks into a new round ticket. Such cloning of the template creates a new set of filters which can be updated or removed according to our needs in this round. Then the QA lead links the new round ticket to the previous one and updates the summary/fields/description as necessary. When the new round ticket has been created, the QA lead checks all the filters and fixes the found broken tickets in one way or another. Such process allows us to fix as many mistakes as possible at an early stage i.e. before testing began. And it is very good because, as you probably know, the earlier a mistake is fixed, the cheaper its fix is. The result of the processing of `Precondition` section is a refined set of tickets ready for testing.

### Combining and breaking the scope

As we described in the previous article, at this stage the QA lead defines the scope of the round and fixes it by linking all the scope tickets to the “scope holder” subtask. After that, they link all blocked tickets to the same subtask. And when the scope has been combined, the QA lead breaks it into retest sets. The templates of retest sets which were cloned together with the round ticket can be cloned again this time inside the round ticket to produce as many retest sets as we need. On the contrary, any retest set templates which aren’t used in this particular round can be simply removed. When all necessary retest sets are made, the QA lead fills them with lists of tickets from the scope. One question: should we include blocked tickets into retest sets? No! They are blocked and we have no information when they will be unblocked, so we cannot process them anyway. However, as mentioned above, we have a way to catch blocked tickets which became unblocked and after that, they can be added to retest sets.

![Step-by-step instructions](/static/img/2018/01/Step-by-step-instructions_2.2.jpg)

## Getting the status

Eventually, testing was started and is proceeding. The QA lead uses filters from `Status` section to see changes and react to them. And even more, these filters give us numbers of tickets in each category, so we can create daily reports easily. Hmmm… Daily reports? Sounds like a repetitive task, doesn’t it? So… we can create a template for them! And the best place for such template is the round ticket: just add it to `Status` section of the testing round template. Then the QA lead can copy the report template from the round ticket, paste it somewhere, fill it with the actual numbers, and send to receivers.

![Step-by-step instructions](/static/img/2018/01/Step-by-step-instructions_3.2.jpg)

At some point, the QA lead finds that all the tickets have gone from `In testing` filter to `Resolved` (or `Reopened`). That’s wonderful! That means we have tested all the tickets:

- which had been ready for testing before the round began;
- which were unblocked during the round;
- which came to testing during the round.

We did everything! What’s now? Let’s start another round! Where is our template for the testing round ticket?..