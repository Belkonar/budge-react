import { Button, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef, GridToolbarContainer } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const rows: Account[] = [
  { _id: '1', name: 'Checking', description: 'My checking account', type: 'debit' },
  { _id: '2', name: 'Apple', description: 'Apple Card for travel expenses', type: 'credit' },
]

function EditToolbar() {
  const nav = useNavigate();

  return <GridToolbarContainer>
    <Button color="primary" startIcon={<AddIcon />} onClick={() => nav('/account-new')}>Add Account</Button>
  </GridToolbarContainer>
}

export default function AccountsComponent() {
  const nav = useNavigate();

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'type', headerName: 'Type', width: 200 },
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
            onClick={() => nav(`/account-edit/${id}`)}
          />
        ]
      },
    }
  ]

  return <>
    <Typography variant='h4' gutterBottom>
      Account Management
    </Typography>
    <DataGrid
      rows={rows}
      getRowId={(row) => row._id}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5]}
      disableRowSelectionOnClick
      slots={{
        toolbar: EditToolbar,
      }}
    />
  </>
}
