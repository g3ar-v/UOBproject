const { Connection, Request } = require("tedious");
const { auth, attemptSilentLogin } = require("express-openid-connect");
const axios = require("axios");
const moment = require("moment");
const consola = require("consola");

//Database connection
//Azure Database Connection handler
const config = {
  authentication: {
    options: {
      userName: process.env.DB_USER,
      password: process.env.DB_PASS,
    },
    type: "default",
  },
  server: process.env.DB_HOST,
  options: {
    database: process.env.DB_NAME,
    encrypt: true,
  },
};

const executeSQL = (query) =>
  new Promise((resolve, reject) => {
    let result = [];

    const connection = new Connection(config);

    connection.on("connect", (err) => {
      if (err) {
        reject(err);
        connection.close();
      } else {
        connection.execSql(request);
      }
    });

    const request = new Request(query, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });

    request.on("row", (columns) => {
      let rowObject = {};
      columns.forEach((column) => {
        rowObject[column.metadata.colName] = column.value;
      });
      result.push(rowObject);
    });

    request.on("done", (rowCount) => {
      connection.close();
    });
    connection.connect();
  });

//see attendance for a class
global.classID = "";
global.dateID = "";
global.moduleName = "";
global.moduleID = "";
global.attendanceClass = "6";
global.method = "";

//handles post request from react
exports.receiveDate = (req, res) => {
  setDate(req.body.date);
};

