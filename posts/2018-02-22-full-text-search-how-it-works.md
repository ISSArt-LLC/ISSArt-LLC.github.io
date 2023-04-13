---
id: 2498
title: 'Full Text Search: How it Works'
date: '2018-02-22T13:16:56+08:00'
author: 'Svetlana Stasilovich'
layout: post
image: /static/img/2018/02/magnifying-glass-975633_960_720.jpg
categories:
    - General
tags:
    - 'full text search'
    - 'full text search engine'
    - 'full text search tools'
---

## What is full text search?

Full text search is a technique, which allows conducting search through documents and databases not only by a title, but also by content. Unlike metadata search methods, which analyze only the description of the document, full text search goes through all the words in the document, showing information that is more relevant or the exact information that was requested.
The technique gained its popularity in 1990’s. At that time the process of scanning was very long and time-consuming, so it was optimized.
Full text search engines are used widely. For example, Google allows users to find the neeeded query on web pages particularly with the help of this technique. If you have your own website with a lot of data, applying full text search might be very useful because it eases interaction for a user.

## Why do we need it?

Full text search may be useful when one needs to search for:

- a name of the person in a list or a database;
- a word or a phrase in a document;
- a web page on the internet;
- products in an online store, etc.
- a regular expression.

Full text search results can be used as an input for a replacement of phrases and in the process of related word forms search, etc.

## How to make it?

There are different ways of realization of full text search. We can opt for any, depending on the case. To make it easier, let’s divide methods into two groups:

1\. **String searching algorithms**. To find a substring matching of a pattern (needed expression) in a text, we’ll go through the document(s) until the match is found or the text is finished. In fact, most of these methods are rather slow.

**String searching algorithms:**

- simple text searching;
- Rabin-Karp algorithm;
- Knuth-Morris-Pratt algorithm;
- Boyer-Moore (-Horspool) algorithm;
- approximate matching;
- a regular expression.

**Simple text searching** is really simple to implement. This algorithm looks for matches letter by letter. That’s why it takes a lot of time.

**Rabin-Karp algorithm** can use multiple patterns. It conducts a search, looking for a string of length m (pattern) in a text of length n. But first, for each substring in the text, there must be created a special mark, a fingerprint of the same length as the pattern. Only if fingerprints match, the algorithm starts to compare letters.
To create a fingerprint, the algorithm uses a hash function to map arbitrary size data to the fixed size. Therefore, implementation of a hash function and comparing fingerprints allows shortening its average best running time.
This algorithm is good for checking for antiplagiarism. It is able to run through many files comparing patterns of paperwork to files in a database.

**Knuth-Morris-Pratt algorithm**
This algorithm uses information about the pattern and the text to speed up the search, by shifting the position of comparison. It’s based on the partial match.
For example, we’re looking for “walrus” in the tongue twister “Wayne went to Wales to watch walruses”. We choose the first letter of “**w**alrus” and start to compare. First, the algorithm checks “Wayne”, but reaching “y” it understands it’s not a match. After this, it moves on to start looking for matches. Since it knows that second and third characters are not “w” it can skip them and start searching with the next one. Each time when the algorithm finds mismatch the pattern moves forward according to the previously mentioned principle until the match is found or the text is finished.
“**Wa**yne **w**ent to **Wal**es to **wa**tch **walrus**es”. All calculations are stored in shift tables.

**Boyer-Moore algorithm** is similar to Knuth-Morris-Pratt algorithm but more complex. It’s known as the first algorithm that didn’t compare each character in the text. It works in reverse, conducting a search from the right to the left of the pattern. Furthermore, it has extensions like heuristics: the algorithm that is able to decide based on the information at each branching step which branch to follow. They are known as shift rules: the good suffix rule and the bad symbol rule. They allow shifting over the position of a character if we know this character is not in the pattern. For this algorithm performs beforehand calculations in the pattern, but not the text being searched (the string).

This concept is called filtering. And the part of the text, that becomes visible because of the shifting pattern compared to a window, through which the algorithm obtains needed information to conduct a search. These rules dictate how many symbols will be skipped. For this during processing of the pattern algorithm generates lookup tables.

