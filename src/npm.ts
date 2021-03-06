import fetch from 'node-fetch';

export interface Package {
  readonly id: string;
}

export interface PackageRegistry {
  readonly total_rows: number;
  readonly rows: Package[];
}

export function createReservedNames(packageRegistry: PackageRegistry): Set<string> {
  return new Set(packageRegistry.rows.map(row => row.id));
}

export async function fetchPackageRegistry(force?: boolean): Promise<PackageRegistry> {
  const res = await fetch('https://skimdb.npmjs.com/registry/_all_docs');
  const packageRegistry = await res.json() as PackageRegistry;

  if (packageRegistry.total_rows !== packageRegistry.rows.length) {
    throw new Error('Inconsistent data');
  }

  return packageRegistry;
}
