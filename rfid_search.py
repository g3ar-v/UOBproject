from urllib.error import URLError
from mfrc522 import SimpleMFRC522
import RPi.GPIO as GPIO
import pyodbc
import time
from datetime import datetime
import csv
from os.path import exists
from os import remove
from urllib.request import urlopen
import sys


GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(8, GPIO.OUT, initial=GPIO.LOW)  # green LED
GPIO.setup(15, GPIO.OUT, initial=GPIO.LOW)  # red LED
GPIO.setup(16, GPIO.OUT, initial=GPIO.LOW)  # blue LED

server = 'csproj.database.windows.net'
database = 'vantracker'
username = 'g3ar'
password = 'Faivah368!'
driver = '/usr/lib/arm-linux-gnueabihf/odbc/libtdsodbc.so'
continue_reading = True


reader = SimpleMFRC522()
databaseRFID_UID = []
databaseTAG_ID = []
RFIDtaken = []


# print(sys.argv[1])
moduleID, trackChoice, classID = sys.argv[1].split(",")
# moduleID, trackChoice, classID = [8, 'markEntry', 4]


def read(moduleID, trackChoice, classID):
    try:
        conn = pyodbc.connect(driver=driver,
                              TDS_Version='8.0',
                              server=server,
                              port=1433,
                              database=database,
                              uid=username,
                              pwd=password)
        cursor = conn.cursor()
    except:
        readWithoutDatabase(moduleID, trackChoice, classID)

    try:
        urlopen('http://www.google.com', timeout=1)
    except:
        readWithoutDatabase(moduleID, trackChoice, classID)

    print("module: " + str(moduleID))

    getStudents("SELECT rfid_uid, tag_id FROM students WHERE students.studentID IN (SELECT studentID FROM module_enrollment WHERE moduleID='" + str(moduleID) + "')", cursor)

    if trackChoice == 'markEntry':
        try:
            print("Scan for attendance")
            scanned = dict()

            database_array = list(zip(databaseTAG_ID, databaseRFID_UID))
            print(database_array)

            while continue_reading:

                time.sleep(1.5)
                tag_id, rfid_uid = reader.read()

                # print(f"tagid {tag_id} rfid {rfid_uid}")
                # print([str(tag_id), str(rfid_uid)])

                # print(
                #     f"if in database {[tag_id, rfid_uid] in database_array}")
                if ((str(tag_id).strip(), str(rfid_uid).strip()) in database_array):
                    time.sleep(1)
                    # if user scans once add him to list to be added to the database
                    # if (Counter(str(tag_id).strip()) == Counter(str(dbtag_id).strip()) and Counter(str(rfid_uid).strip()) == Counter(str(dbrfid_uid).strip())):
                    # sound and green light bulb shines
                    if (tag_id not in scanned):
                        cursor.execute(
                            "SELECT studentID FROM students WHERE rfid_uid='" + str(rfid_uid) + "' AND tag_id='" + str(tag_id) + "'")
                        studentID = cursor.fetchone()
                        cursor.execute(
                            "INSERT INTO attendance (studentID, classID) VALUES('" + str(studentID[0]) + "','" + str(classID) + "')")
                        conn.commit()
                        print('scan taken: ' + str(datetime.now()))
                        # response
                        GPIO.output(8, GPIO.HIGH)
                        time.sleep(1)
                        GPIO.output(8, GPIO.LOW)
                        scanned[tag_id] = 1
                        time.sleep(1)
                    else:
                        # response
                        for i in range(1, 5):
                            GPIO.output(16, GPIO.HIGH)
                            time.sleep(0.1)
                            GPIO.output(16, GPIO.LOW)
                            time.sleep(0.1)
                        print("already scanned")

                else:
                    print("not in module")
                    GPIO.output(15, GPIO.HIGH)
                    time.sleep(0.25)
                    GPIO.output(15, GPIO.LOW)
                    time.sleep(0.25)

        finally:
            GPIO.cleanup()

    if (trackChoice == 'mark Both'):
        try:
            print("Scan for attendance")
            scanned = dict()
            database_array = list(zip(databaseTAG_ID, databaseRFID_UID))
            print(database_array)

            while continue_reading:

                print("waiting for read")
                time.sleep(2)
                tag_id, rfid_uid = reader.read()

                if ((str(tag_id).strip(), str(rfid_uid).strip()) in database_array):
                    # if user scans once take note of that scan add them to array
                    # don't think I'm handling a case where
                    # if (Counter(str(tag_id).strip()) == Counter(str(dbtag_id).strip()) and Counter(str(rfid_uid).strip()) == Counter(str(dbrfid_uid).strip())):
                    if (tag_id not in scanned):
                        scanned[tag_id] = 1
                        print("scanned: " + str(tag_id) +
                              str(scanned[tag_id]))
                        GPIO.output(8, GPIO.HIGH)
                        time.sleep(0.5)
                        GPIO.output(8, GPIO.LOW)

                    else:
                        scanned[tag_id] = scanned[tag_id] + 1
                        print(str(scanned[tag_id]))
                        if (scanned[tag_id] == 2):
                            # add to database
                            cursor.execute("SELECT studentID FROM students WHERE rfid_uid='" + str(
                                rfid_uid) + "' AND tag_id='" + str(tag_id) + "'")
                            studentID = cursor.fetchone()
                            cursor.execute("INSERT INTO attendance (studentID, classID) VALUES('" + str(
                                studentID[0]) + "','" + str(classID) + "')")
                            conn.commit()
                            print('scan taken: ' + str(datetime.now()))
                            GPIO.output(8, GPIO.HIGH)
                            time.sleep(0.25)
                            GPIO.output(8, GPIO.LOW)
                            time.sleep(0.25)
                            GPIO.output(8, GPIO.HIGH)
                            time.sleep(0.25)
                            GPIO.output(8, GPIO.LOW)

                        else:
                            scanned[tag_id] = scanned[tag_id] + 1
                            print(str(scanned[tag_id]))
                            if (scanned[tag_id] == 2):
                                cursor.execute("SELECT studentID FROM students WHERE rfid_uid='" + str(
                                    rfid_uid) + "' AND tag_id='" + str(tag_id) + "'")
                                studentID = cursor.fetchone()
                                cursor.execute("INSERT INTO attendance (studentID, classID) VALUES('" + str(
                                    studentID[0]) + "','" + str(classID) + "')")
                                conn.commit()

                                print('scan taken: ' + str(datetime.now()))
                                GPIO.output(8, GPIO.HIGH)
                                time.sleep(0.25)
                                GPIO.output(8, GPIO.LOW)
                                time.sleep(0.25)
                                GPIO.output(8, GPIO.HIGH)
                                time.sleep(0.25)
                                GPIO.output(8, GPIO.LOW)

                            else:
                                for i in range(1, 5):
                                    GPIO.output(16, GPIO.HIGH)
                                    time.sleep(0.25)
                                    GPIO.output(16, GPIO.LOW)
                                    time.sleep(0.25)
                                print("already scanned")

                else:
                    GPIO.output(15, GPIO.HIGH)
                    time.sleep(0.25)
                    GPIO.output(15, GPIO.LOW)
                    time.sleep(0.25)
                    print("not in module")

        finally:
            GPIO.cleanup()


