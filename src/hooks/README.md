# AfroMed - Custom Hooks

This directory contains custom React hooks used throughout the AfroMed Medical Dashboard.

## Available Hooks

### `useConfig`
Access and update global dashboard configuration (theme, font, preset color, etc.).

### `useLocalStorage`
Persist state to `localStorage` with automatic JSON serialization/deserialization.

## Usage

```tsx
import useConfig from 'hooks/useConfig';
import useLocalStorage from 'hooks/useLocalStorage';
```
