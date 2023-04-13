---
id: 3906
title: 'Graph Neural Networks and their applications'
date: '2022-07-18T14:58:37+08:00'
author: admin
layout: post
categories:
    - General
    - 'Machine Learning'
    - 'Natural language processing'
tags:
    - ai
    - 'artificial intelligence'
    - 'graph neural networks'
    - 'machine learning'
    - 'neural network'
---

![](/static/img/2022/07/cf4f2e66d16f162ee87d-1024x614.jpg)A Graph Neural Networks (GNN) is a class of artificial neural networks for processing graph data. Here we need to define what a graph is, and a definition is a quite simple – a graph is a set of vertices (nodes) and a set of edges representing the connections between the vertices. There are many data sources which produce data that can be organically presented in a graph form. For example, we can consider social network users as graph vertices where two vertices are connected if corresponding users are friends.

![](/static/img/2022/07/1.png)A graph can be represented by an adjacency matrix. A graph with N nodes will have an adjacency matrix with N x N dimensionality. The contents of this matrix depend on the type of the graph – it can be directed or not, weighted or not. However, in all cases, we have the same idea of keeping numerical descriptions of the relationships between each pair of vertices. Sometimes a graph can also have the additional feature matrix describing the nodes in the graph.

#### **So, why do we need to use GNN?**

The main reason is that we can’t convert a graph to an N-dimensional vector or a sequence of them – that’s why we can’t use more straightforward approaches and neural network architectures to deal with such type of data.

#### **What types of task can GNN perform?**

Let’s give an example of some problems that GNN can solve:

**Node classification**. In node classification, the task is to predict the node type for all the nodes in a graph. This type of problem is usually trained in a semi-supervised way, where only part of the graph is labeled. Typical applications for node classification include citation networks, social network posts and users classification.
**Link prediction**. In link prediction, the task is to understand the relationship between entities in graphs and predict if two entities have a connection in between. For example, a recommender system can be treated as a link prediction problem where the model is given a set of users’ reviews of different products, the task is to predict the users’ preferences and tune the recommender system to push more relevant products according to users’ interest.
**Representation learning**. During the GNN training, most of the architectures involve the outputs that produce node embeddings that contain both structural information from the graph regarding the specific nodes and node feature descriptions. These outputs can be further used as the input for other models or components of the initial model (e.g. be sent to the multilayer perceptron for classification).
**Graph classification**. The task is to determine the type or class of the whole graph into different categories. For example, we can try to classify whether a specific molecule (which structure is represented by the graph) has a useful property in biomedical or chemistry spheres.

#### **What types of GNN exist?**

**Recurrent Graph Neural Network**

Recurrent Graph Neural Network – it’s the first designed GNN architecture introduced in the original GNN paper. Its main idea is connected with iterative update of the node “state” – the computed function value utilizing the information about node neighborhood states.

