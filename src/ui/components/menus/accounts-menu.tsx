import { List, ListSubheader, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AccountsMenu() {
  const nav = useNavigate();

  return <List
    sx={{ backgroundColor: 'background.paper' }}
    subheader={
      <ListSubheader component="div" id="nested-list-subheader">
        Accounts
      </ListSubheader>
    }
  >
    <ListItem disablePadding>
      <ListItemButton onClick={() => nav('/')}>
        <ListItemText>
          Checking
        </ListItemText>
      </ListItemButton>
    </ListItem>
  </List>
}
