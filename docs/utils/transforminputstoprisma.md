# transformInputsToPrisma

Transform relation input data to handle it in prisma syntax using connect, disconnect methods

## Usage

```typescript
import { transformInputsToPrisma } from '@ra-libs/nestjs'; 

@Injectable()
export class Service {

  private relations: string[] = ["clients"]

  async update(id: string, newSale: UpdateSaleDto) {
    const oldSale = await this.findOne(id)
    const updateData = transformInputsToPrisma(newSale, oldSale, this.relations) as any
    return this.prisma.sale.update({
      where: { id },
      data: updateData,
    });
  }

}
```

In the example above it will transform the clients relations in the sale object from 

```typescript
{
  "clients": ["<id>"]
}
```

to
```typescript
{
  "clients": {
    "connect": [
      {"id": "<id>"}
    ]
  }
}
```

> If the oldSale has more than one clients and the newSale does not have (the user deleted some users from the sale) then the transformInputsToPrisma will add the removed clients to the disconnect field
```typescript
{
  "clients": {
    "disconnect": [
      { "id": "<id_1>" }
    ],
    "connect": [
      { "id": "id_2" }
    ]
  }
}
```
