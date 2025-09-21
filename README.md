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
