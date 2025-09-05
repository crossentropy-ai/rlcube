from random import shuffle
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
        self.action_space = gym.spaces.Discrete(12)
        self.observation_space = gym.spaces.Box(low=0,high=1,shape=(24, 6),dtype=np.int8)
        self.state = np.zeros((6, 2, 2))
        self.step_count = 0
    
    def reset(self, seed=None, options=None):
        super().reset(seed=seed, options=options)
        self.state = np.zeros((6, 2, 2))
        self.state[0] = np.ones((2, 2)) * FRONT
        self.state[1] = np.ones((2, 2)) * RIGHT
        self.state[2] = np.ones((2, 2)) * BACK
        self.state[3] = np.ones((2, 2)) * LEFT 
        self.state[4] = np.ones((2, 2)) * UP
        self.state[5] = np.ones((2, 2)) * DOWN
        shuffle_steps =self.np_random.integers(0, 20)
        for i in range(shuffle_steps):
            self.step(self.action_space.sample())
        self.step_count = 0
        return self._get_obs(), {}
    
    def step(self, action):
        self.step_count += 1
        new_state = self.state.copy()

        # Front Clockwise
        if action == 0:
            new_state[RIGHT, 0, 0] = self.state[UP, 0, 0]
            new_state[RIGHT, 1, 0] = self.state[UP, 1, 0]
            new_state[DOWN, 0, 1]  = self.state[RIGHT, 1, 0]
            new_state[DOWN, 1, 1]  = self.state[RIGHT, 0, 0]
            new_state[LEFT, 0, 1]  = self.state[DOWN, 0, 1]
            new_state[LEFT, 1, 1]  = self.state[DOWN, 1, 1]
            new_state[UP, 0, 0]    = self.state[LEFT, 1, 1]
            new_state[UP, 1, 0]    = self.state[LEFT, 0, 1]
        # Front Counter-Clockwise
        if action == 1:
            new_state[LEFT, 0, 1]  = self.state[UP, 1, 0]
            new_state[LEFT, 1, 1]  = self.state[UP, 0, 0]
            new_state[DOWN, 0, 1]  = self.state[LEFT, 0, 1]
            new_state[DOWN, 1, 1]  = self.state[LEFT, 1, 1]
            new_state[RIGHT, 0, 0] = self.state[DOWN, 1, 1]
            new_state[RIGHT, 1, 0] = self.state[DOWN, 0, 1]
            new_state[UP, 0, 0]    = self.state[RIGHT, 0, 0]
            new_state[UP, 1, 0]    = self.state[RIGHT, 1, 0]
        # Right Clockwise
        if action == 2:
            new_state[BACK, 0, 0]  = self.state[UP, 1, 0]
            new_state[BACK, 1, 0]  = self.state[UP, 1, 1]
            new_state[DOWN, 1, 0]  = self.state[BACK, 0, 0]
            new_state[DOWN, 1, 1]  = self.state[BACK, 1, 0]
            new_state[FRONT, 0, 1] = self.state[DOWN, 1, 1]
            new_state[FRONT, 1, 1] = self.state[DOWN, 1, 0]
            new_state[UP, 1, 0]    = self.state[FRONT, 1, 1]
            new_state[UP, 1, 1]    = self.state[FRONT, 0, 1]
        # Right Counter-Clockwise
        if action == 3:
            new_state[FRONT, 0, 1] = self.state[UP, 1, 1]
            new_state[FRONT, 1, 1] = self.state[UP, 1, 0]
            new_state[DOWN, 1, 1]  = self.state[FRONT, 0, 1]
            new_state[DOWN, 1, 0]  = self.state[FRONT, 1, 1]
            new_state[BACK, 0, 0]  = self.state[DOWN, 1, 0]
            new_state[BACK, 1, 0]  = self.state[DOWN, 1, 1]
            new_state[UP, 1, 0]    = self.state[BACK, 0, 0]
            new_state[UP, 1, 1]    = self.state[BACK, 1, 0]
        # Left Clockwise
        if action == 4:
            new_state[FRONT, 0, 0] = self.state[UP, 0, 1]
            new_state[FRONT, 1, 0] = self.state[UP, 0, 0]
            new_state[DOWN, 0, 0]  = self.state[FRONT, 1, 0]
            new_state[DOWN, 0, 1]  = self.state[FRONT, 0, 0]
            new_state[BACK, 0, 1]  = self.state[DOWN, 0, 0]
            new_state[BACK, 1, 1]  = self.state[DOWN, 0, 1]
            new_state[UP, 0, 0]    = self.state[BACK, 0, 1]
            new_state[UP, 0, 1]    = self.state[BACK, 1, 1]
        # Left Counter-Clockwise
        if action == 5:
            new_state[BACK, 0, 1]  = self.state[UP, 0, 0]
            new_state[BACK, 1, 1]  = self.state[UP, 0, 1]
            new_state[DOWN, 0, 0]  = self.state[BACK, 0, 1]
            new_state[DOWN, 0, 1]  = self.state[BACK, 1, 1]
            new_state[FRONT, 0, 0] = self.state[DOWN, 0, 1]
            new_state[FRONT, 1, 0] = self.state[DOWN, 0, 0]
            new_state[UP, 0, 1]    = self.state[FRONT, 0, 0]
            new_state[UP, 0, 0]    = self.state[FRONT, 1, 0]
        # Back Clockwise
        if action == 6:
            new_state[RIGHT, 0, 1] = self.state[DOWN, 1, 0]
            new_state[RIGHT, 1, 1] = self.state[DOWN, 0, 0]
            new_state[UP, 0, 1]    = self.state[RIGHT, 0, 1]
            new_state[UP, 1, 1]    = self.state[RIGHT, 1, 1]
            new_state[LEFT, 0, 0]  = self.state[UP, 1, 1]
            new_state[LEFT, 1, 0]  = self.state[UP, 0, 1]
            new_state[DOWN, 0, 0]  = self.state[LEFT, 0, 0]
            new_state[DOWN, 1, 0]  = self.state[LEFT, 1, 0]
        # Back Counter-Clockwise
        if action == 7:
            new_state[DOWN, 1, 0]  = self.state[RIGHT, 0, 1] 
            new_state[DOWN, 0, 0]  = self.state[RIGHT, 1, 1] 
            new_state[RIGHT, 0, 1] = self.state[UP, 0, 1]    
            new_state[RIGHT, 1, 1] = self.state[UP, 1, 1]    
            new_state[UP, 1, 1]    = self.state[LEFT, 0, 0]  
            new_state[UP, 0, 1]    = self.state[LEFT, 1, 0]  
            new_state[LEFT, 0, 0]  = self.state[DOWN, 0, 0]  
            new_state[LEFT, 1, 0]  = self.state[DOWN, 1, 0]
        # Up Clockwise
        if action == 8:
            new_state[FRONT, 0, 0] = self.state[RIGHT, 0, 0]
            new_state[FRONT, 0, 1] = self.state[RIGHT, 0, 1]
            new_state[LEFT, 0, 0]  = self.state[FRONT, 0, 0]
            new_state[LEFT, 0, 1]  = self.state[FRONT, 0, 1]
            new_state[BACK, 0, 0]  = self.state[LEFT, 0, 0]
            new_state[BACK, 0, 1]  = self.state[LEFT, 0, 1]
            new_state[RIGHT, 0, 0] = self.state[BACK, 0, 0]
            new_state[RIGHT, 0, 1] = self.state[BACK, 0, 1]
        # Up Counter-Clockwise
        if action == 9:
            new_state[RIGHT, 0, 0] = self.state[FRONT, 0, 0]
            new_state[RIGHT, 0, 1] = self.state[FRONT, 0, 1]
            new_state[FRONT, 0, 0] = self.state[LEFT, 0, 0] 
            new_state[FRONT, 0, 1] = self.state[LEFT, 0, 1] 
            new_state[LEFT, 0, 0]  = self.state[BACK, 0, 0] 
            new_state[LEFT, 0, 1]  = self.state[BACK, 0, 1] 
            new_state[BACK, 0, 0]  = self.state[RIGHT, 0, 0]
            new_state[BACK, 0, 1]  = self.state[RIGHT, 0, 1]
        # Down Clockwise
        if action == 10:
            new_state[FRONT, 1, 0] = self.state[LEFT, 1, 0]
            new_state[FRONT, 1, 1] = self.state[LEFT, 1, 1]
            new_state[LEFT, 1, 0]  = self.state[BACK, 1, 0]
            new_state[LEFT, 1, 1]  = self.state[BACK, 1, 1]
            new_state[BACK, 1, 0]  = self.state[RIGHT, 1, 0]
            new_state[BACK, 1, 1]  = self.state[RIGHT, 1, 1]
            new_state[RIGHT, 1, 0] = self.state[FRONT, 1, 0]
            new_state[RIGHT, 1, 1] = self.state[FRONT, 1, 1]
        # Down Counter-Clockwise
        if action == 11:
            new_state[LEFT, 1, 0]  = self.state[FRONT, 1, 0]
            new_state[LEFT, 1, 1]  = self.state[FRONT, 1, 1]
            new_state[BACK, 1, 0]  = self.state[LEFT, 1, 0] 
            new_state[BACK, 1, 1]  = self.state[LEFT, 1, 1] 
            new_state[RIGHT, 1, 0] = self.state[BACK, 1, 0] 
            new_state[RIGHT, 1, 1] = self.state[BACK, 1, 1] 
            new_state[FRONT, 1, 0] = self.state[RIGHT, 1, 0]
            new_state[FRONT, 1, 1] = self.state[RIGHT, 1, 1]

        self.state = new_state
        return self._get_obs(), 1 if self._is_solved() else -1, self._is_solved(), self.step_count >= 100, {}

    def _get_obs(self):
        one_hots = []
        for i in range(6):
            for j in range(2):
                for k in range(2):
                    label = int(self.state[i, j, k])
                    zeros = np.zeros(6)
                    zeros[label] = 1
                    one_hots.append(zeros)
        return np.array(one_hots)
    
    def _is_solved(self):
        for i in range(6):
            if np.mean(self.state[i]) != self.state[i][0][0]:
                return False
        return True
