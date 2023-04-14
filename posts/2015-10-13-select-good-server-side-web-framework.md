---
id: 1315
title: 'How to select a good server-side Web framework'
date: '2015-10-13T12:05:32+08:00'
author: 'Egor Nepomnyaschih'
layout: post
image: /static/img/2015/09/Для-статьи-How-to-select-a-good-server-side-Web-framework.jpg
categories:
    - General
    - 'Web Development'
---

In the [previous article](https://www.issart.com/blog/request-scoped-resources-with-guice-and-servlet/) I mentioned that we've decided to use [Jetty](http://www.eclipse.org/jetty/)+[Guice](https://github.com/google/guice/wiki/Motivation)+Servlet combination in our Java Web application. What was it motivated for? Why have we refused to use [Jersey](https://jersey.java.net/)? Why have we decided to implement a separate Resource class for every Web action and even for every HTTP method?

When everyone of us selects a tool to work with, we all set some requirements to it, and it should meet all requirements to get a green light. Everyone knows them – these are such obvious things as code readability, ease of debugging/testing, following traditional coding practices (OOD, patterns) etc. But today I'll tell you what requirements I set specifically for a good server-side Web framework. I'll be happy to work with any technology stack meeting these key requirements, and Jetty+Guice+Servlet is just one of the options.

Briefly, the requirements are:

1. Extensibility
2. Common response format
3. Automatic exception handling
4. Transactionality of a request

And let me explain you what do I mean by this.

#### 1. Extensibility

Assume you have an HTTP handler to retrieve user's email list. I'll use pseudo code. Error handling and other supplying code is thrown away to keep things simple.

```java

final Response getAccountEmails(Request request) {
    String ticket = request.getCookie("ticket");
    Session session = SessionService.getSession(ticket);
    Account account = AccountService.getAccount(session.getAccountId());
    List<email> emails = EmailService.getEmails(account);
    return new Response(JsonUtils.success(emails));
}
</email>
```

Just to clarify, in this snippet, JsonUtils.success builds the next JSON object:

```json

{
    "success": true,
    "result": [
        // ... here go emails
    ]
}
```

At some point, I've noticed that authentication logic and response formatting code should be copied to other handler methods over and over again. I've decided to extract all this duplicating burden to some kind of utility. In a dream World, final handler implementation should look like this:

```java

final Object getAccountEmails(Request request, Account account) {
    return EmailService.getEmails(account);
}
```

I'll explain you how it can be achieved a little bit later.

Here's a list of extensions I wanted to use in my application:

- Authenticated resource
- Administrative resource
- Company-specific resource

#### 2. Common response format

Applying a common response format (e.g. JSON) should be easy. We want to do this without much code duplication. I want to return an arbitrary object ignoring all JSON conversion burden – Web framework must do it for me. Of course, I should be able to override response formats for specific resources.

#### 3. Automatic exception handling

If resource throws an exception, Web framework must catch it and handle appropriately. If this is an unexpected exception (null reference exception or something like this), framework must log the stack trace to a file and return the next JSON object in response:

```json

{
    "success": false,
    "error": "InternalError"
}
```

If this is some expected exception, I should be able to specify the data to deliver in output:

```json

{
    "success": false,
    "error": "Invalid spreadsheet",
    "row": 15,
    "col": "C"
}
```

This allows JS to display a user-friendly error message like "Spreadsheet is invalid: error at row 15, column C".

As an option, we can define an "expected exception" class for a framework to handle it in a special way:

```java

public class WebException extends Exception {
  
    public WebException() {
        this(null);
    }
  
    public WebException(String message) {
        this(message, null);
    }
  
    public WebException(Throwable cause) {
        this(null, cause);
    }
  
    public WebException(String message, Throwable cause) {
        super(message, cause);
    }
  
    // override this method to extend the output
    public Map<string object=""> toJson() {
        Map<string object=""> json = new HashMap();
        json.put("error", getType());
        return json;
    }
  
    protected String getType() {
        return getClass().getName();
    }
}
</string></string>
```

#### 4. Transactionality of a request

Each request should be handled in scope of database transaction. So, if handling fails, all modifications should be reverted back automatically. Of course, this approach has its downsides, but I think that its advantages beat the downsides, so I prefer to stick to it.

```java

final void createCompany(Request request) {
    String companyName = request.getParam("companyname");
    // create a company record in database
    Company company = CompanyService.createCompany(companyName);
    String adminAccountName = request.getParam("adminaccountname");
    // create account - it may throw an "already exists" exception
    Account admin = AccountService.createAccount(adminAccountName);
    CompanyService.addAdmin(company, admin);
}
```

If account creation fails, a company record should be reverted.

#### Solutions

There are three common approaches that let you involve such features in a Web framework unless it supports them out of the box. I call them Filter, Decorator and Template Method.

##### Filter

To add some features, you inject your code to some particular places. Schematically, it can be represented with the next code:

```java

public Response handleRequest(Request request) {
    invokeRequestFilters(request);
    Response response = invokeHandler(request);
    invokeResponseFilters(request, response);
    return response;
}
```

In this approach, handler is a method and it is invoked somewhere inside invokeHandler. Let me demonstrate you how it looks in [Jersey](https://jersey.java.net/). Assume you have the next resource class:

```java

@Path("/account")
@RequestScoped
public class AccountResource {
  
    @GET
    @Path("/emaillist")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getAccountEmails(@CookieParam("ticket") String ticket) {
        Session session = SessionService.getSession(ticket);
        Account account = AccountService.getAccount(session.getAccountId());
        List<email> emails = EmailService.getEmails(account);
        return Response.ok(JsonUtils.success(emails)).build();
    }
}

```

To extract common logic, you should register a request filter and a response filter.

```java

@Authenticated
public class AuthenticatedRequestFilter implements ContainerRequestFilter {
  
    @Override
    public void filter(ContainerRequestContext requestContext)
            throws IOException {
        String ticket = requestContext.getCookies().get("ticket").getValue();
        Session session = SessionService.getSession(ticket);
        Account account = AccountService.getAccount(session.getAccountId());
        requestContext.setProperty("account", account);
    }
}

@Json
public class JsonResponseFilter implements ContainerResponseFilter {
  
    @Override
    public void filter(ContainerRequestContext requestContext,
            ContainerResponseContext responseContext) {
        responseContext.setEntity(
                JsonUtils.success(responseContext.getEntity()));
    }
}

@Path("/account")
@RequestScoped
public class AccountResource {
  
    @GET
    @Path("/emaillist")
    @Produces({MediaType.APPLICATION_JSON})
    @Authenticated
    @Json
    public Response getAccountEmails(@ContextParam Account account) {
        List<email> emails = EmailService.getEmails(account);
        return Response.ok(emails).build();
    }
}

```

I never compiled this code but I hope you got the idea. For exact Jersey syntax see [documentation](https://jersey.java.net/documentation/latest/filters-and-interceptors.html).

##### Decorator

In contrast to Filter, Decorator allows you to decide where you want to invoke a handler method. You implement a handler method which wraps some abstract method inside it.

```java

public Response handleRequest(Request request, Callback callback) {
    // any code which calls 'callback' inside
}
```

where callback is an arbitrary command. For example, in Jersey, we can do something like this:

```java

public interface AuthenticatedResourceCallback {
  
    Response call();
}

public abstract class AuthenticatedResource {
  
    private String ticket;
  
    @CookieParam("ticket")
    public void setCookieTicket(String value) {
        ticket = value;
    }
  
    private Account account;
  
    protected Account getAccount() {
        return account;
    }
  
    protected Response authenticated(AuthenticatedResourceCallback callback) {
        Session session = SessionService.getSession(ticket);
        account = AccountService.getAccount(session.getAccountId());
        return callback.call();
    }
}
```

As of now, we can inherit a final resource from AuthenticatedResource and utilize "authenticated" method.

```java

@Path("/account")
@RequestScoped
public class AccountResource extends AuthenticatedResource {
  
    @GET
    @Path("/emaillist")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getAccountEmails() {
        return authenticated(new AuthenticatedResourceCallback() {
          
            @Override
            public Response call() {
                List<email> emails = EmailService.getEmails(getAccount());
                return Response.ok(emails).build();
            }
        });
    }
}
```

With Scala, I've managed to simplify syntax quite a bit:

```java

@Path("/account")
@RequestScoped
class AccountResource extends AuthenticatedResource {
  
    @GET
    @Path("/emaillist")
    @Produces({MediaType.APPLICATION_JSON})
    def getAccountEmails: Response = authenticated {
        val emails = EmailService.getEmails // account is passed implicitly
        Response.ok(emails).build()
    }
}
```

Ain't Scala cool? But, unfortunately, our customer doesn't want to use Scala at the project, and syntax of Java 8 is just not at the same level, so, with Jersey, the quality of resulting code wasn't good enough for us.

##### Template method

Let's forget about Jersey constraints and look at the previous code from another side. What if we create a separate class for every HTTP handler and use OOD approach to get things done?

```java

@RequestScoped
public abstract class Resource {
  
    @Inject protected HttpServletRequest request;
    @Inject protected HttpServletResponse response;
    @Inject @RequestParameters protected Map<String, String[]> params;
  
    public abstract void process() throws ServletException, IOException;
}

public abstract class AuthenticatedResource extends Resource {
  
    private Account account;
  
    @Override
    public final void process() throws ServletException, IOException {
        String ticket = params.get("ticket")[0].value();
        Session session = SessionService.getSession(ticket);
        account = AccountService.getAccount(session.getAccountId());
        processAuthenticated();
    }
  
    protected abstract void processAuthenticated()
            throws ServletException, IOException;
  
    protected Account getAccount() {
        return account;
    }
}

public class AccountResource extends AuthenticatedResource {
  
    @Override
    protected void processAuthenticated()
            throws ServletException, IOException {
        List<email> emails = EmailService.getEmails(getAccount());
        response.getWriter().print(JsonUtils.toJson(emails));
    }
}
```

Looks more intuitive, doesn't it?

##### Which pattern is better?

So, what is better: Filter, Decorator or Template Method? I'm convinced that Decorator and Template Method are much better than Filter because they don't constrain you as much. You are free to add as many abstract/callback methods as you want, modify their semantics, and call them at any step of the algorithm. You would never be able to do anything like this with Filters:

```java

public abstract class JsonResource extends Resource {
  
    private static final Logger log =
            LoggerFactory.getLogger(WebResourceTransaction.class);
  
    @Inject private ObjectMapper objectMapper = null;
  
    @Override
    public final void process() throws ServletException, IOException {
        Transaction tx = DB.startTransaction();
        Map<String, Object> json;
        try {
            Object result = processJson();
            tx.commit();
            json = new HashMap();
            json.put("success", true);
            json.put("result", result);
        } catch (WebException e) {
            tx.rollback();
            json = e.toJson();
            json.put("success", false);
        } catch (Throwable e) {
            tx.rollback();
            log.error(e.getMessage(), e);
            json = new HashMap();
            json.put("success", false);
            json.put("error", "InternalError");
        }
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");
        response.getWriter().print(objectMapper.writeValueAsString(json));
    }
  
    protected abstract Object processJson() throws WebException;
}
```

If you are free to use Scala or another functional programming language, Decorator should be a viable option. But if syntax of programming language you use makes Decorator ugly, please use Template Method.

As I mentioned before, Jersey doesn't have good capabilities to decorate your HTTP handlers. It supports filters only. This was one of the reasons why we've decided to select another framework.

**We want your feedback.**

What requirements do you set for a server-side Web framework? Do you know any other technology stacks (except Jetty+Guice+Servlet) meeting requirements that I mentioned in this article?