import React from 'react';
import clsx from 'clsx';
import {createStyles, Theme, withStyles, WithStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer, {DrawerProps} from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
import PublicIcon from '@material-ui/icons/Public';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import TimerIcon from '@material-ui/icons/Timer';
import SettingsIcon from '@material-ui/icons/Settings';
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {Omit} from '@material-ui/types';
import {Strings} from "../constants/strings";
import {LocalUrls} from "../constants/local_urls";
import {Link} from "react-router-dom";
import {UserGroup} from "../constants/group";
import PieChartIcon from '@material-ui/icons/PieChart';

const unloggedInCategories = [
    {
        id: '用户',
        permission: ['borrower', 'admin', 'provider'],
        children: [
            {id: '登录', icon: <PeopleIcon/>, link: LocalUrls.login, except: []},
            {id: '注册', icon: <AddBoxIcon/>, link: LocalUrls.register, except: []},
            {id: '注册 (Legacy)', icon: <AddBoxIcon/>, link: LocalUrls.register + "?legacy", except: []},
        ],
    },
]

const categories = [
    {
        id: '用户',
        permission: ['borrower', 'admin', 'provider'],
        children: [
            {id: '我的个人信息', icon: <HomeIcon/>, link: LocalUrls.main_page, except: []},
            {id: '恢复信用分', icon: <SettingsBackupRestoreIcon/>, link: LocalUrls.apply_credit, except: []},
            {id: '设备列表', icon: <DnsRoundedIcon/>, link: LocalUrls.devices, except: []},
            {id: '我借用的', icon: <DnsRoundedIcon/>, link: LocalUrls.borrowed_devices, except: []},
            {id: '我的借用申请', icon: <DnsRoundedIcon/>, link: LocalUrls.apply_borrow, except: []},
            {id: '申请成为设备提供者', icon: <DnsRoundedIcon/>, link: LocalUrls.become_provider, except: ['provider', 'admin']},
        ],
    },
    {
        id: '管理',
        permission: ['admin'],
        children: [
            {id: '用户管理', icon: <PeopleIcon/>, link: LocalUrls.user_admin, except: []},
            {id: '设备管理', icon: <DnsRoundedIcon/>, link: LocalUrls.device_admin, except: []},
            {id: '提权申请处理', icon: <DoneAllIcon/>, link: LocalUrls.become_provider_admin, except: []},
            {id: '借用申请处理', icon: <DoneAllIcon/>, link: LocalUrls.borrow_handle_admin, except: []},
            {id: '上架申请处理', icon: <DoneAllIcon/>, link: LocalUrls.create_device_handle_admin, except: []},
            {id: '信用分恢复申请处理', icon: <DoneAllIcon/>, link: LocalUrls.apply_credit_handle_admin, except: []},
            {id: '统计信息', icon: <PieChartIcon/>, link: LocalUrls.dashboard, except: []},
        ],
    },
    {
        id: '设备提供者',
        permission: ['admin', 'provider'],
        children: [
            {id: '我提供的设备', icon: <DnsRoundedIcon/>, link: LocalUrls.devices_provider, except: []},
            {id: '借用申请处理', icon: <DoneAllIcon/>, link: LocalUrls.borrow_handle_provider, except: []},
            {id: '上架设备', icon: <AddBoxIcon/>, link: LocalUrls.create_device_provider, except: []},
        ],
    },
];

const styles = (theme: Theme) =>
    createStyles({
        categoryHeader: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        categoryHeaderPrimary: {
            color: theme.palette.common.white,
        },
        item: {
            paddingTop: 1,
            paddingBottom: 1,
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover,&:focus': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
        },
        itemCategory: {
            backgroundColor: '#232f3e',
            boxShadow: '0 -1px 0 #404854 inset',
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        firebase: {
            fontSize: 24,
            color: theme.palette.common.white,
        },
        itemActiveItem: {
            color: '#4fc3f7',
        },
        itemPrimary: {
            fontSize: 'inherit',
        },
        itemIcon: {
            minWidth: 'auto',
            marginRight: theme.spacing(2),
        },
        divider: {
            marginTop: theme.spacing(2),
        },
    });

export interface NavigatorProps extends Omit<DrawerProps, 'classes'>, WithStyles<typeof styles> {
    isLoggedIn: boolean,
    currentPath: string,
    userGroup?: UserGroup,
}

function Navigator(props: NavigatorProps) {
    const {classes, isLoggedIn, currentPath, userGroup, ...other} = props;

    return (
        <Drawer variant="permanent" {...other}>
            <List disablePadding>
                <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
                    {Strings.app_name}
                </ListItem>
                {(isLoggedIn ? categories.filter((value) => {
                    if (userGroup) {
                        return value.permission.indexOf(userGroup) !== -1;
                    } else {
                        return true;
                    }
                }) : unloggedInCategories).map(({id, children}) => (
                    <React.Fragment key={id}>
                        <ListItem className={classes.categoryHeader}>
                            <ListItemText
                                classes={{
                                    primary: classes.categoryHeaderPrimary,
                                }}
                            >
                                {id}
                            </ListItemText>
                        </ListItem>
                        {children.map(({id: childId, icon, link, except}) => (
                            !props.userGroup || (props.userGroup && except.indexOf(props.userGroup) === -1) ?
                                <ListItem
                                    key={childId}
                                    button
                                    className={clsx(classes.item, (link.startsWith(currentPath)) && classes.itemActiveItem)}
                                    component={Link}
                                    to={link}
                                >
                                    <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                                    <ListItemText
                                        classes={{
                                            primary: classes.itemPrimary,
                                        }}
                                    >
                                        {childId}
                                    </ListItemText>
                                </ListItem> : null
                        ))}
                        <Divider className={classes.divider}/>
                    </React.Fragment>
                ))}
            </List>
        </Drawer>
    );
}

export default withStyles(styles)(Navigator);
