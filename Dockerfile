FROM ghcr.io/crossentropy-ai/runtime:latest

WORKDIR /app

COPY . .

USER root
RUN chown -R ubuntu:ubuntu /app

USER ubuntu
RUN bun install && cd rlcube && uv sync --frozen --no-dev --no-cache
RUN bun run build

EXPOSE 7860

CMD ["bun", "run", "start"]