![](/static/img/2022/07/2.png)An illustration of node state update based on the information in its neighbors. Figure from [“The Graph Neural Network Model”](https://ieeexplore.ieee.org/document/4700287)**Spatial Convolutional Network**

The idea of convolution on a graph is almost similar as in image convolution. In case of working with image, we sum the neighboring pixels around a center pixel, specified by a filter with parameterized size and learnable weight. Spatial Convolutional Network adopts the same idea by aggregating the features of neighboring nodes into the center node.

![](/static/img/2022/07/3.png)Left: Convolution on a regular graph such as an image. Right: Convolution on the arbitrary graph structure. Figure from “[A Comprehensive Survey on Graph Neural Networks](https://arxiv.org/abs/1901.00596)”#### **Real-world applications**

**Recommender systems**

Many companies use graph neural networks to build recommender systems. Typically, graphs are used to model user interaction with products and learn embeddings based on a set of properly selected negative samples. By ranking the results, personalized product offers are selected and shown to specific users in real time. One of the first services with such mechanism was [Uber Eats](https://eng.uber.com/uber-eats-graph-learning/) – [the GraphSage](https://github.com/williamleif/GraphSAGE) neural network selects food and restaurant recommendations.

Although the graphs are relatively small in the case of food recommendations, some companies use neural networks with billions of connections. For example, Alibaba has launched [graph embeddings](https://arxiv.org/abs/1803.02349) and graph neural networks for billions of users and products. The mere creation of such graphs is a nightmare for developers. Thanks to [the Aligraph](https://arxiv.org/abs/1902.08730) pipeline, you can build a graph with 400 million nodes in just five minutes. Aligraph supports efficient, distributed graph storage, optimized fetch operators, and a bunch of native graph neural networks. This pipeline is now used for recommendations and personalized searches across the company’s many products.

**Computer vision**

Objects in the real world are deeply interconnected, so images of these objects can be successfully processed using graph neural networks. For example, you can perceive the content of an image through [scene graphs](https://cs.stanford.edu/~danfei/scene-graph/) – a set of objects in a picture with their relationships. Scene graphs are used to find images, understand and comprehend their content, add subtitles, answer visual questions, and generate images. These graphs can greatly improve the performance of models.

[In one of the works of Facebook](https://arxiv.org/abs/1909.05379) it is described that you can put objects from the popular COCO dataset into the frame, set their positions and sizes, and based on this information a scene graph will be created. With its help, the graph neural network determines the embeddings of objects, from which, in turn, the convolutional neural network creates object masks, frames and contours. [End users can simply add new nodes to the graph](https://www.youtube.com/watch?v=V2v0qEPsjr0) (determining the relative position and size of nodes) so that neural networks can generate images with these objects.

**Physics and chemistry**

Representing the interactions between particles or molecules in the form of graphs and predicting the properties of new materials and substances using graph neural networks allows solving various natural science problems. For example, as part of the [Open Catalyst](https://opencatalystproject.org/) project, Facebook and CMU are looking for new ways to store renewable energy from the sun and wind. One possible solution is to convert this energy through chemical reactions into other fuels, such as hydrogen. But for this, it is necessary to create new catalysts for high-intensity chemical reactions, and the methods known today like [DFT](https://en.wikipedia.org/wiki/Density_functional_theory) are very expensive. The authors of the project [posted](https://github.com/Open-Catalyst-Project/ocp) the largest selection of catalysts and base layers for graph neural networks. The developers hope to find new low-cost molecular simulations that will complement the current expensive simulations that run in days with efficient energy and intermolecular force estimates that are computed in milliseconds.

[Researchers at DeepMind](https://sites.google.com/view/learning-to-simulate/home#h.p_hjnaJ6k8y0wo) have also used graph neural networks to emulate the dynamics of complex particle systems such as water and sand. By predicting at each step the relative motion of each particle, one can plausibly recreate the dynamics of the entire system and learn more about the laws that govern this motion. For example, this is how they try to solve the most interesting of the unsolved problems in the theory of solids – [the transition to a glassy state](https://deepmind.com/blog/article/Towards-understanding-glasses-with-graph-neural-networks). Graph neural networks not only allow you to emulate the dynamics during the transition, but also help you better understand how particles affect each other depending on time and distance.

**Drug development**

Pharmaceutical companies are actively looking for new ways to develop drugs, competing fiercely with each other and spending billions of dollars on research. In biology, you can use graphs to represent interactions at different levels. For example, at the molecular level, bonds between nodes would represent interatomic forces in a molecule, or interactions between amino acid bases in a protein. On a larger scale, graphs can represent interactions between proteins and RNA or metabolic products. Depending on the level of abstraction, graphs can be used for target identification, molecular property prediction, high-throughput screening, drug design, protein engineering, and drug repurposing.

Perhaps the most promising result of the use of graph neural networks in this area was the work of researchers from MIT, published in Cell in 2020. They applied a deep learning model called [Chemprop](https://github.com/chemprop/chemprop) , which predicted the antibiotic properties of the molecules: inhibition of E. coli reproduction. After training on just 2,500 molecules from a FDA-approved library, Chemprop was applied to a larger dataset, including a Drug Repurposing Hub containing the [Halicin](https://en.wikipedia.org/wiki/Halicin) molecule. It is noteworthy that until now, Halicin has only been studied in relation to the treatment of diabetes, because its structure is very different from known antibiotics. But clinical experiments in vitro and in vivo have shown that Halicin is a broad spectrum antibiotic. Extensive comparison with strong neural network models highlighted the importance of Halicin’s properties discovered using graph neural networks. In addition to the practical role of this work, the Chemprop architecture is also interesting for others: unlike many graph neural networks, it contains 5 layers and 1600 hidden dimensions, which is much more than the typical parameters of graph neural networks for such tasks. It can be just one of the few AI discoveries in the future new medicine.