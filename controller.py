from sdl2 import *
class Controller(object):

    def __init__(self, dead_zone=8000):
        SDL_Init(SDL_INIT_GAMECONTROLLER)                                                                                                                                                                   
        SDL_Init(SDL_INIT_HAPTIC)                                                                                                                                                                           
        SDL_GameControllerAddMappingsFromFile(b"resources/gamecontrollerdb.txt")                                                                                                                            
        self.__funcs = {
                   'a' : None,
                   'b' : None,
                   'x' : None,
                   'y' : None,
                   'bck' : None,
                   'up' : None,
                   'down': None,
                   'right' : None,
                   'lb' : None,
                   'rb' : None,
                   'start' : None,
                   'leftjoy' : None,
                }
        self.__haptic_available = False                                                                                                                                                                       
        self.__dead_zone = dead_zone                                                                                                                                                                         
        if SDL_NumJoysticks() > 0:                                                                                                                                                                          
            if SDL_IsGameController(0) == 1:                                                                                                                                                                
                self.__controller = SDL_GameControllerOpen(0)                                                                                                                                                 
                self.__joy = SDL_GameControllerGetJoystick(self.__controller)                                                                                                                                   
                controllername = SDL_GameControllerName(self.__controller).decode()                                                                                                                          
                print("Initialized: " + controllername)                                                                                                                                                
                # Initialize haptics if available.                                                                                                                                                          
                self.__haptics = SDL_HapticOpenFromJoystick(self.__joy)                                                                                                                                         
                if SDL_HapticRumbleSupported(self.__haptics):                                                                                                                                                 
                    SDL_HapticRumbleInit(self.__haptics)                                                                                                                                                      
                    self.__haptic_available = True                                                                                                                                                            
                    print('Haptics enabled')                                                                                                                                                                
        else:                                                                                                                                                                                               
            print("No game controller found.")                                                                                                                                                              
            from sys import exit                                                                                                                                                                            
            exit(-1) 

    def start_listening(self):
        from sdl2 import ext
        while True:
           events = ext.get_events()
           for event in events:
               if event.type == SDL_QUIT:
                   from sys import exit, stderr
                   print("Controller Recieved Quit", file=stderr)
                   exit(0)
               if event.type == SDL_KEYUP:
                   if event.key.keysym.sym == SDLK_z:
                       self.__call_func("a")
                   if event.key.keysym.sym == SDLK_x:
                       self.__call_func("b")
                   if event.key.keysym.sym == SDLK_c:
                       self.__call_func("x")
                   if event.key.keysym.sym == SDLK_v:
                       self.__call_func("y")
                   if event.key.keysym.sym == SDLK_ESCAPE:
                       self.__call_func("bck")
                   if event.key.keysym.sym == SDLK_UP:
                       self.__call_func("up")
                   if event.key.keysym.sym == SDLK_DOWN:
                       self.__call_func("down")
                   if event.key.keysym.sym == SDLK_LEFT:
                       self.__call_func("left")
                   if event.key.keysym.sym == SDLK_RIGHT:
                       self.__call_func("right")
               if event.type == SDL_KEYDOWN:
                   if event.key.keysym.sym == SDLK_z:
                       self.__call_func("a")
                   if event.key.keysym.sym == SDLK_x:
                       self.__call_func("b")
                   if event.key.keysym.sym == SDLK_c:
                       self.__call_func("x")
                   if event.key.keysym.sym == SDLK_v:
                       self.__call_func("y")
                   if event.key.keysym.sym == SDLK_ESCAPE:
                       self.__call_func("bck")
                   if event.key.keysym.sym == SDLK_UP:
                       self.__call_func("up")
                   if event.key.keysym.sym == SDLK_DOWN:
                       self.__call_func("down")
                   if event.key.keysym.sym == SDLK_LEFT:
                       self.__call_func("left")
                   if event.key.keysym.sym == SDLK_RIGHT:
                       self.__call_func("right")
               if event.type == SDL_CONTROLLERBUTTONUP:
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_A) != 0:
                        self.__call_func("a")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_B) != 0:
                        self.__call_func("b")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_X) != 0:
                        self.__call_func("x")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_Y) != 0:
                        self.__call_func("y")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_LEFTSHOULDER) != 0:
                        self.__call_func("lb")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_RIGHTSHOULDER) != 0:
                        self.__call_func("rb")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_BACK) != 0:
                        self.__call_func("bck")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_START) != 0:
                        self.__call_func("start")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_DPAD_UP) != 0:
                        self.__call_func("up")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_DPAD_DOWN) != 0:
                        self.__call_func("down")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_DPAD_RIGHT) != 0:
                        self.__call_func("right")                                      
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_DPAD_LEFT) != 0:
                        self.__call_func("left")
               if event.type == SDL_CONTROLLERBUTTONDOWN:
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_A) != 0:
                        self.__call_func("a")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_B) != 0:
                        self.__call_func("b")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_X) != 0:
                        self.__call_func("x")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_Y) != 0:
                        self.__call_func("y")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_LEFTSHOULDER) != 0:
                        self.__call_func("lb")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_RIGHTSHOULDER) != 0:
                        self.__call_func("rb")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_BACK) != 0:
                        self.__call_func("bck")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_START) != 0:
                        self.__call_func("start")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_DPAD_UP) != 0:
                        self.__call_func("up")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_DPAD_DOWN) != 0:
                        self.__call_func("down")
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_DPAD_RIGHT) != 0:
                        self.__call_func("right")                                      
                    if SDL_GameControllerGetButton(self.__controller, SDL_CONTROLLER_BUTTON_DPAD_LEFT) != 0:
                        self.__call_func("left")
               if event.type == SDL_CONTROLLERAXISMOTION and (event.caxis.axis == SDL_CONTROLLER_AXIS_LEFTX or event.caxis.axis == SDL_CONTROLLER_AXIS_LEFTY):
                    x = SDL_JoystickGetAxis(self.__joy, 0)
                    y = SDL_JoystickGetAxis(self.__joy, 1)
                    self.__call_joystick_func("leftjoy", x, y) 

    def rumble(self, intensity=float(1.5), length=500):
        from sys import stderr
        print("Rumble Called with : Args({}, {})".format(intensity, length), file=stderr)
        SDL_HapticRumblePlay(self.__haptics, intensity, length)

    def __call_func(self, buttonid):
        from sys import stderr
        print("Called: {} ".format(buttonid), file=stderr)
        if buttonid in self.__funcs and self.__funcs[buttonid]:
            self.__funcs[buttonid]()

    def __call_joystick_func(self, joyid, x, y):
        from sys import stderr
        print("Called: {} with x: {} , y: {}".format(joyid, x, y), file=stderr)
        if (x > self.__dead_zone or x < -1 * self.__dead_zone) and (y > self.__dead_zone or y < -1*self.__dead_zone):
            if joyid in self.__funcs and self.__funcs[joyid] != None:
                self.__funcs[joyid](joyid, x, y)

    def bind_func(self, _id, func):
        self.__funcs[_id] = func

    def avail_func_bindings(self):
        return list(self.__funcs.keys())


if __name__ == "__main__":
    from time import sleep
    c = Controller(16000)
    from sys import exit
    c.bind_func("a", c.rumble)
    c.start_listening()
