---
id: 1135
title: 'Some issues with Scrum adoptions'
date: '2015-06-25T11:18:38+08:00'
author: 'Constantine Borisov'
layout: post
image: /static/img/2015/06/Featured-image-2.jpg
categories:
    - 'Project Management'
---

In my [previous post](https://www.issart.com/blog/scrum-development-as-a-way-of-maximizing-business-value/) I told you about Scrum advantages. But there are a lot of issues when people try to use Scrum on their projects. Scrum is ideal when a company is developing a product for itself, when there are no outsourcing, deadlines and distributed teams. But when you try to use Scrum with outsourced development, things are getting more and more complicated. So, the Project Manager should keep in mind that there might be some false hopes of Scrum (this topic is covered [here](https://www.toptal.com/project-managers/scrum/five-scrum-myths)).

I have a half dozen projects in my portfolio, and today I will share my experience of Scrum in real life with you.

### Remote team

The situation when the Product owner (Customer) and the Team (Developers) are far from each other is very common. USA Customer and Russian team have 12 hours time zone difference, and there are few time slots to communicate. Usually Product owner is very busy and can't answer questions all the time. Besides that, some of the developers are usually not fluent in English, and meetings are not effective. But Scrum requires a lot of everyday communication. Lack of communication is a showstopper for Scrum development process. What can be done?

![Remote team](/static/img/2015/06/Remote-team.jpg)

I involve an analyst as a Proxy Product Owner. Developers communicate with the Proxy instead of direct communication with Product Owner. Analyst has good English, he is able to meet late at night and early in morning in convenient time for Product Owner. Usually there are almost everyday meetings at the project start, and one or two in a week meetings in the middle of development.

At the project start the initial backlog is being formed. Product Owner gives a general idea of features to be implemented, Analyst puts each user's story into the backlog and provides a formal description suitable for the Developers. A weekly backlog grooming session allows to keep the backlog up to date. When the Analyst is on vacation, I (as Project Manager) or a senior developer take(s) his responsibilities for this period.

### No interruptions

Scrum iteration scope can't be changed, iteration can only be aborted. But business often requires some additional work to be performed during an iteration, and restarting the iteration costs much. On my projects there were problems with production, or intermediate builds and additional features were needed. Stop iteration and lose one or two days? It is inefficient!

As a solution I always put some buffer for these optional activities to each iteration. If there is no such request, I put one smaller user story at the iteration scope. If there are urgent tasks, one of the developers switches to it immediately. Yes, it breaks sustainable pace of development and decreases velocity, but if business requires such an action, it should be done.

### Stable team

Stable team is required for maximizing development velocity. But again, business cannot always provide team with continuous flow of tasks. Sometimes there is more work to do, sometimes there is no work to keep all the team busy.

![Stable team](/static/img/2015/06/Stable-team.jpg)

On my projects I did two things to minimize costs of the team changes: used coding standards and asked for a detailed user story description. A new team member reads User story and grasps the idea of what should be done. He doesn't have to ask Analyst about the task, he can start implementation. And good code with comments and clear structure requires minimum of time to get acquainted with.

This works fine for new developers, but how can we handle the team ramp down? For a developer removal a clear Definition of Done is essential. Every team member knows what should be done to finish the User Story: code is written, unit-tests are finished, manual testing is completed – and we are good to go. The finished User Story requires no more development, and a developer can be put out of the team without pain.

### Lack of documentation

Scrum requires no special documentation, and it is an advantage. But sometimes clients or providers of capital requires some particular documents: delivery instructions, protocol of testing, description of architecture, etc. This problem is often considered to be a showstopper, but it is not. Scrum doesn't require documentation, but it doesn't forbid it. A work item for any document can be placed to the Sprint Backlog as separate item. You can create a User Story "Create Architecture Description" and put it into the backlog. As a result, you will have the document. I put any significant activity into the backlog. It increases transparency of development and makes it easier to track efforts.

![Documentation](/static/img/2015/06/Documentation.png)

You can also place some documents into the Definition of Done, if almost every user story requires them. For example, you can request each user story to have protocol of testing. In that case by the end of iteration you will have a full set of protocols. It is an easy and transparent method to have documentation in place.

### No management

Scrum team often looks like chaotic and uncontrolled. There is no manager role, there is no task assignment, there is no reporting. Customers who have no experience with Scrum often are not confident with the process. This is why in my projects I've always had Project Manager as a part of the Team. And this is me who was the Project Manager (and Scrum Master). My responsibility was to show what activities were performed, to plan and to track milestones, to address problems. I strongly recommend having Project Manager in each Scrum Project. There are almost no additional efforts since we already have a Scrum Master. We just need to put some additional responsibilities to that role.

### Conclusion

Real life is much more complicated than formal development process. We need to keep in mind that business needs are of great importance, and you should not be afraid of changes to development process if you feel that it should be done. But you should remember that no changes come at no price, and Scrum is designed to minimize efforts and maximize business value.