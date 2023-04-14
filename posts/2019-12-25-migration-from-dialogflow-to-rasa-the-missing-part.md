---
id: 3591
title: 'Migration From DialogFlow to RASA: the missing part'
date: '2019-12-25T14:14:58+08:00'
author: 'Alexandr Kalinin'
layout: post
image: /static/img/2019/12/austin-distel-uLnmmE8Y0E4-unsplash.jpg
categories:
    - 'Machine Learning'
---

Implementing DialogFlow chatbots is cool and convenient if you have something trivial and easy to prototype: fancy UI – easily, extracting base entities like name, surname and phone number – here is a tool if don't want to install and deploy – cloud solution is at your service.
But what if you need to go deeper:

> – Do you have a Japanese tokenizer, dear DialogFlow?
> – Nope
> – Transparent and customizable intent classification tool?
> – Sorry, guys.
> – Also I want to integrate my search index, knowledge graph and custom dialogue management policy.
> – What are you talking about?

In a nutshell if you want fully controlled system, if you need custom advanced AI in your app, if you need natural language processing in your chatbot pipelines, if you want to scale your chatbot behaviour – on-premise solution is the way for a chatbot developer. And here it's Rasa framework that really shines.

All ai chatbots developers have gladly met new update from Rasa chat bot framework – now 1.0 version is available and it's ten times cooler than it's 0.9 version ancestor. Now there is single entry point for bot and NLU modules (no need to run separate NLU process), cool CLI for managing your models and Rasa X – UI for fine-tuning your bot and training it on the fly, all the stuff is at your service. This makes moving to Rasa from other cloud-hosted solutions more attractive, Maybe it's time to migrate your DialogFlow bot to more maintainable and customizable Rasa platform.

