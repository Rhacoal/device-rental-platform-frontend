import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/Help';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import {createStyles, Theme, withStyles, WithStyles} from '@material-ui/core/styles';
import {UserAvatar} from "../components/user_avatar";
import {LocalUrls} from "../constants/local_urls";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {IStore} from "../store/store";
import clsx from "clsx";

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme: Theme) =>
    createStyles({
        secondaryBar: {
            zIndex: 0,
        },
        menuButton: {
            marginLeft: -theme.spacing(1),
        },
        link: {
            textDecoration: 'none',
            color: lightColor,
            '&:hover': {
                color: theme.palette.common.white,
            },
        },
        button: {
            borderColor: lightColor,
        },
        hasNotification: {
            color: "#ff0"
        }
    });

interface HeaderProps extends WithStyles<typeof styles> {
    onDrawerToggle: () => void;
}

function Header(props: HeaderProps) {
    const {classes, onDrawerToggle} = props;
    const pmCount = useSelector((store: IStore) => store.pmCount);
    const [shakePosition, setShakePosition] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setShakePosition(shakePosition + 1);
        }, 32);
        return () => clearInterval(interval);
    })

    return (
        <React.Fragment>
            <AppBar color="primary" position="sticky" elevation={0}>
                <Toolbar>
                    <Grid container spacing={1} alignItems="center">
                        <Hidden smUp>
                            <Grid item>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={onDrawerToggle}
                                    className={classes.menuButton}
                                >
                                    <MenuIcon/>
                                </IconButton>
                            </Grid>
                        </Hidden>
                        <Grid item xs/>
                        <Grid item className={clsx(pmCount > 0 && classes.hasNotification)}>
                            <Tooltip title={pmCount > 0 ? `${pmCount} 条未读消息` : "无未读消息"}>
                                <IconButton color="inherit" component={Link}
                                            to={LocalUrls.pm}>
                                    {
                                        pmCount > 0 ? <NotificationsActiveIcon style={{
                                            position: "relative",
                                            left: pmCount > 0 ? (((shakePosition % 2) - 0.5) * Math.sin(shakePosition / 8) * 4) : 0,
                                        }}/> : <NotificationsIcon/>
                                    }
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <UserAvatar/>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

export default withStyles(styles)(Header);
