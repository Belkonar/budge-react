import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function RegisterComponent() {
  const { accountId } = useParams();

  return <Box>
    Register Component {accountId}
  </Box>
}
