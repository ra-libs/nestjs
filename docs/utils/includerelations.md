# includeRelations

Include relations specific fields or all fields depending on the input.

## Usage

```typescript
import { includeReferencesIDs, transformOutputArraysToIds } from '@ra-libs/nestjs'

@Injectable()
export class Service {

    private relations = ["client", "seller.firstName"]

    findAll(query: any) {
        query = includeRelations(query, this.relations)
        ...
    }
}
```

the includeRelations used above will return a JSON

```typescript
{
    ...query,
    include: {
        "client": true,
        "seller.select.firstName": true
    }
}
```