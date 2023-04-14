---
id: 2716
title: 'How to use Criteria API with Spring Boot'
date: '2018-07-12T15:34:01+08:00'
author: 'Denis Davydov'
layout: post
image: /static/img/2018/07/library-488683_960_720.jpg
categories:
    - General
tags:
    - 'Criteria API'
    - 'Spring Boot'
---

### Brief summary

You often need to create queries with changeable conditions, for example, a query for a list with filtering by the columns on the side of the database. In this case, a good solution will be to use Criteria API – [the API of JPA 2.0 specification](https://docs.oracle.com/javaee/6/tutorial/doc/gjitv.html). You can use JPQL queries, but this will lead to rather complicated code and the impossibility of checking the queries during the time of compilation. Criteria API also allows writing queries with validation while compiling and IDE tips.

### Introduction

JPQL is a convenient language for writing database queries. It does not depend on the database type and supports classes and attributes. But there are some significant drawbacks: it is possible to detect an error in the query only at the stage of its implementation and the absence of IDE tips.

[Spring Data](https://docs.spring.io/spring-data/commons/docs/current/reference/html/) provides ready implementations to create the DAO, they are called *Repository*. Spring Data Repositories allow writing fewer queries, it is even possible to write just method signatures and Spring will make queries for them by itself.

```java
@Entity
@Table
public class Author {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Integer id;
private String familyName;
private String name;
private Integer bookId;
…
}


@Entity
@Table
public class Book {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Integer id;
private String label;
private Integer pageCount;
…
}
```

And the repository:

```java
@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
}
```

All goes well as long as you need simple queries, but difficulties arise when the conditions of the query change at runtime. For example, if you request a list with filtering by columns from different models. In this case, it is better to use Criteria API.

### Criteria API and its use

Criteria API is a type-safe API for composing JPQL queries. There are alternatives of Criteria API, such as jOOQ and QueryDSL, but they are not included in the standard of Java and will not be covered in this article.

To create your own repository queries using Criteria API, you must create an interface, let's call it *BookRepositoryCustom* and a class implementing this interface. When the interface is being implemented, the name of the class should coincide with the name of the heir repository JpaRepository, with the addition of "Impl" (this is mandatory).

The interface will have one method signature with arguments which the data will be filtered by (the title, name, and surname of the author).

```java
public interface BookRepositoryCustom {
List findAll(String bookLabel, String authorFamilyName, String authorName);
}
```

```java
public class BookRepositoryImpl implements BookRepositoryCustom {
```

```java
@PersistenceContext
private EntityManager entityManager;
```

```java
@Override
public List findAll(String bookLabel, String authorFamilyName, String authorName) {
CriteriaBuilder cb = entityManager.getCriteriaBuilder();
CriteriaQuery query = cb.createQuery(BookDto.class);
Root bookRoot = query.from(Book.class);
Root authorRoot = query.from(Author.class);
```

```java
List filterPredicates = new ArrayList<>();
filterPredicates.add(cb.equal(bookRoot.get("authorId"), authorRoot.get("id")));
if (bookLabel != null && !bookLabel.isEmpty()) {
filterPredicates.add(cb.like(bookRoot.get("label"), bookLabel)) ;
} else if (authorFamilyName != null && !authorFamilyName.isEmpty()) {
filterPredicates.add(cb.like(authorRoot.get("familyName"), authorFamilyName));
} else if (authorName != null && !authorName.isEmpty()) {
filterPredicates.add(cb.like(authorRoot.get("name"), authorName));
}
query.select(cb.construct(BookDto.class,
bookRoot.get("label"), authorRoot.get("familyName"), authorRoot.get("name"), bookRoot.get("pageCount")))
.where(cb.and(filterPredicates.toArray(new Predicate[0])))
);
return entityManager.createQuery(query).getResultList();
}
}
```

You often need to return data not only from one model but also from the one associated with it. In this case, you can create a DTO class with all necessary fields and return the copies. To do that we use 'construct' call to Criteria API query for CriteriaBuilder with the first argument – the type of DTO and subsequent arguments for the constructor.
```java
public class BookDto {
private String label;
private String authorFamilyName;
private String authorName;
private Integer pageCount;
```

```java
public BookDto(String label, String authorFamilyName, String authorName, Integer pageCount) {
this.label = label;
this.authorFamilyName = authorFamilyName;
this.authorName = authorName;
this.pageCount = pageCount;
}
…
}
```
Now it's better, there is a block in which depending on what fields are used, search conditions, instances of the class Predicate from the package of Criteria API are added.

Predicate is an expression often used that returns 'true' or 'false'. Predicates are created using QueryBuilder.

```java
…
if (bookLabel != null && !bookLabel.isEmpty()) {
filterPredicates.add(cb.like(bookRoot.get("label"), bookLabel))   ;
} else if (authorFamilyName != null && !authorFamilyName.isEmpty()) {
filterPredicates.add(cb.like(authorRoot.get("familyName"), authorFamilyName));
} else if (authorName != null && !authorName.isEmpty()) {
filterPredicates.add(cb.like(authorRoot.get("name"), authorName));
}
…
```

In addition to the LIKE conditions, you can use equals, IN, BETWEEN and others, which are suitable for different data types. You can also use OR, AND to create more complex conditions.

When a large number of records is expected, we will definitely need a pagination in the response. Although the Criteria API doesn't support Pageable, pagination is easy to implement.

We will add a new method signature to the interface BookRepositoryCustom:

```java
Page findAllPage(String bookLabel, String authorFamilyName, String authorName, Pageable pageable);
```

And the corresponding implementation:

```java
@Override
public Page findAllPage(String bookLabel, String authorFamilyName, String authorName, Pageable pageable) {
…
query.select(cb.construct(BookDto.class,
bookRoot.get("label"), authorRoot.get("familyName"), authorRoot.get("name"), bookRoot.get("pageCount")))
.where(cb.and(filterPredicates.toArray(new Predicate[0])));
TypedQuery q = entityManager.createQuery(query);
q.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
q.setMaxResults(pageable.getPageSize());
return new PageImpl<>(q.getResultList(), pageable,
getAllCount(bookLabel, authorFamilyName, authorName));
}
```

```java
private Long getAllCount(String bookLabel, String authorFamilyName, String authorName) {
CriteriaBuilder cb = entityManager.getCriteriaBuilder();
CriteriaQuery query = cb.createQuery(Long.class);
Root bookRoot = query.from(Book.class);
Root authorRoot = query.from(Author.class);
```

```java
List filterPredicates = new ArrayList<>();
filterPredicates.add(cb.equal(bookRoot.get("authorId"), authorRoot.get("id")));
if (bookLabel != null && !bookLabel.isEmpty()) {
filterPredicates.add(cb.like(bookRoot.get("label"), bookLabel))   ;
} else if (authorFamilyName != null && !authorFamilyName.isEmpty()) {
filterPredicates.add(cb.like(authorRoot.get("familyName"), authorFamilyName));
} else if (authorName != null && !authorName.isEmpty()) {
filterPredicates.add(cb.like(authorRoot.get("name"), authorName));
}
query.select(cb.count(bookRoot)).where(cb.and(filterPredicates.toArray(new Predicate[0])));
return entityManager.createQuery(query).getSingleResult();
}
```

### Conclusion

The article describes how to use Сriteria API and Spring Data, as well as some of their benefits. Using Criteria API instead of JPQL queries allows us to avoid errors that can arise at the stage of code writing or compilation. Besides, it allows us to write queries with changing conditions at runtime, which is often necessary when displaying lists with filters by columns.