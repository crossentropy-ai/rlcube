import lightning as L
import torch.nn as nn
import torch.nn.functional as F
import torch


class ResidualBlock(nn.Module):
    def __init__(self, input_dim, hidden_dim):
        super(ResidualBlock, self).__init__()
        self.bn1 = nn.BatchNorm1d(input_dim)
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.bn2 = nn.BatchNorm1d(hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, input_dim)

    def forward(self, x):
        residual = x
        out = self.bn1(x)
        out = F.relu(out)
        out = self.fc1(out)
        out = self.bn2(out)
        out = F.relu(out)
        out = self.fc2(out)
        out = out + residual
        return out


if __name__ == "__main__":
    print("Testing ResidualBlock, input_dim=24, hidden_dim=128")
    x = torch.randn(4, 24)
    print("Input shape:", x.shape)
    print("Output shape:", ResidualBlock(24, 128)(x).shape)
