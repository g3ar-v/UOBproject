import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { Link } from "react-router-dom";

export const mainListItems = (
  <div>
    <ListItem component={Link} to={"/"} button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem component={Link} to={"/attendance"} button>
      <ListItemIcon>
        <SchoolIcon />
      </ListItemIcon>
      <ListItemText primary="Attendance" />
    </ListItem>
    <ListItem component={Link} to={"/analytics"} button>
      <ListItemIcon>
        <AnalyticsIcon />
      </ListItemIcon>
      <ListItemText primary="Analytics" />
    </ListItem>
    <ListItem component={Link} to={"/students"} button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Students" />
    </ListItem>
  </div>
);
