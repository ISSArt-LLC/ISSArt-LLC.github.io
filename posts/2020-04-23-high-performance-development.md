---
id: 3659
title: 'High performance development'
date: '2020-04-23T17:32:09+08:00'
author: 'Alexandr Kalinin'
layout: post
image: /static/img/2020/04/carl-heyerdahl-KE0nC8-58MQ-unsplash.jpg
categories:
    - General
tags:
    - 'code quality'
    - 'high performance'
    - more
    - performance
    - 'performance optimization'
    - 'product quality'
    - software
---

> <span style="font-weight: 400">Good software systems are all alike; every bad system is bad in its own way. </span><span style="font-weight: 400">  
> </span><span style="font-weight: 400">Leo Tolstoy about software engineering.</span>

<span style="font-weight: 400">Every stakeholder dealing with software development sooner or later tries to answer the question. </span>

- <span style="font-weight: 400">Is my development process goes right? </span>
- <span style="font-weight: 400">How to measure it and express it in terms of numbers?</span>
- <span style="font-weight: 400">How to make these measurements less subjective and turn into KPI tool?</span>

<span style="font-weight: 400">The reason and context concerning the arousal of these questions can be different, for example:</span>

- <span style="font-weight: 400">a CEO in a large company is writing a report for annual general </span><span style="font-weight: 400">shareholders board meeting and wants to show the dynamics to earn some bonuses</span>
- <span style="font-weight: 400">a customer wants to know how the outsourcing team from India  
    is doing </span>
- <span style="font-weight: 400">or the team lead wants to know if anything goes wrong in development process and to interfere unless it’s not too late.</span>

<span style="font-weight: 400">Though the quality of software development product is quite an abstract and subjective term, but let’s agree that a high performing software is the one that is </span>

- <span style="font-weight: 400">predictable</span>
- <span style="font-weight: 400">maintainable </span>
- <span style="font-weight: 400">evolving. </span>

<span style="font-weight: 400">Let’s stick to those features and see what they mean in terms of performance and what can be quantitatively estimated within them.</span>

## <span style="font-weight: 400">Predictable</span>

#### <span style="font-weight: 400">Unit tests to the rescue</span>

<span style="font-weight: 400">The software does what it is intended to do and does it all the time. You may think it’s a QA-engineer’s landscape – not a developers’ one, but we would partially disagree. Testers usually deal with software as a black box, and don’t penetrate into subprogram level like functions or separate modules. It is a responsibility of developer to accompany one’s code with a unit test – not QA’s definitely. How much unit testing do we need? The more tests – the better, but without fanaticism. A topic of unit tests is endless in terms of tools, approaches and so on. Some of popular unit testing frameworks for JavaScript are Karma or Jest. You’d better consult digests on unit testing conventions in your prefered language.</span>

#### <span style="font-weight: 400">What are the metrics of test coverage?</span>

<span style="font-weight: 400">And here we come with a notion of code (or test) coverage which is totally a sphere of developers activities. Test coverage can be defined as a measure used to describe the degree to which the source code of a program is executed when a test suite runs. A program with high test coverage, measured as a percentage, has more of its source code executed during testing, which suggests it has a lower chance of containing undetected software bugs compared to a program with low test coverage. Many different metrics can be used to calculate test coverage; some of the most basic are</span>

- <span style="font-weight: 400">the percentage of program subroutines</span>
- <span style="font-weight: 400">the percentage of program statements called during execution of the test suite.</span>

#### <span style="font-weight: 400">What will these metrics help you to evaluate?</span>

<span style="font-weight: 400">So the more percentage of source code is covered by tests, the more software is protected from unexpected failures. The growth of code coverage in relative (percentage growth from previous time) or absolute (additional lines of covered code added) units can be a metric for performance dynamics in team. Code coverage of 70-80% is a reasonable goal for system test of most projects with most coverage metrics. Use a higher goal for projects specifically organized for high testability or that have high failure costs. Minimum code coverage for unit testing can be 10-20% higher than for system testing.</span>

#### <span style="font-weight: 400">What are the tools to measure the code coverage?</span>

<span style="font-weight: 400">Lots of tools are used to measure code coverage. For example in Python universe Coverage.py or Pytest-cov.</span>

## <span style="font-weight: 400">Maintainable</span>

[![](/static/img/2020/04/photo-1505461560638-05d8740c0a73-e1587633441121.jpg)](/static/img/2020/04/photo-1505461560638-05d8740c0a73-e1587633441121.jpg)

#### <span style="font-weight: 400">What are the main components of the maintainability? </span>

<span style="font-weight: 400">Maintainability can be defined as openness to bug fixing, ease of features extensions and smooth onboarding for new-coming developers. And here are two key ingredients for the recipe – code quality and documentation.</span>

#### <span style="font-weight: 400">Code quality – reducing complexity</span>

<span style="font-weight: 400">By code quality we mean that code is readable and can be changed and interfered without causing the whole software to collapse. Of course there are tons of books written about how to write comprehensible code and about software design principles like SOLID, but if we are speaking about the way of control and measuring it, the things that come to mind are code complexity and following good coding practices and code conventions.</span>

<span style="font-weight: 400">Code complexity is an abstract measure of how control flow in code are twirled. The more code is complex – the more it’s difficult to maintain it. By reducing code complexity, we can reduce the number of bugs and defects, along with its lifetime cost. </span>

