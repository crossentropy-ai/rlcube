FROM ghcr.io/crossentropy-ai/runtime:latest

WORKDIR /app

# Install dependencies
COPY ./package.json ./bun.lock ./
COPY ./rlcube/pyproject.toml ./rlcube/uv.lock ./rlcube/
RUN bun install && cd rlcube && uv sync --frozen --no-dev --no-cache

COPY . .

RUN bun run build
EXPOSE 3000

CMD ["bun", "run", "start"]
