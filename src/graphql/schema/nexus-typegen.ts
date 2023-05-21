/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */

import type * as prisma from "./../../../node_modules/.prisma/client/index"
import type { Context } from "./context"
import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
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
  AddAndCreateTranslatorInput: { // input type
    email: string; // String!
    firstName: string; // String!
    languages?: string[] | null; // [String!]
    lastName?: string | null; // String
    phone: string; // String!
  }
  AddTranslatorInput: { // input type
    email: string; // String!
  }
  ByEmailInput: { // input type
    email: string; // String!
  }
  CompleteProfileInput: { // input type
    firstName: string; // String!
    isManager: boolean; // Boolean!
    isTranslator: boolean; // Boolean!
    languages?: string[] | null; // [String!]
    lastName: string; // String!
    phone: string; // String!
  }
  CreateAddressInput: { // input type
    address1: string; // String!
    address2?: string | null; // String
    city: string; // String!
    state: string; // String!
    zipCode: string; // String!
  }
  CreateAssignmentInput: { // input type
    email: string; // String!
  }
  CreateClaimantInput: { // input type
    email?: string | null; // String
    firstName: string; // String!
    languages?: string[] | null; // [String!]
    lastName: string; // String!
    phone: string; // String!
  }
  CreateUserInput: { // input type
    email: string; // String!
    firstName?: string | null; // String
    lastName?: string | null; // String
    phone?: string | null; // String
  }
  DisconnectTranslatorInput: { // input type
    email: string; // String!
  }
  PaginatedInput: { // input type
    countPerPage: number; // Int!
    page: number; // Int!
  }
  UpdateUserInput: { // input type
    email?: string | null; // String
    firstName?: string | null; // String
    isManager?: boolean | null; // Boolean
    isProfileComplete?: boolean | null; // Boolean
    isTranslator?: boolean | null; // Boolean
    languages?: string[] | null; // [String!]
    lastName?: string | null; // String
    phone?: string | null; // String
    profilePic?: string | null; // String
  }
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
  Translator: { // root type
    email?: string | null; // String
    firstName?: string | null; // String
    id?: string | null; // String
    languages?: string[] | null; // [String!]
    lastName?: string | null; // String
    phone?: string | null; // String
  }
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
    city: string | null; // String
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
    languages: Array<string | null> | null; // [String]
    lastName: string | null; // String
    phone: string | null; // String
  }
  Mutation: { // field return type
    addAndCreateTranslator: NexusGenRootTypes['User'] | null; // User
    addTranslator: NexusGenRootTypes['User'] | null; // User
    completeProfile: NexusGenRootTypes['User'] | null; // User
    createAddress: NexusGenRootTypes['Address']; // Address!
    createClaimant: NexusGenRootTypes['Claimant']; // Claimant!
    createUser: NexusGenRootTypes['User'] | null; // User
    disconnectTranslator: NexusGenRootTypes['User'] | null; // User
    login: NexusGenRootTypes['User']; // User!
    updateUser: NexusGenRootTypes['User'] | null; // User
  }
  Query: { // field return type
    getTranslator: NexusGenRootTypes['User']; // User!
    getTranslators: Array<NexusGenRootTypes['User'] | null>; // [User]!
    getUser: NexusGenRootTypes['User']; // User!
  }
  Translator: { // field return type
    email: string | null; // String
    firstName: string | null; // String
    id: string | null; // String
    languages: string[] | null; // [String!]
    lastName: string | null; // String
    phone: string | null; // String
  }
  User: { // field return type
    assignedTo: Array<NexusGenRootTypes['Assignment'] | null> | null; // [Assignment]
    assignments: Array<NexusGenRootTypes['Assignment'] | null> | null; // [Assignment]
    city: string | null; // String
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    email: string; // String!
    firstName: string | null; // String
    id: string; // String!
    isBanned: boolean | null; // Boolean
    isManager: boolean | null; // Boolean
    isProfileComplete: boolean | null; // Boolean
    isTranslator: boolean | null; // Boolean
    languages: Array<string | null> | null; // [String]
    lastName: string | null; // String
    phone: string | null; // String
    profilePic: string | null; // String
    state: string | null; // String
    translatingFor: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    translators: Array<NexusGenRootTypes['Translator'] | null> | null; // [Translator]
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
  }
}

export interface NexusGenFieldTypeNames {
  Address: { // field return type name
    address1: 'String'
    address2: 'String'
    assignment: 'Assignment'
    city: 'String'
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
    languages: 'String'
    lastName: 'String'
    phone: 'String'
  }
  Mutation: { // field return type name
    addAndCreateTranslator: 'User'
    addTranslator: 'User'
    completeProfile: 'User'
    createAddress: 'Address'
    createClaimant: 'Claimant'
    createUser: 'User'
    disconnectTranslator: 'User'
    login: 'User'
    updateUser: 'User'
  }
  Query: { // field return type name
    getTranslator: 'User'
    getTranslators: 'User'
    getUser: 'User'
  }
  Translator: { // field return type name
    email: 'String'
    firstName: 'String'
    id: 'String'
    languages: 'String'
    lastName: 'String'
    phone: 'String'
  }
  User: { // field return type name
    assignedTo: 'Assignment'
    assignments: 'Assignment'
    city: 'String'
    createdAt: 'DateTime'
    email: 'String'
    firstName: 'String'
    id: 'String'
    isBanned: 'Boolean'
    isManager: 'Boolean'
    isProfileComplete: 'Boolean'
    isTranslator: 'Boolean'
    languages: 'String'
    lastName: 'String'
    phone: 'String'
    profilePic: 'String'
    state: 'String'
    translatingFor: 'User'
    translators: 'Translator'
    updatedAt: 'DateTime'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    addAndCreateTranslator: { // args
      input: NexusGenInputs['AddAndCreateTranslatorInput']; // AddAndCreateTranslatorInput!
    }
    addTranslator: { // args
      input: NexusGenInputs['AddTranslatorInput']; // AddTranslatorInput!
    }
    completeProfile: { // args
      input: NexusGenInputs['CompleteProfileInput']; // CompleteProfileInput!
    }
    createAddress: { // args
      input: NexusGenInputs['CreateAddressInput']; // CreateAddressInput!
    }
    createClaimant: { // args
      input: NexusGenInputs['CreateClaimantInput']; // CreateClaimantInput!
    }
    createUser: { // args
      input: NexusGenInputs['CreateUserInput']; // CreateUserInput!
    }
    disconnectTranslator: { // args
      input: NexusGenInputs['DisconnectTranslatorInput']; // DisconnectTranslatorInput!
    }
    login: { // args
      input: NexusGenInputs['CreateUserInput']; // CreateUserInput!
    }
    updateUser: { // args
      data: NexusGenInputs['UpdateUserInput']; // UpdateUserInput!
    }
  }
  Query: {
    getTranslator: { // args
      input: NexusGenInputs['ByEmailInput']; // ByEmailInput!
    }
    getTranslators: { // args
      input: NexusGenInputs['PaginatedInput']; // PaginatedInput!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

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
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}