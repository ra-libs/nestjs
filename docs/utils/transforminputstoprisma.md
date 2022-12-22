# transformInputsToPrisma

Transform relation input data to handle it in prisma syntax using connect, disconnect methods

```typescript
import { transformInputsToPrisma } from '@ra-libs/nestjs'; 

@Injectable()
export class Service {

private relations: string[] = ["clients"]

async update(id: string, newSale: UpdateSaleDto) {
  const sale = await this.findOne(id)
  const updateData = transformInputsToPrisma(sale, newSale, this.relations) as any
  return this.prisma.sale.update({
    where: { id },
    data: updateData,
  });
}

}
```
