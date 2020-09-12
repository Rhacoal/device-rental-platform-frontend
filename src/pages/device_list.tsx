import React from "react";
import {Link, RouteComponentProps} from "react-router-dom";
import {createStyles, makeStyles, useTheme} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import {IApplication, IDevice, IUserInfo} from "../wrapper/types";
import {deviceList, userChangeGroup} from "../wrapper/requests";
import {MaxCommentsPerPage, MaxDevicesPerPage} from "../constants/constants";
import {
    Box, ButtonGroup,
    Collapse, colors,
    Container, Divider,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select, Snackbar
} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {UserGroup} from "../constants/group";
import {Alert, Pagination} from "@material-ui/lab";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import {DeviceDetailSubPage} from "./device_detail_subpage";
import {useSelector} from "react-redux";
import {IStore} from "../store/store";
import clsx from "clsx";
import {formatTime, toShortTimeString} from "../utils/time_format";
import {LocalUrls} from "../constants/local_urls";
import {
    ApplicationApproved,
    ApplicationApprovedReturned, ApplicationCanceled,
    ApplicationPending,
    ApplicationRejected, ApplicationUnknown
} from "../constants/application_status";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {ApplicationViewProps} from "./applications/application_admin";
import CachedIcon from "@material-ui/icons/Cached";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import HelpIcon from "@material-ui/icons/Help";

const useStyles = makeStyles(theme => createStyles({
    paper: {
        // maxWidth: 960,
        margin: 'auto',
        overflow: 'hidden',
    },
    container: {
        // maxHeight: "calc(100vh - 128px)",
    },
    searchBar: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    },
    searchInput: {
        fontSize: theme.typography.fontSize,
    },
    block: {
        display: 'block',
    },
    addUser: {
        marginRight: theme.spacing(1),
    },
    contentWrapper: {
        margin: '40px 16px',
    },
    contentWrapperWithTable: {
        margin: theme.spacing(0, 0, 1.5),
        display: "flex",
        flexDirection: "column",
    },
    divider: {
        backgroundColor: theme.palette.divider,
    }
}))

function DeviceDigestView(props: {
    device: IDevice
}) {
    return <ListItem>
        <ListItemText primary={props.device.name}
                      secondary={props.device.description.substring(0, 100)}/>
    </ListItem>
}


const useRowStyles = makeStyles(theme => createStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    deviceDetail: {
        backgroundColor: "#fdfeff",
    },
}));

interface Column {
    id: 'name' | 'provider_name' | 'borrower_name' | 'return_time';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: string) => string;
}

const columns: Column[] = [
    {id: 'name', label: '设备名称', minWidth: undefined},
    {id: 'provider_name', label: '提供者', minWidth: 120},
    {id: 'borrower_name', label: '当前借用者', minWidth: 120},
    {id: 'return_time', label: '预计归还', minWidth: 120},
];


