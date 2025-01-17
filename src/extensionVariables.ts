/*
 * Copyright (c) 1998-2023 Kx Systems Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import {
  ExtensionContext,
  extensions,
  languages,
  OutputChannel,
  StatusBarItem,
  TextEditor,
} from "vscode";
import { LanguageClient } from "vscode-languageclient/node";
import { LocalProcess } from "./models/localProcess";
import { MetaObjectPayload } from "./models/meta";
import { QueryHistory } from "./models/queryHistory";
import { ServerObject } from "./models/serverObject";
import {
  InsightsNode,
  KdbNode,
  KdbTreeProvider,
} from "./services/kdbTreeProvider";
import { QueryHistoryProvider } from "./services/queryHistoryProvider";
import { KdbResultsViewProvider } from "./services/resultsPanelProvider";
import AuthSettings from "./utils/secretStorage";
import { WorkspaceTreeProvider } from "./services/workspaceTreeProvider";
import { ScratchpadFile } from "./models/scratchpad";
import { LocalConnection } from "./classes/localConnection";
import { InsightsConnection } from "./classes/insightsConnection";
import { DataSourceFiles } from "./models/dataSource";
import { ConnectionLabel, LabelColors, Labels } from "./models/labels";
import { kdbAuthMap } from "./models/connectionsModels";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ext {
  export let activeTextEditor: TextEditor | undefined;
  export let context: ExtensionContext;
  export let outputChannel: OutputChannel;
  export let consolePanel: OutputChannel;
  export let serverProvider: KdbTreeProvider;
  export let queryHistoryProvider: QueryHistoryProvider;
  export let resultsViewProvider: KdbResultsViewProvider;
  export let isResultsTabVisible: boolean;
  export let scratchpadTreeProvider: WorkspaceTreeProvider;
  export let dataSourceTreeProvider: WorkspaceTreeProvider;
  export let runScratchpadItem: StatusBarItem;
  export const activeScratchPadList: Array<ScratchpadFile> = [];
  export const connectedScratchPadList: Array<ScratchpadFile> = [];
  export const activeDatasourceList: Array<DataSourceFiles> = [];
  export const connectedDatasourceList: Array<DataSourceFiles> = [];
  export let serverObjects: ServerObject;
  export let openSslVersion: string | null;
  export let resultPanelCSV: string;
  export let isDatasourceExecution: boolean;
  export let isBundleQCreated: boolean;
  export const rowLimit = 150000000;

  export let activeConnection: LocalConnection | InsightsConnection | undefined;
  export const connectedConnectionList: Array<
    LocalConnection | InsightsConnection
  > = [];
  export const connectedContextStrings: Array<string> = [];
  export const connectionsList: Array<KdbNode | InsightsNode> = [];
  export let hideDetailedConsoleQueryOutput: boolean;
  export let networkChangesWatcher: boolean;
  export let insightsHydrate: boolean;
  export let connectionNode: KdbNode | InsightsNode | undefined;
  export const kdbDataSourceFolder = ".kdb-datasources";
  export const kdbDataSourceFileExtension = ".ds";
  export const kdbDataSourceFileGlob = "*.ds";
  export let oldDSformatExists: boolean;
  export const kdbDataSourceRootNodes: string[] = [];
  export const kdbQueryHistoryNodes: string[] = [];
  export const kdbQueryHistoryList: QueryHistory[] = [];
  export const kdbAuthMap: kdbAuthMap[] = [];
  export const kdbrootNodes: string[] = [];
  export const kdbinsightsNodes: string[] = [];
  export const kdbNodesWithoutAuth: string[] = [];
  export const kdbNodesWithoutTls: string[] = [];
  export const kdbConnectionAliasList: string[] = [];
  export const connLabelList: Labels[] = [];
  export const labelConnMapList: ConnectionLabel[] = [];
  export const latestLblsChanged: string[] = [];
  export const maxRetryCount = 5;

  export let secretSettings: AuthSettings;

  export function getRuntimePath(): string {
    return "C:\\Users\\caleteet\\Downloads\\w64\\w64\\q.exe";
  }

  export const localProcessObjects: LocalProcess = {};
  // eslint-disable-next-line prefer-const
  export let localConnectionContexts: Array<string> = [];
  // eslint-disable-next-line prefer-const
  export let localConnectionStatus: Array<string> = [];

  export const kdbLicName = "kc.lic";
  export const kdbInstallUrl =
    "https://kx.com/kdb-insights-personal-edition-license-download/?utm_source=Referral&utm_medium=Vs%20Code&utm_campaign=&utm_content=Free-Trial%20(Kx%20Insights)&utm_campaignid=7018e000000Y9fSAAS";
  export const kdbDownloadPrefixUrl =
    "https://nexus.dl.kx.com/repository/kdb/4.0/";

  export const kdbNewsletterUrl =
    "https://kx.com/landing_pages/subscribe-to-our-kdb-vs-code-extension-newsletter";

  export const kxdevUrl =
    "https://downloads.kx.com/dl/index.php/9OeP-W7XAT7WtsH-I9lzPDKWiHw_oA8fK90mHgvuprPYhwcapsU1LNfQSoHOFinKpsgQ3VM5PWf7KjCpNgP9EqL_HvnorJxm0-ihvNzk2_rREPf8R1S1-Dt_Lz5uwxOhEWEcEO3PlFgY0dqsqt0Yd1cLLKhbKykjxKTR82XF1W6_ODzkJ0k3SNW4vt6xUkpdetckxbLdD1sUVYz1M0cMsAWsUWodLUpXcEi7ssuWfvvO-p8O2M-c-rAy9e8kz1ylEmh7OsWmX5-Zz8N1cvUyMQF54x3LEEFTpaJi96ZvmnjRMOSfkREHYVYsfzHM6XBALxVxxljdcmk6ttxqPEDuZUXQf6gdpjEeN5XPqrcv-zqKZhJ6A-PO6A1beCh5qlfJ3EyJFpdPBm0xnh8vCCENZ9BMGjAXUs8HQ7fukxWVRKX_sKLFeFFFKVsUJUJrgqop518iojQnKlx7QZnvArd0KA";

  export let client: LanguageClient;

  const extensionId = "kx.kdb";
  const packageJSON = extensions.getExtension(extensionId)!.packageJSON;
  export const extensionName = packageJSON.name;
  export const extensionVersion = packageJSON.version;
  export const extensionKey = packageJSON.aiKey;

  export const localhost = "127.0.0.1";
  export const networkProtocols = {
    http: "http://",
    https: "https://",
  };

  export const insightsFileResponse = {
    css: "",
    path: "",
  };

  export const insightsAuthUrls = {
    authURL: "auth/realms/insights/protocol/openid-connect/auth ",
    revoke: "auth/realms/insights/protocol/openid-connect/revoke",
    tokenURL: "auth/realms/insights/protocol/openid-connect/token",
    scratchpadURL: "servicebroker/scratchpad/display",
    configURL: "kxicontroller/config",
  };

  export const insightsScratchpadUrls = {
    import: "servicebroker/scratchpad/import/data",
    importSql: "servicebroker/scratchpad/import/sql",
    importQsql: "servicebroker/scratchpad/import/qsql",
    reset: "servicebroker/scratchpad/reset",
  };

  export const insightsServiceGatewayUrls = {
    meta: "servicegateway/meta",
    data: "servicegateway/data",
    sql: "servicegateway/qe/sql",
    qsql: "servicegateway/qe/qsql",
    ping: "servicegateway/kxi/ping",
  };

  export const insightsGrantType = {
    authorizationCode: "authorization_code",
    refreshToken: "refresh_token",
  };

  export const insightsMeta = <MetaObjectPayload>{};

  export const insightsSigningIn = "Signing in";

  export const globalStateKeys = {
    insightsCredentialsCacheKey: "InsightsCache",
  };

  export const functions: Array<string> = [];
  export const variables: Array<string> = [];
  export const tables: Array<string> = [];
  // eslint-disable-next-line prefer-const
  export let keywords: Array<string> = [];

  export const qObjectCategories = [
    "Dictionaries",
    "Functions",
    "Tables",
    "Variables",
    "Views",
    "Namespaces",
  ];

  export const qNamespaceFilters = [".q", ".Q", ".h", ".z", ".o", ".j", ".m"];

  export const constants = {
    names: [
      "",
      "boolean",
      "guid",
      "",
      "byte",
      "short",
      "int",
      "long",
      "real",
      "float",
      "char",
      "symbol",
      "timestamp",
      "month",
      "date",
      "datetime",
      "timespan",
      "minute",
      "second",
      "time",
      "symbol",
    ],
    types: [
      "",
      "b",
      "g",
      "",
      "",
      "h",
      "i",
      "j",
      "e",
      "f",
      "c",
      "s",
      "p",
      "m",
      "d",
      "z",
      "n",
      "u",
      "v",
      "t",
      "s",
    ],
    listSeparator: [
      ";",
      "",
      " ",
      "",
      "",
      " ",
      " ",
      " ",
      " ",
      " ",
      "",
      "",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
    ],
    listPrefix: [
      "(",
      "",
      "",
      "",
      "0x",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    listSuffix: [
      ")",
      "b",
      "",
      "",
      "",
      "h",
      "i",
      "",
      "e",
      "f",
      "",
      "",
      "",
      "m",
      "",
      "",
      "",
      "",
      "",
      "",
    ],

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    base: new Date(2000, 0) as any,
    days: 1000 * 60 * 60 * 24,
    hours: 1000 * 60 * 60,
    minutes: 1000 * 60,
    seconds: 1000,
  };

  export const diagnosticCollection =
    languages.createDiagnosticCollection("kdb");

  export const labelColors: LabelColors[] = [
    {
      name: "White",
      colorHex: "#FFFFFF",
    },
    {
      name: "Red",
      colorHex: "#CD3131",
    },
    {
      name: "Green",
      colorHex: "#10BC7A",
    },
    {
      name: "Yellow",
      colorHex: "#E5E50E",
    },
    {
      name: "Blue",
      colorHex: "#2371C8",
    },
    {
      name: "Magenta",
      colorHex: "#BC3FBC",
    },
    {
      name: "Cyan",
      colorHex: "#15A7CD",
    },
  ];
}
