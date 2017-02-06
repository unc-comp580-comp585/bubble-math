# bubble-math

server requirements:

+ Python 3.5+
+ Python Sanic webframework
+ Python pysdl2 
+ sdl2 library
+ xboxdrv driver package

server launch:

```bash

sudo rmmod xpad #unloads xpad driver
sudo xboxdrv --force-feedback #load xboxdrv driver with vibrate option
sudo python server.py #start server.

```

Any requests to localhost:8000/vibrate will cause the controller to vibrate.

/vibrate params:

+ intensity - any float/double in range [0.0f, 1.0f] - the intensity of the vibration per SDL2
+ duration - any int - the duration of the vibration in ms per SDL2

====

###### Why sudo?

Well, for some reason - if xboxdrv is run as sudo, 
pysdl2 needs to be sudo to read it.

====


client requirements:

+ any http server ever

client launch:

launch your http server, navigate to where it tells you.
