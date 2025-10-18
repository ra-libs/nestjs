import { Request } from 'express';
import { ParsedQs } from 'qs';

export interface PrismaQueryRequest extends Request {
  prismaQuery: ParsedQs;
}
