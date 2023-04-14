---
id: 3375
title: 'HLS testing using JMeter and Locust'
date: '2019-06-03T09:00:11+08:00'
author: 'Maxim Babilo'
layout: post
image: /static/img/2019/05/markus-spiske-666904-unsplash.jpg
categories:
    - QA/Testing
---

HTTP Live Streaming (also known as HLS) is an HTTP-based adaptive bitrate streaming communications protocol implemented by Apple Inc. The conception of the protocol is based on the principle of splitting a single stream into small fragments sequentially downloaded via HTTP. At the beginning of the session, the playlist is downloaded in the M3U format, containing metadata about the existing nested streams. Based on standard HTTP transactions, HTTP Live Streaming can pass through any firewall or proxy server, passing standard HTTP traffic, unlike UDP-based protocols such as RTP. The standard also includes a standard encryption mechanism and secure-key distribution using HTTPS. Let's look at how to test HLS using Apache JMeter and Locust.

[Apache JMeter](https://jmeter.apache.org/) is a free open source cross platform tool for all types of load and functional testing. It supports many protocol types, including a bunch of streaming protocols such as HLS. For our demo we'll use [HLS video stream](http://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov/playlist.m3u8) as an example. There are at least two ways of testing HLS via JMeter:

1. The first way is the easiest one – we can use special [HLS Sampler](https://www.blazemeter.com/blog/the-new-hls-plugin-for-jmeter-the-complete-guide) plugin, that can be downloaded and installed with [plugin manager](https://www.blazemeter.com/blog/how-install-jmeter-plugins-manager?utm_source=blog&utm_medium=BM_blog&utm_campaign=the-new-hls-plugin-for-jmeter-the-complete-guide). In this case, we need to create a script using the following elements:

- Thread Group – defines a set of actions for users in this group, as well as their quantity and use.
- HLS Sampler – the main element of the script, which performs following logic:

It selects media playlist file, according to the selected play options and then retrieves the video stream segments. The plug-in simulates a user who consumes multimedia through HLS and supports various situations: stream type, playback time, network bandwidth and device resolution.

![](https://issart.com/blog/wp-content/uploads/2019/05/word-image.png)

- View Results Tree – the element to view test progress. As a result of the test run we'll see:

![](https://issart.com/blog/wp-content/uploads/2019/05/word-image-1.png)

You can read more about this method in the [complete guide](https://www.blazemeter.com/blog/the-new-hls-plugin-for-jmeter-the-complete-guide), but we are going to use more difficult and interesting approach.

2\. Using HTTP Request samplers in the script. This solution assumes a higher level of working knowledge of Apache JMeter and in order to implement it it's necessary to know the HLS protocol, the logic of client server interaction over this protocol and data processing. Here one may think: why do we need to create our own solution when we can simply use HLS sampler? The reason is that in addition to performance related metrics there are some user experience related metrics that have to be taken into account when conducting load testing of HLS services. These metrics are:

**Buffer fill time** – the time which users should wait before a video starts playing. During this time they get a progress roller and the first few seconds of the video are downloaded. It's an important metric to check as users may not want to wait minutes for the video to start.
**Lag time** – the time a user is waiting for the data to be buffered during the playback. This negatively impacts user experience, so it's necessary to ensure that lag time is acceptable according to SLA.
**Download time** – the time required to download all HLS streams artifacts: playlists and media chunks.
**Play time** – real playback time which includes lags.
**Lag ratio** – equals to lag time divided by the video total duration.The lower lag time ratio is the better.

Also, by this way we'll have more details about testing process.

Now our goal in this case is not only to implement the algorithm for testing HLS, but also to track the metrics which define user experience. This scheme is similar to the previous one: first, we send a request to get the name of the playlist, then, if successful, we send a request to get the list of files contained in this playlist, and after that we send as many requests as there are fragments contained in the playlist. The difference of this scheme from the previous one is that after each request we perform the calculation of UX metrics.

![](https://issart.com/blog/wp-content/uploads/2019/05/word-image-2.png)

More about this approach you can find in [this](https://www.blazemeter.com/blog/monitoring-ux-metrics-in-hls-load-testing-in-jmeter) article. However, we provide following script. In this script we use "[jp@gc – Dummy Sampler](https://jmeter-plugins.org/wiki/DummySampler/)" and "[jp@gc – Page Data Extractor](https://jmeter-plugins.org/wiki/PageDataExtractor/)" to obtain graphs of changes in all UX metrics over time. Also, for both approaches, you should add "Simple Data Writer" to collect statistics and build KPI graphs then. This script (with listeners) can be downloaded [here](https://gitlab.com/mbabilo/hlswithjmeterandlocust/blob/master/HLS.jmx).

[Locust](https://locust.io/) is an easy-to-use, distributed, load testing tool. It is intended to test web or other applications. Behavior of each test user is defined by you and the process is monitored from a web UI in real-time. This will help you identify bottlenecks in your code before letting real users in. However, there is a certain problem related to launch and monitoring Locust scripts, but we'll elaborate it at the end of the article. So, we have a tool that executes scripts written in Python. Let's look at the implementation of HLS testing with tracking user experience metrics and collecting simple KPI (all as in the previous example).

The first thing we need to do is to take a sample of the code from the main page of the official site [https://locust.io](https://locust.io/).

```
from locust import HttpLocust, TaskSet, task
class WebsiteTasks(TaskSet):
    def on_start(self):
        self.client.post("/login", {
            "username": "test_user",
            "password": ""
        })

&amp;nbsp;

    @task
    def index(self):
        self.client.get("/")
      
    @task
    def about(self):
        self.client.get("/about/")

class WebsiteUser(HttpLocust):
    task_set = WebsiteTasks
    min_wait = 5000
    max_wait = 15000
```

What we should understand from this code:

1. common script structure
2. how to use @task
3. how to send a request

So, we will leave the structure unchanged, but for simplicity we will use only 1 @ task which is determined inside TaskSet class. Let's add the first request to our script with headers extracting chunkListName:

```
from locust import HttpLocust, TaskSet
import re


class UserBehavior(TaskSet):
  @task
  def flow(self):
       self.client.headers['Cache-Control'] = "no-cache"
       self.client.headers['Accept'] = "*/*"
       self.client.headers['User-Agent'] = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
       self.client.headers['Connection'] = "keep-alive"
       self.client.headers['Host'] = "184.72.239.149"
       self.client.headers['Pragma'] = "no-cache"
       self.client.headers['Accept-Encoding'] = "gzip, deflate, sdch"
       response = self.client.get("/vod/mp4:BigBuckBunny_115k.mov/playlist.m3u8").text
       chunkListName = re.findall('#EXT-X-STREAM-INF:BANDWIDTH=(.+?),.*RESOLUTION=(.+?)\n(.+?)\.m3u8', response)


class WebsiteUser(HttpLocust):
   task_set = UserBehavior
   min_wait = 5000
   max_wait = 9000
```

We know that the headers will be repeated for all requests, let's simplify our script right away by putting it into a separate file: [customFunctions.py](https://gitlab.com/mbabilo/hlswithjmeterandlocust/blob/master/customFunctions.py):

```
# Default Headers Manager
def default_headers(self):
    self.client.headers['Cache-Control'] = "no-cache"
    self.client.headers['Accept'] = "*/*"
    self.client.headers['User-Agent'] = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
    self.client.headers['Connection'] = "keep-alive"
    self.client.headers['Host'] = host
    self.client.headers['Pragma'] = "no-cache"
    self.client.headers['Accept-Encoding'] = "gzip, deflate, sdch"
```

Now we will create another file for parameterizing our script, we will take all the parameters into it and name it [properties.py](https://gitlab.com/mbabilo/hlswithjmeterandlocust/blob/master/properties.py):

```
path = '/vod/mp4:BigBuckBunny_115k.mov'
playlistName = 'playlist'
bufferSize = 1000
bytesInBuffer = 0
bufferFillTime = 0      #Time for filling buffer with media chunks
totalDT = 0             #Time spent for downloading of media chunks
totalPT = 0             #Time required to play downloaded chunks
totalLT = 0             #Total lag time occured during playback of a media file.
totalPTLT = 0           #Real time, required for the playback, including lags.
lagTimeRatio = 0        #Ratio of the lag time to the total playback time
host = '184.72.239.149'
```

Now we import our modules and see how it simplifies the script:

```
from locust import HttpLocust, TaskSet, task
import re
from properties import *
from customFunctions import default_headers

class UserBehavior(TaskSet):

   @task
   def flow(self):
       # request 1 = Get original playlist
    
       request_name = 'Get original playlist'
       default_headers(self)
       response = self.client.get("/" + path + "/" + playlistName + ".m3u8", name=request_name).text
       chunkListName = re.search(r'#EXT-X-STREAM-INF:BANDWIDTH=(.+?),.*RESOLUTION=(.+?)\n(.+?)\.m3u8', response).group(3)


class WebsiteUser(HttpLocust):
   task_set = UserBehavior
   min_wait = 5000
   max_wait = 9000
```

As you can see, the script has become much simpler and smaller. So when we have the name of the list of chunks, we now should request chunks themselves for downloading. This is implemented in the request 2:

```
if (chunkListName != "null"):
 # request 2 = Chunk list request
 request_name = 'Chunk list request'
 default_headers(self)
 response = self.client.get(path + "/" + chunkListName + ".m3u8", name=request_name).text
 chunkNames = re.findall(r'#EXTINF:.*,\n(.+?)\.ts.*', response)
 extinf = re.findall(r'#EXTINF:(.*),\n', response)
```

This part is executed only under the condition that the list of chunks was found in the response of the first request i.e if (chunkListName != "null"). Now we will add the third request, it will be executed as many times as we receive parts in the request No. 2:

```
while j < i:
 # request 3 download chunk file
 request_name = 'download chunk file'
 default_headers(self)
 response = self.client.get(path + "/" + chunkNames[j] + ".ts", name=request_name).text
```

By putting these parts together we get the following code:

```
from locust import HttpLocust, TaskSet, task
import re
from properties import *
from customFunctions import default_headers


class UserBehavior(TaskSet):

   @task
   def flow(self):
       # request 1 = Get original playlist
       request_name = 'Get original playlist'
       default_headers(self)
       response = self.client.get("/" + path + "/" + playlistName + ".m3u8", name=request_name).text
       chunkListName = re.search(r'#EXT-X-STREAM-INF:BANDWIDTH=(.+?),.*RESOLUTION=(.+?)\n(.+?)\.m3u8', response).group(
           3)

       if (chunkListName != "null"):
           # request 2 = Chunk list request
           request_name = 'Chunk list request'
           default_headers(self)
           response = self.client.get(path + "/" + chunkListName + ".m3u8", name=request_name).text
           chunkNames = re.findall(r'#EXTINF:.*,\n(.+?)\.ts.*', response)
           extinf = re.findall(r'#EXTINF:(.*),\n', response)
           i = (len(chunkNames))
           j = 0

           while j < i:
               # request 3 download chunk file
               request_name = 'download chunk file'
               default_headers(self)
               response = self.client.get(path + "/" + chunkNames[j] + ".ts", name=request_name).text
               j = j + 1


class WebsiteUser(HttpLocust):
   task_set = UserBehavior
   min_wait = 5000
   max_wait = 9000
```

Use the command line to run the script:

`locust --host=http://184.72.239.149 -f /home/mbabilo/Desktop/locustTest/locustfile.py`

Now, open http://localhost:8089/ page in the browser, run the test and make sure that everything works correctly — the number of requests is the same as expected, statistics and graphs are displayed.

Config page:

![](https://issart.com/blog/wp-content/uploads/2019/05/word-image-3.png)

Realtime statistics page:

![](https://issart.com/blog/wp-content/uploads/2019/05/word-image-4.png)

Realtime charts page:

![](https://issart.com/blog/wp-content/uploads/2019/05/word-image-5.png)

As a rule load tests are not launched in the GUI mode of a load testing tool and they are not controlled manually either. This means we need to launch load tests in the console non-GUI mode. Locust has such a mode, and in it (and only in it) you can specify the duration of the test. The problem is that Locust does not have special console keys for obtaining graphs as in the web interface and, if you want to have a possibility to save the intermediate request statistics, you should write it in python. To save the basic statistics, we need to save some parameters: the time to receive a response to a specific request, the response time of this request and the current number of requests per second. Avoid redundant coding and immediately create a function to write results to a file. Add a new function to the [customFunctions.py](https://gitlab.com/mbabilo/hlswithjmeterandlocust/blob/master/customFunctions.py) file:

```
# Writing to file
def write_to_file(file, key, string):
    myfile = open(file, key) # open file
    myfile.write(string) # writting to the file
    myfile.close() # close file
```

And we will also write a function for maintaining the inter-thread counter, it is necessary for future calculations:

```
# Modification of common for all threads variable  
def global_counter(name, value):
    lock = Lock()
    lock.acquire()
    name += value
    lock.release()
    return name
```

At this step we:

1. Include our new custom functions via import:

from customFunctions import default_headers, write_to_file, global_counter

2\. Import from threading for using inter-thread variables:

from threading import Lock, Thread

3\. And one more import here:

import os

it is needed so that the files with statistics can be stored in a separate folder and not in the general pile.

4\. Add the creation/reuse of the directory for future files after import section:

if not os.path.exists('statistics'):

os.makedirs('statistics')

5\. Then we use the write_to_file function to create necessary files, having written in them the headings for the columns:

write_to_file("statistics//RPS.txt", "w+", "timeGetRequest, nowRPS\\n")

write_to_file("statistics//RTD.txt", "w+", "responseTime\\n")

6\. We write down the start time of the test, and declare a global counter for our requests:

startTestTime = time.time()

chunkRPS_gcounter = 0

7\. And, finally, for our key request we will add calculation and an entry in the statistics files:

getStartTime = time.time() – before request

and after:

```
getEndTime = time.time()
                response_time = getEndTime - getStartTime
                timeGetRequest = getEndTime - startTestTime
                chunkRPS_gcounter = global_counter(chunkRPS_gcounter, 1)
                nowRPS = chunkRPS_gcounter / timeGetRequest
                write_to_file("statistics//RPS.txt", "a", "%s, %s \n" % (timeGetRequest, nowRPS)) # open and written text to the end of file
                write_to_file("statistics//RTD.txt", "a", "%.2f\n" % (abs(response_time * 1000))) # open and written text to the end of file
```

8\. Combining these parts, we will get files with statistics of interest in the "statistics" folder.
9\. For visualization in the form of graphs, we use separate simple scripts. So for request per second it will be:

[pyplot_RPS.py](https://gitlab.com/mbabilo/hlswithjmeterandlocust/blob/master/pyplot_RPS.py):

```
from matplotlib import pyplot as plt
from matplotlib import style
import numpy as np
import os

if not os.path.exists('graphs'):
    os.makedirs('graphs')

style.use('ggplot')

x,y = np.loadtxt('statistics//RPS.txt', unpack = True, delimiter = ',', skiprows=1)

plt.figure(figsize=(10,7))
plt.plot(x,y)
plt.title('RPS [download chunk file]')
plt.ylabel('requests per second (n/t)')
plt.xlabel('time (sec)')
plt.savefig('graphs//RPS.png')
```

And a slightly more complicated construction for plotting Response Time Distributions graph, taking into account the dynamic scale for the y axis:

[pyplot_RTD.py](https://gitlab.com/mbabilo/hlswithjmeterandlocust/blob/master/pyplot_RTD.py):

```
from matplotlib import pyplot as plt
from matplotlib import style
import numpy as np
import os

if not os.path.exists('graphs'):
    os.makedirs('graphs')

style.use('ggplot')

t = np.loadtxt('statistics//RTD.txt', unpack = True, delimiter = ',', skiprows=1)

x = []
y = []
counter = 0
minVal = 0
maxVal  = 500
i = 0
step = 500
j = max(t, key = abs) / step + 1


while i < j:
    for line in t:
        if (minVal < line < maxVal):
            counter += 1
          
    i += 1
    y.append(counter)
    counter = 0
    x.append(maxVal)
    minVal += 500
    maxVal += 500


plt.figure(figsize=(j,j/2))      
plt.xticks(x)
plt.bar(x,y, step)
plt.title('Response Time Destribution [download chunk file]')
plt.ylabel('delta N')
plt.xlabel('Response Time')
plt.savefig('graphs//RTD.png', dpi=80)
```

These graphs will be saved as a picture in the "graphs" folder. Great, now we can repeat the launch and acquisition of base graphs and statistics of testing HLS with the help of Locust.

10\. Now let's add UX metrics in our script, just like it was done in the JMeter script, then the [final version of locustfile.py](https://gitlab.com/mbabilo/hlswithjmeterandlocust/blob/master/locustfile.py) will be:

```
from locust import HttpLocust, TaskSet, task
import re
import time
from threading import Lock, Thread
from properties import *
from customFunctions import default_headers, write_to_file, global_counter
import os

if not os.path.exists('statistics'):
    os.makedirs('statistics')

write_to_file("statistics//RPS.txt", "w+", "timeGetRequest, nowRPS\n") 
write_to_file("statistics//RTD.txt", "w+", "responseTime\n")
write_to_file("statistics//UX.txt", "w+", "timeGetRequest, bufferFillTime, totalPT, totalDT, totalLT, bytesInBuffer, mediaPT, mediaDT\n")

  
startTestTime = time.time()
chunkRPS_gcounter = 0


class UserBehavior(TaskSet):
  
    @task
  
    def flow(self):
        global chunkRPS_gcounter

        # request 1 = Get original playlist
      
        getStartTime = time.time()
        request_name = 'Get original playlist'
        default_headers(self)
        response = self.client.get("/" + path + "/" + playlistName + ".m3u8", name = request_name).text
        getEndTime = time.time()
        ### calculate
        bufferFillTime = getEndTime - getStartTime
        totalDT = getEndTime - getStartTime
        totalPT = getEndTime - getStartTime
        mediaPT = 0
        mediaDT = 0
        chunkListName = re.search(r'#EXT-X-STREAM-INF:BANDWIDTH=(.+?),.*RESOLUTION=(.+?)\n(.+?)\.m3u8', response).group(3)
      
      
        if (chunkListName != "null"):
            # request 2 = Chunk list request
         
            request_name = 'Chunk list request'
            default_headers(self)
            response = self.client.get(path + "/" + chunkListName + ".m3u8", name = request_name).text
            chunkNames = re.findall(r'#EXTINF:.*,\n(.+?)\.ts.*', response)
            extinf = re.findall(r'#EXTINF:(.*),\n', response)
            i = (len(chunkNames))
            j=0
            bytesInBuffer=0
            totalLT=0
          

            while j < i:
                # request 3 download chunk file
              
                getStartTime = time.time()
                request_name = 'download chunk file'
                default_headers(self)
                response = self.client.get(path + "/" + chunkNames[j] + ".ts", name = request_name).text
                getEndTime = time.time()
                j=j+1
                ### calculate
                dB = len(response)
                dT = getEndTime - getStartTime
                mediaPT = mediaPT + float(extinf[j])
                ###
                if (bytesInBuffer < bufferSize): bytesInBuffer = bytesInBuffer + dB bufferFillTime = bufferFillTime + dT if(totalLT &gt; 0):
                        totalLT = totalLT + dT
                else:
                    mediaDT = mediaDT + dT
                    if (1000*mediaPT < mediaDT):
                        totalLT = totalLT + mediaDT - 1000*mediaPT
			bytesInBuffer = 0
			mediaPT = 0
			mediaDT = 0
			
                totalDT = totalDT + dT
                totalPT = totalPT + float(extinf[j])
              
              
                response_time = getEndTime - getStartTime
                timeGetRequest = getEndTime - startTestTime
                chunkRPS_gcounter = global_counter(chunkRPS_gcounter, 1)
                nowRPS = chunkRPS_gcounter / timeGetRequest
                write_to_file("statistics//RPS.txt", "a", "%s, %s \n" % (timeGetRequest, nowRPS)) # open and written text to the end of file
                write_to_file("statistics//RTD.txt", "a", "%.2f\n" % (abs(response_time * 1000))) # open and written text to the end of file      
                write_to_file("statistics//UX.txt", "a", "%s, %s, %s, %s, %.2f, %s, %s, %s\n" % (timeGetRequest, bufferFillTime, totalPT, totalDT, totalLT, bytesInBuffer, mediaPT, mediaDT)) # open and written text to the end of file
              
        totalPTLT = 1000*totalPT + totalLT
	lagTimeRatio = totalLT / totalPTLT
              
      
class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 5000
    max_wait = 9000
```

11\. And to create all UX graphs, create one more module – [pyplot_UX.py](https://gitlab.com/mbabilo/hlswithjmeterandlocust/blob/master/pyplot_UX.py):

```
from matplotlib import pyplot as plt
from matplotlib import style
import numpy as np
from matplotlib import pyplot as mp
import pandas
import os

style.use('ggplot')

data = np.loadtxt('statistics//UX.txt', delimiter=',', skiprows=1, usecols=(0,1,2,3,4,5,6,7))
t = data[:,0]
s1 = data[:,1]
s2 = data[:,2]
s3 = data[:,3]
s4 = data[:,4]
s5 = data[:,5]
s6 = data[:,6]
s7 = data[:,7]

plt.figure(figsize=(10,7))
plt.plot(t,s1)
plt.plot(t,s2)
plt.plot(t,s3)
plt.plot(t,s4)
plt.plot(t,s5)
plt.plot(t,s6)
plt.plot(t,s7)

if not os.path.exists('graphs//UX'):
    os.makedirs('graphs//UX')

plt.figure(figsize=(10,7))
plt.plot(t,s1)
plt.title('bufferFillTime')
plt.xlabel('Time')
mp.savefig('graphs//UX//bufferFillTime.png')

plt.figure(figsize=(10,7))
plt.plot(t,s2)
plt.title('totalPT')
plt.xlabel('Time')
mp.savefig('graphs//UX/totalPT.png')

plt.figure(figsize=(10,7))
plt.plot(t,s3)
plt.title('totalDT')
plt.xlabel('Time')
mp.savefig('graphs//UX/totalDT.png')

plt.figure(figsize=(10,7))
plt.plot(t,s4)
plt.title('totalLT')
plt.xlabel('Time')
mp.savefig('graphs//UX/totalLT.png')

plt.figure(figsize=(10,7))
plt.plot(t,s5)
plt.title('bytesInBuffer')
plt.xlabel('Time')
mp.savefig('graphs//UX/bytesInBuffer.png')

plt.figure(figsize=(10,7))
plt.plot(t,s6)
plt.title('mediaPT')
plt.xlabel('Time')
mp.savefig('graphs//UX/mediaPT.png')

plt.figure(figsize=(10,7))
plt.plot(t,s7)
plt.title('mediaDT')
plt.xlabel('Time')
mp.savefig('graphs//UX/mediaDT.png')
```

12\. Almost done, but let's automate the launch of these scripts using .bash as a simple example. [locustfile.sh](https://gitlab.com/mbabilo/hlswithjmeterandlocust/blob/master/locustfile.sh):

```
locust --host=http://184.72.239.149 -f /home/mbabilo/Desktop/HLS/locust/locustfile.py --no-web --csv=example -c 1 -r 1 --run-time 1m  # ⇐ change this to launch  your test
python pyplot_RPS.py	# ⇐ creating a graphs
python pyplot_RTD.py
python pyplot_UX.py
mv *.csv statistics/		# ⇐ moving .csv to statistics folder 
```

Note: Locust also has its own KPI accounting mechanism for inter-average statistics – locust.event. It works well for a single thread, but for tracking statistics from multiple users it can duplicate values.How to use this method for HLS you can see [here](https://gitlab.com/mbabilo/hlswithjmeterandlocust/blob/master/locustfile_eventWay.py). However, it is also worth considering that the standard library contains only a specific set of KPIs, so we would still have to use other methods to calculate UX metrics.

So let's summarize:

1. Both JMeter and Locust can be used for testing HLS, and we have demonstrated it above.
2. The choice of the tool may depend on your skills, but I think using Locust is less convenient since some operations / functions have to be written in Python.
3. Performing calculations in Python code in Locust is easier than performing the same calculations in JAVA/Groove code of JMeter.
4. Using Locust forces to collect statistics and build graphs with the help of code, which is not always convenient and much longer than the use of ready-made JMeter solutions.
5. Examples of KPI graphs:

a) Requests Per Second

Jmeter:

![](https://issart.com/blog/wp-content/uploads/2019/05/word-image-6.png)

Locust:
![](https://issart.com/blog/wp-content/uploads/2019/05/word-image-7.png)
Custom solutions for locust (that also can be applied for JMeter):

![](https://issart.com/blog/wp-content/uploads/2019/05/word-image-8.png)

Such a graph is smoother, more accurate as it has more points. It requires the writing and execution of additional code.

b) Response Time Distribution

JMeter:

![](https://issart.com/blog/wp-content/uploads/2019/05/word-image-9.png)

Locust:

Doesn't provide such a distribution by default.

Custom solutions for locust (that also can be applied for JMeter):

![](https://issart.com/blog/wp-content/uploads/2019/05/word-image-10.png)

Requires the writing and execution of additional code.

c) UX metrics (as example: mediaDT, totalDT, totalLT)

JMeter:

Can be created using a universal data extractor (Page Data Extractor).

![](https://issart.com/blog/wp-content/uploads/2019/05/word-image-11.png)

Custom solutions for locust (that also can be applied for JMeter):

![](https://issart.com/blog/wp-content/uploads/2019/05/word-image-12.png)

d) CPU utilization (5u, 5min)

JMeter non-gui:

![](https://issart.com/blog/wp-content/uploads/2019/05/word-image-13.png)

Locust no-web:

![](https://issart.com/blog/wp-content/uploads/2019/05/word-image-14.png)

Perhaps in our case % of CPU utilization depends on the style and quality of the Python code, however, when using the "HTTPlocust" libraries for requests and "re" for searching by regexp, we see considerable CPU Utilizations even with small load without calculations and writing to files. In addition, most of the time only one processor core is involved. JMeter does not require increased attention to its code, uses both processor cores and consumes much less CPU resources.

e) MEM utilization (5u, 5min)

JMeter:

![](https://issart.com/blog/wp-content/uploads/2019/05/word-image-15.png)

Locust:

![](https://issart.com/blog/wp-content/uploads/2019/05/word-image-16.png)

JMeter requires more memory, this is expected, since it uses a Java machine.

That's it!

##### Conclusion

We have done a lot of work to investigate the possibility of testing HLS streaming and getting a test report using the JMеter and Locust tools, in this article we described the process and detected problems, compared the presentation of metrics.