import { dataService } from './data-service';

/**
 * LookupService is a service that provides lookup tables for the UI.
 *
 * It only works with collections inheriting from the Named interface.
 */
class LookupService {
  async getMap(table: string): Promise<Record<string, string>> {
    const results = await dataService.findMany<Named>(table, {});

    return this.makeMap(results, '_id', 'name');
  }

  async getArray(table: string): Promise<Named[]> {
    const results = await dataService.findMany(table, {});

    return results.map(({ _id, name }) => ({ _id, name }));
  }


  private makeMap<T>(array: T[], key: keyof T, name: keyof T): Record<string, string> {
    return array.reduce((acc, item) => {
      acc[item[key] as unknown as string] = item[name] as unknown as string;
      return acc;
    }, {} as Record<string, string>);
  }
}

export const lookupService = new LookupService();
