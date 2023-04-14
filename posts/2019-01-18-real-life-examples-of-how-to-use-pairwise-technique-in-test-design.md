---
id: 3146
title: 'Real life examples of how to use pairwise technique in test design'
date: '2019-01-18T09:00:10+08:00'
author: 'Mikhail Kharitonov'
layout: post
image: /static/img/2018/12/adult-apple-device-business-340152.jpg
categories:
    - QA/Testing
---

It’s clear that there’s a point where a comprehensive testing cannot be performed by creating a set of tests using a non-formal or even random approach. Experienced testers have to address different testing techniques to maintain acceptable level of coverage and high bug detection rate within a tight schedule. In this article we are going to look at and get familiar with one of the most effective yet easy-to-use testing techniques called **pairwise testing.**

Testers rarely have to deal with simple systems. Usually, they are supposed to test complicated software with a great variety of input and output values, unobvious correlation between parameters, selected options and execution flows. Luckily, testing techniques often let testers overcome an otherwise overwhelming complexity. 

While comprehensive testing of a single module can barely discover all of the issues, testing every possible input combination is even worse – for real systems it’s just impossible to create billions of tests and execute them. Choosing tests randomly may help, but people, even testers, hardly make their choice at truly random. Their choice tends to be determined by subjective perception, assumptions, personal preferences in tools and approaches, and so on. However, according to studies, most bugs and defects are caused by incorrect interaction between two modules or functions. This is a fundamental basis that makes pairwise testing both efficient and relevant. 

Consider a web shop that should operate with different types of customers:

- individuals
- companies
- partners

their locations:

- European Union
- the USA
- China
- India
- Australia

payment systems:

- VISA
- MasterCard
- PayPal
- bank transfer

different browsers:

**Google Chrome**
**Mozilla Firefox**
**Safari**
**Opera**

To test every combination of all these parameters at least once for this still oversimplified example, we need to create 240 tests. Adding an additional parameter of just two options – delivery by FedEx or DHL – increases the number of tests up to 480. Picking up tests randomly to create a much more manageable subset of tests will drastically decrease test coverage and, hence, the quality of the system as a whole. Fortunately, we can apply pairwise testing to avoid quality reduction using a reasonable and manageable number of tests. 

ISQTB defines pairwise testing *as* *a* *black box test design technique in which test cases are designed to execute all possible discrete combinations of each pair of input parameters.* 

As a black box testing technique, pairwise testing concentrates on comparing an actual behaviour of the system with an expected behaviour by managing input values. Instead of creating tests for every possible combination of all parameters, pairwise testing encourages the tester to create a set of tests where every combination of two parameters (so, a pair) is tested at least once. That approach lets greatly reduce the number of tests while maintaining 100% coverage and high bug detection rate.

### **Orthogonal array definition**

Consider the A, B and C. How many pairs can we make? { A; A }, { A; B }, { A; C }, { B; A }, { B; B }, { B; C }, { C; A }, { C; B }, { C ; C }, nine in total. An orthogonal array is a two-dimensional array that has an unusual property – any two columns in the array contain all pairs of values:

| **\#** | **column1** | **column2** | **column3** | **column4** |
|---|---|---|---|---|
| 1 | A | A | A | A |
| 2 | A | B | B | B |
| 3 | A | C | C | C |
| 4 | B | A | B | C |
| 5 | B | B | C | A |
| 6 | B | C | A | B |
| 7 | C | A | C | B |
| 8 | C | B | A | C |
| 9 | C | C | B | A |

If you look at any two columns and discard all other, you will still have all 9 possible **pair combinations** of { A; B; C }. Orthogonal arrays have their own notation, and for the array above, it will be L<sub>9</sub>(3<sup>4</sup>), where:

- 9 is the number of rows in the array;
- 4 is the number of columns;
- 3 is the number of different values that a column can take.

So, L<sub>9</sub>(3<sup>4</sup>) is a 9×4 array where every column can take up to 3 different values. Make notice that orthogonal arrays don’t contain all possible combinations of { A; B; C } so { A; A; B }, { A; B; A }, { B; B; B } and some other don’t appear. It’s because they’re triples, while orthogonal arrays only guarantee that all pairs appear in the array. There’re orthogonal arrays that have a different number of possible values for different columns. For example, L<sub>64</sub>(8<sup>2</sup>4<sup>3</sup>) is an orthogonal array that has 64 rows, two columns of 8 values and three columns of 4 values.

