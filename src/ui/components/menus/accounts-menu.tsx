import { List, ListSubheader, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useInitialLoad } from '../../helpers';
import { dataService } from '../../services/data-service';
import { useState } from 'react';

export default function AccountsMenu() {
  const nav = useNavigate();

  const [accounts, setAccounts] = useState<Account[]>([]);

  useInitialLoad(async () => {
    setAccounts(await dataService.findMany<Account>('accounts', {}));
  });

  const accountFragments = accounts.map(account => <ListItem disablePadding key={account._id}>
    <ListItemButton onClick={() => nav(`/register/${account._id}`)}>
      <ListItemIcon>
        <ListAltIcon />
      </ListItemIcon>
      <ListItemText>
        {account.name}
      </ListItemText>
    </ListItemButton>
  </ListItem>);

  return <List
    sx={{ backgroundColor: 'background.paper' }}
    subheader={
      <ListSubheader component="div" id="nested-list-subheader">
        Accounts
      </ListSubheader>
    }
  >
    {accountFragments}
  </List>
}
