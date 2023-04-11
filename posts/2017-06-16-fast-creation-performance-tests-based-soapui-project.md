---
id: 2162
title: 'Fast creation of performance tests based on SoapUI project'
date: '2017-06-16T12:14:59+08:00'
author: 'Yulia Shepeleva'
layout: post
image: /static/img/2017/06/emails.jpg
categories:
    - General
tags:
    - 'load test'
    - 'performance test'
    - QA
    - SoapUI
    - testing
---

The role of API has grown over the last few years. The growing use of cloud based technologies leads to more API-interfaces providing access to web-services. API supports this important interaction between the client and service. In this case, not only the proper operation of API methods is very important, but also their performance. Let’s take a look at the tools which are the leaders in conducting automated API [testing](https://www.issart.com/en/services/details/service/testing) such as SoapUI API testing.

SoapUI is a testing tool SOAP and REST API. SoapUI tool allows you to create and run functional API tests. JMeter is an open-source project allowing to do SOAP and REST API based load testing. Let testers perform test suite for a REST API for SoapUI where they have to perform not only functional tests, but also load testing based on the developed test cases. JMeter as load testing tool offers more flexible settings for creating load tests, it has more additional plugins for displaying test results. But in case you’re using a new tool, you need to create a set of REST requests, debug this set, combine some requests to create test cases again.

Can a load profile of service be built based on the set of functional SoapUI tests? It is possible. This is where the new function of SoapUI project conversion to the taurus script will help us. This feature appeared in taurus 1.8.0

### A command-line utility that can be used to convert existing SoapUI scripts into Taurus config

Let’s look at how it can be done. We need a rest api project for this experiment. We’ll take Flickr a test SoapUI project. You can download it [here](https://www.soapui.org/tutorials/flickr.html).

![SoapUI Project Flickr](https://www.issart.com/blog/wp-content/uploads/2017/06/flickr.png)

For using the Flickr API, an API-key is required. It can be obtained when registering with the Flickr [“App Garden”](http://www.flickr.com/services/apps/create/apply). The project defines “ApiKey” property at the project level. It is then used in all requests via standard properties expansion:

![SoapUI Project APIkey](https://www.issart.com/blog/wp-content/uploads/2017/06/api-key.png)

Well, now we have a ready SoapUI project.

Let’s have a look at the functionality of soapui2yaml utility. It allows you to convert the script SoapUI to taurus yaml configuration.

We can run this utility without any additional keys.

*soapui2yaml project.xml*

The result:

![SoapUI Project Result](https://www.issart.com/blog/wp-content/uploads/2017/06/utilty.png)

The file Flickr-soapui-project.xml.yaml is created in the same folder.

![Flickr SoapUI Project](https://www.issart.com/blog/wp-content/uploads/2017/06/yaml.png)

All requests for all test cases are listed in this file. In this script you need to change URL from http to https (Flickr API supports SSL), add a load profile and run this script. Set the number of users to 10. Set the load holding time to 1min.

![SoapUI Project Load Profile](https://www.issart.com/blog/wp-content/uploads/2017/06/load_profile.png)

Run this yaml file.

*bzt flickr-soapui-project.xml.yaml*

The result of the tests can be seen on the status display.

![SoapUI Project Status Display](https://www.issart.com/blog/wp-content/uploads/2017/06/status.png)

So, SoapUI testing project can be converted to the taurus script.

### Support of SoapUI project and its conversion to taurus script

To perform load testing with SoapUI project first needs to be converted to a jmx file. Let us create a configuration file. We will set the number of users equal to 1. And the number of iterations will be 1. Let us run the script and see what the generated jmx file looks like:  
*executor: jmeter  
concurrency: 1  
iterations: 1  
scenario:  
script: Flickr-soapui-project.xml*

Flickr-soapui-project.xml is a SoapUI project.

We will save this configuration yml file and start its execution.

*bzt soapui.yml*

![SoapUI Project Console](https://www.issart.com/blog/wp-content/uploads/2017/06/console.png)

We can see the artifact directory named YYYY-MM-DD\_HH-MM-SS.MS being created in the console.

We also get information on the test duration, the number of tests and the result of their implementation.

The artifact directory contains the following files:

*bzt.log – Taurus log  
effective.json/yml – a configuration file, the rules and all other modifications made during the execution, which were saved in two formats.  
error.jtl – an xml file with the test execution results.  
jmeter.log – Jmeter log  
jmeter-bzt.properties – Jmeter properties  
kpi.jtl – the test execution result in text format.  
Merged.json/yml – the result of merging several configuration files.  
requests.jmx – YAML configuration file converted to JMeter .jmx format  
modified\_requests.jmx – same as requests.jmx plus Taurus-driven changes via YAML  
system.properties – effective JVM System Properties*

Let’s look at the result of the tests. All the tests failed. We will open the tests in the JMeter to look for the cause.

Now let us run JMeter and open requests.jmx

![JMeter](https://www.issart.com/blog/wp-content/uploads/2017/06/jmeter.png)

We can see that, all the requests were converted.

In order for the script to work correctly, replace all HTTP requests in JMeter with HTTPS. ApiKey converted to the variable #Project#ApiKey and is now in Variables from Taurus. The result of the test is displayed in the View Results Tree that you can enable.

Edit the generated configuration yml file to run load tests. Set the number of users to 5. Set the load holding time to 1min.

*executor: jmeter  
concurrency: 5  
hold-for: 1m  
scenario:  
script: requests.jmx*

Run this script. The result is in the console.

![SoapUI Project Console 2](https://www.issart.com/blog/wp-content/uploads/2017/06/console3.png)

The script was run from the folder with artifacts. The result of the tests can be seen on the status display.

So, SoapUI project can be converted to JMeter project through taurus script. Edit these scripts in JMeter. Insert the load configuration in yml script and run it.

You may want to see the resulting .jmx script prior to execution. Add a -gui argument to a bzt command line as the example:

*bzt soapui.yml -gui*

JMeter opens the file requests.jmx. You can run this script to execution.

Therefore the transformation of SoapUI project can be done in two ways. The first is creating a taurus script, editing formed jmx file, editing formed yaml file and running the script. The second is using a command-line utility, editing the ready yml file and running the script.

Now you know how to test web services using SoapUI. The developer documentation is available [here](http://gettaurus.org/docs/SoapUI/).

If you have any questions or recommendations you may contact us via info@issart.com or leave your comments below.