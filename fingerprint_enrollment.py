import time
from pyfingerprint.pyfingerprint import PyFingerprint
import pyodbc

server = 'csproj.database.windows.net'
database = 'vantracker'
username = 'g3ar'
password = 'Faivah368!'
driver = '/usr/lib/arm-linux-gnueabihf/odbc/libtdsodbc.so'


conn = pyodbc.connect(driver=driver,
                      TDS_Version='8.0',
                      server=server,
                      port=1433,
                      database=database,
                      uid=username,
                      pwd=password)

cursor = conn.cursor()

# TODO get studentID
studentID = 9
continue_reading = True


def insertFingerprintPosition(studentID, positionNumber):
    sql_insert = "UPDATE students SET fingerprintID=\'" +\
        positionNumber + "\' WHERE studentID=" + str(studentID)
    print(sql_insert)
    cursor.execute(sql_insert)
    conn.commit()
    print('written"' + positionNumber + ":")


while (continue_reading):
    # initialize the sensor
    try:
        f = PyFingerprint('/dev/ttyUSB0', 57600, 0xFFFFFFFF, 0x00000000)

        if (f.verifyPassword() == False):
            raise ValueError('The given fingerprint sensor password is wrong!')

    except Exception as e:
        print('The fingerprint sensor could not be initialized!')
        print('Exception message: ' + str(e))
        exit(1)

    # Gets some sensor information logs
    print('Currently used templates: ' + str(f.getTemplateCount()) +
          '/' + str(f.getStorageCapacity()))

    try:
        print('Waiting for finger.....')

        # Wait that finger is read
        while (f.readImage() == False):
            pass

        # Convqerts read image to characteristics and stores it in charbuffer 1
        f.convertImage(0x01)

        # Checks if finger is already enrolled
        result = f.searchTemplate()
        positionNumber = result[0]

        if (positionNumber >= 0):
            print('Template already exists at position #' + str(positionNumber))
            exit(0)

        print('Remove finger...')
        time.sleep(2)

        print('Waiting for same finger again...')

        # Wait that finger is read again
        while (f.readImage() == False):
            pass

        # Converts read image to characteristics and stores it in charbuffer 2
        f.convertImage(0x02)

        # Compares the charbuffers
        if (f.compareCharacteristics() == 0):
            raise Exception('Fingers do not match')

        # Creates a template
        f.createTemplate()

        # Saves template at new position number
        positionNumber = f.storeTemplate()
        print('Finger enrolled successfully!')
        print('New template position #' + str(positionNumber))

        try:
            insertFingerprintPosition(studentID, str(positionNumber))
        except Exception as e:
            print('Exception message' + str(e))

    except Exception as e:
        print('Operation failed!')
        print('Exception message: ' + str(e))
        exit(1)
