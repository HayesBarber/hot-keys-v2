# Hot-Keys ![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/hayesbarber/hot-keys-v2/total)

Hot Keys is a lightweight productivity tool that lets you map keyboard shortcuts to CLI commands. It features a Spotlight-style UI for quickly searching and executing commands.

- Map keyboard shortcuts to CLI commands.
- Search and execute commands with a Spotlight-like UI.
- Start typing ~ or / to input a path, which is passed to a `onPathSelected` command.

<p align="center">
  <img src="src/assets/ui-image.png" alt="UI" height="275px"/>
</p>

## Quick Start

Download and install the latest release.

Hot-Keys will read from a `hot-keys.json` file in your **_home directory_**.

Whenever you edit your `hot-keys.json`, you will need to restart the app for the changes to take effect.

The `theme` field is for the UI-Theme. Options are `light` and `dark`.

The `toggleUI` field is for the showing and hiding the UI.

The `onPathSelected` field is a command that will run when a path is selected, replacing occurrences of `$PATH` with the selected path. Your home directory will act as the base for this feature.

The `commands` field is an array of objects. The `hotKey` field is optional if you do not want to take up a keyboard shortcut, and is represented by a combination of keys separated by the '+' symbol.

I did not have much luck finding tauri documentation for valid key combos, but here seems to be the code to parse an accelerator: https://docs.rs/tao/0.16.9/src/tao/accelerator.rs.html#309

```json
{
  "theme": "light",
  "toggleUI": "Option+Space",
  "onPathSelected": "code -n \"$PATH\"",
  "commands": [
    {
      "hotKey": "Option+Command+P",
      "command": "code -n",
      "displayName": "Open new VSCode window"
    },
    {
      "hotKey": "Option+Command+I",
      "command": "osascript -e 'quit app \"safari.app\"'",
      "displayName": "Close Safari"
    },
    {
      "command": "code ~/hot-keys.json",
      "displayName": "Open hot-keys.json"
    }
  ]
}
```

## Built with

- [**Tauri**](https://tauri.app)
- [**Vite**](https://vitejs.dev)
- [**React**](https://react.dev)
- [**shadcn/ui**](https://ui.shadcn.com)
- [**cmdk**](https://github.com/pacocoursey/cmdk)
- [**tailwindcss**](https://tailwindcss.com)
- [**Geist Font**](https://github.com/vercel/geist-font/blob/main/LICENSE.txt)
