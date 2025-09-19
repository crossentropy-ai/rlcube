from rlcube.models.dataset import Cube2Dataset
from rlcube.envs.cube2 import Cube2
import numpy as np
from tqdm import tqdm


def train(epochs: int = 100):
    dataset = Cube2Dataset()
    for _ in tqdm(range(epochs)):
        pass


if __name__ == "__main__":
    train()
