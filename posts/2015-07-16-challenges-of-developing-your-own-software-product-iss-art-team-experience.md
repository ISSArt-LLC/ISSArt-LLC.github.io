---
id: 1148
title: 'Challenges of developing your own software product: ISS Art team experience'
date: '2015-07-16T10:59:08+08:00'
author: 'Olga Rekovskaya'
layout: post
image: /static/img/2015/07/ux-788002_1280.jpg
categories:
    - 'Web Development'
---

As some you might know already, the primary activity of our company is [custom software development](https://www.issart.com/en/). We work in international market primarily, and during our professional life we've faced a need to monitor our team's performance as well as to provide transparent reporting to our customers (you can read more about these challenges here). Although there are a lot of ready [time tracking solutions](http://www.issart.com/blog/time-tracking-systems-overview/) aimed to help to deal with these issues, we have decided to build our own system – the one that would meet our company's need to the fullest. We've named it [CrISStal Eye](http://crisstaleye.com/).

Initially we've developed this tool for our internal needs. However, after launching it internally and seeing its successful utilization within the company, we thought: why not represent CrISStal Eye to the market?

This is how we decided to present CrISStal Eye as our own software product. Of course we realized that before launching it to the market certain adjustments were required. Therefore, we've conducted competitors' analysis, studied our potential customers' needs and found out which additions needed to be made.

Was the development process smooth and easy? No, it wasn't. While working on this product we've faced various challenges, and we are willing to share our experience with you in this article. In particular, we'll tell you about the issues we've encountered, and how we've approached these issues. Hope you will find this information interesting and useful.

### Increasing server load

Developing a product for your own needs is one thing. Developing a product that hundreds and thousands of other users will be touching every day is another. One of the main challenges that you may encounter is a totally different amount of traffic, server load, and server space required to support it. How can we deal with this risk?

- Develop flexible architecture. If possible, make your databases easier to expand. Make replicating and moving data as simple as possible. Don't stop on easy solutions that are faster to develop. Set up a special brainstorming session with your team to see how you can integrate future growth in your product.
- Do market research. It's great to know your customer base, your competitors, and have at least a vague understanding of a number of users you might have. Of course, actual situation might prove different from what you have expected, but having a minimum and maximum expectation points will give you something to start from.
- Take a round of load testing. If you're lucky enough to have specialists who can write automated tests and set up an environment to model a situation of increasing server load – go for it. It's probably the best thing you can do, and it can bring amazing results you've never expected.
- Have a plan for increasing user flow. Always keep in mind that it's better to be prepared. Even if you've just successfully adapted your product for an increased load, ask yourself questions like “What if a number of users doubles? Triples?”

### Rapid switching of priorities

When we have high pressure for release, the team is working on several fronts at the same time. New features, lots of bugs, and management that's asking for several features to be developed at the same time or delivered last week, are all present. News from marketing team and ideas from analysts keep coming in and adding to the information flow. What should you do?

- Make shorter release cycles. Instead of waiting for several months for a pack of features to be developed, and then for substantial time for it to be tested, opt for the most critical features and bugs. They're big? Break them into parts, whenever possible. Two or three weeks are quite enough for a nice release cycle. This will also keep your testing team busy all the time.
- Discuss and estimate all feature requests before putting them into development. One of the ways is creating a separate entity for feature requests in the project management tool.
- If you don't use versions and priorities in your Project management system – start doing it. When you have a list of tasks estimated and prioritized, it's easier to have a conversation and shift priorities even if you have them changing rapidly.

### Reworking parts of the system

While working on the project, we've faced the following reasons for reworking parts of the systems:

1. Feedback from users. After internal release of the product we continue its development. And also we listen to our employees – our primary users and apply new functionality after their feedback.
2. Changing business requirements of the project. Business requirements and business goals may slightly change during the development of the project. In our case it was because of results of analysis of the market and our competitors. After the analysis we decided to implement new features to make our product more powerful in the software market.

Here are the reasons that may lead to reworking parts of the system. And that is how we deal with them:

- Firstly, let's deal with the changes due to feedback from users. In this case we systemize all the feedback by priority, type of change (bug, feature), discuss the information with analyst and then begin implement features and fix bugs from the ones with higher priority.
- In case of changing business requirements we discussed all the changes with our marketing specialist, divided all the new features by versions and then implemented them. For example, among these features there were providing potential customers with trial version, PayPal payment system. Also the feature dashboard was common for many our competitors, and we decided to implement it, because it was quite useful and its main function is to provide customers/managers with key reports and metrics about their team.

### Having to deal with support issues

The problem, we are aware now about is that when our product becomes popular and our users are spread around the world (yes, on this stage there also may appear some problems!), we should be ready for mass requests, messages from our users (and we suppose, that these won't be only letters of thanks). We should be ready to build strong support team and handle all these requests in the shortest period. But also there is a great job before the product release. And here is the job we are doing to be prepared for the support issues:

- internal release: first of all we've developed the product for our company so that our employees experienced all the features of the product and reported about each bug, they've noticed. After releasing each part of the product, manager and development team receive a good feedback from our internal users.
- also there is another side of this aspect: when you deal with internal users you do not pay as much attention as you could do with any external user. When a user who pays for your product is not satisfied with it, your reaction is very fast, because unsatisfied user is not only about losing money, but also about negative reviews and as a result decreasing in sales in future.

To sum up, it is a good practice to test your product inside your company, if you do have such opportunity to make it perfect for users. But on the other side, you should realize, that your product will never be perfect, there will always be a work on making it better. In this case you can test product during internal release, but then without any delays release it and solve all the problems working with real clients.

### Supporting more rapidly changing documentation

During software development when business requirements are constantly changing, a lot of new features are being implemented, documentation should be changed rapidly and stay always updated. Nevertheless, an analyst may also be busy working on another project. In this case our analytical department decided to:

- write documentation for each version of the product and select options (entities of the system, typical sections) that are common for every version
- develop and put into place a process for such situations, when documentation should be changed. Starting from the last version analyst gives detailed description in CR (Change request) itself and the final version of the documentation is provided in format of test cases.

#### We need your opinion!

Although we've managed to achieve what we've planned for the project launch, we are still working on further improvements. And this is where you help is welcome – we'll appreciate it if you let us know which features looks appealing for you by taking part in our poll.

\[polldaddy poll=”8824753″\]

### Conclusion

These were the challenges that we have faced while working on CrISStal Eye system. Of course, every case is individual, and any working on any other product may avoid these difficulties and/or may involve another issues.

***Have you ever developed your own software product? If so, what were the challenges? Feel free to share your experience in comments!***