const useDeviceViewStyles = makeStyles(theme => createStyles({
    listItem: {
        flexDirection: "column",
        alignItems: "stretch",
    },
    listItemLine1: {
        display: "flex",
        justifyContent: "space-between",
    },
    applicationDescription: {
        flex: "1 1",
    },
    applicationStatus: {
        display: "flex",
        alignItems: "center",
    },
    borrowedStatus: {
        color: theme.palette.warning.main,
    },
    availableStatus: {
        color: theme.palette.success.main,
    },
    marginTopBottom1: {
        margin: theme.spacing(1, 0),
    },
    approveButton: {
        backgroundColor: theme.palette.success.light,
        color: "#fff",
        "&:hover": {
            backgroundColor: theme.palette.success.main,
        }
    },
    rejectButton: {
        backgroundColor: theme.palette.error.light,
        color: "#fff",
        "&:hover": {
            backgroundColor: theme.palette.error.main,
        }
    },
    cancelButton: {
        backgroundColor: theme.palette.grey.A700,
        color: "#fff",
        "&:hover": {
            backgroundColor: theme.palette.grey.A400,
        }
    },
    unknownStatus: {
        color: theme.palette.grey.A400,
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}))

function DeviceUsageStatus(props: {
    borrowed: boolean,
    className?: string
}) {
    const classes = useDeviceViewStyles(useTheme());
    return <span className={props.className}>
        {
            props.borrowed ? <React.Fragment>
                    <RemoveCircleIcon className={classes.borrowedStatus}/>
                    <Typography className={classes.borrowedStatus} variant="body1" component="span">
                        正在使用
                    </Typography>
                </React.Fragment>
                : <React.Fragment>
                    <CheckCircleIcon className={classes.availableStatus}/>
                    <Typography className={classes.availableStatus} variant="body1" component="span">
                        空闲
                    </Typography>
                </React.Fragment>
        }
    </span>
}


export function DeviceView(props: {
    deviceDetail: IDevice,
    collapse: React.ReactNode,
}) {
    const classes = useDeviceViewStyles(useTheme());
    const [handleReason, setHandleReason] = React.useState("");
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => setExpanded(!expanded);
    return <ListItem className={classes.listItem}>
        <span className={classes.listItemLine1}>
            <Typography className={classes.applicationDescription} variant="h6"
                        component="span">{props.deviceDetail.name}</Typography>
            <DeviceUsageStatus className={classes.applicationStatus} borrowed={!!props.deviceDetail.borrower}/>
        </span>
        <Grid container justify="space-between">
            <Grid item>
                <Typography variant="body2" color="textSecondary">提供者: {props.deviceDetail.owner.name}</Typography>
            </Grid>
            <Grid item>
                <IconButton className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded,
                })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more">
                    <ExpandMoreIcon/>
                </IconButton>
            </Grid>
        </Grid>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            {
                props.deviceDetail.borrower && props.deviceDetail.return_time ?
                    <Typography variant="body2"
                                color="textSecondary">
                        预计归还时间: {formatTime(props.deviceDetail.return_time)}
                    </Typography> : null
            }
            {props.collapse}
        </Collapse>
    </ListItem>
}

