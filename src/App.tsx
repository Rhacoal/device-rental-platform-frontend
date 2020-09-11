import React from 'react';
import './App.css';
import {Switch, BrowserRouter, Route, RouteComponentProps, Redirect} from 'react-router-dom';
import CssBaseline from "@material-ui/core/CssBaseline";
import Hidden from "@material-ui/core/Hidden";
import Navigator from "./paperbase/Navigator";
import Header from "./paperbase/Header";
import {createMuiTheme, createStyles, makeStyles, ThemeProvider, useTheme} from "@material-ui/core/styles";
import {IStore, store, UserInfoSlice} from "./store/store";
import {Provider, useDispatch, useSelector} from 'react-redux';
import SignIn from "./pages/signin";
import {LocalUrls} from "./constants/local_urls";
import SignUp from "./pages/signup";
import {DeviceListPage} from "./pages/device_list";
import {
    DeviceBorrowApplicationAdminPage,
    DeviceBorrowApplicationProviderPage, DeviceBorrowApplicationSelfPage
} from "./pages/device_borrow_application_management";
import {canUpdateUnreadCount, selfUserInfo, updateUnreadCount, userInfo} from "./wrapper/requests";
import {PendingLogin, Profile} from "./pages/profile";
import {UserListPage} from "./pages/user_list";
import {PermissionApplicationAdminPage, PermissionApplicationSelfPage} from "./pages/permission_application_management";
import {
    DeviceCreateApplicationAdminPage,
    DeviceCreateApplicationProviderPage
} from "./pages/device_create_application_management";
import {DeviceListProviderPage, DeviceListSelfPage} from "./pages/device_list_provider";
import {Copyright} from "./components/copyrights";
import {DeviceListAdminPage} from "./pages/device_list_admin";
import {DashboardPage} from "./pages/dashboard/dashboard";
import {PMListPage} from "./pages/private_message_page";
import {SubDirectory} from "./wrapper/urls";


let theme = createMuiTheme({
    palette: {
        primary: {
            light: '#63ccff',
            main: '#009be5',
            dark: '#006db3',
        },
    },
    typography: {
        h5: {
            fontWeight: 500,
            fontSize: 26,
            letterSpacing: 0.5,
        },
    },
    shape: {
        borderRadius: 8,
    },
    props: {
        MuiTab: {
            disableRipple: true,
        },
    },
    mixins: {
        toolbar: {
            minHeight: 48,
        },
    },
});

theme = {
    ...theme,
    overrides: {
        MuiDrawer: {
            paper: {
                backgroundColor: '#18202c',
            },
        },
        MuiButton: {
            label: {
                textTransform: 'none',
            },
            contained: {
                boxShadow: 'none',
                '&:active': {
                    boxShadow: 'none',
                },
            },
        },
        MuiTabs: {
            root: {
                marginLeft: theme.spacing(1),
            },
            indicator: {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
                backgroundColor: theme.palette.common.white,
            },
        },
        MuiTab: {
            root: {
                textTransform: 'none',
                margin: '0 16px',
                minWidth: 0,
                padding: 0,
                [theme.breakpoints.up('md')]: {
                    padding: 0,
                    minWidth: 0,
                },
            },
        },
        MuiIconButton: {
            root: {
                padding: theme.spacing(1),
            },
        },
        MuiTooltip: {
            tooltip: {
                borderRadius: 4,
            },
        },
        MuiDivider: {
            root: {
                backgroundColor: '#404854',
            },
        },
        MuiListItemText: {
            primary: {
                fontWeight: theme.typography.fontWeightMedium,
            },
        },
        MuiListItemIcon: {
            root: {
                color: 'inherit',
                marginRight: 0,
                '& svg': {
                    fontSize: 20,
                },
            },
        },
        MuiAvatar: {
            root: {
                width: 32,
                height: 32,
            },
        },
    },
};

const drawerWidth = 256;

const styles = makeStyles(createStyles({
    root: {
        display: 'flex',
        minHeight: '100vh',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    app: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        flex: 1,
        padding: theme.spacing(4, 0),
        background: '#eaeff1',
    },
    footer: {
        padding: theme.spacing(2),
        background: '#eaeff1',
    },
}));

