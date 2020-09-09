import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import {IStore} from "../store/store";
import {Link} from "react-router-dom";
import {LocalUrls} from "../constants/local_urls";
import {blueGrey} from "@material-ui/core/colors";

const useStyles = makeStyles(theme => createStyles({
    iconButtonAvatar: {
        padding: 4,
        textDecoration: "none",
        backgroundColor: blueGrey[500],
        color: theme.palette.getContrastText(blueGrey[500]),
    },
}))

export function UserAvatar() {
    const classes = useStyles();
    const userInfo = useSelector((store: IStore) => store.user.userInfo);
    return <IconButton>
        <Avatar alt="My Avatar" component={Link} to={LocalUrls.main_page} className={classes.iconButtonAvatar}>
            {userInfo ? (userInfo.name.substring(0, 1) || "") : ""}
        </Avatar>
    </IconButton>
}