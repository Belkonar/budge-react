import { Alert, AlertColor, AlertTitle, Box, Button, Typography } from '@mui/material';
import { dataService } from '../services/data-service';
import { addDays, format, isSameDay } from 'date-fns';
import { reportService } from '../services/report-service';
import { useEffect, useState } from 'react';

interface ScheduleAlert {
  type: AlertColor;
  name: string;
  dateToCommit: Date;
}

// This component is where I'm going to handle scheduled transactions.
// Specifically calling out that they are due, or automatically committing them.
export default function Home() {
  const [alerts, setAlerts] = useState<ScheduleAlert[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [trig, setTrig] = useState({});

  useEffect(() => {
    // optimize this so that it only loads specific transactions.
    // That way we don't have to calc all of them every time we commit.
    const loadData = async () => {
      const alerts: ScheduleAlert[] = [];
      const endTargetDate = addDays(new Date(), 7);
      const scheduledTransactions = await dataService.findMany<ScheduledTransaction>('scheduled-transactions', {
        startDate: { // Get all transactions that are due to start in the next 7 days.
          $lte: endTargetDate,
        }
      });

      console.log(scheduledTransactions);

      for (const transaction of scheduledTransactions) {
        const events = reportService.getScheduledProjections(transaction, endTargetDate);

        if (events[0] < new Date() || isSameDay(events[0], new Date())) {
          alerts.push({
            type: 'error',
            name: transaction.name,
            dateToCommit: events[0],
          });
        }
        else {
          alerts.push({
            type: 'warning',
            name: transaction.name,
            dateToCommit: events[0],
          });
        }
      }

      setAlerts(alerts);
    };

    loadData().catch(console.error);
  }, [trig]);

  const alertComponents = alerts.map((alert, index) => <Alert
    key={index}
    severity={alert.type}
    action={<Button color="inherit" size="small">
      Commit
    </Button>}
  >
    <AlertTitle>
      {alert.type === 'error' ? 'Past Due Scheduled Transaction' : 'Upcoming Scheduled Transaction'}
    </AlertTitle>
    {alert.name} is scheduled to commit on {format(alert.dateToCommit, 'PPPP')}.
  </Alert>)


  return <>
    <Typography variant='h4' gutterBottom>
      Welcome to Budge!
    </Typography>
    <Typography paragraph>
      You can use the navigation menu on the left to manage your accounts.
    </Typography>
    <Box
      sx={{
        '& .MuiAlert-standard': {
          mb: 1,
          mt: 1,
        },
      }}
    >
      {alertComponents}
    </Box>
  </>
}
