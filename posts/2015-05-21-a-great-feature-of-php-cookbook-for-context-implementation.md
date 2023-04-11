---
id: 1058
title: 'A great feature of PHP - Cookbook for context implementation'
date: '2015-05-21T11:15:07+08:00'
author: 'Egor Nepomnyaschih'
layout: post
image: /static/img/2015/05/coding-699318_1280.jpg
categories:
    - General
---

This article covers technical details of PHP driven configuration described in a [previous article](http://www.issart.com/blog/great-feature-php/). There are a lot of stones under the water that can drive you crazy when you work with PHP templating engine. I will tell you how to work around some of them. We’ll discuss how to:

1. Implement script inclusion methods
2. Prevent vision of context’s private members
3. Implement graceful error handling
4. Implement state stack for nested scripts inclusion
5. Include scripts by relative path
6. Output JSON arrays/objects in for-loops
7. Prevent security issues

### 1. How to implement script inclusion methods

Scripts can be included via simple PHP “include” statement:

```
<pre style="font-size: .8em;">include $path;
```

Since all script inclusion statements go between “ob\_start()” and “ob\_get\_clean()” statements (see “build” method in a [previous article](http://www.issart.com/blog/great-feature-php/)), their entire output will go to the buffer.

If we type “include” statement in a scope of some object, all members of this object will be available in the script via $this variable.

```
<pre style="font-size: .8em;">class FE_Config_Context
{
    public function includeScript($path)
    {
        include $path;
    }
}
```

**company.php**

```
<pre style="font-size: .8em;">{
    "blog": <?php $this->includeScript('blog.php'); ?>
}
```

Now we can easily add methods to FE\_ConfigContext class if we want to implement some helpers available to the scripts.

### 2. Prevent vision of context’s private members

There’s a problem with current script inclusion approach: if we define private members in context, they’ll still be available in all the scripts.

```
<pre style="font-size: .8em;">class FE_Config_Context
{
    private $storagePath;
    private function __construct($storagePath)
    {
        $this->storagePath = $storagePath;
    }
    public function includeScript($path)
    {
        include $path; // $this->storagePath will be available
            // in company.php - that's the problem
    }
    public function getSkinStoragePath($skinId)
    {
        return "$this->storagePath/skins/$skinId";
    }
}
```

That’s weird and unsecure, so we must deal with that. To do that, let’s use class adapter pattern. In other words, let’s implement a wrapper class which has the same API as context, but has no custom private members. Let’s apparently call it “Context”, and rename the wrapped class to “ContextRunner”. Let’s delegate implementation of all “Context” methods to “ContextRunner”.

```
<pre style="font-size: .8em;">class FE_Config_Context
{
    private $runner;
    private function __construct($storagePath)
    {
        $this->runner = new FE_Config_ContextRunner(
            $this, $storagePath);
    }
    public function includeScript($path)
    {
        $this->runner->includeScript($path);
    }
    public function getSkinStoragePath($skinId)
    {
        return $this->runner->getSkinStoragePath($skinId);
    }
    public function _include($path)
    {
        // include files in scope of Context, not ContextRunner
        include $path;
    }
}
class FE_Config_ContextRunner
{
    private $context;
    private $storagePath;
    private function __construct($context, $storagePath)
    {
        $this->context = $context;
        $this->storagePath = $storagePath;
    }
    public function includeScript($path)
    {
        // seems redundant now,
        // but we'll improve this method in future
        $this->context->_include($path);
    }
    public function getSkinStoragePath($skinId)
    {
        return "$this->storagePath/skins/$skinId";
    }
}
```

Field “$runner” and method “\_include” are still available in the scripts, but custom private members like “$storagePath” are no longer.

### 3. Implement graceful error handling

If you make a mistake in one of your scripts, stack trace will be difficult to analyze. That’s why it is a good idea to implement a custom error handling engine which provides graceful error backtraces.

```
<pre style="font-size: .8em;">class FE_Config_ContextRunner
{
    private $stateStack;
    public function __construct($context)
    {
        $this->context = $context;
        $this->stateStack = array();
    }
    public function includeScript($path, $backtraceDepth = 1)
    {
        $isRoot = (count($this->stateStack) === 0);
        // we'll improve state stack in future
        $this->stateStack[] = true;
        if (!file_exists($path)) {
            throw new FE_Exception("Can not include '$path' " .
                "- file does not exist");
        }
        if ($isRoot) {
            $this->context->_include($path);
        } else {
            try {
                $this->context->_include($path);
            } catch (Exception $e) {
                array_pop($this->stateStack);
                $trace = debug_backtrace();
                $file = $trace[$backtraceDepth]['file'];
                $line = $trace[$backtraceDepth]['line'];
                throw new FE_Exception("Error occured " .
                    "while inclusion to '$file', line $line", $e);
            }
        }
        array_pop($this->stateStack);
    }
}
class FE_Exception extends Exception
{
    private $cause;
    public function __construct($message, $cause = null)
    {
        parent::__construct($message, 0);
        $this->cause = $cause;
    }
    // short
    public function toConsoleString()
    {
        $cause = $this->getCause();
        return $this->getMessage() . (isset($cause) ?
            ("\n" . self::toConsoleStringStatic($cause)) : '');
    }
    // verbose
    public function __toString()
    {
        $cause = $this->getCause();
        return get_class($this) . ': ' . parent::__toString() .
            (isset($cause) ? ("\nCaused By:\n" . $cause->__toString()) : '');
    }
    public static function toConsoleStringStatic($e)
    {
        if ($e instanceof FE_Exception) {
            return $e->toConsoleString();
        } elseif ($e) {
            return "Caused By:\n" . $e->__toString();
        }
    }
}
```

Method toConsoleString will provide a very beautiful and meaningful output:

```
Error occured while building configuration for company ISS
Error occured while inclusion to 'C:\website\git\config\ISS\company.php', line 39
Error occured while inclusion to 'C:\website\git\config\ISS\component-types\BLOG\BLOG.php', line 2
Can't read directory 'C:\website\git\config\ISS\component-types\BLOG\component'
```

If “$cause” will appear to be an unexpected exception (i.e. not FE\_Exception), it will output a full stack trace:

```
Error occured while building configuration for company ISS
Error occured while inclusion to 'C:\website\git\config\ISS\company.php', line 39
Error occured while inclusion to 'C:\website\git\config\ISS\component-types\BLOG\BLOG.php', line 2
Can't read directory 'C:\website\git\config\ISS\component-types\BLOG/component' in C:\website\git\php\Util\File.php:194
Stack trace:
<span style="color: green;">usual_php_stack_trace_goes_here</span>
```

One more thing to explain is “$backtraceDepth” argument in “includeScript” method. The clue is that it could be useful in implementation of other context low-level methods.

```
<pre style="font-size: .8em;">    public function includeAllScripts($path, $extension = 'php')
    {
        $writer = $this->context->writeObject();
        $scripts = $this->lookupScripts($path, $extension);
        foreach ($scripts as $script) {
            $writer->put($script);
            // to skip "includeAllScripts" call, set "backtraceDepth" to 2
            $this->includeScript("$path/$script.$extension", 2);
        }
        $writer->close();
    }
```

### 4. Implement state stack for nested scripts inclusion

One very useful feature of PHP driven configuration is being able to define variables available for all nested scripts, without pollution of the parent context.

**company.php**

```
<pre style="font-size: .8em;">$this->includeScript('blog.php', array(
    'title' => 'ISS Art blog'
));
```

**blog.php**

```
<pre style="font-size: .8em;">{
    "title": <?= json_encode($this->title) ?>
}
```

It can be achieved via state stack implementation. Let’s add a new “$args” argument to “includeScript” method.

```
<pre style="font-size: .8em;">class FE_Config_Context
{
    public function includeScript($path, $args = null)
    {
        $this->runner->includeScript($path, $args);
    }
}
class FE_Config_ContextRunner
{
    public function includeScript($path, $args, $backtraceDepth = 1)
    {
        // ...
        $args = isset($args) ? $args : array();
        $this->stateStack[] = new FE_Config_State($args);
        // ...
        array_pop($this->stateStack);
    }
}
class FE_Config_State
{
    private $args;
    public function __construct($args)
    {
        $this->args = $args;
    }
}
```

Now we are able to define new variables for nested scripts. Let’s make them available via [PHP magic methods](http://php.net/manual/en/language.oop5.magic.php).

```
<pre style="font-size: .8em;">class FE_Config_Context
{
    public function __get($name)
    {
        return $this->runner->getArg($name);
    }
}
class FE_Config_ContextRunner
{
    public function getArg($name)
    {
        for ($i = count($this->stateStack) - 1; $i >= 0; $i--) {
            $state = $this->stateStack[$i];
            if ($state->tryGetArg($name, $value)) {
                return $value;
            }
        }
        $trace = debug_backtrace();
        $file = $trace[1]['file'];
        $line = $trace[1]['line'];
        throw new FE_Exception("Undefined configuration variable '$name' " .
            "in '$file', line $line");
    }
}
class FE_Config_State
{
    public function tryGetArg($name, &$value)
    {
        if (!isset($this->args[$name])) {
            return false;
        }
        $value = $this->args[$name];
        return true;
    }
}
```

Sometimes it is useful to add fields to a current state on fly. Let’s add a new magic method for this.

```
<pre style="font-size: .8em;">class FE_Config_Context
{
    public function __set($name, $value)
    {
        $this->runner->setArg($name, $value);
    }
}
class FE_Config_ContextRunner
{
    public function setArg($name, $value)
    {
        $this->_getCurrentState()->setArg($name, $value);
    }
    private function _getCurrentState()
    {
        return $this->stateStack[count($this->stateStack) - 1];
    }
}
class FE_Config_State
{
    public function setArg($name, $value)
    {
        $this->args[$name] = $value;
    }
}
```

### 5. Include scripts by relative path

Usual “include” PHP statement is looking for a file [in multiple locations](http://php.net/manual/en/function.include.php) which we actually don’t care about in PHP driven configuration. What we actually want is to be able to include files relatively to current script location.

```
<pre style="font-size: .8em;">$this->includeScript('blog.php'); // include blog.php in a current folder
$this->includeScript('components/ISS.php'); // include ISS.php in "components" folder
```

Let’s store current script location in state stack and use it for nested scripts inclusion.

```
<pre style="font-size: .8em;">class FE_Config_ContextRunner
{
    public function includeScript($path, $args, $backtraceDepth = 1)
    {
        $isRoot = (count($this->stateStack) === 0);
        if (!$isRoot) {
            $path = $this->_getSubPath($path);
        }
        if (!file_exists($path)) {
            throw new FE_Exception("Can not include '$path' - " .
                "file does not exist");
        }
        $args = isset($args) ? $args : array();
        $this->stateStack[] = new FE_Config_State($args + array(
            'path' => $path,
            'dir'  => dirname($path)
        ));
        // ...
    }
    private function _getSubPath($path)
    {
        $dir = $this->context->dir;
        return normalizePath("$dir/$path");
    }
}
```

Find “normalizePath” implementation in [PHP user comments](http://php.net/manual/en/function.realpath.php#112367).

We’ve made sure that “include” statement is always called with absolute path pointing to a nested script location.

### 6. Output arrays/objects in for-loops

Sometimes you have a collection of objects and you want to use their properties in PHP driven configuration. The first approach that can be helpful is using “json\_encode” method to serialize these properties and print them to the output.

```
<pre style="font-size: .8em;">{
    <?php
        $componentsJson = array();
        foreach ($this->components as $component) {
            $componentsJson[] = array(
                'id'   => $component->id,
                'name' => $component->name
            );
        }
    ?>
    "components": <?= json_encode($component) ?>
}
```

It works in the simplest cases, but sometimes you also need to be able to use context methods inside for-loop. For example, what can you do if you want to include component configuration as a nested script?

```
<pre style="font-size: .8em;">{
    "components": [
        <?php
            $first = true;
            foreach ($this->components as $component) {
                if ($first) {
                    $first = false;
                    echo ',';
                }
                ?>
                {
                    "id"     : <?= $component->id ?>,
                    "name"   : <?= $component->name?>,
                    "config" : <?php $this->includeScript(
                        "components/$component->id.php"); ?>
                }
        <?php } ?>
    ]
}
```

You can see that code is getting complicated because of JSON array formatting stuff. To get this fixed, let’s reuse a couple of JSON writer classes to convert arbitrary data structures to JSON in streaming fashion. I already described these classes (JsonArrayWriter and JsonObjectWriter) in **Problem six** paragraph of [Front end optimization experience](http://www.issart.com/blog/front-end-optimization-experience-part-2/) article. Let me show you implementation of these classes.

```
<pre style="font-size: .8em;">class JsonArrayWriter
{
    private $file;
    private $first = true;
    public function __construct($file)
    {
        $this->file = $file;
        fwrite($this->file, '[');
    }
    public function close()
    {
        fwrite($this->file, ']');
    }
    public function put()
    {
        if ($this->first) {
            $this->first = false;
        } else {
            fwrite($this->file, ',');
        }
    }
}
class JsonObjectWriter
{
    private $file;
    private $first = true;
    public function __construct($file)
    {
        $this->file = $file;
        fwrite($this->file, '{');
    }
    public function close()
    {
        fwrite($this->file, '}');
    }
    public function put($key)
    {
        $this->checkFirst();
        fwrite($this->file, json_encode((string)$key) . ':');
    }
    public function dump($fields)
    {
        if (empty($fields)) {
            return;
        }
        $this->checkFirst();
        $str = json_encode($fields);
        fwrite($this->file, substr($str, 1, -1));
    }
    private function checkFirst()
    {
        if ($this->first) {
            $this->first = false;
        } else {
            fwrite($this->file, ',');
        }
    }
}
```

It is not quite obvious how to construct these objects to print the output to standard output stream, but here’s solution ([source @ StackOverflow](http://stackoverflow.com/questions/7027902/does-echo-equal-fputs-stdout)).

```
<pre style="font-size: .8em;">class FE_Config_ContextRunner
{
    private $outputHandle;
    public function __construct($context)
    {
        $this->outputHandle = fopen('php://output', 'w');
        // ...
    }
    public function writeArray()
    {
        return new JsonArrayWriter($this->outputHandle);
    }
    public function writeObject()
    {
        return new JsonObjectWriter($this->outputHandle);
    }
}
```

Let’s simplify the original example now.

```
<pre style="font-size: .8em;">{
    "components": <?php
        $writer = $this->writeArray();
        foreach ($this->components as $component) {
            $writer->put();
            ?>
            {
                "id"     : <?= $component->id ?>,
                "name"   : <?= $component->name?>,
                "config" : <?php $this->includeScript(
                    "components/$component->id.php"); ?>
            }
            <?php
        }
        $writer->close();
    ?>
}
```

Looks much better, doesn’t it?

### 7. Prevent security issues

If you think about it, it makes sense to prevent inclusion of the scripts which are located outside of configuration folder. Such inclusion can be unintended. Let’s add an assertion for that.

```
<pre style="font-size: .8em;">class FE_Config_ContextRunner
{
    private $configDir;
    public function includeScript($path, $args, $backtraceDepth = 1)
    {
        $isRoot = (count($this->stateStack) === 0);
        if ($isRoot) {
            $this->configDir = dirname(normalizePath($path));
        } else {
            $path = $this->_getSubPath($path);
            $dir = substr($path, 0, strlen($this->configDir));
            if ($dir !== $this->configDir) {
                throw new FE_Exception("You are trying to interpret " .
                    "a PHP file '$path' which is located outside of " .
                    "configuration folder '$this->configDir'. " .
                    "It is unsecure!");
            }
        }
        // ...
    }
}
```

### Conslusion

This article demonstrates some useful tricks in PHP development: inclusion context management, PHP magic methods, working with output streams, graceful error handling. As you can see, PHP is a well-thought programming language from templating point of view. I hope that knowledge of these features may come in handy for you.