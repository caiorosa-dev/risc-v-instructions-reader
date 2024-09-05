# Instructions Reader

## Overview

The Instructions Reader is a TypeScript project designed to read and analyze machine instruction sets from text files. It classifies instructions based on their type (e.g., ALU, JUMP, BRANCH, MEMORY), parses them into a structured format, and displays statistics about the types of instructions encountered.

## Features

- Reads instruction sets from `.txt` files within a specified directory.
- Parses hexadecimal instruction strings into binary and categorizes them.
- Outputs a statistical summary and detailed table of instructions to the console.

## Prerequisites

- Node.js (Download from [Node.js official website](https://nodejs.org/))

## Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory in your terminal.
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Run the project with:

```bash
npm run start
```

This command reads instruction sets from the `./input` directory and outputs results to the console.

## Project Structure

- `src/app.ts`: Main entry point
- `src/config.ts`: Configuration settings
- `src/types/`: TypeScript type definitions
- `src/utils/`: Utility functions for parsing and conversion

## Dependencies

- `ts-node-dev`: For running TypeScript files in Node.js
- `console-table-printer`: For formatting console output

For more details, refer to the source files in the project.
