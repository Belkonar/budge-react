import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';

// This component is where I'm going to handle scheduled transactions.
// Specifically calling out that they are due, or automatically committing them.
export default function Home() {
  return <>
    <Typography variant='h4' gutterBottom>
      Welcome to Budge!
    </Typography>
    <Typography paragraph>
      You can use the navigation menu on the left to manage your accounts.
    </Typography>
    <Box
      sx={{
        '& .MuiAlert-standard': {
          mb: 1,
          mt: 1,
        },
      }}
    >
      <Alert
        severity="error"
        action={<Button color="inherit" size="small">
          Commit
        </Button>}
      >
        <AlertTitle>Past Due Scheduled Transaction</AlertTitle>
        This is a warning alert — check it out!
      </Alert>

      <Alert
        severity="warning"
        action={<Button color="inherit" size="small">
          Commit
        </Button>}
      >
        <AlertTitle>Upcoming Scheduled Transaction</AlertTitle>
        This is a warning alert — check it out!
      </Alert>
    </Box>
  </>
}
