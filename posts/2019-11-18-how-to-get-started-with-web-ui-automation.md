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

At the development or support stage of a large web application there often arises necessity of the automated testing. This is due to the fact, that automated execution of tests is faster than manual. UI autotests simulate actions of a real user, and they use different browsers for this. We know that, ideally, tests should work not only without human intervention, but also be run at the right time. In this article, we are going to show how to start with web UI automation on a demo project, using IDEA IDE step by step.

##### **Step 1: Test Planning, pseudo code.** 

To demonstrate the creation of tests, we first need a testable web application itself. For clarity, the best solution would be to create some application, and run it locally. This will enable us to be independent of external conditions, such as the availability of a remote Internet resource, as well as to demonstrate tests launch with the change of the application code. 

We have a simple Node JS application consisting of three pages. The transitions between them is carried out by pressing the corresponding button. You can download this application at [this](https://gitlab.com/mbabilo/startuitesting_app) link.

Pseudocode of tests for all of three pages is written below:

HomePage:

1. testPageTitle test:
    1. Open the home page
    2. Get the page title
    3. Check if the actual title is equal to the expected
2. testPageHeader test:
    1. Open the home page
    2. Get the page header title (which is under tag h1)
    3. Check if the actual title is equal to the expected

AboutPage:

1. testPageTitle test:
    1. Open the home page
    2. Go to the about page by clicking the “i wanna see /about page” button
    3. Get the page title
    4. Check if the actual title is equal to the expected
2. testPageHeader test:
    1. Open the home page
    2. Go to the about page by clicking the “i wanna see /about page” button
    3. Get the page subtitle (which is under tag h3)
    4. Check if the actual subtitle is equal to the expected

ContactPage:

1. testPageTitle test:
    1. Open the home page.
    2. Go to the contact page, by clicking the “i wanna see /contacts page” button.
    3. Get the page title
    4. Check if the actual title is equal to the expected 
2. testContacstList:
    1. Open the home page
    2. Go to the contacts page by clicking the “i wanna see /contacts page” button
    3. Get the contacts list
    4. Check if the contacts list contains an expected contact

##### **Step 2: Preparation of the test configuration**

1. **Starting the test web application:**

To run the test application, just start the start.bat file, which is located in the /testApp folder.[![](https://issart.com/blog/wp-content/uploads/2019/11/1-300x69.png)](https://issart.com/blog/wp-content/uploads/2019/11/1.png)

Now, if you open [http://localhost:7000](http://localhost:7000) you’ll see:

[![](https://issart.com/blog/wp-content/uploads/2019/11/1.1-300x143.png)](https://issart.com/blog/wp-content/uploads/2019/11/1.1.png)

**2. Java Maven project creation:**

Launch the IDEA IDE. If it’s not installed yet, then install it. Create a Java Maven project, using the default settings offered by IDE. Add the following dependencies to the pom.xml file:

```
  <dependencies>
  <dependency>
  <groupId>org.seleniumhq.selenium</groupId>
  <artifactId>selenium-api</artifactId>
  <version>2.52.0</version>
  </dependency>
  <dependency>
  <groupId>org.seleniumhq.selenium</groupId>
  <artifactId>selenium-chrome-driver</artifactId>
  <version>2.52.0</version>
  </dependency>
  <dependency>
  <groupId>org.seleniumhq.selenium</groupId>
  <artifactId>selenium-support</artifactId>
  <version>2.52.0</version>
  </dependency>
  <dependency>
  <groupId>org.testng</groupId>
  <artifactId>testng</artifactId>
  <version>6.14.3</version>
  </dependency
 
  <dependency>
  <groupId>org.hamcrest</groupId>
  <artifactId>java-hamcrest</artifactId>
  <version>2.0.0.0</version>
  <scope>test</scope>
  </dependency>
 <dependency>
  <groupId>org.seleniumhq.selenium</groupId>
  <artifactId>selenium-firefox-driver</artifactId>
  <version>3.141.5</version>
 </dependency>
  </dependencies>
  <build>
  <plugins>
  <plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-shade-plugin</artifactId>
  <version>2.1</version>
  <executions>
  <execution>
  <phase>package</phase>
  <goals>
  <goal>shade</goal>
  </goals>
  <configuration>
  <transformers>
  <transformer implementation=”org.apache.maven.plugins.shade.resource.ServicesResourceTransformer” />
  <transformer implementation=”org.apache.maven.plugins.shade.resource.ManifestResourceTransformer”>
  <manifestEntries>
  <Main-Class>com.test.Selenium</Main-Class>
  </manifestEntries>
  </transformer>
  </transformers>
  </configuration>
  </execution>
  </executions>
  </plugin>
  <plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-compiler-plugin</artifactId>
  <version>3.5.1</version>
  <executions>
  <execution>
  <configuration>
  <skip>true</skip>
  </configuration>
  </execution>
  </executions>
  <configuration>
  <source>11</source>
  <target>11</target>
  </configuration>
  </plugin>
  </plugins>
  </build>
```

**3. Creation of a minimal test infrastructure:**

1. Create “appmanager” and “tests” folders the in src/test/java directory
2. Create ApplicationManager.java in the “appmanager” folder:

```
 package appmanager;
 
 import org.openqa.selenium.WebDriver;
 
 import org.openqa.selenium.firefox.FirefoxDriver;
 
 import org.openqa.selenium.chrome.ChromeDriver;
 
 import org.openqa.selenium.remote.BrowserType;
 
 import java.util.concurrent.TimeUnit;
 
 public class ApplicationManager {
 
  public WebDriver driver;
 
  private String browser;
 
  public ApplicationManager(String browser) {
 
  this.browser = browser;
 
  }
 
  public void init() {
 
  if (browser.equals(BrowserType.FIREFOX)) {
 
  System.setProperty(“webdriver.gecko.driver”, “F:\\\\issBlog\\\\How to get started with web UI automation\\\\geckodriver.exe”); // <– Change this path
 
  driver = new FirefoxDriver();
 
  } else if (browser.equals(BrowserType.CHROME)) {
 
  System.setProperty(“webdriver.chrome.driver”, “F:\\\\issBlog\\\\How to get started with web UI automation\\\\chromedriver.exe”); // <– Change this path
 
  driver = new ChromeDriver();
 
  }
 
  driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
 
  driver.get(“http://localhost:7000/”);
 
  }
 
  public void stop() {
 
  driver.quit();
 
  }
 
 }
```

What’s interesting for us here: 

- public WebDriver driver; – the variable declares a webdriver variable 
- private String browser; – The value of this variable will determine the browser instance which should be initialized in the test.
- public void init() {} – the method which is used to initialize the browser
- public void stop() {} – the method which is used to close the browser

3. Create TestBase.java class in the “tests” folder:

```
 package tests;
 
 import org.openqa.selenium.remote.BrowserType;
 
 import org.testng.annotations.AfterSuite;
 
 import org.testng.annotations.BeforeSuite;
 
 import appmanager.ApplicationManager;
 
 public class TestBase {
 
  protected static final ApplicationManager app = new ApplicationManager(BrowserType.CHROME);
 
  @BeforeSuite(alwaysRun = true)
 
  public void setUp() {
 
  app.init();
 
  }
 
  @AfterSuite(alwaysRun = true)
 
  public void tearDown() {
 
  app.stop();
 
  }
 
 }
```

In the code above:

- protected static final ApplicationManager app = new ApplicationManager(BrowserType.CHROME); – creates instance of ApplicationManager. We make it so that only one copy of this object will be created per launch, and all the actions will be delegated to it. Pay attention to the Chrome browser, that we set as the default.
- @BeforeSuite(alwaysRun = true) 

public void setUp() {} – This method will be launched before all tests are performed. It is necessary to launch the browser and initialize all helper classes (these are classes whose names will end in \*Helper.java, for example: NavigationHelper.java)

- @AfterSuite(alwaysRun = true)

```
public void tearDown() {} – This method is executed after the tests are completed, it ends the session and closes the browser.

 4. Add DebugTest.java class in the tests folder:

 package tests;
 
 import org.testng.annotations.Test;
 
 public class DebugTest extends TestBase{
 
  @Test
 
  public void debugTest() throws InterruptedException {
 
  Thread.sleep(5000);
 
  }
 
 }
```

This is a debug test and does not represent any value for testing, however it is needed to make sure that we do everything correctly.

 5. Run debugTest.

[![](https://issart.com/blog/wp-content/uploads/2019/11/2-300x177.png)](https://issart.com/blog/wp-content/uploads/2019/11/2.png)

Great, now we have the basis for creating autotests, and we can move on.

##### **Step 3: Creating tests and running them**

1. **Let’s remove the debug test and add HomePageTests.java instead.**

For clarity, let us return to the pseudocode written at the beginning:

testPageTitle test:

1. Open the home page
2. Get the page title
3. Check if the actual title is equal to the expected

This is almost ready-made code, we rewrite it like this:

1. Open home page = app.goTo().homePage();
2. Get page title = String title = app.home().getPageTitle();
3. Check if actual title is equal to expected = assertThat(title, equalTo(“mainPage”));

As you can see, tests written in this style are practically no different from pseudocode. Let’s put our code in the appropriate class, and also write the code for the second test of this page:

```
 package tests;
 
 import org.testng.annotations.Test;
 
 import static org.hamcrest.CoreMatchers.equalTo;
 
 import static org.hamcrest.MatcherAssert.assertThat;
 
 public class HomePageTests extends TestBase {
 
  @Test
 
  public void testPageTitle() {
 
  app.goTo().homePage();
 
  String title = app.homePage().getPageTitle();
 
  assertThat(title, equalTo(“mainPage”));
 
  }
 
  @Test
 
  public void testPageHeader() {
 
  app.goTo().homePage();
 
  String title = app.homePage().getHeaderOfPage();
 
  assertThat(title, equalTo(“Welcome to the main page of test app.”));
 
  }
 
 }
```

At this point, the IDE will inform you that you are missing two classes: goTo() and homePage(). Both of these classes are just an intermediate link, and should be declared in ApplicationManager class, let’s do this, and create the classes by adding the declaration of helper classes instances. After private String browser; add the following:
```
 private NavigationHelper navigationHelper;
 
 private HomePageHelper homePageHelper;
```

Add to the end of the public void inint(){} method the next strings in which inform our helpers that they will work with a specific instance of the web driver:
```
 navigationHelper = new NavigationHelper(driver);
 
 homePageHelper = new HomePageHelper(driver);
```

We are going to create all the missing methods of this class that we will need for all future tests. For this, after the public void stop(){} method add this:
```
 public NavigationHelper goTo() {
 
  return navigationHelper;
 
 }
 
 public HomePageHelper homePage() {
 
  return homePageHelper;
 
 }
```

We don’t have to create anything else in this class for now, but IDE reminds us that we still have 4 more assistant classes. Let’s go back to them.

To get started, add NavigationHelper.java class to the “appmanager” folder:

```
 package appmanager;
 
 import org.openqa.selenium.WebDriver;
 
 public class NavigationHelper extends HelperBase {
 
  public NavigationHelper(WebDriver driver) {
 
  super(driver);
 
  }
 
  public void homePage() {
 
  open(“http://localhost:7000/”);
 
  }
 
 }
```

In the code above:

- NavigationHelper(WebDriver driver is a constructor for class, which will use a parent instance of the webdriver.
- public void homePage() this is one of the methods that we lack. For its implementation, a new method is used – open. Open is a low-level method that can be reused for any test. Since we did not have a unique method, it makes sense to put it in a separate class and extend from it. This is what we did.

- public class NavigationHelper extends HelperBase {} – declaring a class, which extends HelperBase.

By analogy, add a neighboring class – helper for the home page tests:

```
 package appmanager;
 
 import org.openqa.selenium.By;
 
 import org.openqa.selenium.WebDriver;
 
 public class HomePageHelper extends HelperBase{
 
  public HomePageHelper(WebDriver driver) {super(driver);}
 
  public String getPageTitle() {
 
  return driver.getTitle();
 
  }
 
  public String getHeaderOfPage() {
 
  return title(By.xpath(“/html/body/h1”));
 
  }
 
 }
```

Here:

- title() – this is another new, low-level non-unique method that is designed to get the title by identifier. In this case, xpath is used as an identifier.

At this stage, we already have all the high-level classes to perform the first two tests. Now you need to create HelperBase and declare low-level methods in it. Add HelperBase.java to the “appmanager” folder:

```
 package appmanager;
 
 import org.openqa.selenium.By;
 
 import org.openqa.selenium.WebDriver;
 
 public class HelperBase {
 
  public WebDriver driver;
 
  public HelperBase(WebDriver driver) {
 
  this.driver = driver;
 
  }
 
  public String title(By locator) {
 
  return driver.findElement(locator).getText();
 
  }
 
  public void open(String url) {
 
  driver.get(url);
 
  }
 
 }
```

Let’s go back to our tests and try to run them.

[![](https://issart.com/blog/wp-content/uploads/2019/11/3-300x175.png)](https://issart.com/blog/wp-content/uploads/2019/11/3.png)

We have successfully created the infrastructure for writing simple autotests. Now, write the remaining 4 tests, add 2 more helpers (one for each new page that we cover with tests), determine helpers in ApplicationManager.java, and add missing low level classes in HelperBase.java.

  **2. Tests for About page in a real Java code:**

```
 package tests;
 
 import org.testng.annotations.Test;
 
 import static org.hamcrest.CoreMatchers.equalTo;
 
 import static org.hamcrest.MatcherAssert.assertThat;
 
 public class AboutPageTests extends TestBase{
 
  @Test
 
  public void testPageTitle() {
 
  app.goTo().homePage();
 
  app.goTo().aboutPage();
 
  String title = app.aboutPage().getPageTitle();
 
  assertThat(title, equalTo(“about app”));
 
  }
 
  @Test
 
  public void testPageHeader() {
 
  app.goTo().homePage();
 
  app.goTo().aboutPage();
 
  String title = app.aboutPage().getSubtitleOfPage();
 
  assertThat(title,
 
  equalTo(“This simple NodeJS application is written specifically for creating UI autotests.”));
 
  }
 
 }
 ```

  **3. Tests for Contacts page as a real code:**
```
 package tests;
 
 import org.testng.annotations.Test;
 
 import static org.hamcrest.CoreMatchers.equalTo;
 
 import static org.hamcrest.MatcherAssert.assertThat;
 
 import static org.testng.Assert.assertTrue;
 
 public class ContactsPageTests extends TestBase{
 
  @Test
 
  public void testPageTitle() {
 
  app.goTo().homePage();
 
  app.goTo().contactsPage();
 
  String title = app.contactsPage().getPageTitle();
 
  assertThat(title, equalTo(“Contacts list”));
 
  }
 
  @Test
 
  public void testPageHeader() {
 
  app.goTo().homePage();
 
  app.goTo().contactsPage();
 
  String list = app.contactsPage().getContactsList();
 
  System.out.println(list);
 
  assertTrue(list.contains(“Test User +11111111”));
 
  }
 
 }
```

Make sure that all tests pass successfully:

[![](https://issart.com/blog/wp-content/uploads/2019/11/4-300x182.png)](https://issart.com/blog/wp-content/uploads/2019/11/4.png)

##### **Step 4: Integration with Jenkins CI**

So, we have come to the final part – integration with continuous integration system (CI). We will use one of the most popular tools for this – Jenkins CI. The main idea is to have some of our tests run automatically when developers roll out a new version of the test application to the master repository branch. Let’s do it step by step:

1.  [Download](https://jenkins.io/download/) Jenkins.
2. Install Jenkins with the recommended parameters following the installer. I recommend installing CI on a separate machine with Internet access, it is necessary for the integration of your instance with the repository. However, for the demonstration, we can use a local Jenkins project with access through the [Ngrok](https://ngrok.com/) tool.
3. When the installation is complete, click on the “New Item” button.[![](https://issart.com/blog/wp-content/uploads/2019/11/4.5-246x300.png)](https://issart.com/blog/wp-content/uploads/2019/11/4.5.png)
4. Then, select the Pipeline section and enter the name of your job. Click OK.

[![](https://issart.com/blog/wp-content/uploads/2019/11/5-300x202.png)](https://issart.com/blog/wp-content/uploads/2019/11/5.png)

5\. In the Pipeline section, set the following parameters:

1. Definition = “pipeline script from SCM”

[![](https://issart.com/blog/wp-content/uploads/2019/11/1-1-300x128.png)](https://issart.com/blog/wp-content/uploads/2019/11/1-1.png)

 2. SCM = “Git”

[![](https://issart.com/blog/wp-content/uploads/2019/11/2-1-300x183.png)](https://issart.com/blog/wp-content/uploads/2019/11/2-1.png)

 6. Now, specify the repository where your **tests** are located. Pay attention to the field “Script Path”, it has a default value of Jenkinsfile. We do not need to change it. This file should be in the root of the repository by default. Now, just click the Save button to save settings.[![](https://issart.com/blog/wp-content/uploads/2019/11/9-300x258.png)](https://issart.com/blog/wp-content/uploads/2019/11/9.png)

 7. Create a Jenkinsfile file in the root of the test repository:

```
 node {
 
 stage (‘SCM checkout’){
  git “https://gitlab.com/mbabilo/startuitesting\_tests”
 }

 stage (‘Build and Run’){
   dir(“demo”) {
  sh “mvn clean install”
  }
 }
}
```

Here:

1. node { } – a wrapper for our script. The script should be inside of it.
2. stage (‘SCM checkout’) – a preparatory stage, during which we receive changes from our repository.
3. stage (‘Build’) – the build stage, during which Jenkins performs the same steps that we did in the IDE console:

- dir (“demo”) – moving to the specific folder.
- sh “mvn clean start” – executes shell commands.

 8. Launch pipeline job manually, to make sure that it works:

Console results view:

[![](https://issart.com/blog/wp-content/uploads/2019/11/10-300x134.png)](https://issart.com/blog/wp-content/uploads/2019/11/10.png)

Step-by-step view:


[![](https://issart.com/blog/wp-content/uploads/2019/11/11-300x150.png)](https://issart.com/blog/wp-content/uploads/2019/11/11.png)

9. Then, we need to install the plugins for integration with the GitLab. Go to the next section: Jenkins=>Manage Jenkins=>Manage Plugins. Then select the Available tab, and enter “gitlab” in the search field. Install the necessary plugins (“GitLab” and “Gitlab Hook”) and restart Jenkins:

[![](https://issart.com/blog/wp-content/uploads/2019/11/pluginManager-300x169.png)](https://issart.com/blog/wp-content/uploads/2019/11/pluginManager.png) 

10. Add gitlab repository where our test app is located to Jenkins settings:

[![](https://issart.com/blog/wp-content/uploads/2019/11/addGitlab-300x183.png)](https://issart.com/blog/wp-content/uploads/2019/11/addGitlab.png)

[![](https://issart.com/blog/wp-content/uploads/2019/11/12-300x165.png)](https://issart.com/blog/wp-content/uploads/2019/11/12.png)

11. Verify that your Jenkins instance is deployed on the localhost. If this is still the case, then use the [ngrok](https://ngrok.com/) utility (as a temp solution).

[![](https://issart.com/blog/wp-content/uploads/2019/11/13-300x77.png)](https://issart.com/blog/wp-content/uploads/2019/11/13.png)

12. Now, go to the GitLab (Pay attention: project with test app) settings: GitLab=>project=>Settings=>Integrations. Here we need to configure Jenkins CI webhook. Click this link:

[![](https://issart.com/blog/wp-content/uploads/2019/11/16-300x188.png)](https://issart.com/blog/wp-content/uploads/2019/11/16.png)

The integration settings with Jenkins CI will look as follows or similar:

[![](https://issart.com/blog/wp-content/uploads/2019/11/17-300x221.png)](https://issart.com/blog/wp-content/uploads/2019/11/17.png)

13. Update the settings of the Jenkins Pipeline (pipeline\_selenium1) to use a GitLab webhook.

[![](https://issart.com/blog/wp-content/uploads/2019/11/18-300x239.png)](https://issart.com/blog/wp-content/uploads/2019/11/18.png)

14. That’s it! Now let’s push some code updates into the repository with your test app, and see what happens in Jenkins.

[![](https://issart.com/blog/wp-content/uploads/2019/11/19-300x180.png)](https://issart.com/blog/wp-content/uploads/2019/11/19.png)

Fine. We have done a good job: 

- we have created a test web application and deployed it, 
- created Java Maven project to design an easily supported multi-level architecture of classes inside,
- wrote tests in the form of pseudo-code and then transferred them to our project in the form of a real code
- installed the Jenkins CI tool and created the pipeline integration job with 2 repositories so that our autotests start immediately after updating the application.

You can find the projects presented in this article at the links below:

1. [Test application](https://gitlab.com/mbabilo/startuitesting_app)
2. [Tests for test application](https://gitlab.com/mbabilo/startuitesting_tests)

Now you have some template for further testing. It is universal, and quite simple. Enjoy! And a couple of tips for further work: 

- Jenkins has many plugins that can be used to automatically generate test reports. One of the most popular and convenient solutions for this is [Allure](https://wiki.jenkins.io/display/JENKINS/Allure+Plugin).
- The tests themselves can also be improved, for example, using BDD frameworks to increase the readability of tests or speed up the execution of complex tests by working directly with the database.