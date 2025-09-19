from rlcube.models.dataset import Cube2Dataset, create_dataset
from rlcube.models.models import Reward, DNN
from rlcube.envs.cube2 import Cube2
from tqdm import tqdm
from torch.utils.data import DataLoader
import numpy as np
import torch


def train(epochs: int = 100):
    # create_dataset(num_envs=10, num_steps=10, filepath="dataset_mini.pt")
    dataset = Cube2Dataset("dataset_mini.pt")
    print("Number of samples:", len(dataset))
    print("Number of epochs:", epochs)
    print()

    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)
    reward = Reward()
    net = DNN()
    optimizer = torch.optim.RMSprop(net.parameters(), lr=0.0001)
    value_loss_fn = torch.nn.MSELoss()
    policy_loss_fn = torch.nn.CrossEntropyLoss()

    for _ in range(epochs):
        epoch_loss = 0
        for batch in dataloader:
            states, neighbors, D = batch

            net_out = net(states)
            values = net_out["value"]
            policies = net_out["policy"]

            batch_size = neighbors.shape[0]
            neighbors_reshaped = neighbors.view(-1, 24, 6)
            neighbors_out = net(neighbors_reshaped)
            rewards_out = reward(neighbors_reshaped)

            neighbors_values = neighbors_out["value"].view(batch_size, 12, -1)
            neighbors_rewards = rewards_out.view(batch_size, 12, -1)

            target_values, indices = (neighbors_values + neighbors_rewards).max(dim=1)
            indices = indices.reshape(-1)

            loss_v = value_loss_fn(values, target_values)
            loss_p = policy_loss_fn(policies, indices)
            loss = loss_v + loss_p
            epoch_loss += loss.item()
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
        print(f"Epoch {_} loss: {epoch_loss / len(dataloader)}")


if __name__ == "__main__":
    train()
