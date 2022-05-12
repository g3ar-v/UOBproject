import React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Timer.css";

const stopTrackURL = "http://localhost:8000/att/attendanceStop";

const Timer = (props) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [isActive, setIsActive] = useState(false);
  let navigate = useNavigate();

  const routeChange = () => {
    const path = "/analytics";
    navigate(path);
  };

  function stopTrack() {
    setSeconds(0);
    setIsActive(false);
    axios
      .post(stopTrackURL)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getTime() {
    const time =
      hours.toString() + " " + minutes.toString() + " " + seconds.toString();
    return time;
  }

  function start() {
    setIsActive(true);
  }

  useEffect(() => {
    start();
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 59) {
          setSeconds(0);
          setMinutes((minutes) => minutes + 1);
        } else if (minutes === 59) {
          setMinutes(0);
          setHours((hours) => hours + 1);
        } else {
          setSeconds((seconds) => seconds + 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes]);

  return (
    <div className="app">
      <div className="time">
        {hours}H {minutes}m {seconds}s
      </div>
      <div className="row">
        <Button
          onClick={() => {
            routeChange();
            stopTrack();
            console.log(getTime());
          }}
          variant="contained"
          sx={{ textAlign: "center" }}
        >
          stop track
        </Button>
      </div>
    </div>
  );
};

export default Timer;
