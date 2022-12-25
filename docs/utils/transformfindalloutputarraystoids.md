# transformFindAllOutputArraysToIds

Transform prisma outputs relations to an array of strings instead of array of objects. this method uses the [transformOutputArraysToIds](./transformoutputarraystoids.md) method but it handles the $transaction response as it returns an array of data and the count field.

## Usage

```typescript

@Injectable()
export class Service {
    
  findAll(query: any): Promise<[Client[], number]> {
    const where = query.where || {};
    return this.prisma.$transaction([
      this.prisma.client.findMany(query),
      this.prisma.client.count({ where }),
    ]);
  }
}
```

this will return a JSON
```typescript
[
    [
        {
            "id": "<id>",
            ...
            "sales": [
                { "id": "<id_1>" },
                { "id": "<id_2>" }
            ]
        }
    ],
    1
]
```

Using the transformFindAllOutputArraysToIds method as follow

```typescript
import { transformFindAllOutputArraysToIds } from '@ra-libs/nestjs'

@Injectable()
export class Service {
    
  findAll(query: any): Promise<[Client[], number]> {
    const where = query.where || {};
    return this.prisma.$transaction([
      this.prisma.client.findMany(query),
      this.prisma.client.count({ where }),
    ]).then(transformFindAllOutputArraysToIds)
  }
}
```

will return a JSON 
```typescript
[
    [
        {
            "id": "<id>",
            ...
            "sales": [
                "<id_1>",
                "<id_2>"
            ]
        }
    ],
    1
]
```

This is useful with react-admin as it expects an array of IDs instead of array of objects.