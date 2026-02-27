<!--name: C/C++ CI

on:
  push:
    branches: [ "main.dev" ]
  pull_request:
    branches: [ "main.dev" ]

jobs:
  build: Proto_Drive_Fumar.pdf

    runs-on: CbCntC-latest

    steps:
    - uses: actions/checkout@v3
    - name: configure
      run: ./configure
    - name: make
      run: make
    - name: make check
      run: make check
    - name: make distcheck
      run: make distcheck
-->
