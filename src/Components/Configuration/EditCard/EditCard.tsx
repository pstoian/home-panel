import React, { useEffect, ReactElement } from 'react';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { CardProps, cardTypeDefaults } from '../Config';
import Base, { BaseProps } from './Base';
import CardBase from '../../Cards/Base';

const useStyles = makeStyles((theme: Theme) => ({
  dialogContent: {
    paddingLeft: 0,
    paddingRight: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  background: {
    padding: theme.spacing(2),
    background: theme.palette.background.default,
    overflow: 'hidden',
  },
  editView: {
    minWidth: 200,
    [theme.breakpoints.down('sm')]: {
      minWidth: '100%',
    },
    padding: theme.spacing(2),
    overflow: 'auto',
  },
}));

interface EditCardProps extends BaseProps {
  handleClose: () => void;
  handleUpdate: (data: CardProps) => void;
}

function EditCard(props: EditCardProps): ReactElement {
  const [card, setCard] = React.useState(props.card);

  useEffect(() => setCard(props.card), [props.card]);

  function handleConfirm(): void {
    props.handleUpdate(card);
    props.handleClose();
  }

  function handleManualChange(name: string, value?: string | number): void {
    setCard({
      ...card,
      [name]: value,
    });
  }

  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement> | string
  ): void => {
    setCard({
      ...card,
      [name]: typeof event === 'string' ? event : event.target.value,
    });
  };

  const handleSwitchChange = (name: string) => (
    _event: React.ChangeEvent<{}>,
    checked: boolean
  ): void => {
    setCard({ ...card, [name]: checked });
  };

  function handleSelectChange(
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ): void {
    switch (event.target.name) {
      default:
        return setCard({
          ...card,
          [event.target.name as string]: event.target.value,
        });
      case 'type':
        // Cleanup types
        return setCard({
          ...cardTypeDefaults[event.target.value as string],
          key: card.key,
          group: card.group,
        });
      case 'chart':
        if (!card.chart)
          return setCard({
            ...card,
            [event.target.name as string]: event.target.value,
            chart_detail: 4,
            chart_from: 3,
          });
        else
          return setCard({
            ...card,
            [event.target.name as string]: event.target.value,
          });
    }
  }

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open
      fullScreen={fullScreen}
      fullWidth={true}
      maxWidth="lg"
      aria-labelledby="responsive-dialog-title">
      <DialogTitle id="responsive-dialog-title">Edit Card</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container direction="row" alignContent="center" justify="center">
          <Grid
            className={classes.editView}
            item
            xs
            container
            direction="row"
            justify="flex-start"
            alignContent="stretch">
            <Base
              {...props}
              card={card}
              handleManualChange={handleManualChange}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              handleSwitchChange={handleSwitchChange}
            />
          </Grid>
          <Grid
            className={classes.background}
            item
            xs
            container
            alignContent="center"
            justify="space-around">
            <CardBase {...props} card={card} editing={0} expandable={true} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button onClick={handleConfirm}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditCard;
