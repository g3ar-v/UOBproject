# tracker_raspberrypi

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)

## About <a name = "about"></a>

An attendance monitoring system that is able to track attendance with a diverse number of methods and to render a novel solution to the argument of "Inefficiency in attendance monitoring systems”.

The raspberry pi connected to the RFID or fingerprint

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

What things you need to install the software and how to install them.

* TDS driver 
* pitunnel
 

### Installing

install TDS driver for database
install pitunnel


## Usage <a name = "usage"></a>

* start pitunnel
* start flaskserver

starting flaskserver

```
python3 flask_server.py
```
starting pitunnel

````
pitunnel --port=5000 --http --name=myweb

````


