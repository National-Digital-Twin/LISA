import { createCommand, LexicalCommand } from "lexical";

export const RECORD_COMMAND: LexicalCommand<boolean> = createCommand(
  'RECORD_COMMAND'
);