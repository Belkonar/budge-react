import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, removeAlert } from '../main-store';

export function AlertsComponent() {
  const alerts = useSelector<RootState>((state) => state.alerts) as InnerAlert[];
  const dispatch = useDispatch();

  const handleClose = (id: string) => {
    dispatch(removeAlert(id))
  }

  return alerts.map((alert) => <Snackbar
    key={alert._id}
    autoHideDuration={alert.autoHide ? 3000 : null}
    open={true}
    onClose={() => handleClose(alert._id)}
  >
    <Alert severity={alert.type} sx={{ width: '100%' }} onClose={() => handleClose(alert._id)}>
      {alert.message}
    </Alert>
  </Snackbar>);
}
