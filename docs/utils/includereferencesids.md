# includeReferencesIDs

Include relations IDs

## Usage

```typescript
import { includeReferencesIDs, transformOutputArraysToIds } from '@ra-libs/nestjs'


@Injectable()
export class Service {
  
  findOne(id: string): Promise<Client> {
    return this.prisma.client
      .findUnique({
        where: { id },
        include: includeReferencesIDs(["addresses", "documents"])
      })
      .then(transformOutputArraysToIds);
  }
}
```

the includeReferencesIDs used above will return a JSON

```typescript
{
  "addresses": {
    select: {
      id: true
    }
  },
  "documents": {
    select: {
      id: true
    }
  }
}
```