Let’s take a closer look at shift rules. The bad character rule allows skipping one or more mismatched characters. For example, the pattern is “Mississippi”. How the bad character rule works:
It checks for the match from the “tail”. *If not found ­, then shift to the matching character in the pattern, to keep searching for matches.*

\*\*\*\*\*\*\*\*\*\***S**\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
MISSISSIPP**I**

\*\*\*\*\*\*\*\*\*\***S**\*\*\***I**\*\*\*
MISSIS**S**IPP**I**
*If such character doesn’t exist in the pattern, then the pattern moves past the checked character.*

\*\*\*\*\*\*\*\*\*\***E**\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
MISSISSIPP**I**

\*\*\*\*\*\*\*\*\*\*E\*\*\*\*\*\*\*\*\*\***P**\*\*\*\*\*\*\*
MISSISSIPP**I**

The good suffix rule complements the bad symbol rule and is involved in work when a few matches are found, but then check was failed. For example,

\*\*\*\*\*\*\*\***sola**\*\*\*\*\*\*\*\*\*\*\*\*\*\*
colacoca**cola**

\*\*\*\*\*\*\*\***sola**\*\*\*\*\*\*\***o**\*\*\*\*\*\*
**cola**cocacol**a**

Possibility to jump over the text and not to check each symbol makes this algorithm so efficient. However, it’s considered to be difficult to implement. Two heuristics give the algorithm a choice. It chooses the shift that gives the bigger shift. It’s good to use when preprocessing of the text is impossible.

One of the examples of extinction is **Boyer-Moore-Horspool algorithm**. It’s a simplified version of Boyer-Moore algorithm, that uses only one heuristic: the bad character rule. And also it has a new feature. The text and the pattern can be compared in any order, even left to right. All this makes Boyer-Moore-Horspool algorithm faster than its predecessor.

**Approximate matching algorithm** or fuzzy string searching runs a search that finds a close match, rather than exact. To realize the search the algorithm finds an approximate substring with lower edit distance: a number of primitive operations needed to transform one string to another. Primitive actions are the following:

insertion: *cone → cone**y***;
deletion: ***t**rust → rust*;
substitution: *m**o**st → m**u**st*;
transposition: *c**l**oud → cou**l**d*.

Also, this algorithm allows searching using NULL character in the pattern, like “?”. For example,
str**?**ng → str**i**ng, str**?**ng → str**o**ng, str**?**ng → str**e**ngth. As a result, the closest match will be the first two variants, because of a lower edit distance.

**Regular expression algorithm** or regex allows running a search in strings that follow a specific pattern. It is based on using the regex tree to do matching and has a few specific features. One of them allows finding concatenated symbols, like (“www”, “USA”). Another gives a possibility to search according to the list of options, (for example, (jpeg|jpg) will match the string “jpeg” and the string “jpg”). And the last one allows making the query pattern easier, and search for a repetitive pattern, e. g. “(1|0)\*” would match any binary text such as “011010” or “100111”.

