# PrismaRAInterceptor

### Global usage

```typescript
import { PrismaRAInterceptor } from '@ra-libs/nestjs'

async function bootstrap() {

  const app = await NestFactory.create(AppModule, { cors: true });

  // ...
  app.useGlobalInterceptors(new PrismaRAInterceptor());
  // ...
}

bootstrap();

```

### Per controller usage

```typescript
import { PrismaRAInterceptor } from '@ra-libs/nestjs';

@UseInterceptors(PrismaRAInterceptor)
export class CatsController {}
```

> Check nestjs interceptor binding [documentation](https://docs.nestjs.com/interceptors#binding-interceptors)
