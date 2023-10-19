import { Autocomplete, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { LookupOptions, lookupService } from '../services/lookup-service';
import { useInitialLoad } from '../helpers';
import { useMemo, useState } from 'react';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { DatePicker } from '@mui/x-date-pickers';
import { dataService } from '../services/data-service';

import { useDispatch } from 'react-redux';
import { addAlert } from '../main-store';

/*
Notes: I'll be switching accounts to a simpler select input later.
The only reason I'm not doing it now is because I want the reference
later for categories and payees.
*/

export default function ScheduleEditComponent() {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const { id } = useParams();

  const [accountOptions, setAccountOptions] = useState<LookupOptions[]>([]);
  const [schedule, setSchedule] = useState<ScheduledTransaction>({
    _id: id ?? uuidv4(),
    name: '',
    accountId: '',
    commitType: 'manual',
    startDate: new Date(),
    frequency: 'weekly',
    payeeId: null,
    categoryId: null,
    amount: 0,
    frequencyConfig: {},
    lastCommit: null,
  });

  const selectedAccount = useMemo(() => {
    if (accountOptions.length === 0 || schedule.accountId === '') {
      return null;
    }

    return accountOptions.find((option) => option._id === schedule.accountId);
  }, [schedule.accountId, accountOptions]);

  useInitialLoad(async () => {
    setAccountOptions(await lookupService.getOptions('accounts'));

    if (id) {
      const schedule = await dataService.findOne<ScheduledTransaction>('scheduled-transactions', { _id: id });
      console.log(schedule);
      if (schedule) {
        setSchedule(schedule);
      }
    }
  });

  const save = async () => {
    try {
      await dataService.updateOne('scheduled-transactions', {
        _id: schedule._id,
      }, {
        $set: schedule
      }, {
        upsert: true
      })

      dispatch(addAlert({
        type: 'success',
        message: 'Scheduled transaction saved successfully.',
        autoHide: true,
      }));

      if (!id) {
        nav(`/schedule-edit/${schedule._id}`);
      }
    } catch (error) {
      dispatch(addAlert({
        type: 'error',
        message: 'Scheduled transaction failed to save.',
        autoHide: true,
      }));
    }
  }

  const mutate = (func: (schedule: ScheduledTransaction) => void) => {
    setSchedule(produce(schedule, func));
  }

  const frequencyOptions = getFrequencyOptions(schedule, mutate);

  return <Box
    component="form"
    sx={{
      '& .MuiFormControl-root': { mb: 1, mt: 1 },
      '& .MuiTextField-root': { width: '25ch' },
    }}
    noValidate
    autoComplete="off"
  >
    <Typography variant='h4' gutterBottom>
      Scheduled Transaction {id ? 'Edit' : 'Creation'}
    </Typography>
    <Box>
      <Box>
        <TextField
          label="name"
          value={schedule.name}
          onChange={(event) => {
            mutate((draft) => {
              draft.name = event.target.value;
            })
          }}
        />
      </Box>

      <Box>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={accountOptions}
          value={selectedAccount}
          onChange={(event, value) => {
            mutate((draft) => {
              draft.accountId = value?._id ?? '';
            })
          }}
          renderInput={(params) => <TextField
            required
            {...params}
            label="Account"
          />}
        />
      </Box>
      <Box>
        <TextField
          label="Amount"
          type='number'
          value={schedule.amount}
          onChange={(event) => {
            mutate((draft) => {
              draft.amount = Number(event.target.value);
            })
          }}
        />
      </Box>
      {/* <Box>
        <FormControl>
          <InputLabel id="commit-type">Commit Type</InputLabel>
          <Select
            labelId="commit-type"
            id="commit-type"
            label="Commit Type"
            name="type"
            sx={{ width: '25ch' }}
            value={schedule.commitType}
            onChange={(event) => {
              mutate((draft) => {
                draft.commitType = event.target.value as CommitType;
              })
            }}
          >
            <MenuItem value={'manual'}>Manual</MenuItem>
            <MenuItem value={'automatic'}>Automatic</MenuItem>
            <MenuItem value={'estimate'}>Estimate</MenuItem>
          </Select>
        </FormControl>
      </Box> */}
      <Box>
        <DatePicker
          label="Start Date"
          value={schedule.startDate}
          onChange={(date) => {
            mutate((draft) => {
              if (!date) {
                // If we get something bad back we will just set it to today.
                draft.startDate = new Date();
              }
              else {
                draft.startDate = date;
              }
            })
          }}
        />
      </Box>
      <Box>
        <FormControl>
          <InputLabel id="frequency">Frequency</InputLabel>
          <Select
            labelId="frequency"
            id="frequency"
            label="Frequency"
            name="type"
            sx={{ width: '25ch' }}
            value={schedule.frequency}
            onChange={(event) => {
              mutate((draft) => {
                draft.frequency = event.target.value as FrequencyType;
              })
            }}
          >
            <MenuItem value={'daily'}>Daily</MenuItem>
            <MenuItem value={'weekly'}>Weekly</MenuItem>
            <MenuItem value={'monthly'}>Monthly</MenuItem>
            <MenuItem value={'yearly'}>Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {frequencyOptions}
      <Box>
        <Button sx={{ mb: 1, mt: 1 }} variant="outlined" onClick={save}>Save</Button>
      </Box>
    </Box>
  </Box>
}

function getFrequencyOptions(schedule: ScheduledTransaction, mutate: (func: (schedule: ScheduledTransaction) => void) => void): JSX.Element {
  switch (schedule.frequency) {
    case 'daily':
      return getDailyFrequencyOptions(schedule, mutate);
    case 'weekly':
      return getWeeklyFrequencyOptions(schedule, mutate);
    case 'monthly':
      return getMonthlyFrequencyOptions(schedule, mutate);
    case 'yearly':
      return getYearlyFrequencyOptions(schedule, mutate);
  }
}

function getDailyFrequencyOptions(schedule: ScheduledTransaction, mutate: (func: (schedule: ScheduledTransaction) => void) => void): JSX.Element {
  return <Box key={'daily'}>
    <TextField
      label="Every"
      type='number'
      value={schedule.frequencyConfig.days ?? 1}
      onChange={(event) => {
        mutate((draft) => {
          draft.frequencyConfig.days = Number(event.target.value);
        })
      }}
    />
  </Box>
}

function getWeeklyFrequencyOptions(schedule: ScheduledTransaction, mutate: (func: (schedule: ScheduledTransaction) => void) => void): JSX.Element {
  return <Box key={'weekly'}>
    <TextField
      label="Every"
      type='number'
      value={schedule.frequencyConfig.weeks ?? 1}
      onChange={(event) => {
        mutate((draft) => {
          draft.frequencyConfig.weeks = Number(event.target.value);
        })
      }}
    />
    <Box>
      <ToggleButtonGroup
        value={schedule.frequencyConfig.daysOfWeek ?? []}
        onChange={(event, value) => {
          mutate((draft) => {
            draft.frequencyConfig.daysOfWeek = value;
          })
        }}
      >
        <ToggleButton value="sunday" aria-label="sunday">
          Sunday
        </ToggleButton>
        <ToggleButton value="monday" aria-label="monday">
          Monday
        </ToggleButton>
        <ToggleButton value="tuesday" aria-label="tuesday">
          Tuesday
        </ToggleButton>
        <ToggleButton value="wednesday" aria-label="wednesday">
          Wednesday
        </ToggleButton>
        <ToggleButton value="thursday" aria-label="thursday">
          Thursday
        </ToggleButton>
        <ToggleButton value="friday" aria-label="friday">
          Friday
        </ToggleButton>
        <ToggleButton value="saturday" aria-label="saturday">
          Saturday
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  </Box>
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getMonthlyFrequencyOptions(schedule: ScheduledTransaction, mutate: (func: (schedule: ScheduledTransaction) => void) => void): JSX.Element {
  return <Box key={'monthly'}>
    TBD monthly config
  </Box>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getYearlyFrequencyOptions(schedule: ScheduledTransaction, mutate: (func: (schedule: ScheduledTransaction) => void) => void): JSX.Element {
  return <Box key={'yearly'}>
    TBD yearly config
  </Box>
}
