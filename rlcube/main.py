from rlcube.envs.cube2 import Cube2

def main():
    env = Cube2()
    obs, _ = env.reset()
    print(obs)


if __name__ == "__main__":
    main()
