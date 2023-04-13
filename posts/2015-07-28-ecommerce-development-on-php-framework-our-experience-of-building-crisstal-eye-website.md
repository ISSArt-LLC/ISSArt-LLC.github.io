---
id: 1160
title: 'eCommerce development on PHP framework: our experience of building CrISStal Eye website'
date: '2015-07-28T13:31:28+08:00'
author: 'Olga Rekovskaya'
layout: post
image: /static/img/2015/07/e-commerce-402822_1280.jpg
categories:
    - 'Web Development'
---

PHP has gained high popularity as a web development tool these days. In particular, PHP frameworks have been receiving a lot of attention. Using a PHP framework provides certain benefits to a website owner. To name a few:

- PHP frameworks are easy for beginners – they come with certain libraries and helpers, so you won’t have to find 3rd party resources additionally;
- Faster development and faster fixes;
- Lower development and maintenance cost;
- Compatibility with other [web applications](https://www.issart.com/en/services/details/service/web-development), operating systems and programming languages;
- PHP frameworks enable high level of customization.

This all sound attractive in theory, but what’s on practice? Let’s focus on our experience of building an eCommerce project – [CrISStal Eye website](http://crisstaleye.com/) where users can obtain license for using our time tracking system in their organization (or for their personal needs).

### Which framework to choose?

In one of our previous posts we’ve discussed various PHP frameworks that can be used for [eCommerce website development](http://www.issart.com/blog/php-framework-ecommerce-website-development/). So, the choice can be different in every particular project – depending on the goals, conditions, team skills, etc.
To develop CrISStal Eye website we have decided to utilize [Symfony framework](https://symfony.com/). Why?

- It is a flexible technology enabling various customizations based on your project needs;
- It allows to develop complex web applications in no time, which means significant cost reduction;
- It is ready for huge number of users (high load);\[1\]
- Great documentation;
- Easy configuration;
- Project maintenance is easy;
- It is compliant with most operating systems, platforms, business libraries and infrastructure.\[2\]

### What about design?

Of course it might be a good idea to develop your own unique design from scratch. However, this step has its obvious limitations: this is time and money consuming. This is what we thought as well. To overcome these limitations, we have decided to use Twitter Bootstrap theme.\[3\]

First, it saved us enormous amount of time. With this tool a web developer doesn’t need to spend much time writing code as long as Bootstrap libraries contain lots of readymade solutions. For those who need to launch a project quickly this is an optimal solution.

Second, it is highly customizable. Bootstrap design can be tailored exactly to the project requirements. A web developer can easily choose the elements which are required and skip those that are unwanted.

Third, it is responsive. The need to have a responsive website is getting more and more important, and Bootstrap solves these tasks successfully by adapting to any platform smoothly.

### Where to get images?

The good news is that today there are a lot of resources offering free stock images, and we were happy to use this opportunity.

[Pixabay](https://pixabay.com/) is one of the examples. Images from Pixabay can be downloaded for commercial use for free and can be used in both digital and printed forms. Among other useful resources that offer images on similar conditions are [Pexels](http://www.pexels.com/), [DesignerPics](http://www.designerspics.com/), [SplitShire](http://www.splitshire.com/), [Snapographic](http://snapographic.com/), [JeShots](http://jeshoots.com/), and many others.

In addition, paid services like Depositphotos provide [free images](http://ru.depositphotos.com/free-files.html) weekly. Also you may want to check [this](https://www.shopify.com/blog/17156388-22-awesome-websites-with-stunning-free-stock-images) and [this](https://chasingheartbeats.com/stock-photography-websites/) lists of websites with free and paid stock images.

### Why make mockups?

We’ve conducted our own research. Based on this research we’ve come up with the website structure which we believe will serve the needs of our potential customers to the fullest. We’ve also prepared the graphic assets for our project. But how to make sure that the whole site will actually look like you desire?

To make sure that we are “on the same page” with our development team, we’ve formalized the structure for each page of our website in a series of mockups – please see an example below.

![](/static/img/2015/07/698a8c8c2bf5f5ea2c4c636a04f9afdf.png)

This helped us save a great amount of time that we would otherwise spend on requirements communication.

You can prepare mockups yourself. However, be prepared that your development team may adjust them further because some important points might be missing. Alternatively, you may the development team your project vision in detail and order mockups from them – they will prepare mockups and approve them with you before starting the development.

In addition, I would strongly recommend thinking of captions and buttons headings upon mockups completion and before handing them over to development. Although it is not that crucial if you (or your team) don’t come up with captions and headings right away – you’ll just have to dedicate additional effort for that later (you’ll either have to adjust to what you have or to update the layout according to your needs).

### How will users pay?

It is essential for any eCommerce website to provide convenient payment options to its users. For the first stage we’ve implemented integration with PayPal – one of the most popular payment systems in the world. As for future plans – we are going to integrate with Authorize.net later.

Below you can see the comparison of Payment options alternatives that we were choosing from.

SystemPayments currencyCurrency of money keptLimits on the amountTimeframe for money to appear on the accountTransaction feeRegistration fee

| [Paypal](https://www.paypal.com) | USD / Roubles | Money acceptance and keeping is available in any currency | 550 thousand roubles | Several hours.   To withdraw money – several days | 3,9% + 10 roubles (3 cents) per transaction | free |
|---|---|---|---|---|---|---|
| [Authorize.Net](http://www.authorize.net/)\* | USD | USD | N/A | N/A | N/A | N/A |
| [Payonline](http://www.payonline.ru/en/whoweare/) | Roubles | Money acceptance and keeping – in USD and roubles.   Money withdrawal – in roubles | TBD | 1-7 days | 3,9% | 3 900 roubles |
| [Robokassa](http://robokassa.ru/en/Index.aspx) | Roubles | Money acceptance, keeping and withdrawal are available only in roubles | No limit | Money appears on the account within a day.   Money can be withdrawn within several days. | 5%.   If money turnover is 300 thousand roubles and more, the commission will be 3.9% | Free |

*\*Available for western customers only*

### What about domain name?

Don’t forget to take care of domain name purchase and email addresses registering. Once you’ve come up with your project unique name, it’s better to check whether the appropriate domain name is available, and to book it beforehand.

Luckily, [crisstaleye.com](http://crisstaleye.com/) was available, so we’ve ordered it right away. Be prepared that there is fierce competition for shorter names, and most of them are taken already, so you might have to think of alternatives.

### Conclusion

This was our experience that proved that eCommerce development on PHP framework can be beneficial – in particular, in terms of time and budget.

Have you utilized PHP frameworks for your eCommerce projects? What were the results? Feel free to share your thoughts in comments!

**References**
\[1\] <http://www.slideshare.net/NidhiVasavda/the-many-advantages-of-symfony-framework-21098094>
\[2\] <http://www.symfonydriven.com/news/advantages-using-symfony-framework>
\[3\] <http://www.sitepoint.com/11-reasons-to-use-twitter-bootstrap/>