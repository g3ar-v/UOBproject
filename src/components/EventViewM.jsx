import Typography from "@mui/material/Typography";
import moment from "moment";
import validator from "validator";
import { Button } from "@mui/material";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

function EventView(props) {
  let navigate = useNavigate();
  const routeChange = () => {
    const path = "/Attendance";
    navigate(path);
  };
  if (
    JSON.stringify(props.eventValues.data) === "[]" ||
    props.eventValues === undefined ||
    JSON.stringify(props.eventValues) === "{}"
  ) {
    return (
      <>
        <Typography
          sx={{ fontFamily: "Roboto" }}
          align="justify"
          variant="h4"
          color="secondary"
        >
          No event!
        </Typography>
      </>
    );
  } else {
    const values = props.eventValues.data[0];
    return (
      <>
        <Grid item xs>
          <Typography
            fontFamily="Helvetica Neue"
            align="justify"
            variant="h5"
            color="secondary"
          >
            module: {validator.trim(values.moduleName)}
          </Typography>
          <Typography align="justify" variant="h5" color="secondary">
            location: {values.RoomName} building
          </Typography>
          <Typography variant="h5" color="secondary">
            date: {moment(values.theDate).format("D MMMM, YYYY")}
          </Typography>
          <Typography variant="h5" color="secondary">
            Starttime:
            {moment.utc(values.starttimeID).format("h:mma")}
          </Typography>
          <Typography variant="h5" color="secondary">
            Endtime: {moment.utc(values.endtimeID).format("h:mma")}
          </Typography>
        </Grid>
        <Button
          variant="contained"
          size="large"
          sx={{ display: "flex", flexDirection: "column" }}
          onClick={routeChange}
        >
          set options
        </Button>
      </>
    );
  }
}

export default EventView;
