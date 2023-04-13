---
id: 2126
title: 'Flexible Data Model Design'
date: '2017-06-23T15:58:41+08:00'
author: 'Irina Kolesnikova'
layout: post
image: /static/img/2017/06/Amoeba.png
categories:
    - General
tags:
    - 'data model design'
---

## Introduction

Data often changes. When it comes to integration, the data can change unpredictably. Of course, large vendors notify the community about the breaking changes in advance or give us some period for migration. However, if you implement your own component of a (distributed) system then you likely face a situation when, for example, Tom changed something, while you were working on your cool feature of a [Java](https://www.issart.com/en/lp/java-development-team/)-application and now you have to fix some unexpected failures on your side. Or a customer asked you to include some small (or big) changes in the initial specifications and next day Tom found out that his part did not seem to be working.

Usually any integration brings a new dependency into the code, when you have some model classes you bring dependencies on these classes to all the business logic you have. When your data model design changes a lot, you will have to modify all related components to integrate the model changes.

## Flexible solution for data model design

Generally you can’t eliminate the dependency on the data completely. You can reduce it as much as possible and encapsulate it in some stable pieces of code. So, what can be stable in the changing data?

And the answer is **Types**.

Indeed, how many primitive types (here I mean strings, numbers, booleans, etc.) does any programming language have? ~10-20?. How many primitive types are you using in all your code right now? Likely fewer than 10. How many different objects can you construct? Infinitely many.

## Implementation

Why can’t we just use something like raw json or xml as the mode implementation? We can’t, because they are related to the data transmission format or the data representation, but not the data model design itself.

If you have an independent model, you can implement or wrap any representation over it for the data exchange in your system.

There are some more questions we should answer before starting the implementation:

1. The representation can be complex, however, an entire object is flat. When you join 2 tables, for example, the result is still the flat table. Of course, you can transform this result set to the more complex structure, however, this transformation is not a part of the data access layer. The data access layer should not be responsible for the final representation. Therefore, the code like ```
    public class ModelA {
        ...;
        public List<ModelB> listOfB() {
            return this.listOfB;
        }
    }
    ```
  
    is not acceptable to use in the data access layer.
  
    You should have something like
  
    ```
    public class ModelA {
        ...;
    }
    ```
  
    ```
    public class ModelB {
    ```
  
    ```
        ...
        AId refenebceToA() {...}
    }
    ```
  
    ```
    public class ModelBDao {
    ```
  
    ```
        ...
        List<ModelB> byA(ModelA a) {...}
    }
    ```
  
    instead.
2. Mutable objects do not conform SOLID. Thus, all data representing objects should be *immutable*.
3. Multi valued fields compromise. Generally this: ```
    public class ModelA {
        ...;
        Collection<String> strings() { return this.strings; }
    }
    ```
  
    makes A mutable, but sometimes you need to read the multiple values.
  
    Depending on your situation it is possible to declare this method returning read-only collection clearly. Or you can return something like rx.Observable<String> or Stream<String> here. Upon the whole, it should be obvious that the returning value is *immutable*.

If you agree with above statements let’s move to the whole example.

### Field

```
public class Field {
    public final String name;
    public final String typedef;

    public Field(String name, String typedef) {
        this.name = name;
        this.typedef = typedef;
    }

    public boolean equals(Object other) {
        if (other == this) return  true;
        if (other == null || other.getClass() != this.getClass()) return false;
        Field otherField = (Field) other;
        return Objects.equals(name, otherField.name) &&
            Objects.equals(typedef, otherField.typedef);
    }

    public int hashCode() {
        return Objects.hash(name, typedef);
}
```

In the example I will simplify the type definition just as the string, however, you can have more complex object here.

### Value

```
public interface Value {
    boolean conform(Field field); //this method isn't mandatory, but it can be used for the validation
    Object value();
}
```

```
abstract class TypedValue implements Value {

    protected final String typedef;

    TypedValue(String typedef) {
        this.typedef = typedef;
    }

    @Override
    public boolean conform(Field field) {
        return typedef.equals(field.typedef);
    }

    public String toString() {
        return "[typedef = " + typedef + ", value = " + value() + "]";
    }

    public int hashCode() {
        return Objects.hash(typedef, value());
    }
}
```

We implement all desirable primitive values. For example,

```
public final class DateTimeValue extends TypedValue {

    private final LocalDateTime value;

    DateTimeValue(LocalDateTime value, String typedef) {
        super(typedef);
        this.value = value;
    }

    public boolean equals(Object other) {
        return this == other ||
            other != null && other.getClass() == this.getClass() &&
            Objects.equals(value, ((DateTimeValue) other).value) &&
            Objects.equals(typedef, ((DateTimeValue) other).typedef);
    }

    @Override
    public LocalDateTime value() {
        return value;
    }
}
```

```
public final class StringArrayValue extends TypedValue {

    private final String[] value;

    StringArrayValue(String[] value, String typedef) {
        super(typedef);
        this.value = value;
    }

    public boolean equals(Object other) {
        return this == other ||
            other != null && other.getClass() == this.getClass() &&
                Objects.deepEquals(value, ((StringArrayValue) other).value) &&
                Objects.equals(typedef, ((StringArrayValue) other).typedef);
    }

    @Override
    public String[] value() {
        return value;
    }
}
```

This is the basical objects you need to construcy any flat object.

Depending on your needs you can set up the type resolution for serialization/deserialization. For example, [jackon](https://github.com/FasterXML/jackson) allows us to process hierarchies correctly.

I usually use the [mix-in](https://github.com/FasterXML/jackson-docs/wiki/JacksonMixInAnnotations) approach to keep the models clean.

```
@JsonTypeInfo(use = JsonTypeInfo.Id.CUSTOM,
    include = JsonTypeInfo.As.EXISTING_PROPERTY,
    property = ResponseFieldNames.TYPE_DEF,
    visible = true
)
@JsonTypeIdResolver(ValueTypeIdResolver.class)
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public abstract class ValueMixIn {

    @JsonCreator
    public ValueMixIn(@JsonProperty(ResponseFieldNames.VALUE) int value,
                      @JsonProperty(ResponseFieldNames.TYPE_DEF) String typedef) {}

    @JsonCreator
    public ValueMixIn(@JsonProperty(ResponseFieldNames.VALUE) String value,
                      @JsonProperty(ResponseFieldNames.TYPE_DEF) String typedef) {}

    @JsonCreator
    public ValueMixIn(@JsonProperty(ResponseFieldNames.VALUE) long value,
                      @JsonProperty(ResponseFieldNames.TYPE_DEF) String typedef) {}

    @JsonCreator
    public ValueMixIn(@JsonProperty(ResponseFieldNames.VALUE) LocalDate value,
                      @JsonProperty(ResponseFieldNames.TYPE_DEF) String typedef) {}

    @JsonCreator
    public ValueMixIn(@JsonProperty(ResponseFieldNames.VALUE) LocalDateTime value,
                      @JsonProperty(ResponseFieldNames.TYPE_DEF) String typedef) {}

    @JsonCreator
    public ValueMixIn(@JsonProperty(ResponseFieldNames.VALUE) String[] value,
                      @JsonProperty(ResponseFieldNames.TYPE_DEF) String typedef) {}

    @JsonCreator
    public ValueMixIn(@JsonProperty(ResponseFieldNames.VALUE) boolean value,
                      @JsonProperty(ResponseFieldNames.TYPE_DEF) String typedef) {}

    @JsonCreator
    public ValueMixIn(@JsonProperty(ResponseFieldNames.TYPE_DEF) String typedef) {}
}

```

To set up the types resolution you should implement the TypeIdResolver interface. The below code can be a point to start with.

```
public class ValueTypeIdResolver extends TypeIdResolverBase {
    private JavaType baseType;
    @Override
    public void init(JavaType baseType) {
        this.baseType = baseType;
    }

    @Override
    public String idFromValue(Object value) {
        Class<?> cls = Optional.ofNullable(value).map(Object::getClass)
            .orElseThrow(() -> new IllegalArgumentException("Can't define the possible type" +
                "for null"));
        return ValueType.of(cls).map(ValueType::valueTypeId).orElseThrow(
            () -> new IllegalArgumentException("Unsupported suggested type")
        );
    }

    @Override
    public String idFromValueAndType(Object value, Class<?> suggestedType) {
        return Optional.ofNullable(value).map(v-> {
            if (!suggestedType.isAssignableFrom(value.getClass())) {
                throw new IllegalArgumentException("value can't be converted to suggested type");
            }
            return idFromValue(v);
        }).orElse(
            ValueType.NULL_TYPE.valueTypeId()
        );

    }

    @Override
    public JavaType typeFromId(DatabindContext context, String id) {
        return ValueType.of(id)
            .map(vt ->
                Optional.ofNullable(context)
                    .map(c -> c.getTypeFactory().constructType(vt.supported()))
                    .orElse(TypeFactory.defaultInstance().constructType(vt.supported()))
            ).orElse(
                baseType
            );
    }

    @Override
    public String getDescForKnownTypeIds() {
        return ValueType.knownTypesDescription();
    }

    @Override
    public JsonTypeInfo.Id getMechanism() {
        return JsonTypeInfo.Id.CUSTOM;
    }
}
```

```
public enum ValueType {
    INT(IntValue.class),
    LONG(LongValue.class),
    DATE(DateValue.class),
    DATE_TIME(DateTimeValue.class),
    STRING(StringValue.class),
    STRING_COLLECTION(StringArrayValue.class),
    NULL_TYPE(NullValue.class) {
        public Value create() {
            return new NullValue(valueTypeId());
        }
    };
  
    private final Class<?> supported;

    ValueType(Class<?> supported) {
        this.supported = supported;
    }
  
    public String valueTypeId() {
        return name().toLowerCase();
    }
  
    public boolean isSupported(Class<?> cls) {
        return supported.equals(cls);
    }

    public Class<?> supported() {
        return supported;
    }
  
    public static Optional<ValueType> of(Class<?> cls) {
        return Stream.of(values())
            .filter(v -> v.isSupported(cls))
            .min(Comparator.comparingInt(Enum::ordinal));
    }
  
    public static Optional<ValueType> of(String typeId) {
        return Stream.of(values())
            .filter(v -> v.valueTypeId().equalsIgnoreCase(typeId))
            .findFirst();
    }

    public static String knownTypesDescription() {
        return Stream.of(values())
            .map(ValueType::valueTypeId)
            .collect(Collectors.joining(", "));
    }
}
```

Then depending on your needs you can extend the Value interface. For example, if you need to write a passed value in the database you can do something like this:

```
public class Schema {
    private final String name;
    private final Field[] fields;

    private Schema(String name, Field[] fields) {
        this.name = name;
        this.fields = fields;
    }

    public boolean equals(Object other) {
        if (other == this) return  true;
        if (other == null || other.getClass() != this.getClass()) return false;
        Schema otherSchema = (Schema) other;
        return Objects.equals(name, otherSchema.name) &&
            Arrays.equals(fields, otherSchema.fields);
    }

    public int hashCode() {
        return Objects.hash(name, fields);
    }

    public String name() {
        return name;
    }

    public Stream<Field> fields() {
        return Stream.of(fields);
    }
}

public class Dao {
    ...
    // Or you can pass the schema into the constructor.
    // You can validate the entity against the schema or skip the invalid fields
    // and log some warnings for example
    int write(Map<Field, Value> entity, Schema schema) {
        String query = "insert into " + schema.name() + " (" 
         + entity.keySet().stream().map(f -> f.name).collect(Collectors.joining(","))
         + ") values (" + Stream.generate(() -> "?").limit(entity.size()).collect(Collectors.joining(","))
         + ")";
        try (PreparedStatement ps = //handle the transaction correctly,
        //for example, you can pass the creating method into the constructor and call
        //ps = factory.apply(query) here
        ) {
            //depending on the map implementation, however when you generate the query you always can store the
            //field positions in the memory
            int pos = 1;
            for (Map.Entity<Field, Value> pair : entity.entrySet()) {
                ps.setObject(pos, pair.getValue().value(),
                  resolveSqlType(pair.getKey().typedef);
                pos ++;
            }
            return ps.executeUpdate();
```

```
        } catch (//handle the transaction correctly) {...}
    }
 }
 
 //Or you can include this logic into the ValueType and use
 //ValueType.of(field.typedef).map(ValueType::sqlType).orElseThrow(...)
 //instead of this method.
 private int resolveSqlType(String type) {...}
 }
```

Finally, you will split the difficult transactions when you need to update some related objects together into the small steps executed one by one. For example,

```
... somewhere in the code ...
Dao dao = ...;
Connection transaction = ...;
Map<Field, Value> entity1 = ...;
Schema schema1 = ...;
Map<Field, Value> entity2 = ...;
Schema schema2 = ...;
QueryFactory qf = q -> transaction.prepareStatement(q);
//The business transaction starts here
try {
    transaction.setAutoCommit(false);
    dao.write(entity1, schema1, qf);
    dao.write(entity2, schema2, qf);

    transaction.commit();
} catch (Exception e) {
    transaction.rollback();
    throw e;
}
```

Or, it can be a NoSQL database. Perhaps, you will need to define the identity in the Schema class. Usually document-oriented databases are integrated with Map<String, Object> source.

Depending on the technology you need or do not need to specify the identity of the document.

```
Map<Key, Value> entity = ...
Map<String, Object> docSource = entity.entrySet().stream()
    .collect(Collectors.toMap(Map.Entry::getKey, en -> en.getValue().value()));
```

## Pros and Cons

Advantages of this solution:

- You can reuse it almost everywhere
- You can significantly reduce the amount of the code you have
- You will reduce the amount of the changeable code, so your estimations will be more accurate and costs will be smaller
- Conforms SOLID

Disadvantages:

- It isn’t kind of “traditional approach”
- Likely it is not a startup solution. However, it is easier to introduce while you do not have a lot of traditional model classes (patterns) and don’t use them intensively.
- Likely you won’t use any data access or entity framework as you can be accustomed to.

## Conclusion

Generally it doesn’t matter what kind of the application (Java applications or others) you are working on. But if you are looking for a fresh approach to make the data access code more flexible and predictable, perhaps, the above approach of using flexible data model design will solve this task for you.

Would you like to get more information about flexible data model design? Fill the contact form.