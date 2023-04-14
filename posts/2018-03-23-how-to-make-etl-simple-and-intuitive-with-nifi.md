---
id: 2536
title: 'How to Make ETL Simple and Intuitive with NiFi'
date: '2018-03-23T15:16:19+08:00'
author: 'Anastasiya Dokaeva'
layout: post
image: /static/img/2018/03/pexels-photo-577585.jpeg
categories:
    - General
tags:
    - NiFi
---

*Is it possible to implement ETL with an opportunity to make changes during execution and a completely visual processing process without writing code at all?*

*Yes, it is. With NiFi.*

Implementation of ETL is one of the most common tasks now. Creating an aggregator site or simply integrating several enterprise applications leads to the need to solve the ETL task. You can solve this problem with the help of well-known frameworks, such as Apache Camel for example. But let's try doing it with NiFi.

### *So, what is NiFi?*

NiFi was created by the NSA and was called “NiagaraFiles” and in 2014 was given over to the Apache Software Foundation (ASF) as part of the NSA technology transfer program. Currently, it is distributed under Apache License 2.0.

Its main features are:

- user's web interface;
- routes can be changed in the runtime;
- flexibly configurable.

You can learn more details about the main features of the system here [Apache NiFi Overview](https://nifi.apache.org/docs.html). This article will cover only the main points that provide visibility and the ability to make changes in the runtime.
Let's look at a simple ETL task like reading data from FTP, converting character set and uploading to the database.

### *Preconditions:*

1. NiFi was installed and is ready for use now.
2. NiFi User Interface from [Apache NiFi User Guide](https://nifi.apache.org/docs.html) was read.

![Preconditions](/static/img/2018/03/start.jpg)

### *Implementation*

NiFi design is based on Flow Based Programming idea. All input files go through a chain of connected processors that perform some actions.
We should create such chain to implement our task. We will call this chain 'a route'. And we need a processor for reading data from FTP for our route. NiFi has a lot of already implemented processors and we can choose one of them.

![Choosing processor](/static/img/2018/03/choose.jpg)
We choose GetFTP processor.
![Choosing GetFTP processor](/static/img/2018/03/route1.png)
We need processors for converting character sets and uploading to database. And we can choose them from already implemented processors too. We choose ConvertCharacterSet and PutDatabaseRecord.
We want to transfer files from FTP to database after converting the character set, hence we connect GetFTP processor with ConvertCharacterSet and further with PutDatabaseRecord processor.
![GetFTP processor](/static/img/2018/03/route2.png)

![Error](/static/img/2018/03/error.png)

Sign in Processor corner shows processor's configuration state (correct or incorrect). The current sign means that processor's configuration is incorrect.We can see what the problem is.

We set correct settings for all the processors.

*1. GetFTP processor*
![GetFTP settings](/static/img/2018/03/ftp_settings.png)

*2. ConvertCharacterSet processor*
![ConvertCharacterSet processor ](/static/img/2018/03/convert_settings.png)

*3. PutDatabaseRecord processor*
![PutDatabaseRecord processor](/static/img/2018/03/database_settings.png)

*4. CSVReader processor*
![CSVReader processor](/static/img/2018/03/reader_settings.png)

We need to define how exactly each type of processor results should be handled too. Let's look into PutDatabaseRecord processor details (SETTINGS tab), for example.

We can see 3 type of results: **failure, retry, success**. We choose **failure** and **success** types as Automatically Terminate Relationships. We should definitely handle **failure** type results in a different way and we can do it using PutEmail processor, LogAttributes processor or something else, but we are not going to do it now, because it is just an example. According to the description of **retry** type, attempting the operation again may succeed. So we can send this type of results to PutDatabaseRecord processor again for a second attempt.
![PutDatabaseRecord processor details](/static/img/2018/03/route8.png)

### *Visibility*

And our route is ready, we can see it below:
![Route](/static/img/2018/03/route3-1.png)

Each processor shows the number of files that were handled. The content and attributes of each file can be obtained as well. This feature is called DataProvenance in NiFi.
![DataProvenance](/static/img/2018/03/provenance.png)
![Provenance event](/static/img/2018/03/provenance_event.png)
![DataProvenance](/static/img/2018/03/provenance2.png)

It's so comfortable to support the system without the need to search in logs trying to understand what exactly has happened. Do you agree?

### *How to make changes in the runtime*

Let's change our route and upload the data to another FTP, for example. I've stopped PutDatabaseRecord processor and added a new PutFTP processor.
![Adding a new PutFTP processor](/static/img/2018/03/route5.png)

You can see that input files are in the queue to PutDatabase record.
![Input filesin the queue PutDatabase record](/static/img/2018/03/route6.png)

You need to change the destination of the defined connection from PutDatabaseRecord to PutFtp processor and that is all.There is our new route. And we can see that all data from the changed connection that stood in the queue were handled by PutFTP processor.
![New route](/static/img/2018/03/route7.png)

We have changed the route in NiFi.

Let's sum up. We created a route that resolved our simple ETL task. After that, we made some changes to this route in the runtime without any loss of the source data. All this was done without writing the code and it was rather simple.

I want to add that NiFi has a lot of already implemented processors, but you can develop a processor yourself if you want. It's a really interesting tool with a lot of other features and processors.