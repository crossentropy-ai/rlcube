from .envs.cube2 import Cube2

def train():
    env = Cube2()

    obs, _ = env.reset()
    for i in range(4):
        # action = env.action_space.sample()
        obs, reward, terminated, truncated, _ = env.step(6)
        obs, reward, terminated, truncated, _ = env.step(7)
        print(obs)
        print("--------------------------------")
        if terminated or truncated:
            break

    env.close()