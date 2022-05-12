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
import Title from "../../components/Title";
import { AppBar } from "../../components/AppBar";
import { Drawer } from "../../components/Drawer";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
// import axios from "axios";
// import Calendar from "react-calendar";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { VictoryPie, VictoryTheme, VictoryLabel } from "victory";

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
      "-apple-system",
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
});
const calcURL = "http://localhost:8000/att/AttCalc";
const attendanceListUrl = "http://localhost:8000/att/attendanceList";

// const startDate = () => {
//   axios.get(getStartDateUrl).then((response) => {
//     return response;
//   });
// };
function Analytics() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  //set value to the value chosen at main.jsx
  // const [value, setValue] = useState(new Date());

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const columns = [
    { field: "id", headerName: "id" },
    { field: "firstname", headerName: "firstname", width: 100 },
    { field: "lastname", headerName: "lastname", width: 100 },
    { field: "status", headerName: "status" },
  ];
  console.log(data);

  useEffect(() => {
    // const d = new Date(value);
    // const dateValue = { date: moment(d).format("YYYY-MM-DD") };
    // axios
    //   .post(postDateUrl, dateValue)
    //   .then((response) => console.log(response));
    fetch(attendanceListUrl)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setRows(response);
      });

    fetch(calcURL)
      .then((response) => response.json())
      .then((response) => {
        JSON.stringify(response);
        const value = [
          { x: "absent", y: response[0].absent },
          { x: "present", y: response[0].present },
        ];
        setData(value);
      });
  }, []);

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
          <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
            <Grid container spacing={1}>
              {/* AttendanceList */}
              <Grid item xs={6}>
                <Paper
                  sx={{
                    p: 2,
                    height: 800,
                    backgroundColor: "inherit",
                  }}
                  elevation={10}
                >
                  <DataGrid
                    sx={{ color: "#cfcfc4", backgroundColor: "secondary" }}
                    rows={rows}
                    columns={columns}
                  />
                </Paper>
              </Grid>
              {/* CalendarView */}
              {/* <Grid item xs={4} md={4.5} lg={4.5}>
                <Paper
                  sx={{
                    p: 3,
                    height: 300,
                    backgroundColor: "inherit",
                  }}
                  elevation={10}
                >
                  <Calendar onChange={setValue} value={value} />
                </Paper>
              </Grid> */}
              {/* Graph */}
              <Grid item xs>
                <Paper
                  sx={{
                    p: 2,
                    height: 300,
                    backgroundColor: "inherit",
                  }}
                  elevation={10}
                >
                  {" "}
                  <VictoryLabel
                    textAnchor="top"
                    style={{ fontSize: 20, fill: "#cfcfc4" }}
                    x={200}
                    y={200}
                    text="Attendance"
                  />
                  <VictoryPie
                    data={data}
                    style={{
                      labels: { fontSize: 20, fill: "#cfcfc4" },
                    }}
                    labelRadius={50}
                    theme={VictoryTheme.grayscale}
                    // colorScale={["red", "green", "warm"]}
                    name="Attendance"
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

export default Analytics;
