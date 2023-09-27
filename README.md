# Frontend Onboarding Project
Welcome to the Frontend Onboarding Project! This project is designed to help you get up to speed with the technologies we use at KnightHacks.

## Getting Started
To get started, you'll need to install a few things. First, you'll need to install [Node.js](https://nodejs.org/en/). This will install Node Package Manager (npm) as well. Next, you'll need to install [Git](https://git-scm.com/) and pnpm. To install pnpm, run the following command:
```
npm install -g pnpm
```
Once you've installed these, you'll need to clone the repository. To do this, run the following command:
```
git clone https://github.com/KnightHacks/frontend_onboarding_project.git
```
Once you've cloned the repository, you'll need to install the dependencies of each project (frontend and backend). To do this, you'll need to change directories into each project and run the following command:
```
pnpm install
```

Next, you'll want to branch off of the main. This new branch should be named after you. To do this, run the following command:
```
git checkout -b <your_name_here>
```

## Running the Project
For this project, you'll need to run both the frontend and backend. To do this, you'll need to open two terminals. In the first terminal, you'll need to change directories into the frontend project and run the following command:
```
pnpm run dev
```
In the second terminal, you'll need to change directories into the backend project and run the same command.

## Project Structure
The project is split into two parts: the client and the server. The client is built using [React](https://react.dev/), a frontend framework. The backend is built using [Fastify](https://www.fastify.io/), a Node.js framework. For more information, see the README.md in each project's directory.

## Submitting Your Project
Once you've completed the project, you'll need to submit it. Assuming you've pushed your branch to the remote repository, you'll need to create a pull request with your branch as the source and main as the destination. Once you've done this, ping Caleb on Discord and he'll review your project.