# getFilterValue

the getFilterValue it returns the filter value based on the key and the value type.

### Example with comparison operator
it extracts the comparison operator from the key and mount the value based on it.

```typescript
import { getFilterValue } from '@ra-libs/nestjs';

const value = getFilterValue('age__gt', 18);
```

the value will be 

```typescript
{
    "gt": 18
}
```

the getFilterValue supports these prisma operators
* gt
* gte
* lt
* lte
* not
* int

### Example with array value

```typescript
import { getFilterValue } from '@ra-libs/nestjs';

const value = getFilterValue('clients', ["id_1", "id_2"]);
```

the value will be 

```typescript
{
    "in": ["id_1", "id_2"]
}
```

### Example with boolean value

```typescript
import { getFilterValue } from '@ra-libs/nestjs';

const value = getFilterValue('is_published', true);
```

the value will be 

```typescript
{
    "is_published": true
}
```

### Any other value type

```typescript
import { getFilterValue } from '@ra-libs/nestjs';

const value = getFilterValue('firstName', "John");
```

the value will be 

```typescript
{
    "contains": "John",
    "mode": "insensitive"
}
```