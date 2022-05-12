from tkinter import TRUE
from flask import Flask, request, current_app
from subprocess import Popen, PIPE, STDOUT
from psutil import Process
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


@app.route('/', methods=['GET'])
def index():
    return "Flask server"

# get status and start tracking with rfid


@app.route('/RFIDread', methods=['POST'])
def readrfid():
    if request.method == 'POST':
        module = request.get_json(force=True)
        print("moduleID: {}".format(module['moduleID']))
        print("trackChoice: {}".format(module['trackChoice']))
        print("classID: {}".format(module['classID']))

        RFIDprocess = Popen(
            ["python3", "rfid_search.py", "{},{},{}".format(module['moduleID'], module['trackChoice'], module['classID'])], stdout=PIPE, stderr=PIPE, text=True, encoding="utf")
        print("ProcessID: {}".format(RFIDprocess.pid))
        current_app.config['RFIDpid'] = RFIDprocess.pid

        for line in RFIDprocess.stdout:
            print(line, end="")

        for line in RFIDprocess.stderr:
            print(line, end="")
        return "Thanks", 200


@app.route('/RFIDstop', methods=['POST'])
def stopRFID():
    if request.method == 'POST':
        rfid = current_app.config['RFIDpid']
        print(rfid)
        parent = Process(rfid)
        try:
            for child in parent.children(recursive=True):
                child.kill()
            parent.kill()
        finally:
            print("killing child process: {}".format(rfid))

    return "Thanks", 200


@app.route('/fingerprintread', methods=['GET', 'POST'])
def readfingerprint():
    if request.method == 'POST':
        module = request.get_json(force=True)

        print("trackChoice: {}".format(module['trackChoice']))
        print("classID: {}".format(module['classID']))
        print("moduleID: {}".format(module['moduleID']))

        Fingerprintproc = Popen(
            ["python3", "fingerprint_search.py", "{},{},{}".format(module['trackChoice'], module['classID'], module['moduleID'])], stdout=PIPE, stderr=PIPE, text=True, encoding="utf")
        print("ProcessID: {}".format(Fingerprintproc.pid))
        current_app.config['fingerprintpid'] = Fingerprintproc.pid
        # print(Fingerprintproc.pid.children)

        for line in Fingerprintproc.stdout:
            print(line, end="")

        for line in Fingerprintproc.stderr:
            print(line, end="")
        return "Thanks", 200


@app.route('/fingerprintstop', methods=['POST'])
def stopfingerprint():
    if request.method == 'POST':
        fingerprint = current_app.config['fingerprintpid']
        print(fingerprint)
        parent = Process(fingerprint)
        try:
            for child in parent.children(recursive=True):
                child.kill()
            parent.kill()
        finally:
            print("killing child process: {}".format(fingerprint))

    return "Thanks", 200


@ app.route('/RFIDenroll', methods=['GET', 'POST'])
def enrollRFID():
    if request.method == 'POST':
        # adds student data to database
        # TODO involves getting the studentID
        content = request.get_json()
        # return rfid_enrollment.write(content.get('ID'))


@ app.errorhandler(404)
def page_not_found(error):
    return "invalid route"


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
