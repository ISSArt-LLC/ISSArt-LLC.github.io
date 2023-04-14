---
id: 3342
title: 'Classification of image style using deep learning with Python'
date: '2019-06-17T13:12:45+08:00'
author: 'Anna Sheptalina'
layout: post
image: /static/img/2019/05/art-big-data-blur-373543.jpg
categories:
    - 'Machine Learning'
tags:
    - 'deep learning'
    - 'machine learning'
    - 'neural network'
    - python
    - tensorflow
---

In this article, I want to talk about the use of convolutional neural networks for the classification of images by style.

The goal of our project is to build software to identify whether an image is in the “BMW style”. In other words, we are faced with the task of classifying images. It is important to note here that images could be of any content, with and without cars. So, the main interest here is not to identify a car object, or identify a BMW car, rather identify a BMW look and feel – colors, composition and so on. But we can't select these attributes of style manually. To solve this problem, it was proposed to use a neural network, in which such complex features will be found automatically in the learning process.

##### Neural Networks

Neural networks are an area of machine learning, based on attempts to reproduce the human nervous system. The idea of neural networks is to create a network by combining artificial neurons that will be able to make complex decisions. The model of an artificial neuron is inspired by the biological neuron, which is the main computing unit of the brain. 

Well, we want to train a network so that it can classify the style of an image. But what does it mean “to train a neural network”? In this case, supervised learning was used – it means that in the process of network training, we have a training dataset – a set of images for which it is known whether they are in“BMW style“ or not, and the network should detect the relationship between some features of the image and the class to which it belongs.

##### Tools

To solve this problem **Python** and some python libraries were used:

**NumPy** (an open source package for scientific computing with Python), that allows performing advanced mathematical and statistical functions,

**OpenCV** to work with images,

**TensorFlow** (an open source machine learning library) to work with neural networks

##### Work done

The project objective is to build a neural network algorithm that can identify the look and feel of the “BMW style”. The style can be identified by the creative team in the company so only certain people can identify this theme as a BMW theme.

First of all, we need to learn dataset that was provided by the customer. It consisted of 1000 BMW images and 1000 non-BMW images. BMW images are photos from previous BMW campaigns (with and without cars), and non-BMW images are different images (with and without cars as well), that was defined by the creative team as “non-BMW style” images.

The main idea is that the car object might distract the neural network from its main object since most of the campaign images of BMW contain a car. 

So as far as the main interest is not the car rather the background, we need to do some image preprocessing:

- detect cars on the image, [Darknet YOLOv3](https://pjreddie.com/darknet/yolo/) algorithm was used for this
- remove the rectangle bounding machine/machines – replace it with a fully transparent color
- cut a random rectangle if a car is not found in the image. It is necessary so that the network doesn't train to recognize only the images with cars as the “BMW style” since there are a lot of cars in the “BMW-style” images and few cars in the “non-BMW style” images in our dataset. The distribution of the positions and sizes of cars in the images with cars was studied for this.

[![](https://issart.com/blog/wp-content/uploads/2019/05/bmw_removed-276x300.jpg)](https://issart.com/blog/wp-content/uploads/2019/05/bmw_removed.jpg) [![](https://issart.com/blog/wp-content/uploads/2019/05/sea_removed-276x300.jpg)](https://issart.com/blog/wp-content/uploads/2019/05/sea_removed.jpg)

Well, now the dataset is ready for further work. But 2000 images are not enough for the network training and we need to augment data – increase the amount of the images by rotating, scaling, horizontally flipping, filtering (changing brightness, contrast, colors of images). We can use the [imgaug](https://github.com/aleju/imgaug) library for this. 10 new images were created from each input image with small transformations that were listed above.

[![](https://issart.com/blog/wp-content/uploads/2019/05/bmw_aug-300x300.jpg)](https://issart.com/blog/wp-content/uploads/2019/05/bmw_aug.jpg)

After doing data augmentation we finally can start to build and train our neural network.

For the classification problem, a neural network with ResNet deep learning architecture was implemented. ResNet is the Winner of ILSVRC 2015 in image classification, detection, and localization, as well as Winner of MS COCO 2015 detection, and segmentation. It enables to have a deeper network. 

Deep learning is generally used to describe particularly complex networks with many more layers than normal. The advantage of these added layers is that the networks are able to develop much greater levels of abstraction, which is necessary for certain complex tasks.

See the following paper for more background: [Deep Residual Learning for Image Recognition](https://arxiv.org/pdf/1512.03385.pdf) by Kaiming He, Xiangyu Zhang, Shaoqing Ren, and Jian Sun, Dec 2015.

After training, it is necessary to evaluate how well the neural network copes with the task. To do this, you can calculate the accuracy – the percentage of images for which the neural network made the right decision. The accuracy value for our classificator is 95% on the test data. In the future, with the appearance of new data (new BMW advertising campaigns, for example), it will also be possible to train a model on these images and improve neural network accuracy.