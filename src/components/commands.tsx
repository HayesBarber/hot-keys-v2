import { FooterButton, FooterMain } from "./footer";
import {
  Command as CommandComponent,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./command";
import useFocus from "@/hooks/useFocus";
import { useGlobalState } from "@/hooks/useGlobalState";
import ClientCommand from "@/lib/clientCommand";
import Ipc from "@/lib/ipc";
import { acceleratorToDisplay } from "@/lib/modifierKeyMap";
import { HorizontalDivider } from "./divider";
import useSearchInput from "@/hooks/useSearchInput";

const Commands: React.FC = () => {
  const inputRef = useFocus();
  const { commands, setCommands, toggleUi, pathMode, setPathMode } =
    useGlobalState();

  const onCommandSelected = (command: ClientCommand) => {
    Ipc.commandSelected(command);
  };

  return (
    <div className="window">
      <CommandComponent className="outline-none focus:outline-none flex flex-col grow">
        <CommandInput
          ref={inputRef}
          placeholder="Search..."
          onValueChange={(value) =>
            useSearchInput(value, pathMode, setPathMode, setCommands)
          }
        />
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandList className="grow">
          <CommandsList
            commands={commands}
            onCommandSelected={onCommandSelected}
            pathMode={pathMode}
          />
        </CommandList>
      </CommandComponent>
      <FooterMain>
        <div className="flex items-center">
          <FooterButton onClick={() => Ipc.hide()}>
            Show/Hide
            {acceleratorToDisplay(toggleUi, ":")}
          </FooterButton>
          <HorizontalDivider />
          <FooterButton onClick={() => Ipc.quit()}>Quit: ⌘Q</FooterButton>
        </div>
      </FooterMain>
    </div>
  );
};

const CommandsList: React.FC<{
  commands: ClientCommand[];
  onCommandSelected: (command: ClientCommand) => void;
  pathMode: boolean;
}> = ({ commands, onCommandSelected, pathMode }) => {
  return (
    <div>
      <CommandGroup heading={pathMode ? "Paths" : "Hot-Keys"}>
        {commands.length ? (
          commands.map((command, i) => (
            <CommandListItem
              key={i}
              command={command}
              onSelect={onCommandSelected}
            />
          ))
        ) : (
          <div />
        )}
      </CommandGroup>
    </div>
  );
};

const CommandListItem: React.FC<{
  command: ClientCommand;
  onSelect: (command: ClientCommand) => void;
}> = ({ command, onSelect }) => {
  const shortCut = acceleratorToDisplay(command.hotKey);

  return (
    <CommandItem value={command.displayName} onSelect={() => onSelect(command)}>
      <span>{command.displayName}</span>
      {shortCut.length ? (
        <CommandShortcut>{shortCut}</CommandShortcut>
      ) : (
        <div />
      )}
    </CommandItem>
  );
};

export default Commands;
