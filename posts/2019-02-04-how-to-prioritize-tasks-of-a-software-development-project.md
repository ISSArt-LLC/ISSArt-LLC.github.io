---
id: 3167
title: 'How to prioritize tasks of a software development project?'
date: '2019-02-04T16:26:40+08:00'
author: 'Maxim Drozdov'
layout: post
image: /static/img/2018/12/Main-image-prioritization-of-tasks-1.png
categories:
    - General
    - 'Project Management'
tags:
    - autotest
    - backlog
    - priority
    - product
    - 'product owner'
    - 'project management'
    - 'tasks lists'
---

Your software project has limited resources, so only prioritized tasks should remain in the project scope. If you are a customer, a product owner or a team member, you need to maximize the value to be delivered by the team. The clue for the maximum added value with minimal applied effort is prioritization of tasks. It is crucial, but it can be a challenge to prioritize several dozens of items efficiently.

## 1. How efficient is your current product delivery to customers?

Here are the questions to understand, how a good prioritization can help your project.

1. On the one hand, how much money, time and effort do your team spend on the project activities?
2. On the other hand, how big is the share of really important and valuable changes in your recent deliverables?
3. Is the result worth the expenses?

Prioritization allows the right things to happen instead of less useful ones. It is apparently thanks to natural inequality of things, which is illustrated by Pareto principle, 1% rule, diminishing returns, long-tailed distribution, etc.

The most effective companies build their success on prioritization.

