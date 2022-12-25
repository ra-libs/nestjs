# transformOutputArraysToIds

Transform prisma outputs relations to an array of strings instead of array of objects.

## Usage

```typescript
import { includeReferencesIDs } from '@ra-libs/nestjs'

@Injectable()
export class Service {
    
    findOne(id: string): Promise<Seller> {
        return this.prisma.seller.findUnique({
            where: { id },
            include: includeReferencesIDs(["sales"])
        })
    }
}
```

this will return a JSON
```typescript
{
    "id": "<id>",
    ...
    "sales": [
        { "id": "<id_1>" },
        { "id": "<id_2>" }
    ]
}
```

Using the transformOutputArraysToIds method as follow

```typescript
import { includeReferencesIDs, transformOutputArraysToIds } from '@ra-libs/nestjs'

@Injectable()
export class Service {
    
    findOne(id: string): Promise<Seller> {
        return this.prisma.seller.findUnique({
            where: { id },
            include: includeReferencesIDs(["sales"])
        }).then(transformOutputArraysToIds)
    }
}
```

will return a JSON 
```typescript
{
    "id": "<id>",
    ...
    "sales": [
        "<id_1>",
        "<id_2>"
    ]
}
```

This is useful with react-admin as it expects an array of IDs instead of array of objects.