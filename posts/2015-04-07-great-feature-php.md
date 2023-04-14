---
id: 960
title: 'A great feature of PHP'
date: '2015-04-07T12:19:37+08:00'
author: 'Egor Nepomnyaschih'
layout: post
image: /static/img/2015/04/php-151199_1280.png
categories:
    - General
    - 'Web Development'
---

I know many Java and .NET developers who often like to make fun of PHP. Honestly, a couple of years ago I was one of them. I used the next arguments to set Java and .NET above PHP (this is my personal opinion):

- It is not a good idea to use dynamic typization in a server-side language, because server is all about performance and security – static typization supports these two attributes a lot. Also, static typization makes code refactoring much easier.
- Java and .NET have much better-thought standard libraries. In PHP, you have many different ways to do the same operation – it increases code fragmentation, especially if you work in a large team of PHP developers.
- Java and .NET have more graceful syntax. <tt>$</tt> sign in variable names, <tt>-></tt> instead of <tt>.</tt>, <tt><?php ?></tt> tags make PHP code quite bulky.

Nevertheless, PHP has one great feature that makes it very useful for me. From its very beginning, PHP was designed as HTML code preprocessor. Its syntax serves this purpose perfectly. Ultimately, if you write pure HTML code in your PHP file, PHP interpreter will give you this HTML in output. Only PHP insertions between tags like <tt><?php ?></tt> and <tt><?= ?></tt> will be interpreted as PHP code. It lets you do anything with your HTML output and it is usually more convenient compared to various HTML template engines, because template is just a template – it doesn’t let you write code. Also PHP doesn’t care about what exactly you write into output: HTML, operation progress, or message log. I found it convenient for me to build JSON files with PHP.

