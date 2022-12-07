import * as lodash from 'lodash';
import { validate as uuidValidate } from 'uuid';

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

export function transformInputsToConnect(data: object): any {
  const keys = Object.keys(data);
  for (const key of keys) {
    if (
      Array.isArray(data[key]) &&
      data[key].every((item) => typeof item == 'string' && uuidValidate(item))
    ) {
      data[key] = {
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
