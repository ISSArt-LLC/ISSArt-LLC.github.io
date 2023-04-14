---
id: 1283
title: 'Request-scoped resources with Guice and Servlet'
date: '2015-10-06T13:44:39+08:00'
author: 'Egor Nepomnyaschih'
layout: post
image: /static/img/2018/12/ai-artificial-intelligence-code-34676.jpg
categories:
    - 'Web Development'
---

Our team was looking for a very simple [Java](https://www.issart.com/en/lp/java-development-team/) Web framework for one of our projects, and we found the next combination of tools very fascinating:

- [Eclipse Jetty](http://www.eclipse.org/jetty/) Web server for HTTP request interception
- [Google Guice](https://github.com/google/guice/wiki/Motivation) for dependency injection
- Java Servlet for request handling

They work together pretty well, and there is a [plenty](http://stackoverflow.com/questions/15232279/using-guice-servlet-with-jetty-to-map-paths-to-servlets-without-using-a-web-xml) [of](http://blog.timmattison.com/archives/2014/09/02/full-example-code-showing-how-to-use-guice-and-jetty/) [articles](https://github.com/google/guice/wiki/ServletModule) on the Internet covering this topic, so it is easy to get things started. But none of these articles explains how to scope your code in a single HTTP request. By design, servlet is always a singleton. Guice refuses to register servlets as request-scoped objects, so, the whole point of request-scoped object instantiation is being lost. Due to this issue, we've almost decided to abandon an idea of using low-level servlets and switch to [Jersey](https://jersey.java.net/) framework, which wasn't very attractive for us as well, for different reasons. But a deeper look to Guice API has saved my day.

Just to clear things out, we've defined a dream class of HTTP resource that we wanted to work with and that we wanted to inherit other resources from.

```java

package com.myapp.servlet.resource;

import com.google.inject.Inject;
import com.google.inject.servlet.RequestParameters;
import com.google.inject.servlet.RequestScoped;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@RequestScoped
public abstract class Resource {

    @Inject protected HttpServletRequest request;
    @Inject protected HttpServletResponse response;
    @Inject @RequestParameters protected Map<String, String[]> params;

    public abstract void process() throws ServletException, IOException;
}
```

Granularity is the key. One Resource instance is created and called to process a single request regardless of HTTP method. The resource is request scoped.

Sample resource class.

```java

package com.cassantec.frontend.servlet.resource;

import com.cassantec.frontend.servlet.exception.InvalidRequestException;
import com.cassantec.frontend.servlet.exception.WebException;

public class InvalidRequestResource extends Resource {

    @Override
    public void process() {
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");
        response.getWriter().print("Invalid request!");
    }
}
```

We're going to use this InvalidRequestResource as a default resource for all requests which don't match any routes.

Now we need to somehow make this work. Here's a universal class of servlet that allows you to register such request-scoped resources in your Guice module with ease.

```java

package com.myapp.servlet;

import com.myapp.servlet.resource.InvalidRequestResource;
import com.myapp.servlet.resource.Resource;
import com.google.inject.Inject;
import com.google.inject.Injector;
import com.google.inject.Singleton;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Singleton
public class ScopedServlet extends HttpServlet {

    private Class<? extends Resource> getResource;
    private Class<? extends Resource> postResource;
    @Inject private Injector injector = null;

    public ScopedServlet(Class<? extends Resource> getResource,
            Class<? extends Resource> postResource) {
        this.getResource = (getResource != null)
                ? getResource : InvalidRequestResource.class;
        this.postResource = (postResource != null)
                ? postResource : InvalidRequestResource.class;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        invoke(getResource);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        invoke(postResource);
    }

    private void invoke(Class<? extends Resource> resourceClass)
            throws ServletException, IOException {
        injector.getInstance(resourceClass).process();
    }
}
```

In this snippet Guice magic happens: **it turns out that Guice Injector registers itself as an injectable singleton object!** To be honest, I was very surprised (in a good way) when I realized that it works this way. And even more wonderful: **you don't need to have an appropriate binding in the injector to instantiate objects of arbitrary class.** Guice is quite smart, man! As a result, we were able to use the injector to instantiate request-scoped resources and process them inside the servlet.

So, ScopedServlet's constructor takes two arguments: a resource class to process GET requests, and a resource class to process POST requests. To make this work, we must use instance bindings.

```java

package com.myapp.servlet;

import com.myapp.account.AccountResource;
import com.myapp.company.CompanyResource;
import com.google.inject.servlet.ServletModule;

public class FrontendServletModule extends ServletModule {

    @Override
    protected void configureServlets() {
        serve("/account").with(
                new ScopedServlet(AccountResource.class, null));
        serve("/company").with(
                new ScopedServlet(CompanyResource.class, null));
        serve("/*").with(new ScopedServlet(null, null));
    }
}
```

Here one more Guice magic happens: **it turns out that dependency injection is applied to instance bindings as well!** You are not obligated to construct all objects via injector.getInstance method to make injections happen. In fact, a special injector.injectMembers method is exposed for you to deal with this problem. Guice is quite well-thought, man!

I hope that this article covers request-scoped resources definition problem good enough. To complete this example, see [Full Example Code Showing How to Use Guice and Jetty](http://blog.timmattison.com/archives/2014/09/02/full-example-code-showing-how-to-use-guice-and-jetty/) or other related articles.

Maybe you still have some thoughts or questions left? If so, feel free to share in the comment box.