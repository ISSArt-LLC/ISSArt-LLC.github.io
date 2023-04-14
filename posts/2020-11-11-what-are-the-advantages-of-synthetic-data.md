---
id: 3768
title: 'What are the advantages of synthetic data?'
date: '2020-11-11T16:22:44+08:00'
author: 'Anna Melkova'
layout: post
image: /static/img/2020/11/synthetic-data.jpg
categories:
    - General
    - 'Machine Learning'
---

These days, everyone has heard of artificial intelligence (AI). But not everyone understands what goes into making an AI algorithm work properly. At a high level, AI (also known as machine learning), works by ingesting a large set of data called training data. Then, the AI uses an algorithm to sort through this data and discover trends. This algorithm can be a bit of a black box, and there are many variations of machine learning algorithms. But the important part to remember is that AI "trains" on a dataset. This dataset is called training data. After an AI is fully trained on a dataset, it can be applied to "test" or "application" data. That is where you will typically see AI in action.

Of those three phases (the training data, algorithm, and test data), today we will focus on training data. Specifically, we will discuss how training data is collected today, introduce an alternative called synthetic data, and examine the several advantages of synthetic data.

## Training data vs Synthetic data

Training data is essential for AI because it is where 'the knowledge' comes from. Generally speaking, it is well-accepted in the AI community that a large training set is better than a small training set. Think about it this way: if you give an AI more examples of something, it will get better at recognizing that thing. And so, the general rule of thumb is that as the size of the training set increases, the confidence of the AI algorithm will increase.

AI developers recognize this and strive to gather large training sets. For example, consider autonomous vehicle companies like Tesla, Waymo, and Cruise. These companies employ hundreds of drivers to literally drive around in a car rigged with sensors. Why are they doing this? Well, they are doing this to collect training data. Each car has several LiDAR, radar, infrared, and visible light cameras rigged to the vehicle. That's a lot of data! And it goes to show the importance that these bleeding edge technology companies place on having large datasets to train their AI algorithms.

However, there are some drawbacks to collecting large quantities of real data. The first is that it is time-consuming and expensive. Autonomous vehicle companies valued at billions of dollars may be able to afford it, but that does not mean most companies will be able to. It can be challenging to ingest a high amount of training data. In some cases it can be user-generated, which is okay. But in other cases it can be really hard for a company to get their hands on the raw training data.

Second, even after acquiring raw training data, it can be time-consuming to label. For computer vision applications, the process of labeling training data involves manually dragging boxes around objects of interest. For a dataset with a million images with five objects in each image, that is five million boxes someone has to draw!

Some may say that it is cost-effective to outsource this data labeling. However, this can cause privacy issues. If the dataset contains personally-identifiable information, then it can be a privacy risk to outsource labeling to strangers over the internet. On the flip side, labeling in-house can be expensive since it can distract employees from other roles and responsibilities.

Whenever a company uses human labelers, there is also a risk of mislabels. If the labeler does not correctly label (i.e. annotate) an object correctly, that could negatively affect the machine learning algorithm. Even if a labeler is 99.9% accurate, that's still 1-in-1,000 objects which are mislabeled. In a dataset of millions of objects, this number adds up.

## Synthetic data benefits

Synthetic data addresses many of these concerns. However, first it is good to know what synthetic data is. Synthetic data is generated data which aims to mimic real data. You could call it imitation data if you like, its purpose is the same. Synthetic data can take many forms, whether that is computer vision data (3D graphics), or tabular data (tables of text or numbers). Now let's examine how synthetic data can solve the problems of real data.

The first major problem that synthetic data solves is acquiring large quantities of data. With synthetic data, the training sets are generated. This means there is really no limit (besides the relatively inexpensive computation time) to the size of a synthetic training set. If you want another million training examples, you just generate it! For tabular data, this is super easy. For computer vision data, the rendering time can take longer but is still much faster than manually collecting data.

Synthetic data also solves the problem of labeling: since the ground-truth is already known, the data can be labeled automatically. For computer vision datasets, this is a huge advantage. For example, when generating 3D graphics for synthetic data, all objects in a 3D scene can be automatically labeled with bounding boxes. Moreover, labels in synthetic data are perfectly placed, meaning that companies do not need to be worried about mislabeled datasets.

Finally, synthetic data avoids the major privacy concerns of collecting real data. Since the data is entirely synthetic, it is not likely to be subject to privacy laws such as the European Union's GDPR regulation. This is a major-long term benefit to synthetic data. Companies which invest in synthetic data now will be prepared as new regulations are rolled out worldwide. Nations are increasingly considering the privacy of their citizens, and synthetic data offers a way to prepare for an AI future while still protecting people's privacy.

If you're interested in taking the next step with synthetic data for AI, we recommend checking out the [free Simerse plugin for Unreal Engine](https://www.simerse.com/). There are plenty of tutorials, explanations, and articles on synthetic data, in addition to some really interesting case studies. In conclusion, we hope that this article gave you a little insight into synthetic data. We look forward to seeing the AI applications of the future, hopefully powered by synthetic data!

Thank you for reading!