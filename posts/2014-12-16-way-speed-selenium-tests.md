---
id: 619
title: 'A way to speed up your Selenium tests'
date: '2014-12-16T13:56:18+08:00'
author: 'Egor Nepomnyaschih'
layout: post
image: /static/img/2014/12/big-logo.png
categories:
    - QA/Testing
    - 'Web Development'
---

[Selenium](http://www.seleniumhq.org/) is an awesome and one of the most popular tools for automation of  
Web Front End testing. The idea is that you [write an application](https://www.issart.com/en/services/details/service/web-development) which opens your browser and simulates user actions.  
After each action you check if application reacts as you expect it to. Selenium provides all the neccessary API to  
make the process easier for you.

In the beginning of each test case, you must cleanup the testing environment to make sure that the other tests don’t  
have any impact to the current one. So, you usually restart the browser, clean the cache/cookies and push the  
fixed data set to the database for that. As result, you must login to your application over and over again to continue  
testing. If you have hundreds of tests, it takes quite a lot of time (10 seconds per test), and it is obvious that this  
duplicating work should be nullified if possible – you don’t need to test the same thing multiple times.

We’ve come up with a simple and efficient solution. Using [DbUnit](http://dbunit.sourceforge.net/),  
we create several “immortal” (till 2040 year) sessions, one for each user:

```
<sessions sessionid="084e317cecea464f96b9fbc1f8b8db5c" 
          accountid="1" 
          expiretime="2040-07-24 04:27:46" 
          createtime="2013-07-01 07:55:15" />
<sessions sessionid="3fbe87b707ea48c496c739d743c31aba" 
          accountid="2" 
          expiretime="2040-07-24 04:27:46" 
          createtime="2013-07-01 07:55:15" />
```

Then, in the “setUp” method, we initialize a cookie containing identifier of such an immortal session for a desired  
user:

```
<pre style="font-size: 0.9em;">public class AuthorizedTest extends WebTest {

    @Override
    public void setUp() throws Exception {
        super.setUp();
        // WebDriver can create cookies in a current domain only
        driver.get(WebUrls.LOGIN);
        getAuthorizedAccount().applyImmortalCookie(driver);
    }

    protected WebAccount getAuthorizedAccount() {
        return WebData.ACCOUNT_LARRY; // account with ID = 1
    }
}

    ...
    public void applyImmortalCookie(WebDriver driver) {
        driver.manage().addCookie(new Cookie(
            "PHPSESSID", getImmortalCookie(),
            SeleniumConfig.DOMAIN, "/", null));
    }
    ...
```

Now authorization doesn’t take any time at all. We managed to decrease testing time by 30% thanks to this improvement.  
<link href="//cdn-images.mailchimp.com/embedcode/slim-081711.css" rel="stylesheet" type="text/css"></link><style type="text/css">
	#mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; }
	/* Add your own MailChimp form style overrides in your site stylesheet or in this style block.
	   We recommend moving this block and the preceding CSS link to the HEAD of your HTML file. */
</style>

<div id="mc_embed_signup"><form action="//issart.us8.list-manage.com/subscribe/post?u=27b4bef1d5ce0a19dc5a471f5&id=9fce49f49e" class="validate" id="mc-embedded-subscribe-form" method="post" name="mc-embedded-subscribe-form" novalidate="" target="_blank"><div id="mc_embed_signup_scroll"> <label for="mce-EMAIL">Subscribe to receive more tips and tricks</label>  
<input class="email" id="mce-EMAIL" name="EMAIL" placeholder="email address" required="" type="email" value=""></input>  
<div style="position: absolute; left: -5000px;"><input name="b_27b4bef1d5ce0a19dc5a471f5_9fce49f49e" tabindex="-1" type="text" value=""></input></div><div class="clear"><input class="button" id="mc-embedded-subscribe" name="subscribe" type="submit" value="Subscribe"></input></div></div></form></div>