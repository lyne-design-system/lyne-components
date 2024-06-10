FROM mcr.microsoft.com/playwright:v1.44.0-jammy

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive

COPY . .
