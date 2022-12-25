# withFilterField

withFilterField method adds a new filter field (key/value) to the prisma query.

### Usage

```typescript
import { withFilterField } from '@ra-libs/nestjs';

query = withFilterField(query, 'firstName', 'John')
```

the query value will be
```typescript
{
    ...query,
    where: {
        ...
        OR: [
            ...,
            {
                firstName: {
                    contains: 'John',
                    mode: 'insensitive'
                }
            }
        ]
    }
}
```