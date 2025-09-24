---
title: "Rubik's Cube Solver"
emoji: 🧊
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
---

## 🧊 Rubik's Cube Solver

Solve the Rubik's Cube using Reinforcement Learning! 🚀

https://github.com/user-attachments/assets/0f6cdf0c-37f5-4f7c-a367-c696e21ad4dc

## How it works

In this reinforcement learning approach to solving the Rubik’s Cube, we begin by training a neural network that learns both a value function and a policy function. The value function evaluates the quality of the current state, while the policy function guides the choice of the next move. To search for the optimal solution, we then apply Monte Carlo Tree Search (MCTS), which balances exploration and exploitation during decision-making.

Our overall algorithm design is inspired by the paper [Solving the Rubik’s Cube with Deep Reinforcement Learning and Search](https://arxiv.org/abs/1805.07470). However, we introduced a few simple modifications in the network component to better suit our implementation.

## 🏋️‍♂️ Train the Model

1. Navigate to the `rlcube` directory:
   ```
   cd rlcube
   ```
2. Install dependencies:
   ```
   uv sync
   ```
3. Activate the virtual environment:
   ```
   source .venv/bin/activate
   ```
4. Start training:
   ```
   python -m rlcube.train.train
   ```

After training, your model will be saved in the `models` folder.  
Please rename the trained file to `model_final.pth` so it can be used by the API. 🎯
