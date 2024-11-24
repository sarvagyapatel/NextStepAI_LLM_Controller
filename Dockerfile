FROM node:22

WORKDIR /app

COPY . .

RUN curl -fsSL https://ollama.com/install.sh | sh

EXPOSE 3000

RUN npm install

CMD [ "npm", "run", "dev" ]