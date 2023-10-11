import { Alert, Snackbar } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, removeAlert } from '../main-store';

export function AlertsComponent() {
  const alerts = useSelector<RootState>((state) => state.alerts) as InnerAlert[];
  const dispatch = useDispatch();

  const handleClose = (id: string) => {
    dispatch(removeAlert(id))
  }

  return alerts.map((alert) => <React.Fragment key={alert._id}>
    <Snackbar autoHideDuration={alert.autoHide ? 3000 : null} open={true} onClose={() => handleClose(alert._id)}>
      <Alert severity={alert.type} sx={{ width: '100%' }} onClose={() => handleClose(alert._id)}>
        {alert.message}
      </Alert>
    </Snackbar>
  </React.Fragment>);
}