A good addition to output preprocessing is [buffered output feature](http://php.net/manual/en/book.outcontrol.php). You can redirect the output to a buffer and then parse this output for any purpose.

Now let me show you how exactly we use these features at one of our projects. The project receives data in various formats from different sources and represents this data in unified form in user’s Web browser. New data comes to us from time to time. We develop an exclusive algorithm of data parsing and data conversion for each customer (aka operator), but the output format looks the same for everyone. For a number of reasons we’ve decided to store the output in JSON files. PHP buffered output fits perfectly for a purpose of such output building. We call this part of application “PHP driven configuration”.

## PHP driven configuration example

### Structure

- just-another-operator 
    - operator.php
    - locale 
        - en.json
        - ru.json
    - units 
        - mouse.php
        - keyboard.php
        - monitor.php

#### operator.php

Root file of operator configuration.

```
<pre style="font-size: .8em">{
	"colorSchemes" : ["default", "chocolate"],
	"operatorName" : <?php $this->locale->write("operatorName"); ?>,
	"profitMargin" : <?= file_get_contents(
		$this->getInputFilePath('profit-margin.json')); ?>,
	"units"        : <?php $this->includeAllScripts('units', 'unitId'); ?>
}
```

Here’s how it works:

- “colorSchemes” field is set to a constant value – it never changes for this specific operator
- “operatorName” is retrieved from localization files for this operator
- “profitMargin” field value is taken from another JSON file which is located in a versioned file storage of this operator. API will select an appropriate version of this file automatically
- To build “units” field, we delegate execution to partial PHP files located in “units” folder

### Localization

JSON files in “locale” folder contain operator-specific localization. It doesn’t make sense to put operator-specific strings to a common application localization file, that’s why we build them as a part of PHP driven configuration of the operator.

#### locale/en.json

```
{
	"operatorName": "Just another operator",
	"units": {
		"mouse"    : "Mouse",
		"keyboard" : "Keyboard",
		"monitor"  : "Monitor"
	}
}
```

#### locale/ru.json

```
{
	"operatorName": "Еще один оператор",
	"units": {
		"mouse"    : "Мышь",
		"keyboard" : "Клавиатура",
		"monitor"  : "Монитор"
	}
}
```

With that given, <tt><?php $this->locale->write("operatorName"); ?></tt> instruction in operator.php file will be expanded to the next JSON:

```
{
	"en": "Just another operator",
	"ru": "Еще один оператор"
}
```

### Partials

“includeAllScripts” method includes all PHP files in a folder as partials of a current configuration file. All partials will have PHP file name available in them as value of the field, specified in second argument. So, <tt><?php $this->includeAllScripts('units', 'unitId'); ?></tt> instruction will include all PHP files in “units” folder and pass “unitId” field into them.

#### units/mouse.php

```
<?php $locale = $this->locale->descend('units'); ?>
{
	"id"      : <?= json_encode($this->unitId) ?>,
	"name"    : <?php $locale->write($this->unitId); ?>,
	"country" : "China"
}
```

#### units/keyboard.php

```
<?php $locale = $this->locale->descend('units'); ?>
{
	"id"      : <?= json_encode($this->unitId) ?>,
	"name"    : <?php $locale->write($this->unitId); ?>,
	"country" : "Russia"
}
```

#### units/monitor.php

```
<?php $locale = $this->locale->descend('units'); ?>
{
	"id"      : <?= json_encode($this->unitId) ?>,
	"name"    : <?php $locale->write($this->unitId); ?>,
	"country" : "Japan"
}
```

### Complete output

```
{
	"colorSchemes": ["default", "chocolate"],
	"operatorName": {
		"en": "Just another operator",
		"ru": "Еще один оператор"
	},
	"profitMargin": {
		"comment": "Here goes whatever we have in a current version of 'profit-margin.json' data file"
	},
	"units": {
		"mouse": {
			"id": "mouse",
			"name": {
				"en": "Mouse",
				"ru": "Мышь"
			},
			"country": "China"
		},
		"keyboard": {
			"id": "keyboard",
			"name": {
				"en": "Keyboard",
				"ru": "Клавиатура"
			},
			"country": "Russia"
		},
		"monitor": {
			"id": "monitor",
			"name": {
				"en": "Monitor",
				"ru": "Монитор"
			},
			"country": "Japan"
		}
	}
}
```

## What is it all for?

Such configuration provides us with the next benefits:

- Depending on operator’s needs, we can parse any data that they provide for us. For example, the majority of operators don’t give us profit margin data at all, one operator gives it in CSV format, and another operator – in a proprietary binary format. We can provide solution for all of them without application code modification – only configuration should be changed.
- Sometimes we don’t need to internationalize some strings. For example, sometimes we use serial numbers as unit names, so there’s no need to put them to localization files. In that case, we write serial numbers right in configuration without $locale object usage. This lets us keep configuration and localization files short and clear.
- We can reuse the same localization strings in different parts of configuration file. This way we can make localization files even shorter. This is crucial, because translators are usually people without technical background, so any issues in localization file can drive them crazy.
- We can extend PHP driven configuration API as we want to.

## Under the hood: how it works

Finally, I’m going to show you how this magic works. Initialization code:

```
<pre style="font-size: .8em">public static function build(
	$operatorId, $updateId, $configPath,
	$outputDir, $versionedStoragePath, $dateTime)
{
	// read all available localization files in advance
	$languages = FE_Util_File::getFiles("$configPath/locale", 'json');
	$dict = array();
	foreach ($languages as $lang) {
		$dict[$lang] = FE_Util_File::readJson(
			"$configPath/locale/$lang.json");
	}
	$locale = new FE_Config_Locale($dict);

	// create context - it will play role of "$this" inside config files
	$context = new FE_Config_Context($versionedStoragePath);

	// start output buffering
	ob_start();
	try {
		// include root script,
		// initializing context with several predefined fields
		$context->includeScript("$configPath/operator.php", array(
			'operatorId' => $operatorId,
			'updateId'   => $updateId,
			'locale'     => $locale,
			'dateTime'   => $dateTime
		));
	} catch (Exception $e) {
		// exit gracefully in case of error
		ob_clean();
		throw new FE_Exception('Error occured while building ' .
			"configuration for operator $operatorId", $e);
	}

	// get the output as a string
	$operator = ob_get_clean();

	$operatorJson = json_decode($operator, true);
	if (isset($operatorJson)) {
		// if output is a correct JSON, extend it with common fields
		$operatorJson['updateId'] = $updateId;
		$operatorJson['locale']   = $dict;
		$operatorJson['dateTime'] = $dateTime->format(
			FE_Data::DATE_TIME_FORMAT);
		
		// encode JSON without pretty-printing to save hard disk space
		FE_Util_File::write("$outputDir/$updateId.json",
			json_encode($operatorJson));
	} else {
		// if output is not a correct JSON,
		// write it to a file and throw an exception
		$invalidFilePath = PUBLIC_DIR .
			"/logs/invalid-configs/$operatorId/$updateId.json";
		FE_Util_File::write($invalidFilePath, $operator);
		throw new FE_Exception('WARNING! Can't parse configuration ' .
			"JSON for operator '$operatorId', " .
			"update '$updateId'. Writing raw file " .
			"to '$invalidFilePath' for debugging\n");
	}
}
```

Now it’s all about FE\_Config\_Context implementation. You can put there whatever you want. Our API is quite rich and provides about 20 methods to manage partial files, data files, retrieve current context info and generate special blocks of JSON output. You can find inspiration in Zend\_View\_Abstract class implementation. There’s a lot of stones under the water that wait for you in context implementation, so probably I’ll write another article about it in future.

## Conclusion

PHP buffered output is a very powerful feature that is worth mastering if you want to improve your development skills. Even if you develop your applications mostly with Java or .NET, consider using PHP in cases which require a powerful and flexible template engine.