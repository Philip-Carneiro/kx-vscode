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

/* eslint @typescript-eslint/no-explicit-any: 0 */

import "../fixtures";
import * as assert from "assert";
import * as sinon from "sinon";
import { DataSourceMessage } from "../../src/models/messages";
import { MetaObjectPayload } from "../../src/models/meta";
import {
  createAgg,
  createDefaultDataSourceFile,
  createFilter,
  createGroup,
  createLabel,
  createSort,
} from "../../src/models/dataSource";
import { KdbDataSourceView } from "../../src/webview/components/kdbDataSourceView";

describe("KdbDataSourceView", () => {
  let view: KdbDataSourceView;

  beforeEach(async () => {
    view = new KdbDataSourceView();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("connectedCallback", () => {
    it("should add message event listener", () => {
      let cb: any;
      sinon
        .stub(global.window, "addEventListener")
        .value((event: string, listener: any) => {
          if (event === "message") {
            cb = listener;
          }
        });
      view.connectedCallback();
      const dataSourceFile = createDefaultDataSourceFile();
      dataSourceFile.dataSource.api.optional = {
        filled: false,
        temporal: false,
        startTS: "",
        endTS: "",
        filters: [],
        labels: [],
        sorts: [],
        aggs: [],
        groups: [],
      };
      const message: DataSourceMessage = {
        isInsights: true,
        insightsMeta: <MetaObjectPayload>{
          dap: {},
        },
        dataSourceName: "test",
        dataSourceFile,
      };
      const event = {
        data: message,
      };
      cb(event);
      const data = view["data"];
      assert.deepEqual(data, {
        ...dataSourceFile,
        name: "test",
        originalName: "test",
      });
    });
  });

  describe("disconnectedCallback", () => {
    it("should remove message event listener", () => {
      let result = false;
      sinon
        .stub(global.window, "removeEventListener")
        .value((event: string) => {
          if (event === "message") {
            result = true;
          }
        });
      view.disconnectedCallback();
      assert.strictEqual(result, true);
    });
  });

  describe("selectTab", () => {
    it("should return the selected tab", () => {
      sinon.stub(view, "selectedType").value("DEFAULT");
      assert.strictEqual(view["selectedTab"], "tab-1");
      sinon.stub(view, "selectedType").value("API");
      assert.strictEqual(view["selectedTab"], "tab-1");
      sinon.stub(view, "selectedType").value("QSQL");
      assert.strictEqual(view["selectedTab"], "tab-2");
      sinon.stub(view, "selectedType").value("SQL");
      assert.strictEqual(view["selectedTab"], "tab-3");
    });
  });

  describe("save", () => {
    it("should post a message", () => {
      let result: any;
      const api = acquireVsCodeApi();
      sinon.stub(api, "postMessage").value(({ command, data }) => {
        if (command === "kdb.dataSource.saveDataSource") {
          result = data;
        }
      });
      view["save"]();
      assert.ok(result);
    });
  });

  describe("run", () => {
    it("should post a message", () => {
      let result: any;
      const api = acquireVsCodeApi();
      sinon.stub(api, "postMessage").value(({ command, data }) => {
        if (command === "kdb.dataSource.runDataSource") {
          result = data;
        }
      });
      view["run"]();
      assert.ok(result);
    });
  });

  describe("populateScratchpad", () => {
    it("should post a message", () => {
      let result: any;
      const api = acquireVsCodeApi();
      sinon.stub(api, "postMessage").value(({ command, data }) => {
        if (command === "kdb.dataSource.populateScratchpad") {
          result = data;
        }
      });
      view["populateScratchpad"]();
      assert.ok(result);
    });
  });

  describe("renderApiOptions", () => {
    it("should render empty array", () => {
      const result = view["renderApiOptions"]("");
      assert.deepEqual(result, []);
    });

    it("should render getData api", () => {
      sinon.stub(view, "isInsights").value(true);
      sinon.stub(view, "isMetaLoaded").value(true);
      sinon
        .stub(view, "insightsMeta")
        .value({ api: [{ api: ".kxi.getData" }] });
      const result = view["renderApiOptions"]("getData");
      assert.deepEqual(result[0].values, ["getData", true, "getData"]);
    });

    it("should render other api", () => {
      sinon.stub(view, "isInsights").value(true);
      sinon.stub(view, "isMetaLoaded").value(true);
      sinon.stub(view, "insightsMeta").value({ api: [{ api: "other" }] });
      const result = view["renderApiOptions"]("other");
      assert.deepEqual(result[0].values, ["other", true, "other"]);
    });
  });

  describe("renderTableOptions", () => {
    it("should render empty array", () => {
      const result = view["renderTableOptions"]("");
      assert.deepEqual(result, []);
    });

    it("should render table", () => {
      sinon.stub(view, "isInsights").value(true);
      sinon.stub(view, "isMetaLoaded").value(true);
      sinon
        .stub(view, "insightsMeta")
        .value({ assembly: [{ tbls: ["table"] }] });
      const result = view["renderTableOptions"]("table");
      assert.deepEqual(result[0].values, ["table", true, "table"]);
    });
  });

  describe("renderColumnOptions", () => {
    it("should render empty array", () => {
      const result = view["renderColumnOptions"]({ column: "" });
      assert.deepEqual(result, []);
    });

    it("should render columns for selected table", () => {
      const provider = { column: "" };
      sinon.stub(view, "isInsights").value(true);
      sinon.stub(view, "isMetaLoaded").value(true);
      sinon.stub(view, "selectedTable").value("table");
      sinon
        .stub(view, "insightsMeta")
        .value({ schema: [{ table: "table", columns: [{ column: "id" }] }] });
      const result = view["renderColumnOptions"](provider);
      assert.strictEqual(provider.column, "id");
      assert.deepEqual(result[0].values, ["id", true, "id"]);
    });
  });

  describe("renderTargetOptions", () => {
    it("should render empty array", () => {
      const result = view["renderTargetOptions"]("");
      assert.deepEqual(result, []);
    });

    it("should render targets", () => {
      sinon.stub(view, "isInsights").value(true);
      sinon.stub(view, "isMetaLoaded").value(true);
      sinon
        .stub(view, "insightsMeta")
        .value({ dap: [{ assembly: "assembly", instance: "instance" }] });
      const result = view["renderTargetOptions"]("assembly-qe instance");
      assert.deepEqual(result[0].values, [
        "assembly-qe instance",
        true,
        "assembly-qe instance",
      ]);
    });
  });

  describe("renderFilter", () => {
    it("should render filter", () => {
      const filter = createFilter();
      const result = view["renderFilter"](filter);
      assert.ok(result.values);
    });
  });

  describe("renderLabel", () => {
    it("should render label", () => {
      const label = createLabel();
      const result = view["renderLabel"](label);
      assert.ok(result.values);
    });
  });

  describe("renderSort", () => {
    it("should render sort", () => {
      const sort = createSort();
      const result = view["renderSort"](sort);
      assert.ok(result.values);
    });
  });

  describe("renderAgg", () => {
    it("should render agg", () => {
      const agg = createAgg();
      const result = view["renderAgg"](agg);
      assert.ok(result.values);
    });
  });

  describe("renderGroup", () => {
    it("should render group", () => {
      const group = createGroup();
      const result = view["renderGroup"](group);
      assert.ok(result.values);
    });
  });

  describe("render", () => {
    it("should update state for name input", () => {
      const result = view["render"]();
      (result.values[1] as any)({ target: { value: "datatsource-test" } });
      assert.strictEqual(view.name, "datatsource-test");
    });

    it("should update state for tab selection", () => {
      const result = view["render"]();
      (result.values[3] as any)();
      assert.strictEqual(view.selectedType, "API");
      (result.values[4] as any)();
      assert.strictEqual(view.selectedType, "QSQL");
      (result.values[5] as any)();
      assert.strictEqual(view.selectedType, "SQL");
    });
  });
});