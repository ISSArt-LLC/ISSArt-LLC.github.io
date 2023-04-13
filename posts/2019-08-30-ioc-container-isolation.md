---
id: 3481
title: 'IoC container isolation'
date: '2019-08-30T11:01:10+08:00'
author: 'Irina Kolesnikova'
layout: post
image: /static/img/2019/08/zan-ilic-BTzLUhq4z0U-unsplash.jpg
categories:
    - 'Web Development'
tags:
    - 'ioc spring javaee jaxrs'
---

Sometimes developers discuss which framework or library is better. It depends on the performance, usability, flexibility or just a taste. Likely, my opinion won’t be new<u>,</u> however, I think that with the help of modern technologies it is always possible to write clean and beautiful code.

It doesn’t depend on the library or framework, there aren’t any perfect solutions, everything has advantages and disadvantages, however any widely used technologies allow to achieve a good result.

The most difficult thing in the code design is the maintenance of dependencies. You should consider dependencies of classes, third party components, libraries, etc.

The isolation of dependencies is usually a philosophical task. F. e. in C++ is quite standard practice to implement your own string class to decorate all possible existing variations. At the same time it is pretty strange to wrap *java.lang* package classes with a custom decorator. However, *java.util* package isn’t so reliable because everybody remembers *java.util.Date*.

Or, for example *javax.inject* package. According to the specifications it represents the reference of implementation for the IoC container. The theory is perfect. You use the abstract module and rely on it in the code and it should be compatible with any IoC implementation for this module.

Practical things are more difficult, IoC container change is usually dangerous. Although the integration between the different IoC containers is possible, you have more than one at runtime and one of them delegates some executions to another, such solution looks inefficient and ugly.
However, sometimes only this solution works.

Well, you can rely on enterprise integration patterns in the microservice system to avoid the code level integration, but sometimes the best or the only possible solution from the side of performance, architecture, workflow etc. is the code sharing. And you have to extract a piece of code in one place to reuse somewhere else. And you face the IoC container dependency with inseparable *@Inject,* *@Named, @Autowired* etc.

Let’s try investigating the best IoC container integration and resolve or avoid the problem above.

## IoC container role

Firstly, *what is the principal role of IoC container?* Specification says that a bean is provided by the container with the following capabilities:

- transparent creation and destruction and scoping to a particular context, specified in Scopes and contexts and Lifecycle of contextual instances,
- scoped resolution by bean type and qualifier annotation type when injected into a Java-based client, as defined by Typesafe resolution,
- life cycle callbacks and automatic injection of other bean instances, specified in Programming model and Dependency injection and lookup,
- method interception, callback interception, and decoration, as defined in Interceptor bindings and Decorators, and
- event notification, as defined in Events.

