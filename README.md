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

This project relies on [Bulma](https://bulma.io/documentation/) for base components,
styling, responsiveness, etc, and [Bloomer](bloomer.js.org/)
to provide the React abstractions.

It also includes a `src/assets/global.scss` file where global styles
are defined and imported.

### Colours
Colours are generally defined as global variables in `global.scss`
and should not be hard-coded in individual components.

For instance:
```css
:root {
    --color-primary: #f40028;
    --color-error: #ea0021;
    --color-text: #2B292D;
    --color-border-gray: #CBCBD6;
}
```

- [ ] TODO

## Deployment

`development`, `master` and every new branch are deployed automatically
to (Vercel)[https://vercel.com/retrobie].

### sitemap.xml
Before each deployment, a script (`src/utils/generate-sitemap.js`)
is run to generate a sitemap.

It reads a list of all routes from `src/routes/routes.json`. 

While it's not ideal to have different files defining our routes 
(i.e. `routes.json`, `routes.jsx`), it's currently the easiest way 
(without dealing with Babel complications) to keep the sitemap
up-to-date.

For that reason, it's important to add any new (non-dynamic)
routes to `routes.json`

- [ ] TODO
