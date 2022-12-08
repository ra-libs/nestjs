export interface PrismaRAOptions {
  pageName?: string;
  perPageName?: string;
  headerIdentifier?: string;
}

/**
 * Data interface
 */
export type Data<T> = T | [T[], number];

export interface ContentRangeOptions {
  page: string;
  limit: string;
  count: number;
  resource: string;
}
