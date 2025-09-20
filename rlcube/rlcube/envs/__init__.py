from .cube2 import Cube2Env

__all__ = ["Cube2Env"]

if __name__ == "__main__":
    env = Cube2Env()
    env2 = Cube2Env.from_obs(env.obs())
    print(env2.state)
