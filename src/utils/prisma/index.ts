import { unflatten } from 'flat';
import * as lodash from 'lodash';
import { DateTime } from 'luxon';
import { validate as uuidValidate } from 'uuid';

/**
 *
 * @param query prisma query
 * @param fields fields to be filtered by
 * @returns prisma query
 *
 * @example
 * query = withQSearch(query, ["street","client.firstName"])
 */
export function withQSearch(query: any = {}, fields: string[] = []) {
  const { where = {} } = query;
  const { OR = [] } = where;

  const [newOR, qValue] = OR.reduce(
    (acc, value: any) => {
      const { q } = value;
      if (!q) return [[...acc[0], value], acc[1]];
      const { contains = undefined } = q;
      if (contains) return [acc[0], contains];
      return acc;
    },
    [[], ''],
  );

  if (!qValue) return query;

  query = {
    ...query,
    where: {
      ...where,
      OR: [...newOR],
    },
  };

  fields.forEach((field) => {
    query = withFilterField(query, field, qValue);
  });

  return query;
}

export function transformInputsToPrisma(
  newData: object,
  oldData: object = {},
  relations: string[] = [],
): any {
  const data = transformOutputArraysToIds({ ...newData });
  const cloneOldData = transformOutputArraysToIds({ ...oldData });
  const keys = Object.keys(data);

  for (const key of keys) {

    // Identify relation keys or arrays
    if (
      (relations.includes(key) && Array.isArray(data[key])) ||
      (Array.isArray(data[key]) &&
        data[key].every(
          (item) => typeof item == 'string' && uuidValidate(item),
        ))
    ) {

      // map the existed and new relations to be connected.
      const connect = data[key].map((id) => ({ id }));

      // Clear the relation key
      data[key] = {}

      const disconnect = lodash.difference(cloneOldData[key], data[key]);

      // disconnect relation only if it needs to.
      if (disconnect.length > 0) data[key]['disconnect'] = disconnect.map((id) => ({ id }))

      // connect relation only if it needs to.
      if (connect.length > 0) data[key]['connect'] = connect
    } else if (key.endsWith('Id') && key.length > 2) {
      const id = data[key];
      delete data[key];
      data[key.substring(0, key.length - 2)] = {
        connect: { id },
      };
    }
  }
  return data;
}

export function transformOutputArraysToIds<T = any>(data: T): T {
  if (!data || data.constructor !== {}.constructor) return data;
  const keys = Object.keys(data);
  for (const key of keys) {
    if (
      Array.isArray(data[key]) &&
      data[key].length > 0 &&
      data[key].every((item) => typeof item == 'object' && item?.id)
    ) {
      data[key] = data[key].map((item) => item.id) as any;
    }
  }
  return data;
}

export function transformFindAllOutputArraysToIds<T = any>(
  data: [T[], number],
): [T[], number] {
  let items = data[0];
  items = items.map((item) => {
    return transformOutputArraysToIds(item);
  });
  data[0] = items;
  return data;
}

export function includeReferencesIDs(references: string[]) {
  return references.reduce((acc, reference) => {
    acc[reference] = {
      select: {
        id: true,
      },
    };
    return acc;
  }, {});
}

/**
 *
 * @param query prisma query
 * @param relations entity relations ex: ["client"]
 * @returns query
 */
export function includeRelations(query: any, relations: string[]) {
  const flattenKeys = relations.reduce((acc, relation) => {
    const key = relation.split('.').join('.select.');
    acc[key] = true;
    return acc;
  }, {});

  return {
    ...query,
    include: unflatten(flattenKeys),
  };
}

export function removeOutputRelations<T = any | any[] | [any[], number]>(
  data: T,
  relations: string[],
): T {
  let output: any = {};
  if (!data) return data;
  if (Array.isArray(data) && data.length == 1) output = [...data];
  if (Array.isArray(data) && data.length == 2) output = [...data[0]];
  else output = [{ ...data }];

  output = output.reduce((acc, item) => {
    item = Object.keys(item).reduce((innerAcc, key) => {
      if (!relations.includes(key)) innerAcc[key] = item[key];
      return innerAcc;
    }, {});
    acc.push(item);
    return acc;
  }, []);

  if (Array.isArray(data) && data.length == 1) return output;
  if (Array.isArray(data) && data.length == 2) return [output, data[1]] as T;
  return output[0];
}

export function getFilterValue(key: string, value: any) {
  value = parseFilterValue(value);

  const comparisonRegex = new RegExp(/__(((g|l)te?)|(not)|(in))/, 'g');
  const comparisonMatch = comparisonRegex.exec(key);
  if (comparisonMatch && comparisonMatch?.[1]) {
    const operator = comparisonMatch[1];
    return { [operator]: value };
  }

  if (typeof value === 'boolean') return value;

  if (Array.isArray(value))
    return {
      in: value,
    };

  return {
    contains: value,
    mode: 'insensitive',
  };
}

export function withFilterField(query: any, key: string, value: any) {
  const conjunctionOperator = getConjunctionOperator(key);

  if (!query.where) query.where = {};
  if (!query.where?.[conjunctionOperator])
    query.where[conjunctionOperator] = [];

  const synthesizedKey = synthesizeKey(key);

  query.where[conjunctionOperator].push(
    unflatten({
      [synthesizedKey]: getFilterValue(key, value),
    }),
  );
  return query;
}

export function synthesizeKey(key: string): string {
  return key.split('__')[0];
}

export function getConjunctionOperator(key: string): string {
  const conjunctionRegex = new RegExp(/__((OR)|(AND))/, 'g');
  const conjunctionMatch = conjunctionRegex.exec(key);
  if (conjunctionMatch && conjunctionMatch?.[1]) return conjunctionMatch[1];
  return 'OR';
}

export function parseFilterValue(value: any) {
  if (DateTime.fromISO(value).isValid)
    return DateTime.fromISO(value).toString();
  return value;
}
