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
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import EventView from "../../components/EventViewM";
import Title from "../../components/Title";
import { AppBar } from "../../components/AppBar";
import { Drawer } from "../../components/Drawer";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

const mdTheme = createTheme({
  palette: {
    primary: {
      main: "#53565A",
    },
    secondary: {
      main: "#CFCFC4",
    },
  },
});

const eventurl = "http://localhost:8000/att/eventdb";
const posturl = "http://localhost:8000/att/eventdb";
const listurl = "http://localhost:8000/att/eventList";

function MainContent() {
  //json sent from backend API
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [value, setValue] = useState(new Date());
  const [event, setEvent] = useState({});
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "id", headerName: "#" },
    { field: "moduleName", headerName: "ModuleName", width: 250 },
    { field: "RoomName", headerName: "RoomName", width: 200 },
    { field: "theDate", headerName: "theDate", width: 150 },
    { field: "starttimeID", headerName: "starttime", width: 150 },
    { field: "endtimeID", headerName: "endtime", width: 150 },
  ];

  //format list
  const getList = async () => {
    fetch(listurl)
      .then((response) => response.json())
      .then((response) => {
        console.log(response.length);
        for (let index = 0; index < response.length; index++) {
          response[index].theDate = moment(response[index].theDate).format(
            "D MMMM, YYYY"
          );
          response[index].starttimeID = moment
            .utc(response[index].starttimeID)
            .format("HH:mm");
          response[index].endtimeID = moment
            .utc(response[index].endtimeID)
            .format("HH:mm");
        }
        console.log(response);
        setRows(response);
      });
  };

  useEffect(() => {
    const d = new Date(value);
    const dateValue = { date: moment(d).format("YYYY-MM-DD") };
    axios.post(posturl, dateValue);
    axios
      .get(eventurl)
      .then((response) => {
        console.log(response);
        setEvent(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [value]);

  useEffect(() => {
    getList();
  }, []);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex", background: "#53565A" }}>
        <CssBaseline />
        {/* Appbar */}
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
            <Grid container spacing={3}>
              {/* EventView */}
              <Grid item xs={12} md={8} lg={8}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 300,
                    backgroundColor: "inherit",
                  }}
                  elevation={10}
                >
                  <EventView eventValues={event} />
                </Paper>
              </Grid>
              {/* Calendar */}
              <Grid item xs={12} md={4} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 300,
                    backgroundColor: "inherit",
                  }}
                  elevation={10}
                >
                  <Calendar
                    onChange={setValue}
                    value={value}
                    // inputRef={buttonRef}
                  />
                </Paper>
              </Grid>
              {/* eventList */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 500,
                    backgroundColor: "inherit",
                  }}
                  elevation={10}
                >
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    // columnDefs={columnDefs}
                    sx={{
                      color: "#cfcfc4",
                    }}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Main() {
  return <MainContent />;
}
