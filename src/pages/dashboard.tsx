import React from "react";
import {RouteComponentProps} from "react-router-dom";
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
import {IDevice, IUserInfo} from "../wrapper/types";
import {deviceList, userChangeGroup} from "../wrapper/requests";
import {MaxDevicesPerPage} from "../constants/constants";
import {
    Box,
    Collapse,
    Container,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select
} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {UserGroup} from "../constants/group";
import {Alert} from "@material-ui/lab";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import {DeviceDetailSubPage} from "./device_detail_subpage";
import {useSelector} from "react-redux";
import {IStore} from "../store/store";

const useStyles = makeStyles(theme => createStyles({
    paper: {
        // maxWidth: 936,
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
        //margin: theme.spacing(1),
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
}));

interface Column {
    id: 'name' | 'provider_name';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: string) => string;
}

const columns: Column[] = [
    {id: 'name', label: '设备名称', minWidth: 80},
    {id: 'provider_name', label: '提供者', minWidth: 80},
    {id: 'provider_name', label: '当前借用者', minWidth: 80},
];

function DeviceRow(props: { row: IDevice, collapse: React.ReactNode }) {
    const {row} = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles(useTheme());

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell
                    style={{maxWidth: "30px"}}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell>
                    {row.name}
                </TableCell>
                <TableCell>
                    {row.owner.name}
                </TableCell>
                <TableCell>
                    {row.borrower ? row.borrower.name : ""}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={columns.length + 1}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {props.collapse}
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export function DashboardPage(props: {
    provider?: boolean
    borrower?: boolean
}) {
    const classes = useStyles(useTheme());
    const [devices, setDevices] = React.useState([] as IDevice[]);
    const [errorMessage, setErrorMessage] = React.useState(null as (string | null));
    const [page, setPage] = React.useState(0);
    const [filterString, setFilterString] = React.useState("");
    const [refresh, setRefresh] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const userInfo = useSelector((store: IStore) => store.user.userInfo);

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
                        <TableContainer className={classes.container}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{maxWidth: "30px"}}/>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{minWidth: column.minWidth}}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {actualList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                        return (
                                            <DeviceRow key={index} row={row} collapse={
                                                <DeviceDetailSubPage deviceDetail={row} showBorrowButton={!props.borrower && !props.provider}/>
                                            }/>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={actualList.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </div>
                )
            }
        </Paper>
    </Container>
}
