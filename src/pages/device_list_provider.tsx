import {createStyles, makeStyles, useTheme} from "@material-ui/core/styles";
import {IDevice} from "../wrapper/types";
import {List, ListItem, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import {RouteComponentProps} from "react-router-dom";
import React from "react";
import {deviceList} from "../wrapper/requests";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";
import Typography from "@material-ui/core/Typography";
import {MaxDevicesPerPage} from "../constants/constants";
import {useSelector} from "react-redux";
import {IStore} from "../store/store";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {DeviceListPage} from "./device_list";


const useStyles = makeStyles(theme => createStyles({
    paper: {
        maxWidth: 960,
        margin: 'auto',
        overflow: 'hidden',
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
}))

export function DeviceListProviderPage(props: RouteComponentProps) {
    return <DeviceListPage provider={true} title={"我提供的设备"}/>
}

export function DeviceListSelfPage(props: RouteComponentProps) {
    return <DeviceListPage borrower={true} title={"我借用的设备"}/>
}
