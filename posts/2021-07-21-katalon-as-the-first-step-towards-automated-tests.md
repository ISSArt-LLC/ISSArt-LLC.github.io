---
id: 3868
title: 'Katalon as the first step towards automated tests'
date: '2021-07-21T18:13:03+08:00'
author: 'Ilya Pikho'
layout: post
categories:
    - General
---

Katalon Recorder is an extension for Google Chrome and Firefox browsers that allows you to record test scripts as code in a specific language with the application of specific frameworks.

This tool is convenient when you need to quickly make an automated test. Also, tests recorded with Katalon clearly show which methods are responsible for a specific step, which is very useful not only for beginner QA Automation engineers.

Even for experienced testers, this tool will come in handy as creating templates for autotests. In this tutorial, we will show you how to install this tool and to write a simple test.

**In this article, we will demonstrate the installation of Katalon recorder for the Google Chrome browser**.

**Setup**

Go to Chrome web store, find Katalon Recorder extension and click “Add to Chrome” button

![](https://lh3.googleusercontent.com/7m9e2g4GCObdBuhKrFFcSFd-z55aCMNV79sLxzPnIOYvF-bY8UnJt7A7Lr3QPiYVs-xHChIpvPQTZVKRzVkGmaCG8u2_2-ZykV1a9wqIqbGeuhCmM9alStEdKcMw7dud7AUyNMw_)

After that, after a while, the Katalon icon will appear in the browser.

![](https://lh6.googleusercontent.com/2zgOWqed1v67BLc8SsVzSsqkj-YmDicYBW3AhzjapxgXUXGBM7Cnsvm55g_aphf6VaGTkjGxAFUc2b_2KsFBHBt59Lnl5ivi10zyYe3tiH1WM11rIX2V94PAtmwNgeEx-6rmUykV)

If you click on it, the Katalon Recorder window of the extension will be displayed.

![](https://lh4.googleusercontent.com/Kvc5c9gSXlNadCzIrG5ellhcwBQOpaTBz947h2p_IaduyRsqQ7yd9xEckc-LOC9AGDsTu2vCfjmhhj_333PjsCD6Ol1jE4TnWpk6dYwTWxArEDVsKquwh3XRbKGgGPO70Bmgf31r)

**Overview of the features**

In the upper part of the window there are buttons with the main functions of the plugin.

![](https://lh5.googleusercontent.com/4W2QAndqLXN8MGccy3mtH2SDTkc4rUbg4miM9P2TdxbQhajwuWDh17NyJQwIV9amw2YliTWo-M2gxgNNlbGAfIIlYzc9ucU85Glx59niXZ9yNcN1PceYfVXxM8SvE_jUlzWox-VJ)

“New” – Creating a new test case

“Rec.” – Recording a test case

“Play” – Reproduction of the recorded test case

“Play Suite” – Reproduction of a test suite

“Play All” – Reproduction of all cases

“Pause” – Make pause while reproducing

“Report” – Reporting problems to the developers of this plugin

“Export” – Export of created test cases in different programming languages, using different frameworks

This plugin supports the following export options:

![](https://lh6.googleusercontent.com/9CAOBd1iRziD2Rv9gfMPrzjIwWtFdEq4RKQzPVCZW6OSM67QfwsJUM-B7uL62EVxAS65PSU2o4gOnQKGiI1fPxwLM-KrxZgZv-jPeJtmnQuzvNhY8PGxHY5xhQtF8xZdaAgJojih)

On the left side, there is a block with created test cases / test suites.

![](https://lh3.googleusercontent.com/Y3IV92k5rlrO-NxoV34dWy0qGIR_OdVqbFtxrCqBf31UBiSF6FD3dSI16WRtX5wrbWgVLapXn9t5wI19XbxUPf2VNHLVnkJxaYBdzcuGeTjNQeFgST9lYao9RB2dRDdqTtlMuqPK)

Katalon has two main building blocks: Test Case and Test Suite. Test Case is a set of step-by-step commands with certain checks, Test Suite is a collection of several Test Cases. It is a kind of grouping for test cases.

In the central part there is a block with commands for a specific test case.

![](https://lh6.googleusercontent.com/EY3v8L7-YBZcmkWCdD1wOGiryjoKPQWchx2SQ3jH_Cy9CHSmsKt_agmdcnam8vMm6yg40UP8pMoJ_i9Hb1aO6noTkm7is9wcUOONY6EusyHOK9pxZibGPsnuF-fOqyVGclUIVLG-)

You may find the block with various tabs at the bottom:

Log, Screenshots,Variables,Data Driven, Extension Scripts, Reference and Self-healing

![](https://lh4.googleusercontent.com/OFbjcPCT9qmcNgIztwEl_L8YT9JtUGTz6eR6579nDWMFgh2i8fu65ZReduFeWJY_XYHCL4rk_gbjH5iZ9N6QwSYqkIMv2WmKGRmBeaK4k4LVg4OdxGHhnHYU1_4SfpH2aOnf7POy)

**Test script creation**

Let's create a simple test that will search for the IssArt blog site on google, follow the link, then go to the QA/Testing section and verify that we are on this page.

Click the “New” button and fill the name for the new test case. Then click **“Ok”**

![](https://lh4.googleusercontent.com/F2-vPdlTpp1pmxCPN7HjuL2-8n3olYdf9P42tkAWMTyxbTg0vMRTrImYPQy8Jxv1mcf3uQ6-CzRLBHjdtuwWL97MuhZzuf6vzlw-P0vJ820ULvD1IIpQ4uhKr9mxulE1srj3T0fE)

Click **“Record”** button and start to carry out the steps described above for testing (Search blog page issart, etc.) then click **“Stop”**

After these manipulations , we'll have a step-by-step script in the “Commands” block.

![](https://lh4.googleusercontent.com/2o2DLEBqOBd_Zbg83GJqfJWwaWb6SwrRR7QN1GAydSgj8Y0N01M3GdLF0nXwmvvOHtVa4KvkgNJnJkPSsuVb7CLwLsrhEb7SF7_FQgS3n6nxQO9Ke_2hfXBvo2jfDZvlSPkU6QXG)

Now we need to check that we are in the Qa / Testing section of the IssArt website. After looking at the page, how can we know that we are in the right section? The page title gives us information about this.

So let's use this element as the confirmation that we are on the QA / Testing page of the IssArt website.

![](https://lh6.googleusercontent.com/Y_jZEEHnYnFD4Likj7l_8McCmm-Y3QlGQEbucIYNelFPVzvaC-OeLXJw6ZH8gU2myEuEwj0uC5MmLgB1pe2dh9Hnb3udFTwFgNGPzOKLcM0YEJgLSAEJcQWebA0OYvQthpI9w-Qw)

In order to add a check, press “+”

![](https://lh4.googleusercontent.com/gXz2nk_hjJksEGbzNnWciYMf_smUTn3io14rsul_1SMwxSSaqvMqVyleKmWxWuB5vCbDUNt7s50AJF-Go-pLkLmlXv3uexZnkRIxj-lg-YqXWdIOwLNNE5Y2ers7pjOMb5JJQaXZ)

In the “command” we will specify the “*assertText*” function, since we need to check for the presence of the text. In Target, specify the xpath locator for the title. In our case, the locator will be *“// h1 \[contains (text (), 'Category – QA / Testing')\]”*. In the “Value” field, specify the expected text in the title. In our case it will be “Category – QA / Testing”

![](https://lh6.googleusercontent.com/CZVxE2SeXu24IjtTlOqSVadIj7Ru7817un4TT3zbizElqzBmtzaH5dJNkVIg3ZAr5G81I_-hi5POFdZTU0usdjbRa4mHqigddwcImKgjwYyeImSHpGjeiEx4NHsqTXrTILCTJ4Bm)

In order to check that our script works, press **“Play”** button.

![](https://lh3.googleusercontent.com/uX7QbY-W5QFK4YDdYlxDIlNxxNOmuuiXPkqDdpDKd0qeoXYett4zR_GMldhDvV173qqLpJoIXuPCYfidA2Wu43aM7fImsfAbVy9Ca06HkyqH4GoBG3lbLGpopxzAjQriuBzvlsfc)

After that, a browser window will open and we can see that our script is automatically executed.

After completing the case, open the Log tab in the lower block of the extension.

![](https://lh6.googleusercontent.com/PFnJWZi54E-qlt7JHsaD2JzosQzKlcK-WgWeWSSd1bdEjkqiTCyRpNTNPGgCguFKFcfT09LxWwFpCLNtL6bOhznH_b3wa2qVaNSvwLKu1rnybN_2xmRecg7Y4gv8zov_PXr2XRzi)

In the logs we should see the entry “Test case passed”. Therefore, everything went well, the locators were selected correctly.

If we need to convert our script into an automated test written in the programming language we need , using some of its frameworks, click “Export” and in the “Format” drop-down menu, select the one we need.

![](https://lh4.googleusercontent.com/upH1NKj7-CjyF-z__oTubjDVhWs90h_pYlcLSqqAUQISbIlq4oK-_P1r54FXNuZOn7eJcmNzNMaPJq3BlNhH-RJ8DOgY0RNcyBB-S4HilF54GHW9UPS4B86T8UGj9omkwfhyiGzJ)

We can copy the generated code into the IDE and perform various manipulations on it: refactoring, optimization, integration with existing test systems, etc.

## **Conclusion**

In this article, we got to know the Katalon Recorder tool.

In particular, we studied the main features of this extension, wrote a simple test and ran it. Also, we got acquainted with the tool for exporting scripts to the required programming language / framework.

This tool is not without drawbacks, in the form of cumbersome locators and code duplication. However, these problems are minor and can be fixed by the refactoring.

All in all Katalon Recorder is a great browser extension which allows you to speed up the process of writing automated tests.