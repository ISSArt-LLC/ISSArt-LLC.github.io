---
id: 2069
title: 'How You Can Use Cassandra in the Big Data World'
date: '2017-03-31T18:25:16+08:00'
author: 'Sergey Maslov'
layout: post
image: /static/img/2017/03/BIG_DATA.png
categories:
    - General
tags:
    - bigdata
    - Cassandra
    - database
    - scalability
---

In simple terms, the goal of typical big data systems is to get some business benefit of information. Commonly, we need to collect the data, save it in a certain location, perform some analysis (up to data mining), and visualize results.

Though every business case is unique and there is still no silver bullet, some frameworks, tools and platforms are widely used as [big data system](https://www.issart.com/en/lp/java-development-team/big-data-solutions) building blocks. You may have heard frequently used words like Hadoop, Hive, Spark, Kafka, Cassandra, HBase and others.

This article covers the main features of Cassandra DB with respect to usage as an element of big data system infrastructure and our experience.

## Cassandra data model

Basically, you can treat Cassandra as “key-value” which means it was originally designed to effectively support a certain type of operations: value insertion and retrieval of value by its key. Cassandra 2.x and 3.x have slightly different data models, and we will consider 3.x here.

Although conceptually it is still key-value storage, there are some tricks here. Internally, table is a map of partitions indexed by partition key, and the partition itself is a map of ordered rows indexed by clustering. To simplify, you may think about this structure as Map&lt;byte\[\], SortedMap&lt;Clustering, Row&gt;&gt;.

So rows could be identified by the combination of partition key and clustering key. The hsh value of partition key determines which Cassandra node (replica) would store the data.

## Fast writes of device data

Cassandra saves data in memory (*memtable*) and in append-only (*commit*) log.

If *memtable* contents limit is exceeded (that is configurable), the data is flushed to the permanent storage (*SSTable*) and the commit log is purged. Commit log itself is used for recovery of in-memory information after power outage or other hardware failures.

The key point here is that Cassandra does the memory-first writes, so it’s extremely fast.

Assume, we are working with data in the area of Internet of Things (IoT). So, initially we have many sensors and other devices liked over wired connections, network (WiFi) or Bluetooth. Initially, we need to gather their real-time data for further processing in the single place. Sensor values should be written to storage as fast as possible, because new data is expected soon. And Cassandra provides this ability.

## Cassandra data requests

There is a special subset of SQL created for querying. It is called CQL and though from the first sight it looks more like SQL, that’s not really true. It’s very limited in syntax and functionality. For instance, the latest versions of Cassandra have no joins and support aggregation only within a single partition. So there is no way to find maximum, sum or average within the whole dataset using CQL, and that means no real-time data analysis.But you don’t expect key-value storage would deal with it out-of-the-box, right?

In conclusion we could mark two key points here:

1. As CQL is limited, you need to model the tables to fit the queries needed for support. It means that you should forget about RDBMS normalization. One table per query type is a typical scenario, so that many tables may repeat the same data. Seriously, you need to think over use-cases along with business analysts thoroughly [before database tables creation](http://www.datastax.com/dev/blog/basic-rules-of-cassandra-data-modeling).
2. You need some external tools to analyze data (aggregation, joining data from multiple tables, etc.) . What we recommend to use, is Cassandra data processing via [Apache Spark](http://spark.apache.org/). You can analyze data via Spark streaming batches directly, or retrieve the whole Cassandra data via Spark to be put in the HDFS first. The decision also depends on your development team skills. Assume, we have skilled DBAs with strong SQL background. So it would be more effective to simply put data in HDFS first and do analytics using [Apache Hive](https://hive.apache.org/) HQL queries later. Or, another case, you have senior scala developers in your team and you’d prefer to have scala Spark jobs for analytics instead.

## Working with IoT time series data

Turning back to sensors, typically they provide data with a regular discrete refresh interval. So we have measurements of the same variables over a period which is called time series data.

Assume, we need to store sensor data and the only real-time query needed is to select daily measurements of a single sensor. Considering the previous section, we could store measurements in the table of the structure, described below:

`<span style="font-weight: 400;">CREATE TABLE measurement_by_day (</span><span style="font-weight: 400;"><br></br></span><span style="font-weight: 400;">sensor_id text, date text, event_time timestamp, value text, PRIMARY KEY ((sensor_id, date),event_time)</span><span style="font-weight: 400;"><br></br></span><span style="font-weight: 400;">);</span><br></br>`  
*Measurement\_by\_day* table has composite partition key (*sensor\_id, date*) and *event\_time* as clustering column. So you can perform a common select query in the form of

`SELECT * FROM measurement_by_day WHERE sensor_id ="temp_16" AND date="2017-22-03"`

As was pointed before, that query will be fast by nature.

You can find more information about timeseries data and Cassandra [here](https://academy.datastax.com/resources/getting-started-time-series-data-modeling) and [here](https://www.datastax.com/dev/blog/advanced-time-series-data-modelling).

## Big Data Storage Scalability

Another important thing about big data storage is scalability. It’s great, when we have no need in deep system architecture design changes to support increasing amount of data. Besides, for data storage we typically prefer to have horizontal scalability (adding more servers to the existing data center) to avoid downtime.

[![](/static/img/2017/03/scalability.png)](/static/img/2017/03/scalability.png)

Cassandra provides linear scalability. You could simply add new nodes to the existing data center online to improve performance. For instance, assume there are *N* Cassandra nodes within your data center so they handle *X* transactions. If you double your nodes (2\**N*), the system will be able to support twice(2\**X*) as many transactions per second .

Moreover, there is multi data center replication, so you don’t have to limit deployment within a single DC. This feature is provided out-of-the-box and consistency (see [later](https://docs.datastax.com/en/cassandra/3.0/cassandra/dml/dmlConfigConsistency.html)) level could be set considering data centers replicas.

## Tunable read/write consistency

Consistency is a property of distributed system and it reflects that every read receives the most recent write or error (that is a equivalent to have a single up-to-date copy of the data). Don’t treat it like boolean value (either the system has consistency, or not), it’s more like fuzzy logic value (different levels of confidence). You may recollect the CAP theorem and [the current thoughts about it](https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed).

Cassandra provides tunable consistency for read and write requests [independently](https://docs.datastax.com/en/cassandra/3.0/cassandra/dml/dmlConfigConsistency.html).

Backing to the IoT, users do not always need the latest sensor value. Sometimes they’re fine with the value measured a second before. So we really don’t need to return the record after all replicas have responded.

Another case is simple key-value storage. You could also populate all nodes with exactly the same data beforehand, and using consistency level “ONE” could be the reasonable.

## Cassandra in the high-level big data system architecture

To summarize, we could define two common roles of Cassandra:

**1. Cassandra as raw data storage.**

So we put any appearing data right in Cassandra and that’s fast. Then we do batch processing via Spark batch job, which either performs direct Cassandra data analysis or puts data into HDFS for further processing.

**2. Cassandra as final data storage.**

We’ve already performed some data processing and then we put final data in the structure suitable for end-user needs. So all we want is to provide very fast key-based search to end-user.

For instance, logistics company accumulates tracking operations information in the data warehouse as soon as the operation is received. Business analyst wants to see daily tracking statistics (parcels shipping delays, average service time, etc.) and he doesn’t care about live view (in terms of minutes or even hours), he is more interested in the history of the previous days (which would not be changed). Special scripts could process daily tracking data, do aggregations and put the results into Cassandra. So analyst could use date as a key and get report as a value.

## Conclusion

We tried to cover some most common Cassandra features usage, without diving into details like deployment and configuration, replication strategies, partitioners, quorums, etc. Undoubtedly, these topics demand another article.

We also believe that you may have some other great Cassandra-related experience and cases.

So how do YOU use Cassandra?