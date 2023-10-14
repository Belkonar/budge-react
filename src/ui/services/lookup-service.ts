import { dataService } from './data-service';

class LookupService {
  async getAccounts(): Promise<Record<string, string>> {
    const results = await dataService.findMany('accounts', {});

    return this.makeMap(results, '_id', 'name');
  }

  private makeMap<T>(array: T[], key: keyof T, name: keyof T): Record<string, string> {
    return array.reduce((acc, item) => {
      acc[item[key] as unknown as string] = item[name] as unknown as string;
      return acc;
    }, {} as Record<string, string>);
  }
}

export const lookupService = new LookupService();
