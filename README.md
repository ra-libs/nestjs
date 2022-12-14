<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">React Admin Nestjs lib</p>
    <p align="center">
    <a href="https://www.npmjs.com/org/ra-libs" target="_blank"><img src="https://img.shields.io/npm/v/@ra-libs/nestjs.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/org/ra-libs" target="_blank"><img src="https://img.shields.io/npm/l/@ra-libs/nestjs.svg" alt="Package License" /></a>
    <a href="https://github.com/ra-libs/nestjs/actions/workflows/semantic-release.yml/badge.svg" target="_blank"><img src="https://github.com/ra-libs/nestjs/actions/workflows/semantic-release.yml/badge.svg" alt="Publish Status" /></a>
  </p>


This Package uses [semantic-release](https://github.com/semantic-release/semantic-release) to publish new versions. Check [Angular Commit Message Conventions](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format) for new commits

### Installation

Run npm install

```bash
npm install @ra-libs/nestjs
```

## Interceptors

### PrismaRAInterceptor

#### Global usage

```ts
// main.ts

import { PrismaRAInterceptor } from '@ra-libs/nestjs'

async function bootstrap() {

  const app = await NestFactory.create(AppModule, { cors: true });

  // ...
  app.useGlobalInterceptors(new PrismaRAInterceptor());
  // ...
}

bootstrap();

```

#### Per controller usage

```ts
import { PrismaRAInterceptor } from '@ra-libs/nestjs';

@UseInterceptors(PrismaRAInterceptor)
export class CatsController {}
```

> Check nestjs interceptor binding [documentation](https://docs.nestjs.com/interceptors#binding-interceptors)


## Utils

### transformInputsToPrisma

Transform relation input data to handle it in prisma syntax using connect, disconnect methods

```ts

  private relations: string[] = ["clients"]

  async update(id: string, newSale: UpdateSaleDto) {
    const sale = await this.findOne(id)
    const updateData = transformInputsToPrisma(sale, newSale, this.relations) as any
    return this.prisma.sale.update({
      where: { id },
      data: updateData,
    });
  }
```

### includeReferencesIDs

Include references IDs

```ts
  import { includeReferencesIDs, transformOutputArraysToIds } from '@ra-libs/nestjs'

  findOne(id: string): Promise<Client> {
    return this.prisma.client
      .findUnique({
        where: { id },
        include: includeReferencesIDs(["addresses", "passports", "sales", "documents"])
      })
      .then(transformOutputArraysToIds);
```

### transformOutputArraysToIds

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

## Change Log

See [Changelog](https://github.com/ra-libs/nestjs/blob/main/CHANGELOG.md) for more information.

## Contributing

Contributions welcome! See [Contributing](https://github.com/ra-libs/nestjs/blob/main/CONTRIBUTING.md).

## Author

[@RabahZeineddine](https://github.com/RabahZeineddine)

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
