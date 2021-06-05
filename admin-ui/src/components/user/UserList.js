import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import {
  Divider,
  TextField,
  Toolbar,
  Button,
  IconButton,
  Tooltip
} from '@material-ui/core';
import BlockIcon from '@material-ui/icons/Block';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import config from '../../constants/config.json';
const API_URL = config.API_LOCAL;

const useStyles = makeStyles((theme) => ({
  root: {
    border: 0,
    color:
      theme.palette.type === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: '12pt',
    WebkitFontSmoothing: 'auto',
    letterSpacing: 'normal',
    '& .MuiDataGrid-columnsContainer': {
      backgroundColor: theme.palette.type === 'light' ? '#fafafa' : '#1d1d1d',
    },
    '& .MuiDataGrid-iconSeparator': {
      display: 'none',
    },
    '& .MuiDataGrid-colCell, .MuiDataGrid-cell': {
      borderRight: `1px solid ${theme.palette.type === 'light' ? '#f0f0f0' : '#303030'}`,
    },
    '& .MuiDataGrid-colCellTitle': {
      display: 'block',
      textAlign: 'right',
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
      borderBottom: `1px solid ${theme.palette.type === 'light' ? '#f0f0f0' : '#303030'}`,
    },
    '& .MuiDataGrid-cell': {
      color:
        theme.palette.type === 'light'
          ? 'rgba(0,0,0,.85)'
          : 'rgba(255,255,255,0.65)'
    },
    '& .MuiPaginationItem-root': {
      borderRadius: 0,
    },
    '& .MuiDataGrid-main': {
      border: '1px solid #ccc'
    },
    '& .MuiDataGrid-columnHeader': {
      border: '1px solid #f0f0f0'
    }
  },
  label: {
    marginTop: theme.spacing(1),
  },
  toolbar: {
    padding: 0,
    marginTop: 20,
    marginBottom: 20
  },
  textField: {
    height: '40px'
  },
  comboBox: {
    height: '40px'
  },
  button: {
    marginLeft: 10,
    padding: 0,
    borderRadius: '4px',
    textTransform: 'none',
    width: '200px',
    height: '40px'
  },
  banIcon: {
    color: 'red',
  },
  unbanIcon: {
    color: 'green'
  },
  container: {
    marginLeft: '50px',
    marginRight: '50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center'
  },
  text: {
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: '14pt'
  }
}));

export default function UserList() {
  const classes = useStyles();
  const history = useHistory();

  const token = localStorage.getItem('jwtToken');
  const [users, setUsers] = useState([]);
  const [pageSize, setPageSize] = useState(config.PAGE_SIZE);
  const [searchFieldValue, setSearchFieldValue] = useState('');

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      flex: 1,
      sortable: false
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 180,
      sortable: false
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 300,
      sortable: false
    },
    {
      field: 'dateOfBirth',
      headerName: 'Date Of Birth',
      type: 'date',
      width: 180,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      valueFormatter: (params) => {
        return moment(params.row.dateOfBirth).format(config.DATE_FORMAT);
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.isBanned ? "Unban" : "Ban"} aria-label="banOrUnban">
            <IconButton size="small" onClick={() => {
              handleBanOrUnbanUser(params.row.id);
            }}>
              {params.row.isBanned
                ? <BlockIcon className={classes.banIcon} />
                : <CheckCircleIcon className={classes.unbanIcon} />
              }
            </IconButton>
          </Tooltip>
        );
      }
    }
  ];

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      if (res.status === 200) {
        const result = await res.json();
        setUsers(result.users);
      } else {
        setUsers([]);
      }
    }

    getUsers();
  }, []);

  const handleSearch = () => {

  }

  const handleReset = () => {

  }

  const handleMoveToUserProfile = (userID) => {
    history.push('/userProfile', { id: userID });
  }

  const handleBanOrUnbanUser = (userID) => {

  }

  return (
    <React.Fragment>
      <div className={classes.container}>
        <p style={{ fontSize: '18pt', color: '#666666', fontWeight: 500, }}>
          Danh sách người dùng
        </p>

        <Divider />

        <div>
          <Toolbar className={classes.toolbar}>
            <TextField
              value={searchFieldValue}
              className={classes.textField}
              autoFocus
              id="userSearch"
              size='small'
              placeholder="Search..."
              variant="outlined"
              fullWidth
              onChange={e => setSearchFieldValue(e.target.value)}
            />

            <Button className={classes.button} variant="contained" color="primary" onClick={handleSearch}>
              Search Button
            </Button>

            <Button className={classes.button} variant="outlined" color="primary" onClick={handleReset}>
              Reset Button
            </Button>
          </Toolbar>
        </div >

        <div style={{ height: 95 + 41 * pageSize, width: '100%' }}>
          <DataGrid
            className={classes.root}
            components={{
              NoRowsOverlay: CustomNoRowsOverlay,
            }}
            disableSelectionOnClick
            disableColumnMenu
            rows={users}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 20]}
            rowHeight={32}
            headerHeight={32}
            onPageSizeChange={(params) => {
              setPageSize(params.pageSize);
            }}
            onRowDoubleClick={(params) => {
              handleMoveToUserProfile(params.row.id);
            }}
            density='comfortable'
          />
        </div>
      </div>
    </React.Fragment>
  );
}