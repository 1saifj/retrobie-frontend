## Code for [Retrobie](https://retrobie.com)

## Project Setup

Before proceeding to setup the project, it is recommended to first of all install `nvm` and use it
to manage your node versions. The project has an `.nvmrc` file that specifies the supported version
of node to use.

- Clone the project locally and checkout to the `development` branch
- Run `nvm use` to ensure you use the correct version of node.
  - _Optionally, you can set nvm to autorun `nvm use` in each folder with a `.nvmrc` file._
    [Read more here](https://github.com/nvm-sh/nvm#deeper-shell-integration)
- Run `npm install` to install all project dependencies
- By default, the project runs on `development`, and thus requires a locally hosted backend, but if
  you need to ping the staging backend, you can set `REACT_APP_ENV=staging` in your `.env` file.
- You can now run the application by running `npm run start`

## Testing

- [ ] TODO

## Styling

- [ ] TODO

## Deployment

- The app is automatically deployed to Vercel.
- [ ] TODO
