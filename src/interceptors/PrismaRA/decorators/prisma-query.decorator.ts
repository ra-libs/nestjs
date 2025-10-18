import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { PrismaQueryRequest } from '../types';

export const PrismaQuery = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<PrismaQueryRequest>();
    return request.prismaQuery;
  },
);
