import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Box,
  makeStyles,
} from '@material-ui/core/';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import DefaultIcon from '../../utils/DefaultIcon';
import { getCurrencySymbol } from '../../utils/currency';

export default function RollbackTransaction(props) {
  const classes = useStyles();
  const { version } = props;
  const [selected, setSelected] = useState();

  // get initial data
  useEffect(() => {
    setSelected(version);
  }, [version]);

  const type = selected?.Money >= 0 ? "Thu" : "Chi";

  return (
    <React.Fragment>
      {selected &&
        <Box>
          <Box className={classes.amountRow}>
            <TextField
              style={{ marginRight: '10px' }}
              className={classes.textField}
              size="small"
              id="isNegative"
              name="isNegative"
              label=""
              value={type}
              variant="outlined"
              InputProps={{
                readOnly: true,
                className: type === "Thu" ? classes.type1Text : classes.type2Text,
              }}
            >
              {type}
            </TextField>

            <TextField
              className={`${classes.textField}`}
              size="small"
              autoFocus
              id="price"
              name="price"
              label="Số tiền"
              value={Math.abs(selected?.Money) || ''}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: true,
                inputComponent: NumberFormatCustom,
                className: type === "Thu" ? classes.type1Text : classes.type2Text,
                endAdornment:
                  <Typography>{getCurrencySymbol()}</Typography>
              }}
              fullWidth
              variant="outlined"
            />
          </Box>
          <TextField
            name="time"
            size="small"
            className={classes.textField}
            value={moment(selected?.DateAdded).format("DD/MM/YYYY - HH:mm") || ''}
            label="Thời gian"
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          >
          </TextField>

          <TextField
            className={classes.textField}
            size="small"
            id="category"
            name="CategoryID"
            label="Hạng mục"
            value={" " + selected?.CategoryName}
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true,
              startAdornment:
                <DefaultIcon
                  IconID={selected?.IconID}
                  backgroundSize={24}
                  iconSize={14} />
            }}

          >
          </TextField>

          <TextField
            className={classes.textField}
            size="small"
            id="event"
            name="eventID"
            label="Sự kiện"
            value={selected?.EventName || ''}
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}

          >
          </TextField>

          <TextField
            name="description"
            className={classes.textField}
            size="small"
            value={selected?.Description || ''}
            id="outlined-multiline-static"
            label="Mô tả"
            multiline
            rows={10}
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
      }
    </React.Fragment>
  );
}

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
}

const useStyles = makeStyles({
  historyBox: {
    minWidth: '600px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: "wrap",
    marginTop: '10px'
  },
  amountRow: {
    display: 'flex',
  },
  textField: {
    margin: '10px 0px 15px 0px'
  },
  type1Text: {
    color: '#1DAF1A'
  },
  type2Text: {
    color: '#FF2626'
  },
});
