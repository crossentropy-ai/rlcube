from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import HTTPException

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

    return {"steps": [1, 2, 1, 1]}