function DeviceRow(props: { row: IDevice, collapse: React.ReactNode }) {
    const {row} = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles(useTheme());

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell
                    style={{width: "30px"}}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell>
                    {row.name}
                </TableCell>
                <TableCell>
                    <Button component={Link} to={{
                        pathname: LocalUrls.pm,
                        state: {
                            userInfo: row.owner,
                        }
                    }}>
                        {row.owner.name}
                    </Button>
                </TableCell>
                <TableCell>
                    <Button component={Link} to={row.borrower ? {
                        pathname: LocalUrls.pm,
                        state: {
                            userInfo: row.borrower,
                        }
                    } : ""}>
                        {row.borrower ? row.borrower.name : ""}
                    </Button>
                </TableCell>
                <TableCell>
                    {row.return_time ? toShortTimeString(row.return_time) : ""}
                </TableCell>
            </TableRow>
            <TableRow className={clsx(classes.deviceDetail)}>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={columns.length + 1}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {props.collapse}
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export function DeviceListPage(props: {
    provider?: boolean,
    borrower?: boolean,
    admin?: boolean
}) {
    const classes = useStyles(useTheme());
    const [devices, setDevices] = React.useState([] as IDevice[]);
    const [errorMessage, setErrorMessage] = React.useState(null as (string | null));
    const [page, setPage] = React.useState(1);
    const [filterString, setFilterString] = React.useState("");
    const [refresh, setRefresh] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const userInfo = useSelector((store: IStore) => store.user.userInfo);
    const [snackOpen, setSnackOpen] = React.useState(false);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    React.useEffect(() => {
        if (!userInfo) return;
        setErrorMessage(null);
        setDevices([]);
        (deviceList(props.provider ? {owner_id: userInfo.user_id} : (props.borrower ? {borrower_id: userInfo.user_id} : {}))).then((result) => {
            if (result.success) {
                setErrorMessage(null);
                setDevices(result.data);
            } else {
                setErrorMessage(result.message);
            }
        }, reason => {
            setErrorMessage(reason.toString());
        })
    }, [props, refresh, userInfo]);

    const triggerRefresh = () => {
        setRefresh(!refresh);
    }

    const actualList = devices.filter((value) => {
        if (filterString) {
            return (
                value.device_id.toString().indexOf(filterString) !== -1
                || value.name.indexOf(filterString) !== -1
                || value.description.indexOf(filterString) !== -1
            )
        }
        return true;
    })

    return <Container>
        <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)}>
            <Alert onClose={() => setSnackOpen(false)} severity="success">
                {"已刷新！"}
            </Alert>
        </Snackbar>
        <Paper className={classes.paper}>
            <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
                <Toolbar>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <SearchIcon className={classes.block} color="inherit"/>
                        </Grid>
                        <Grid item xs>
                            <TextField
                                fullWidth
                                placeholder="设备名称/设备 ID"
                                InputProps={{
                                    disableUnderline: true,
                                    className: classes.searchInput,
                                }}
                                value={filterString}
                                onChange={event => {
                                    setFilterString(event.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Tooltip title="Reload">
                                <IconButton onClick={triggerRefresh}>
                                    <RefreshIcon className={classes.block} color="inherit"/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

            {
                (!devices || actualList.length === 0) ? (
                    <div className={classes.contentWrapper}>{
                        errorMessage ? <Typography color="textSecondary" align="center">
                            {errorMessage}
                        </Typography> : <Typography color="textSecondary" align="center">
                            暂无设备
                        </Typography>}
                    </div>
                ) : (
                    <div className={classes.contentWrapperWithTable}>
                        <List>
                            {actualList.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <DeviceView deviceDetail={row} collapse={
                                            <DeviceDetailSubPage deviceDetail={row}
                                                                 showBorrowButton={!props.admin && !props.borrower && !props.provider}
                                                                 showEditButton={!!props.admin || (!!userInfo && !!props.provider && row.owner.user_id === userInfo.user_id)}
                                                                 showReturnButton={!!props.borrower}
                                                                 onEdit={triggerRefresh}
                                            />
                                        }/>
                                        <Divider component="li" className={classes.divider} />
                                    </React.Fragment>
                                );
                            })}
                        </List>
                        {/*<TableContainer className={classes.container}>*/}
                        {/*    <Table stickyHeader aria-label="sticky table">*/}
                        {/*        <TableHead>*/}
                        {/*            <TableRow>*/}
                        {/*                <TableCell style={{maxWidth: "30px"}}/>*/}
                        {/*                {columns.map((column) => (*/}
                        {/*                    <TableCell*/}
                        {/*                        key={column.id}*/}
                        {/*                        align={column.align}*/}
                        {/*                        style={{width: column.minWidth}}*/}
                        {/*                    >*/}
                        {/*                        {column.label}*/}
                        {/*                    </TableCell>*/}
                        {/*                ))}*/}
                        {/*            </TableRow>*/}
                        {/*        </TableHead>*/}
                        {/*        <TableBody>*/}
                        {/*        </TableBody>*/}
                        {/*    </Table>*/}
                        {/*</TableContainer>*/}
                        {/*<TablePagination*/}
                        {/*    rowsPerPageOptions={[10, 25, 50]}*/}
                        {/*    component="div"*/}
                        {/*    count={actualList.length}*/}
                        {/*    rowsPerPage={rowsPerPage}*/}
                        {/*    page={page}*/}
                        {/*    onChangePage={handleChangePage}*/}
                        {/*    onChangeRowsPerPage={handleChangeRowsPerPage}*/}
                        {/*/>*/}
                        <Pagination
                            style={{alignSelf: "center"}}
                            // component="div"
                            count={Math.max(1, Math.ceil(actualList.length / MaxDevicesPerPage))}
                            // rowsPerPage={rowsPerPage}
                            page={page}
                            // onChangePage={handleChangePage}
                            onChange={handleChangePage}
                            // onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </div>
                )
            }
        </Paper>
    </Container>
}
