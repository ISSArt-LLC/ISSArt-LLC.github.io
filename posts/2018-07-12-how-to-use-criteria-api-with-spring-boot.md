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

`«<br></br>@Entity<br></br>@Table<br></br>public class Author {<br></br>@Id<br></br>@GeneratedValue(strategy = GenerationType.IDENTITY)<br></br>private Integer id;<br></br>private String familyName;<br></br>private String name;<br></br>private Integer bookId;<br></br>…<br></br>}<br></br>»<br></br>«<br></br>@Entity<br></br>@Table<br></br>public class Book {<br></br>@Id<br></br>@GeneratedValue(strategy = GenerationType.IDENTITY)<br></br>private Integer id;<br></br>private String label;<br></br>private Integer pageCount;<br></br>…<br></br>}<br></br>»`

And the repository:

`«<br></br>@Repository<br></br>public interface BookRepository extends JpaRepository<Book, Integer> {<br></br>}<br></br>»`

All goes well as long as you need simple queries, but difficulties arise when the conditions of the query change at runtime. For example, if you request a list with filtering by columns from different models. In this case, it is better to use Criteria API.

### Criteria API and its use

Criteria API is a type-safe API for composing JPQL queries. There are alternatives of Criteria API, such as jOOQ and QueryDSL, but they are not included in the standard of Java and will not be covered in this article.

To create your own repository queries using Criteria API, you must create an interface, let’s call it *BookRepositoryCustom* and a class implementing this interface. When the interface is being implemented, the name of the class should coincide with the name of the heir repository JpaRepository, with the addition of “Impl” (this is mandatory).

The interface will have one method signature with arguments which the data will be filtered by (the title, name, and surname of the author).

`«<br></br>public interface BookRepositoryCustom {<br></br>List findAll(String bookLabel, String authorFamilyName, String authorName);<br></br>}<br></br>»`

`«<br></br>public class BookRepositoryImpl implements BookRepositoryCustom {`

`@PersistenceContext<br></br>private EntityManager entityManager;`

`@Override<br></br>public List findAll(String bookLabel, String authorFamilyName, String authorName) {<br></br>CriteriaBuilder cb = entityManager.getCriteriaBuilder();<br></br>CriteriaQuery query = cb.createQuery(BookDto.class);<br></br>Root bookRoot = query.from(Book.class);<br></br>Root authorRoot = query.from(Author.class);`

`List filterPredicates = new ArrayList<>();<br></br>filterPredicates.add(cb.equal(bookRoot.get("authorId"), authorRoot.get("id")));<br></br>if (bookLabel != null && !bookLabel.isEmpty()) {<br></br>filterPredicates.add(cb.like(bookRoot.get("label"), bookLabel)) ;<br></br>} else if (authorFamilyName != null && !authorFamilyName.isEmpty()) {<br></br>filterPredicates.add(cb.like(authorRoot.get("familyName"), authorFamilyName));<br></br>} else if (authorName != null && !authorName.isEmpty()) {<br></br>filterPredicates.add(cb.like(authorRoot.get("name"), authorName));<br></br>}<br></br>query.select(cb.construct(BookDto.class,<br></br>bookRoot.get("label"), authorRoot.get("familyName"), authorRoot.get("name"), bookRoot.get("pageCount")))<br></br>.where(cb.and(filterPredicates.toArray(new Predicate[0])))<br></br>);<br></br>return entityManager.createQuery(query).getResultList();<br></br>}<br></br>}<br></br>»`

You often need to return data not only from one model but also from the one associated with it. In this case, you can create a DTO class with all necessary fields and return the copies. To do that we use ‘construct’ call to Criteria API query for CriteriaBuilder with the first argument – the type of DTO and subsequent arguments for the constructor.  
`«<br></br>public class BookDto {<br></br>private String label;<br></br>private String authorFamilyName;<br></br>private String authorName;<br></br>private Integer pageCount;`

