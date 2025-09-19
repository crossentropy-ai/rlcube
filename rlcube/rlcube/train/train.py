import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from rlcube.envs.cube2 import Cube2


def generate_train_data(num_envs: int = 1000, num_steps: int = 20):
    for _ in range(num_envs):
        env = Cube2()
        obs, _ = env.reset()
        
        print(obs)
        break


if __name__ == "__main__":
    generate_train_data()
