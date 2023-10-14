import { Typography } from '@mui/material';

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
  </>
}
