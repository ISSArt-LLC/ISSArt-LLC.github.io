---
id: 3889
title: 'Crowdsourcing in machine learning: expectations               and reality'
date: '2022-04-11T14:00:41+08:00'
author: 'Eugenia Soroka'
layout: post
categories:
    - General
    - 'Machine Learning'
tags:
    - 'crack detection'
    - datasets
    - issart
    - 'machine learning'
    - 'solar panels'
---

<figure class="wp-block-embed-youtube wp-block-embed is-type-video is-provider-youtube wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper"><iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" frameborder="0" height="339" src="https://www.youtube.com/embed/fXgG4nZZraI?feature=oembed" title="Crowdsourcing in machine learning: expectations and reality" width="602"></iframe></div>Every person who works in machine learning (ML) sooner or later faces the problem of crowdsourcing. In this article we will try to give answers to the questions: 1) What is in common between crowdsourcing and ML? 2) Is crowdsourcing really necessary?

To make it clear, first of all let’s discuss the terms. Crowdsourcing – a word that is rather widespread among and known to a lot of people that has the meaning of distributing different tasks among a big group of people to collect opinions and solutions for specific problems. It is a great tool for business tasks? but how can we use it in ML?

To answer this question we create an ML-project working process scheme: first, we identify a problem as a task for ML; after that we start to gather the necessary data? then we create and train necessary models; and finally use the result in a software. We will discuss the use of crowdsourcing to work with the data.

Data in ML is a very important thing that always causes some problems. For some specific tasks we already have datasets for training (datasets of faces, datasets of cute kittens and dogs). These tasks are so popular that there is no need to do anything special with this data.

However, quite often there are projects from unexpected fields for which there are no ready-made datasets. Of course, you can find a couple of datasets with limited availability, which partly would be connected with the topic of your project, but they wouldn’t meet the requirements of the tasks. In this case we need to gather the data by, for example, taking it directly from the customer. When we have the data we need to mark it from scratch or to elaborate the dataset we have which is a rather long and difficult process. And here comes crowdsourcing to help us to solve this problem.

There are a lot of platforms and services to solve your tasks by asking people to help you. There you can solve such tasks as gathering statistics and making creative things and 3D models. Here are some examples of such platforms:

1. Yandex. Toloka
2. CrowdSpring
3. Amazon Mechanical Truck
4. Cad Crowd

Some of the platforms have wider range of tasks, other are for more specific tasks. For our project we used Yandex. Toloka. This platform allows us to collect and mark data of different formats:

1. Data for computer vision tasks;
2. Data for word processing tasks;
3. Audiodata;
4. Off-line data.

First of all, let’s discuss the platform from the computer vision point of view. Toloka has a lot of tools to collect data:

1. Object recognition and field highlighting;
2. Image comparison;
3. Image classifications;
4. Video classifications.

Moreover there is an opportunity to work with language:

1. Work with audio (record and transcribe);
2. Work with texts (analyze the pitch, moderate the content).

For example, we can upload comments and ask people to identify positive and negative ones.

Of course, in addition to the examples above Yandex.Toloka gives an ability to solve a big range of tasks:

1. Data enrichment:
    a) questionnaires;
    b) object search by description;
    c) search for information about an object;
    d) search for information on websites.
2. Field tasks:
    a) gathering offline data;
    b) monitoring prices and products;
    c) street objects control.

To do these tasks you can choose the criteria for contractors: gender, age, location, level of education, languages etc.

At first look it seems great, however, there is another side of it. Let’s have a look at the tasks we tried to solve.

First, the task is rather simple and clear – identify defects on solar panels. (pic 1) There are 15 types of defects, for example, cracks, flare, broken items with some collapsing parts etc. From physical point of view panels can have different damages that we classified into 15 types.

![](/static/img/2022/04/pic-1.png)*pic 1*.Our customer provided us a dataset for this task in which some marking had already been done: defects were highlighted red on images. It is important to say that there weren’t coordinates in file, not json with specific figures, but marking on the original image that requires some extra work to do.

The first problem was that shapes were different (pic 2) It could be circle, rectangle, square and the outline could be closed or could be not.

![](/static/img/2022/04/pic-2-1024x347.png)*pic 2*.The second problem was bad highlighting of the defects. One outline could have several defects and they could be really small. (pic 3) For example, one defect is a scratch on solar panel. There could be a lot of scratches in one unit that were not highlighted separately. From human point of view it is ok, but for ML model it is unappropriate.

![](/static/img/2022/04/pic-3-1024x260.png)*pic 3.*The third problem was that part of data was marked automatically. (pic 4) The customer had a software that could find 3 of 15 types of defects on solar panels. Furthermore, all defects were marked by a circle with an open outline. What made it more complex was the fact that there could be text on the images.

![](/static/img/2022/04/pic-4-1024x347.png)*pic 4*.The fourth problem was that marking of some objects was much larger than defects themselves. (pic 5) For example, a small crack was marked by a big oval covering 5 units. If we gave it to the model it would be really difficult to identify a crack in the picture.

![](/static/img/2022/04/pic-5.png)*pic 5.*Also there were some positive moments. A Large percentage of the data set was in quite good condition. However, we couldn’t delete a big number of material because we needed every image.

What could be done with low-quality marking? How could we make all circles and ovals into coordinates and markers of types? Firstly, we binarized (pic 6 and 7) images, found outlines on this mask and analyzed the result.

![](/static/img/2022/04/pic-6-1024x313.png)*pic 6.*![](/static/img/2022/04/pic-7-1024x313.png)*pic 7.*When we saw large fields that cross each other we got some problems:

