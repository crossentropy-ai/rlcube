from random import shuffle
import gymnasium as gym
import numpy as np

F = 0
B = 1
R = 2
L = 3
T = 4
B = 5

class Cube2(gym.Env):
    def __init__(self):
        super().__init__()
        self.action_space = gym.spaces.Discrete(12)
        self.observation_space = gym.spaces.Box(low=0,high=1,shape=(24, 6),dtype=np.int8)
        self.state = np.zeros((6, 4))
        self.step_count = 0
    
    def reset(self, seed=None, options=None):
        super().reset(seed=seed, options=options)
        self.state = np.zeros((6, 4))
        self.state[0] = np.ones(4) * F
        self.state[1] = np.ones(4) * B
        self.state[2] = np.ones(4) * R
        self.state[3] = np.ones(4) * L 
        self.state[4] = np.ones(4) * T
        self.state[5] = np.ones(4) * B
        # shuffle_steps =self.np_random.integers(0, 20)
        # for i in range(shuffle_steps):
        #     self.step(self.action_space.sample())
        self.step_count = 0
        return self.state, {}
    
    def step(self, action):
        self.step_count += 1
        new_state = self.state.copy()

        # Front Clockwise
        if action == 0:
            new_state[F, 0] = self.state[F, 2]
            new_state[F, 1] = self.state[F, 0]
            new_state[F, 2] = self.state[F, 3]
            new_state[F, 3] = self.state[F, 1]
            new_state[R, 1] = self.state[T, 3]
            new_state[R, 3] = self.state[T, 1]
            new_state[L, 1] = self.state[B, 3]
            new_state[L, 3] = self.state[B, 1]
            new_state[T, 1] = self.state[L, 1]
            new_state[T, 3] = self.state[L, 3]
            new_state[B, 1] = self.state[R, 1]
            new_state[B, 3] = self.state[R, 3]
        # Front Counter-Clockwise
        if action == 1:
            new_state[F, 0] = self.state[F, 1]
            new_state[F, 1] = self.state[F, 3]
            new_state[F, 2] = self.state[F, 0]
            new_state[F, 3] = self.state[F, 2]
            new_state[R, 1] = self.state[B, 1]
            new_state[R, 3] = self.state[B, 3]
            new_state[L, 1] = self.state[T, 1]
            new_state[L, 3] = self.state[T, 3]
            new_state[T, 1] = self.state[R, 3]
            new_state[T, 3] = self.state[R, 1]
            new_state[B, 1] = self.state[L, 3]
            new_state[B, 3] = self.state[L, 1]
        # Back Clockwise
        if action == 2:
            new_state[B, 0] = self.state[B, 1]
            new_state[B, 1] = self.state[B, 3]
            new_state[B, 2] = self.state[B, 0]
            new_state[B, 3] = self.state[B, 2]
            new_state[R, 0] = self.state[B, 0]
            new_state[R, 2] = self.state[B, 2]
            new_state[L, 0] = self.state[T, 0]
            new_state[L, 2] = self.state[T, 2]
            new_state[T, 0] = self.state[R, 2]
            new_state[T, 2] = self.state[R, 0]
            new_state[B, 0] = self.state[L, 2]
            new_state[B, 2] = self.state[L, 0]
        # Back Counter-Clockwise
        if action == 3:
            new_state[B, 0] = self.state[B, 2]
            new_state[B, 1] = self.state[B, 0]
            new_state[B, 2] = self.state[B, 3]
            new_state[B, 3] = self.state[B, 1]
            new_state[R, 0] = self.state[T, 2]
            new_state[R, 2] = self.state[T, 0]
            new_state[L, 0] = self.state[B, 2]
            new_state[L, 2] = self.state[B, 0]
            new_state[T, 0] = self.state[L, 0]
            new_state[T, 2] = self.state[L, 2]
            new_state[B, 0] = self.state[R, 0]
            new_state[B, 2] = self.state[R, 2]
        # Right Clockwise
        if action == 4:
            new_state[F, 2] = self.state[B, 2]
            new_state[F, 3] = self.state[B, 3]
            new_state[B, 2] = self.state[T, 2]
            new_state[B, 3] = self.state[T, 3]
            new_state[R, 0] = self.state[R, 2]
            new_state[R, 1] = self.state[R, 0]
            new_state[R, 2] = self.state[R, 3]
            new_state[R, 3] = self.state[R, 1]
            new_state[T, 2] = self.state[F, 3]
            new_state[T, 3] = self.state[F, 2]
            new_state[B, 2] = self.state[B, 3]
            new_state[B, 3] = self.state[B, 2]
        # Right Counter-Clockwise
        if action == 5:
            new_state[F, 2] = self.state[T, 3]
            new_state[F, 3] = self.state[T, 2]
            new_state[B, 2] = self.state[B, 3]
            new_state[B, 3] = self.state[B, 2]
            new_state[R, 0] = self.state[R, 1]
            new_state[R, 1] = self.state[R, 3]
            new_state[R, 2] = self.state[R, 0]
            new_state[R, 3] = self.state[R, 2]
            new_state[T, 2] = self.state[B, 2]
            new_state[T, 3] = self.state[B, 3]
            new_state[B, 2] = self.state[F, 2]
            new_state[B, 3] = self.state[F, 3]
        # Left Clockwise
        if action == 6:
            new_state[F, 0] = self.state[T, 1]
            new_state[F, 1] = self.state[T, 0]
            new_state[B, 0] = self.state[B, 1]
            new_state[B, 1] = self.state[B, 0]
            new_state[L, 0] = self.state[L, 1]
            new_state[L, 1] = self.state[L, 3]
            new_state[L, 2] = self.state[L, 0]
            new_state[L, 3] = self.state[L, 2]
            new_state[T, 0] = self.state[B, 0]
            new_state[T, 1] = self.state[B, 1]
            new_state[B, 0] = self.state[F, 0]
            new_state[B, 1] = self.state[F, 1]
        # Left Counter-Clockwise
        if action == 7:
            new_state[F, 0] = self.state[B, 0]
            new_state[F, 1] = self.state[B, 1]
            new_state[B, 0] = self.state[T, 0]
            new_state[B, 1] = self.state[T, 1]
            new_state[L, 0] = self.state[L, 2]
            new_state[L, 1] = self.state[L, 0]
            new_state[L, 2] = self.state[L, 3]
            new_state[L, 3] = self.state[L, 1]
            new_state[T, 0] = self.state[F, 1]
            new_state[T, 1] = self.state[F, 0]
            new_state[B, 0] = self.state[B, 1]
            new_state[B, 1] = self.state[B, 0]
        # Top Clockwise
        if action == 8:
            new_state[F, 1] = self.state[R, 3]
            new_state[F, 3] = self.state[R, 2]
            new_state[B, 1] = self.state[L, 3]
            new_state[B, 3] = self.state[L, 2]
            new_state[R, 2] = self.state[B, 1]
            new_state[R, 3] = self.state[B, 3]
            new_state[L, 2] = self.state[F, 1]
            new_state[L, 3] = self.state[F, 3]
            new_state[T, 0] = self.state[T, 1]
            new_state[T, 1] = self.state[T, 3]
            new_state[T, 2] = self.state[T, 0]
            new_state[T, 3] = self.state[T, 2]
        # Up Counter-Clockwise
        if action == 9:
            new_state[F, 1] = self.state[L, 2]
            new_state[F, 3] = self.state[L, 3]
            new_state[B, 1] = self.state[R, 2]
            new_state[B, 3] = self.state[R, 3]
            new_state[R, 2] = self.state[F, 3]
            new_state[R, 3] = self.state[F, 1]
            new_state[L, 2] = self.state[B, 3]
            new_state[L, 3] = self.state[B, 1]
            new_state[T, 0] = self.state[T, 2]
            new_state[T, 1] = self.state[T, 0]
            new_state[T, 2] = self.state[T, 3]
            new_state[T, 3] = self.state[T, 1]
        # Bottom Clockwise
        if action == 10:
            new_state[F, 0] = self.state[L, 0]
            new_state[F, 2] = self.state[L, 1]
            new_state[B, 0] = self.state[R, 0]
            new_state[B, 2] = self.state[R, 1]
            new_state[R, 0] = self.state[F, 2]
            new_state[R, 1] = self.state[F, 0]
            new_state[L, 0] = self.state[B, 2]
            new_state[L, 1] = self.state[B, 0]
            new_state[B, 0] = self.state[B, 2]
            new_state[B, 1] = self.state[B, 0]
            new_state[B, 2] = self.state[B, 3]
            new_state[B, 3] = self.state[B, 1]
        # Down Counter-Clockwise
        if action == 11:
            new_state[F, 0] = self.state[R, 1]
            new_state[F, 2] = self.state[R, 0]
            new_state[B, 0] = self.state[L, 1]
            new_state[B, 2] = self.state[L, 0]
            new_state[R, 0] = self.state[B, 0]
            new_state[R, 1] = self.state[B, 2]
            new_state[L, 0] = self.state[F, 0]
            new_state[L, 1] = self.state[F, 2]
            new_state[B, 0] = self.state[B, 1]
            new_state[B, 1] = self.state[B, 3]
            new_state[B, 2] = self.state[B, 0]
            new_state[B, 3] = self.state[B, 2]

        self.state = new_state
        return self.state, 1 if self._is_solved() else -1, self._is_solved(), self.step_count >= 100, {}

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
            if np.mean(self.state[i]) != self.state[i][0]:
                return False
        return True
