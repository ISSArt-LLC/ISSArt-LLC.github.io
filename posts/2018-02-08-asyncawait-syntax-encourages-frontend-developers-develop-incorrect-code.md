---
id: 2464
title: 'async/await syntax encourages frontend developers to develop incorrect code'
date: '2018-02-08T19:24:37+08:00'
author: 'Egor Nepomnyaschih'
layout: post
image: /static/img/2018/02/IX9Z71L6PD.jpg
categories:
    - General
tags:
    - async/await
    - 'asynchronous code'
    - syntax
---

[await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) operator is an incredible new feature in ECMAScript 2017. [There](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) [are](https://ponyfoo.com/articles/understanding-javascript-async-await) [many](https://developers.google.com/web/fundamentals/primers/async-functions) [articles](https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9) [demonstrating](https://codeburst.io/javascript-es-2017-learn-async-await-by-example-48acc58bad65) how much you can benefit from it. I agree: asynchronous code was never so brief and clear as when it is written via async/await syntax.

Nevertheless, there is a significant pitfall you should be aware of while developing asynchronous front end code. Backend developers are safe: they can easily copy code from any of the articles above to their NodeJS application, and it will work just fine. Really! However, if you are going to run this code in a browser environment as is, it would be a serious mistake! None of the examples is correctly adjusted for the front end. This is a disaster: in the top 10 Google references on "async await", I failed to find any examples correctly adjusted for the front end. Junior/middle JS developers and newcomers use these examples as the basis for their work and develop incorrect code that results in unexpected bugs and performance loss all over the place.

I am here to explain you a very important rule about developing asynchronous code for front end: **you can never predict what a user is going to do at any point of time**. Let's take a look at the next code snippet taken from [just another async/await tutorial](https://javascript.info/async-await):

```js
async function showAvatar() {

  // read our JSON
  let response = await fetch('/article/promise-chaining/user.json');
  let user = await response.json();

  // read github user
  let githubResponse = await fetch(
    `https://api.github.com/users/${user.name}`);
  let githubUser = await githubResponse.json();

  // show the avatar
  let img = document.createElement('img');
  img.src = githubUser.avatar_url;
  img.className = "promise-avatar-example";
  document.body.append(img);

  return githubUser;
}

showAvatar();
```

This code involves 4 asynchronous calls followed by an image tag appended to the document body. This is a typical asynchronous function, and you are probably going to implement hundreds of similar functions for various purposes. But this code has a mistake! It does not mean that this example is worse than the other examples in the Google top 10, so I don't put the blame on the author of the tutorial. All these examples have the same mistake.

Let's suppose that this function is called when the user opens profile screen in your single-page application. Your JS router handles URL change somehow and passes control to page renderer. The renderer renders static part of the screen and initiates data loading. The function above loads part of the data. It makes sense to extract avatar loading and displaying code to a separate function, and this is exactly what this code does. So, you expect it to work like this:

[![](/static/img/2018/01/async-norm.gif)](/static/img/2018/01/async-norm.gif)

Everything goes well so far. It takes 1 or 2 seconds before the avatar is actually displayed, but we can do nothing about it, can we? The best thing we can do for the user is to load the data asynchronously so that the UI is not blocked, and the user can do something else… Wait a second! While the avatar is being loaded, the user can do anything he wants, right? So, what happens if the user switches to another route before the avatar is loaded?

[![](/static/img/2018/01/async-error.gif)](/static/img/2018/01/async-error.gif)

That's not something we expected. What are we supposed to do? Tell the user not to be a jerk? Well, we shouldn't make the user responsible for our mistakes. We can't increase loading speed either, because it is too expensive for our small project, and it doesn't depend solely on us. The only thing we can do is to improve our code to handle such use case properly. First of all, we must split the loading code and the displaying code:

```js
async function loadUser() {
  // read our JSON
  let response = await fetch('/article/promise-chaining/user.json');
  let user = await response.json();

  // read github user
  let githubResponse = await fetch(
    `https://api.github.com/users/${user.name}`);
  let githubUser = await githubResponse.json();

  return githubUser;
}

