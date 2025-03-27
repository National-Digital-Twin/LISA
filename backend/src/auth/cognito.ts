// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import {
  AttributeType,
  CognitoIdentityProviderClient,
  ListUsersInGroupCommand,
  UserType
} from '@aws-sdk/client-cognito-identity-provider';

import { UserList, UserListItem } from 'common/User';
import { settings } from '../settings';

let cognitoClient: CognitoIdentityProviderClient;

export function getCognitoClient() {
  if (!cognitoClient) {
    cognitoClient = new CognitoIdentityProviderClient({});
  }
  return cognitoClient;
}

function getAttribute(attributes: Array<AttributeType>, attr: string): string | undefined {
  for (const a of attributes) {
    if (a.Name === attr) {
      return a.Value;
    }
  }
  return undefined;
}

function getUserAttribute(u: UserType, attr: string): string | undefined {
  return getAttribute(u.Attributes, attr);
}

function cognitoUserToUserListItem(cognitoUser: UserType) {
  return {
    username: cognitoUser.Username,
    displayName: getUserAttribute(cognitoUser, 'name')
  } satisfies UserListItem;
}

export async function getUsers(): Promise<UserList> {
  const client = getCognitoClient();

  const command = new ListUsersInGroupCommand({
    UserPoolId: settings.COGNITO_USER_POOL_ID,
    GroupName: settings.COGNITO_USER_GROUP_NAME
  });

  const resp = await client.send(command);
  return resp.Users?.map(cognitoUserToUserListItem);
}
