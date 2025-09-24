from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import HTTPException
from rlcube.envs.cube2 import Cube2Env
from rlcube.models.search import MonteCarloTree
import numpy as np

app = FastAPI()


class StateArgs(BaseModel):
    state: List[List[int]]


@app.post("/solve")
def solve(body: StateArgs):
    state = body.state
    if not (
        isinstance(state, list)
        and len(state) == 6
        and all(isinstance(row, list) and len(row) == 4 for row in state)
    ):
        raise HTTPException(status_code=400, detail="state must be a 6x4 matrix")

    env = Cube2Env()
    env.reset(state=np.array(state, dtype=np.int8))
    tree = MonteCarloTree(env.obs(), max_simulations=256)
    if tree.is_solved:
        return {"steps": [action for _, action in tree.solved_path]}
    raise HTTPException(status_code=422, detail="Unable to solve the cube")
