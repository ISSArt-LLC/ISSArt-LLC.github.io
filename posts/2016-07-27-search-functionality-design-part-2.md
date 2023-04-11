---
id: 1808
title: 'Search functionality design practices. Part 2'
date: '2016-07-27T20:27:51+08:00'
author: 'Irina Kolesnikova'
layout: post
image: /static/img/2016/07/search-functionality-1.jpg
categories:
    - General
tags:
    - database
    - filter
    - 'full text search'
    - 'full text search engine'
    - revelance
    - search
    - 'search functionality'
---

Implementation of the search functionality is a challenge for a software developer. Search-related requirements influence significantly on the final architecture of the system. In the [first part](http://www.issart.com/blog/search-functionality-design-practices-part-1/) we studied different filters and some practices of their implementation. In this part I will tell about the full text search.

**<span style="font-size: 22px;">Definition</span>**

There isn’t an exact definition of the full text search, but it usually implies returning the relevant results by the natural language text query. Relevance or score is calculated by the search algorithm.

Text analysis ([stemming, lemmatization](http://nlp.stanford.edu/IR-book/html/htmledition/stemming-and-lemmatization-1.html), etc.) is the separate part of the full text search. Mostly, it is related to the index building while the scoring function usually works with the analyzed text.

Thus, the core of the full text search is the scoring algorithm. Any algorithms are based on the mathematical theory and the scoring isn’t an exception. It is defined by the [IR model](http://wwwhome.cs.utwente.nl/~hiemstra/papers/IRModelsTutorial-draft.pdf) or their combination.

**<span style="font-size: 22px;">Full text search engine</span>**

The full text engine is a tool implementing the scoring algorithm. Unfortunately, you don’t have many out-of-box solutions. There are only 3 well-known open source search engines which implement such an algorithm – [Lucene](https://lucene.apache.org/core/), [Sphinx](http://sphinxsearch.com/) and [Xapian](https://xapian.org/). Other popular open source platforms usually use one of these engines. There are also some commercial solutions, but I’ve never tried them.

There is one more restriction. All the above mentioned engines are Document Oriented. To avoid answering the question “What about the full text search support in MySQL, PostreSQL, MongoDB, etc.?” I would like to to mention that the most of them just provide the text analyzer which is used to create the index, some of them even implements the simple scoring. However, if you meet such search functionality requirements as “I want the objects which contain ‘cats’ to be more relevant by the query ‘pets’ than the objects which contain ‘dogs'”, “I want the swearing posts to be always at the end of results”, “I want matching for one field to be more significant than for another”, “I want the rating to involve the scoring” you don’t have many alternatives. You can use Lucene, Sphinx, Xapian and any solutions based on them. You may use commercial solutions as well or reinvent your own wheel.

Choosing the full text engine is the same as choosing the database. Anyway, it will make your system more complex. As a rule, all these solutions are used as a search tool. As for transactions, consistency, concurrent updates, etc. it will be 90% of your responsibility. Furthermore, you won’t have any kinds of good support of the relationships, because they are all Document Oriented. You won’t likely use these technologies as the single data storage, so you will have the [distributed architecture](http://www.tutorialspoint.com/software_architecture_design/distributed_architecture.htm) with all its pros and cons.

But there are some good news about the performance. The search response time in those engines is amazing (considering the warmed start, the advanced configuration,the reasonable load and the number of data on your environment). If the response time is up to 100ms for 90% of search queries it means that you cooked the engine quite well, even if your search queries are quite complex. And it isn’t a limit. You can reach 10-20ms regarding reasonable data and you won’t need the “monster” with 32 CPU and 64Gb RAM.

If you need the scalable database with the full text search (with [sharding](http://searchcloudcomputing.techtarget.com/definition/sharding), [replication](http://searchsqlserver.techtarget.com/definition/database-replication), etc.) there is a number of good open source solutions based on the above mentioned engines.

The other good feature is that the filters concept easily goes together with the full text search. Thus, if you have such usecases as “Users are typing the text in the search field, the system returns the relevant results that can be filtered by some criteria” and you have complex conditions of the relevancy you can use the full text search engines.

**<span style="font-size: 22px;">Relevance</span>**  
The relevance is quite private and subjective from the user’s point, but from the search engine’s point it is the result of the scoring function and it is absolutely objective.

As a rule, this function is complex, it can be similar to the length of the vector which is the vector product of the normalized document and query vectors. Nevertheless, it is objective and can be different from the user’s expectation. So you should be ready for difficulties when testing relevance. It is better if you have detailed requirements to make the score quite predictable and have the relevant results.

Returning to the example with the projects and catalogues (see [Part 1](http://www.issart.com/blog/search-functionality-design-practices-part-1/)), let’s suppose that the user doesn’t know the project details and just want to find all projects related to cars. We provide the user with a search field, he writes the word ‘car’ and expects to get the projects related to ‘cars’. The result depends on our index and the full text query we perform to the engine.

We have the following Key-Document schema:

```
{
    id : "key",
    creation_time : "timestamp",
    collection_id : "indexed value",
    catalogues : ["indexed array"]
}
```

We can use the [Porter stemming algorithm](http://snowball.tartarus.org/algorithms/porter/stemmer.html) to analyze the **catalogues** field. For example, if there are the catalogues ‘Super cars’, ‘The most expensive cars in the world’ and ‘Car’, its projects will have the different score by the query  
**catalogues:car**

As we are going to use the catalogues field for search, it makes sense to use the same analyzer for its value in the query.

The following queries:  
**catalogues:car**  
**catalogues:cars**  
**catalogues:’the car’**

will return the projects from the ‘Super cars’, ‘The most expensive cars in the world’ and ‘Car’ catalogues.  
If we use [TF/IDF based](https://lucene.apache.org/core/4_0_0/core/org/apache/lucene/search/similarities/TFIDFSimilarity.html) score calculation the projects from the ‘Car’ will have a greater score because of the less number of terms, however, there won’t be a difference between the catalogues ‘Cars’ and ‘Car’. If you want to take into account this difference you can create the copy of the original field, analyze this copy in another way and use it in the query. You can apply this method to support the multilingual search as well.

This is an initial point for the full text search implementation. The more detailed requirements you will get the more tricky schemes and queries you will design. You can improve the scoring by adding other fields (the project’s name, the project’s author, etc.) with the different coefficients ([boosting](http://www.analyticsvidhya.com/blog/2015/11/quick-introduction-boosting-algorithms-machine-learning/)) or you can define the boosted terms which increase or decrease the score of your documents even if these terms are absent in the query.

**<span style="font-size: 22px;">Terms vs Phrases</span>**

In general, there are 2 types of the full text queries – terms and phrases. Before the engine stores the document in the index it analyzes each field. After the analysis it has the terms and their position in the original value. Concerning the language analyzer if the original value contains the stop-words, their position isn’t excluded from the indexed value.

Let’s see the example of the English analyzer.

The phrase ‘Night and day’ contains 3 terms, as ‘and’ is the stop-word, the analyzed phrase will be:

night -&gt; pos 0  
day -&gt; pos 2

The search by the phrase taking into account the terms order, i.e it compares the positions in the query and the document. It uses the maximum allowed difference between the terms position in the query phrase and the original phrase (slop).

Thus, if you search by the phrase ‘Night day’:

night -&gt; pos 0  
day -&gt; pos 1

then ‘Night and day’ can match the phrase ‘Night day’ (because ‘day’ follows ‘night’), if the slop isn’t 0.

In general, the index for one field looks like the list of terms where each term is associated with the list of the document keys and the list of positions in the original value of this field in each document.

When you search by one field and one term, the engine defines the keys of the documents by this index quickly.  
Complexity (several fields or/and phrase search) resolves by the Map Reduce algorithm. The same method is applied for the filters. Each filter handles separately (Map) and the final result is created by the conjunction or disjunction of the filters (Reduce).

**<span style="font-size: 22px;">Conclusion</span>**

Regarding the search interface on the code level it should correspond to your usecase. When you develop not a framework, but the business application it is a bad practice to create the universal interface or universal filters ignoring the data domain.  
For the full text search there is the only one right condition – one string which makes sense for the final user. The filters and additional sorting are possible, but they depend on the final user’s needs. For certain usecases there should be certain filters, for certain filters there should be certain interfaces. If in your system the full text search isn’t combined with the filters, you can split indices or even databases for these issues, at least you should split the interfaces for these usecases.

The same deal with the filters. Don’t make the premature optimization and introduce the universal filter ‘fieldName &gt; value’, when you just need to display top N newest objects. Your application is the domain language that reflects the real world data domain. In the domain you have no ‘fieldName’ and ‘value’ terms, but ‘object’ and ‘its novelty’.

And the same kind of thing with the database. It is wrong to say that one database is worse than another. Each database resolves concrete issues, unfortunately, there isn’t the silver bullet. Regarding your search functionality requirements you can choose the perfect or an appropriate type of the database. Don’t be afraid to try something new, but don’t be led by the fashion, appeal to common sense and search the compromise.