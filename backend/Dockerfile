FROM oven/bun:1

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

RUN bunx prisma generate

EXPOSE 3001

CMD ["bun", "src/index.ts"]