---
id: 3882
title: 'How much is RMSE? Technical and business metrics - exchange rate.'
date: '2022-03-18T11:58:26+08:00'
author: 'Alexandr Kalinin'
layout: post
categories:
    - General
    - 'Machine Learning'
---

<figure class="wp-block-embed-youtube wp-block-embed is-type-video is-provider-youtube wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper"><iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" frameborder="0" height="339" src="https://www.youtube.com/embed/w5x0jxrDsHc?feature=oembed" title="How much is RMSE? Technical and business metrics - exchange rate (ENG Subs)" width="602"></iframe></div>It is not a secret that people who work in the sphere of [Machine Learning](https://issart.com/services/machine-learning/) sooner or later start to see themselves as a kind of carriers of sacred knowledge. They know what back propagation, cross-entropy, tensors are and how you can transform them.

It goes without saying that staying in this kind of ML bubble affects the perception. The developers start to think that everybody knows about technical specifications of this work, as they do. But it is far from being the truth. In the Machine Learning sphere there are two main parties: engineers and customers. In this article we offer you to see the process of [ML development](https://issart.com/services/machine-learning/) from the point of view of the customer.

Imagine the usual project in which we have two people interacting:

1. Andrew – a CEO of a startup for renting scooters. Rather strict and pragmatic person. His aim is to optimize the business process – improve the prediction of the number of scooters placed for specific points;
2. Michael – a ML engineer, the carrier of those sacred, magic knowledge, who knows everything about the sphere. He needs only some data and the job will be done soon.

During the working process the ML engineer trained a lot of models and did all the necessary experiments. And here comes the day of the meeting where the developer has to show how far he\\she has already got in the process because according to these results the decision will be made whether to continue the financing or not.

At the meeting the customer asks: 'What are the results?'. The ML engineer is very optimistic because the project goes really well. Michael says that in the result of running the models the root–mean square error (RMSE) is only 3.14 (that is actually a quite good result). The problem is that Andrew doesn't understand what RSME is, but he understands that it is a very important rate that influences the success of the project. Despite Michael explaining and showing formulas, Andrew sees everything in blur.

Here comes the competition where nobody can win because it could be the customer who would get tired of trying to understand the engineer or engineer would get tired of trying to explain the ideas of actions.

In this case the problem is that the ML engineer took a technical metric for the rate of success that is not valid for making business decisions. Why? Because business doesn't understand it. The developer and the customer live in different worlds. The first one needs to solve some technical tasks and the second one needs to make a decision whether to start the business according to the rates they have.

Where is the way out of this situation? The best decision is business metrics. Business understands it because it is articulated in the language of the customer, the language of money. Business metrics can show the customer how well the model can work in the real world.

What should be done to go this way? You can start with use cases: usually ML engineers don't pay attention to them. They think that their job is to train models, calculate gradients and run tensors. But they do it for some goals, to ease some pain in a specific business process.

If we see our case with scooters, what can be these use cases? We can give such examples:

1. I am a student. My lessons finish at 4.30. What are my chances to take scooter at this time?
2. I am an administrator of a business center. How many scooters do I need to have 20% of the staff to go home by scooters?
3. I am a driver. I work for Andrew (from our story). What are my chances to overwork when I need to move scooters from one place to another?

When we have all use cases we need to understand in what business processes this ML model will be used, their contexts and goals for optimization. For example:

1. Logistics;
2. Increasing customer loyalty;
3. Decreasing operational expenses;
4. ETC.

Understanding the business environment and the issue our model resolves, helps us to come closer to our goal – the conversion of technical metrics into business metrics. Profit Curve can help us with that.

Profit Curve is the graph of the function that shows an 'exchange rate' between technical metrics expressed by abstract numbers and financial equivalent. To get this number we need to answer one question – 'What is the price of a mistake?'. If RSME predicts that the average mistake is 3.14 what consequences should the business expect? To answer these questions the ML engineer and the customer should work together.

Let's see how it works in our example with scooters. To predict the number of scooters we need to deliver to the point (this is a regressive task) we take RSME that is 3.14 which means the inaccuracy of 3-4 scooters. The renting cost is 150 rubles/hour, we have 10 points around the city. To count we need the following formula – 3 (RMSE)\*150 (hourly price)\*10 (number of points in the city). Therefore, if the technical metric of RMSE is 3.14 for one point we lose about 450 rubles and for 10 points – 4500 rubles. That is how we convert technical mistake into real risk for business, actually potential loss. Due to this fact we can build a Profit Curve that shows the number of technical metric growth needed to improve financial rates.

Profit Curve can be built:

1. Empirically (experiments, A/B testing). Startup launches and ML model is tested according to newly collected data. We can see how improvement of technical metrics affects financial rates.
2. Logarithm is a convenient approximation of growth dynamics and resources needed. Let's say to improve RMSE from 10 to 8 we need one month, but to improve results for two more points (from 8 to 6) we need a half of the year.
3. [Machine learning.](https://issart.com/services/machine-learning/) Having results of monitoring we can 'teach' the function to convert technical metrics into business ones.

It is important to remember that you shouldn't consider the Profit Curve as a tool for predictions and assumptions. This tool is for communication, finding common ground in the process of interaction between developer and business owner.

Due to this tool we can show that we earn money, so we articulate our usefulness.

To sum up:

1. Customer doesn't understand technical metrics. 95% of these people don't have any knowledge of ML;
2. Technical metrics are a bad tool to make business decisions;
3. To make business decisions we need to convert technical metrics into business ones;
4. Profit Curve is a good tool for conversion;
5. Profit Curve is a tool for communication rather than for predictions.

P.S. Try to be more empathic communicating with customers. This skill makes it easier to work on the project.

More info about Profit Curve and other management-gadgets in ML projects yoг can find in the book[ VejKo Crunic “Succeeding with AI”](https://www.manning.com/books/succeeding-with-ai)