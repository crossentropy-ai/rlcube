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
        create_dataset(num_envs=1000, num_steps=20, filepath="dataset.pt")
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
    optimizer = torch.optim.RMSprop(net.parameters(), lr=0.00001)
    value_loss_fn = torch.nn.MSELoss(reduction="none")
    policy_loss_fn = torch.nn.CrossEntropyLoss(reduction="none")

    best_loss = float("inf")
    for epoch in range(epochs):
        epoch_loss = 0
        print(f"Training Epoch {epoch}")
        for batch in tqdm(dataloader):
            states, neighbors, D = batch
            states, neighbors, D = states.to(device), neighbors.to(device), D.to(device)

            values, policies = net(states)

            with torch.no_grad():
                batch_size = neighbors.shape[0]
                neighbors_reshaped = neighbors.view(-1, 24, 6)
                values_out, _ = net(neighbors_reshaped)
                rewards_out = reward(neighbors_reshaped)

                nvalues = values_out.view(batch_size, 12, -1)
                nrewards = rewards_out.view(batch_size, 12, -1)

                target_values, indices = (nvalues + nrewards).max(dim=1)
                target_values = target_values.detach()
                indices = indices.reshape(-1)
                weights = 1 / D.reshape(-1).detach()

            loss_v = value_loss_fn(values, target_values).reshape(-1) * weights
            loss_p = policy_loss_fn(policies, indices).reshape(-1) * weights
            loss = (0.2 * loss_v + 0.8 * loss_p).mean()
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
