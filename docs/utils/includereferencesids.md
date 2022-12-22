# includeReferencesIDs

Include references IDs

```typescript
import { includeReferencesIDs, transformOutputArraysToIds } from '@ra-libs/nestjs'

findOne(id: string): Promise<Client> {
  return this.prisma.client
    .findUnique({
      where: { id },
      include: includeReferencesIDs(["addresses", "passports", "sales", "documents"])
    })
    .then(transformOutputArraysToIds);
```
