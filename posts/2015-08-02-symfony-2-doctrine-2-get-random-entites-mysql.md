---
id: 1178
title: 'Symfony 2: Doctrine 2 get random entites (MySQL)'
date: '2015-08-02T23:13:20+08:00'
author: 'Sergey Novichkov'
layout: post
image: /static/img/2015/08/source-code-583537_1280.jpg
categories:
    - General
    - 'Web Development'
---

Often during the process of developing projects on the Symfony 2 framework and Doctrine 2 ORM many web applications developers face the problem of getting random records from a MySQL database. Most developers know that this issue is not new, and all solutions that already exist have been known for a long time. But you can hardly find an implementation of any of them on the Symfony 2 framework and Doctrine 2 in the Internet. In this post I want to propose you , in my opinion, the most simple way of selecting random records from MySQL by means of the function RAND.

Attention! This method is not productive. I ask you to take it into account in your applications and not to use this method of obtaining a random record from MySQL in bulk data.

## Describe RAND() function

As ORM Doctrine 2 does not have support for RAND() function in MySQL, you must describe this function firstly. For this purpose create a class which will be used as the description of RAND() DQL. Listing class code is given below:

```php
<?php
 
namespace Acme\DemoBundle\DQL;
 
use Doctrine\ORM\Query\Lexer;
use Doctrine\ORM\Query\Parser;
use Doctrine\ORM\Query\SqlWalker;
use Doctrine\ORM\Query\AST\Functions\FunctionNode;
 
class RandFunction extends FunctionNode
{
    public function parse(Parser $parser)
    {
        $parser->match(Lexer::T_IDENTIFIER);
        $parser->match(Lexer::T_OPEN_PARENTHESIS);
        $parser->match(Lexer::T_CLOSE_PARENTHESIS);
    }
 
    public function getSql(SqlWalker $sqlWalker)
    {
        return 'RAND()';
    }
}
```

Then you need to connect this description to the list of functions Doctrine 2 ORM. This requires changing the Symfony 2 application configuration which is stored, as a rule, in the file app/config/config.yml, and add connection of the RAND() function description into the configuration of the ORM Doctrine 2. Listing of the configuration ORM Doctrine 2 is given below:

```yaml
… 

doctrine:
    orm:
        dql:
            numeric_functions:
                Rand: Acme\DemoBundle\DQL\RandFunction

…
```

## Creation of the repository and method for getting random records

In this guide, I'm not going to describe what repositories are and what they are used for, the official documentation for [Symfony 2 framework](http://symfony.com/doc/current/book/doctrine.html#custom-repository-classes) or [Doctrine 2 ORM](http://doctrine-orm.readthedocs.org/en/latest/reference/working-with-objects.html#custom-repositories) can tell you about it better than me. So, I'll just give you a listing of the repository with the implementation of the method of random selection of entries below:

```php
<?php
 
namespace Acme\DemoBundle\Entity\Repository;
 
use Doctrine\ORM\EntityRepository;
 
class SomeRepository extends EntityRepository
{
    /**
     * Get random entities
     *
     * @param int $count Entities count, default is 10
     *
     * @return array
     */
    public function getRandomEntities($count = 10)
    {
        return  $this->createQueryBuilder('q')
            ->addSelect('RAND() as HIDDEN rand')
            ->addOrderBy('rand')
            ->setMaxResults($count)
            ->getQuery()
            ->getResult();
    }
}
```

As you can see, the method of obtaining random entities is quite simple. If you ask me why I don't use call of the function RAND() in ORDER BY, I can tell that I don't do this because DQL does not support the use of functions in ORDER BY, that's why the generation of random values was carried in SELECT query specifying alias rand, further the name of an alias is used in ORDER BY.

## Conclusion

The article shows a simple way of implementation of the ability to retrieve random records from a MySQL project using Symfony2 framework and Doctrine 2 ORM. I hope the method described by me will be useful for you.