[![Steve Jobs citation: People think focus means saying yes to the thing you've got to focus on. But that's not what it means at all. It means saying no to the hundred other good ideas that there are. You have to pick carefully](https://issart.com/blog/wp-content/uploads/2018/12/Steve-Jobs-focus-saying-no.jpg)](https://issart.com/blog/wp-content/uploads/2018/12/Steve-Jobs-focus-saying-no.jpg)

**How to understand what things are more important?** How to **say no** to less important things?
In this article we have collected several practical examples, some of them have helped us prioritize tasks on real [ISS Art projects](https://issart.com/portfolio/).

## 2. A logical approach to tasks prioritization

The advice of this article is applicable to **any type of processable tasks**, whose objects may be

- changes, features, user stories;
- use cases, quality attributes;
- test cases, autotests;
- risks, opportunities;
- stakeholders, customers, users, leads;
- projects, products, initiatives;
- investments;
- etc.

So, you are welcome to replace a ‘task’ with the entity you work with.

Please, follow the logic:

1. The allocation of *limited resources* (work efforts, time, money, raw materials etc.) needs **prioritization** of the tasks on the list.
2. The prioritization is the result of the **comparison** of them against each other.
3. The comparison needs a **measurable criterion** to sort the items on the list.
4. The definition of the criterion depends on your current **project goals**.

This simple logic leads us to the steps below.

### How to approach tasks priorities efficiently?

The approach to the prioritization includes the following steps:

1. set **goals**;
2. determine a **criterion**;
3. estimate the criterion **value** for the tasks:
4. sort the **list** based on the criterion value.

<div class="wp-caption aligncenter" id="attachment_3195" style="width: 1210px">[![Sequence of steps showing how to get tasks prioritized well.](https://issart.com/blog/wp-content/uploads/2018/12/Priorities.svg_-1.png "Sequence of steps to get tasks prioritized well: Goal -> Criterion -> Value -> List.")](https://issart.com/blog/wp-content/uploads/2018/12/Priorities.svg_-1.png)Simple steps, describing how to prioritize tasks

</div>#### A. [![Target as a symbol of the projects goal.](https://issart.com/blog/wp-content/uploads/2018/12/Goal.svg_-150x150.png)](https://issart.com/blog/wp-content/uploads/2018/12/Goal.svg_.png) Goals

It is assumed, that your project has goals, that are S.M.A.R.T. enough :). Setting goals is a general topic, and we have to leave it out of this article. But the goals are crucial, they define all the priorities. So, make sure you have set the goals.

#### B. [![Scale as a symbol of the prioritization criterion](https://issart.com/blog/wp-content/uploads/2018/12/Scale.svg_-300x278.png)](https://issart.com/blog/wp-content/uploads/2018/12/Scale.svg_.png) Criterion

The criterion should measure the contribution of the item to the goals. It is a core metric for the whole approach.

To make up the criterion, you need to follow the steps:

1. Find **factors**, that influence the goal, for example, stakeholders, market, corporate goals, risk level, opportunities, efforts/budget estimation etc. The factors can be either positive or negative in terms of their contribution to the goal.
2. Set up a **scale** for each factor. The scale can be discrete or continuous. For example, estimated time in hours, stakeholders value in scale 1, 2, 3, 4, 5 from the minimum to the maximum importance etc.
3. Create a **formula** for the criterion value using the factors. The criterion should be a function of factors. You can simply use the multiplication of positive factors divided by the multiplication of negative factors. Or you can use more complex functional dependencies if you know the mathematical properties of the factors you’ve chosen.

So, we can represent the diagram above with the details for the criterion development.

<div class="wp-caption aligncenter" id="attachment_3196" style="width: 1210px">[![Detalization of the criterion development: factors -> scale -> formula](https://issart.com/blog/wp-content/uploads/2018/12/Priorities_Criterion-explained.svg_-1.png "Detalization of the criterion development: factors -> scale -> formula")](https://issart.com/blog/wp-content/uploads/2018/12/Priorities_Criterion-explained.svg_-1.png)Steps to develop the criterion

</div>If you are working on the backlog prioritization, the following questions will help you to find a suitable criterion:

- What functionality is critical for end-users and the customer?
- What risks are most critical? (risk exposure = probability \* loss)
- What constraints are present? (time, scope, quality, budget, agility etc. See Wiegers, 2013 Chapter 16, Section “Prioritization based on value, cost, and risk”)
- What are the dependencies between tasks?
- What are the dependencies between the nonfunctional requirements? (Brosseau, 2010)

You can find several examples of criteria and their factors in section 3 below.

#### C. [![A ruler as a symbol of value measurement. Take a measure to estimate the value of a task.](https://issart.com/blog/wp-content/uploads/2018/12/Ruler.svg_-150x150.png)](https://issart.com/blog/wp-content/uploads/2018/12/Ruler.svg_.png) Task value

The criterion should be estimated for the whole list of tasks. To get a more objective evaluation, you can ask several people to make the estimations and get the average values then.

If you use an issue tracking system like Jira or Redmine, you can set the business value field to store the value.

#### D. [![A List of tasks](https://issart.com/blog/wp-content/uploads/2018/12/List.svg_-300x279.png)](https://issart.com/blog/wp-content/uploads/2018/12/List.svg_.png) List

As every task has its own criterion value, you can then sort them by it. You get the most important tasks at the top.

Assess the order that you get. If you are sure that some tasks are located too high or too low on the list, return to the previous step and try redefining the criterion. There are the following possible outcomes:

1. the criterion definition should be improved;
2. the value of tasks was underestimated or overestimated, and they should be estimated more objectively.

## 3. Examples of criteria and factors [![Scale as a symbol of the prioritization criterion](https://issart.com/blog/wp-content/uploads/2018/12/Scale.svg_-300x278.png)](https://issart.com/blog/wp-content/uploads/2018/12/Scale.svg_.png)

### 3.1 Prioritize tasks in the backlog

The following example is fictional, but it helps to understand the logic better.
Let’s imagine you are working as a product owner of a travel order processing system. The backlog contains a number of features.

Please see the features in the spreadsheet below.
<iframe height="300" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSW6cdSTbzuqoKneVBMXlo0qWQivQr9ESnPgkMqyKZN5h70BNnW25yIlxtTVC9Jqz_xaj14UW4ygRyK/pubhtml?gid=0&single=true&widget=true&headers=false" width="400"><span class="mce_SELRES_start" data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;">﻿</span><span class="mce_SELRES_start" data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;">﻿</span><span class="mce_SELRES_start" data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;">﻿</span></iframe>

Please wait for a moment and answer the question: how would you prioritize these features right now? You can compare your first prioritization with the following one.

As the product owner, you are trying to determine the importance of each feature and sort the list efficiently. Let’s follow the steps from A to D described above.

1. [![Target as a symbol of the projects goal.](https://issart.com/blog/wp-content/uploads/2018/12/Goal.svg_-150x150.png)](https://issart.com/blog/wp-content/uploads/2018/12/Goal.svg_.png) You recall the business goal: to make the income of $X a year, delivering a comfortable travel order processing system.
2. [![Scale as a symbol of the prioritization criterion](https://issart.com/blog/wp-content/uploads/2018/12/Scale.svg_-300x278.png)](https://issart.com/blog/wp-content/uploads/2018/12/Scale.svg_.png) You find the following measurable factors, that can represent the importance of the tasks in order to achieve the goal (you will use your own factors on your real project): 
    1. *The loss of the income* due to the exclusion of the feature. Let’s imagine you have delivered the full scope (all the features), except for the given feature. What will you lose in terms of the income? As it is hard to be measured in physical units, you can use a scale of integer numbers from 1 to 10.
    2. *The probability of the loss.* Not every user will feel unhappy about the loss. Let’s estimate the probability, that we’ll lose part of the income in the case of a dissatisfied user. The scale is just percentage.
    3. *The importance.* You can derive a fruitful index based on the two previous ones. If you multiply the loss by the probability, you will get the mathematical expectation of the loss, that is more accurate than just the loss factor.
    4. *The number of interested users.* Let’s imagine, you know or can estimate the number of potential users, who expect to get a feature. It is a positive factor. The more people use the product, the bigger income you get.
    5. *The effort of development.* Your development team can estimate the development of each feature in working hours. Influence of this factor is negative: the stronger it is, the longer you need to achieve the goal.Having this set of factors, you can summarize their influence on the achievement of the goal. One of the simplest ways is to multiply the positive factors by each other and divide them by negative factors, so you get the formula:
        [![Formula of the tasks priority. The formula uses the factors of the importance.](https://issart.com/blog/wp-content/uploads/2018/12/3.1-backlog-tasks-priority.png)](https://issart.com/blog/wp-content/uploads/2018/12/3.1-backlog-tasks-priority.png)
3. [![A ruler as a symbol of value measurement. Take a measure to estimate the value of a task.](https://issart.com/blog/wp-content/uploads/2018/12/Ruler.svg_-150x150.png)](https://issart.com/blog/wp-content/uploads/2018/12/Ruler.svg_.png) You can estimate the factors of each feature and get the criterion value for each feature.
4. [![A List of tasks](https://issart.com/blog/wp-content/uploads/2018/12/List.svg_-300x279.png)](https://issart.com/blog/wp-content/uploads/2018/12/List.svg_.png) You can simply sort the backlog by the criterion value!

Please find the result in the spreadsheet below (or [**by the link**](https://docs.google.com/spreadsheets/d/1beYGEcqTDN72Yo6mcNCWz2qVMpQ3GlNJz0b30Lqxvkk/edit#gid=1791103186)):
<iframe height="450" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSW6cdSTbzuqoKneVBMXlo0qWQivQr9ESnPgkMqyKZN5h70BNnW25yIlxtTVC9Jqz_xaj14UW4ygRyK/pubhtml?gid=1791103186&single=true&widget=true&headers=false" width="600"><span class="mce_SELRES_start" data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;">﻿</span><span class="mce_SELRES_start" data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;">﻿</span><span class="mce_SELRES_start" data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;">﻿</span><span class="mce_SELRES_start" data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;">﻿</span></iframe>

You are welcome to copy the spreadsheet and use it!

### 3.2 Prioritizing test-cases

#### Prioritize the tasks of manual testing

The QA (testers) team run manual tests against a product on a real ISS Art project.

Every release of the product should be tested. However, the product owner usually demands to deliver the new changes in a very short term. The term is so short, that it is literally impossible to run all the test cases. It is a common situation with the limited resources. The core constraint here is time. So we need to test something, that is the most important.

The whole testing plan includes many test cases. Then, those items should be prioritized so that the team will test as many top test cases as possible.

You can see the practical example in the spreadsheet below (or **[by the link](https://docs.google.com/spreadsheets/d/11EpdzJ1Y7mIY5jPYYQTRDf8ZWJMhyzr8hIW8W5ZDxSQ/edit#gid=0)**):

<iframe height="800" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJBSGh3xQdvE2ka32Jl12RXtp1F8Qop3KdrVYjAk9wLMDCdvxvIRw8QRXv2wPF0MlRZw81UVYKdW00/pubhtml?gid=0&single=true&widget=true&headers=false" width="600"><span class="mce_SELRES_start" data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;">﻿</span><span class="mce_SELRES_start" data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;">﻿</span></iframe>

It was decided to use the following factors to approximate the influence on the importance of every test case:

1. *Severity*. It is an approximation of damage, done by a possible bug in a given test case.
2. *Probability of a bug discovery*. It was decided to gather the probability estimation from 4 different QA engineers. The resultant probability is the average of those estimations. The higher the probability, the higher the priority, because we should focus on the most buggy cases first.
3. *Estimation of effort*. Also, it was calculated as the average of estimations given by 4 QA engineers. The more the effort, the lower the priority, because the time is severely limited.

The outcome priority criterion for manual testing is calculated based on the influence of 3 factors above on the priority:

[![Priority_{manual} = \frac{Importance \cdot Number\: of\: users}{Effort}](https://issart.com/blog/wp-content/uploads/2018/12/3.2-priority-for-manual-testing-tasks-1.png)](https://issart.com/blog/wp-content/uploads/2018/12/3.2-priority-for-manual-testing-tasks-1.png)

This allows us to test as many cases as possible in accordance with their priority and not to shift our focus to less important ones.

#### Prioritizing tasks of tests automation

After that, we started to cover the system with the automated UI tests. The goal was to make the testing process quicker. It meant that we needed to automate the test cases, that require too much working time for the manual testing. We realized that we could just use the Effort estimation as a positive (!) factor. The more time we save eliminating manual work, the more efficient the automation test is. So we get a simple priority formula:

[![Priority_{auto}=Severity \cdot Probability \cdot Effort](https://issart.com/blog/wp-content/uploads/2018/12/3.2-priority-for-auto-testing-tasks.png)](https://issart.com/blog/wp-content/uploads/2018/12/3.2-priority-for-auto-testing-tasks.png)

UI autotests priority – the priority for covering of test-cases by UI autotests.

So, **the same factors can be used to calculate different priorities**.

## Conclusion

The suggested approach of the tasks prioritization is based on the project goals, that determine the sorting criterion. You are welcome to be creative in the selection of factors and creating the priority criterion formula.

Let’s prioritize the tasks profitably!

<span>**Feel free to discuss your prioritization cases in the comments!**</span>

## Further reading

- [Pareto principle](https://en.wikipedia.org/wiki/Pareto_principle),
- [1% rule](https://en.wikipedia.org/wiki/1%25_rule_(Internet_culture)),
- [diminishing returns](https://en.wikipedia.org/wiki/Diminishing_returns),
- [long-tailed distribution](https://en.wikipedia.org/wiki/Diminishing_returns)
- [Priority of tasks on Machine Learning](https://www.jeremyjordan.me/ml-projects-guide/#prioritizingprojectsandchoosinggoals)
- Brosseau, Jim. 2010. “Software Quality Attributes: Following All the Steps.” <http://www.clarrus.com/resources/articles/software-quality-attributes>
- Wiegers, Karl and Joy Beatty. 2013. “Software Requirements” (3rd Edition). (Chapter 16)