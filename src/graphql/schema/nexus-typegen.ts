/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */

import type * as prisma from "./../../../node_modules/.prisma/client/index"
import type { Context } from "./context"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  Address: prisma.Address;
  Assignment: prisma.Assignment;
  Claimant: prisma.Claimant;
  Mutation: {};
  Query: {};
  User: prisma.User;
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  Address: { // field return type
    address1: string | null; // String
    address2: string | null; // String
    assignment: NexusGenRootTypes['Assignment'] | null; // Assignment
    id: string | null; // String
    state: string | null; // String
    zipCode: string | null; // String
  }
  Assignment: { // field return type
    address: NexusGenRootTypes['Address'] | null; // Address
    assignedTo: NexusGenRootTypes['User'] | null; // User
    claimant: NexusGenRootTypes['Claimant'] | null; // Claimant
    claimantNoShow: boolean | null; // Boolean
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    createdBy: NexusGenRootTypes['User'] | null; // User
    id: string | null; // String
    isComplete: boolean | null; // Boolean
    translatorNoShow: boolean | null; // Boolean
  }
  Claimant: { // field return type
    assignment: NexusGenRootTypes['Assignment'] | null; // Assignment
    email: string | null; // String
    firstName: string | null; // String
    id: string | null; // String
    lastName: string | null; // String
  }
  Mutation: { // field return type
    createUser: NexusGenRootTypes['User']; // User!
  }
  Query: { // field return type
    ok: boolean; // Boolean!
  }
  User: { // field return type
    assignedTo: Array<NexusGenRootTypes['Assignment'] | null> | null; // [Assignment]
    assignments: Array<NexusGenRootTypes['Assignment'] | null> | null; // [Assignment]
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    email: string | null; // String
    firstName: string | null; // String
    id: string | null; // String
    isBanned: boolean | null; // Boolean
    isManager: boolean | null; // Boolean
    isTranslator: boolean | null; // Boolean
    lastName: string | null; // String
    phone: string | null; // String
    profilePic: string | null; // String
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
  }
}

export interface NexusGenFieldTypeNames {
  Address: { // field return type name
    address1: 'String'
    address2: 'String'
    assignment: 'Assignment'
    id: 'String'
    state: 'String'
    zipCode: 'String'
  }
  Assignment: { // field return type name
    address: 'Address'
    assignedTo: 'User'
    claimant: 'Claimant'
    claimantNoShow: 'Boolean'
    createdAt: 'DateTime'
    createdBy: 'User'
    id: 'String'
    isComplete: 'Boolean'
    translatorNoShow: 'Boolean'
  }
  Claimant: { // field return type name
    assignment: 'Assignment'
    email: 'String'
    firstName: 'String'
    id: 'String'
    lastName: 'String'
  }
  Mutation: { // field return type name
    createUser: 'User'
  }
  Query: { // field return type name
    ok: 'Boolean'
  }
  User: { // field return type name
    assignedTo: 'Assignment'
    assignments: 'Assignment'
    createdAt: 'DateTime'
    email: 'String'
    firstName: 'String'
    id: 'String'
    isBanned: 'Boolean'
    isManager: 'Boolean'
    isTranslator: 'Boolean'
    lastName: 'String'
    phone: 'String'
    profilePic: 'String'
    updatedAt: 'DateTime'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createUser: { // args
      firstName?: string | null; // String
      id: string; // String!
      isManager?: boolean | null; // Boolean
      isTranslator?: boolean | null; // Boolean
      lastName?: string | null; // String
      phone?: string | null; // String
      profilePic?: string | null; // String
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}