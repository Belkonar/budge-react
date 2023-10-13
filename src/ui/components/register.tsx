import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInitialLoad, currencyFormatter } from '../helpers';
import { Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';
import { dataService } from '../services/data-service';

export default function RegisterComponent() {
  const { accountId } = useParams();

  const [totalCount, setTotalCount] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });
  const [rows, setRows] = useState<Transaction[]>([]);

  useInitialLoad(async () => {
    const count = await dataService.count('transactions', {
      accountId: accountId!
    });

    setTotalCount(count);
  })

  const columns: GridColDef[] = useMemo(() => {
    return [
      { field: 'dateStamp', headerName: 'Date', width: 150, type: 'date', editable: true },
      { field: 'description', headerName: 'Description', flex: 1, editable: true },
      {
        field: 'amount',
        headerName: 'Amount',
        width: 150,
        type: 'number',
        editable: true,
        valueFormatter: currencyFormatter,
      },
      {
        field: 'rollup',
        headerName: 'Balance',
        width: 150,
        type: 'number',
        valueFormatter: currencyFormatter,
      },
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
      limit: paginationModel.pageSize,
      skip: paginationModel.page * paginationModel.pageSize,
    }).then(setRows);
  }, [totalCount, paginationModel]);

  async function handleRowUpdate(newRow: Transaction): Promise<Transaction> {
    await dataService.updateOne('transactions', {
      _id: newRow._id,
    }, {
      $set: newRow
    })

    await dataService.reCalcBalance(accountId!);

    setPaginationModel({
      ...paginationModel,
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
      ordinal: (new Date()).getTime() / 1000,
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
    <Typography variant="h4">Register</Typography>
    <Typography paragraph>
      This is the register, you can manage your transactions here. It will automatically calculate your running balance.
      Please note it does this based on the last cleared transaction, so try and clear them once in a while.
    </Typography>
    <DataGrid
      rows={rows}
      getRowId={(row: Transaction) => row._id}
      columns={columns}
      disableRowSelectionOnClick
      // pageSizeOptions={[25, 50]} // Maybe later
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
