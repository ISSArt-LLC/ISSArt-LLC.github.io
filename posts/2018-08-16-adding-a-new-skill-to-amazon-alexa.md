---
id: 2757
title: 'Adding a new skill to Amazon Alexa'
date: '2018-08-16T15:31:06+08:00'
author: 'Artem Golubnichenko'
layout: post
image: /static/img/2018/08/dreamstime_xxl_114603370.jpg
categories:
    - General
tags:
    - Alexa
    - 'Amazon Alexa'
---

In this article, we are going to share our experience in adding Amazon Alexa Custom Skill. Alexa can play music, control your smart home, get information, news, weather, and more just at your voice. Echo and other Alexa devices let you instantly connect to Alexa and manage your requests to Alexa service.

**Introduction**

Every day, waking up and getting ready, we perform a number of the same activities, which help us to start the day. A number of these activities can easily be done by smart devices, there are lots of which these days. One of such devices was developed by Amazon – Amazon Alexa. When Alexa appeared, it started helping me perform various everyday activities that I used to do myself. For example, every morning I ask Alexa to report the weather forecast to me, switch on some music, inform me of the traffic jams on my way to work and many other things. In this case, I like eating breakfast and getting ready for work without being distracted by the necessity to request such information from my smartphone. But unfortunately, Alexa is not almighty and cannot perform all my requests. But I would love to also get information about my today's or tomorrow's appointments and work tasks before going to work. 

Currently, I have to use the company's internal tools to get this kind of information from my smartphone. But it would be nice to get this information simultaneously with doing other things without using a smartphone. No, standard Alexa can't do it, but you can teach it! You can add a new skill that will do what you need. And it's really great. Adding a skill to Alexa is a simple and flexible process that involves performing a few simple steps. In this post I will tell you and show how to add a new skill to Alexa, so that it can provide me with a list of things to do today, addressing a third-party service.

Adding a new skill is performed in two steps: writing and deploying the Lambda function, and adjusting Alexa skill, which will be using the generated Lambda function. Let us look at these steps more carefully.

**AWS Lambda Setup**

The processing logic for requests from Alexa is done in the Lambda function. This is the main step in adding a new skill. And setting the logic of the function is your responsibility. To write the Lambda function in Java, there is an SDK from Amazon which simplifies the process of creating the Lambda function. In general, the Lambda function can now be written in such languages as Python, Node.js Go, Java, C#. So, let's start.

