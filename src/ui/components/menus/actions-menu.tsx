import { List, ListSubheader, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ActionsMenu() {
  const nav = useNavigate();

  return <List
    sx={{ backgroundColor: 'background.paper' }}
    subheader={
      <ListSubheader component="div" id="nested-list-subheader">
        Manage
      </ListSubheader>
    }
  >
    <ListItem disablePadding>
      <ListItemButton onClick={() => nav('/')}>
        <ListItemText>
          Accounts
        </ListItemText>
      </ListItemButton>
    </ListItem>
  </List>
}
