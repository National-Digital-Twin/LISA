// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { createCommand, LexicalCommand } from "lexical";

export const RECORD_COMMAND: LexicalCommand<boolean> = createCommand(
  'RECORD_COMMAND'
);
