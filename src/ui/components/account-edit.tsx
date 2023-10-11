import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function useInitialLoad(func: () => Promise<void>) {
  useEffect(() => {
    func().catch(console.error);
  }, []);
}

export default function AccountEditComponent() {
  const { id } = useParams();

  const [account, setAccount] = useState<Account>({
    _id: id ?? '',
    name: 'Checking',
    description: 'My checking account',
    type: 'debit',
  });

  useEffect(() => {
    console.dir(account)
  }, [account]);

  useInitialLoad(async () => {
    if (id) {
      // TODO: fetch account from API
    }
  });

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    setAccount({ ...account, [event.target.name]: event.target.value });
  }

  function handleSelectChange(event: SelectChangeEvent) {
    setAccount({ ...account, [event.target.name]: event.target.value });
  }

  return <Box
    component="form"
    sx={{
      '& .MuiTextField-root': { m: 1, width: '25ch' },
    }}
    noValidate
    autoComplete="off"
  >
    <div>
      <TextField
        required
        label="Name"
        name="name"
        value={account.name}
        onChange={handleChange}
      />
      <br />
      <TextField
        multiline
        minRows={4}
        label="Description"
        name="description"
        value={account.description}
        onChange={handleChange}
      />
      <br />
      <FormControl>
        <InputLabel id="account-type">Age</InputLabel>
        <Select
          labelId="account-type"
          id="demo-simple-select"
          value={account.type}
          label="Type"
          name="type"
          onChange={handleSelectChange}
          sx={{ m: 1, width: '25ch' }}
        >
          <MenuItem value={'debit'}>Debit</MenuItem>
          <MenuItem value={'credit'}>Credit</MenuItem>
        </Select>
      </FormControl>
    </div>
  </Box>;
}