We will take an SDK [here](https://alexa-skills-kit-sdk-for-java.readthedocs.io/en/latest/index.html) and carefully read the description and the examples. From the documentation, it is seen that you should implement your own RequestHandler, which will contain the logic for handling requests from Alexa. Let's call it PlannerIntentHandler, for example. We will take the list of events and planned tasks, referring to a third-party service that makes a request to some server, where there is a planner with a to-do list. There can be any implementation that refers to the calendar, the project management system used in your company, etc. We will skip the service implementation, and assume only that we can call a service with a certain date, which will return a list of events. The following code example shows how to configure a handler to be invoked when the skill receives the PlannerIntent:

```java
public class PlannerIntentHandler  implements RequestHandler {

   private static final String SLOT_DAY = "day";
   private static final PlannerService plannerService = new PlannerServiceImpl();

   @Override
   public boolean canHandle(HandlerInput input) {
       return input.matches(intentName("PlannerIntent")) &&
           input.matches(slotValue(SLOT_DAY, "today")
               .or(slotValue(SLOT_DAY, "tomorrow")));
   }

   @Override
   public Optional<Response> handle(HandlerInput input) {
       String speechText = "Something went wrong";
       Intent intent = ((IntentRequest)input.getRequestEnvelope()
           .getRequest()).getIntent();
       if(intent.getSlots() != null) {
           Slot day = intent.getSlots().get(SLOT_DAY);
           Date date = new Date();
           if(day.getValue().equals("tomorrow")) {
               date = new Date(date.getTime() + TimeUnit.DAYS.toMillis(1));
           }
           List<String> tasks = plannerService.getTasks(date);
           speechText = String.format("Your tasks on %s are : %s",
               day.getValue(), String.join(", ", tasks));
       }
       return input.getResponseBuilder()
               .withSpeech(speechText)
               .withSimpleCard("PlannerIntent", speechText)
               .build();
   }
}
```

The handler's canHandle method defines whether the incoming request is an IntentRequest, and returns true if the intent name is PlannerIntent. A list of tasks is then generated and returned. Then we need to implement SkillStreamHandler. The stream handler is the entry point for your AWS Lambda function. The following stream handler extends the SDK SkillStreamHandler class provided in the SDK, which routes all inbound requests to our skill. The PlannerStreamHandler builds an SDK Skill instance configured with the request handlers created recently. The PlannerStreamHandler includes the standard intents such as CancelIntent, SessionIntent, etc. But we will not dwell on them, as they are realized in a standard way.

```java
public class PlannerStreamHandler extends SkillStreamHandler {

   private static Skill getSkill() {
       return Skills.standard()
               .addRequestHandlers(
                       new CancelandStopIntentHandler(),
                       new PlannerIntentHandler(),
                       new LaunchRequestHandler(),
                       new SessionEndedRequestHandler(),
                       new FallbackIntentHandler())
               //.withSkillId("your skill id here")
               .build();
   }

   public PlannerStreamHandler() {
       super(getSkill());
   }

}
```

Having the skill code ready, we can build our skill project. To prepare it for upload to AWS Lambda, we'll need to create a JAR file containing the code with all the necessary dependencies. Created JAR file needs to be deployed on Amazon. Using the [AWS Console](http://console.aws.amazon.com/console/home), you need to choose adding Lambda, and then configure it according to the following steps: set the name, add a trigger (set up Alexa Skill Кit as a trigger), select runtime as Java 8, download JAR file, set up the role lambda_basic_execution, increase the timeout if you need to install the Handler (in our case it is PlannerStreamHandler), copy the ARN (in the upper right corner), which will be specified later when you add the Alexa skill. Below you can see a screenshot of how it looks in the AWS Management Console.

[![AWS Lambda setup](https://issart.com/blog/wp-content/uploads/2018/08/lambda-300x136.png)](https://issart.com/blog/wp-content/uploads/2018/08/lambda.png)

**Alexa Skill Setup**

Having the skill code uploaded to AWS Lambda, we can configure the skill with Alexa. First, we should navigate to the [Alexa Skills Kit Developer Console](https://developer.amazon.com/edw/home.html/) and create a skill by clicking "Create Skill" button in the upper right corner. Set "Planner" as our skill's name. On the next page, we need to select "Custom" and click "Create skill". Excellent, we have just created a new skill. Then we need to configure the skill. Let's see it in the more details.

Now can proceed with defining the interaction model for the skill. Under "Invocation" tab (which is on the left side), define your Skill Invocation Name to be "planner". This is what is used to activate your skill. For example, you сould say: "Alexa, tell the planner to fetch tasks for today".

Now we can add some sample utterances that will be used to invoke the intent. For this example, we've provided the following sample utterances with slots:

- fetch tasks for {day}
- get tasks for {day}
- say tasks for {day}
- fetch my tasks for {day}
- get my tasks for {day}
- say my tasks for {day}

The {day} is slot. We can use the slot in the Lambda function to get a specified value of the slot. We can set up the type of the slot. It can be a string, or a list of predefined values in this case. The skill will automatically define the slot and pass it to our Lambda function. We also need to add a new slot type which we will use for the slot – LIST_DAYS.

[![Setup intent](https://issart.com/blog/wp-content/uploads/2018/08/intent-300x138.png)](https://issart.com/blog/wp-content/uploads/2018/08/intent.png)

Then we need to set up how we will host our skill's service endpoint. Go to the Endpoint section, and choose the AWS Lambda ARN. Another option is HTTPS. You are able to host your endpoint using an HTTPS web service that you manage. OK, we will choose AWS Lambda ARN, and paste our ARN that we copied before. Also, we can take our skill ID here to configure our Lambda's trigger configuration. That's all! We've just added a new skill to our Alexa. Let's try testing it.

**Testing Alexa Custom Skill**

On the Test tab of the Alexa developer console we can simulate requests, in text and voice form, to your skill. Use the invocation name along with one of the sample utterances we've just configured. For example, "Alexa, tell the planner to fetch my tasks for today" should result in our skill responding with a list of the tasks.

**Conclusion**

Of course, in the future it would be great to teach Alexa to move tasks to another day, cancel meetings or mark events as completed. Expanding the logic of the Lambda function, we can teach Alexa to perform all those. It would also be nice to teach Alexa to make a coffee (a latte today, and a cappuccino tomorrow – depending on our mood), while we are taking a shower. But that's a topic for another article…