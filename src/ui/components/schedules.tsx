import { Button, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useInitialLoad } from '../helpers';
import { lookupService } from '../services/lookup-service';
import { dataService } from '../services/data-service';

function EditToolbar() {
  const nav = useNavigate();

  return <GridToolbarContainer>
    <Button color="primary" startIcon={<AddIcon />} onClick={() => nav('/schedule-new')}>
      Add Scheduled Transaction
    </Button>
  </GridToolbarContainer>
}

export default function SchedulesComponent() {
  const nav = useNavigate();

  // hashmap for lookup
  const [accounts, setAccounts] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<ScheduledTransaction[]>([]);

  useInitialLoad(async () => {
    setAccounts(await lookupService.getAccounts());
  });

  useEffect(() => {
    if (Object.keys(accounts).length === 0) {
      // Don't run this without accounts
      return;
    }

    dataService.findMany<ScheduledTransaction>('scheduled-transactions', {})
      .then((transactions) => {
        setRows(transactions);
      })
      .catch((error) => {
        console.error(error); // TODO: toast
      });
  }, [accounts]);

  const columns: GridColDef[] = useMemo(() => {
    return [
      { field: 'name', headerName: 'Name', width: 200 },
      {
        field: 'accountId',
        headerName: 'Account',
        width: 200,
        valueFormatter: ({ value }) => accounts[value] ?? value,
      },
      { field: 'commitType', headerName: 'Type', width: 200 },
      { field: 'frequency', headerName: 'Frequency', width: 200 },
      {
        field: 'actions',
        type: 'actions',
        getActions: ({ id }) => {
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label='Edit'
              sx={{
                color: 'primary.main',
              }}
              onClick={() => nav(`/schedule-edit/${id}`)}
            />
          ]
        },
      }
    ]
  }, [accounts]); // regenerate columns when accounts are set (should only be once during page load)

  return <>
    <Typography variant='h4' gutterBottom>
      Schedule Management
    </Typography>
    <DataGrid
      rows={rows}
      getRowId={(row) => row._id}
      columns={columns}
      disableRowSelectionOnClick
      slots={{
        toolbar: EditToolbar,
      }}
    />
  </>
}
