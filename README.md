# Project EdTech Evaluation - Team Echidna

<!-- ABOUT THE PROJECT -->
## About The Project
EdTech Evaluation provides consulting services to education providers (schools, colleges and state departments of education) in Australia and worldwide. Part of the services offered is a product review of Education Technology products (eg digital learning software) so that education providers can determine the quality of the EdTech products they are considering purchasing. The product review involves using an evaluation framework that comprises a set of questions that are answered regarding different aspects of the Edtech product. For each question there is a ranking score based on a rubric that gets applied.

Goals: This project involves creating a web based application that can be used by the consultant to apply the product review evaluation framework, Input the scores for each question and store the data. The system needs to generate a final report for each product evaluation. The data also need to be stored in a database for possible future analysis across product categories. 

Client: Mike Timms

### Built With
* [Node.js](https://nodejs.org/en/)
* [Vue.js](https://vuejs.org/)
* [BootstrapVue](https://bootstrap-vue.org/)
* [Firebase](https://firebase.google.com/)

### Architecture
* Authentication(register & login): src/components/Authentication
* Evaluation: src/components/Evaluation
* Framework: src/components/Framework
* Report: src/components/Report
* User(Dashboard & Profile): src/components/User
* UserManagement(Create user & User list): src/components/UserManagement
* Navigation: src/components/Top-Header.vue
* Testing: tests/

<!-- GETTING STARTED -->
## Getting Started

### Installation
1. Clone the repo
```sh
ssh://git@bitbucket.cis.unimelb.edu.au:7999/swen900142020eeechidna/swen90014-2020-ee-echidna.git
https://bitbucket.cis.unimelb.edu.au:8445/scm/swen900142020eeechidna/swen90014-2020-ee-echidna.git
```
2. Install NPM packages
```sh
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

<!-- USAGE EXAMPLES -->
## Usage


