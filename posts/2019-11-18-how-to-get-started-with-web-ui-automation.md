---
id: 3535
title: 'How to get started with web UI automation'
date: '2019-11-18T14:00:22+08:00'
author: 'Maxim Babilo'
layout: post
image: /static/img/2019/11/gray-laptop-computer-showing-html-codes-in-shallow-focus-160107.jpg
categories:
    - QA/Testing
tags:
    - automation
    - ui
    - web
---

<span style="font-weight: 400;">At the development or support stage of a large web application there often arises necessity of the automated testing. This is due to the fact, that automated execution of tests is faster than manual. UI autotests simulate actions of a real user, and they use different browsers for this. We know that, ideally, tests should work not only without human intervention, but also be run at the right time. In this article, we are going to show how to start with web UI automation on a demo project, using IDEA IDE step by step.</span>

##### **Step 1: Test Planning, pseudo code.** 

<span style="font-weight: 400;">To demonstrate the creation of tests, we first need a testable web application itself. For clarity, the best solution would be to create some application, and run it locally. This will enable us to be independent of external conditions, such as the availability of a remote Internet resource, as well as to demonstrate tests launch with the change of the application code. </span>

<span style="font-weight: 400;">We have a simple Node JS application consisting of three pages. The transitions between them is carried out by pressing the corresponding button. You can download this application at </span>[<span style="font-weight: 400;">this</span>](https://gitlab.com/mbabilo/startuitesting_app)<span style="font-weight: 400;"> link.</span>

<span style="font-weight: 400;">Pseudocode of tests for all of three pages is written below:</span>

<span style="font-weight: 400;">HomePage:</span>

1. <span style="font-weight: 400;">testPageTitle test:</span>
    1. <span style="font-weight: 400;">Open the home page</span>
    2. <span style="font-weight: 400;">Get the page title</span>
    3. <span style="font-weight: 400;">Check if the actual title is equal to the expected</span>
2. <span style="font-weight: 400;">testPageHeader test:</span>
    1. <span style="font-weight: 400;">Open the home page</span>
    2. <span style="font-weight: 400;">Get the page header title (which is under tag h1)</span>
    3. <span style="font-weight: 400;">Check if the actual title is equal to the expected</span>

<span style="font-weight: 400;">AboutPage:</span>

1. <span style="font-weight: 400;">testPageTitle test:</span>
    1. <span style="font-weight: 400;">Open the home page</span>
    2. <span style="font-weight: 400;">Go to the about page by clicking the “i wanna see /about page” button</span>
    3. <span style="font-weight: 400;">Get the page title</span>
    4. <span style="font-weight: 400;">Check if the actual title is equal to the expected</span>
2. <span style="font-weight: 400;">testPageHeader test:</span>
    1. <span style="font-weight: 400;">Open the home page</span>
    2. <span style="font-weight: 400;">Go to the about page by clicking the “i wanna see /about page” button</span>
    3. <span style="font-weight: 400;">Get the page subtitle (which is under tag h3)</span>
    4. <span style="font-weight: 400;">Check if the actual subtitle is equal to the expected</span>

<span style="font-weight: 400;">ContactPage:</span>

1. <span style="font-weight: 400;">testPageTitle test:</span>
    1. <span style="font-weight: 400;">Open the home page.</span>
    2. <span style="font-weight: 400;">Go to the contact page, by clicking the “i wanna see /contacts page” button.</span>
    3. <span style="font-weight: 400;">Get the page title</span>
    4. <span style="font-weight: 400;">Check if the actual title is equal to the expected </span>
2. <span style="font-weight: 400;">testContacstList:</span>
    1. <span style="font-weight: 400;">Open the home page</span>
    2. <span style="font-weight: 400;">Go to the contacts page by clicking the “i wanna see /contacts page” button</span>
    3. <span style="font-weight: 400;">Get the contacts list</span>
    4. <span style="font-weight: 400;">Check if the contacts list contains an expected contact</span>

##### **Step 2: Preparation of the test configuration**

1. **Starting the test web application:**

<span style="font-weight: 400;">To run the test application, just start the start.bat file, which is located in the /testApp folder.[![](https://issart.com/blog/wp-content/uploads/2019/11/1-300x69.png)](https://issart.com/blog/wp-content/uploads/2019/11/1.png)</span>

<span style="font-weight: 400;">Now, if you open </span>[<span style="font-weight: 400;">http://localhost:7000</span>](http://localhost:7000)<span style="font-weight: 400;"> you’ll see:</span>

[![](https://issart.com/blog/wp-content/uploads/2019/11/1.1-300x143.png)](https://issart.com/blog/wp-content/uploads/2019/11/1.1.png)

**2. Java Maven project creation:**

<span style="font-weight: 400;">Launch the IDEA IDE. If it’s not installed yet, then install it. Create a Java Maven project, using the default settings offered by IDE. Add the following dependencies to the pom.xml file:</span>

> <span style="font-weight: 400;"> </span><span style="font-weight: 400;">&lt;dependencies&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;dependency&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;groupId&gt;org.seleniumhq.selenium&lt;/groupId&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;artifactId&gt;selenium-api&lt;/artifactId&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;version&gt;2.52.0&lt;/version&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/dependency&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;dependency&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;groupId&gt;org.seleniumhq.selenium&lt;/groupId&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;artifactId&gt;selenium-chrome-driver&lt;/artifactId&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;version&gt;2.52.0&lt;/version&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/dependency&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;dependency&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;groupId&gt;org.seleniumhq.selenium&lt;/groupId&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;artifactId&gt;selenium-support&lt;/artifactId&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;version&gt;2.52.0&lt;/version&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/dependency&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;dependency&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;groupId&gt;org.testng&lt;/groupId&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;artifactId&gt;testng&lt;/artifactId&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;version&gt;6.14.3&lt;/version&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/dependency</span>
> 
> <span style="font-weight: 400;"> &lt;dependency&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;groupId&gt;org.hamcrest&lt;/groupId&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;artifactId&gt;java-hamcrest&lt;/artifactId&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;version&gt;2.0.0.0&lt;/version&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;scope&gt;test&lt;/scope&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/dependency&gt;</span>
> 
> <span style="font-weight: 400;">&lt;dependency&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;groupId&gt;org.seleniumhq.selenium&lt;/groupId&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;artifactId&gt;selenium-firefox-driver&lt;/artifactId&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;version&gt;3.141.5&lt;/version&gt;</span>
> 
> <span style="font-weight: 400;">&lt;/dependency&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/dependencies&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;build&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;plugins&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;plugin&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;artifactId&gt;maven-shade-plugin&lt;/artifactId&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;version&gt;2.1&lt;/version&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;executions&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;execution&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;phase&gt;package&lt;/phase&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;goals&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;goal&gt;shade&lt;/goal&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/goals&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;configuration&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;transformers&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;transformer implementation=”org.apache.maven.plugins.shade.resource.ServicesResourceTransformer” /&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;transformer implementation=”org.apache.maven.plugins.shade.resource.ManifestResourceTransformer”&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;manifestEntries&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;Main-Class&gt;com.test.Selenium&lt;/Main-Class&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/manifestEntries&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/transformer&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/transformers&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/configuration&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/execution&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/executions&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/plugin&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;plugin&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;artifactId&gt;maven-compiler-plugin&lt;/artifactId&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;version&gt;3.5.1&lt;/version&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;executions&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;execution&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;configuration&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;skip&gt;true&lt;/skip&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/configuration&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/execution&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/executions&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;configuration&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;source&gt;11&lt;/source&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;target&gt;11&lt;/target&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/configuration&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/plugin&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/plugins&gt;</span>
> 
> <span style="font-weight: 400;"> &lt;/build&gt;</span>

**3. Creation of a minimal test infrastructure:**

1. <span style="font-weight: 400;">Create “appmanager” and “tests” folders the in src/test/java directory</span>
2. <span style="font-weight: 400;">Create ApplicationManager.java in the “appmanager” folder:</span>

> <span style="font-weight: 400;">package appmanager;</span>
> 
> <span style="font-weight: 400;">import org.openqa.selenium.WebDriver;</span>
> 
> <span style="font-weight: 400;">import org.openqa.selenium.firefox.FirefoxDriver;</span>
> 
> <span style="font-weight: 400;">import org.openqa.selenium.chrome.ChromeDriver;</span>
> 
> <span style="font-weight: 400;">import org.openqa.selenium.remote.BrowserType;</span>
> 
> <span style="font-weight: 400;">import java.util.concurrent.TimeUnit;</span>
> 
> <span style="font-weight: 400;">public class ApplicationManager {</span>
> 
> <span style="font-weight: 400;"> public WebDriver driver;</span>
> 
> <span style="font-weight: 400;"> private String browser;</span>
> 
> <span style="font-weight: 400;"> public ApplicationManager(String browser) {</span>
> 
> <span style="font-weight: 400;"> this.browser = browser;</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;"> public void init() {</span>
> 
> <span style="font-weight: 400;"> if (browser.equals(BrowserType.FIREFOX)) {</span>
> 
> <span style="font-weight: 400;"> System.setProperty(“webdriver.gecko.driver”, “F:\\\\issBlog\\\\How to get started with web UI automation\\\\geckodriver.exe”); // &lt;– Change this path</span>
> 
> <span style="font-weight: 400;"> driver = new FirefoxDriver();</span>
> 
> <span style="font-weight: 400;"> } else if (browser.equals(BrowserType.CHROME)) {</span>
> 
> <span style="font-weight: 400;"> System.setProperty(“webdriver.chrome.driver”, “F:\\\\issBlog\\\\How to get started with web UI automation\\\\chromedriver.exe”); // &lt;– Change this path</span>
> 
> <span style="font-weight: 400;"> driver = new ChromeDriver();</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;"> driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);</span>
> 
> <span style="font-weight: 400;"> driver.get(“http://localhost:7000/”);</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;"> public void stop() {</span>
> 
> <span style="font-weight: 400;"> driver.quit();</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;">}</span>

<span style="font-weight: 400;">What’s interesting for us here: </span>

- <span style="font-weight: 400;">public WebDriver driver;</span><span style="font-weight: 400;"> – the variable declares a webdriver variable </span>
- <span style="font-weight: 400;">private String browser;</span><span style="font-weight: 400;"> – The value of this variable will determine the browser instance which should be initialized in the test.</span>
- <span style="font-weight: 400;">public void init() {}</span><span style="font-weight: 400;"> – the method which is used to initialize the browser</span>
- <span style="font-weight: 400;">public void stop() {}</span><span style="font-weight: 400;"> – the method which is used to close the browser</span>

<span style="font-weight: 400;"> 3. Create TestBase.java class in the “tests” folder:</span>

> <span style="font-weight: 400;">package tests;</span>
> 
> <span style="font-weight: 400;">import org.openqa.selenium.remote.BrowserType;</span>
> 
> <span style="font-weight: 400;">import org.testng.annotations.AfterSuite;</span>
> 
> <span style="font-weight: 400;">import org.testng.annotations.BeforeSuite;</span>
> 
> <span style="font-weight: 400;">import appmanager.ApplicationManager;</span>
> 
> <span style="font-weight: 400;">public class TestBase {</span>
> 
> <span style="font-weight: 400;"> protected static final ApplicationManager app = new ApplicationManager(BrowserType.CHROME);</span>
> 
> <span style="font-weight: 400;"> @BeforeSuite(alwaysRun = true)</span>
> 
> <span style="font-weight: 400;"> public void setUp() {</span>
> 
> <span style="font-weight: 400;"> app.init();</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;"> @AfterSuite(alwaysRun = true)</span>
> 
> <span style="font-weight: 400;"> public void tearDown() {</span>
> 
> <span style="font-weight: 400;"> app.stop();</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;">}</span>

<span style="font-weight: 400;">In the code above:</span>

- <span style="font-weight: 400;">protected static final ApplicationManager app = new ApplicationManager(BrowserType.CHROME);</span><span style="font-weight: 400;"> – creates instance of ApplicationManager. We make it so that only one copy of this object will be created per launch, and all the actions will be delegated to it. Pay attention to the Chrome browser, that we set as the default.</span>
- <span style="font-weight: 400;">@BeforeSuite(alwaysRun = true) </span>

public void setUp() {} – This method will be launched before all tests are performed. It is necessary to launch the browser and initialize all helper classes (these are classes whose names will end in \*Helper.java, for example: NavigationHelper.java)

- <span style="font-weight: 400;">@AfterSuite(alwaysRun = true)</span>

<span style="font-weight: 400;">public void tearDown() {}</span><span style="font-weight: 400;"> – This method is executed after the tests are completed, it ends the session and closes the browser.</span>

<span style="font-weight: 400;"> 4. Add DebugTest.java class in the tests folder:</span>

> <span style="font-weight: 400;">package tests;</span>
> 
> <span style="font-weight: 400;">import org.testng.annotations.Test;</span>
> 
> <span style="font-weight: 400;">public class DebugTest extends TestBase{</span>
> 
> <span style="font-weight: 400;"> @Test</span>
> 
> <span style="font-weight: 400;"> public void debugTest() throws InterruptedException {</span>
> 
> <span style="font-weight: 400;"> Thread.sleep(5000);</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;">}</span>

<span style="font-weight: 400;">This is a debug test and does not represent any value for testing, however it is needed to make sure that we do everything correctly.</span>

<span style="font-weight: 400;"> 5. Run debugTest.</span>

[![](https://issart.com/blog/wp-content/uploads/2019/11/2-300x177.png)](https://issart.com/blog/wp-content/uploads/2019/11/2.png)

<span style="font-weight: 400;">Great, now we have the basis for creating autotests, and we can move on.</span>

##### **Step 3: Creating tests and running them**

1. **Let’s remove the debug test and add HomePageTests.java instead.**

<span style="font-weight: 400;">For clarity, let us return to the pseudocode written at the beginning:</span>

<span style="font-weight: 400;">testPageTitle test:</span>

1. <span style="font-weight: 400;">Open the home page</span>
2. <span style="font-weight: 400;">Get the page title</span>
3. <span style="font-weight: 400;">Check if the actual title is equal to the expected</span>

<span style="font-weight: 400;">This is almost ready-made code, we rewrite it like this:</span>

1. <span style="font-weight: 400;">Open home page = </span><span style="font-weight: 400;">app.goTo().homePage();</span>
2. <span style="font-weight: 400;">Get page title = </span><span style="font-weight: 400;">String title = app.home().getPageTitle();</span>
3. <span style="font-weight: 400;">Check if actual title is equal to expected = </span><span style="font-weight: 400;">assertThat(title, equalTo(“mainPage”));</span>

<span style="font-weight: 400;">As you can see, tests written in this style are practically no different from pseudocode. Let’s put our code in the appropriate class, and also write the code for the second test of this page:</span>

> <span style="font-weight: 400;">package tests;</span>
> 
> <span style="font-weight: 400;">import org.testng.annotations.Test;</span>
> 
> <span style="font-weight: 400;">import static org.hamcrest.CoreMatchers.equalTo;</span>
> 
> <span style="font-weight: 400;">import static org.hamcrest.MatcherAssert.assertThat;</span>
> 
> <span style="font-weight: 400;">public class HomePageTests extends TestBase {</span>
> 
> <span style="font-weight: 400;"> @Test</span>
> 
> <span style="font-weight: 400;"> public void testPageTitle() {</span>
> 
> <span style="font-weight: 400;"> app.goTo().homePage();</span>
> 
> <span style="font-weight: 400;"> String title = app.homePage().getPageTitle();</span>
> 
> <span style="font-weight: 400;"> assertThat(title, equalTo(“mainPage”));</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;"> @Test</span>
> 
> <span style="font-weight: 400;"> public void testPageHeader() {</span>
> 
> <span style="font-weight: 400;"> app.goTo().homePage();</span>
> 
> <span style="font-weight: 400;"> String title = app.homePage().getHeaderOfPage();</span>
> 
> <span style="font-weight: 400;"> assertThat(title, equalTo(“Welcome to the main page of test app.”));</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;">}</span>

<span style="font-weight: 400;">At this point, the IDE will inform you that you are missing two classes: </span><span style="font-weight: 400;">goTo()</span><span style="font-weight: 400;"> and </span><span style="font-weight: 400;">homePage()</span><span style="font-weight: 400;">. Both of these classes are just an intermediate link, and should be declared in ApplicationManager class, let’s do this, and create the classes by adding the declaration of helper classes instances. After </span><span style="font-weight: 400;">private String browser;</span><span style="font-weight: 400;"> add the following:</span>

> <span style="font-weight: 400;">private NavigationHelper navigationHelper;</span>
> 
> <span style="font-weight: 400;">private HomePageHelper homePageHelper;</span>

<span style="font-weight: 400;">Add to the end of the </span><span style="font-weight: 400;">public void inint(){}</span><span style="font-weight: 400;"> method the next strings in which inform our helpers that they will work with a specific instance of the web driver:</span>

> <span style="font-weight: 400;">navigationHelper = new NavigationHelper(driver);</span>
> 
> <span style="font-weight: 400;">homePageHelper = new HomePageHelper(driver);</span>

<span style="font-weight: 400;">We are going to create all the missing methods of this class that we will need for all future tests. For this, after the </span><span style="font-weight: 400;">public void stop(){}</span><span style="font-weight: 400;"> method add this:</span>

> <span style="font-weight: 400;">public NavigationHelper goTo() {</span>
> 
> <span style="font-weight: 400;"> return navigationHelper;</span>
> 
> <span style="font-weight: 400;">}</span>
> 
> <span style="font-weight: 400;">public HomePageHelper homePage() {</span>
> 
> <span style="font-weight: 400;"> return homePageHelper;</span>
> 
> <span style="font-weight: 400;">}</span>

<span style="font-weight: 400;">We don’t have to create anything else in this class for now, but IDE reminds us that we still have 4 more assistant classes. Let’s go back to them.</span>

<span style="font-weight: 400;">To get started, add NavigationHelper.java class to the “appmanager” folder:</span>

> <span style="font-weight: 400;">package appmanager;</span>
> 
> <span style="font-weight: 400;">import org.openqa.selenium.WebDriver;</span>
> 
> <span style="font-weight: 400;">public class NavigationHelper extends HelperBase {</span>
> 
> <span style="font-weight: 400;"> public NavigationHelper(WebDriver driver) {</span>
> 
> <span style="font-weight: 400;"> super(driver);</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;"> public void homePage() {</span>
> 
> <span style="font-weight: 400;"> open(“http://localhost:7000/”);</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;">}</span>

<span style="font-weight: 400;">In the code above:</span>

- <span style="font-weight: 400;">NavigationHelper(WebDriver driver</span><span style="font-weight: 400;"> is a constructor for class, which will use a parent instance of the webdriver.</span>
- <span style="font-weight: 400;">public void homePage()</span><span style="font-weight: 400;"> this is one of the methods that we lack. For its implementation, a new method is used – open. Open is a low-level method that can be reused for any test. Since we did not have a unique method, it makes sense to put it in a separate class and extend from it. This is what we did.</span>

- <span style="font-weight: 400;">public class NavigationHelper extends HelperBase {}</span><span style="font-weight: 400;"> – declaring a class, which extends </span><span style="font-weight: 400;">HelperBase</span><span style="font-weight: 400;">.</span>

<span style="font-weight: 400;">By analogy, add a neighboring class – helper for the home page tests:</span>

> <span style="font-weight: 400;">package appmanager;</span>
> 
> <span style="font-weight: 400;">import org.openqa.selenium.By;</span>
> 
> <span style="font-weight: 400;">import org.openqa.selenium.WebDriver;</span>
> 
> <span style="font-weight: 400;">public class HomePageHelper extends HelperBase{</span>
> 
> <span style="font-weight: 400;"> public HomePageHelper(WebDriver driver) {super(driver);}</span>
> 
> <span style="font-weight: 400;"> public String getPageTitle() {</span>
> 
> <span style="font-weight: 400;"> return driver.getTitle();</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;"> public String getHeaderOfPage() {</span>
> 
> <span style="font-weight: 400;"> return title(By.xpath(“/html/body/h1”));</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;">}</span>

<span style="font-weight: 400;">Here:</span>

- <span style="font-weight: 400;">title()</span><span style="font-weight: 400;"> – this is another new, low-level non-unique method that is designed to get the title by identifier. In this case, xpath is used as an identifier.</span>

<span style="font-weight: 400;">At this stage, we already have all the high-level classes to perform the first two tests. Now you need to create HelperBase and declare low-level methods in it. Add HelperBase.java to the “appmanager” folder:</span>

> <span style="font-weight: 400;">package appmanager;</span>
> 
> <span style="font-weight: 400;">import org.openqa.selenium.By;</span>
> 
> <span style="font-weight: 400;">import org.openqa.selenium.WebDriver;</span>
> 
> <span style="font-weight: 400;">public class HelperBase {</span>
> 
> <span style="font-weight: 400;"> public WebDriver driver;</span>
> 
> <span style="font-weight: 400;"> public HelperBase(WebDriver driver) {</span>
> 
> <span style="font-weight: 400;"> this.driver = driver;</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;"> public String title(By locator) {</span>
> 
> <span style="font-weight: 400;"> return driver.findElement(locator).getText();</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;"> public void open(String url) {</span>
> 
> <span style="font-weight: 400;"> driver.get(url);</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;">}</span>

<span style="font-weight: 400;">Let’s go back to our tests and try to run them.</span>

[![](https://issart.com/blog/wp-content/uploads/2019/11/3-300x175.png)](https://issart.com/blog/wp-content/uploads/2019/11/3.png)

<span style="font-weight: 400;">We have successfully created the infrastructure for writing simple autotests. Now, write the remaining 4 tests, add 2 more helpers (one for each new page that we cover with tests), determine helpers in ApplicationManager.java, and add missing low level classes in HelperBase.java.</span>

<span style="font-weight: 400;">  **2. Tests for About page in a real Java code:**</span>

> <span style="font-weight: 400;">package tests;</span>
> 
> <span style="font-weight: 400;">import org.testng.annotations.Test;</span>
> 
> <span style="font-weight: 400;">import static org.hamcrest.CoreMatchers.equalTo;</span>
> 
> <span style="font-weight: 400;">import static org.hamcrest.MatcherAssert.assertThat;</span>
> 
> <span style="font-weight: 400;">public class AboutPageTests extends TestBase{</span>
> 
> <span style="font-weight: 400;"> @Test</span>
> 
> <span style="font-weight: 400;"> public void testPageTitle() {</span>
> 
> <span style="font-weight: 400;"> app.goTo().homePage();</span>
> 
> <span style="font-weight: 400;"> app.goTo().aboutPage();</span>
> 
> <span style="font-weight: 400;"> String title = app.aboutPage().getPageTitle();</span>
> 
> <span style="font-weight: 400;"> assertThat(title, equalTo(“about app”));</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;"> @Test</span>
> 
> <span style="font-weight: 400;"> public void testPageHeader() {</span>
> 
> <span style="font-weight: 400;"> app.goTo().homePage();</span>
> 
> <span style="font-weight: 400;"> app.goTo().aboutPage();</span>
> 
> <span style="font-weight: 400;"> String title = app.aboutPage().getSubtitleOfPage();</span>
> 
> <span style="font-weight: 400;"> assertThat(title,</span>
> 
> <span style="font-weight: 400;"> equalTo(“This simple NodeJS application is written specifically for creating UI autotests.”));</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;">}</span>

<span style="font-weight: 400;">  **3. Tests for Contacts page as a real code:**</span>

> <span style="font-weight: 400;">package tests;</span>
> 
> <span style="font-weight: 400;">import org.testng.annotations.Test;</span>
> 
> <span style="font-weight: 400;">import static org.hamcrest.CoreMatchers.equalTo;</span>
> 
> <span style="font-weight: 400;">import static org.hamcrest.MatcherAssert.assertThat;</span>
> 
> <span style="font-weight: 400;">import static org.testng.Assert.assertTrue;</span>
> 
> <span style="font-weight: 400;">public class ContactsPageTests extends TestBase{</span>
> 
> <span style="font-weight: 400;"> @Test</span>
> 
> <span style="font-weight: 400;"> public void testPageTitle() {</span>
> 
> <span style="font-weight: 400;"> app.goTo().homePage();</span>
> 
> <span style="font-weight: 400;"> app.goTo().contactsPage();</span>
> 
> <span style="font-weight: 400;"> String title = app.contactsPage().getPageTitle();</span>
> 
> <span style="font-weight: 400;"> assertThat(title, equalTo(“Contacts list”));</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;"> @Test</span>
> 
> <span style="font-weight: 400;"> public void testPageHeader() {</span>
> 
> <span style="font-weight: 400;"> app.goTo().homePage();</span>
> 
> <span style="font-weight: 400;"> app.goTo().contactsPage();</span>
> 
> <span style="font-weight: 400;"> String list = app.contactsPage().getContactsList();</span>
> 
> <span style="font-weight: 400;"> System.out.println(list);</span>
> 
> <span style="font-weight: 400;"> assertTrue(list.contains(“Test User +11111111”));</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;">}</span>

<span style="font-weight: 400;">Make sure that all tests pass successfully:</span>

[![](https://issart.com/blog/wp-content/uploads/2019/11/4-300x182.png)](https://issart.com/blog/wp-content/uploads/2019/11/4.png)

##### **Step 4: Integration with Jenkins CI**

<span style="font-weight: 400;">So, we have come to the final part – integration with continuous integration system (CI). We will use one of the most popular tools for this – Jenkins CI. The main idea is to have some of our tests run automatically when developers roll out a new version of the test application to the master repository branch. Let’s do it step by step:</span>

1. <span style="font-weight: 400;"> </span>[<span style="font-weight: 400;">Download</span>](https://jenkins.io/download/)<span style="font-weight: 400;"> Jenkins.</span>
2. <span style="font-weight: 400;">Install Jenkins with the recommended parameters following the installer. I recommend installing CI on a separate machine with Internet access, it is necessary for the integration of your instance with the repository. However, for the demonstration, we can use a local Jenkins project with access through the </span>[<span style="font-weight: 400;">Ngrok</span>](https://ngrok.com/)<span style="font-weight: 400;"> tool.</span>
3. <span style="font-weight: 400;">When the installation is complete, click on the “New Item” button.[![](https://issart.com/blog/wp-content/uploads/2019/11/4.5-246x300.png)](https://issart.com/blog/wp-content/uploads/2019/11/4.5.png)</span>
4. <span style="font-weight: 400;">Then, select the Pipeline section and enter the name of your job. Click OK.</span>

[![](https://issart.com/blog/wp-content/uploads/2019/11/5-300x202.png)](https://issart.com/blog/wp-content/uploads/2019/11/5.png)

5\. In the Pipeline section, set the following parameters:

1. Definition = “pipeline script from SCM”

[![](https://issart.com/blog/wp-content/uploads/2019/11/1-1-300x128.png)](https://issart.com/blog/wp-content/uploads/2019/11/1-1.png)

<span style="font-weight: 400;"> 2. SCM = “Git”</span>

<span style="font-weight: 400;">[![](https://issart.com/blog/wp-content/uploads/2019/11/2-1-300x183.png)](https://issart.com/blog/wp-content/uploads/2019/11/2-1.png)</span>

<span style="font-weight: 400;"> 6. Now, specify the repository where your </span>**tests**<span style="font-weight: 400;"> are located. Pay attention to the field “Script Path”, it has a default value of Jenkinsfile. We do not need to change it. This file should be in the root of the repository by default. Now, just click the Save button to save settings.[![](https://issart.com/blog/wp-content/uploads/2019/11/9-300x258.png)](https://issart.com/blog/wp-content/uploads/2019/11/9.png)</span>

<span style="font-weight: 400;"> 7. Create a Jenkinsfile file in the root of the test repository:</span>

> <span style="font-weight: 400;">node {</span>
> 
> <span style="font-weight: 400;">stage (‘SCM checkout’){</span>
> 
> <span style="font-weight: 400;">git “https://gitlab.com/mbabilo/startuitesting\_tests”</span>
> 
> <span style="font-weight: 400;">}</span>
> 
> <span style="font-weight: 400;">stage (‘Build and Run’){</span>
> 
> <span style="font-weight: 400;"> </span> <span style="font-weight: 400;">dir(“demo”) {</span>
> 
> <span style="font-weight: 400;"> sh “mvn clean install”</span>
> 
> <span style="font-weight: 400;"> }</span>
> 
> <span style="font-weight: 400;">}</span>
> 
> <span style="font-weight: 400;">}</span>

<span style="font-weight: 400;">Here:</span>

1. <span style="font-weight: 400;">node { } – a wrapper for our script. The script should be inside of it.</span>
2. <span style="font-weight: 400;">stage (‘SCM checkout’) – a preparatory stage, during which we receive changes from our repository.</span>
3. <span style="font-weight: 400;">stage (‘Build’) – the build stage, during which Jenkins performs the same steps that we did in the IDE console:</span>

- <span style="font-weight: 400;">dir (“demo”) – moving to the specific folder.</span>
- <span style="font-weight: 400;">sh “mvn clean start” – executes shell commands.</span>

<span style="font-weight: 400;"> 8. Launch pipeline job manually, to make sure that it works:</span>

<span style="font-weight: 400;">Console results view:</span>

[![](https://issart.com/blog/wp-content/uploads/2019/11/10-300x134.png)](https://issart.com/blog/wp-content/uploads/2019/11/10.png)

<span style="font-weight: 400;">Step-by-step view:</span><span style="font-weight: 400;">  
</span>

[![](https://issart.com/blog/wp-content/uploads/2019/11/11-300x150.png)](https://issart.com/blog/wp-content/uploads/2019/11/11.png)

9\. <span style="font-weight: 400;">Then, we need to install the plugins for integration with the GitLab. Go to the next section: Jenkins=&gt;Manage Jenkins=&gt;Manage Plugins. Then select the Available tab, and enter “gitlab” in the search field. Install the necessary plugins (“GitLab” and “Gitlab Hook”) and restart Jenkins:</span>

<span style="font-weight: 400;">[![](https://issart.com/blog/wp-content/uploads/2019/11/pluginManager-300x169.png)](https://issart.com/blog/wp-content/uploads/2019/11/pluginManager.png) </span>

<span style="font-weight: 400;">10. </span><span style="font-weight: 400;">Add gitlab repository where our </span><span style="font-weight: 400;">test app</span><span style="font-weight: 400;"> is located to Jenkins settings:</span>

<span style="font-weight: 400;">[![](https://issart.com/blog/wp-content/uploads/2019/11/addGitlab-300x183.png)](https://issart.com/blog/wp-content/uploads/2019/11/addGitlab.png)</span>

[![](https://issart.com/blog/wp-content/uploads/2019/11/12-300x165.png)](https://issart.com/blog/wp-content/uploads/2019/11/12.png)

11\. <span style="font-weight: 400;">Verify that your Jenkins instance is deployed on the localhost. If this is still the case, then use the </span>[<span style="font-weight: 400;">ngrok</span>](https://ngrok.com/)<span style="font-weight: 400;"> utility (as a temp solution).</span>

[![](https://issart.com/blog/wp-content/uploads/2019/11/13-300x77.png)](https://issart.com/blog/wp-content/uploads/2019/11/13.png)

<span style="font-weight: 400;"> 12. </span><span style="font-weight: 400;">Now, go to the GitLab (Pay attention: project with </span><span style="font-weight: 400;">test app</span><span style="font-weight: 400;">) settings: GitLab=&gt;project=&gt;Settings=&gt;Integrations. Here we need to configure Jenkins CI webhook. Click this link:</span>

[![](https://issart.com/blog/wp-content/uploads/2019/11/16-300x188.png)](https://issart.com/blog/wp-content/uploads/2019/11/16.png)

<span style="font-weight: 400;">The integration settings with Jenkins CI will look as follows or similar:</span>

[![](https://issart.com/blog/wp-content/uploads/2019/11/17-300x221.png)](https://issart.com/blog/wp-content/uploads/2019/11/17.png)

13\. <span style="font-weight: 400;">Update the settings of the Jenkins Pipeline (pipeline\_selenium1) to use a GitLab webhook.</span>

[![](https://issart.com/blog/wp-content/uploads/2019/11/18-300x239.png)](https://issart.com/blog/wp-content/uploads/2019/11/18.png)

14\. <span style="font-weight: 400;">That’s it! Now let’s push some code updates into the repository with your </span><span style="font-weight: 400;">test app</span><span style="font-weight: 400;">, and see what happens in Jenkins.</span>

[![](https://issart.com/blog/wp-content/uploads/2019/11/19-300x180.png)](https://issart.com/blog/wp-content/uploads/2019/11/19.png)

<span style="font-weight: 400;">Fine. We have done a good job: </span>

- <span style="font-weight: 400;">we have created a test web application and deployed it, </span>
- <span style="font-weight: 400;">created Java Maven project to design an easily supported multi-level architecture of classes inside,</span>
- <span style="font-weight: 400;">wrote tests in the form of pseudo-code and then transferred them to our project in the form of a real code</span>
- <span style="font-weight: 400;">installed the Jenkins CI tool and created the pipeline integration job with 2 repositories </span><span style="font-weight: 400;">so that our autotests start immediately after updating the application.</span>

<span style="font-weight: 400;">You can find the projects presented in this article at the links below:</span>

1. [<span style="font-weight: 400;">Test application</span>](https://gitlab.com/mbabilo/startuitesting_app)
2. [<span style="font-weight: 400;">Tests for test application</span>](https://gitlab.com/mbabilo/startuitesting_tests)

<span style="font-weight: 400;">Now you have some template for further testing. It is universal, and quite simple. Enjoy! And a couple of tips for further work: </span>

- <span style="font-weight: 400;">Jenkins has many plugins that can be used to automatically generate test reports. One of the most popular and convenient solutions for this is </span>[<span style="font-weight: 400;">Allure</span>](https://wiki.jenkins.io/display/JENKINS/Allure+Plugin)<span style="font-weight: 400;">.</span>
- <span style="font-weight: 400;">The tests themselves can also be improved, for example, using BDD frameworks to increase the readability of tests or speed up the execution of complex tests by working directly with the database.</span>