Recently Rasa team has updated their product with migration tools that are compatible with Rasa 1.0 version. [Check out this article](https://medium.com/rasa-blog/how-to-migrate-your-existing-google-dialogflow-assistant-to-rasa-412cd07f424a). It's an official Rasa blog article, and it has very thorough description of how to move your DialogFlow agent to Rasa platform, but it lacks one issue – how to convert dialog tree into (and probably that's the most important one). Read our approach described in this article if you also feel this gap to be painful.

But first let's look at some Rasa and DF data structures and how they are related, define common terms and scope of work.

## What is dialog

![](https://www.trainingjournal.com/sites/www.trainingjournal.com/files/styles/original_-_local_copy/entityshare/222%3Fitok%3Dgz7t3A7w)

Dialog is a chain of request-response pairs expressed in natural language to lead a user from some starting point to one of ending points accompanied by some side effects like searching information in 3rd party sources, changing DB records, preparing artifacts etc. 

Transition from one state to another is governed by algorithm which detects the intent. The Intent is a user message category which is derived from user text input. This implies that user wants some action from a bot and expresses it implicitly with natural language phrase. Bot's task is to decide which category should be assigned to a given natural language phrase and do some desired action.

Examples of intents can be following:

```
hi                                   - greet

hello                                - greet

bye                                  - end_conversation

goodbye                              - end_conversation

Suggest me some mexican restaurants  - restaurant_search

im looking for restaurants           - restaurant_search


```

So it's some kind of directed graph, which may include cycles – when bot didn't recognize human input correctly or intent or didn't manage to perform a side effect it can return to previous states to clarify some data issue from user's side.

Probabilistic nature of predicting the intent in Rasa makes training bot behaviour routines scalable – instead of following complex rules for bot to stick to dialogue branching, the goal transition from one step to another is calculated in terms of probability, and the most probable intent is transitioned to.

Training data for NLU is stored in nlu.json file and looks like this.

```json
{
  "rasa_nlu_data": {
   "common_examples": [
     {
       "intent": "greet",
       "text": "Hello "
     },
     {
       "intent": "inform_location",
       "text": "Show me good restraunt in Rome"
     },
     {
       "intent": "inform_people_num",
       "text": "I want a table for six people"
     },
    ...
    ]
}
```

## Rasa training data format elements

![](http://sun9-57.userapi.com/c848632/v848632814/add70/3PKMCuM5dcc.jpg)

Detection what user wants (or NLU – natural language understanding – task) is necessary but we definitely need the bot to respond and govern the flow of conversation. So we need some more stuff to resolve.

There are several things you have to know to prepare data for training your bot. And intents, that were covered above, are only a part of the inventory list in Rasa data model.

Besides intents there are also:

- actions
- stories

**Actions** (as by definition) are bot reactions to user intents. When detecting an intent bot chooses which action to apply for user's response. The action may be a simple utterance, a question for clarification of user request or a side-effect – making external API call or altering DB or whatever you need.

Intent-action mapping sequences are grouped by higher order entities called **stories**. A story is a description of user path from starting point to the end of user goal. Stories are written as plain list of steps with an intent (or several intents) mapped to one or more reactions.

Example of a story is the following:

```
## user_reccomendation_for_restraunt    <!--<i> name of the story </i>-->

* greet

   - action_ask_howcanhelp

* inform_location{"location": "rome", "price": "cheap"}  <!--<i> user utterance, in format intent{entities} </i>-->

   - action_on_it

   - action_ask_cuisine

* inform_cuisine{"cuisine": "spanish"}

   - action_ask_numpeople        

* inform_people_num{"people": "six"}

   - action_ack_dosearch

* confirm_search

   - action_do_dosearch
```

Here is name for story marked with ##. user intents marked with asterisk and corresponding actions marked with hyphens.

So the conversation here might look like the following:

```
User(U) - Hello
Bot(B) - Hello! How can I help you
U: - I woud like a cheap restraunt in Rome
B: - What kind of food would you like?
U: - Spanish cuisin.
B: - For how many people?
U: - For six people
B: - So we will search for cheap spanish restraunt in Rome for six people. Correct?
U: - Yes.
B: - Ok. Here are the suitable places: …
```

All migration stuff except this can be treated with Rasa cli commands, and it's cool, but when it comes to a question on how to migrate a tree of dialog the blog has the following answer:

> Since DialogFlow's dialogue management is a rule-based approach, you cannot export any training data which you could use directly to train the Rasa dialogue model. The good news is that you have access to conversations history on DialogFlow and you can use it as a basis for generating training data for Rasa Core model.

So the recipe is "go to your log of bot's conversations and write stories by hand". Don't give up – there is a way how automatically or semi-automatically to solve this. Let's move to …

## HOWTO

![](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Caterpillar_tree.svg/1200px-Caterpillar_tree.svg.png)

So now it's time to share on how to convert structure used by DialogFlow to structure used in Rasa

First we are going to collect intents and examples with code like this:

```python
import glob
import json
import os

# Function to convert JSON string from file to 
def convert_to_objects(filename):
   json_file = open(filename)
  examples = open(f'filename[:-4]_usersays_en.json')	
   return {**json.loads(json_file.read()), "examples":  json.loads(examples.read())}


# Get all json files
intents_path = os.path.join(os.getcwd(), 'testagent', 'intents')

#Ignore filenames for user examples 
files = set(glob.glob(f'{intents_path}/*')) - set(glob.glob(f'{intents_path}/*usersays*'))
objects = list(map(convert_to_objects, files))

```

So now we have a list of objects representing states of dialog, that can be viewed as nodes in dialog graph. Let's convert them to graph nodes where intent name will be a node identifier and all the rest will be node's metadata. We will use [networkx library](https://networkx.github.io/) to do all graph related stuff.

```python
import networkx as nx
G = nx.DiGraph()

for obj in objects:
   G.add_node(obj['name'], **obj)
```

Now our plain python objects are transformed into graph nodes. And our nodes lack connecting edges using 'affectedContexts' property as identifier for connected intent . Let's add them.

```python
for obj in objects:
   if obj['responses']:
       for r in obj['responses']:
           for ctx in r['affectedContexts']:
               out_ctx = ctx['name']
               G.add_edge(obj['name'], out_ctx)
```

Now when we have a connected graph and we can unroll it into plain list of intent steps. All we have to do is to find paths from a starter intent to termination intent. Luckily networkx has a handy method *all_simple_paths* exactly for this task:

```python
# Collect all possible paths from top to bottom
paths_list = list(nx.all_simple_paths(G, 'greet', 'bye'))

And finally all we have to do is to format the extracted path and save it in file. Each path is a story.

for i, paths in enumerate(paths_list):
   story_text = ''
   story_text += f'## story_{i}\n'

   for edge in paths:
       story_text += f'* {edge[0]} \n -  {edge[1]} \n'
   story_texts.append(story_text)

# Store the data in file
open('stories.md', 'w'').write('\n'.join(story_texts))
```

Though this approach is quite simple and doesn't extract entities, or handling fallbacks, but you can tune this to capture all this issues if you take relevant data from nodes meta-data.

## Going beyond

This approach can be extended to other sources of data. If you have any other data structures like DB dump or txt files or something else you should do the following:

- Define what can serve as categories or intent labels in your data. Create a mapping for example texts and intents labels.
- Define how the transition from one intent to another is done. Create a graph with intents transitions as edges between nodes as intents.
- Define starter intent and termination intents, iterate over all possible paths by extracting nodes metadata and writing to Rasa-consumable format.

Have you ever tried migrating anything from ai chatbots to RASA? Please share your pain and insights in comments!