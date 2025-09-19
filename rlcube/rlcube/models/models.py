import torch.nn as nn
import torch.nn.functional as F
import torch
from tensordict import TensorDict
from rlcube.envs.cube2 import Cube2
import numpy as np


class Reward(nn.Module):
    def __init__(self):
        super(Reward, self).__init__()

    def forward(self, batch_obs):
        one_indices = batch_obs.argmax(dim=2)
        # (batch, 24) -> (batch, 6, 4), 6 faces, 4 stickers
        face_indices = one_indices.view(batch_obs.shape[0], 6, 4)
        # (batch, 6), For each face, check if all stickers have the same index, i.e. compare with the first sticker
        face_solved = (face_indices == face_indices[:, :, 0:1]).all(dim=2)  #
        # (batch,), For each batch, check if all faces are solved
        solved = face_solved.all(dim=1)
        return torch.where(
            solved,
            torch.tensor(1, device=batch_obs.device, dtype=batch_obs.dtype),
            torch.tensor(-1, device=batch_obs.device, dtype=batch_obs.dtype),
        )


class ResidualBlock(nn.Module):
    def __init__(self, dim, hidden_dim):
        super().__init__()
        self.ln1 = nn.LayerNorm(dim)
        self.fc1 = nn.Linear(dim, hidden_dim)
        self.ln2 = nn.LayerNorm(hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, dim)

    def forward(self, x):
        residual = x
        out = self.fc1(F.relu(self.ln1(x)))
        out = self.fc2(F.relu(self.ln2(out)))
        out = out + residual
        return out


class DNN(nn.Module):
    def __init__(self, hidden_dim=512, num_residual_blocks=4):
        super().__init__()
        input_dim = 24 * 6
        self.fc_in = nn.Linear(input_dim, hidden_dim)

        self.residual_blocks = nn.ModuleList(
            [
                ResidualBlock(hidden_dim, hidden_dim * 2)
                for _ in range(num_residual_blocks)
            ]
        )

        # Value head
        self.fc_value = nn.Sequential(
            nn.Linear(hidden_dim, 64), nn.ReLU(), nn.Linear(64, 1)
        )
        # Policy head
        self.fc_policy = nn.Sequential(
            nn.Linear(hidden_dim, 64), nn.ReLU(), nn.Linear(64, 12)
        )

    def forward(self, x):
        batch_size = x.size(0)
        x = x.view(batch_size, -1)
        out = F.relu(self.fc_in(x))
        for block in self.residual_blocks:
            out = block(out)
        value = self.fc_value(out)
        policy = self.fc_policy(out)
        return TensorDict({"value": value, "policy": policy}, batch_size=batch_size)


if __name__ == "__main__":
    print("Testing RewardNet")
    env = Cube2()
    obs, _ = env.reset()
    obs1, _, _, _, _ = env.step(1)
    obs2, _, _, _, _ = env.step(2)
    x = torch.tensor(np.array([obs, obs1, obs2]))
    print("Input shape:", x.shape)
    print("Output:", Reward()(x))
    print()

    print("Testing ResidualBlock, input_dim=24, hidden_dim=128")
    x = torch.randn(4, 24, 6)
    print("Input shape:", x.shape)
    print("Output shape:", ResidualBlock(6, 128)(x).shape)
    print()

    print("Testing Cube2VNetwork, input_dim=24, num_residual_blocks=4")
    x = torch.randn(4, 24, 6)
    print("Input shape:", x.shape)
    net = DNN()
    y = net(x)
    print("Output value shape:", y["value"].shape)
    print("Output policy shape:", y["policy"].shape)
    print("Number of parameters:", sum(p.numel() for p in net.parameters()))
