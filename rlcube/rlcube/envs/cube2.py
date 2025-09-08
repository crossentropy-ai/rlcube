from random import shuffle
import gymnasium as gym
import numpy as np

F = 0
B = 1
R = 2
L = 3
U = 4
D = 5

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
        self.state[4] = np.ones(4) * U
        self.state[5] = np.ones(4) * D
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
            new_state[F, 0] = self.state[F, 2]
            new_state[F, 1] = self.state[F, 0]
            new_state[F, 2] = self.state[F, 3]
            new_state[F, 3] = self.state[F, 1]
            new_state[R, 1] = self.state[U, 3]
            new_state[R, 3] = self.state[U, 1]
            new_state[L, 1] = self.state[D, 3]
            new_state[L, 3] = self.state[D, 1]
            new_state[U, 1] = self.state[L, 1]
            new_state[U, 3] = self.state[L, 3]
            new_state[D, 1] = self.state[R, 1]
            new_state[D, 3] = self.state[R, 3]
        # Front Counter-Clockwise
        elif action == 1:
            new_state[F, 0] = self.state[F, 1]
            new_state[F, 1] = self.state[F, 3]
            new_state[F, 2] = self.state[F, 0]
            new_state[F, 3] = self.state[F, 2]
            new_state[R, 1] = self.state[D, 1]
            new_state[R, 3] = self.state[D, 3]
            new_state[L, 1] = self.state[U, 1]
            new_state[L, 3] = self.state[U, 3]
            new_state[U, 1] = self.state[R, 3]
            new_state[U, 3] = self.state[R, 1]
            new_state[D, 1] = self.state[L, 3]
            new_state[D, 3] = self.state[L, 1]
        # Back Clockwise
        elif action == 2:
            new_state[B, 0] = self.state[B, 1]
            new_state[B, 1] = self.state[B, 3]
            new_state[B, 2] = self.state[B, 0]
            new_state[B, 3] = self.state[B, 2]
            new_state[R, 0] = self.state[D, 0]
            new_state[R, 2] = self.state[D, 2]
            new_state[L, 0] = self.state[U, 0]
            new_state[L, 2] = self.state[U, 2]
            new_state[U, 0] = self.state[R, 2]
            new_state[U, 2] = self.state[R, 0]
            new_state[D, 0] = self.state[L, 2]
            new_state[D, 2] = self.state[L, 0]
        # Back Counter-Clockwise
        elif action == 3:
            new_state[B, 0] = self.state[B, 2]
            new_state[B, 1] = self.state[B, 0]
            new_state[B, 2] = self.state[B, 3]
            new_state[B, 3] = self.state[B, 1]
            new_state[R, 0] = self.state[U, 2]
            new_state[R, 2] = self.state[U, 0]
            new_state[L, 0] = self.state[D, 2]
            new_state[L, 2] = self.state[D, 0]
            new_state[U, 0] = self.state[L, 0]
            new_state[U, 2] = self.state[L, 2]
            new_state[D, 0] = self.state[R, 0]
            new_state[D, 2] = self.state[R, 2]
        # Right Clockwise
        elif action == 4:
            new_state[F, 2] = self.state[D, 2]
            new_state[F, 3] = self.state[D, 3]
            new_state[B, 2] = self.state[U, 2]
            new_state[B, 3] = self.state[U, 3]
            new_state[R, 0] = self.state[R, 2]
            new_state[R, 1] = self.state[R, 0]
            new_state[R, 2] = self.state[R, 3]
            new_state[R, 3] = self.state[R, 1]
            new_state[U, 2] = self.state[F, 3]
            new_state[U, 3] = self.state[F, 2]
            new_state[D, 2] = self.state[B, 3]
            new_state[D, 3] = self.state[B, 2]
        # Right Counter-Clockwise
        elif action == 5:
            new_state[F, 2] = self.state[U, 3]
            new_state[F, 3] = self.state[U, 2]
            new_state[B, 2] = self.state[D, 3]
            new_state[B, 3] = self.state[D, 2]
            new_state[R, 0] = self.state[R, 1]
            new_state[R, 1] = self.state[R, 3]
            new_state[R, 2] = self.state[R, 0]
            new_state[R, 3] = self.state[R, 2]
            new_state[U, 2] = self.state[B, 2]
            new_state[U, 3] = self.state[B, 3]
            new_state[D, 2] = self.state[F, 2]
            new_state[D, 3] = self.state[F, 3]
        # Left Clockwise
        elif action == 6:
            new_state[F, 0] = self.state[U, 1]
            new_state[F, 1] = self.state[U, 0]
            new_state[B, 0] = self.state[D, 1]
            new_state[B, 1] = self.state[D, 0]
            new_state[L, 0] = self.state[L, 1]
            new_state[L, 1] = self.state[L, 3]
            new_state[L, 2] = self.state[L, 0]
            new_state[L, 3] = self.state[L, 2]
            new_state[U, 0] = self.state[B, 0]
            new_state[U, 1] = self.state[B, 1]
            new_state[D, 0] = self.state[F, 0]
            new_state[D, 1] = self.state[F, 1]
        # Left Counter-Clockwise
        elif action == 7:
            new_state[F, 0] = self.state[D, 0]
            new_state[F, 1] = self.state[D, 1]
            new_state[B, 0] = self.state[U, 0]
            new_state[B, 1] = self.state[U, 1]
            new_state[L, 0] = self.state[L, 2]
            new_state[L, 1] = self.state[L, 0]
            new_state[L, 2] = self.state[L, 3]
            new_state[L, 3] = self.state[L, 1]
            new_state[U, 0] = self.state[F, 1]
            new_state[U, 1] = self.state[F, 0]
            new_state[D, 0] = self.state[B, 1]
            new_state[D, 1] = self.state[B, 0]
        # Up Clockwise
        elif action == 8:
            new_state[F, 1] = self.state[R, 3]
            new_state[F, 3] = self.state[R, 2]
            new_state[B, 1] = self.state[L, 3]
            new_state[B, 3] = self.state[L, 2]
            new_state[R, 2] = self.state[B, 1]
            new_state[R, 3] = self.state[B, 3]
            new_state[L, 2] = self.state[F, 1]
            new_state[L, 3] = self.state[F, 3]
            new_state[U, 0] = self.state[U, 1]
            new_state[U, 1] = self.state[U, 3]
            new_state[U, 2] = self.state[U, 0]
            new_state[U, 3] = self.state[U, 2]
        # Up Counter-Clockwise
        elif action == 9:
            new_state[F, 1] = self.state[L, 2]
            new_state[F, 3] = self.state[L, 3]
            new_state[B, 1] = self.state[R, 2]
            new_state[B, 3] = self.state[R, 3]
            new_state[R, 2] = self.state[F, 3]
            new_state[R, 3] = self.state[F, 1]
            new_state[L, 2] = self.state[B, 3]
            new_state[L, 3] = self.state[B, 1]
            new_state[U, 0] = self.state[U, 2]
            new_state[U, 1] = self.state[U, 0]
            new_state[U, 2] = self.state[U, 3]
            new_state[U, 3] = self.state[U, 1]
        # Bottom Clockwise
        elif action == 10:
            new_state[F, 0] = self.state[L, 0]
            new_state[F, 2] = self.state[L, 1]
            new_state[B, 0] = self.state[R, 0]
            new_state[B, 2] = self.state[R, 1]
            new_state[R, 0] = self.state[F, 2]
            new_state[R, 1] = self.state[F, 0]
            new_state[L, 0] = self.state[B, 2]
            new_state[L, 1] = self.state[B, 0]
            new_state[D, 0] = self.state[D, 2]
            new_state[D, 1] = self.state[D, 0]
            new_state[D, 2] = self.state[D, 3]
            new_state[D, 3] = self.state[D, 1]
        # Bottom Counter-Clockwise
        elif action == 11:
            new_state[F, 0] = self.state[R, 1]
            new_state[F, 2] = self.state[R, 0]
            new_state[B, 0] = self.state[L, 1]
            new_state[B, 2] = self.state[L, 0]
            new_state[R, 0] = self.state[B, 0]
            new_state[R, 1] = self.state[B, 2]
            new_state[L, 0] = self.state[F, 0]
            new_state[L, 1] = self.state[F, 2]
            new_state[D, 0] = self.state[D, 1]
            new_state[D, 1] = self.state[D, 3]
            new_state[D, 2] = self.state[D, 0]
            new_state[D, 3] = self.state[D, 2]
        self.state = new_state
        return self._get_obs(), 1 if self._is_solved() else -1, self._is_solved(), self.step_count >= 100, {}

    def _get_obs(self):
        one_hots = []
        for i in range(6):
            for j in range(4):
                label = int(self.state[i, j])
                zeros = np.zeros(6)
                zeros[label] = 1
                one_hots.append(zeros)
        return np.array(one_hots)
    
    def _is_solved(self):
        for i in range(6):
            if np.mean(self.state[i]) != self.state[i][0]:
                return False
        return True
