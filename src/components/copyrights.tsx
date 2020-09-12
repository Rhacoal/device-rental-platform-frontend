import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import React from "react";
import {GitHub} from "@material-ui/icons";

export function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © DRP 404 Not Found '}
            {new Date().getFullYear()}
            {'.   '}
            <GitHub fontSize="small"/>
            <Link color="inherit" href="https://github.com/leonardodalinky/device-rental-platform-backend">
                Github
            </Link>
        </Typography>
    );
}