1. Identify rectangle:
    a) mark all outlines – “extra” defects;
    b) combine outlines – large defects.
2. Test on image:
    a) Text recognition;
    b) Compare text and object.

To solve these issues we needed more data. One of the variants was to ask the customer to do extra marking with the tool we could provide with. But we should have needed an extra person to do that and spent working time. This way could be really time-consuming, tiring and expensive. That is why we decided to involve more people.

First, we started to solve the problem with text on images. We used computer vision to recognise the text, but it took a long time. As a result we went to Yandex.Toloka to ask for help.

To give the task we needed: to highlight the existing marking by rectangle classify it according to the text above (pic 8). We gave these images with marking to our contractors and gave them the task to put all circles into rectangles.

![](/static/img/2022/04/pic-8.png)*pic 8.*As a result we supposed to get specific rectangles for specific types with coordinates. It seemed a simple task, but the contractors faced some problems:

1. All objects in spite of the defect type were marked by first class;
2. Images included some objects marked by accident;
3. Drawing tool was used incorrectly.

We decided to put the contractor’s rate higher and to shorten the number of previews. As a result we had better marking by excluding incompetent people.

Results:

1. About 50% of images had satisfying quality of marking;
2. For ~ 5$ we got 150 correctly marked images.

Second task was to make the marking smaller in size. This time we had this requirement: mark defects by rectangle inside the large marking very carefully. We did the following preparation of the data:

1. Selected images with outlines bigger than it is required;
2. Used fragments as input data for Toloka.

Results:

1. The task was much easier;
2. Quality of remarking was about 85%;
3. The price for such task was too high. As a result we had less than 2 images per contractor;
4. Expenses were about 6$ for 160 images.

We understood that we needed to set the price according to the task, especially if the task is simplified. Even if the price is not so high people will do the task eagerly.

Third task was the marking from scratch.

The task – identify defects in images of solar panels, mark and identify one of 15 classes.

Our plan was:

1. To give contractors the ability to mark defects by rectangles of different classes (never do that!);
2. Decompose the task.

In the interface (pic 9) users saw panels, classes and massive instruction containing the description of 15 classes that should be differentiated. We gave them 10 minutes to do the task. As a result we had a lot of negative feedback which said that the instruction was hard to understand and the time was not enough.

![](/static/img/2022/04/pic-9-1024x568.png)*pic 9.*We stopped the task and decided to check the result of the work done. From th epoint of view of detection the result was satisfying – about 50% of defects were marked, however, the quality of defects classification was less than 30%.

Results:

1. The task was too complicated:
    a) a small number of contractors agreed to do the task;
    b) detection quality ~50%, classification – less than 30%;
    c) most of the defects were marked as first class;
    d) contractors complained about lack of time (10 minutes).
2. The interface wasn’t contractor-friendly – a lot of classes, long instruction.

Result: the task was stopped before it was completed. The best solution is to divide the task into two projects:

1. Mark solar panel defects;
2. Classify the marked defects.

Project №1 – Defect detection. Contractors had instructions with examples of defects and were given the task to mark them. So the interface was simplified as we had deleted the line with 15 classes. We gave contractors simple images of solar panels where they needed to mark defects by rectangles.

Result:

1. Quality of result 100%;
2. Price was 20$ for 400 images, but it was a big percent of the dataset.

As project №1 was finished the images were sent to classification.

Project №2 – Classification.

Short description:

1. Contractors were given an instruction where the examples of defect types were given;
2. Task – classify one specific defect.

We need to notice here that manual check of the result is inappropriate as it would take the same time as doing the task.So we needed to automate the process.

As a problem solver we chose dynamic overlapping and results aggregation. Several people were supposed to classify the same defects and the resultx was chosen according to the most popular answer.

However, the task was rather difficult as we had the following result:

1. Classification quality was less than 50%;
2. In some voting classes were different for one defect;
3. 30% of images were used for further work. They were images where the voting match was more than 50%.

Trying to find the reason for our failure we changed options of the task: choosing higher or lower level of contractors, decreasing the number of contractors for overlapping; but the quality of the result was always approximately the same. We also had situations when every of 10 contractors voted for different variants. We should notice that these cases were difficult even for specialists.

Finally we cut off images with absolutely different votes (with difference more than 50%), and also those images which contractors marked as “no defects” or “not a defect”. So we had 30% of the images.

Final results of the tasks:

1. Remarking panels with text. Mark the old marking and make it new and accurate – 50% of images saved;
2. Decreasing the marking – most of it was saved in the dataset;
3. Detection from scratch – great result;
4. Classification from scratch – unsatisfying result.

Conclusion – to classify areas correctly you shouldn’t use crowdsourcing. It is better to use a person from a specific field.

If we talk about multi classification Yandex.Toloka give you an ability to have a turnkey marking (you just choose the task, pay for it and explain what exactly you need). you don’t need to spend time for making interface or instructions. However, this service doesn’t work for our task because it has a limitation of 10 classes maximum.

Solution – decompose the task again. We can analyze defects and have groups of 5 classes for each task. It should make the task easier for contractors and for us. Of course, it costs more, but not so much to reject this variant.

What can be said as a conclusion:

1. Despite contradictory results, our work quality became much higher, defects search became better;
2. Full match of expectations and reality in some parts;
3. Satisfying results in some tasks;
4. Keep it in mind – easier the task, higher the quality of execution of it.

Impression of crowdsourcing:

| **Pros** | **Cons** |
|---|---|
| Increase dataset | Too flexible |
| Increasing marking quality | Low quality |
| Fast | Needs adaptation for difficult tasks |
| Quite cheap | Project optimisation expenses |
| Flexible adjustment |  |

