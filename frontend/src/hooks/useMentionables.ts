import { getSortedEntriesWithDisplaySequence } from '../utils/sortEntries';
import { Format } from '../utils';
import { type LogEntry } from 'common/LogEntry';
import { type Task } from 'common/Task';
import { type Mentionable } from 'common/Mentionable';
import { type User } from 'common/User';

type Props = {
  users?: Array<User>;
  logEntries?: Array<LogEntry>;
  files?: Array<File>;
  recordings?: Array<File>;
  tasks?: Array<Task>;
  other?: Array<Mentionable>;
};

export const calcMentionables = ({ users, logEntries, files, recordings, tasks, other }: Props) => {
  return [
    ...(getSortedEntriesWithDisplaySequence(false, logEntries ?? [])?.map((e) =>
      Format.mentionable.entry(e)
    ) ?? []),
    ...(users
      ?.filter((user) => user.displayName)
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
      .map(Format.mentionable.user) ?? []),
    ...(files?.map((file) => Format.mentionable.attachment({ name: file.name, type: 'File' })) ??
      []),
    ...(recordings?.map((file) =>
      Format.mentionable.attachment({ name: file.name, type: 'File' })
    ) ?? []),

    ...(tasks?.map(Format.mentionable.task) ?? []),
    ...(other ?? [])
  ];
};
