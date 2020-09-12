import React, {PropsWithChildren} from "react";
import {
    Button,
    ButtonGroup,
    Collapse,
    Container,
    createStyles,
    Paper,
    Snackbar,
    TextField,
    useTheme
} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";
import {Edit} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles(theme => createStyles({
    container: {
        marginBottom: theme.spacing(2),
        "& .MuiButtonGroup-root": {
            alignSelf: "flex-end",
        },
        "& .title": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        }
    },
}))

export function PageTitle(props: PropsWithChildren<any>) {
    const classes = useStyles(useTheme());
    return <Container maxWidth="lg" className={classes.container}>
        <div className="title">
            {props.children}
        </div>
    </Container>
}