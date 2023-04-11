---
id: 3297
title: 'Predicting product item category in 10 lines of code'
date: '2019-05-08T18:13:41+08:00'
author: 'Alexandr Kalinin'
layout: post
categories:
    - 'Web Development'
tags:
    - python
    - scraping
---

## ![](https://staging.monsterinsights.com/wp-content/uploads/2017/11/woocommerce-category-seo-tips.jpg)

## Why on earth?

If you somehow deal with storing or processing any kinds of goods – than a problem of assigning a category set to your product items will arise sooner or later, and the problems may be the following:

- You are running a web-store, and you want to facilitate a user to navigate your site and search items with help of categories.
- You have a dataset with items that miss categories mapping, and you want to do some research on aggregated clusters of products.
- You are going to introduce a recommendation system in your online-store, and you want it to take categories into account for more precise predictions.
- All other cases when you need categories, but don’t have them.

Of course – the most straightforward solution is to develop your own categories classification and assign a category to each product item manually, but that’s not always the case – because you may not have a ready-to-use inventory of categories, and you need to do the following:

- create a set of categories by yourself
- assign a suitable category to each item, predicting it from its name.

Gonna do the stuff? Quite hard, isn’t it? But fortunately we have a plan:

## Scraping to the rescue

![](https://raw.githubusercontent.com/pluralsight/guides/master/images/310d6edd-b569-408a-a61d-f6d9a9a9eb61.png)

Why create your own set of categories if we can stand on the shoulders of giants? And this time Amazon is going to be this giant . This guy will help us with categories set and predictions.

The workflow is the following, and it looks quite simple:

- Search for the necessary item name in Amazon.
- Fetch its webpage and find out which categories are connected with this item.
- Obtain these categories and save the thing.

Let’s look how it is done in python.

## Let’s go searching

![](https://www.shoutmeloud.com/wp-content/uploads/2018/05/Find-Google-Keyword-Planner-Search-Volume.jpg)  
Imagine we are running an online-store that sells toys. And we have an item on sale with given name – *Bearington Lil’ Grizby Small Plush Stuffed Animal Brown Grizzly Bear, 7 inches*. Cute teddy bear, isn’t it?  
![](https://images-na.ssl-images-amazon.com/images/I/61XkHgA5QtL._SL1000_.jpg)  
We can go and search this item with [Amazon Product Advertising API](https://docs.aws.amazon.com/AWSECommerceService/latest/DG/EX_SearchingbyKeyword.html). In response we will get the necessary product features including its categories, but registering as a developer requires signing up, entering your credit card info and other credentials, reading docs and doing other redundant stuff. Is there a workaround if we want to scrape the items just once and not periodically? Yes there is – we can search for them in Google.

First, let’s install the necessary lib:

`pip install google`

That will install a handy google search python wrapper. Let’s make a search query:

```
<pre class="brush: python; title: ; notranslate" title=""> # Get the first 20 hits for search item name on Amazon.
from googlesearch import search

def find_on_amazon(item_name):
    return [url for url in search(f'site:www.amazon.com {item_name}', stop=20)]

res_urls = find_on_amazon('Bearington Lil Grizby Small Plush Stuffed Animal Brown Grizzly Bear, 7 inches.')
# ['https://www.amazon.com/Bearington-Grizby-Stuffed-Animal-Grizzly/dp/B07PGWJDX2', 'https://www.amazon.com/Bearington-Bandit-Plush-Stuffed-Animal/dp/B0052GBIX0', ...]
```

Obviously the first item in the list can be taken, but let’s keep the others as well in case we want to make some filtration.

Now when we have the relevant urls, we can do fetching pages and parsing their content.

## <a id="Lets_go_scraping_60"></a>Let’s go scraping

![](https://searchenginewatch.com/wp-content/uploads/2018/10/web-crawler-feature.jpg)

On this stage, we will use python scraping professional’s two best friends: [requests](https://2.python-requests.org/en/master/) and [BeautifullSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/). To install them run `pip install requests beautifulsoup4`.

Now we can fetch an html page with **requests**

```
<pre class="brush: python"># Import stuff.
import requests
from bs4 import BeautifulSoup
```

Let’s make out first url query. Don’t forget to define a User-Agent header with which our scraper will send requests, otherwise it will be recognized as a bot and asked to fill in captcha.

```
<pre class="brush: python">headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36'}
response = requests.get(res_urls[0], headers=headers)

soup = BeautifulSoup(response.text, 'html5lib')
```

So we have fetched a page with relevant item content, and now we can move towards vivisecting it. First, we need to find out where categories information is rendered on the Amazon web page. And here it is – in the breadcrumbs section.  
![alt text](https://snag.gy/fLorCc.jpg)

Let’s examine DOM tree to find some clues for fetching this data.  
![](https://snag.gy/A9wHxm.jpg)

As we can see the data we need is stored in a child of *div* with id *wayfinding-breadcrumbs\_feature\_div*. And the particular category information lies in the links. So we have to find the breadcrumbs node, find all the links there and extract the content from them. This is how it looks like in the code.

```
<pre class="brush: python">breadcrumbs_node = soup.find('div', id='wayfinding-breadcrumbs_feature_div')
categories = [a.get_text().strip() for a in breadcrumbs_node.find_all('a')]

print(categories)
# ['Toys & Games', 'Stuffed Animals & Plush Toys', 'Stuffed Animals & Teddy Bears']
```

That’s all. We now have a set of categories mapped for a given product name.

## <a id="Things_to_be_improved_97"></a>Things to be improved

We have successfully predicted a category for a given item without doing any time consuming stuff like creating our own hierarchy of categories and manually assigning all of our products to them. Thank you, Amazon. But this solution is not a silver bullet of course, and here are some tips-and-tricks we can use further to make this approach even better:

- **Gracefull polling.** Of course Amazon can bear large loads, but if your decide to annotate all your 2M items with its help, sooner or later it will be revealed and you will be banned. Then Amazon will review its anti-bot defence, and next time it will be a more complex task. And not only for you, but for everybody. So don’t abuse – make pauses by adding **sleep** while fetching pages.
- **Hierarchical categories.** In the code above we were dealing categories like a flat list, but they certainly have parent-child relations between them. This can be implemented if we will store not a list of strings but a list objects with *parent* attribute where we can reference a parent category. Categories with not *parent* attribute will be roots.
- **Handling orphaned items.** Although Amazon is big and has a lot of product items in its database, it certainly doesn’t have everything. So you should keep it mind while making automated categories annotation either by assigning them to *Unknown* categories or by manually assigning the needed categories.

## Full code

```
<pre class="brush: python">import requests
from bs4 import BeautifulSoup
from googlesearch import search

def find_on_amazon(item_name):
    return [url for url in search(f'site:www.amazon.com {item_name}', stop=20)]
    
res_urls = find_on_amazon("Bearington Lil' Grizby Small Plush Stuffed Animal Brown Grizzly Bear, 7 inches.") 

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36'}
response = requests.get(res_urls[0], headers=headers)
soup = BeautifulSoup(response.text, 'html5lib')

breadcrumbs_node = soup.find('div', id='wayfinding-breadcrumbs_feature_div')
categories = [a.get_text().strip() for a in breadcrumbs_node.find_all('a')]
```