//handles get request from react
exports.sendEvent = (req, res) => {
  executeSQL(
    "SELECT TRIM((SELECT moduleName\
      FROM modules WHERE moduleID = \
      (SELECT moduleID FROM [dbo].[ClassSchedule] WHERE theDate = '" +
      dateID +
      "'))) as moduleName,\
         (SELECT RoomName FROM lectureRooms WHERE RoomID = \
           (SELECT RoomID FROM ClassSchedule WHERE theDate = '" +
      dateID +
      "')) as RoomName, \
           theDate, starttimeID, endtimeID FROM ClassSchedule WHERE theDate = '" +
      dateID +
      "'"
  )
    .then((ok) => {
      if (ok.length == 0) {
        res.send(ok);
      } else {
        res.send(ok);
        moduleName = ok[0].moduleName;
        executeSQL(
          "SELECT  moduleID, RoomID,\
               theDate, starttimeID, endtimeID FROM ClassSchedule WHERE theDate = '" +
            dateID +
            "'"
        )
          .then((result) => {
            getClassID(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

//get students ClassID
function getClassID(result) {
  executeSQL(
    "SELECT classID FROM ClassSchedule WHERE theDate='" +
      moment.utc(result[0].theDate).format("YYYY-MM-DD ") +
      "' and starttimeID ='" +
      moment.utc(result[0].starttimeID).format("HH:mm:ss") +
      "' and endtimeID ='" +
      moment.utc(result[0].endtimeID).format("HH:mm:ss") +
      "' and moduleID ='" +
      result[0].moduleID +
      "' and RoomID ='" +
      result[0].RoomID +
      "'"
  )
    .then((res) => {
      classID = res[0].classID;
    })
    .catch((err) => {
      consola.error(err);
    });
}

//event List
exports.sendEventList = (req, res) => {
  executeSQL(
    "SELECT ROW_NUMBER() OVER (ORDER BY (SELECT 100)) AS id,(SELECT moduleName FROM modules WHERE modules.moduleID = ClassSchedule.moduleID) as moduleName, (SELECT roomName FROM lectureRooms WHERE lectureRooms.RoomID = ClassSchedule.RoomID) as RoomName, theDate, starttimeID, endtimeID\
  FROM ClassSchedule ORDER BY theDate "
  )
    .then((ok) => res.send(ok))
    .catch(function (error) {
      res.send(error);
    });
};

function setDate(datereceived) {
  global.dateID = datereceived;
}

//get students taking module
function getStudentsForModule(moduleName) {
  return new Promise((resolve, reject) => {
    executeSQL(
      "SELECT moduleID FROM modules WHERE moduleName='" + moduleName + "'"
    )
      .then((ok) => {
        global.moduleID = ok[0].moduleID;
        resolve(global.moduleID);
        consola.info("in getStudents: " + moduleID);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
exports.getdate = (req, res) => {
  consola.info(dateID);
  res.send(dateID);
};

//start attendance tracker fror raspberry pi
//responds by sending request to flask server
exports.startTrack = (req, res) => {
  getStudentsForModule(moduleName).then((result) => {
    consola.info(classID);
    attendanceClass = classID;

    if (req.body.method === "rfid") {
      method = req.body.method;
      const startTrack = {
        trackChoice: req.body.trackChoice,
        classID: classID,
        moduleID: result,
      };
      //If method is fingerprint post to fingerprint
      //If method is RFID post to fingerprint
      consola.info("start track" + JSON.stringify(startTrack));
      axios
        .post(
          "https://myweb-vfranktor.pitunnel.com/RFIDread",
          JSON.stringify(startTrack)
        )
        .then((response) => {
          consola.success("RFID started");
        });
    }
    if (req.body.method === "fingerprint") {
      method = req.body.method;
      const startTrack = {
        trackChoice: req.body.trackChoice,
        classID: classID,
        moduleID: result,
      };
      consola.info("start track" + JSON.stringify(startTrack));
      axios
        .post(
          "https://myweb-vfranktor.pitunnel.com/fingerprintread",
          JSON.stringify(startTrack)
        )
        .then((response) => {
          consola.success("fingerprint started");
        });
    }
  });
};

exports.stopTrack = (req, res) => {
  if (method == "rfid") {
    axios
      .post("https://myweb-vfranktor.pitunnel.com/RFIDstop")
      .then((response) => {
        consola.success("rfid stopped");
      })
      .catch((err) => consola.error(err));
  }

  if (method == "fingerprint") {
    axios
      .post("https://myweb-vfranktor.pitunnel.com/fingerprintstop")
      .then((response) => {
        consola.success("fingerprint stopped");
      })
      .catch((err) => consola.error(err));
  }
};

exports.setAttendanceList = (req, res) => {
  consola.info(req.body.date);
  req.body.date;
};

//TODO should be started based on the classID that just finished
exports.showAttendanceList = (req, res) => {
  consola.info(attendanceClass);
  executeSQL(
    "SELECT ROW_NUMBER() OVER (ORDER BY (SELECT 100)) AS id, trim((select first_name from students where students.studentID = module_enrollment.studentID)) as firstname, \
    trim((select last_name from students where students.studentID = module_enrollment.studentID)) as lastname, \
    CASE WHEN module_enrollment.studentID in (select studentID from attendance where classID ='" +
      attendanceClass +
      "') then 'present'\
    else \
    'absent'\
    end 'status'    \
    from module_enrollment\
    WHERE moduleID = (select moduleID from ClassSchedule where classID ='" +
      attendanceClass +
      "')"
  )
    .then((ok) => {
      res.send(ok);
    })
    .catch((error) => {
      res.send(error);
    });
};

exports.showAttendanceListWithoutStatus = (req, res) => {
  consola.info("ClassID in sALWS:" + classID);
  executeSQL(
    "SELECT ROW_NUMBER() OVER (ORDER BY (SELECT 100)) AS id, trim((select first_name from students where students.studentID = module_enrollment.studentID)) as firstname, \
    trim((select last_name from students where students.studentID = module_enrollment.studentID)) as lastname \
    from module_enrollment\
    WHERE moduleID = (select moduleID from ClassSchedule where classID ='" +
      classID +
      "')"
  )
    .then((ok) => {
      res.send(ok);
    })
    .catch((error) => {
      res.send(error);
    });
};

exports.showStudentList = (req, res) => {
  executeSQL(
    "SELECT studentID AS id,TRIM(first_name) AS first_name,TRIM(last_name) AS last_name,phone_number,email,rfid_uid,tag_id FROM students"
  )
    .then((ok) => {
      res.send(ok);
    })
    .catch((error) => {
      res.send(error);
    });
};

exports.showManualAttlist = (req, res) => {
  executeSQL(
    "SELECT (SELECT studentID FROM students WHERE students.studentID = module_enrollment.studentID) AS id, trim((select first_name from students where students.studentID = module_enrollment.studentID)) as firstname, \
    trim((select last_name from students where students.studentID = module_enrollment.studentID)) as lastname \
    from module_enrollment\
    WHERE moduleID = (select moduleID from ClassSchedule where classID ='" +
      classID +
      "')"
  )
    .then((ok) => {
      res.send(ok);
    })
    .catch((error) => {
      res.send(error);
    });
};

exports.addToAttManually = (req, res) => {
  console.log(req.body.studentID);
  studentID = req.body.studentID;
  attendanceClass = classID;

  studentID.forEach((item) => {
    executeSQL(
      "INSERT INTO Attendance (studentID, classID) VALUES(" +
        item +
        "," +
        classID +
        ")"
    )
      .then((ok) => {})
      .catch((error) => {
        res.send(error);
      });
  });
};

exports.calculateAttendance = (req, res) => {
  consola.info(attendanceClass);
  executeSQL(
    "WITH src AS(SELECT CASE WHEN module_enrollment.studentID in (SELECT studentID FROM attendance WHERE classID='" +
      attendanceClass +
      "') THEN 'present' ELSE'absent' END AS 'Status' FROM module_enrollment WHERE moduleID=(SELECT moduleID FROM ClassSchedule WHERE classID='" +
      attendanceClass +
      "')) SELECT(SELECT COUNT(*) FROM src WHERE src.Status='present') AS present,(SELECT COUNT(*) FROM src WHERE src.Status='absent') AS absent"
  )
    .then((ok) => {
      res.send(ok);
      consola.info(ok);
    })
    .catch((error) => {
      res.send(error);
    });
};

//enrolls user based on their ID
//TODO get userID to add to database
/* exports.sendIDforEnroll = (req, res) => {
    axios
    .post("https://vfranktor-kq5o1u6gbdu2bm9p.socketxp.com/RFIDenroll", {
      ID: "7",
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  };
  */
