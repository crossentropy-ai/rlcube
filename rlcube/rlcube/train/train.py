from rlcube.models.dataset import Cube2Dataset


if __name__ == "__main__":
    dataset = Cube2Dataset(num_envs=10, num_steps=20)
    print(dataset[10])
