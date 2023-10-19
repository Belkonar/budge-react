import { addDays, addMonths, isSameDay, setDay } from 'date-fns';

const dayList = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
]

const dayMap = dayList.reduce((map, day, index) => {
  return {
    ...map,
    [day]: index,
  };
}, {} as Record<string, number>);

class ReportService {
  getScheduledProjections(transaction: ScheduledTransaction, endDate: Date): Date[] {
    const startDate = transaction.lastCommit || transaction.startDate;

    switch (transaction.frequency) {
      case 'daily':
        return this.getDailyProjections(transaction, startDate, endDate);
      case 'weekly':
        return this.getWeeklyProjections(transaction, startDate, endDate);
      case 'monthly':
        return this.getMonthlyProjections(transaction, startDate, endDate);
      default:
        return [];
    }
  }

  // I'm going to keep these methods public for easier testing.
  getDailyProjections(transaction: ScheduledTransaction, startDate: Date, endDate: Date): Date[] {
    let iter = startDate;

    if (transaction.lastCommit) {
      // If the transaction has been committed before, then we need to start
      // the iteration on the next day.
      iter = addDays(startDate, transaction.frequencyConfig.days);
    }

    const projections: Date[] = [];

    for (; iter < endDate; iter = addDays(iter, transaction.frequencyConfig.days)) {
      projections.push(iter);
    }

    return projections;
  }

  // This is the costliest method, and it takes .2 ms for 5 years of data for 1 day in a week every other
  // week. It takes 22ms to paint the screen, so I think this is fine.
  getWeeklyProjections(transaction: ScheduledTransaction, startDate: Date, endDate: Date): Date[] {
    const projections: Date[] = [];

    const days = (transaction.frequencyConfig.daysOfWeek as string[]).map(day => dayMap[day]);

    let iter = setDay(startDate, days[0]);

    if (days.length === 0) {
      return [];
    }

    const intervals: number[] = [];

    days.forEach((date, index) => {
      if (index === days.length - 1) {
        intervals.push(days[0] + (7 * transaction.frequencyConfig.weeks) - date)
      }
      else {
        intervals.push(days[index + 1] - date)
      }
    });

    if (isSameDay(iter, startDate)) {
      projections.push(iter);
    }

    for (let i = 1; ; i++) {
      iter = addDays(iter, intervals[i % intervals.length]);
      if (iter > endDate) {
        break;
      }

      if (isSameDay(iter, startDate)) {
        if (transaction.lastCommit) {
          continue;
        }
        else {
          projections.push(iter);
        }
      }
      else if (iter > startDate) {
        projections.push(iter);
      }
    }
    return projections;
  }

  // Will need to do a ton of testing.
  getMonthlyProjections(transaction: ScheduledTransaction, startDate: Date, endDate: Date): Date[] {
    let iter = startDate;

    if (transaction.lastCommit) {
      // If the transaction has been committed before, then we need to start
      // the iteration on the next day.
      iter = addDays(startDate, transaction.frequencyConfig.days);
    }

    const projections: Date[] = [];

    for (; iter < endDate; iter = addMonths(iter, transaction.frequencyConfig.months)) {
      projections.push(iter);
    }

    return projections;
  }
}

export const reportService = new ReportService();
