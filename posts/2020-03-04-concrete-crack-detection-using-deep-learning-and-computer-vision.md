---
id: 3610
title: 'Concrete crack detection using Deep Learning and Computer Vision'
date: '2020-03-04T13:50:22+08:00'
author: 'Eugenia Soroka'
layout: post
image: /static/img/2020/03/photo-1555952208-02e405109112.jpeg
categories:
    - 'Computer Vision'
    - 'Machine Learning'
tags:
    - 'artificial intelligence'
    - 'computer vision'
    - 'deep learning'
    - keras
    - 'machine learning'
    - NumPy
    - OpenCV
    - tensorflow
---

## Introduction

Cracks on the surface are a major defect in concrete structures. Early crack detection allows preventing possible damage. There are various approaches to solving this problem. It can be manual inspection or automatic detection methods. But nowadays automatic detection methods include not only laser testing and radiographic testing. Progress in neural networks and computer vision allows us to use image processing for concrete surface crack detection. 

In this article, we will share our approach to solving the problem mentioned above.

## Data

We used a data set that consists of 198 high-resolution images in the JPG format and corresponding binary masks to train the neural network. Some images are photos of concrete structures only, other ones have a background and extrinsic objects. 

<div class="wp-caption alignnone" id="attachment_3619" style="width: 612px">[![](https://issart.com/blog/wp-content/uploads/2020/03/img-1024x383.jpg)](https://issart.com/blog/wp-content/uploads/2020/03/img.jpg)Fig. 1 – Source image and its mask

</div>Well, our first task is data preprocessing. At this stage, we need to create a training set for a neural network that consists of small images. 

Firstly, we need to split each image into overlapping tiles 256X256 px. Those images have resolution 11664X8750 px and cracks are so small that after fragmentation we'll get huge imbalanced data set. Each image divided into just about 1600 samples without cracks and 150 with ones.

However, we found an additional challenge. The most part of tiles with cracks has horizontal cracks. But cracks can be rotated at any angle. Therefore, our second step in data preprocessing is data augmentation.

Data augmentation is a technique to artificially create new training data from existing training data. We need to make the following transformations to get a great diversity of input data:

- a vertical and horizontal flip of each image;
- rotate each image at different angles;
- change brightness and contrast settings of each image in different ways;
- apply Gaussian blur.

## Tools

We used Python programming language and the following libraries:

- [NumPy](https://numpy.org/) – an open source package for scientific computing;
- [TensorFlow](https://www.tensorflow.org/) – an open source library for machine learning;
- [Keras](https://keras.io/) – a high-level neural networks API;
- [OpenCV](https://opencv.org/) – an open source computer vision and machine learning software library.

## Model

Crack detection is the semantic segmentation problem. Semantic segmentation refers to the process of linking each pixel in an image to a class label. In this case, we need to find all pixels of cracks on the photo of a concrete structure. 

Therefore, we used the neural network architecture U-net. In the original research, this architecture consists of three sections: the contraction, the bottleneck, and the expansion section. As a result of this, U-net can predict precise segmentation maps by combining the location information and context.

<div class="wp-caption alignnone" id="attachment_3613" style="width: 612px">[![](https://issart.com/blog/wp-content/uploads/2020/03/unet-1024x669.png)](https://issart.com/blog/wp-content/uploads/2020/03/unet.png)Fig. 2 – U-net architecture

</div>The contraction section is made of many contraction blocks. Each block takes an input and applies two 3X3 convolution layers followed by a 2X2 max pooling. The number of kernels or feature maps after each block doubles so that architecture can learn the complex structures effectively. The bottommost layer mediates between the contraction layer and the expansion layer. It uses two 3X3 CNN layers followed by 2X2 up convolution layer.

In our implementation dropout layers were added because they force a neural network to learn more robust features that are useful in conjunction with many different random subsets of the other neurons. The loss function is Binary Crossentropy.

See the following paper for more background: ["U-Net: Convolutional Networks for Biomedical Image Segmentation"](https://arxiv.org/abs/1505.04597) by Olaf Ronneberger, Philipp Fischer and Thomas Brox (May 2015). 

## Results

The metric to evaluate our U-net model is [the Sørensen–Dice coefficient](https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient). After training, the value of this metric is 95% on the train set and 93% on the validation set.

We need to make image scaling before the prediction because U-net is sensitive to image scale. If there were no similar scale images in the training set, the neural network will be wrong in its predictions. 

Therefore, in our implementation, U-net predicts 3 masks of each image: a mask of source image, a mask of 2 times enlarged image and a mask of 2 times reduced image. After that, we need to resize received predictions into source size and compute an average value of each pixel. Target mask of an input image is a binarized average image.

Figures 3-5 show an example of prediction for the input image (fig. 1).

<div class="wp-caption alignnone" id="attachment_3614" style="width: 612px">[![](https://issart.com/blog/wp-content/uploads/2020/03/probabilities-1024x766.jpg)](https://issart.com/blog/wp-content/uploads/2020/03/probabilities.jpg)Fig. 3 – An average image from 3 predicted masks

</div><div class="wp-caption alignnone" id="attachment_3615" style="width: 612px">[![](https://issart.com/blog/wp-content/uploads/2020/03/predicted-mask-1024x766.jpg)](https://issart.com/blog/wp-content/uploads/2020/03/predicted-mask.jpg)Fig. 4 – A binarized average image

</div><div class="wp-caption alignnone" id="attachment_3616" style="width: 612px">[![](https://issart.com/blog/wp-content/uploads/2020/03/contours-1024x766.jpg)](https://issart.com/blog/wp-content/uploads/2020/03/contours.jpg)Fig. 5 – Contours of the predicted mask

</div>Even though U-net architecture is intended to solve biomedical image segmentation problem, it may be used for other tasks. We got a precise solution to detect cracks on the concrete structures. Moreover, the neural network learned to find small cracks, cracks rotated at different angles and branched cracks. The major issues are recognition of spaces between blocks and its borders as cracks. One way to improve it is to solve it as an instant segmentation problem, i. e. to predict the class labels and find boundaries of the objects. Accordingly, we will know cracks localisation and its type.

Have you used similar technologies in your projects?