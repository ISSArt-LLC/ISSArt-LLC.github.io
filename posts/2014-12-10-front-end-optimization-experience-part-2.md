---
id: 588
title: 'Front end optimization experience. Part 2'
date: '2014-12-10T11:07:15+08:00'
author: 'Egor Nepomnyaschih'
layout: post
image: /static/img/2014/12/web_design01.jpg
categories:
    - General
    - 'Web Development'
---

You can find the first part of the article [here](http://www.issart.com/blog/front-end-optimization-experience).

Let’s continue our performance issues investigation.

**Problem four. Navigation bar rendering.**

![](http://content.screencast.com/users/enepomnyaschih/folders/Jing/media/370d7eca-9888-4f1b-bd19-a22314aa68aa/2014-12-05_1137.png)

We have a navigation bar widget which shows the entire hierarchy of all the existing units and components in the application. Considering the fact that we have 2200 components, it takes about 10 seconds to render. There is a popular opinion that the loading time longer than 3 seconds is always annoying for a user. So it was a subject to fix for sure.

The solution comes from an idea that we don’t need all the items to be rendered right from the start. Let’s render them only as soon as they are needed. It is called “deferred rendering”. The idea is similar to the buffered grid’s: we don’t render the content if a user doesn’t see it on the screen. For such hierarchical structure as a unit/component tree, it is very difficult to track scrollbar position to exclude unnecessary nodes from the rendering chain. But it is very easy to exclude the nodes which are covered under the collapsed nodes. So, at the beginning, let’s just render a root node forcibly, and start listening for an event of its expanding. We can expand it either manually on user action (click at the node) or automatically if we see a direct URL to some nested node in the browser address line. In both cases, we render the child nodes and start listening for events of their expanding as well. During this recursive process, we render only a visible part of the tree, and it improves rendering performance significantly.

There was one more problem with the sidebar. The sidebar works the next way:

- If a user clicks at a small triangle at the left side of the node, we just expand this node without its selection;
- If a user clicks the node itself, we both expand and select it.

Now imagine if a user just wants to select a collapsed node which contains 550 nodes under itself. Just select, but not expand it. In this case, a user will run into 2-3 seconds delay unexpectedly, because we expand the node automatically for them and render all these 550 nodes. So, we’ve decided to prevent the automatic node expanding if it contains at least 100 child nodes. But if the node is already selected, then we expand it. The UI was still intuitive and simple, but we’ve fixed an annoying performance issue just by a slight artificial UI improvement.

**Problem five. On-demand calculations.**

In a previous paragraph, we’ve introduced deferred rendering of the UI components. But the same problem remains in the data model layer of the application. We have 2200 components, and all of them have some data which must be accumulated to the higher levels of the hierarchy. But in fact, it is necessary only if a user has selected the top level of the hierarchy to view this accumulated data. In all the other cases, this data is redundant. So, we must accumulate the data as long as it is necessary for user, on demand.

In theory, this is easy, but in practice, it is quite difficult to implement in code. Potentially, we can run into an issue when 2 or more different clients need to work with the same accumulated data array, and we don’t want to recalculate the same data for every single client. On the other hand, as soon as the last client has finished using this data, we must drop the data, stop the synchronization and release the memory. And the code must remain clear and easy to modify.

We’ve decided to implement a special utility class “AccessProvider” to manage such the on-demand data. It has two methods:

- “checkout”, registers a new client of the on-demand data. If the data is not calculated yet, calculates it before continuing;
- “release”, unregisters a client. If this was the last client registered in the access provider, clears the data.

To make the class reusable, we’ve decided to specify the generic “data calculation” (init) and “data clearing” (done) operations as the callback functions passed to the constructor of the access provider. So, here’s an example of the code which we use to provide access to the status of the unit:

```
<pre style="font-size: 0.8em;">var Unit = function() {
    ...
    this.status = null; // we'll put the on-demand data to this field
    this.statusAccessProvider = new AccessProvider({
        init: this._initStatus,
        done: this._doneStatus
    });
};

JW.extend(Unit, JW.Class, {
    _initStatus: function() {
        // This function is called automatically when the on-demand data
        // needs to be calculated. Here we calculate the on-demand data and
        // setup the synchronization with the lower layers in the
        // hierarchy to keep the data up-to-date.
        // Usually this is a long operation
        this.status = this._calculateStatus();
        this.statusSynchronizer = this._createStatusSynchronizer();
    },

    _doneStatus: function() {
        // This function is called automatically when the on-demand data
        // is not needed anymore. Here we drop the data, stop the
        // synchronization and clear the memory.
        this.statusSynchronizer.destroy();
        this.statusSynchronizer = null;
        this.status = null;
    }
});
```

Now let’s look at the code of the client which needs this on-demand data. To make our life easier, we return a special “Accessor” object in the “checkout” method of the access provider, and its destruction automatically causes “release” method to be invoked. This can be combined perfectly with [jWidget’s object aggregation system](http://enepomnyaschih.github.io/jwidget/1.1/index.html#!/api/JW.Class-method-own), so the code appears to be very simple:

```
<pre style="font-size: 0.8em;">var Client = function(unit) {
    ...
    this.unit = unit;
    this.own(unit.statusAccessProvider.checkout());
};

JW.extend(Client, JW.Class, {
    // While the client is alive, it can access unit's status via
    // this.unit.status statement easily and fearlessly,
    // the field will be available for sure.
    // On client destruction, it will be automatically unregistered
    // in the access provider, and the data will be dropped unless
    // someone else still needs it.
});
```

So, the code is still very simple, but way more performant on the lower levels of the hierarchy. Sure, it still takes a lot of time to initialize the accumulated data if user selects the root layer of the hierarchy, but now we at least have an excuse for that.

**Problem six. PHP memory utilization.**

Ok, we’ve made a lot of good stuff in JS part of the application and a browser seems to handle our code quickly and reliably. But it turned out that the cloud server that we host our application at has very thin PHP memory limit, and the data builder started to fail miserably on the array of 2200 components. The reason was that we kept the whole data JSON object in the memory during build process, and then used standart JSON serializer to write this data to the file. If the JSON is big enough, PHP is running out of memory.

There is a well-known solution of XML parsing without necessity to keep the entire XML document in the memory, called [SAX Parser](http://en.wikipedia.org/wiki/Simple_API_for_XML). We’ve decided to implement something similar to that for JSON formatting. Instead of keeping the entire JSON object in the memory, we’ll be writing the data chunks to the file right away. So, we’ll only keep a single chunk of data in the memory at every point in time. To do that, we’ve implemented a couple of PHP classes which help us to keep the JSON output valid: JsonArrayWriter and JsonObjectWriter.

With JsonArrayWriter, we just put the array items to the file one by one, and it automatically appends the special symbols (“\[“, “,” and “\]”) to give us a valid JSON array in the output. Example:

```
<pre style="font-size: 0.8em;">$file = fopen($path, 'w');
$writer = new JsonArrayWriter($file);
foreach ($chunkId in $chunkIds) {
    // keep only one chunk in the memory
    $chunk = $this->getChunk($chunkId);
    $writer->put(); // append a special symbol if neccessary
    fwrite($file, json_encode($chunk));
}
$writer->close(); // append a closing bracket
fclose($file);
```

Output:

```
[<chunk1>,<chunk2>,...,<chunkN>]
```

Sure, we could just write all the special symbols manually without JsonArrayWriter, but it would make our code unclear and non-extendable. Just imagine: what if we’ve decided to write the output in a pretty-printed JSON format rather than streaming it in a single line?

```
[
    <chunk1>,
    <chunk2>,
    ...
    <chunkN>
]
```

If we appended the special symbols manually, it would be difficult to change, and we’d be forced to make modifications in many places of our code. With JsonArrayWriter, we can change the behavior by a simple construction parameter modification.

Now let’s look at JsonObjectWriter:

```
<pre style="font-size: 0.8em;">$file = fopen($path, 'w');
$writer = new JsonObjectWriter($file);
foreach ($chunkId in $chunkIds) {
    // keep only one chunk in the memory
    $chunk = $this->getChunk($chunkId);
    $writer->put($chunkId); // start writing a field with the specified key
    fwrite($file, json_encode($chunk));
}
$writer->close(); // append a closing curly brace
fclose($file);
```

Output:

```
{"id1":<chunk1>,"id2":<chunk2>,...,"idN":<chunkN>}
```

Again, JsonObjectWriter takes care of all special symbols and we just need to write the child objects.

What if we already have several JSON objects that we would like to merge together? We can use “dump” method for that:

```
<pre style="font-size: 0.8em;">$file = fopen($path, 'w');
$writer = new JsonObjectWriter($file);
$values = $this->getValues();
$writer->dump($values);
...
$writer->close(); // append a closing curly brace
fclose($file);
```

We can combine JsonObjectWriter and JsonArrayWriter instances together:

```
<pre style="font-size: 0.8em;">$file = fopen($path, 'w');
$writer = new JsonObjectWriter($file);
foreach ($chunkId in $chunkIds) {
    $writer->put($chunkId); // start writing a field with the specified key
    $chunkWriter = new JsonArrayWriter($file);
    $subchunkIds = $this->getSubchunkIds($chunkId);
    foreach ($subchunkId in $subchunkIds) {
        $subchunk = $this->getSubchunk($subchunkId);
        $chunkWriter->put();
        fwrite($file, json_encode($subchunk));
    }
    $chunkWriter->close();
}
$writer->close();
fclose($file);
```

Now we don’t face any memory issues at all. We can reuse JsonArrayWriter and JsonObjectWriter everywhere to improve application performance and prevent memory issues.**Result**

This was an intense 2-week challenge of application optimization, and we’ve managed to make it work ~10 times faster and consume ~10 times less memory. Our customer is happy, and we are ready to go ahead and add more features to the project.

We can make the next conclusion from this story: don’t do the optimization prematurely. Some developers got used to do so, and it is usually not worthwhile at all. At the first steps, don’t worry about optimization. Implement the minimum set of features to make your application viable for the end user, and just follow the coding recommendations of your framework and the simplest practices/patterns of code development. Save your time. Optimization can always be made at the later steps, when it is necessary indeed. And it will be clear which 20% of the application need to be optimized to give you 80% of benefit. Sometimes the memory/performance lapses can come from the very surprising and unexpected places, so just don’t worry about that in the beginning. But always keep an eye on the new requirements that you get from the clients: sometimes it is obvious that a new requirement can cause performance issues. In this case, just test it first. If you are right and the application suffers in performance – include the optimization step to your estimation. If you are wrong and the application works well – don’t worry about optimization.