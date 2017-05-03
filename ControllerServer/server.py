#!/usr/bin/env python3

from sanic import Sanic
from sanic.response import json
from controller import Controller as XboxCtrl

import argparse

app = Sanic("Bubble Math Server")

@app.route("/vibrate")
async def vibrate(request):
    jsonify = request.args
    print(jsonify)
    intensity = float(jsonify['intensity'][0]) if 'intensity' in jsonify else float(1.0)
    duration = int(jsonify['duration'][0]) if 'duration' in jsonify else 100
    ctrl.rumble(intensity, duration)
    return json({"res": True})


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-n", "--no-controller", help="launch without controller support", action="store_true")

    args = parser.parse_args()
    if not args.no_controller:
        ctrl = XboxCtrl(dead_zone=16000)

    app.static('/', '../')
    app.static('/', '../index.html')
    app.run(host="0.0.0.0", port="8000", debug=True)
