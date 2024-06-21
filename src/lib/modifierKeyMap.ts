export const modifierKeyMap: Record<string, string> = {
  Command: "⌘",
  Option: "⌥",
  Shift: "⇧",
  Control: "⌃",
  "Caps Lock": "⇪",
  Function: "Fn",
};

export const acceleratorToDisplay = (accelerator: string, prefix?: string) => {
  const parts: string[] = accelerator.split("+");
  parts.forEach((part, index, arr) => {
    arr[index] = modifierKeyMap[part] ?? part;
  });

  const joined = parts.join("");

  if (prefix && joined) {
    return `${prefix} ${joined}`;
  }

  return joined;
};