function UserInfoComponent(props: RouteComponentProps) {
    const user = useSelector((store: IStore) => store.user);
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = React.useState("");

    React.useEffect(() => {
        if (!user.loggedIn) {
            props.history.push("/login");
        } else {
            if (!user.userInfo) {
                selfUserInfo().then((result) => {
                    if (result.success) {
                        canUpdateUnreadCount.value = true;
                        updateUnreadCount();
                        dispatch(UserInfoSlice.actions.setUserInfo(result.data));
                    } else {
                        canUpdateUnreadCount.value = false;
                        setErrorMessage(result.message);
                    }
                }, reason => {
                    canUpdateUnreadCount.value = true;
                    setErrorMessage(reason.toString());
                })
            }
        }
    }, [user]);
    return user.userInfo ? <Switch>
        {/* 所有人的界面 */}
        <Route exact path="/">
            <Redirect to={LocalUrls.main_page}/>
        </Route>
        <Route path={LocalUrls.main_page} component={Profile}/>
        <Route path={LocalUrls.user_info} component={Profile}/>
        <Route path={LocalUrls.devices} component={DeviceListPage}/>
        {/* 管理员页面 */}
        <Route path={LocalUrls.user_admin} component={UserListPage}/>
        <Route path={LocalUrls.device_admin} component={DeviceListAdminPage}/>
        <Route path={LocalUrls.borrow_handle_admin} component={DeviceBorrowApplicationAdminPage}/>
        <Route path={LocalUrls.become_provider_admin} component={PermissionApplicationAdminPage}/>
        <Route path={LocalUrls.create_device_handle_admin} component={DeviceCreateApplicationAdminPage}/>
        <Route path={LocalUrls.dashboard} component={DashboardPage}/>
        {/* 设备提供者页面 */}
        <Route path={LocalUrls.devices_provider} component={DeviceListProviderPage}/>
        <Route path={LocalUrls.borrow_handle_provider} component={DeviceBorrowApplicationProviderPage}/>
        <Route path={LocalUrls.create_device_provider} component={DeviceCreateApplicationProviderPage}/>
        {/* 用户页面 */}
        <Route path={LocalUrls.borrowed_devices} component={DeviceListSelfPage}/>
        <Route path={LocalUrls.apply_borrow} component={DeviceBorrowApplicationSelfPage}/>
        <Route path={LocalUrls.become_provider} component={PermissionApplicationSelfPage}/>
        {/* 私信页面 */}
        <Route path={LocalUrls.pm} component={PMListPage}/>
        {/* Fallback 页面 */}
        <Redirect to={LocalUrls.main_page}/>
    </Switch> : <Switch>
        <Route exact path={LocalUrls.main_page} component={PendingLogin}/>
        <Route path={LocalUrls.login} component={SignIn}/>
        <Route path={LocalUrls.register} component={SignUp}/>
        {/*<Route render={(props) => } />*/}
        <PendingLogin errorMessage={errorMessage}/>
        {/*<Redirect to={LocalUrls.login}/>*/}
    </Switch>
}

function DrawerWrapper(props: RouteComponentProps & { mobileOpen: boolean, handleDrawerToggle: () => unknown }) {
    const classes = styles(useTheme());
    const user = useSelector((store: IStore) => store.user.userInfo);

    return <nav className={classes.drawer}>
        <Hidden smUp implementation="js">
            <Navigator
                PaperProps={{style: {width: drawerWidth}}}
                variant="temporary"
                open={props.mobileOpen}
                onClose={props.handleDrawerToggle}
                currentPath={props.location.pathname}
                isLoggedIn={user !== null}
                userGroup={user?.group}
            />
        </Hidden>
        <Hidden xsDown implementation="css">
            <Navigator PaperProps={{style: {width: drawerWidth}}}
                       currentPath={props.location.pathname}
                       isLoggedIn={user !== null}
                       userGroup={user?.group}/>
        </Hidden>
    </nav>
}

function App() {
    const classes = styles();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    React.useEffect(() => {
        const interval = setInterval(() => {
            updateUnreadCount();
        }, 5 * 1000);
        return () => {
            clearInterval(interval);
        }
    });

    return (
        <BrowserRouter basename={SubDirectory}>
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <div className={classes.root}>
                        <CssBaseline/>
                        <Route path="/" render={(props) => (
                            <DrawerWrapper {...props}
                                           mobileOpen={mobileOpen}
                                           handleDrawerToggle={handleDrawerToggle}/>
                        )}/>
                        <div className={classes.app}>
                            <Header onDrawerToggle={handleDrawerToggle}/>
                            <main className={classes.main}>
                                <Route path="/" component={UserInfoComponent}/>
                            </main>
                            <footer className={classes.footer}>
                                <Copyright/>
                            </footer>
                        </div>
                    </div>
                </ThemeProvider>
            </Provider>
        </BrowserRouter>
    );
}

export default App;