import { addDays, addMonths, addWeeks, isSameDay, setDay } from 'date-fns';

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

  // For future optimization: Calculate the monday and friday of every other week within a date range.
  getWeeklyProjections(transaction: ScheduledTransaction, startDate: Date, endDate: Date): Date[] {
    const projections: Date[] = [];

    let iter = startDate;

    const days = (transaction.frequencyConfig.daysOfWeek as string[]).map(day => dayMap[day]);

    if (days.length === 0) {
      return [];
    }

    while (iter < endDate) {
      // I'm going to clamp the list after this, so I don't need to worry about
      // extra days before and after

      projections.push(...days.map(day => setDay(iter, day)));

      iter = addWeeks(iter, transaction.frequencyConfig.weeks);
    }

    return projections.filter(date => {
      if (isSameDay(date, startDate)) {
        if (transaction.lastCommit) {
          return false;
        }
        else {
          return true;
        }
      }
      else {
        return date < endDate && date > startDate;
      }
    });
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
