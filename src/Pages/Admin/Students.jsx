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
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import { DataGrid } from "@mui/x-data-grid";
// import { useNavigate } from "react-router-dom";

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

const studentListURL = "http://localhost:8000/att/studentList";
// const posturl = "http://localhost:8000/att/eventdb";
// const listurl = "http://localhost:8000/att/eventList";

function MainContent() {
  //json sent from backend API
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [rows, setRows] = useState([]);
  const columns = [
    { field: "id", headerName: "#" },
    { field: "first_name", headerName: "first name", width: 150 },
    { field: "last_name", headerName: "last name", width: 150 },
    { field: "phone_number", headerName: "phone number", width: 150 },
    { field: "email", headerName: "email", width: 300 },
    { field: "rfid_uid", headerName: "UserID", width: 100 },
    { field: "tag_id", headerName: "TagID", width: 200 },
  ];

  useEffect(() => {
    fetch(studentListURL)
      .then((response) => response.json())
      .then((response) => {
        setRows(response);
      });
  });

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
          <Container maxWidth="lg" sx={{ mt: 2, mb: 2, alignItems: "center" }}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  width: 1300,
                  height: 850,
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
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Students() {
  return <MainContent />;
}
