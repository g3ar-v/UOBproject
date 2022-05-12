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
import Timer from "../../components/Timer";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";

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
});
const listurl = "http://localhost:8000/att/InProgressList";

function InProgress() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [rows, setRows] = useState([]);
  const columns = [
    { field: "id", headerName: "id" },
    { field: "firstname", headerName: "firstname", width: 100 },
    { field: "lastname", headerName: "lastname", width: 100 },
  ];

  useEffect(() => {
    fetch(listurl)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setRows(response);
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
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={7} md={12} lg={12} sx={{ ml: 5, mr: 5 }}>
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
                  <Timer />
                </Paper>
              </Grid>
              <Grid item xs={7} md={12} lg={12} sx={{ ml: 5, mr: 5 }}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 500,
                    width: 400,
                    backgroundColor: "inherit",
                  }}
                  elevation={10}
                >
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    sx={{ color: "#cfcfc4" }}
                  ></DataGrid>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default InProgress;