<span style="font-weight: 400">There are several metrics of code complexity, and probably the most known is cyclomatic code complexity. It is computed using the control flow graph of the program: the nodes of the graph correspond to indivisible groups of commands of a program, and a directed edge connects two nodes if the second command might be executed immediately after the first command. Cyclomatic complexity may also be applied to individual functions, modules, methods or classes within a program. There is an implementation for Python called Radon (</span>[<span style="font-weight: 400">https://radon.readthedocs.io/en/latest/</span>](https://radon.readthedocs.io/en/latest/)<span style="font-weight: 400">). </span>

<span style="font-weight: 400">Also there are some rules of thumb which can be quantified for assessing code complexity.</span>

- <span style="font-weight: 400">Number of function decorators; lower is better</span>
- <span style="font-weight: 400">Number of arguments; lower is better</span>
- <span style="font-weight: 400">Number of annotations; higher is better</span>
- <span style="font-weight: 400">Number of local variables; lower is better</span>
- <span style="font-weight: 400">Number of returns, yields, awaits; lower is better</span>
- <span style="font-weight: 400">Number of statements and expressions; lower is better</span>

#### <span style="font-weight: 400">Code quality – following conventions</span>

[![](/static/img/2020/04/photo-1500589177368-c810ea3db799.jpg)](/static/img/2020/04/photo-1500589177368-c810ea3db799.jpg)

<span style="font-weight: 400">Following good coding practices and code conventions also contributes to code quality. The first that comes to mind are linters – static code analyzers that check whether the code match the rules derived by coding community which means more structured, conventional code which is easy to onboard on. </span>

<span style="font-weight: 400">The less linters warning mean the code more complies the coding standards for a given language. Do googling the tools for linting in your language – there are hundreds of them.For python feel free to use Pylint or Flake8, if you are from JS world – ESlint or JSlint are at your service.</span>

#### <span style="font-weight: 400">Review components: Documentation</span>

[![](/static/img/2020/04/waldemar-brandt-Sq_94tmuw1E-unsplash-1.jpg)](/static/img/2020/04/waldemar-brandt-Sq_94tmuw1E-unsplash-1.jpg)

<span style="font-weight: 400">And the second ingredient is </span>**documentation**<span style="font-weight: 400">. It can be present in terms of code annotations and comments and terms of manuals. No documentation means that each new developer will have to figure out about the functionality of software by reading code which can be quite time consuming.</span>

<span style="font-weight: 400">Unfortunately there is no definite way of estimating the quality of documentation. But there the more meta-information you have, the more context is shared and stored in any kinds of useful artifacts. And the more context is shared across your team the more easily it will be to onboard for new team members.</span>

## <span style="font-weight: 400">Evolving</span>

[![](/static/img/2020/04/photo-1508180588132-ec6ec3d73b3f.jpg)](/static/img/2020/04/photo-1508180588132-ec6ec3d73b3f.jpg)

<span style="font-weight: 400">Nowadays there are many systems in US insurance system that are very highly tested and documented and are written by professionals BUT they are written in COBOL – a language which is already dead and is not developing anymore. So you have no security patches, no new libraries to plug, no people learning it and hence no developers to support your legacy. Of course COBOL-based systems will not gonna die one day. but the cost of it’s maintenance grows exponentially with time.</span>

#### <span style="font-weight: 400">Survive or Die: Why is evolving so important for your software?</span>

<span style="font-weight: 400">The life itself teaches us that everything is constantly evolving. You are either evolving or getting extincted. The same can applied to your software. If its development goes along with IT-trends, it will survive. Learn from nature – do evolution: optimize to reduce resources consumptions, adapt to challenges and take advantage of opportunities.</span>

#### <span style="font-weight: 400">Check-list to evaluate your product is evolving </span>

<span style="font-weight: 400">Just some checklist to evaluate your software project is evolving:</span>

- **You allocate resources to cope with technological debt.**<span style="font-weight: 400"> Refactoring and fixing code that smells is not a waste of money. keeping a complexity monster on a leash – is a good strategy to keep the development efforts under control.</span>
- **Your monitor the dependencies of your software and apply security patches. <span style="font-weight: 400">Put regular activities for checking and updating dependencies in your backlog. Use tools like </span>[<span style="font-weight: 400">https://owasp.org/</span>](https://owasp.org/)<span style="font-weight: 400">. However nowdays such services as github and npm provide constant monitoring of vulnerabilities across its repositories and alarms you if some dependency on your hosted project appeared to have a critical update.</span>**
- **You are building or refactoring your software on the basis of frameworks that are industry-supported**<span style="font-weight: 400">.Before choosing framework look at its statistics – how many developers are in contributors list, does it have recent commits, how many stars does it have, is it backed by some big company. These all mean the framework is evolving and will let your software evolve with it. Angular and Batman JS started the same year in 2010. Angular is still a hot topic. And when did your hear last news about BatmanJS?</span>

## <span style="font-weight: 400">Nutshell</span>

[![](/static/img/2020/04/photo-1517245386807-bb43f82c33c4.jpg)](/static/img/2020/04/photo-1517245386807-bb43f82c33c4.jpg)

<span style="font-weight: 400">Here we tried to suggest approaches of measuring software development product quality in numerical fashion. You can estimate how predictable, maintainable and evolving your system is by measuring code coverage, degree of following code conventions and measuring other code climate stuff, But numbers won’t tell your much unless you are aware of the development process and know what’s going on under the hood. Numbers just indicate success, but don’t lead to success, as the real knowledge is a knowledge of reasons.</span>