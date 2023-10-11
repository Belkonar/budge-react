import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInitialLoad } from '../helpers';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';
import { dataService } from '../services/data-service';

export default function RegisterComponent() {
  const { accountId } = useParams();

  const [totalCount, setTotalCount] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });
  const [rows, setRows] = useState<Transaction[]>([]);

  useInitialLoad(async () => {
    setTotalCount(10);
  })

  const columns: GridColDef[] = useMemo(() => {
    return [
      { field: 'dateStamp', headerName: 'Date', width: 150, type: 'date', editable: true },
      { field: 'description', headerName: 'Description', flex: 1, editable: true },
      { field: 'amount', headerName: 'Amount', width: 150, type: 'number', editable: true },
      { field: 'rollup', headerName: 'Rollup', width: 150, type: 'number', editable: true },
    ]
  }, []);

  useEffect(() => {
    if (totalCount == 0) {
      // This will mean that if there are no transactions, we will *not* load anything.
      return;
    }

    dataService.findMany<Transaction>('transactions', {
      accountId: accountId!
    }, {
      sort: {
        dateStamp: -1,
        ordinal: -1,
      },
    }).then(setRows);
  }, [totalCount, paginationModel]);

  async function handleRowUpdate(newRow: Transaction): Promise<Transaction> {
    await dataService.updateOne('transactions', {
      _id: newRow._id,
    }, {
      $set: newRow
    })
    return newRow;
  }

  async function addTransaction() {
    const newTransaction: Transaction = {
      _id: uuidv4(),
      accountId: accountId!,
      amount: 0,
      rollup: 0,
      description: '',
      dateStamp: new Date(),
      ordinal: (new Date()).getUTCMinutes(),
      payeeId: null,
      categoryId: null,
      cleared: false,
    }

    await dataService.insertOne('transactions', newTransaction);

    // This will retrigger the useEffect above.
    setPaginationModel({
      ...paginationModel,
      page: 0,
    })
  }

  const toolbar = () => <GridToolbarContainer>
    <Button color="primary" startIcon={<AddIcon />} onClick={addTransaction}>Add Transaction</Button>
  </GridToolbarContainer>;

  return <>
    <DataGrid
      rows={rows}
      getRowId={(row: Transaction) => row._id}
      columns={columns}
      pageSizeOptions={[5]}
      disableRowSelectionOnClick
      paginationMode="server"
      rowCount={totalCount}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      editMode='row'
      processRowUpdate={handleRowUpdate}
      slots={{
        toolbar,
      }}
    />
  </>
}