def getStudents(query, cursor):
    # TODO handle database can't connect exception
    cursor.execute(query)
    rows = cursor.fetchall()

    for row in rows:
        databaseRFID_UID.append(str(row[0]))
        databaseTAG_ID.append(str(row[1]))

    # print("database RFID {}".format(databaseRFID_UID))
    # print("database TAGID {}".format(databaseTAG_ID))


def readWithoutDatabase(moduleID, trackChoice, classID):
    if trackChoice == 'markEntry':
        print("In offline scan")

        attendance_file = open('attendance.csv', mode='w')
        writeToAttendance = csv.writer(
            attendance_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        writeToAttendance.writerow([moduleID, classID])

        while continue_reading:

            time.sleep(1.5)
            tag_id, rfid_uid = reader.read()
            print("read")
            time.sleep(1.5)
            writeToAttendance.writerow([tag_id, rfid_uid])
            attendance_file.flush()

        exit()


if (exists('attendance.csv')):
    local_rfid = []
    local_tagID = []
    # arr = []
    conn = pyodbc.connect(driver=driver,
                          TDS_Version='8.0',
                          server=server,
                          port=1433,
                          database=database,
                          uid=username,
                          pwd=password)

    cursor = conn.cursor()

    # find a way to get the module of the ex
    with open('attendance.csv', mode='r') as attendance_file:
        attendance_reader = csv.reader(attendance_file, delimiter=',')
        line_count = 0
        modID = 1
        cID = 1

        for row in attendance_reader:
            if line_count == 0:
                modID = row[0]
                cID = row[1]
                line_count += 1
                print("reading from attendance.csv")
                getStudents(
                    "SELECT rfid_uid, tag_id FROM students WHERE students.studentID IN (SELECT studentID FROM module_enrollment WHERE moduleID='" + str(modID) + "')", cursor)
                # print(f'moduleID and classID are {", ".join(row)}')
            else:
                local_rfid.append(str(row[1]).strip())
                local_tagID.append(str(row[0]).strip())
                line_count += 1

        database_array = list(zip(databaseRFID_UID, databaseTAG_ID))
        arr = list(zip(local_rfid, local_tagID))
        print("data from database {}".format(database_array))
        print("data from csv files {}".format(arr))

        for i in arr:
            # print(i in database_array)
            if (i in database_array):
                # sound and green light bulb shines
                # print(i[0])
                # print(i[1])

                cursor.execute(
                    "SELECT studentID FROM students WHERE rfid_uid='" + str(i[0]) + "' AND tag_id='" + str(i[1]) + "'")
                studentID = cursor.fetchone()
                cursor.execute(
                    "INSERT INTO attendance (studentID, classID) VALUES('" + str(studentID[0]) + "','" + str(classID) + "')")
                conn.commit()

        remove("attendance.csv")
read(moduleID, trackChoice, classID)

# read(8, "mark Entry", 7)
