from collections import defaultdict
import torch
from rlcube.models.models import DNN
from rlcube.envs.cube2 import Cube2Env
from tqdm import tqdm

net = DNN()
net.load("models/model_final.pth")
net.eval()


class Node:
    def __init__(self, obs, parent=None):
        self.obs = torch.tensor(obs, dtype=torch.float32)
        self.parent = parent

        value, policy = net(self.obs.unsqueeze(0))
        value = value.detach()
        policy = torch.softmax(policy.detach(), dim=1)

        self.is_solved = Cube2Env.from_obs(obs).is_solved()
        self.value = torch.tensor(1) if self.is_solved else value.view(-1)
        self.policy = policy.view(-1)

        self.children = defaultdict(lambda: None)
        self.N = defaultdict(lambda: 0)
        self.W = defaultdict(lambda: 0)

    def is_leaf(self):
        return len(self.children) == 0

    def u(self):
        c = 1.414
        n_sum = torch.sum(torch.tensor([self.N[action] for action in range(12)]))
        u = torch.tensor(
            [
                c
                * self.policy[action].item()
                * torch.sqrt(n_sum)
                / (self.N[action] + 1)
                + self.W[action]
                for action in range(12)
            ]
        )
        return u

    def select_action(self):
        return torch.argmax(self.u()).item()


class MonteCarloTree:
    def __init__(self, obs, max_simulations=300):
        self.obs = obs
        self.max_simulations = max_simulations
        self.root = Node(obs)
        self.nodes = [self.root]
        self.is_solved = False
        self.solved_path = []
        self._build()

    def _build(self):
        for _ in tqdm(range(self.max_simulations)):
            if self.is_solved:
                break

            node = self.root
            path = []

            # Selection
            while not node.is_leaf():
                action = node.select_action()
                path.append((node, action))
                node = node.children[action]

            # Expansion
            env = Cube2Env.from_obs(node.obs)
            adjacent_obs = env.adjacent_obs()
            for i in range(12):
                obs = adjacent_obs[i]
                child = Node(obs, node)
                node.children[i] = child
                self.nodes.append(child)
                self.is_solved = self.is_solved or child.is_solved
                if child.is_solved:
                    self.solved_path = path + [(node, i)]

            # Backup
            for parent, action in reversed(path):
                parent.N[action] += 1
                parent.W[action] = max(parent.W[action], node.value)


if __name__ == "__main__":
    env = Cube2Env()
    for _ in range(3):
        env.step(env.action_space.sample())
    tree = MonteCarloTree(env.obs())
    print(tree.is_solved)
