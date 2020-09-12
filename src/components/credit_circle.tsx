import React from 'react';
import CircularProgress, {CircularProgressProps} from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {colors} from "@material-ui/core";

const useStyles = makeStyles(createStyles({
    goodCredit: {
        color: colors.green[500],
        "&.MuiTypography-root": {
            color: colors.green[700],
        }
    },
    badCredit: {
        color: colors.red[500],
        "&.MuiTypography-root": {
            color: colors.red[700],
        }
    },
    grey: {
        color: colors.grey[400],
    },
}))

export function CreditCircle(props: CircularProgressProps & { value: number }) {
    const classes = useStyles();
    const className = props.value >= 60 ? classes.goodCredit : classes.badCredit;
    return (
        <Box position="relative" display="inline-flex" alignSelf="center">
            <CircularProgress variant="static" size={200} className={classes.grey} style={{
                position: "absolute",
            }} value={100}/>
            <CircularProgress variant="static" size={200} className={className} {...props} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
            >
                <Typography variant="caption" component="div" color="textPrimary"
                            style={{fontSize: 50, lineHeight: "1em"}}
                            className={className}>
                    {`${Math.round(props.value)}`}
                </Typography>
                <Typography variant="caption" component="div" color="textSecondary" className={className}>
                    信用{props.value >= 60 ? "良好" : "较差"}
                </Typography>
            </Box>
        </Box>
    );
}
