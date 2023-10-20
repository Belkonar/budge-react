import { dataService } from './data-service';

export interface LookupOptions {
  _id: string;
  label: string;
}

/**
 * LookupService is a service that provides lookup tables for the UI.
 *
 * It only works with collections inheriting from the Named interface.
 */
class LookupService {
  async getMap(collection: string): Promise<Record<string, string>> {
    const results = await dataService.findMany<Named>(collection, {});

    return this.makeMapFromNamed(results);
  }

  async getArray(collection: string): Promise<Named[]> {
    const results = await dataService.findMany(collection, {});

    return results.map(({ _id, name }) => ({ _id, name }));
  }

  /**
   * @param collection The collection to get options for
   * @returns options for an <Autocomplete> component
   */
  async getOptions(collection: string): Promise<LookupOptions[]> {
    const results = await dataService.findMany(collection, {});

    return results.map(({ _id, name }) => ({ _id, label: name }));
  }

  private makeMapFromNamed(array: Named[]): Record<string, string> {
    return array.reduce((acc, item) => {
      acc[item['_id']] = item['name'];
      return acc;
    }, {} as Record<string, string>);
  }
}

export const lookupService = new LookupService();
