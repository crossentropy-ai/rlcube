import gymnasium as gym
import numpy as np

FRONT = 0
RIGHT = 1
BACK = 2
LEFT = 3
UP = 4
DOWN = 5

class Cube2(gym.Env):
    def __init__(self):
        super().__init__()
        self.action_space = gym.spaces.Discrete(6)
        self.observation_space = gym.spaces.Box(low=0, high=1, shape=(24, 6))
        self.state = np.zeros((6, 2, 2))
    
    def reset(self, seed=None, options=None):
        super().reset(seed=seed, options=options)
        self.state = np.zeros((6, 2, 2))
        self.state[0] = np.ones((2, 2)) * FRONT
        self.state[1] = np.ones((2, 2)) * RIGHT
        self.state[2] = np.ones((2, 2)) * BACK
        self.state[3] = np.ones((2, 2)) * LEFT 
        self.state[4] = np.ones((2, 2)) * UP
        self.state[5] = np.ones((2, 2)) * DOWN
        return self.state, {}
    
    def step(self, action):
        new_state = self.state.copy()

        # Front Clockwise
        if action == 0:
            new_state[RIGHT, 0, 0] = self.state[UP, 0, 0]
            new_state[RIGHT, 1, 0] = self.state[UP, 1, 0]
            new_state[DOWN, 0, 1] = self.state[RIGHT, 1, 0]
            new_state[DOWN, 1, 1] = self.state[RIGHT, 0, 0]
            new_state[LEFT, 0, 1] = self.state[DOWN, 0, 1]
            new_state[LEFT, 1, 1] = self.state[DOWN, 1, 1]
            new_state[UP, 0, 0] = self.state[LEFT, 1, 1]
            new_state[UP, 1, 0] = self.state[LEFT, 0, 1]
        # Front Counter-Clockwise
        if action == 1:
            new_state[LEFT, 0, 1] = self.state[UP, 1, 0]
            new_state[LEFT, 1, 1] = self.state[UP, 0, 0]
            new_state[DOWN, 0, 1] = self.state[LEFT, 0, 1]
            new_state[DOWN, 1, 1] = self.state[LEFT, 1, 1]
            new_state[RIGHT, 0, 0] = self.state[DOWN, 1, 1]
            new_state[RIGHT, 1, 0] = self.state[DOWN, 0, 1]
            new_state[UP, 0, 0] = self.state[RIGHT, 0, 0]
            new_state[UP, 1, 0] = self.state[RIGHT, 1, 0]
        # Right Clockwise
        if action == 2:
            new_state[BACK, 0, 0] = self.state[UP, 1, 0]
            new_state[BACK, 1, 0] = self.state[UP, 1, 1]
            new_state[DOWN, 1, 0] = self.state[BACK, 0, 0]
            new_state[DOWN, 1, 1] = self.state[BACK, 1, 0]
            new_state[FRONT, 0, 1] = self.state[DOWN, 1, 1]
            new_state[FRONT, 1, 1] = self.state[DOWN, 1, 0]
            new_state[UP, 1, 0] = self.state[FRONT, 1, 1]
            new_state[UP, 1, 1] = self.state[FRONT, 0, 1]
        # Right Counter-Clockwise
        if action == 3:
            new_state[FRONT, 0, 1] = self.state[UP, 1, 1]
            new_state[FRONT, 1, 1] = self.state[UP, 1, 0]
            new_state[DOWN, 1, 1] = self.state[FRONT, 0, 1]
            new_state[DOWN, 1, 0] = self.state[FRONT, 1, 1]
            new_state[BACK, 0, 0] = self.state[DOWN, 1, 0]
            new_state[BACK, 1, 0] = self.state[DOWN, 1, 1]
            new_state[UP, 1, 0] = self.state[BACK, 0, 0]
            new_state[UP, 1, 1] = self.state[BACK, 1, 0]

        self.state = new_state
        return self.state, 0, False, False, {}
