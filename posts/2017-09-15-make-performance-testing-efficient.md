---
id: 2283
title: 'How to Make Performance Testing More Efficient'
date: '2017-09-15T16:28:55+08:00'
author: 'Konstantin Firsanov'
layout: post
image: /static/img/2017/09/MWVZ2HPTP0.jpg
categories:
    - QA/Testing
tags:
    - performancetesting
    - QA
    - testing
---

Performance testing is a type of testing proceess to determine the responsiveness, throughput, reliability and scalability of a system, it has under a certain load. The goal of the performance testing is one of the listed below:

1. To assess readiness of the system for the production release,
2. To evaluate performance of the system against some baselines,
3. To find the best configuration settings of the system,
4. To find the source of performance,
5. To determine throughput levels.


In order to successfully accomplish any of these tasks, it’s necessary to set up an environment where tested system will be deployed; to set up load generator that will imitate the end-users interaction with the system under the test; to determine performance intensive use cases and develop load testing scripts or an application for the load generator; to establish the performance testing process for the project and, of course, to have a qualified QA engineers for all these tasks. The primary accent in the performance testing should be done on the process, how to establish and maintain it, as it orchestrates all activities. Nevertheless, the other steps are important as well. This article highlights the best practices for each activity in the performance testing. Following them it helps to successfully develop performance testing strategy and get performance metrics so important for your project, not spending large budget for the performance testing.

The classic performance testing process is described in the performance testing tutorial from the Microsoft. It has seven steps and activities related to these steps:

1. Identification of the environment, where the system will be deployed and performance of the system will be evaluated through the tests.
2. Identification of the performance acceptance criteria.
3. Design of the tests.
4. Configuration of the environment.
5. Implementation of the tests in the scripts or applications.
6. Execution of the implemented tests.
7. Building reports and conducting analysis of the test results.

In the iterative development process these seven steps may iterate, as new features implemented on each iteration may require an update of the load testing environment, the appearance of new metrics, the design and development of new tests, that in their turn will result in the new reports. In order to make performance testing more efficient, it’s necessary to carefully plan each of these steps and use the best practices that proved their efficiency. In this article we will elaborate more on each of these steps, highlighting the best approaches. But before drilling down to the description of every step, the goal of the performance testing has to be formulated by the customer or business analyst, who develops and processes customer’s requirements. Sometimes it is done with the help of the development team. The goal of the performance testing determines performance testing types that development and performance testing team will conduct. And selected performance testing types impacts on each of the step below.

## Load testing environment

Load testing environment impacts directly both on the results of the tests and on the costs involved in the performance testing. The performance testing is usually required for the high load applications that are generally cloud based. The load testing environment configuration should be selected similar to the configuration of the production system, current or planned. It enables to consider results of the performance testing as what will be in the reality, without scaling them up and transforming them. As high load applications require powerful hardware or instances, the cost of the load testing environment could be very high. From the other side in order to cut down the cost of the environment that will be used to conduct load testing, the less powerful instances or hardware can be used. But in this case the test data, baselines have to be scaled down and performance testing reports scaled up in order to see the real picture. It is not an easy task, as the performance metrics are not a linear function of the hardware parameters (CPU, memory size, network throughput, performance of the disk subsystem). If budget allows, select load testing environment configuration close to the planned or existing configuration of the production, but find the ways of cutting costs of the running it. For example, if load testing environment is deployed on the on-demand AWS instances, simply switch them off when they are idle.

