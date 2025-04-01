# Mykanban Frontned

This repo represents frontend of mykanban

## Build

If you want to build it - consider using [monorepo](https://github.com/KustelR/kanbanmono), it will take mere minutes and you will have full working app with backend and database.
Alternatively build it as normal npm project.

1. Specify environment variables:

    ```env
        NEXT_PUBLIC_PROJECT_HOST=your.api.host # Api url
    ```

2. Run npm as usual:

    1. Install dependencies

        ```bash
        npm install
        ```

    2. Run project:

        ```bash
            npm run build
            npm run start
        ```
  
        or else run it in dev mode:

        ```bash
            npm run dev
        ```
