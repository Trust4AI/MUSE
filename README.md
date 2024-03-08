## Trust4AI Bias Generator Component based on the use of LLMs

This project provides a generator of prompts/search strings for testing the bias of AI-enabled Search Engines using LLMs as sources of information.

## Index

1. [Usage](#usage)
2. [Deployment](#deployment)
   1. [Local deployment](#local-deployment)
   2. [Docker deployment](#docker-deployment)
3. [Repository structure](#repository-structure)
4. [License and funding](#license-and-funding)


## Usage

<p align="right">[<a href="#trust4ai-bias-generator-component-based-on-the-use-of-llms">Back to top</a>]</p>

## Deployment

### Local deployment

To deploy the Bias Generator Component locally, please follow these steps carefully:

1. Prepare the necessary environment variables:
    1. Rename the `.env.local` file to `.env`.
    2. Depending on the model you want to use for generation, you will have to follow specific steps:
        1. For the use of **ChatGPT**, fill in the `.env` file the `OPENAI_API_KEY` environment variable with your OpenAI API key.

            ```.env
            PORT=8000
            GENERATOR_MODEL=ChatGPT
            OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
            NODE_ENV=local
            ```
        2. For the use of **GEMMA**, fill in the `.env` file the `GENERATOR_MODEL` environment variable with `gemma` value. In case you want to use a deployed GEMMA instance, add the `GEMMA_HOST` environment variable with the host of the GEMMA instance, otherwise, leave it empty.

            ```.env
            PORT=8000
            GENERATOR_MODEL=gemma
            GEMMA_HOST=<GEMMA_HOST>
            OPENAI_API_KEY=
            NODE_ENV=local
            ```

2. (If applicable) To use **GEMMA** as local generator model, you need to execute the following Docker Compose instruction to deploy a instance:

    ```bash
    docker-compose up gemma -d
    ```

3. Install the component dependencies:
    1. Ensure you have [Node.js](https://nodejs.org/en/download) installed on your system (version 16.x or newer is recommended). You can check your Node.js version by running `node -v` in your terminal.
    2. Navigate to the `src` directory and install the required dependencies:

        ```bash
        cd src
        npm install
        ```

4. Compile the source code and start the server:

    ```bash
    npm run build
    npm start
    ```

5. To verify that the Bias Generator Component is running, you can check the status of the server by running the following command:

    ```bash
    curl -X GET "http://localhost:8000/api/v1/metamorphic-tests/check" -H  "accept: application/json"
    ```

6. Finally, you can access the API documentation by visiting the following URL in your web browser:

    ```
    http://localhost:8000/api/v1/metamorphic-tests/docs
    ```

### Docker deployment

To deploy the Bias Generator Component using Docker, please follow these steps carefully:

1. Prepare the necessary environment variables:
    1. Rename the `.env.docker` file to `.env`.
    2. Depending on the model you want to use for generation, you will have to follow specific steps:
        1. For the use of **ChatGPT**, fill in the `.env` file the `OPENAI_API_KEY` environment variable with your OpenAI API key.

            ```.env
            PORT=8000
            GENERATOR_MODEL=ChatGPT
            OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
            NODE_ENV=docker
            ```
        2. For the use of **GEMMA**, fill in the `.env` file the `GENERATOR_MODEL` environment variable with `gemma` value. In case you want to use a deployed GEMMA instance, fill in the `.env` file the `GEMMA_HOST` environment variable with the host of the GEMMA instance, otherwise, leave it empty.

            ```.env
            PORT=8000
            GENERATOR_MODEL=gemma
            GEMMA_HOST=<GEMMA_HOST>
            OPENAI_API_KEY=
            NODE_ENV=docker
            ```

2. Depending on the model you want to use for generation, the command to execute to launch the component may vary.

    1. If you want to use **GEMMA** as local generator model, you need to execute the following Docker Compose instruction:

    ```bash
    docker-compose up server gemma -d
    ```

    2. Otherwise, if you want to use **ChatGPT** as generator model, you need to execute the following Docker Compose instruction:

    ```bash
    docker-compose up server -d
    ```

3. To verify that the Bias Generator Component is running, you can check the status of the server by running the following command:

    ```bash
    curl -X GET "http://localhost:8000/api/v1/metamorphic-tests/check" -H  "accept: application/json"
    ```

4. Finally, you can access the API documentation by visiting the following URL in your web browser:

    ```
    http://localhost:8000/api/v1/metamorphic-tests/docs
    ```

<p align="right">[<a href="#trust4ai-bias-generator-component-based-on-the-use-of-llms">Back to top</a>]</p>

## Repository structure

This repository is structured as follows:

- `docs/openapi/spec.yaml`: This file is used to describe the entire API, including available endpoints, operations on each endpoint, operation parameters, and the structure of the response objects. It's written in YAML format following the [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) (OAS).
- `docs/postman/collection.json`: This file is a collection of API requests saved in JSON format for use with Postman.
-  `src/`: This directory contains the source code for the project.
-  `.dockerignore`: This file tells Docker which files and directories to ignore when building an image.
-  `.gitignore`: This file is used by Git to exclude files and directories from version control.
-  `Dockerfile`: This file is a script containing a series of instructions and commands used to build a Docker image.
-  `docker-compose.yml`: This YAML file allows you to configure application services, networks, and volumes in a single file, facilitating the orchestration of containers.

<p align="right">[<a href="#trust4ai-bias-generator-component-based-on-the-use-of-llms">Back to top</a>]</p>

## License and funding

[Trust4AI](https://trust4ai.github.io/trust4ai/) is licensed under the terms of the GPL-3.0 license.

Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or European Commission. Neither the European Union nor the granting authority can be held responsible for them. Funded within the framework of the [NGI Search project](https://www.ngisearch.eu/) under grant agreement No 101069364.

<p align="center">
<img src="https://github.com/Trust4AI/trust4ai/blob/main/funding_logos/NGI_Search-rgb_Plan-de-travail-1-2048x410.png" width="400">
<img src="https://github.com/Trust4AI/trust4ai/blob/main/funding_logos/EU_funding_logo.png" width="200">
</p>
