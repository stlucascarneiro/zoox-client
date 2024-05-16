# Documentação do Frontend - Sistema de Gerenciamento de Clientes
Este documento descreve a arquitetura e as tecnologias utilizadas no frontend da aplicação de Sistema de Gerenciamento de Clientes, incluindo o framework Vue.js e o framework de componentes PrimeVue.

## Tecnologias Utilizadas

###### Vue.js
Vue.js é um framework progressivo para a construção de interfaces de usuário. Ele é leve, flexível e possui uma curva de aprendizado suave.

- **Reatividade**: Sistema de reatividade que permite atualizar automaticamente a interface de usuário quando os dados mudam.
- **Componentização**: Promove a construção de interfaces de usuário por meio de componentes reutilizáveis e independentes.
- **Diretivas**: Oferece um conjunto de diretivas incorporadas que permitem adicionar comportamentos dinâmicos à interface de usuário.
- **Vue Router**: Um roteador oficial para Vue.js que permite a criação de aplicativos de página única (SPAs) com navegação baseada em rotas.

###### Primevue

PrimeVue é um framework de componentes UI para Vue.js, construído com base no PrimeFaces, um framework popular para JavaServer Faces (JSF). Ele fornece uma ampla variedade de componentes prontos para uso, como botões, tabelas, formulários, etc., facilitando o desenvolvimento de interfaces de usuário ricas e responsivas.

## Instalação
```
yarn install
```

### Iniciando aplicação

```
yarn serve
```

### Preparação para deploy
```
yarn build
```