async function showAvatar() {
  let githubUser = await loadUser();

  // show the avatar
  let img = document.createElement('img');
  img.src = githubUser.avatar_url;
  img.className = "promise-avatar-example";
  document.body.append(img);

  return githubUser;
}

showAvatar();
```

Now we have a reusable function for user data loading and another function that serves only one purpose: load and display the user avatar in the profile page. Now we have a way to handle the problem: let's show the avatar if we are still on the profile page.

```js
async function showAvatar() {
  let githubUser = await loadUser();

  // prevent side effects
  if (!router.isActive('/profile')) {
    return;
  }

  // show the avatar
  ...
}
```

Actually, this is still wrong. If the user switches pages back and forth too quickly, it may end up in similar glitches:

[![](/static/img/2018/01/async-error2.gif)](/static/img/2018/01/async-error2.gif)

So we should remember if the loaded data corresponds to the current page load. A simple counter would help.

```js
let loadIndex = 0;
async function showAvatar() {
  const thisLoadIndex = ++loadIndex;

  let githubUser = await loadUser();

  // prevent side effects
  if (loadIndex !== thisLoadIndex) {
    return;
  }

  // show the avatar
  ...
}
```

Now it works as expected. If you use some framework that provides you with the information about the component life cycle, this code would probably look better. In particular, you may end up with the following React class:

```js
class Profile extends Component {
  componentDidMount() {
    this.showAvatar();
  }

  async showAvatar() {
    let githubUser = await loadUser();

    // prevent side effects
    if (!this.isMounted()) {
      return;
    }

    this.setState({githubUser});
  }
}
```

If your loading code depends on React props, componentWillReceiveProps method won't handle the issue properly, because "isMounted" call won't check the load session relevance anymore: instead, you should force component remounting by specifying unique "key" prop. This code would still have significant downsides. In particular:

1. It is hard to work with. Every time we make an asynchronous call, we must perform such checks, and it is annoying.
2. Forcing component remounting results in significant performance loss.
3. Your code keeps consuming browser resources until the load is fully done, although we don't need that data anymore.
4. It is just ugly.

React notifies you about these problems by [deprecating isMounted method](https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html) and encourages you to release your resources properly in componentWillUnmount method. They also provide you with a fallback solution which makes all your promises cancelable:

```js
const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
      error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};
```

I don't recommend you using this solution, because it doesn't release your resources immediately. It just prevents onFulfilled callback and rejects the promise instead. You must release your resources properly. To do that, you must dive deeper into your asynchronous code and provide it with some hooks you could use to abort the API requests and cancel the timeouts. Here're some examples:

- [setTimeout can be cancelled with clearTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout).
- [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) (in particular, [jQuery AJAX request](http://api.jquery.com/jquery.ajax/)) can be cancelled with [abort method](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort).
- Unfortunately, by the time this article is being written, [you can not cancel HTTP fetch() request](https://stackoverflow.com/questions/31061838/how-do-i-cancel-an-http-fetch-request) which is pitiful.

So, since setTimeout and XMLHttpRequest are not promises originally, you can't use "await" operator to operate them. As a reward, you have a possibility to cancel them easily:

```js
class UserLoader {
  constructor(callback) {
    this.request = $.getJSON(
      '/article/promise-chaining/user.json', (user) => {
        this.request = $.getJSON(
          `https://api.github.com/users/${user.name}`, callback);
      }
    )
  }

  abort() {
    this.request.abort();
  }
}

let userLoader;

function showAvatar() {
  userLoader = new UserLoader(function(githubUser) {
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);
  });
}

function hideAvatar() {
  if (userLoader) {
    userLoader.abort();
  }
}

showAvatar();
```

We have implemented a reusable UserLoader class to load user avatars and abort their loading if necessary. We can use it in frameworks:

```js
class Profile extends Component {
  componentDidMount() {
    this.userLoader = new UserLoader((githubUser) => {
      this.setState({githubUser})
    });
  }

