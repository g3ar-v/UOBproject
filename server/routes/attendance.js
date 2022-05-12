const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

// router.get("/attendance", attendanceController.view);
router.post("/eventdb", attendanceController.receiveDate);
router.get("/eventdb", attendanceController.sendEvent);
router.get("/eventlist", attendanceController.sendEventList);
router.post("/attendance", attendanceController.startTrack);
router.post("/attendanceStop", attendanceController.stopTrack);
router.get("/getdate", attendanceController.getdate);
router.get("/attendanceList", attendanceController.showAttendanceList);
router.post("/attendanceList", attendanceController.setAttendanceList);
router.get(
  "/InProgressList",
  attendanceController.showAttendanceListWithoutStatus
);
router.get("/studentList", attendanceController.showStudentList);
router.get("/manualAtt", attendanceController.showManualAttlist);
router.get("/AttCalc", attendanceController.calculateAttendance);
router.post("/manualAtt", attendanceController.addToAttManually);

module.exports = router;