2\. **Indexed search**. When the search area is large, the reasonable solution is to create an index of search terms beforehand. Treat it like a glossary with the numbers of the pages where the term is mentioned, which you may notice at the end of some books or papers. So full text search consists of two stages. On the first stage, the algorithm forms this kind of index, or more accurate to say a concordance as it contains the term along with the referring to find them in the text (like “Sentence 3, character number 125”. After this index is built, the search algorithm scans the index instead of the original set of documents and exposes the results.
As you noticed, this approach demands a lot of time to create an index, but then it is much faster to search for information in the documents using index than simple string search methods.

An important part of indexing is normalization. It is word processing, which brings the source text into a standard canonical form. It means that stop words and articles are removed, diacritical marks (like in words “pâté”, “naïve”, “złoty”) are removed or replaced with standard alphabet signs. Also, a single case is chosen (only upper or lower). Another important part of normalization is stemming. It’s a process of reducing a word to a stem form, or base form. For example, for words “eating”, “ate”, “eaten” stem form is “eat”. Like so search request “vegans eating meat pâté caught on tape” transforms into “vegan eat meat pate tape”. In addition, it’s very important to specify the language for the algorithm to work, and even spelling (e. g. English, American, Australian, South African etc.).

## Challenges with full text search implementation

Building an all-sufficient full text search engine requires thorough developmental work and solving plenty of search problems.
The biggest and the most pervasive challenge developers meet is the synonym problem. Any language is rich and any term can be expressed using different variants. It can be variants of a name, for example, varicella and chickenpox, variants of spelling, e.g. “dreamed” and “dreamt”.
Another aspect of the synonym problem that might cause difficulties is the use of abbreviations (TV, Dr., Prof.) acronyms (GIF, FAQ) and initials. Like in the previous example, some documents may not simply contain full or alternative variant.
The existence of dialects also complicates the search. For example, users might not meet results “colour”, querying “color”, or searching for “trainer” find shoes instead of a mentor.
Same problem with obsolete terms. If you ‘google for’ a modern term, you will most likely miss resources, that unpack the issue using only obsolete terminology.
Another problem is homonyms. These are words, that being spelled in the same way mean completely different things. Searching for words like “Prince”, the user sees the results about the members of the royal family, the singer and other. Especially often this problem happens with personal names, and even more often, with words that function both as names and other parts of speech, for instance, “summer”, “will”, “spencer”, etc.
The second aspect of homonyms issue is false cognate. It happens when a word has the same spelling in different languages, but different meanings.
Full text search algorithms and engines are unable to find results by facets. If the user queries “All issues of New York Times about business from 1990 to 1995”, it will not show relevant data, because they don’t know such facets as topic and publication date, unless it’s not enhanced with metadata search.
Also note, you need special ways to include information from images, audio- and video files to the list of results. The other type of full text search implementation challenges is providing high performance on both stages – indexing and searching.
Assume, we have already built an index of terms that a set of documents contains for the current date snapshot. Typically, that stage could demand a lot of time but we could do with it as long as it is a one-time run task. However, for every real system the amount of information increases with the time, so we still need continuous indexing.
As for the search stage, we cannot afford to wait forever while searching. As the index size could be very large, the straightforward ways of navigating over the index are not efficient. So special data structures are used to store and navigate the index, typically different types of trees and custom structures are among them.
So according to aforementioned problems building full text search system from scratch is a really complex process. That is why the simpler way that fits most needs is to use ready solutions as full text search engines.

## Full text search tools in databases vs. full text search engines

Creating a relational database, you might ponder on what’s better to use to realize data search. Relational databases are good at storing, refreshing and manipulating structured data. They support a flexible search of multiple record types for specific values of fields. Full text search systems depend on the type of index to perform search, most of them have capabilities of handling the sorting results by field, adding, deleting and updating records, but still, their capabilities are more limited in this question than relational databases’. But when it comes to relevant displaying of results they are not in the first place.
When there is a need for relevant ranking of results and processing big amounts of unstructured data, full text search engines have no equal.

## Advantages of full text search engines:

- Full text search engines are “out-of-the-box” solutions that can be configured according to your project needs. They contain all the necessary features from both linguistic and technical aspects (like performance and scalability) to save time.
- Full text search engines are open to be enhanced and tailored, so you can implement your own stemming algorithm for your needs and put in the engine.
- There are also some enhancements (plugins, modules). Full text search systems can conduct a search even through non-text or constrained text fields (like product code, date of publication, etc.) adopting the view of the data, using the fact, that each record is a collection of fields. That might be a convenience when there is more than one type of field in the document.

The most mature and powerful engines are [Apache Solr](http://lucene.apache.org/solr/features.html), Sphinx or [ElasticSearch](https://en.wikipedia.org/wiki/Elasticsearch) and we recommend to select one of them regarding the needs.
They have a lot in common: they are open-source (though they have different licenses and [Sphinx](http://sphinxsearch.com/) demands buying a commercial license to be used in a commercial application). All of the engines are scalable and offer commercial support.
We can address the main distinguishers here:

1. Sphinx is tightly RDBMS-oriented.
2. Solr is the most text-oriented and comes with multiple parsers, tokenizers, and stemming tools. It is implemented using Java so it could be easily embedded in the JVM applications.
3. Elasticsearch is commonly used for log management, it is a very simple thing to use and have additional analytical features, which is very important for that area.

There are many more details, so you still need expertise before you select one of them for your project. For instance, Solr has built-in faceting, while Sphinx does not. And if you need to integrate full text search for Big Data apps, Solr can be used here.

And remember, you can always entrust your project to ISS Art professionals.