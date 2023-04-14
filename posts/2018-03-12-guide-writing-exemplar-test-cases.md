---
id: 2522
title: 'The Guide for Writing Exemplar Test Cases'
date: '2018-03-12T15:33:57+08:00'
author: 'Mikhail Kharitonov'
layout: post
image: /static/img/2018/03/Untitled-design.jpg
categories:
    - QA/Testing
tags:
    - QA
    - 'test cases'
    - testing
---

Writing test cases is one of the basic options within a QA engineer's arsenal. Properly written test cases may be applied to almost any development methodology, testing technique or project size. They can provide QA team with a crucial success or easily become the most annoying part of the testing process. This guide is intended to help QA engineers of any experience to achieve the first and avoid the latter.

### Before starting

Firstly, your decision to write test cases should be justified. Does your team have enough resources to design, create, and update test cases for every functionality of a project using a featureful (and pricy) software like JIRA? It's fine if the answer is "yes", but that is a rare case. Try to answer the following questions first and foremost:

- What functionality do you want to cover with the test cases?
- How many resources (time and/or people) can you allocate for the initial test case creation?
- What TMS (Test Management System) are you going to use to store test cases?
- Are you going to introduce automation?
- How many resources can you allocate for keeping your test cases up to date?

Modern software development processes usually declare short delivery cycles, high scalability and tend to apply agile methodologies so it can be a mistake to write tests for every case or flow of your software project. Do you actually need them all? What if your product team is changing requirements and specifications for several new features on a weekly basis? In this case, test case design and support may take a huge amount of resources. Consider that the more wisely and honestly you have answered those questions, the fewer problems you will face in the future. We suggest starting with a stable and simpler functionality to make some practice and then move further to more complicated scenarios.

### Necessary minimum

[ISTQB's Standard glossary](https://www.istqb.org/downloads/glossary.html) of terms used in Software Testing defines a test case as "a set of input values, execution preconditions, expected results and execution postconditions, developed for a particular objective or test condition, such as to exercise a particular program path or to verify compliance with a specific requirement". Here in this guide, we will look closely at creating test cases for manual execution as an example. Any such test case should contain:

1. Test steps;
2. Test data;
3. Expected result.

Optionally, it can also contain execution preconditions and less formal commentaries. But be aware that massive preconditions and extra commentaries for the steps may indicate bad test case design. In that way make sure that all of them absolutely necessary and cannot be simplified by, for example, further decomposition.

Any test step must be executable right after all preconditions are met and previous steps are successfully done. The amount of atomic actions (like going to a particular screen, menu or entering data in some fields), performed by the test case executor may vary from one to several, since they are needed to achieve an expected result of the step, but we recommend to stick with as few as possible, usually 1-3. If the system goes through several states within a single test step, it probably should be decomposed. Just as creating dozens of 3-step test cases may look meaningless, for manual testing we strongly recommend avoiding test cases which have more than 20 test steps (8-12 seems ideal). Test steps also should not contain cross-references between different test cases or within the test case itself (though test cases may be linked to each other, "cascade tests" as an example). They should be written in the imperative mood only.

Test data are input values we transmit to the system at a particular step. It might be defined exactly, proposed by a set of acceptable values or left formally undefined. The first option is often used when a test case is written for a specific issue (previously caught or foreseeable); the second i.e. for boundary value-oriented testing. The last is commonly used for less crucial functionality. Do you really need an exact user for testing login? We don't think so. Testing may be a very exhaustive process and we definitely don't recommend to force your team stick with the same input data over and over again without an objective necessity.

Expected result for each step should be as clear and atomic as possible and depend exclusively on the actions of a particular step it is related to. Any "if-else" branching must be avoided at almost any cost. This approach often leads to increase in the number of tests but it's worth it. In extreme circumstances such as lack of time, a QA engineer will be able to report an issue just by giving a link to the particular test step even without a comment. If the expected result is relatively small and simple, that's obvious what should be fixed at this step. That practice also has notable advantages on a normal basis – atomic steps are easier to execute, update and they have less space for misinterpretation. The expected result should be written in present tense.

Last but not least, test cases should be designed with a plan in mind. While applying the white box testing techniques requires significant programming skills and is usually done by developers themselves, here's the list of black box testing techniques which QA engineers should be familiar with:

- Equivalence classes;
- Boundary values;
- Decision tables;
- Pairwise testing;
- State-transition testing;
- Use case testing.

Many of them are used by QA engineers intuitively, but a few ones require some practice. Using a formal testing technique lets reduce the number of tests while delivering the acceptable test coverage. Designed to achieve both high efficiency and effectiveness, they're powerful tools within an arsenal of every tester.

### Exemplar test definition

What makes some test cases exemplar and what doesn't? Exemplar test cases help QA to achieve the following goals:

- - maintain a high efficiency in finding bugs with as few test cases as possible;
    - minimize free interpretation of execution results;
    - make test cases easy to execute for any people who intended to do it;
    - make test cases easy to update and reuse;
    - allow test cases to provide any associated people (mostly QA leads or/and PMs) with transparent reports.

There's no sense to create hundreds or thousands of tests for a casual login screen. While choosing a suitable testing technique for a particular scenario is out of the scope of the article, we just want to mention that test cases should be written for any testing approach with a desire to catch as many bugs as possible with a finite number of tests. Test cases should NOT be designed to confirm that the system works correctly. There are errors in any project, so the more of them are found during test case execution the better.

Misinterpretation of execution results leads to additional communications between QA engineers, programmers, analysts, and PMs. Avoiding it can be a tricky task if the requirements change constantly, especially when "agile" methodologies are used. So we suggest creating test cases for functionality that's already covered well with requirements and are less likely to be changed in the near future. Otherwise designing and updating test cases may take extra team resourсes and using test cases may turn out scarcely beneficial.

Making test cases easy to execute doesn't mean that complex scenarios should be avoided during test design. They're actually the best places to find a bug so they are a primary target of testing. Complexity may be reduced by different approaches, for example, organizing cases to test suites and uniforming test cases appearance. Test suites aka "A set of several test cases for a component or system under test, where the post-condition of one test is often used as the pre-condition for the next one" (ISQTB's Standard glossary) may be created to split the cases by testing purposes (UI test cases, functional test cases, integration or load tests), type of expected result (negative or positive tests) or criticality. Even modest systems are often covered by hundreds of tests which need systematization. Unforming test cases appearance also helps a lot. The same fonts, headers' styles, test data formalization and even syntaсtic structure of test steps matter.

Ability to reuse test cases and maintain them up to date is none less important than initial test case design. That's not a rare case when tests are written but then continuous changes in requirements force a QA team to spend lots of time to update and even abandon them completely. The solution may sound awkward but 20 always updated test cases are better than 100 ones updated five times less often. We suggest using any available feature of selected TSM to make updating faster and easier (creating test suites and linking tests with them, labeling, controlling test cases' statuses constantly).

We were mostly talking here about manual test cases design, but keep in mind that these recommendations can be applied in an appropriate way for almost any test cases even if their executor isn't a human but a program module or a 3rd-party interfacing system.