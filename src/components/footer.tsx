import { PropsWithChildren } from "react";
import { Button } from "./button";
import { CommandShortcut } from "./command";

export const FooterMain: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex justify-between items-center border-t border-accent h-[45px] bg-background">
      {children}
    </div>
  );
};

export const FooterButton: React.FC<
  PropsWithChildren<{ onClick: () => void }>
> = ({ onClick, children }) => {
  return (
    <Button variant="ghost" onClick={onClick}>
      <CommandShortcut className="flex items-center">
        {children}
      </CommandShortcut>
    </Button>
  );
};
