from sanic import Sanic
from sanic.response import json
from controller import Controller

controller = None
app = Sanic("Vibration Server")

@app.route("/vibrate")
async def vibrate(request):
    jsonify = request.args
    intensity = float(args['intensity']) if 'intensity' in args else float(1.0)
    duration = int(args['duration']) if 'duration' in args else 100
    Controller.rumble(intensity, duration)
    return json({"res": True})


if __name__ == '__main__':
    global controller
    controller = Controller(dead_zone=16000) 
