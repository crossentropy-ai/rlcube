from torch.utils.data import Dataset
from rlcube.envs.cube2 import Cube2
import numpy as np
import torch
from tqdm import tqdm


def create_dataset(
    num_envs: int = 10000, num_steps: int = 50, filepath: str = "dataset.pt"
):
    states = []
    neighbors = []
    D = []
    for _ in tqdm(range(num_envs)):
        env = Cube2()
        obs, _ = env.reset()
        for _ in range(num_steps):
            action = env.action_space.sample()
            obs, _, _, _, _ = env.step(action)
            states.append(obs)
            neighbors.append(env.neighbors())
            D.append(env.step_count)
    states = np.array(states)
    neighbors = np.array(neighbors)
    D = np.array(D)
    dataseet = {
        "states": torch.tensor(states, dtype=torch.float32),
        "neighbors": torch.tensor(neighbors, dtype=torch.float32),
        "D": torch.tensor(D, dtype=torch.float32),
    }
    torch.save(dataseet, filepath)


class Cube2Dataset(Dataset):
    def __init__(self, filepath: str = "dataset.pt"):
        self.dataset = torch.load(filepath)
        self.states = self.dataset["states"]
        self.neighbors = self.dataset["neighbors"]
        self.D = self.dataset["D"]

    def __len__(self):
        return len(self.states)

    def __getitem__(self, idx):
        return self.states[idx], self.neighbors[idx], self.D[idx]
