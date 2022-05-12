import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Divider from "@mui/material/Divider";
import { mainListItems } from "../../components/listitems";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import ToolBar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import Title from "../../components/Title";
import { AppBar } from "../../components/AppBar";
import { Drawer } from "../../components/Drawer";
import EventView from "../../components/EventViewAtt";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const mdTheme = createTheme({
  palette: {
    primary: {
      main: "#53565A",
    },
    secondary: {
      main: "#CFCFC4",
    },
  },
  typography: {
    fontFamily: [
      "Anton",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },

  overrides: {
    MuiOutlinedInput: {
      root: {
        position: "relative",
        "& $notchedOutline": {
          borderColor: "#cfcfc4",
        },
      },
    },
    MuiFormLabel: {
      root: {
        "&$focused": {
          color: "#CFCFC4",
        },
      },
    },
  },
});

//for starting attendance
const eventurl = "http://localhost:8000/att/eventdb";
const trackurl = "http://localhost:8000/att/attendance";
let AttendanceChoice = { method: "", trackChoice: "" };
let localrfid = false;
let localfingerprint = false;
let localentry = false;
let localboth = false;

function Attendance() {
  const [open, setOpen] = React.useState(false);
  const [event, setEvent] = useState({});
  const [fingerprint, setFingerprint] = useState(false);
  const [rfid, setRFID] = useState(false);
  const [entry, setEntry] = useState(false);
  const [both, setBoth] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const getEvent = async () => {
    axios
      .get(eventurl)
      .then((response) => {
        console.log(response);
        setEvent(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function setMethod(method) {
    AttendanceChoice.method = method;
    console.log(AttendanceChoice);
  }

  function settrackChoice(trackChoice) {
    AttendanceChoice.trackChoice = trackChoice;
    console.log(AttendanceChoice);
  }
  let navigate = useNavigate();
  const InProgressPage = () => {
    const path = "/InProgress";
    navigate(path);
  };

  const ManualAttPage = () => {
    const path = "/manualAttendance";
    navigate(path);
  };

  const trackAttendance = () => {
    // e.preventDefault();
    if (
      (Object.keys(AttendanceChoice).length !== 0 &&
        JSON.stringify(event.data) !== "[]") ||
      event.data !== undefined ||
      JSON.stringify(event.data) !== "{}"
    ) {
      InProgressPage();
      startTrack();
    } else {
      console.log("pick method and choice");
    }
  };
  const startTrack = () => {
    axios
      .post(trackurl, AttendanceChoice)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // useEffect(() => {
  //   trackAttendance();
  // });

  useEffect(() => {
    getEvent();
  }, []);

  function handleRFID() {
    if (localfingerprint === true && localrfid) {
      setFingerprint(!fingerprint);
    }
  }

  function handleFingerprint() {
    if (localrfid === true && localfingerprint) {
      setRFID(!rfid);
    }
  }

  function handleEntry() {
    if (localentry === true && localboth) {
      setBoth(!both);
    }
  }
  function handleBoth() {
    if (localentry === true && localboth) {
      setEntry(!entry);
    }
  }

  useEffect(() => {}, [fingerprint, rfid]);
  // two functions post to backend, start timer send paper to end bring timer up
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex", background: "#53565A" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", //keep right padding when drawer is closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Link
              to="/"
              style={{ fontStyle: "Roboto", textDecoration: "none" }}
            >
              <Title children="trackAtt." />
            </Link>
          </Toolbar>
        </AppBar>
        {/* Drawer */}
        <Drawer
          variant="permanent"
          open={open}
          sx={{ backgroundColor: "inherit" }}
        >
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>{mainListItems}</List>
          <Container
            sx={{
              position: "absolute",
              width: "100%",
              left: "-10px",
              bottom: 15,
            }}
          >
            <Avatar />
          </Container>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: "inherit",
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <ToolBar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={7} md={12} lg={12} sx={{ ml: 5, mr: 5 }}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 400,
                    backgroundColor: "inherit",
                  }}
                  elevation={10}
                >
                  <Grid container spacing={10}>
                    <Grid item xs>
                      <EventView eventValues={event} />
                    </Grid>

                    <Grid item xs>
                      <Typography
                        fontFamily="Roboto"
                        align="justify"
                        variant="h6"
                        color="secondary"
                      >
                        Attendance methods:
                      </Typography>
                      <Stack spacing={2}>
                        <Button
                          variant={"contained"}
                          size="large"
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            color: "secondary",
                            width: 150,
                          }}
                          color={rfid ? "secondary" : "primary"}
                          onClick={() => {
                            setMethod("rfid");
                            setRFID(!rfid);
                            localrfid = !rfid;
                            handleRFID();
                          }}
                        >
                          RFID
                        </Button>
                        <Button
                          variant={"contained"}
                          size="large"
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: 150,
                          }}
                          color={fingerprint ? "secondary" : "primary"}
                          onClick={() => {
                            setMethod("fingerprint");
                            setFingerprint(!fingerprint);
                            localfingerprint = !fingerprint;
                            handleFingerprint();
                          }}
                        >
                          FINGERPRINT
                        </Button>
                      </Stack>
                      <Typography
                        fontFamily="Helvetica Neue"
                        align="justify"
                        variant="h6"
                        color="secondary"
                      >
                        Attendance options:
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Button
                          onClick={() => {
                            settrackChoice("markEntry");
                            setEntry(!entry);
                            localentry = !entry;
                            handleEntry();
                          }}
                          variant="contained"
                          sx={{
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                          }}
                          color={entry ? "secondary" : "primary"}
                        >
                          mark on entry
                        </Button>
                        <Button
                          onClick={() => {
                            settrackChoice("mark Both");
                            setBoth(!both);
                            localboth = !both;
                            handleBoth();
                          }}
                          variant="contained"
                          sx={{
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                          }}
                          color={both ? "secondary" : "primary"}
                        >
                          mark on entry & exit
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Button
                    onClick={trackAttendance}
                    variant="contained"
                    sx={{
                      position: "relative",
                      alignItems: "center",
                      width: 150,
                      left: "20px",
                      bottom: "-10%",
                      flexDirection: "column",
                    }}
                    color={"success"}
                  >
                    start track
                  </Button>
                  <Button
                    variant={"contained"}
                    size="large"
                    sx={{
                      position: "absolute",
                      alignItems: "right",
                      width: 150,
                      right: "20%",
                      bottom: "59%",
                    }}
                    onClick={() => {
                      ManualAttPage();
                    }}
                  >
                    MANUAL
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Attendance;