Unfortunately, in real software we have many more parameters (aka “columns”) and values for every parameter (aka A, B, C), and L<sub>p</sub>(X<sub>1</sub><sup>n<sub>1</sub></sup>X<sub>2</sub><sup>n<sub>2</sub></sup>…X<sub>m</sub><sup>n<sub>m</sub></sup>) orthogonal arrays may not exist. So, our goal is to locate the next big enough array and “insert” our variables properly. In such scenario, completely empty columns (every cell is empty in the column) may appear within the array. All you need to do is to discard them completely.

There’re plenty of tools that help to locate a suitable orthogonal array considering the number of the variables and their values. There’s a nice list of them: [http://www.pairwise.org/tools.asp](http://www.pairwise.org/tools.asp). Be aware that some tools might not be supported anymore or require payment. We will use web-based and free [https://pairwise.teremokgames.com/](https://pairwise.teremokgames.com/) below in this article.

### **Strategy**

**Step #1
To apply pairwise testing to the system under test (SUT), we need to create a list of input variables. In our first example, it would be:


- CustomerType
- Location
- PaymentMethod
- Browser

**Step #2
For each of these variables we need to define a complete list of possible values:

CustomerType { individual, company, partner } – 3 values;
Location { EU, USA, China, India, Australia } – 5 values;
PaymentMethod { VISA, MasterCard, PayPal, transfer } – 4 values;
Browser { Chrome, Mozilla, Safari, Opera } – 4 values.

**Step #3**
Considering input variables as columns and any row as a separate test, we need to choose a minimum suitable orthogonal array. Being testers, we all have to have some general knowledge about orthogonal arrays:

1. Сhoose any two columns, all the pair combinations will occur within all of the column pairs;
2. There might be duplicated tests.

Let’s fill the columns with values of the variables (the order doesn’t matter):

[![](https://issart.com/blog/wp-content/uploads/2018/12/generating_array-300x158.png)](https://issart.com/blog/wp-content/uploads/2018/12/generating_array.png)

and Generate Pairwise:

[![](https://issart.com/blog/wp-content/uploads/2018/12/Pairwise-274x300.png)](https://issart.com/blog/wp-content/uploads/2018/12/Pairwise.png)

As you can see, instead of 240 tests we ended up with just 25. Empty cells within array can be filled out with any valid values for particular parameters, e.g. B16-B25 can contain “individual”, “company”, “partner” or any their combination. It won’t decrease or increase the bug detection rate and coverage.

**Step #4
We are already good to start writing test cases. Any row in the table above (except, obviously, the first one) should be processed as a set of variable+value combinations to make a single test.

**Additional capabilities**
We rarely have to test the whole application from scratch, and an orthogonal array lets us pick up a set of tests selectively. Imagine that “partner” has just been added to the system under test and we need to check its interaction with all possible values for other parameters. Within highlighted area, every partner + location, partner + payment method, and partner + browser combination is tested at least once:

[![](https://issart.com/blog/wp-content/uploads/2018/12/new-275x300.png)](https://issart.com/blog/wp-content/uploads/2018/12/new.png)

Now consider a situation, when we need to run a regression testing cycle, because, for example, Chrome browser has got an update:

[![](https://issart.com/blog/wp-content/uploads/2018/12/prioritizing-275x300.png)](https://issart.com/blog/wp-content/uploads/2018/12/prioritizing.png)

Picking up highlighted tests lets us, once again, check the interaction between a new Chrome version and every value of the other parameters at least once. 

However, testers who decided to apply pairwise testing to their SUT should notice that this technique may not choose frequently used or high risky combinations over rare or less risky ones. If there’re such combinations, we strongly recommend to create extra tests in addition to the ones that were generated by pairwise testing.

### 
**Conclusion**

Pairwise testing is a powerful yet easy-to-use test design technique that helps testers greatly reduce the number of tests while maintaining a reasonable coverage and issue detection rate. For those who want to dig deeper into the topic there are plenty of researches regarding minor differences between pairwise testing, allpairs algorithm, orthogonal array testing strategy, their different implementations and optimal usage. Pairwise testing might lack a rigorous scientific evidence of its efficiency, but it has a significant prevalence and acceptance within the testers’ community for one simple reason – it actually works. 