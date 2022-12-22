# transformOutputArraysToIds

Transform prisma outputs relations to IDs of string

```ts
  import { includeReferencesIDs, transformOutputArraysToIds } from '@ra-libs/nestjs'

  findOne(id: string): Promise<Seller> {
    return this.prisma.seller.findUnique({
      where: { id },
      include: includeReferencesIDs(["sales"])
    }).then(transformOutputArraysToIds)
  }
```