<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">React Admin Nestjs lib</p>
    <p align="center">
    <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  </p>

![Workflow status](https://github.com/ra-libs/nestjs/actions/workflows/main.yml/badge.svg)

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
import { PrismaRAInterceptor } from '@ra-libs/nestjs'rom '@tech/olist-commons';

@UseInterceptors(PrismaRAInterceptor)
export class CatsController {}
```

> Check nestjs interceptor binding [documentation](https://docs.nestjs.com/interceptors#binding-interceptors)


## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Contributing

Contributions welcome! See [Contributing](CONTRIBUTING.md).

## Author

@RabahZeineddine

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
