
from sdl2 import *
import sdl2.ext, time

def main():
    running = True
    while running is True:
        new_events = sdl2.ext.get_events()
        for event in new_events:
            if event.type == SDL_QUIT:
                running = False
        inputs = controller.update(new_events)
        if inputs["back"] == 1:
            print("Back/esc pressed. Quitting.")
            running = False
        if inputs["up"]:
            print('Up pressed')       
        elif inputs["down"]:
            print('Down pressed') 
        else:
            #print('No vertical input')
            pass
        if inputs["left"]:
            print('Left pressed')
        elif inputs["right"]:
            print('Right pressed')
        else:
            #print('No horizontal input')
            pass
        if inputs['a']:
            print('A pressed')
        if inputs['b']:
            print('B pressed')
        if inputs['x']:
            print('X pressed')
        if inputs['y']:
            print('Y pressed')
        if inputs['l']:
            print('L pressed')
        if inputs['r']:
            print('R pressed')
        if inputs['start']:
            print('Start pressed. Rumbling.')
            controller.rumble(float(1.0), 1000)
        if inputs['ljoy_x']:
            print('Left Joystick X-axis:',inputs['ljoy_x'])
        if inputs['ljoy_y']:
            print('Left Joystick Y-axis:',inputs['ljoy_y'])
        time.sleep(0.1)
class Input():

    def __init__(self):
        # Initialize subsystem. Check if joystick exists, AND is a GameController.
        # TODO: second controller support. Check for 1st when instantanced.
        SDL_Init(SDL_INIT_GAMECONTROLLER)
        SDL_Init(SDL_INIT_HAPTIC)
        SDL_GameControllerAddMappingsFromFile(b"resources/gamecontrollerdb.txt")
        self.haptic_available = False
        self.dead_zone = 8000
        if SDL_NumJoysticks() > 0:
            if SDL_IsGameController(0) == 1:
                self.controller = SDL_GameControllerOpen(0)
                self.joy = SDL_GameControllerGetJoystick(self.controller)
                controllername = str(SDL_GameControllerName(self.controller))
                print("Initialized: " + str(controllername))
                # Initialize haptics if available.
                self.haptics = SDL_HapticOpenFromJoystick(self.joy)
                if SDL_HapticRumbleSupported(self.haptics):
                    SDL_HapticRumbleInit(self.haptics)
                    self.haptic_available = True
                    print('Haptics enabled')
        else:
            print("No game controller found.")

        self.inputs = {"up": 0, "down": 0, "left": 0, "right": 0, "a": 0, "b": 0, "x": 0, "y": 0,
                       "l": 0, "r": 0, "start": 0, "back": 0, "ljoy_x":0, "ljoy_y":0}

    def rumble(self, intensity, length_ms):
        SDL_HapticRumblePlay(self.haptics, intensity, length_ms)

    def update(self, new_events):
        for event in new_events:
            if event.type == SDL_KEYUP:
                if event.key.keysym.sym == SDLK_z:
                    self.inputs["a"] = 0
                if event.key.keysym.sym == SDLK_x:
                    self.inputs["b"] = 0
                if event.key.keysym.sym == SDLK_c:
                    self.inputs["x"] = 0
                if event.key.keysym.sym == SDLK_v:
                    self.inputs["y"] = 0
                if event.key.keysym.sym == SDLK_ESCAPE:
                    self.inputs["back"] = 0
                if event.key.keysym.sym == SDLK_UP:
                    self.inputs["up"] = 0
                if event.key.keysym.sym == SDLK_DOWN:
                    self.inputs["down"] = 0
                if event.key.keysym.sym == SDLK_LEFT:
                    self.inputs["left"] = 0
                if event.key.keysym.sym == SDLK_RIGHT:
                    self.inputs["right"] = 0
            if event.type == SDL_KEYDOWN:
                if event.key.keysym.sym == SDLK_z:
                    self.inputs["a"] = 1
                if event.key.keysym.sym == SDLK_x:
                    self.inputs["b"] = 1
                if event.key.keysym.sym == SDLK_c:
                    self.inputs["x"] = 1
                if event.key.keysym.sym == SDLK_v:
                    self.inputs["y"] = 1
                if event.key.keysym.sym == SDLK_ESCAPE:
                    self.inputs["back"] = 1
                if event.key.keysym.sym == SDLK_UP:
                    self.inputs["up"] = 1
                if event.key.keysym.sym == SDLK_DOWN:
                    self.inputs["down"] = 1
                if event.key.keysym.sym == SDLK_LEFT:
                    self.inputs["left"] = 1
                if event.key.keysym.sym == SDLK_RIGHT:
                    self.inputs["right"] = 1

            if event.type == SDL_CONTROLLERBUTTONUP:
                self.inputs["a"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_A)
                self.inputs["b"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_B)
                self.inputs["x"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_X)
                self.inputs["y"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_Y)
                self.inputs["l"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_LEFTSHOULDER)
                self.inputs["r"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_RIGHTSHOULDER)
                self.inputs["back"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_BACK)
                self.inputs["start"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_START)
                self.inputs["up"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_DPAD_UP)
                self.inputs["down"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_DPAD_DOWN)
                self.inputs["left"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_DPAD_LEFT)
                self.inputs["right"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_DPAD_RIGHT)
            if event.type == SDL_CONTROLLERBUTTONDOWN:
                self.inputs["a"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_A)
                self.inputs["b"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_B)
                self.inputs["x"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_X)
                self.inputs["y"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_Y)
                self.inputs["l"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_LEFTSHOULDER)
                self.inputs["r"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_RIGHTSHOULDER)
                self.inputs["back"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_BACK)
                self.inputs["start"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_START)
                self.inputs["up"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_DPAD_UP)
                self.inputs["down"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_DPAD_DOWN)
                self.inputs["left"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_DPAD_LEFT)
                self.inputs["right"] = SDL_GameControllerGetButton(self.controller, SDL_CONTROLLER_BUTTON_DPAD_RIGHT)
            if event.type == SDL_CONTROLLERAXISMOTION and (event.caxis.axis == SDL_CONTROLLER_AXIS_LEFTX or event.caxis.axis == SDL_CONTROLLER_AXIS_LEFTY):
                x = SDL_JoystickGetAxis(self.joy, 0)
                y = SDL_JoystickGetAxis(self.joy, 1)
                if x > self.dead_zone or x < -1*self.dead_zone:
                    self.inputs['ljoy_x'] = x
                else:
                    self.inputs['ljoy_x'] = 0
                if y > self.dead_zone or y < -1*self.dead_zone:
                    self.inputs['ljoy_y'] = y 
                else:
                    self.inputs['ljoy_y'] = 0

        return self.inputs

if __name__ == '__main__':
    controller = Input()
    main()
