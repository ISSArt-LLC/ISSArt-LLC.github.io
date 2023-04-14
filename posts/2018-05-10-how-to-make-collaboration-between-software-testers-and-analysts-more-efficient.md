---
id: 2589
title: 'How to Make Collaboration Between Software Testers and Analysts More Efficient'
date: '2018-05-10T17:54:40+08:00'
author: 'Yulia Shepeleva'
layout: post
image: /static/img/2018/05/Dollarphotoclub_76801219.jpg
categories:
    - QA/Testing
tags:
    - collaboration
    - QA
    - testing
---

Testers on the project usually deal with described requirements for which it is necessary to make an assessment of the testing time, write a test plan, compile a set of tests and conduct tests. When performing this work, the tester very often encounters the need to clarify the requirements, rewrite incorrectly formulated or contradictory descriptions. In the process of clarifying the requirements there is a need to modify, supplement, rewrite tests. Since the tester verifies positive and negative scenarios, the work of users with different access rights, the operation of the script with different preconditions, then the number of test scenarios written for the requirements is usually greater than the scenarios described by the analyst. If the analyst makes changes or rewrites a requirement, then the tester needs to make changes to all related tests. This work takes a very long time. How to reduce the time to work with requirements during testing?

First of all, the tester must be involved in working with requirements. The sooner the tester starts checking requirements, the faster he will find potential problems. The tester has the skill of finding unspecified alternative scenarios, contradictions in the description.

It is best to start reviewing requirements before the development phase, at the requirements analysis stage.

## The roles of the analyst and the tester on the project

The role of the analyst on the project:

- interact with the customer;
- describe the business requirements with the words of the customer;
- form a description of the requirements in a form understandable to testers and developers, for example, in the form of use scenarios;
- document functional and non-functional requirements.

The tester on the project should:

- draw up a test plan according to the described requirements;
- estimate the time for testing;
- write tests to test functional and non-functional requirements;
- conduct testing after the requirements of the developer have been implemented.

These roles overlap when working on requirements. And in this situation it is necessary to organize the work so that the correctly formulated requirements meet the criteria:

- The correct requirement. Correctly described behavior for this system.
- Unambiguous requirement. This requirement must be interpreted unequivocally.
- Completeness of the requirement or set of requirements. All important requirements that are of interest to the user, including functional, non-functional, response to incorrect data entry, information about the UI, should be described.
- Consistency of the set of requirements. The descriptions of requirements should not contradict each other.
- Verified requirement. The requirement that a person or machine can check.
- Traced requirements. Requirements, the origin of which is understandable and you can refer to each of the requirements by its name or number.
- Understandable requirement. A requirement that is clear to both the tester and the developer.

Analysts describe the business logic of the project, subject area, functional, non-functional requirements. Access to all these documents is provided to the testers.

Let us look at the principle of working with some requirements.

## Functionality of the project

The functionality of the project is described in terms of usage scenarios. A [use case](https://en.wikipedia.org/wiki/Use_case) is a description of the behavior of a system when it interacts with someone or something from the external environment. Use cases are the most convenient entities that are understood by analysts and testers. Usually, usage scenarios are documented as a document (Google Docs).

Such document consists of sections:

- The name of the script. It should describe the action that this script performs.
- The main character. The person who performs the described action.
- Precondition. All conditions under which the script execution makes sense are listed.
- The main scenario. A typical course of events, consisting of numbered steps.
- Alternative scenarios. Variants of the main scenario.
- Functional requirements. Additional script actions depending on some conditions.

Use case as soon as they are ready are checked by the tester. The tester does not have to change, rewrite the requirements, only analysts do it. The tester may indicate inaccuracy, incompleteness of the description, contradiction or ask a clarifying question.

If a team of testers is working on the project, then the test lead distributes the scripts to the test between the testers. The tester makes sure that the requirements meet the specified criteria. If any criteria in the scripts are not met, then add a comment to the document. The comment is assigned to the analyst who developed this document. The analyst responds to comments, discusses changes with the tester. As a result, the analyst makes changes, clarifications, additions. Comments on which decisions were taken are closed. If the requirement that changed logically is related to other requirements, then the analyst makes changes to another document and notifies the test-lead. The test-lead assigns the checking of the changed document to the tester.

Also, on complex projects, it is convenient to maintain a mapping table between usage scenarios and roles, user rights. This allows you to trace the fulfillment of requirements for users with different access rights.

Having set up the process in this way, we can work as a team with analysts, mutually complementing each other.

The main time for clarification, changes in requirements will be spent before developing test cases, a test plan and evaluation.

After reviewing the use scenarios, the ready requirements can be transferred to the TMS (Test Management System), for example [TestLink](http://testlink.org/). TestLink allows you to work with requirements, tests, organize the testing process, collect a report on the testing.

All requirements are added to the Requirements section. A separate folder is created for each usage scenario. The folder name corresponds to the name of the script. Inside the folder, the main and alternative scripts are described by different requirements (Req Spec). Each scenario has its own name, which describes the main action performed by this script. For requirements from the Functional Requirements section, we create a separate subfolder. We transfer each claim to it separately. The script can refer to general validation rules or general conditions of execution. Such rules are combined in a separate folder named Global Execution Terms or General Validation Rules.

The usage scenario, broken down into requirements, is convenient for creating tests. For each individual requirement, you can make at least one positive test. In addition, negative test scenarios can be added to each requirement. Each test has a link to the requirement that it checks.

## Non-functional requirements

Non-functional requirements should be described by the same criteria as functional ones. Non-functional requirements are described in the form of Google Docs documents. They describe the following criteria:

- Availability
- Reliability
- Data retention requirements
- Scalability
- Requirements for ease of use
- Security Requirements
- Requirements for configurability
- Performance Requirements
- Restrictions

The whole team is responsible for describing, verifying, changing requirements. Comments are added to the document. Analysts process these comments and, as a result, make changes to the document.

The requirements described by all the quality criteria will be used by the team to assess implementation and verification time, writing development and testing plans, and will serve as benchmarks for the production of the software product. The team gets the opportunity to follow the plans, without exceeding estimations. Developers will be less likely to make logical errors, errors in the development of the architecture. Testers will spend less time checking, there will be no disputes with developers about the correct operation of the functionality.

Of course, the requirements in the development process will change slightly. Minor changes that the analyst will make will come through the lead test to the tester. The tester, in turn, will make changes to the finished tests.

If you have some questions or want to share your experience, drop a line in our contact form.