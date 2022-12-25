# removeOutputRelations

Remove relations fields from prisma results.

## Usage

```typescript
import { removeOutputRelations } from '@ra-libs/nestjs'

@Injectable()
export class Service {

    private relations = ["client", "seller"]

    return this.prisma.$transaction([
      this.prisma.document.findMany(query),
      this.prisma.document.count({ where: query.where || {} }),
    ]).then(data => {
      return removeOutputRelations(data, this.relations)
    })
}
```

the removeOutputRelations used above will remove the client and seller field from the final results.