import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import WarningIcon from '@material-ui/icons/Warning';
import * as React from 'react';

interface VariantIcon {
  [key: string]: any;
}

interface Classes {
  [key: string]: any;
}

const variantIcon: VariantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.dark,
    },
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
  })
);

interface SnackbarContentWrapperProps {
  className?: string;
  message: string;
  onClose?: any;
  variant: 'success' | 'warning' | 'error' | 'info';
}

const SnackbarContentWrapper = (props: SnackbarContentWrapperProps) => {
  const classes: Classes = useStyles({});
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby='client-snackbar'
      message={
        <span id='client-snackbar' className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key='close' aria-label='Close' color='inherit' onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
};

interface SnackbarComponentProps {
  outerClassName?: string;
  anchorOrigin: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' };
  open: boolean;
  autoHideDuration?: number;
  className?: string;
  variant: 'success' | 'warning' | 'error' | 'info';
  message: string;
  onClose?: any;
}

export const SnackbarComponent: React.FunctionComponent<SnackbarComponentProps> = (props: SnackbarComponentProps) => {
  const { open, anchorOrigin, autoHideDuration, outerClassName, className, message, onClose, variant } = props;

  return (
    <Snackbar className={outerClassName} anchorOrigin={anchorOrigin} open={open} autoHideDuration={autoHideDuration}>
      <SnackbarContentWrapper className={className} variant={variant} message={message} onClose={onClose} />
    </Snackbar>
  );
};
