import { List, ListSubheader, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';

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
        <ListItemIcon>
          <ListAltIcon />
        </ListItemIcon>
        <ListItemText>
          Checking
        </ListItemText>
      </ListItemButton>
    </ListItem>
  </List>
}
