import { QuickPickItem } from "vscode";

export const serverEndpointPlaceHolder = "Select the kdb type";
export const kdbEndpoint = "Enter a kdb endpoint";
export const kdbInsightsEndpoint = "Connect to kdb insights";

export const serverEndpoints: QuickPickItem[] = [
  {
    label: kdbEndpoint,
    detail: "Enter the url, ip address, and port to connect to a kdb instance",
  },
  {
    label: kdbInsightsEndpoint,
    detail: "Either the url for the kdb insights instance",
  },
];

export const connectionAliasInput = {
  prompt: "Enter a name/alias for the connection",
  placeholder: "server name / alias",
};

export const connectionHostnameInput = {
  prompt: "Enter the hostname or ip address of the kdb server",
  placeholder: "0.0.0.0",
};

export const connectionPortInput = {
  prompt: "Enter the port number of the kdb server",
  placeholder: "5001",
};

export const connectionUsernameInput = {
  prompt: "Enter username to authenticate with (optional)",
  placeholder: "username",
};

export const connectionPasswordInput = {
  prompt: "Enter password to authenticate with (optional)",
  placeholder: "password",
};
