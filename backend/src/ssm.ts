import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const ssmClient = new SSMClient();

export async function getParameter(name: string, decrypt = false): Promise<string|undefined> {
  const params = {
    Name: name,
    WithDecryption: decrypt
  };

  const command = new GetParameterCommand(params);
  const data = await ssmClient.send(command);
  return data.Parameter.Value;
}
