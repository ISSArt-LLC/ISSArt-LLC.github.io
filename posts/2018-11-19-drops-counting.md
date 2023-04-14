---
id: 3066
title: 'Drops Counting'
date: '2018-11-19T18:36:25+08:00'
author: 'Anton Dityativ'
layout: post
image: /static/img/2018/11/clean-drop-of-water-liquid-40784.jpg
categories:
    - 'Computer Vision'
    - 'Machine Learning'
---

Greetings, dear readers! In this article, I'm going to share how I counted drops. Yes, you read that right. DROPS 

It all began when our team started studying machine learning, or to be more precise, we studied Python and OpenCV. During the practice task, I had a chance to implement the algorithm that would count the falling drops in the given video or in real time. And now I'll tell you how it all went.

Here it goes! First of all, to count the drops, you need to have them coming from somewhere. For this, our team consisting of the customer care manager and architect provided me with videos I could start working with.

At the next step, it was necessary to think over the means by which it would be possible to implement the necessary algorithm for us. There wasn't much choice and it fell on OpenCV, namely, the section [Video Analysis](https://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_video/py_table_of_contents_video/py_table_of_contents_video.html#py-table-of-content-video), subsection [Optical Flow.](https://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_video/py_lucas_kanade/py_lucas_kanade.html#lucas-kanade)

To implement the drops counting algorithm I used Dense Optical Flow, found the shift between the previous and next shots and… that's it. What to do with this offset, how to process it was not quite clear. 

Actually, to catch a moving object in the video, you have to leave this single object on all the shots, that is, you need to remove the background, foreign objects, etc. Dense Optical Flow did all that perfectly well, but I could not decide what to do with the final result. But you can never be satisfied with what has already been achieved, especially when your achievement doesn't solve anything.

Excellent. Let's work on. Recalling that during our machine learning classes we did a lot of image processing, I decided to start working on images specifically. You all know very well that a video is a number of shots, which are images themselves. Then we go to the section [Image Processing in OpenCV](https://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_imgproc/py_table_of_contents_imgproc/py_table_of_contents_imgproc.html#) and start processing our personnel.

We can read 

```
cap = cv.VideoCapture("videoFiles/drop8.mov")
```

or we can use the camera of our device 

```
cap = cv.VideoCapture(0)
```

.

Then, I take the first shot and convert it to grayscale. Next, I run through all the shots of the video while it plays and every next shot converts to grayscale:

```
cap = cv.VideoCapture("videoFiles/drop8.mov")
ret, frame1 = cap.read()
gray1 = cv.cvtColor(frame1, cv.COLOR_BGR2GRAY)
tmp_count = 0
prev_has_col = False
  while cap.isOpened:
    gray2 = gray1
    ret, frame2 = cap.read()
&nbsp; &nbsp;   if ret:
 &nbsp; &nbsp;    gray1 = cv.cvtColor(frame2, cv.COLOR_BGR2GRAY)
```

[![](https://issart.com/blog/wp-content/uploads/2018/11/image.png)](https://issart.com/blog/wp-content/uploads/2018/11/image.png)

You can then find the difference between the two shots and start processing the image obtained:

```
difImage = cv.absdiff(gray1, gray2)
```

[![](https://issart.com/blog/wp-content/uploads/2018/11/dif.png)](https://issart.com/blog/wp-content/uploads/2018/11/dif.png)

I applied the median blur to the difference between shots to cut off the background. That is to say, to single out a moving object among others:

```
difImage = cv.absdiff(gray1, gray2)
blur = cv.medianBlur(difImage, 15)
```

[![](https://issart.com/blog/wp-content/uploads/2018/11/blur.png)](https://issart.com/blog/wp-content/uploads/2018/11/blur.png)

Further, for the obtained and processed difference, I can find a "column" (stretched drop) and every time I find a "column", I increase the counter by one:

```
d = blur.sum(axis=0)
has_col = np.max(d) > np.median(d) + 1000
if has_col & ~prev_has_col:
  tmp_cout += 1
prev_has_col = has_col
```

To demonstrate that the drop has been actually detected and counted, I have added contours around the drop and the counter of the drops:

```
blur_contours = cv.blur(difImage, (31, 31))
res, treshold = cv.threshold(blur_contours, 10, 255, cv.THRESH_BINARY)
_, cnts, _ = cv.findContours(treshold.copy(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
frame = searchForMovement(cnts, frame2, 100)
cv.putText(frame, str(tmp_count), (50, frame_height - 50), cv.FONT_HERSHEY_COMPLEX, 1.8, (0, 0, 255))
```

[![](https://issart.com/blog/wp-content/uploads/2018/11/7.png)](https://issart.com/blog/wp-content/uploads/2018/11/7.png)

The final result can be viewed in the video below:

[![](https://issart.com/blog/wp-content/uploads/2018/11/ezgif.com-video-to-gif.gif)](https://issart.com/blog/wp-content/uploads/2018/11/ezgif.com-video-to-gif.gif)

At the moment, the algorithm works with conditions close to ideal. Further on, the background should be more or less homogeneous, the source of the drops and the camera should be static. In the future, the algorithm will be improved and can be applied in various household and industrial environments. Also, I plan to develop a simple mobile application using this algorithm, which you can learn about in the following article.

***Thank you for your attention!***