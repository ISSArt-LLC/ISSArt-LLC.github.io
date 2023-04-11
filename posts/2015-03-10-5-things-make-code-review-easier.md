---
id: 905
title: '5 things how to make code review easier'
date: '2015-03-10T11:59:30+08:00'
author: 'Egor Nepomnyaschih'
layout: post
image: /static/img/2015/03/human-475667_1280.jpg
categories:
    - General
---

Code review has the next main purposes:

- Improve code quality
- Share knowledge, improve skills
- Find some bugs beforehand

To achieve these goals with high efficiency in short time, I follow the next simple principles. For some readers they can appear obvious, but I hope that it still can be helpful for the others.

#### 1. Format code correctly

Code quality is not all about formatting, but formatting is still important. Bad code formatting makes code learning and management difficult to other team members, so that’s the first thing to fix. This issue occurs very often if your team includes one or more junior developers. To deal with bad code formatting, you can encourage your team to use IDE which has auto-formatting feature, use linters or develop automatic tests.

#### 2. Follow naming conventions

Any project must have its naming conventions. Naming conventions make code review easier and that’s very important. The less time you spend on code review, the more time you spend on more important activities.

#### 3. Develop code

If you are a team leader, your main role on a project is to design architecture and review code. But you won’t be able to do it efficiently if you don’t develop code by yourself. Devote at least 40% of your project time on code development. If you don’t develop code, you will very quickly lose track of what is going on. There’s a class of mistakes which is very difficult to recognize during pure code review – you can do it only if the problem bubbles up when you develop code by yourself. Also, code development aids you to generate ideas for refactoring or architecture improvement.

#### 4. Hunt on memory/performance leaks

If a developer hasn’t noticed a memory or performance leak, tester won’t be able to just catch it. But if the problem bubbles up in a highly loaded production environment, it will be difficult to debug. You should look for inefficient algorithms and uncleared object references during code review to fix the issue in advance.

#### 5. Comment on unclear code

If you discuss a suspicious portion of code with its author and it turns out to be correct, it usually means that this code lacks comments. Comment on this code and explain why this code should be written this exact way and can not be simplified. Later, when any team member is working with this code, they’ll instantly understand why it looks so weird. An example:

```
# Originally, image transformation scaling determines
# a number of inches in a pixel in API (weird!).
# But we need to determine a number of inches in
# the entire image instead.
transformation = image.transformation *
	Geom::Transformation.scaling(
		image.pixelwidth, image.pixelheight, 1);
```

Here, the code looks really weird, but the comment explains a bug in API which makes this code neccessary.

Another example:

```
public static Vector2d GetMetersPerDegree (double latitude)
{
	// from http://msi.nga.mil/MSISiteContent/...
	// ...StaticFiles/Calculators/degree.html
	const double m1 = 111132.92;
	const double m2 = -559.82;
	const double m3 = 1.175;
	const double m4 = -0.0023;
	const double p1 = 111412.84;
	const double p2 = -93.5;
	const double p3 = 0.118;

	var lat = Math.PI * latitude / 180.0;
	return new Vector2d (
		(p1 * Math.Cos(lat)) +
		(p2 * Math.Cos(3 * lat)) +
		(p3 * Math.Cos(5 * lat)),
		m1 + (m2 * Math.Cos(2 * lat)) +
		(m3 * Math.Cos(4 * lat)) +
		(m4 * Math.Cos(6 * lat)));
}
```

Here, we see 7 unnamed constants and a weird formula which magically gets a thing done. How in the world can a developer figure out how this towel of code works? But we see a comment which leads us to a Web site which has this formula injected in JS code, so we don’t even need to explain why it works. If it works somewhere else, then it is probably correct. And we won’t ever need to modify this code unless Earth becomes cubic one day.