import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'
import {
    Typography,
    Box,
    Avatar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Divider,
    Badge,
    makeStyles,
} from '@material-ui/core/';
import {
    CategoryContext,
    WalletContext
} from '../../mycontext'
import moment from 'moment'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import DefaultIcon from '../../../utils/DefaultIcon'
import { formatMoney } from '../../../utils/currency'


const CategoryAccordion = (props) => {
    const classes = useStyles();

    const { fullList } = useContext(CategoryContext);
    const { walletID, list, expanded, setExpanded } = useContext(WalletContext);

    const [catList, setCatList] = useState([]);
    const extra = new Array(5 - catList?.length).fill(null)

    useEffect(() => {
        if (fullList) {
            const temp = fullList?.sort((a, b) => b.count - a.count)?.slice(0, 5);
            setCatList(temp);
        }
    }, [fullList])

    useEffect(() => {
        if (list && fullList) {
            const temp = [...fullList];
            for (let i = 0; i < temp?.length; i++) {
                const number = list.filter(j => j?.catID === temp[i]?.ID)?.length;
                temp[i] = { ...temp[i], count: number };
                temp?.sort((a, b) => b.count - a.count).slice(0, 5);
                setCatList(temp);
            }
        }
    }, [list, fullList])

    const handleChangeExpand = () => {
        const name = 'category';
        setExpanded(name !== expanded ? name : 'event')
    }
    
    return (
        <div className={classes.root}>
            <Accordion className={classes.accordion} expanded={expanded === 'category'} onChange={() => handleChangeExpand()}>
                <AccordionSummary className={classes.accordionHead} expandIcon={<ExpandMoreIcon className={classes.accordionExpandIcon} />} >
                    <FormatListBulletedIcon className={classes.accordionHeadIcon} />
                    <Typography className={classes.accordionHeadText}>Danh mục giao dịch</Typography>
                </AccordionSummary>
                <Divider className={classes.divider} />
                {(catList || []).map(cat => {
                    return (
                        <React.Fragment key={cat?.ID}>
                            <AccordionDetails className={classes.accordionDetail}>
                                <Box className={classes.categoryInfo}>
                                    <DefaultIcon
                                        IconID={cat?.IconID}
                                        backgroundSize={40}
                                        iconSize={20} />
                                    <Typography
                                        noWrap={true}
                                        className={classes.categoryText}>
                                        {cat?.Name}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Avatar className={classes.avatar}>
                                        <Typography
                                            noWrap={true}
                                            className={classes.categoryNumber}>
                                            {cat?.count}
                                        </Typography>

                                    </Avatar>
                                </Box>
                            </AccordionDetails>
                            <Divider className={classes.divider} />
                        </React.Fragment>
                    )
                })}
                {(extra || []).map((cat, n) => {
                    return (
                        <React.Fragment key={n}>
                            <AccordionDetails className={classes.accordionDetail} style={{ visibility: 'hidden' }}>
                                <Box className={classes.categoryInfo}>
                                    <DefaultIcon
                                        IconID={null}
                                        backgroundSize={40}
                                        iconSize={20} />
                                    <Typography
                                        noWrap={true}
                                        className={classes.categoryText}>
                                        {''}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Avatar className={classes.avatar}>
                                        <Typography
                                            noWrap={true}
                                            className={classes.categoryNumber}>
                                            {''}
                                        </Typography>

                                    </Avatar>
                                </Box>
                            </AccordionDetails>
                            <Divider className={classes.divider} />
                        </React.Fragment>
                    )
                })}

                <Box className={classes.buttonBox}>
                    <Link className={classes.buttonBoxLink} to={`/Wallet/${walletID}/category`} style={{ textDecoration: 'none' }} >
                        <Button className={classes.button} color='primary' variant="contained">
                            Xem thêm
                        </Button>
                    </Link>
                </Box>
            </Accordion>
        </div>
    );
}

export default CategoryAccordion

const useStyles = makeStyles(() => ({
    red: {
        color: '#FF2626'
    },
    green: {
        color: '#1DAF1A'
    },
    wrap: {
        width: "100%",
        wordWrap: 'break-word',
        overflow: 'hidden',
        marginLeft: '15px'
    },
    root: () => ({
        width: "100%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginBottom: '40px'
    }),
    accordion: {
        width: '100%',
        "& .MuiAccordionSummary-root.Mui-expanded": {
            minHeight: '58px',
            height: '58px',
        }

    },
    accordionHead: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fd9b15',
        minHeight: '58px',
        height: '58px',
    },
    accordionHeadIcon: {
        color: "#FFFFFF",
        marginRight: '10px'
    },
    accordionExpandIcon: {
        color: "#FFFFFF",
    },
    accordionHeadText: {
        fontWeight: 'bold',
        color: "#FFFFFF"
    },
    accordionDetail: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px'
    },
    categoryInfo: {
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    categoryText: {
        fontSize: '16px',
        marginLeft: '10px'
    },
    avatar: {
        width: "25px",
        height: '25px',
        backgroundColor: '#FF2626'
    },
    categoryNumber: {
        fontSize: '14px',
        fontWeight: 'bold'
    },
    buttonBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonBoxLink: {
        width: '100%',
        height: '100%',
    },
    button: {
        width: '100%',
        height: '100%',
        padding: '10px',
        backgroundColor: '#fd9b15',
        color: '#FFFFFF',
        fontWeight: 'bold',
        "&:hover": {
            //you want this to be the same as the backgroundColor above
            backgroundColor: "#fd9b15"
        }

    },
}));