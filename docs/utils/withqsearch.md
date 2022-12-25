# withQSearch

withQSearch adds the q filter to the query, it extracts it from the query and map it to the fields.

## Usage

```typescript
import { withQSearch } from '@ra-libs/nestjs'


  findAll(query: any): Promise<[Client[], number]> {
    query = withQSearch(query, ["firstName", "lastName", "email", "document", "cellphone"])
    const where = query.where || {};
    return this.prisma.$transaction([
      this.prisma.client.findMany(query),
      this.prisma.client.count({ where }),
    ]);
  }
```

In the example shown above the withQSearch will extract the q field value and search in firstName, lastName, email, document, cellphone fields.
