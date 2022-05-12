from mfrc522 import SimpleMFRC522
import RPi.GPIO as GPIO
import pyodbc
import random
import string

server = 'csproj.database.windows.net'
database = 'vantracker'
username = 'g3ar'
password = 'Faivah368!'
driver = '/usr/lib/arm-linux-gnueabihf/odbc/libtdsodbc.so'
continue_reading = True

conn = pyodbc.connect(driver=driver,
                      TDS_Version='8.0',
                      server=server,
                      port=1433,
                      database=database,
                      uid=username,
                      pwd=password)

cursor = conn.cursor()

reader = SimpleMFRC522()


class NotReadException(Exception):
    def __init__(self, message):
        super().__innit__(message)


message = "user not read"


def insertRFID_UID(rfid_uid, tag_id, studentId):
    sql_insert = "UPDATE students SET rfid_uid=\'" + \
        str(rfid_uid) + "\', tag_id=\'" + str(tag_id) + \
        "\' WHERE studentID=" + str(studentId)
    print(sql_insert)
    cursor.execute(sql_insert)
    conn.commit()
    print('written"' + str(rfid_uid) + ":" + str(tag_id))


def generateRFID_UID(first, last):
    firstname = (first.lower()[0])
    randomCharacter = random.choice(string.ascii_lowercase)
    lastname = (last.lower()[0])

    rfid_uid = f"{firstname}{randomCharacter}{lastname}"

    for i in range(5):
        rfid_uid += random.choice(string.digits)

    return rfid_uid


def getStudentIdentity(query):
    # TODO get studentID based on the edit button gotten from the website
    cursor.execute(query)
    row = cursor.fetchone()

    first_name = str(row[0])
    last_name = str(row[1])

    return first_name, last_name


def write(studentID):
    try:
        # TODO if studentID is not and integer
        first_name, last_name = getStudentIdentity(
            "SELECT first_name, last_name FROM students WHERE studentID=" + str(studentID))
        rfid_uid = generateRFID_UID(first_name, last_name)
        print('place tag to write')
        tag_id = reader.read()[0]
        reader.write(rfid_uid)

        # TODO check if user already exist overwrite or no? check if user name exists or linked to tag id
        insertRFID_UID(rfid_uid, tag_id, studentID)

    except NotReadException:
        print("didn't read user")
    finally:
        GPIO.cleanup()


write(10)
