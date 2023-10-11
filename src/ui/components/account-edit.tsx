import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInitialLoad } from '../helpers';
import { v4 as uuidv4 } from 'uuid';
import { dataService } from '../services/data-service';
import { produce } from 'immer'

import { useDispatch } from 'react-redux';
import { addAlert } from '../main-store';

export default function AccountEditComponent() {
  const dispatch = useDispatch();

  const { id } = useParams();

  const [account, setAccount] = useState<Account>({
    _id: id ?? uuidv4(),
    name: 'Checking',
    description: '',
    type: 'debit',
  });

  useEffect(() => {
    console.dir(account)
  }, [account]);

  useInitialLoad(async () => {
    if (id) {
      const account = await dataService.findOne<Account>('accounts', { _id: id });

      if (account) {
        setAccount(account);
      }
    }
  });

  const saveAccount = async () => {
    try {
      await dataService.updateOne('accounts', {
        _id: account._id,
      }, {
        $set: account
      }, {
        upsert: true
      })

      dispatch(addAlert({
        type: 'success',
        message: 'Account saved successfully.',
        autoHide: true,
      }));
    } catch (error) {
      dispatch(addAlert({
        type: 'error',
        message: 'Account failed to save.',
        autoHide: true,
      }));
    }
  };

  const mutate = (func: (account: Account) => void) => {
    setAccount(produce(account, func));
  }

  return <Box
    component="form"
    sx={{
      '& .MuiTextField-root': { mb: 1, mt: 1, width: '25ch' },
    }}
    noValidate
    autoComplete="off"
  >
    <Typography variant='h4' gutterBottom>
      Account {id ? 'Edit' : 'Creation'}
    </Typography>
    <Typography paragraph>
      Please note, changes to accounts will not be reflected in the application until you restart the application.
    </Typography>
    <Box>
      <TextField
        required
        label="Name"
        name="name"
        value={account.name}
        onChange={(evt) => mutate((account) => {
          account.name = evt.target.value;
        })}
      />
      <br />
      <TextField
        multiline
        minRows={4}
        label="Description"
        name="description"
        value={account.description}
        onChange={(evt) => mutate((account) => {
          account.description = evt.target.value;
        })}
      />
      <br />
      <FormControl>
        <InputLabel id="account-type">Account Type</InputLabel>
        <Select
          labelId="account-type"
          id="account-type"
          value={account.type}
          label="Account Type"
          name="type"
          onChange={(evt) => mutate((account) => {
            account.type = evt.target.value as AccountType;
          })}
          sx={{ mb: 1, mt: 1, width: '25ch' }}
        >
          <MenuItem value={'debit'}>Debit</MenuItem>
          <MenuItem value={'credit'}>Credit</MenuItem>
        </Select>
      </FormControl>

    </Box>
    <Box>
      <Button sx={{ mb: 1, mt: 1 }} variant="outlined" onClick={saveAccount}>Save</Button>
    </Box>
  </Box>;
}
