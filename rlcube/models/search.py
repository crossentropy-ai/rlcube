import torch
from rlcube.models.models import DNN
from rlcube.envs.cube2 import Cube2Env
from tqdm import tqdm
import numpy as np

ACTIONS = 12
C_PUCT = 1.414
VIRTUAL_LOSS = 0.0

net = DNN()
net.load("checkpoints/checkpoint_final.pth")
net.eval()


class Node:
    def __init__(self, obs, parent=None):
        self.obs = torch.tensor(obs, dtype=torch.float32)
        self.parent = parent

        with torch.no_grad():
            value, policy_logits = net(self.obs.unsqueeze(0))
        self.is_solved = Cube2Env.from_obs(obs).is_solved()
        self.value = 1.0 if self.is_solved else float(value.item())
        policy = torch.softmax(policy_logits, dim=1).view(-1)
        self.policy = np.array([float(policy[i].item()) for i in range(ACTIONS)])

        self.children = {}
        self.N = np.zeros(ACTIONS, dtype=np.int32)
        self.W = np.zeros(ACTIONS, dtype=np.float32)  # max value seen (not average)
        self.L = np.zeros(ACTIONS, dtype=np.float32)  # virtual loss (for async)

    def is_leaf(self):
        return len(self.children) == 0

    def u(self):
        n_sum = np.sum(self.N) + 1
        scores = self.policy * C_PUCT * np.sqrt(n_sum) / (self.N + 1) + self.W - self.L
        return scores

    def select_action(self):
        scores = self.u()
        return np.argmax(scores).item()


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
                a = node.select_action()
                path.append((node, a))
                if VIRTUAL_LOSS:
                    node.L[a] += VIRTUAL_LOSS
                node = node.children[a]

            # Expansion
            env = Cube2Env.from_obs(node.obs)
            adjacent_obs = env.adjacent_obs()
            for i in range(ACTIONS):
                child = Node(adjacent_obs[i], node)
                node.children[i] = child
                self.nodes.append(child)
                if child.is_solved:
                    self.is_solved = True
                    self.solved_path = path + [(node, i)]
            if not path:
                best = np.argmax(node.policy)
                node.N[best] += 1
                node.W[best] = max(node.W[best], float(node.children[best].value))

            # Backup
            leaf_value = float(node.value)
            for parent, a in reversed(path):
                parent.N[a] += 1
                parent.W[a] = max(parent.W[a], leaf_value)
                if VIRTUAL_LOSS:
                    parent.L[a] -= VIRTUAL_LOSS


if __name__ == "__main__":
    env = Cube2Env()
    for _ in range(3):
        env.step(env.action_space.sample())
    tree = MonteCarloTree(env.obs())
    print(tree.is_solved)
