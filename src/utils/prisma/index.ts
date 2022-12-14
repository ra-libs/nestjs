import { unflatten } from 'flat';
import * as lodash from 'lodash';
import { DateTime } from 'luxon';
import { validate as uuidValidate } from 'uuid';

export function withTextSearch(query: any = {}, fields: Array<string> = []) {
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

  return !qValue
    ? query
    : {
      ...query,
      where: {
        ...where,
        OR: [
          ...newOR,
          ...fields.map((field: string) => ({
            [field]: {
              contains: qValue,
              mode: 'insensitive',
            },
          })),
        ],
      },
    };
}

export function transformInputsToPrisma(
  oldData: object,
  newData: object,
  relations: string[],
): any {
  const data = { ...newData };
  const keys = Object.keys(data);
  for (const key of keys) {
    if (
      relations.includes(key) &&
      Array.isArray(data[key]) &&
      data[key].every((item) => typeof item == 'string' && uuidValidate(item))
    ) {
      const disconnect = lodash.difference(oldData[key], data[key]);
      data[key] = {
        disconnect: disconnect.map((id) => ({ id })),
        connect: data[key].map((id) => ({ id })),
      };
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
