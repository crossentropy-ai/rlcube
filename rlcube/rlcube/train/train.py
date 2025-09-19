from rlcube.models.dataset import Cube2Dataset, create_dataset
from rlcube.models.models import Reward, DNN
from tqdm import tqdm
from torch.utils.data import DataLoader
import torch
import os

if torch.backends.mps.is_available():
    device = torch.device("mps")
elif torch.cuda.is_available():
    device = torch.device("cuda")
else:
    device = torch.device("cpu")

print(f"Using device: {device}")


def train(epochs: int = 100):
    if not os.path.exists("dataset.pt"):
        create_dataset(num_envs=10000, num_steps=20, filepath="dataset.pt")
    dataset = Cube2Dataset("dataset.pt")
    print("Number of samples:", len(dataset))
    print("Number of epochs:", epochs)
    print()

    dataloader = DataLoader(dataset, batch_size=1024, shuffle=True)
    reward = Reward().to(device)
    net = DNN()
    if os.path.exists("models/model_best.pth"):
        net.load("models/model_best.pth")
    net = net.to(device)
    optimizer = torch.optim.RMSprop(net.parameters(), lr=0.0001)
    value_loss_fn = torch.nn.MSELoss()
    policy_loss_fn = torch.nn.CrossEntropyLoss()

    best_loss = float("inf")
    for epoch in range(epochs):
        epoch_loss = 0
        print(f"Training Epoch {epoch}")
        for batch in tqdm(dataloader):
            states, neighbors, D = batch
            states, neighbors, D = states.to(device), neighbors.to(device), D.to(device)

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
        epoch_loss /= len(dataloader)
        if epoch_loss < best_loss:
            best_loss = epoch_loss
            print(f"Saving model at epoch {epoch}")
            net.save("models/model_best.pth")
        print(f"Epoch {epoch} loss: {epoch_loss}")


if __name__ == "__main__":
    train()
