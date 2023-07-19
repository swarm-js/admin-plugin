![Version](https://img.shields.io/npm/v/@swarmjs/admin) ![Downloads](https://img.shields.io/npm/dm/@swarmjs/admin) ![License](https://img.shields.io/github/license/swarm-js/admin) ![Build](https://img.shields.io/github/actions/workflow/status/swarm-js/admin/build.yml?branch=main)
<br/>

<p align="center">
  <a href="https://github.com/swarm-js/admin">
    <img src="images/logo.png" alt="Logo" width="120" height="120">
  </a>

  <h3 align="center">@swarmjs/admin</h3>

  <p align="center">
    Admin plugin for SwarmJS.
    <br/>
    <br/>
      <a href="https://swarmjs.com"><strong>Explore the docs »</strong></a>
    <br/>
    <br/>
  </p>
</p>

## Table Of Contents

- [About the Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Adminors](#adminors)
- [Acknowledgements](#acknowledgements)

## About The Project

The Admin plugin will generate an admin panel, easily parametrable.

## Built With

- TypeScript@4

## Getting Started

### Installation

```sh
yarn add @swarmjs/admin
```

or

```sh
npm install --save @swarmjs/admin
```

## Usage

```ts
import { Swarm } from '@swarmjs/core'
import { AdminPlugin } from '@swarmjs/admin'

// Create instance
const app = new Swarm()

// Use the plugin
app.use(AdminPlugin, {
  controllerName: 'AdminPlugin', // Customize controller name into your API
  access: null // Restricts access to logged users, based on SwarmJS ACL
})
```

## Roadmap

See the [open issues](https://github.com/swarm-js/admin/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

- If you have suggestions for adding or removing projects, feel free to [open an issue](https://github.com/swarm-js/admin/issues/new) to discuss it, or directly create a pull request after you edit the _README.md_ file with necessary changes.
- Please make sure you check your spelling and grammar.
- Create individual PR for each suggestion.
- Please also read through the [Code Of Conduct](https://github.com/swarm-js/admin/blob/main/CODE_OF_CONDUCT.md) before posting your first idea as well.

### Creating A Pull Request

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](https://github.com/swarm-js/admin/blob/main/LICENSE.md) for more information.

## Adminors

- [Guillaume Gagnaire](https://github.com/guillaume-gagnaire)