`public BookDto(String label, String authorFamilyName, String authorName, Integer pageCount) {<br></br>this.label = label;<br></br>this.authorFamilyName = authorFamilyName;<br></br>this.authorName = authorName;<br></br>this.pageCount = pageCount;<br></br>}<br></br>…<br></br>}<br></br>»`  
Now it’s better, there is a block in which depending on what fields are used, search conditions, instances of the class Predicate from the package of Criteria API are added.

Predicate is an expression often used that returns ‘true’ or ‘false’. Predicates are created using QueryBuilder.

`«<br></br>…<br></br>if (bookLabel != null && !bookLabel.isEmpty()) {<br></br>filterPredicates.add(cb.like(bookRoot.get("label"), bookLabel))   ;<br></br>} else if (authorFamilyName != null && !authorFamilyName.isEmpty()) {<br></br>filterPredicates.add(cb.like(authorRoot.get("familyName"), authorFamilyName));<br></br>} else if (authorName != null && !authorName.isEmpty()) {<br></br>filterPredicates.add(cb.like(authorRoot.get("name"), authorName));<br></br>}<br></br>…<br></br>»`

In addition to the LIKE conditions, you can use equals, IN, BETWEEN and others, which are suitable for different data types. You can also use OR, AND to create more complex conditions.

When a large number of records is expected, we will definitely need a pagination in the response. Although the Criteria API doesn’t support Pageable, pagination is easy to implement.

We will add a new method signature to the interface BookRepositoryCustom:

`«<br></br>Page findAllPage(String bookLabel, String authorFamilyName, String authorName, Pageable pageable);<br></br>»`

And the corresponding implementation:

`«<br></br>@Override<br></br>public Page findAllPage(String bookLabel, String authorFamilyName, String authorName, Pageable pageable) {<br></br>…<br></br>query.select(cb.construct(BookDto.class,<br></br>bookRoot.get("label"), authorRoot.get("familyName"), authorRoot.get("name"), bookRoot.get("pageCount")))<br></br>.where(cb.and(filterPredicates.toArray(new Predicate[0])));<br></br>TypedQuery q = entityManager.createQuery(query);<br></br>q.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());<br></br>q.setMaxResults(pageable.getPageSize());<br></br>return new PageImpl<>(q.getResultList(), pageable,<br></br>getAllCount(bookLabel, authorFamilyName, authorName));<br></br>}`  
`private Long getAllCount(String bookLabel, String authorFamilyName, String authorName) {<br></br>CriteriaBuilder cb = entityManager.getCriteriaBuilder();<br></br>CriteriaQuery query = cb.createQuery(Long.class);<br></br>Root bookRoot = query.from(Book.class);<br></br>Root authorRoot = query.from(Author.class);<br></br>`  
`    List filterPredicates = new ArrayList<>();<br></br>filterPredicates.add(cb.equal(bookRoot.get("authorId"), authorRoot.get("id")));<br></br>if (bookLabel != null && !bookLabel.isEmpty()) {<br></br>filterPredicates.add(cb.like(bookRoot.get("label"), bookLabel))   ;<br></br>} else if (authorFamilyName != null && !authorFamilyName.isEmpty()) {<br></br>filterPredicates.add(cb.like(authorRoot.get("familyName"), authorFamilyName));<br></br>} else if (authorName != null && !authorName.isEmpty()) {<br></br>filterPredicates.add(cb.like(authorRoot.get("name"), authorName));<br></br>}<br></br>query.select(cb.count(bookRoot)).where(cb.and(filterPredicates.toArray(new Predicate[0])));<br></br>return entityManager.createQuery(query).getSingleResult();<br></br>}<br></br>»`

### Conclusion

The article describes how to use Сriteria API and Spring Data, as well as some of their benefits. Using Criteria API instead of JPQL queries allows us to avoid errors that can arise at the stage of code writing or compilation. Besides, it allows us to write queries with changing conditions at runtime, which is often necessary when displaying lists with filters by columns.