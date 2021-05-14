import React, { useState, useContext, useEffect } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import FilterListIcon from '@material-ui/icons/FilterList';
import SettingsIcon from '@material-ui/icons/Settings';
import {
    Container,
    TextField,
    Popover,
    Box,
    Divider,
    Avatar,
    Typography,
    makeStyles,
    Checkbox,
    IconButton
} from '@material-ui/core';
import {
    CategoryContext,
    WalletContext
} from '../mycontext'
import { getSocket } from '../../utils/socket'
import DefaultIcon from '../../utils/DefaultIcon'
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function SearchBar(props) {
    const classes = useStyles();
    const socket = getSocket();
    const matches = useMediaQuery('(min-width:600px)');

    const { list, setFilterList, isSimple, setSimpleOption } = useContext(WalletContext);
    const { fullList } = useContext(CategoryContext);

    const [checkList, setCheckList] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        if (fullList) {
            let temp = [];
            for (let i = 0; i < fullList?.length; i++) {
                temp.push({ ...fullList[i], checked: true })
            }
            setCheckList(temp)
        }
    }, [fullList])

    // update filter list
    useEffect(() => {
        let filtered = list.slice();
        if (searchInput !== '') {
            filtered = filtered.filter(i => i.description.toLowerCase().includes(searchInput.toLowerCase()) || i.categoryName.toLowerCase().includes(searchInput.toLowerCase()));
        }
        setFilterList(filtered.filter(i => checkList.filter(cat => cat.ID === i.catID && cat.checked === true).length !== 0))
    }, [list, searchInput, checkList])


    // search input
    const clearInput = () => {
        setSearchInput('');
    }
    const changeInput = (e) => {
        setSearchInput(e.target.value);
    }

    // filter menu
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickFilter = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseFilter = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [checkAll, setCheckAll] = useState(true);
    const checkBox = (event) => {
        setCheckList(checkList.map(cat => (cat.ID === event.target.id ? { ...cat, checked: !cat.checked } : cat)));
    }
    const checkBoxAll = (event) => {
        setCheckAll(event.target.checked);
        setCheckList(checkList.map(cat => ({ ...cat, checked: event.target.checked })));
    }

    // option menu
    const [anchorEl_option, setAnchorEl_option] = React.useState(null);

    const handleClickOption = (event) => {
        setAnchorEl_option(event.currentTarget);
    };

    const handleCloseOption = () => {
        setAnchorEl_option(null);
    };
    const open_option = Boolean(anchorEl_option);
    const id_option = open_option ? 'simple-popover' : undefined;

    const checkBoxSimple = (event) => {
        setSimpleOption(event.target.checked);
    }

    return (
        <Container component="form" className={classes.root}>
            <Box className={classes.iconButton} aria-label="search">
                <SearchIcon />
            </Box>
            <TextField
                className={classes.input}
                value={searchInput}
                onChange={changeInput}
                placeholder="Tìm kiếm giao dịch"
                                InputProps={searchInput !== '' ? {
                    endAdornment:
                        <IconButton className={classes.iconButton} size='small' aria-label="clear" onClick={clearInput}>
                            <ClearIcon />
                        </IconButton>,
                } : null}
            />
            <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleClickFilter}>
                <FilterListIcon className={classes.filterIcon} />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleCloseFilter}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box
                    boxShadow={3}
                    bgcolor="background.paper"
                    className={classes.filterMenu}>

                    <Box className={classes.filterRow}>
                        <Box className={classes.filterInfo}>
                            <Avatar className={classes.filterIconBox}>
                                <FilterListIcon fontSize="large" className={classes.filterIcon} />
                            </Avatar>
                            <Typography
                                className={classes.filterTitleText}>
                                Lọc các loại giao dịch
                            </Typography>
                        </Box>
                        <Checkbox
                            checked={checkAll}
                            onChange={(event) => checkBoxAll(event)}
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    </Box>

                    <Divider className={classes.dividerBold} />
                    {(checkList || []).map((i, n) => {
                        return (
                            <React.Fragment key={i?.ID}>
                                <Box className={classes.filterRow}>
                                    <Box className={classes.filterInfo}>
                                        <DefaultIcon
                                            IconID={i?.IconID}
                                            backgroundSize={40}
                                            iconSize={20} />
                                        <Typography
                                            noWrap={true}
                                            className={classes.filterText}>
                                            {i?.Name}
                                        </Typography>
                                    </Box>
                                    <Checkbox
                                        id={i?.ID}
                                        checked={i?.checked}
                                        onChange={(event) => checkBox(event)}
                                        color="primary"
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                </Box>
                                <Divider className={classes.divider} />
                            </React.Fragment>
                        )
                    })}

                </Box>
            </Popover>
            <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleClickOption}>
                <SettingsIcon className={classes.filterIcon} />
            </IconButton>
            <Popover
                id={id_option}
                open={open_option}
                anchorEl={anchorEl_option}
                onClose={handleCloseOption}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box
                    boxShadow={3}
                    bgcolor="background.paper"
                    className={classes.filterMenu}>

                    <Box className={classes.filterRow}>
                        <Box className={classes.filterInfo}>
                            <Avatar className={classes.filterIconBox}>
                                <SettingsIcon fontSize="large" className={classes.filterIcon} />
                            </Avatar>
                            <Typography
                                className={classes.filterTitleText}>
                                Tùy chỉnh
                            </Typography>
                        </Box>
                    </Box>

                    <Divider className={classes.dividerBold} />
                    <Box className={classes.filterRow}>
                        <Box className={classes.filterInfo}>
                            <Typography
                                noWrap={true}
                                className={classes.filterText}>
                                Sử dụng danh sách đơn giản
                            </Typography>
                        </Box>
                        <Checkbox
                            checked={isSimple}
                            onChange={(event) => checkBoxSimple(event)}
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    </Box>
                    <Divider className={classes.divider} />
                </Box>
            </Popover>


        </Container>
    );
}
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        padding: '2px 0px 2px 4px',
        display: 'flex',
        alignItems: 'center',
        margin: '5px 0px',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        fontSize: '16px',
    },
    iconButton: {
        display: 'flex',
        alignItems: 'center',
        padding: '5px',
    },
    dividerBold: {
        width: '100%',
        backgroundColor: '#000000'
    },
    divider: {
        width: '100%',
    },

    // filter menu
    filterMenu: {
        minWidth: '400px',
        maxWidth: '400px',
        maxHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        overflowY: 'auto',
    },
    filterTitleText: {                           // filter header
        fontSize: '18px',
        fontWeight: 'bold',
        marginLeft: '10px'
    },
    filterIconBox: {
        width: '50px',
        height: '50px',
        backgroundColor: '#FFFFFF'
    },
    filterIcon: {
        color: '#000000'
    },
    filterRow: {                                // filter row
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 5px 15px 10px',
    },
    filterInfo: {
        wordWrap: 'break-word',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    filterText: {
        fontSize: '16px',
        marginLeft: '10px'
    },
}));

