from torch.utils.data import Dataset
from rlcube.envs.cube2 import Cube2
import numpy as np


class Cube2Dataset(Dataset):
    def __init__(self, num_envs: int = 1000, num_steps: int = 20):
        self.num_envs = num_envs
        self.num_steps = num_steps
        self.states = []
        self.D = []
        for _ in range(num_envs):
            env = Cube2()
            obs, _ = env.reset()
            for _ in range(num_steps):
                action = env.action_space.sample()
                obs, _, _, _, _ = env.step(action)
                self.states.append(obs)
                self.D.append(env.step_count)
        self.states = np.array(self.states)
        self.D = np.array(self.D)

    def __len__(self):
        return len(self.states)

    def __getitem__(self, idx):
        return self.states[idx], self.D[idx]
