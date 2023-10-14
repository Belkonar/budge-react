import { Button, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

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

  const [rows, setRows] = useState<ScheduledTransaction[]>([]);

  const columns: GridColDef[] = useMemo(() => {
    return [
      { field: 'name', headerName: 'Name', width: 200 },
      { field: 'accountId', headerName: 'Account', width: 200 }, // TODO: This should be a lookup
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
  }, []);



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