  componentWillUnmount() {
    this.userLoader.abort();
  }
}
```

We sacrifice all advantages of the promises and async/await calls just to properly cancel the operations. Is there a compromise? Well, kind of. There are several ways to get an object that looks and works just like native JS promise, but can also be canceled, and [this awesome article](https://medium.com/@benlesh/promise-cancellation-is-dead-long-live-promise-cancellation-c6601f1f5082) explains them in detail. I didn't really try to use them all, but, by the look of things, only the first three options should be somewhat compatible with "await" operator, because these promises have "then" method which enables the browser to treat them as native promises. At the moment, I am working on the 2nd version of my Model-View framework jWidget which, among the other features, introduces its own DestroyablePromise implementation that integrates smoothly with jWidget's[object aggregation technology](https://www.issart.com/blog/aggregation-awareness/).

```js
function loadUser() {
  return new HttpRequest($.getJSON('/article/promise-chaining/user.json'))
    .then((user) => new HttpRequest(
      $.getJSON(`https://api.github.com/users/${user.name}`)));
}

class ProfileView extends Component {
  renderAvatar(el: JQuery) {
    this.own(loadUser().then(
      (githubUser) => el.attr('src', githubUser.avatar_url)));
  }
}
```

HttpRequest is just one of DestroyablePromise implementations. As you can see, even chained promises can be aggregated and destroyed easily. Unfortunately, "await" operator is still not fully supported either in jWidget 2 or in solutions #1 and #3 above for the following reason. The following code won't work:

```js
async function loadUser() {
  const user = await new HttpRequest(
    $.getJSON('/article/promise-chaining/user.json'));
  return await new HttpRequest(
    $.getJSON(`https://api.github.com/users/${user.name}`));
}

class ProfileView extends Component {
  async renderAvatar(el: JQuery) {
    const githubUser = await this.own(loadUser());
    el.attr('src', githubUser.avatar_url);
  }
}
```

Code compilation will fail with error: the result of loadUser method call does not implement Destroyable interface and therefore cannot be used as this.own method argument. In fact, any async function wraps our improved promises with traditional native promises which burns down all their advantages. The only way to deal with this problem is to use a CancelToken (solution #2 from the article above). It would transform the code to something like this:

```js
async function loadUser(cancelToken: Thenable) {
  const user = await fetch(
    '/article/promise-chaining/user.json', {cancelToken});
  return await fetch(
    `https://api.github.com/users/${user.name}`, {cancelToken});
}

class ProfileView extends Component {
  async renderAvatar(el: JQuery) {
    const cancelToken = this.own(new CancelToken());
    const githubUser = await loadUser(cancelToken);
    el.attr('src', githubUser.avatar_url);
  }
}
```

This is just pseudo-code: [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) doesn't currently support CancelTokens. If you want to use CancelTokens, you should either find an AJAX library that supports it or implement it from scratch. From my point of view, although CancelToken does the trick, it slightly complicates the code and makes it hard for junior developers to understand.

So, **"await" operator usage area is very limited in the front end unless you use CancelTokens**. I still manage promises the old way, but I will probably switch to CancelTokens soon.

There is one more thing I would like to mention. From my point of view, rejecting the promise is not the correct way to cancel it, because it usually results in an error message being displayed to the user for no reason and causes other side effects. Promise rejection is being equated to an exception throw, and exceptions in the front end should really indicate something we don't expect, because, in contrast to Java, the exceptions in JavaScript can not be easily controlled. So, my preference in this situation is to prevent both onFulfilled and onRejected calls and just "swallow" the output, make the browser "forget" about the promise. This does not fit the philosophy of promises (promise is an object that promises you to call one of the two callbacks), but, damn, it works, and works really well! I have never faced a situation when this behaviour failed to meet my needs.

I hope that you have found this article useful and it will help you avoid similar mistakes in your asynchronous code.