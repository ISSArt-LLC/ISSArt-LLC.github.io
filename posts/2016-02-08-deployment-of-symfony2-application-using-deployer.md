---
id: 1552
title: 'Deployment of Symfony2 application using Deployer'
date: '2016-02-08T13:26:25+08:00'
author: 'Mikhail Prosalov'
layout: post
image: /static/img/2016/01/к-статье-Deployment-of-Symfony2-application-using-Deployer.jpg
categories:
    - General
    - 'Web Development'
---

Deployment of Symfony2 application may be a complex task, depending on the setup and the requirements of your application. On some projects we update the test server at least once a day. And production server about two times a week. Developers spend a lot of time on this routine process.

**Let’s take a look at typical steps taken during deployment process:**

- Upload project’s code to the server
- Install vendor dependencies via Composer
- Install and dump your assets
- Perform database migrations or rebuild database and fill it with data fixtures for test purposes
- Clear and warm up your cache

**Deployment process may also include additional tasks, such as:**

- Setup permissions for project files and directories
- Add/edit CRON jobs
- Install external assets. (Bootstrap fonts, etc.)
- Clear of external cache systems. (ElasticSearch, Memcached, Redis, APC, Varnish, etc.)
- Run tests

**Manual deployment has a number of disadvantages.** In addition taking a lot of developer’s time, manual deployment is influenced by the human factor. There is a possibility of deployment bugs in cases where developer forgot to update cache, dump assets, etc. To avoid this issue, we suggest to use deployment tools.

**There are plenty of tools to automate deployment process, such as:**

1. [Capistrano 3](http://capistranorb.com) with [Symfony plugin](https://github.com/capistrano/symfony/). (Ruby)
2. [Capifony](http://capifony.org). Based on Capistrano 2. (Ruby)
3. [Fabric](http://www.fabfile.org). (Python)
4. [Magallanes](http://magephp.com). (PHP)
5. [Deployer](http://deployer.org). (PHP)

The first three deployment tools require us to install and setup Ruby or Python interpreter on the server. In some cases this is not possible: shared hosting or not enough permissions. Also configure deployment tool using Ruby/Python could be an issue for PHP developers, if they are not familiar with Ruby/Python syntax. That’s why we choose from Magallanes and Deployer.

**Magallanes** includes built-in Symfony2 tasks for installation/dumping assets and clear/warmup cache. It’s definitely not enough, so we’ll have to create custom tasks. Custom task is a class that extends Mage\\Task\\AbstractTask. Configuring Magallanes, you can’t see what logic is behind the task name, so you’ll need to find task class and read the code to make sure this task will do what you need.

**Deployer** is a lightweight and easy to use tool to perform all deploy routines. There is built-in recipe to deploy Symfony2 project (also there are recipes for other PHP Frameworks and CMS), which includes all typical steps that need to be taken during deployment process. All you need is extend this recipe and create additional tasks, depending on your project. That’s why Deployed is our choice.

**Let’s try to deploy our Symfony2 application to production server using Deployer.**

- First of all, install Deployer. It could be done by using Composer, by downloading deployer.phar file or by cloning Github repository. We’ll use the first approach. ```
    <pre class="EnlighterJSRAW" data-enlighter-language="shell">$ composer require deployer/deployer:~3.0
    ```
- Second step is to create deploy.php file in your project’s root directory. ```
    <pre class="EnlighterJSRAW" data-enlighter-language="php"><?php
    require 'vendor/deployer/deployer/recipe/symfony.php'; 
    
    // Define a server for deployment.
    // Let's name it "prod".
    server('prod', '127.0.0.1')
        ->user('user') // Defind SSH username
        ->password('password') // Define SSH user's password
        ->stage('production') // Define stage name
        ->env('deploy_path', '/home/user/project'); // Define the base path to deploy your project to.
    
    // Specify the repository from which to download your project's code.
    set('repository', 'git@github.com:org/app.git');
    ```
- Now open up a terminal in your project directory and run the following command to deploy your application:

```
<pre class="EnlighterJSRAW" data-enlighter-language="shell">$ php bin/dep deploy production
```

**That’s it! You project has been deployed!** Symfony receipe performed the following actions: uploaded code to the server, created cache directories, setup permissions, installed vendor dependencies, installed and dumped assets, warmed up cache. This is typical deployment steps for Symfony2 projects. Let’s improve deployment script. We’ll add shared directories (which will be used by all releases) for user’s upload and setup additional task to install MopaBootstrapBundle fonts. To achieve this purpose, we’ll need to add following code to deploy.php.

```
<pre class="EnlighterJSRAW" data-enlighter-language="php">// Add web/uploads to shared_dirs
set('shared_dirs', array_merge(get('shared_dirs'), [
    'web/uploads',
]));

// Add web/uploads to writable_dirs
set('writable_dirs', array_merge(get('shared_dirs'), [
    'web/uploads',
]));

// Create new task
task('mopa:bootstrap:font', function () {
    run('cd {{release_path}} && php {{release_path}}/{{bin_dir}}/console mopa:bootstrap:install:font --env={{env}}');
})->desc('Mopa Bootstrap install font');

// Schedule mopa:bootstrap:font task after deploy.assetic:dump task will be completed
after('deploy:assetic:dump', 'mopa:bootstrap:font');
```

Now when we run “php bin/dep deploy production” we’ll see web/uploads in shared directory with symlink from every release. And after “deploy:assetic:dump” task will be completed, “mopa:bootstrap:font” task will be triggered.

For production environment, all database structure changes should be implemented as migration. If you want to perform database migrations during deployment process, just add the following code to deploy.php.

```
<pre class="EnlighterJSRAW" data-enlighter-language="php">after('deploy:vendors', 'database:migrate');
```

For test environment in some cases we need to clean database and fill it with data fixtures. Let’s create task to do this job. Deployer can ask for confirmation to execute some actions. Let’s make sure that rebuild database is needed. This task will be executed only for “test” server.

```
<pre class="EnlighterJSRAW" data-enlighter-language="php">server('test', '127.0.0.1')
    ->user('test')
    ->password('password')
    ->stage('testing')
    ->env('deploy_path', '/home/test/project');

task('database:rebuild', function () {
    if (askConfirmation('Rebuild database?', false)) {
        run('php {{release_path}}/{{bin_dir}}/console doctrine:database:drop --force --env={{env}}');
        run('php {{release_path}}/{{bin_dir}}/console doctrine:database:create --env={{env}}');
        run('php {{release_path}}/{{bin_dir}}/console doctrine:schema:create --env={{env}}');
        run('php {{release_path}}/{{bin_dir}}/console doctrine:fixtures:load --no-interaction --env={{env}}');
    }
})->desc('Rebuild database')->onlyOn('test');

after('deploy:assetic:dump', 'database:rebuild');
```

And run deployment on test server.

```
<pre class="EnlighterJSRAW" data-enlighter-language="shell">$ php bin/dep deploy testing
```

If something is wrong, a simple rollback to the previous release is supported by Deployer.

```
<pre class="EnlighterJSRAW" data-enlighter-language="shell">$ php bin/dep rollback testing
```

**Get more examples and documentation [here](http://deployer.org/).**

After the first time deployment process, you should configure your web server to serve your “web” directory inside “&lt;deploy\_path&gt;/current” directory. If you have no permissions to configure your web server, simply create symlink from your document root to “&lt;deploy\_path&gt;/current” directory.

***Happy Symfonying!***