The next important thing is the load generator. Load generator is the performance testing software or performance testing service, which generates the load sending requests over certain network protocols. There are many options that vary on the terms of price and efforts that are required to manage these tools. For example, [Blazemeter](https://www.blazemeter.com/) is the excellent, cloud based solution of a load generator that ramp ups as many users as one may need, with very good graphs and reports. But this tool may be the expensive one. The cheapest solution is the engagement of the pool of the instances or servers with the installed and configured [Apache JMeter](http://jmeter.apache.org/). The cost of this solution is only the hour rate of the instances and the qualification of the performance engineers, who will tune this system. And, of course, there are other tools in this range from open source to commercial ones to select from, according to your budget. In order to cut the latency the load generator should be located very close to the load testing environment, for example, in the same AWS region.

Except the environment and the load generator, the tool for collecting resource utilization metrics from environment servers have to be selected. The resource utilization tools also vary in cost and characteristics from commercial to the open source products. For example, [NewRelic](https://newrelic.com/) – the commercial tool that can be integrated with the Blazemeter so, that all metrics, both time related and resource utilization are available in one place. On the opposite side, there is the performance monitor listener, open source tool, installed for JMeter that collects resource utilization metrics from the tested system. But using the last one requires more efforts to install server agent to the tested system, configure entire environment, synchronize the collection of the time related and resource utilization metrics.

The best practice in this case is to understand the load to be generated, performance metrics to be collected, allowed budget and based on this data select tools.

## Performance acceptance criteria

This is a very important step, as at this step the development team gets the performance requirements in the form of performance testing criteria. Usually they include the number of the concurrent connections, the average length of the user session, response time of the entire system, some of the user operations or particular API calls, throughput of the system or some of the particular API calls, performance in terms of a number of the business operation per time unit, reliability and stability of the system, recovery time. Criteria can be granulated by the time of the day or depending on the other background activities of the system.

These are the primary criteria, one have to start from. It’s not necessary that all of these requirements have to be relevant to you project. The criteria and the goal of the performance testing determine the approach to the test design. All performance requirements have to be fixed and be available for the development team and the customer for reference.

## Test design and test scripts implementation

Test design is a critical part of the performance testing process, as its goal is to create load and usage scenarios, according to the fixed criteria. At this stage the performance engineers work on the test data, the load tests will be based on, and usage scenarios, the load tests will exercise. Of course it depends on the level the performance testing is conducted and the objective of some performance test. On the integration level, when the performance metrics of some API request are validated, the usage scenario is very simple and the primary focus of the test design is on the test data. From the other side for performance tests conducted on the system level, determining of the system usage scenarios becomes more important.

The test data is a very important part of the test design. If production data is available and if it can be deployed on the load testing environment and accessed and used by load tests, then use cases implemented for load tests have to use these data.

If production data is not available or can’t be used, then the load tests data have to be designed. If the system is in the production and there’s an access to the production logs, they have to be analyzed to understand the activities and data usage for different scenarios. It helps to determine the number of login accounts, objects, that have to be created or to use (if production data is available) in the test. If test data is created, it’s obviously generated by some script or specific application, created for this purpose. It may be generated by the load testing script itself, for example in the setUp thread group and be removed in the tear down thread group of Apache JMeter, but it may take considerable amount of time, as the data volume may be huge. To save the time for test data deployment before the test, it makes sense to create a backup of the test data and restore it every time before the test is launched.

The usage scenarios implemented for the load tests should be designed together with the analysts. These scenarios have to include: contractually obligated, most common, business critical, performance intensive, usage scenarios of technical concern and stakeholder concern. The identification of the usage scenarios is based on the requirements and use cases, marketing materials, interviews with stakeholders and users, information from usage of similar systems. The valuable information can be obtained from system logs. For performance tests conducted on the system level the usage scenarios are consolidated into the workload model. In the workload model scenarios have to be distributed. To make the distribution model, it’s necessary to determine how often each scenario executed. Access to log files helps greatly in it. If logs are not available, then determining usage scenarios distribution turns into the forecast. Often it makes sense to create three or more workload models and design tests for all of them. For example, anticipated usage, best case usage, worst case usage scenarios.

Determined test data and workload models are the initial material for the test scripts. Below there’s a few best practices for the test data design and load test scripts development:

- Designed data have to reflect correct business actions.
- Key feature in the test data is randomness.
- Test data have to be dynamic to avoid using of caching, that may lead to the faster results. Although, it depends on the purpose of the test.
- Assert the contents of the returned pages and responses. It may happen, that responses with a successful response code may return invalid contents.
- Simulate ramp up and cool down periods carefully. In real life the load doesn’t peak instantly from zero to 10000 simultaneous connection, for example.
- Developed load testing scripts have to be debugged and reviewed, before they are launched for collecting performance metrics.
- The rule of thumb for script debugging – launch test three times in scaled down versions for one user, three, five users with different data sets.
- Validate test data, that was used by each user during the script debugging. Investigate database contents, logs, failed requests after each test script run, while debugging it. Finding a bug in your script later will result in the incorrect results, wasted time and money for resource usage.
- Store test scripts in a version control system. It helps to track changes in test scripts together with the source code changes and changes in the load testing environment.

## Configuration of the environment

At this stage the environment for the conducting load tests is configured, test data is deployed, the configuration of the load generator and monitoring tools is done. If the load testing environment, load generator instances are cloud based, then it makes sense to prepare application or script, that switches these instances on / off to save the project budget, if on-demand type AWS instances are used.

Since continuous integration is the best practice in the development methodologies, the load testing has to be included into the continuous integration process. It doesn’t matter which continuous integration tool is used, the sequence of steps will be the same: spin up the instances of the load testing environment, start the load generator, prepare scripts, according to the planned tests, execute tests, collect performance metrics, build the report and switch off the instances to save the budget.

## Running the tests

In this activity performance testing scripts are executed either automatically as a part of the established CI process or launched manually by QA engineers. Below, there are a few very important practices to follow for performance tests execution:

- Tests should validate the environment against which they are launched. It maybe a script, that is launched from the load generator before the test starts or a few requests, executed in the setup thread group or separate job in the CI tool. There’s no sense to start executing performance test if the environment is not configured correctly or simply doesn’t respond.
- Pay attention at the background processes, that may run on the load testing environment. Check cron jobs, antivirus activities. Though for some tests, these processes should be running over the test.
- Run a simple test, that exercises a primitive usage of the system as a “smoke” test, before you launch a real test. It simply warms up the system. Validate this smoke test results before running real tests. For example, there’s no sense to launch real test for a few thousand users, exercising various cases, if the simple ‘NOP’ call fails.
- Monitor resource utilization of the load generator. Pay attention on the CPU and memory usage. If CPU usage of the load generator is over 90% or it starts using swap over the test, it may not be producing the required load, so the test result may be incorrect. Check load generator logs, if there are any issues in the test results.
- Be sure, that no task is running on the load generator, while it is executing the test.
- After each test run investigate the failed requests.
- Investigate logs of the application server, database, other instances for any possible issues.
- Look into database and run a smoke test to check database entries, which has been created throughout the test.
- Launch test a few times. Use an average metrics over the test run, the best ones and the worst ones for the analysis.
- Remove data created during the test run, after the test finishes. It’s necessary to reset system before the next test.

## Building reports and conducting analysis on the test results

The reporting of the performance testing results and their discussion in the development team is the crucial part of the development project and the performance testing, that is its stage. Below there are key principlesof the effective reporting:

- Analyze test results right after each test run. Don’t leave it on “tomorrow”.
- Comment each test run.
- Report early, report often. Customize reports. It’s crucial, to share information with the team. But for the effective sharing it’s necessary to establish reporting format for technical, non-technical stuff and the stakeholders.
- Report visually. The graphical information is easily perceived, so it’s necessary to establish the pattern of the graphical representation.
- Use right statistics and consolidate data correctly. Establish the pattern of reporting so, that graphs and tables from different tests would identify trends and issues in the obvious way. For example, place charts and tables side by side.
- Use concise verbal summaries. Provide written summary to every test results.
- Make raw data available. Provide the link to full raw and unprocessed reports to the technical stuff. It may be useful for the developers as the source of additional information.

These are the key principles and established practices of how to make performance testing efficient which yield results, the development project will benefit from. If you have any questions about performance testing feel free to contact us at <info@issart.com>. More information on the performance testing is available in many blogs. The one which is very active and has tons of valuable information is the [Blazemeter company blog](https://www.blazemeter.com/blog) where experts from IT world, including ISSArt company share their knowledge about performance testing.