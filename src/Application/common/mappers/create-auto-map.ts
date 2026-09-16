import { getMetadataList } from '@automapper/classes';
import { createMap, forMember, mapFrom, type Mapper } from '@automapper/core';

export function createAutoMap(
  mapper: Mapper,
  source: Function,
  destination: Function,
): void {
  const [metadata] = getMetadataList(destination);
  const configurations = metadata.map(([property]) =>
    forMember(
      (target: Record<string, unknown>) => target[property],
      mapFrom((origin: Record<string, unknown>) => origin[property]),
    ),
  );

  createMap(mapper, source, destination, ...configurations);
}
