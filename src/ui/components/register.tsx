import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function RegisterComponent() {
  const { accountId } = useParams();

  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rows, setRows] = useState<Transaction[]>([]);

  useEffect(() => {
    if (totalCount == 0) {
      // This will mean that if there are no transactions, we will *not* load anything.
      return;
    }
  }, [totalCount, currentPage]);

  return <Box>
    Register Component {accountId}
  </Box>
}
