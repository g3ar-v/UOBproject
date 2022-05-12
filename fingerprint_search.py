from pyfingerprint.pyfingerprint import PyFingerprint
import pyodbc
import RPi.GPIO as GPIO
import time
import sys
from collections import Counter

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
databaseFingerprints = []

conn = pyodbc.connect(driver=driver,
                      TDS_Version='8.0',
                      server=server,
                      port=1433,
                      database=database,
                      uid=username,
                      pwd=password)

cursor = conn.cursor()

trackChoice, classID, moduleID = sys.argv[1].split(",")
# trackChoice, classID, moduleID = ('mark Both', 28, 8)


# print(trackChoice)
# print(classID)


def getStudentID(positionNumber):
    sql_insert = "SELECT studentID, TRIM(first_name), TRIM(last_name) FROM students WHERE fingerprintID=" + \
        str(positionNumber)
    cursor.execute(sql_insert)

    row = cursor.fetchone()
    studentID = row[0]
    firstName = row[1]
    lastName = row[2]

    print("student:" + str(firstName) + " " + str(lastName))

    return studentID


def getStudentInModule(query):

    cursor.execute(query)
    rows = cursor.fetchall()

    for row in rows:
        databaseFingerprints.append(str(row[0]))

    print(databaseFingerprints)
    # Search for template


def read(trackChoice, classID, moduleID):
  # Initialise sensor

    try:
        f = PyFingerprint('/dev/ttyUSB0', 57600, 0xFFFFFFFF, 0x00000000)

        if (f.verifyPassword() == False):
            raise ValueError('The given fingerprint sensor password is wrong!')

    except Exception as e:
        print('The fingerprint sensor could not be initialized!')
        print('Exception message: ' + str(e))
        exit(1)

    # Gets some sensor information
    getStudentInModule(
        "SELECT fingerprintID FROM students WHERE students.studentID IN (SELECT studentID FROM module_enrollment WHERE moduleID='" + str(moduleID) + "')")

    # print('Currently used templates: ' + str(f.getTemplateCount()) +
    #       '/' + str(f.getStorageCapacity()))

    if (trackChoice == 'markEntry'):
        scanned = dict()
        while (continue_reading):
            try:
                print('Waiting for finger...')
                print('Use right thumb')

                # Wait that finger is read
                while (f.readImage() == False):
                    pass

                # Converts read image to characteristics and stores it in charbuffer 1
                f.convertImage(0x01)

                # Searches for template
                result = f.searchTemplate()

                positionNumber = result[0]
                accuracyScore = result[1]

                if (positionNumber == -1):
                    print('No match found!')
                    GPIO.output(15, GPIO.HIGH)
                    time.sleep(0.25)
                    GPIO.output(15, GPIO.LOW)
                    time.sleep(0.25)

                else:
                    if (str(result[0]) in databaseFingerprints):

                        if positionNumber not in scanned:
                            # TODO send response to server

                            print('Found template at position #' +
                                  str(positionNumber))
                            print('The accuracy score is: ' +
                                  str(accuracyScore))
                            GPIO.output(8, GPIO.HIGH)
                            time.sleep(1)
                            GPIO.output(8, GPIO.LOW)
                            studentID = getStudentID(positionNumber)
                            scanned[positionNumber] = 1

                            cursor.execute(
                                "INSERT INTO attendance (studentID, classID) VALUES('" + str(studentID) + "','" + str(classID) + "')")
                            conn.commit()

                            # TODO want to insert this to attendance table
                            # based on the rule mark on entry or both
                        else:
                            # response
                            GPIO.output(16, GPIO.HIGH)
                            time.sleep(0.25)
                            GPIO.output(16, GPIO.LOW)
                            time.sleep(0.25)
                            print("already scanned")
                    else:
                        print("not in module")
                        for i in range(1, 5):
                            GPIO.output(15, GPIO.HIGH)
                            time.sleep(0.1)
                            GPIO.output(15, GPIO.LOW)
                            time.sleep(0.1)

            except Exception as e:
                print('Operation failed!')
                print('Exception message: ' + str(e))
                exit(1)
            finally:
                time.sleep(2)

    if (trackChoice == 'mark Both'):
        scanned = dict()
        while (continue_reading):
            try:
                print('Waiting for finger...')
                print('Use right thumb')

                # Wait that finger is read
                while (f.readImage() == False):
                    pass

                # Converts read image to characteristics and stores it in charbuffer 1
                f.convertImage(0x01)

                # Searches for template
                result = f.searchTemplate()

                positionNumber = result[0]
                accuracyScore = result[1]

                if (positionNumber == -1):
                    print('No match found!')
                    GPIO.output(15, GPIO.HIGH)
                    time.sleep(0.5)
                    GPIO.output(15, GPIO.LOW)
                    time.sleep(0.5)

                else:
                    if (str(result[0]) in databaseFingerprints):

                        if (positionNumber not in scanned):
                            scanned[positionNumber] = 1
                            print('Found template at position #' +
                                  str(positionNumber))
                            print('The accuracy score is: ' +
                                  str(accuracyScore))
                            GPIO.output(8, GPIO.HIGH)
                            time.sleep(1)
                            GPIO.output(8, GPIO.LOW)
                            print("scanned once")
                        else:
                            scanned[positionNumber] = scanned[positionNumber] + 1
                            print(str(scanned[positionNumber]))

                            if scanned[positionNumber] == 2:
                                GPIO.output(8, GPIO.HIGH)
                                time.sleep(1)
                                GPIO.output(8, GPIO.LOW)
                                studentID = getStudentID(positionNumber)
                                print("scanned twice ")
                                cursor.execute(
                                    "INSERT INTO attendance (studentID, classID) VALUES('" + str(studentID) + "','" + str(classID) + "')")
                                conn.commit()
                            else:
                                print("already scanned")
                                GPIO.output(16, GPIO.HIGH)
                                time.sleep(0.25)
                                GPIO.output(16, GPIO.LOW)
                                time.sleep(0.25)
                    else:
                        print("not in module")
                        GPIO.output(15, GPIO.HIGH)
                        time.sleep(0.25)
                        GPIO.output(15, GPIO.LOW)
                        time.sleep(0.25)

            except Exception as e:
                print('Operation failed!')
                print('Exception message: ' + str(e))
                exit(1)
            finally:
                time.sleep(2)

    GPIO.output(15, GPIO.HIGH)
    time.sleep(0.25)
    GPIO.output(15, GPIO.LOW)
    time.sleep(0.25)
    GPIO.output(15, GPIO.HIGH)
    time.sleep(0.25)
    GPIO.output(15, GPIO.LOW)
    time.sleep(0.25)
    GPIO.output(15, GPIO.HIGH)
    time.sleep(0.25)
    GPIO.output(15, GPIO.LOW)
    time.sleep(0.25)


read(trackChoice, classID, moduleID)
# read("mark Both", 6, 5)
