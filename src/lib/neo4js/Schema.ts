import { session } from ".";
import { NextFunction } from "express";
import { SchemaProperties, ISchema, SchemaTypeOpts } from "neo4js";

export class Schema implements ISchema {
  properties: SchemaProperties;
  afterHooks: Map<string, NextFunction>;
  preHooks: Map<string, NextFunction>;
  indexed: boolean = false;
  indexes: Array<string> = [];
  uniqueProps: Array<string> = [];
  requiredProps: Array<string> = [];

  constructor(properties: SchemaProperties) {
    this.preHooks = new Map<string, NextFunction>();
    this.afterHooks = new Map<string, NextFunction>();
    this.properties = properties;

    for (const key in properties) {
      const propDef = <SchemaTypeOpts>properties[key];

      if (propDef.unique) {
        this.uniqueProps.push(key);
      }

      // Unique properties are inheritly single-property indexes.
      if (propDef.index && !propDef.unique) {
        this.indexes.push(key);
      }

      if (propDef.required) {
        this.requiredProps.push(key);
      }
    }

    this.indexed = this.indexes.length > 0;
  }

  pre(name: string, callback: NextFunction) {
    this.preHooks.set(name, callback);
  }

  after(name: string, callback: NextFunction) {
    this.afterHooks.set(name, callback);
  }
}
