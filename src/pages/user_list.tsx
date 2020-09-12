import React, {ReactNode} from 'react';
import {createStyles, makeStyles, useTheme} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import {
    Box,
    Button,
    Collapse,
    Container, FormControl,
    FormHelperText,
    IconButton, InputLabel,
    MenuItem,
    Select,
    Typography
} from "@material-ui/core";
import {IUserInfo} from "../wrapper/types";
import {Link, RouteComponentProps} from 'react-router-dom';
import {useSelector} from "react-redux";
import {IStore} from "../store/store";
import {deviceList, userChangeGroup, userDelete, userList} from "../wrapper/requests";
import {Alert} from "@material-ui/lab";
import {UserGroup, UserGroupName} from "../constants/group";
import {formatTime} from '../utils/time_format';
import {LocalUrls} from "../constants/local_urls";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import RefreshIcon from "@material-ui/icons/Refresh";
import AppBar from "@material-ui/core/AppBar";
import {UserNameLink} from "../components/user_name_link";

const useStyles = makeStyles(theme => createStyles({
    root: {
        width: '100%',
        overflow: "hidden",
        whitespace: "nowrap",
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
}));

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
    userGroupChange: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        flexWrap: "wrap",
        "& .MuiButton-root + .MuiButton-root": {
            marginLeft: theme.spacing(1),
        },
    }
}));

interface Column {
    id: 'name' | 'student_id' | 'group';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: string) => string;
}

const columns: Column[] = [
    {id: 'name', label: '姓名', minWidth: 80},
    {id: 'student_id', label: '学号', minWidth: 80},
    {
        id: 'group',
        label: '权限组',
        minWidth: 80,
        //align: 'right',
        format: (value: string) => {
            return UserGroupName[value as UserGroup];
        },
    },
];

export function KeyValueView(props: {
    keyString: ReactNode,
    value: ReactNode,
}) {
    return <div>
        <Typography component="span" variant="body1" color="textSecondary"
                    style={{display: "inline-block", width: "6em"}}>{props.keyString}</Typography>
        <Typography component="span" variant="body1">{props.value}</Typography>
    </div>;
}


function UserRow(props: {
    row: IUserInfo,
    onRefresh: () => unknown,
}) {
    const {row} = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles(useTheme());
    const [newGroup, setNewGroup] = React.useState(row.group);
    const [message, setMessage] = React.useState("");
    const [refresh, setRefresh] = React.useState(false);
    React.useEffect(() => {
        setMessage("");
        setNewGroup(row.group);
    }, [open])

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell
                    style={{maxWidth: "30px"}}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                {columns.map((column) => {
                    const value = row[column.id];
                    return (
                        <TableCell key={column.id} align={column.align}>
                            {column.id === 'name' ?
                                row[column.id] : (column.format ? column.format(value.toString()) : value)}
                        </TableCell>
                    );
                })}
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0, paddingLeft: "30px"}} colSpan={columns.length + 1}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <KeyValueView keyString={"姓名"}
                                          value={<UserNameLink userInfo={props.row}/>}/>
                            <KeyValueView keyString={"学号"}
                                          value={props.row.student_id}/>
                            <KeyValueView keyString={"邮箱"}
                                          value={props.row.email}/>
                            <KeyValueView keyString={"注册时间"}
                                          value={formatTime(props.row.register_time)}/>
                            <div className={classes.userGroupChange}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel shrink>
                                        新用户组
                                    </InputLabel>
                                    <Select
                                        // labelId="demo-simple-select-placeholder-label-label"
                                        value={newGroup}
                                        onChange={evt => setNewGroup(evt.target.value as UserGroup)}
                                        displayEmpty
                                        className={classes.selectEmpty}
                                    >
                                        <MenuItem value={"borrower"}>{UserGroupName.borrower}</MenuItem>
                                        <MenuItem value={"provider"}>{UserGroupName.provider}</MenuItem>
                                        <MenuItem value={"admin"}>{UserGroupName.admin}</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button variant="outlined"
                                        color="primary"
                                        onClick={() => {
                                            setMessage("");
                                            userChangeGroup(row.user_id, newGroup).then((result) => {
                                                if (result.success) {
                                                    row.group = newGroup;
                                                    setRefresh(!refresh);
                                                } else {
                                                    setMessage("设置失败: " + result.message);
                                                }
                                            }, reason => {
                                                setMessage("删除失败: " + reason.toString());
                                            })
                                        }}>修改用户组</Button>
                                <Button component={Link}
                                        variant="outlined"
                                        color="primary"
                                        to={{
                                            pathname: LocalUrls.pm,
                                            state: {
                                                userInfo: row,
                                            }
                                        }}>
                                    发送消息
                                </Button>
                                <Button variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            setMessage("");
                                            userDelete(row.user_id).then((result) => {
                                                if (result.success) {
                                                    setRefresh(!refresh);
                                                    props.onRefresh();
                                                } else {
                                                    setMessage("删除失败: " + result.message);
                                                }
                                            }, reason => {
                                                setMessage("删除失败: " + reason.toString());
                                            });
                                        }}>删除用户</Button>
                            </div>
                            {message ? <Alert severity="error">{message}</Alert> : null}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


function UserList(props: {
    users: IUserInfo[],
    onRefresh: () => unknown,
}) {
    const classes = useStyles(useTheme());
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [filterString, setFilterString] = React.useState("");

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const actualList = props.users.filter((value) => {
        if (filterString) {
            return value.name.indexOf(filterString) !== -1;
        }
        return true;
    })

    return (
        <Paper className={classes.root}>
            <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
                <Toolbar>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <SearchIcon className={classes.block} color="inherit"/>
                        </Grid>
                        <Grid item xs>
                            <TextField
                                fullWidth
                                placeholder="姓名"
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
                                <IconButton onClick={props.onRefresh}>
                                    <RefreshIcon className={classes.block} color="inherit"/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{maxWidth: "30px"}}/>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    // style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {actualList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                            return (
                                <UserRow row={row} key={index}
                                         onRefresh={() => {
                                             props.onRefresh();
                                         }}/>
                                // <TableRow hover role="checkbox" tabIndex={-1} key={row.user_id}>
                                //     {columns.map((column) => {
                                //         const value = row[column.id];
                                //         return (
                                //             <TableCell key={column.id} align={column.align}>
                                //                 {column.format ? column.format(value.toString()) : value}
                                //             </TableCell>
                                //         );
                                //     })}
                                // </TableRow>
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
        </Paper>
    );
}

export function UserListPage(props: RouteComponentProps) {
    const userInfo = useSelector((store: IStore) => store.user.userInfo);
    const [users, setUsers] = React.useState([] as IUserInfo[]);
    const [errorMessage, setErrorMessage] = React.useState(null as (string | null));
    const [refresh, setRefresh] = React.useState(false);

    React.useEffect(() => {
        setErrorMessage(null);
        userList().then((result) => {
            if (result.success) {
                setErrorMessage(null);
                setUsers(result.data);
            } else {
                setErrorMessage(result.message);
            }
        }, reason => {
            setErrorMessage(reason.toString());
        })
    }, [props, refresh]);

    return <Container>
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
        <UserList users={users}
                  onRefresh={() => {
                      setRefresh(!refresh);
                  }}/>
    </Container>
}