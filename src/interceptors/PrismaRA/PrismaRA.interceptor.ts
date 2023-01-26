import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { format as contentRangeFormat } from 'content-range';
import { Request, Response } from 'express';
import { flatten } from 'flat';
import { ParsedQs } from 'qs';
import { map, Observable } from 'rxjs';

import {
  transformFindAllOutputArraysToIds,
  transformOutputArraysToIds,
  withFilterField,
} from '../../utils';
import {
  ContentRangeOptions,
  Data,
  PrismaRAOptions,
} from './PrismaRA.interfaces';

export class PrismaRAInterceptor implements NestInterceptor {
  private readonly options: PrismaRAOptions = {};

  private logger: Logger;

  constructor(
    options: PrismaRAOptions = {
      pageName: 'page',
      perPageName: 'perPage',
      headerIdentifier: 'react-admin-agent',
    },
  ) {
    this.options.pageName = options.pageName;
    this.options.perPageName = options.perPageName;
    this.options.headerIdentifier = options.headerIdentifier;
    this.logger = new Logger(PrismaRAInterceptor.name);
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    if (request?.headers?.[this.options.headerIdentifier]) {
      request.query = this.parsePrismaFilters(request);

      return next.handle().pipe(
        map((data: Data<any>) => {
          const handler = context.getHandler();
          const response = context.switchToHttp().getResponse<Response>();

          if (request.method == 'POST') {
            response.status(HttpStatus.OK);
          }

          if (handler.name.includes('findAll')) {
            const page =
              request.query?.[this.options.pageName]?.toString() ?? '1';
            const limit =
              request.query?.[this.options.perPageName]?.toString() ?? '10';
            const resource = this.getResourceFromRequest(request);

            response.setHeader(
              'Access-Control-Expose-Headers',
              'Content-Range',
            );
            response.setHeader(
              'Content-Range',
              this.buildContentRangeHeader({
                page,
                limit,
                count: data[1],
                resource: resource,
              }),
            );
            return transformFindAllOutputArraysToIds(data)[0];
          }

          return transformOutputArraysToIds(data);
        }),
      );
    }
    return next.handle().pipe();
  }

  private parsePrismaFilters(request: Request): ParsedQs {
    const parsedQuery: ParsedQs = {};

    try {
      const {
        filter: requestFilter = '{}',
        sort: requestSort = '[]',
        range: requestRange = '[]',
      } = request.query as any;

      const filter = flatten(JSON.parse(requestFilter), { safe: true });
      const sort = JSON.parse(requestSort);
      const range = JSON.parse(requestRange);

      if (Object.keys(filter).length > 0) {
        const where: any = { AND: [], OR: [] };

        if (Object.keys(filter).length > 0) {
          Object.keys(filter).forEach((key) => {
            withFilterField({ where }, key, filter[key]);
          });
        }

        if (where.AND.length == 0) delete where.AND;
        if (where.OR.length == 0) delete where.OR;
        parsedQuery['where'] = where;
      }

      if (sort && sort.length == 2) {
        parsedQuery['orderBy'] = [
          {
            [sort?.[0]]: sort?.[1]?.toLowerCase(),
          },
        ];
      }

      if (Array.isArray(range) && range.length == 2) {
        parsedQuery['skip'] = this.getSkipFromRange(range) as any;
        parsedQuery['take'] = this.getTakeFromRange(range) as any;
      }
    } catch (error) {
      this.logger.error(error);
    }

    return parsedQuery;
  }

  private getSkipFromRange(range: string[] | ParsedQs[]): number {
    return +range[0];
  }

  private getTakeFromRange(range: string[] | ParsedQs[]): number {
    return +range[1] - +range[0] + 1;
  }

  private getResourceFromRequest(request: Request): string {
    const latestResourceSplitted = request.url?.split('/');
    const resource = latestResourceSplitted[latestResourceSplitted.length - 1];
    return resource.split('?')[0];
  }

  private buildContentRangeHeader(options: ContentRangeOptions): string {
    const limit = Number(options.limit);
    let endIndex: number = Number(options.page) * limit;
    const startIndex: number = endIndex - limit;

    if (endIndex > options.count) {
      endIndex = options.count + 1;
    }

    return contentRangeFormat({
      start: startIndex,
      end: endIndex - 1,
      size: options.count,
      unit: options.resource,
    });
  }
}
