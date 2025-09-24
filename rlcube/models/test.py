from rlcube.envs.cube2 import Cube2Env
from rlcube.models.models import Reward
import torch

if __name__ == "__main__":
    print("Testing Reward")
    env = Cube2Env()
    adjacent_obs = torch.tensor(env.adjacent_obs())
    reward = Reward()(adjacent_obs)
    print("Reward:", reward)
    obs, _, _, _, _ = env.step(0)
    env1 = Cube2Env.from_obs(obs)
    adjacent_obs = env1.adjacent_obs()
    for i in range(12):
        env2 = Cube2Env.from_obs(adjacent_obs[i])
        env2.print_js_code()
        print(env2.is_solved())
