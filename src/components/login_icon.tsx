import React from "react";
import Avatar from "@material-ui/core/Avatar";
import {createStyles, makeStyles, useTheme} from "@material-ui/core/styles";
import {colors} from "@material-ui/core";

const useStyles = makeStyles(theme => createStyles({
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: colors.blue[100],
        width: 64,
        height: 64,
    },
}));

export function LoginIcon() {
    const classes = useStyles(useTheme());
    return <Avatar className={classes.avatar}>
        <img src="mira256.png" alt={"ミラ"} width="64" height="64"/>
    </Avatar>
}