However, almost all these details are related to [JavaEE](https://www.oracle.com/technetwork/java/javaee/overview/index.html) only and if we simplify this part we can say ***the IoC container is responsible for the object life cycle at runtime.***

Therefore, we can try answering another question:
*Is it reasonable to maintain objects outside of IoC container?*

```
User userModel = ImmutableUser.builder()
    .with...(…)
    …
    .build();

```

We use builder pattern here to construct an object, and if you follow more functional or eventual code style it won’t be strange to delegate such executions to IoC container, however it isn’t mandatory and is absolutely fine to instantiate such objects outside of IoC container.
Another case if you imply the long live time of this object or its availability from unrelated code places, threads, etc. In this case you can think about wrapping this execution with IoC container.

However, you still have the builder pattern implemented here. And the builder is still responsible to call the *User* constructor.

```
public class JwtParser {
    private static final ObjectMapper mapper = new ObjectMapper();
 
    public JwtParser() {}
    ...
    public Session parse(String token) {
        String decriptedClaims = … //extract from token
        return mapper.readObject(token, Session.class);
    }
}
```

This is absolutely different case, and the main question I have for this code:
Whether the *JwtParser* class need to know about *ObjectMapper* maintenance?

If it was the application entry point I wouldn’t mind creating some objects there, because it would be a reasonable place to do it.
Or if it was any **creational design patterns** (buider, factory etc) it would be the fine place to call the constructor.
But this class already has the responsibility to parse tokens, if we make it responsible for *ObejctMapper* instantiation **we’ll break the single responsibility principal**.

And from the practical side if you have IoC container at runtime such decision can have quite negative impact.
F.e it is possible that you won’t be able to use IoC container to maintain these *ObjectMapper* objects anymore, because your object is outside of IoC container scope and it just won’t know how to maintain your manually created object.

***So the correct design is***:

```
public class JwtParser {
    private final ObjectMapper mapper;

    public JwtParser(ObjectMapper mapper) {
        this.mapper = Objects.requireNonNull(mapper);
    }
    ...
    public Session parse(String token) {
        String decriptedClaims = … //extract from token
        return mapper.readObject(token, Session.class);
    }
}
```

*JwtParser* object depends on *ObjectMapper* object, but **isn’t responsible for it**.

## Injections classification

After we defined the dependencies *how can we maintain it with IoC container*?
The specification says that the container injects references to contextual instances to the following kinds of injection point:

- Any injected field of a bean class
- Any parameter of a bean constructor, bean initializer method, producer method or disposer method
- Any parameter of an observer method, except for the event parameter

***However, I would prefer the following classification:***

- field based
- accessors based
- constructor based
- based on any personal IoC container feature, i.e. factory, provider, disposer, etc

It often happens that the specification gets behind the real world and introduces some standards after vendors have already implemented these usable features. It results in many incompatibilities between standards and real implementations.
Thus, if you want the complete and latest implemented specification, you have to use [JavaEE stack](https://www.oracle.com/technetwork/java/javaee/overview/compatibility-jsp-136984.html).

With other IoC containers you will be lucky if you have *javax.inject* package supported.
Or you decide to reject standards and use the [S*pring* ](https://spring.io/)[*Framework*](https://spring.io/) which doesn’t rely on “standard” interfaces.

However, I would say that any IoC container provides 4 ways to maintain objects and if it doesn’t support standard specifications it is not a big problem.
You should just isolate the IoC container dependency from your code.

## IoC container isolation

Why is the isolation necessary?
According to my experience there are 3 main causes to do this.

##### 1) [JSR 365](https://jcp.org/en/jsr/detail?id=365) (Chapter 5. Dependency injection and lookup) (older version [JSR-330](https://jcp.org/en/jsr/detail?id=330)) vs [JSR 370](https://jcp.org/en/jsr/detail?id=370) (11.2.3 Context and Dependency injection and 11.2.8 Additional Requirements)

11.2.3:
In the product that supports CDI, implementations MUST support the use of CDI-style Beans as root resource classes, providers and *Application* subclasses. **Providers and Application subclasses MUST be singletons or use application scope** (JAX-RS providers are *ExceptionMapper, ContainerRequest/ResponseFilter, MessageBodyReader/Writer* etc).

11.2.8:

- Field and property injection of JAX-RS resources MUST be performed in priority to the container invoking any *@PostConstruct* annotated method.
**Support for constructor injection of JAX-RS resources is OPTIONAL**. Portable applications MUST use fields or bean properties instead in conjunction with a @PostConstruct annotated method. Implementations SHOULD warn users about the use of non-portable constructor injection.
**Implementations MUST NOT require the use of @Inject or @Resource to trigger the injection of JAX-RS annotated fields or properties**. Implementations MAY support such usage but SHOULD warn users about non-portability.

Both of these additional requirements sometimes result in following code:

```
import javax.ws.rs.core.Configuration;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Application;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.ext.Provider;
```

```
@Provider
public class ProxyFilter implements ContainerRequestFilter {
 @Context
 private Configuration config;

 @Context
 private Application app;
...
}

```

***Do you know how the dependencies injection works here?*** The specification implies that it depends on the real implementations of JAX-RS framework and IoC container.

Another example:

```
public @interface Logged {
...
}

import javax.ws.rs.container.ContainerRequestFilter;

public class LoggingFilter implements ContainerRequestFilter {

    public LoggingFilter() {}
    ...

}

```

```
import javax.inject.Inject;
import javax.ws.rs.container.DynamicFeature;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.FeatureContext;
import javax.ws.rs.ext.Provider;
```

```
@Provider
public class LoggingFeature implements DynamicFeature {
    @Inject
    private LoggingFilter filter;

    @Override
    public void configure(ResourceInfo resourceInfo, FeatureContext context) {
        if (resourceInfo.getResourceMethod().getAnnotation(Logged.class) != null
         || resourceInfo.getResourceClass().getAnnotation(Logged.class) != null
        ) {
            context.register(filter);
        }
    }
}

```

**Is it possible to inject the LoggingFilter through the LoggingFeature constructor**<span><span style="font-family: 'DejaVu Sans Mono', serif;"><span style="font-size: small;">**?** </span></span></span><span>The answer is the same, it depends on the combination of JAX-RS and IoC container implementations you have at runtime.
The common interface doesn’t guarantee the same behavior. </span><span>However</span><span> there</span><span> are some ways to avoid the incompatibility for any combinations.</span>

**<span>Turn off jax-rs autoscan and declare all jax-rs components manually</span>**

<span>Example:</span>

```
<span>
import javax.ws.rs.core.Application;
public class MyApplication extends Application {</span>
    ...
    public Set<Object> getSingletons() {
        ...
    }
<span>}
</span>
```

<span>in the above method you can declare all jax-rs components which you won’t initialize without full-arg constructor.
You can initialize and use the IoC container directly here:</span>

```
<span>
public class MyApplication extends Application </span><span>{
</span>    private final Injector injector = Guice.createInjector(...guice modules...);
    ...
    public Set<Object> getSingletons() {
        MyJaxrsObject value = injector.getInstance(MyJaxrsObject.class);
        Feature guiceFeature = new GuiceFeature(injector);
        ...
        return ...
        //return set of initialized objects including guiceFeature and MyJaxrsObject
    }
<span>}</span>
```

<span>The *Feature* is the jax-rs provider and this example is [guice](https://github.com/google/guice) and [jersey2](https://jersey.github.io/) integration.
Similar example for [dropwizard](https://www.dropwizard.io/1.3.14/docs/), although it already has the work around the jersey2 ServiceLocator. I also advice you to register jax-rs components manually. F.e</span>

```
public class MyApplication extends Application<MyConfiguration> {
    ...
    private MyComponent daggerRootComponent;

    public static void main(final String[] args) throws Exception {
        new MyApplication.run(args);
    }
    ...

    @Override
    public void run(MyConfiguration configuration, Environment environment) {
        daggerRootComponent = MyComponent.builder()
        ...
        .build();

        JerseyEnvironment jersey = environment.jersey();
        ...
        jersey.register(new WebApplicationExceptionMapper(daggerRootComponent.dependencyForWebappExceptionMapper())); 
        ...
    }
}
```

<span>In this example I used [dagger](https://github.com/google/dagger) IoC container. MyComponent is dagger-generated class which provides access to the maintenance of declared objects.</span><span> However you can’t always use such solution, especially if you already used jax-rs autoscan widely.</span>

<span>Thus **you can use** </span>***<span><span style="font-family: 'DejaVu Sans Mono', serif;"><span style="font-size: small;">javax.inject.Provider</span></span></span>***

```
import javax.ws.rs.ext.Provider;
import javax.ws.rs.container.DynamicFeature;

@Provider
public class AuthorizationResteasyFeature implements DynamicFeature {
    @Inject
    private javax.inject.Provider<AuthorizationFilter> provider;

    @Override
    public void configure(ResourceInfo resourceInfo, FeatureContext context) {
        if ((resourceInfo.getResourceMethod().getAnnotation(Authorized.class) != null
            || resourceInfo.getResourceClass().getAnnotation(Authorized.class) != null
        )) {
            context.register(provider.get());
        }
    }
}

import javax.enterprise.inject.Produces;

public class JavaEEIoCProviders {

    @Produces
    public AuthorizationFilter authFilter(…) {
        ...
    }
}

```

##### 2) Spring framework

It doesn’t depend on JSR specifications, so it is unified and all its components are integrated transparently. However, if you don’t isolate your code from spring, you won’t be able to reuse it in the alternative stack (and vice versa).

From another side, if you have the clean business logic, which doesn’t depend on standards and frameworks, the integration with spring is pretty easy, you should just write decorators.

Example:

```
com.my.app module

public interface MediaService {
   ...
   void delete(String id);
}

com.my.app.rest module

@RequestController
@RequestMapping("api/media")
public class MediaController {

    private final MediaService media;

    @Autowired
    public MediaController(MediaService media) {
        this.media = media;
    }
    ...
 
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") String id) {
        media.delete(id);
    }
}

com.my.app.spring.ioc module

@Configuration
public class ServiceProvider {
    ...
    @Bean
    MediaService medaiService(... implementation constructor args ...) {
       return new MediaServiceImpl(...args...);
    }
}
```

You can put its implementation to the separate module if you imply the variation for the *MediaService* (variation is not like mock for unit tests), f.e.

```
<span><span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">com.my.app.impl module public class MediaServiceImpl implements MediaService { ... <span><span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">}</span></span></span></span></span></span>
```

Or *MediaService* can be just a class, it depends on the concrete logic. F.e *MediaService* is organized as the virtual file system with the remote cloud storage. Thus objects removing is actually 2 operations – virtual record erasing and real binary content deletion. So it can look like this:

```
<span><span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">public class MediaService {</span></span></span>

<span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">    private final MetadataRepository metadata;</span></span>
<span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">    private final ContentRepository contents;</span></span>
<span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">    public MediaService(MetadataRepository metadata, ContentRepository contents) {
</span></span>        ...
<span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">    }
</span></span><span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">    public void delete(String id) {
</span></span><span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">        Metadata deleted = metadata.delete(id);
        contents.delete(deleted.contentId());
</span></span><span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">    }</span></span>
<span><span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">}</span></span></span>
```

Or if you don’t want to expose the virtual record and the binary content relation it should look like this:

```
<span><span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">public class MediaService {</span></span></span>

<span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">    private final MetadataRepository metadata;
    private final ContentRepository contents;
</span></span>
<span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">    public MediaService(MetadataRepository metadata, ContentRepository contents) {
</span></span>        ...
<span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">    }
</span></span><span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">
    public void delete(String id) {
</span></span><span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">        metadata.delete(id);
        contents.delete(id);</span></span>
<span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">    }</span></span>
<span><span style="font-family: 'DejaVu Sans Mono', monospace;"><span style="font-size: medium;">}</span></span></span>
```

It isn’t very important now, but you see that the business logic is clean, it doesn’t depend on the spring. You achieve the integration with the decorators, which you can put into the separate module and your business logic is portable to any alternative stack.

##### 3) Jersey2 and its own IoC container hk2

Even if you integrate your IoC container with jersey2 you still have 2 IoC containers at runtime. You can work around this turning off autoscan (as said above) or you can use [hk2 IoC container](https://javaee.github.io/hk2/).
Its API is a little bit confusing, however it is also the solution. To isolate your code from hk2 you should implement *org.glassfish.hk2.api.Factory* for each class.

It is similar to guice IoC container, where you should implement com.google.inject.Provider, f.e

```
public final class MyObjectProvider implements com.google.inject.Provider<MyObject> {

  private final MyObjectArg arg;

  @Inject
  public MyObjectProvider(MyObjectArg arg) {
    this.arg = arg;
  }

  @Override
  public MyObject get() {
    return new MyObject(arg);
  }
}
```

And register this injection point in the guice module:

```
bind(MyObject.class).toProvider(MyObjectProvider.class);
```

You can use

```
bind(...).toConstructor(...)
```

instead of providers, it makes you free of the huge amount of provider classes, however if you change the constructor signature you will receive an exception at runtime only.
In my opinion the first option is better.

Finally it is not important which technologies stack and IoC container you choose, if you isolate them you have to write IoC providers, which don’t have any common specifications. Thus the best place for them is the separated module.

Regarding the above I can say IoC providers are the code representation for beans.xml in JavaEE or Spring. If you also use some jax-rs framework it isn’t mandatory to isolate it from IoC container, but you should avoid any significant logic in jaxrs components. They should be just decorators over the business logic.

## How to isolate IoC container in the existing code?

Talking about the field, accessors and constructor based injections, you can replace them with providers without any drastic changes and store providers in the separate module. Example:

```
public class ClassA {
    @Inject
    public setFiled(ClassB field) {
    ...
    }
}
```

It isn’t important which access modificator you have for such methods. **IoC container requires these methods to be non-private and non-final**, sometimes the certain class can’t be final as well. In this case any modificators can be exposed to public with inheritance and/or package accessible classes.
So if you have to change the access modificator for the modularity you don’t spoil the code, it already has the security hole.

Thus you can remove *@Inject* here and create the provider.

F.e. in JavaEE:

```
@Produces
public ClassA provideClassA(СlassB b) {
    ClassA a = new ClassA();
    a.setField(b);
    return a;
}
```

Full-arg constructor is the easiest case:

```
public СlassA {
    private final ClassB field;

    @Inject
    public ClassA(ClassB field) {...}
}
```

Replace *@Inject* with:

```
@Produces
public ClassA provideClassA(СlassB b) {
    return new ClassA(b);
}
```

When you use the field based injection it is a little more difficult.
Depending on the class usage firstly you should move to full-arg constructor or to accessors if you have public no-arg constructor exposed outside.
Or you can leave fields injection as it is if the class is just the framework dependency decorator.
However, if you write the code from the scratch, use full-args constructors at least.

Generally IoC container isolation is a good way to control yourself. At least it requires you to use full-arg constructor only and then:

1. You won’t break the encapsulation
2. You will quickly note the interface segregation or single responsibility violation, because when you have more than 4-5 constructor parameters it is the reason to think about the class refactoring.
3. You won’t be able to introduce cyclic dependencies between the classes.
4. The lack of outside initialization makes you distribute responsibility between your classes/interfaces better.
5. It results in clean and understandable modules structure.
6. It results in more stable, reusable and verifiable code.