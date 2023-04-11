---
id: 1905
title: 'Multipartial Upload or How to Bring Amazon S3 and Legacy Code Together'
date: '2016-12-16T20:00:23+08:00'
author: 'Alexander Babilo'
layout: post
image: /static/img/2016/12/amazon_S3-2.jpg
categories:
    - General
tags:
    - 'Amazon S3'
    - 'legacy code'
    - 'multipartial upload'
---

A large part of software development projects today are either being developed for quite a long time, or received as a legacy from another team. Such code has been in most cases written by people no longer working in the team. Another pitfall can be the requirement to create an unchangeable and backward compatible API product. Under such conditions, the team have to provide the product support and even introduce new features. I encountered a similar problem connected with legacy code on one of [ISSArt’s](http://www.issart.com/en/) projects.

## Problem

The task was the following: there is an API for multipartial file upload to a local repository. A similar functionality needs to be realized for [Amazon S3](http://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html). The main requirement is to avoid creating temporary files in the local repository. The very first pitfall appeared to be the limitations of the repository for multipartial upload. Thus, the minimum size of a separate part was to be 5 MB (except for the last part), with that API required that each part should be indexed from number 1 to 10000. That is, the maximum number of parts was to be 10000.

On the other hand, we have the legacy API, which has nearly no limitations. Thus, the parts can be uploaded of any size, in any order. With that the size of the part is optional, that is, it cannot be known in advance. The index of the part was not included, only initial offset was specified in bytes against the entire file. Which means trying to connect these APIs will not be easy. It was decided to create an adapter that will enable us to properly organize requests to S3 based on our API data. Do not forget that we should not create temporary files on the server, but pass the input stream directly as S3 requests.

## Solution

The problem was solved in the following way. When uploading the part, the streaming goes directly as S3. Each part is written to a separate file on S3, and the file offset in bytes is added to the file name. Thus, the problem of the order of parts uploading is solved, because the file list becomes sorted in the correct order. Moreover, since the data are written in ordinary files, and not as multipartial upload part, the 5 MB limitation does not apply there!

The process will continue until the flag commitUpload = true is set. In this case, the process of merging the parts into one complete file begins. Amazon S3 has a remarkable API – [Upload Part (Copy)](http://docs.aws.amazon.com/AmazonS3/latest/API/mpUploadUploadPartCopy.html), which allows you to use an already existing file on S3 as a part. Since the size of the parts is now known, we can be confident of the correctness of file uploading through Amazon S3 API. If the file size is less than 5 MB (the file can’t be used as a part), then the process of recursively merging it to subsequent parts starts. As soon as the file size meets the S3 requirements, the main process of merging the files will continue. On completion of the process MD5 hash of the resulting file will be calculated and will be reconciled with the one delivered by the server.

Thus, with S3 you can successfully upload files up to 5 TB in size, with the size of the part being 500 MB. And all this is done without any loss of backward compatibility, but with performance increase due to the exclusion of local temporary files from the chain. Since all operations of merging the parts are performed directly on S3, performance losses are minimal.

## Bonus

As a bonus, the feature was implemented automatically starting the process of multipartial upload if the file size exceeds 7 MB (a configurable parameter). For this quite a simple FilterOutputStream has been made, which automatically calculates the size and the offset of the stream while recording, and decides to flush the current part and create the next one making it clear to the developer. Since in this case the parts are written strictly sequentially and the size is known in advance, the standard [API Upload Part](http://docs.aws.amazon.com/AmazonS3/latest/API/mpUploadUploadPart.html) is used. And this happens extra quickly!