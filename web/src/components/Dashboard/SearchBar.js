import React, { useState, useEffect } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import FilterListIcon from '@material-ui/icons/FilterList';
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

import DefaultIcon from '../../utils/DefaultIcon'

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
        padding: 10,
    },
    dividerVertical: {
        height: 28,
        margin: 4,
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

export default function SearchBar({ searchInput, setSearchInput, categoryList, setCategoryList }) {
    const classes = useStyles();
    // search input
    const clearInput = () => {
        setSearchInput('');
    }
    const changeInput = (e) => {
        setSearchInput(e.target.value);
    }

    // filter menu
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    // check filter
    const [checkAll, setCheckAll] = useState(true);
    const checkBox = (event) => {
        const tempList = categoryList.slice();
        tempList[event.target.id].check = event.target.checked;
        setCategoryList(tempList)
    }
    const checkBoxAll = (event) => {
        setCheckAll(event.target.checked);
        const tempList = categoryList.slice();
        tempList.forEach(i => {
            i.check = event.target.checked
        });
        setCategoryList(tempList)
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
                placeholder="Tìm kiếm giao dịch" />
            <IconButton className={classes.iconButton} aria-label="clear" onClick={clearInput}>
                <ClearIcon />
            </IconButton>
            <Divider className={classes.dividerVertical} orientation="vertical" />
            <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleClick}>
                <FilterListIcon />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
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
                    {categoryList && categoryList.map((i, n) => {
                        return (
                            <React.Fragment key={i.ID}>
                                <Box className={classes.filterRow}>
                                    <Box className={classes.filterInfo}>
                                        <DefaultIcon
                                            IconID={i.IconID}
                                            backgroundSize={40}
                                            iconSize={20} />
                                        <Typography
                                            noWrap={true}
                                            className={classes.filterText}>
                                            {i.Name}
                                        </Typography>
                                    </Box>
                                    <Checkbox
                                        id={n}
                                        checked={i.check}
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

        </Container>
    );
}
