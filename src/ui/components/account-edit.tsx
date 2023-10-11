import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInitialLoad } from '../helpers';
import { v4 as uuidv4 } from 'uuid';
import { dataService } from '../services/data-service';
import { produce } from 'immer'

export default function AccountEditComponent() {
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

  const saveAccount = () => {
    dataService.updateOne('accounts', {
      _id: account._id,
    }, {
      $set: account
    }, {
      upsert: true
    });
  };

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
    <Box>
      <TextField
        required
        label="Name"
        name="name"
        value={account.name}
        onChange={(evt) => setAccount(produce(account, (account) => {
          account.name = evt.target.value;
        }))}
      />
      <br />
      <TextField
        multiline
        minRows={4}
        label="Description"
        name="description"
        value={account.description}
        onChange={(evt) => setAccount(produce(account, (account) => {
          account.description = evt.target.value;
        }))}
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
          onChange={(evt) => setAccount(produce(account, (account) => {
            account.type = evt.target.value as AccountType;
          }))}
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
