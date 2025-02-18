type BaseInput = {
  recipient: string;
}

export type UserMentionInput = BaseInput & {
  type: 'UserMentionNotification',
  incidentId: string;
  entryId: string;
}
