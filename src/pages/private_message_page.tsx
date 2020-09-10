import React from "react";
import {createStyles, makeStyles, useTheme} from "@material-ui/core/styles";
import {
    IPrivateMessageReceived,
    IPrivateMessageSendReceiveList,
    IPrivateMessageSent,
    IUserInfo, PMNormal
} from "../wrapper/types";
import {useSelector} from "react-redux";
import {IStore} from "../store/store";
import {pmSend, pmSendReceiveList} from "../wrapper/requests";
import {
    Avatar,
    Button,
    ButtonGroup,
    Container,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {RouteComponentProps} from "react-router-dom";
import clsx from "clsx";

const textFieldHeight = 150;
const buttonAreaHeight = 32;
const headerHeight = 48;

const useStyles = makeStyles(theme => createStyles({
    paper: {
        // maxWidth: 960,
        margin: 'auto',
        overflow: 'hidden',
    },
    chatHeaderArea: {
        height: headerHeight,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        display: "flex",
        alignItems: "center",
        paddingLeft: theme.spacing(2),
        borderWidth: "0 0 1px 0",
        borderColor: theme.palette.divider,
        borderStyle: "solid"
    },
    chatHistoryArea: {
        boxSizing: "border-box",
        height: `calc(100% - ${textFieldHeight + headerHeight}px)`,
        overflowY: "auto",
        borderWidth: "0 0 1px 0",
        borderColor: theme.palette.divider,
        borderStyle: "solid"
    },
    chatBoxArea: {
        boxSizing: "border-box",
        height: textFieldHeight,
        position: "relative",
        display: "flex",
        alignItems: "stretch",
        "& .MuiTextField-root": {
            height: `calc(100%)`,
        },
        "& .MuiButtonGroup-root": {

        }
    },
    chatBox: {
        boxSizing: "border-box",
        position: "relative",
        height: "calc(100vh - 200px)",
    },
    selected: {
        backgroundColor: "#eee",
    }
}))

type MessageSelector =
    { side: "send", message: IPrivateMessageSent }
    | { side: "receive", message: IPrivateMessageReceived };

type PMSession = {
    messages: Array<MessageSelector>,
} & ({ fromServer: true } | { fromServer: false, userInfo: IUserInfo });

function newUserSession(userInfo: IUserInfo): PMSession {
    return {
        messages: [],
        fromServer: false,
        userInfo
    }
}

interface SortStruct {
    0: number,
    1: number,
    2: PMSession,
}

function createSessionList(messages: IPrivateMessageSendReceiveList): PMSession[] {
    const systemSession: PMSession = {
        messages: [],
        fromServer: true,
    }
    // [最大的未读 ID, 最大的 ID, PMSession]
    const userSessionMap = new Map<number, SortStruct>();
    for (let send of messages.send) {
        let arr = userSessionMap.get(send.receiver.user_id) || [0, 0, newUserSession(send.receiver)];
        if (!send.read) {
            arr[0] = Math.max(arr[0], send.pm_id);
        }
        arr[1] = Math.max(arr[1], send.pm_id);
        arr[2].messages.push({side: "send", message: send});
        userSessionMap.set(send.receiver.user_id, arr);
    }
    for (let receive of messages.receive) {
        if (receive.from_system) {
            systemSession.messages.push({side: "receive", message: receive});
        } else {
            let arr = userSessionMap.get(receive.sender.user_id) || [0, 0, newUserSession(receive.sender)];
            if (!receive.read) {
                arr[0] = Math.max(arr[0], receive.pm_id);
            }
            arr[1] = Math.max(arr[1], receive.pm_id);
            arr[2].messages.push({side: "receive", message: receive});
            userSessionMap.set(receive.sender.user_id, arr);
        }
    }
    const list = new Array<SortStruct>();
    userSessionMap.forEach((value) => {
        list.push(value);
    })
    list.push([1e52, 1e52, systemSession])
    list.sort((a: SortStruct, b: SortStruct) => {
        if (a[0] > b[0]) {
            return -1;
        }
        return b[1] - a[1];
    })
    return list.map((element) => element[2]);
}

const useChatLineStyles = makeStyles(theme => createStyles({
    send: {
        paddingLeft: theme.spacing(2),
        display: "flex",
        flexDirecton: "row-reverse",
        alignItems: "top",
        "& .MuiAvatar-root": {
            margin: theme.spacing(1, 1),
        },
    },
    receive: {
        paddingRight: theme.spacing(2),
        display: "flex",
        flexDirecton: "row",
        alignItems: "top",
        "& .MuiAvatar-root": {
            margin: theme.spacing(1, 1),
        },
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.spacing(1),
        lineBreak: "anywhere",
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    }
}));

function ChatLine(props: {
    message: MessageSelector
}) {
    const classes = useChatLineStyles(useTheme());
    if (props.message.side === "receive") {
        return <ListItem className={classes.receive}>
            <Avatar>{props.message.message.from_system ? " " : props.message.message.sender.name.substring(0, 1)}</Avatar>
            <Paper className={classes.paper}>
                {props.message.message.message}
            </Paper>
        </ListItem>
    } else {
        return <ListItem className={classes.send}>
            <Avatar>{props.message.message.receiver.name.substring(0, 1)}</Avatar>
            <Paper className={classes.paper}>
                {props.message.message.message}
            </Paper>
        </ListItem>
    }
}

export function PMListPage(props: RouteComponentProps) {
    const classes = useStyles(useTheme());
    const [sessionList, setSessionList] = React.useState([] as PMSession[])
    const [errorMessage, setErrorMessage] = React.useState(null as (string | null));
    const [page, setPage] = React.useState(0);
    const [refresh, setRefresh] = React.useState(false);
    const userInfo = useSelector((store: IStore) => store.user.userInfo);
    const [currentSession, setCurrentSession] = React.useState(null as (PMSession | null));
    const [chatMessage, setChatMessage] = React.useState("");

    const canReply = currentSession === null || currentSession.fromServer;

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    React.useEffect(() => {
        if (!userInfo) return;
        setErrorMessage(null);
        pmSendReceiveList().then((result) => {
            if (result.success) {
                setErrorMessage(null);
                const newSessionList = createSessionList(result.data);
                setSessionList(newSessionList);
                setCurrentSession(newSessionList[0] || null);
            } else {
                setErrorMessage(result.message);
            }
        }, reason => {
            setErrorMessage(reason.toString());
        })
    }, [refresh, userInfo]);

    const triggerRefresh = () => {
        setRefresh(!refresh);
    }

    const sendMessage = (receiverId: number) => {
        pmSend(receiverId, chatMessage, PMNormal).then(() => {
            triggerRefresh();
        })
    }

    return <Container>

        <Grid container className={classes.chatBox} spacing={1}>
            <Grid xs={4} item>
                <Paper className={clsx(classes.chatBox, classes.paper)}>
                    <List>
                        {
                            sessionList.map((session, index) =>
                                <ListItem button onClick={() => {
                                    setCurrentSession(session);
                                    setChatMessage("");
                                }} key={index} className={clsx(currentSession === session && classes.selected)}>
                                    <ListItemText primary={session.fromServer ? "系统消息" : session.userInfo.name}
                                                  secondary={<Typography variant="body2" color="textSecondary" style={{
                                                      overflow: "hidden",
                                                      textOverflow: "ellipsis",
                                                      whiteSpace: "nowrap",
                                                      fontSize: "0.875em",
                                                  }}>{session.messages.length > 0 ? session.messages[0].message.message : "暂无消息"}</Typography>}/>
                                </ListItem>
                            )
                        }
                    </List>
                </Paper>
            </Grid>
            <Grid xs={8} item>
                <Paper className={clsx(classes.chatBox, classes.paper)}>
                    <Typography className={classes.chatHeaderArea} variant="h6" component="div">
                        {currentSession ? (currentSession.fromServer ? "系统消息" : currentSession.userInfo.name) : ""}
                    </Typography>
                    <List className={classes.chatHistoryArea}>
                        {
                            currentSession ? currentSession.messages.map((message, index) =>
                                    <ChatLine message={message} key={index}/>) :
                                <div style={{textAlign: "center"}}>请选择一个会话</div>
                        }
                    </List>
                    <div className={classes.chatBoxArea}>
                        <TextField fullWidth
                                   multiline
                                   value={chatMessage}
                                   disabled={canReply}
                                   placeholder={"回复"}
                                   inputProps={{
                                       style: {
                                           height: textFieldHeight,
                                           padding: '0 14px',
                                       },
                                   }}
                                   onChange={(event) => {
                                       setChatMessage(event.target.value);
                                   }}
                        />
                        <ButtonGroup>
                            <Button disabled={canReply} variant={canReply ? "outlined" : "contained"}>
                                发送
                            </Button>
                        </ButtonGroup>
                    </div>
                </Paper>
            </Grid>
        </Grid>
    </Container>
}
