import gymnasium as gym
from .envs.cube2 import Cube2
from stable_baselines3 import DQN

class RewardWrapper(gym.Wrapper):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def step(self, action):
        obs, reward, terminated, truncated, _ = super().step(action)
        return obs, reward, terminated, truncated, _


def train():
    env = Cube2()
    env = RewardWrapper(env)

    model = DQN("MlpPolicy", env, verbose=1)
    model.learn(total_timesteps=10000, log_interval=10)

    env.close()
