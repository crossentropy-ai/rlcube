from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import HTTPException
from rlcube.envs.cube2 import Cube2
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

    env = Cube2()
    env.reset(state=np.array(state, dtype=np.int8))

    steps = []
    for _ in range(10):
        action = env.action_space.sample()
        steps.append(action.item())

    return {"steps": steps}
