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
    city?: string | null; // String
    email: string; // String!
    firstName: string; // String!
    languages?: string[] | null; // [String!]
    lastName?: string | null; // String
    phone: string; // String!
    state?: string | null; // String
  }
  AddNonUserTranslatorInput: { // input type
    city?: string | null; // String
    email: string; // String!
    firstName: string; // String!
    languages?: string[] | null; // [String!]
    lastName: string; // String!
    phone?: string | null; // String
    state?: string | null; // String
  }
  AddTranslatorInput: { // input type
    email: string; // String!
  }
  AddressesFilter: { // input type
    address1?: string | null; // String
    address2?: string | null; // String
    city?: string | null; // String
    state?: string | null; // String
    zipCode?: string | null; // String
  }
  AssignmentsFilter: { // input type
    address?: NexusGenInputs['AddressesFilter'] | null; // AddressesFilter
    assignedTo?: NexusGenInputs['TranslatorsFilter'] | null; // TranslatorsFilter
    claimant?: NexusGenInputs['ClaimantsFilter'] | null; // ClaimantsFilter
    date?: NexusGenScalars['DateTime'] | null; // DateTime
    dateRange?: NexusGenInputs['DateRange'] | null; // DateRange
  }
  ByEmailInput: { // input type
    email: string; // String!
  }
  ByIdInput: { // input type
    id: string; // String!
  }
  ClaimantsFilter: { // input type
    firstName?: string | null; // String
    language?: string | null; // String
    lastName?: string | null; // String
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
    addressId: string; // String!
    claimantId: string; // String!
    dateTime: NexusGenScalars['DateTime']; // DateTime!
    translatorId: string; // String!
  }
  CreateClaimantInput: { // input type
    email?: string | null; // String
    firstName: string; // String!
    languages?: string[] | null; // [String!]
    lastName: string; // String!
    phone: string; // String!
  }
  CreateReminderInput: { // input type
    assignmentId: string; // String!
    claimantMessage?: string | null; // String
    translatorMessage?: string | null; // String
  }
  CreateUserInput: { // input type
    email: string; // String!
    firstName?: string | null; // String
    lastName?: string | null; // String
    phone?: string | null; // String
  }
  DateRange: { // input type
    date1: NexusGenScalars['DateTime']; // DateTime!
    date2: NexusGenScalars['DateTime']; // DateTime!
  }
  DisconnectTranslatorInput: { // input type
    email: string; // String!
  }
  PaginatedInput: { // input type
    countPerPage: number; // Int!
    page: number; // Int!
  }
  RemindersFilter: { // input type
    date?: string | null; // String
    range?: NexusGenInputs['DateRange'] | null; // DateRange
  }
  TranslatorsFilter: { // input type
    city?: string | null; // String
    email?: string | null; // String
    firstName?: string | null; // String
    id?: string | null; // String
    languages?: string[] | null; // [String!]
    lastName?: string | null; // String
    phone?: string | null; // String
    state?: string | null; // String
  }
  UpdateAddressInput: { // input type
    address1?: string | null; // String
    address2?: string | null; // String
    city?: string | null; // String
    id: string; // String!
    state?: string | null; // String
    zipCode?: string | null; // String
  }
  UpdateAssignmentInput: { // input type
    addressId?: string | null; // String
    claimantId?: string | null; // String
    claimantNoShow?: boolean | null; // Boolean
    dateTime?: NexusGenScalars['DateTime'] | null; // DateTime
    id: string; // String!
    isComplete?: boolean | null; // Boolean
    translatorId?: string | null; // String
    translatorNoShow?: boolean | null; // Boolean
  }
  UpdateClaimantInput: { // input type
    email?: string | null; // String
    firstName?: string | null; // String
    id: string; // String!
    languages?: string[] | null; // [String!]
    lastName?: string | null; // String
    phone?: string | null; // String
  }
  UpdateNonUserTranslatorInput: { // input type
    city?: string | null; // String
    email?: string | null; // String
    firstName?: string | null; // String
    id: string; // String!
    languages?: string[] | null; // [String!]
    lastName?: string | null; // String
    phone?: string | null; // String
    state?: string | null; // String
  }
  UpdateReminderInput: { // input type
    claimantMessage?: string | null; // String
    id: string; // String!
    translatorMessage?: string | null; // String
  }
  UpdateUserInput: { // input type
    city?: string | null; // String
    email?: string | null; // String
    firstName?: string | null; // String
    id: string; // String!
    isManager?: boolean | null; // Boolean
    isProfileComplete?: boolean | null; // Boolean
    isTranslator?: boolean | null; // Boolean
    languages?: string[] | null; // [String!]
    lastName?: string | null; // String
    phone?: string | null; // String
    profilePic?: string | null; // String
    state?: string | null; // String
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
  GetAddressesResponse: { // root type
    addresses: NexusGenRootTypes['Address'][]; // [Address!]!
    totalRowCount: number; // Int!
  }
  GetAssignmentsResponse: { // root type
    assignments: NexusGenRootTypes['Assignment'][]; // [Assignment!]!
    totalRowCount: number; // Int!
  }
  GetClaimantsResponse: { // root type
    claimants: NexusGenRootTypes['Claimant'][]; // [Claimant!]!
    totalRowCount: number; // Int!
  }
  GetNonUserTranslatorsResponse: { // root type
    totalRowCount: number; // Int!
    translators: NexusGenRootTypes['Translator'][]; // [Translator!]!
  }
  GetRemindersResponse: { // root type
    reminders: NexusGenRootTypes['Reminder'][]; // [Reminder!]!
    totalRowCount: number; // Int!
  }
  GetTranslatorsResponse: { // root type
    totalRowCount: number; // Int!
    translators: NexusGenRootTypes['User'][]; // [User!]!
  }
  Mutation: {};
  Query: {};
  Reminder: prisma.Reminder;
  Translator: { // root type
    city?: string | null; // String
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    email?: string | null; // String
    firstName?: string | null; // String
    id?: string | null; // String
    languages?: string[] | null; // [String!]
    lastName?: string | null; // String
    phone?: string | null; // String
    state?: string | null; // String
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
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
    assignment: Array<NexusGenRootTypes['Assignment'] | null> | null; // [Assignment]
    city: string | null; // String
    id: string | null; // String
    state: string | null; // String
    user: NexusGenRootTypes['User'] | null; // User
    userId: string | null; // String
    zipCode: string | null; // String
  }
  Assignment: { // field return type
    address: NexusGenRootTypes['Address'] | null; // Address
    assignedTo: NexusGenRootTypes['Translator'] | null; // Translator
    assignedToUser: NexusGenRootTypes['Translator'] | null; // Translator
    claimant: NexusGenRootTypes['Claimant'] | null; // Claimant
    claimantNoShow: boolean | null; // Boolean
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    createdBy: NexusGenRootTypes['User'] | null; // User
    dateTime: NexusGenScalars['DateTime'] | null; // DateTime
    id: string | null; // String
    isComplete: boolean | null; // Boolean
    translatorNoShow: boolean | null; // Boolean
  }
  Claimant: { // field return type
    assignment: Array<NexusGenRootTypes['Assignment'] | null> | null; // [Assignment]
    email: string | null; // String
    firstName: string | null; // String
    id: string | null; // String
    languages: Array<string | null> | null; // [String]
    lastName: string | null; // String
    phone: string | null; // String
    user: NexusGenRootTypes['User'] | null; // User
    userId: string | null; // String
  }
  GetAddressesResponse: { // field return type
    addresses: NexusGenRootTypes['Address'][]; // [Address!]!
    totalRowCount: number; // Int!
  }
  GetAssignmentsResponse: { // field return type
    assignments: NexusGenRootTypes['Assignment'][]; // [Assignment!]!
    totalRowCount: number; // Int!
  }
  GetClaimantsResponse: { // field return type
    claimants: NexusGenRootTypes['Claimant'][]; // [Claimant!]!
    totalRowCount: number; // Int!
  }
  GetNonUserTranslatorsResponse: { // field return type
    totalRowCount: number; // Int!
    translators: NexusGenRootTypes['Translator'][]; // [Translator!]!
  }
  GetRemindersResponse: { // field return type
    reminders: NexusGenRootTypes['Reminder'][]; // [Reminder!]!
    totalRowCount: number; // Int!
  }
  GetTranslatorsResponse: { // field return type
    totalRowCount: number; // Int!
    translators: NexusGenRootTypes['User'][]; // [User!]!
  }
  Mutation: { // field return type
    addAndCreateTranslator: NexusGenRootTypes['User'] | null; // User
    addNonUserTranslator: NexusGenRootTypes['Translator'] | null; // Translator
    addTranslator: NexusGenRootTypes['User'] | null; // User
    completeProfile: NexusGenRootTypes['User'] | null; // User
    createAddress: NexusGenRootTypes['Address']; // Address!
    createAssignment: NexusGenRootTypes['Assignment']; // Assignment!
    createClaimant: NexusGenRootTypes['Claimant']; // Claimant!
    createReminder: NexusGenRootTypes['Reminder']; // Reminder!
    createUser: NexusGenRootTypes['User'] | null; // User
    deleteAddress: NexusGenRootTypes['Address']; // Address!
    deleteAssignment: NexusGenRootTypes['Assignment']; // Assignment!
    deleteClaimant: NexusGenRootTypes['Claimant']; // Claimant!
    deleteNonUserTranslator: NexusGenRootTypes['Translator'] | null; // Translator
    deleteReminder: NexusGenRootTypes['Reminder']; // Reminder!
    disconnectTranslator: NexusGenRootTypes['User'] | null; // User
    login: NexusGenRootTypes['User']; // User!
    updateAddress: NexusGenRootTypes['Address']; // Address!
    updateAssignment: NexusGenRootTypes['Assignment']; // Assignment!
    updateClaimant: NexusGenRootTypes['Claimant']; // Claimant!
    updateNonUserTranslator: NexusGenRootTypes['Translator'] | null; // Translator
    updateReminder: NexusGenRootTypes['Reminder']; // Reminder!
    updateUser: NexusGenRootTypes['User'] | null; // User
  }
  Query: { // field return type
    getAddress: NexusGenRootTypes['Address']; // Address!
    getAddresses: NexusGenRootTypes['GetAddressesResponse']; // GetAddressesResponse!
    getAssignment: NexusGenRootTypes['Assignment']; // Assignment!
    getAssignments: NexusGenRootTypes['GetAssignmentsResponse']; // GetAssignmentsResponse!
    getClaimant: NexusGenRootTypes['Claimant']; // Claimant!
    getClaimants: NexusGenRootTypes['GetClaimantsResponse']; // GetClaimantsResponse!
    getNonUserTranslator: NexusGenRootTypes['Translator']; // Translator!
    getNonUserTranslators: NexusGenRootTypes['GetNonUserTranslatorsResponse']; // GetNonUserTranslatorsResponse!
    getReminder: NexusGenRootTypes['Reminder']; // Reminder!
    getReminders: NexusGenRootTypes['GetRemindersResponse']; // GetRemindersResponse!
    getTranslator: NexusGenRootTypes['User']; // User!
    getTranslators: NexusGenRootTypes['GetTranslatorsResponse']; // GetTranslatorsResponse!
    getUser: NexusGenRootTypes['User']; // User!
  }
  Reminder: { // field return type
    assignment: NexusGenRootTypes['Assignment'] | null; // Assignment
    assignmentId: string | null; // String
    claimantMessage: string | null; // String
    createdBy: NexusGenRootTypes['User'] | null; // User
    createdById: string | null; // String
    id: string | null; // String
    translatorMessage: string | null; // String
  }
  Translator: { // field return type
    assignedTo: Array<NexusGenRootTypes['Assignment'] | null> | null; // [Assignment]
    city: string | null; // String
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    email: string | null; // String
    firstName: string | null; // String
    id: string | null; // String
    languages: string[] | null; // [String!]
    lastName: string | null; // String
    phone: string | null; // String
    state: string | null; // String
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
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
    nonUserTranslators: Array<NexusGenRootTypes['Translator'] | null> | null; // [Translator]
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
    user: 'User'
    userId: 'String'
    zipCode: 'String'
  }
  Assignment: { // field return type name
    address: 'Address'
    assignedTo: 'Translator'
    assignedToUser: 'Translator'
    claimant: 'Claimant'
    claimantNoShow: 'Boolean'
    createdAt: 'DateTime'
    createdBy: 'User'
    dateTime: 'DateTime'
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
    user: 'User'
    userId: 'String'
  }
  GetAddressesResponse: { // field return type name
    addresses: 'Address'
    totalRowCount: 'Int'
  }
  GetAssignmentsResponse: { // field return type name
    assignments: 'Assignment'
    totalRowCount: 'Int'
  }
  GetClaimantsResponse: { // field return type name
    claimants: 'Claimant'
    totalRowCount: 'Int'
  }
  GetNonUserTranslatorsResponse: { // field return type name
    totalRowCount: 'Int'
    translators: 'Translator'
  }
  GetRemindersResponse: { // field return type name
    reminders: 'Reminder'
    totalRowCount: 'Int'
  }
  GetTranslatorsResponse: { // field return type name
    totalRowCount: 'Int'
    translators: 'User'
  }
  Mutation: { // field return type name
    addAndCreateTranslator: 'User'
    addNonUserTranslator: 'Translator'
    addTranslator: 'User'
    completeProfile: 'User'
    createAddress: 'Address'
    createAssignment: 'Assignment'
    createClaimant: 'Claimant'
    createReminder: 'Reminder'
    createUser: 'User'
    deleteAddress: 'Address'
    deleteAssignment: 'Assignment'
    deleteClaimant: 'Claimant'
    deleteNonUserTranslator: 'Translator'
    deleteReminder: 'Reminder'
    disconnectTranslator: 'User'
    login: 'User'
    updateAddress: 'Address'
    updateAssignment: 'Assignment'
    updateClaimant: 'Claimant'
    updateNonUserTranslator: 'Translator'
    updateReminder: 'Reminder'
    updateUser: 'User'
  }
  Query: { // field return type name
    getAddress: 'Address'
    getAddresses: 'GetAddressesResponse'
    getAssignment: 'Assignment'
    getAssignments: 'GetAssignmentsResponse'
    getClaimant: 'Claimant'
    getClaimants: 'GetClaimantsResponse'
    getNonUserTranslator: 'Translator'
    getNonUserTranslators: 'GetNonUserTranslatorsResponse'
    getReminder: 'Reminder'
    getReminders: 'GetRemindersResponse'
    getTranslator: 'User'
    getTranslators: 'GetTranslatorsResponse'
    getUser: 'User'
  }
  Reminder: { // field return type name
    assignment: 'Assignment'
    assignmentId: 'String'
    claimantMessage: 'String'
    createdBy: 'User'
    createdById: 'String'
    id: 'String'
    translatorMessage: 'String'
  }
  Translator: { // field return type name
    assignedTo: 'Assignment'
    city: 'String'
    createdAt: 'DateTime'
    email: 'String'
    firstName: 'String'
    id: 'String'
    languages: 'String'
    lastName: 'String'
    phone: 'String'
    state: 'String'
    updatedAt: 'DateTime'
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
    nonUserTranslators: 'Translator'
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
    addNonUserTranslator: { // args
      input: NexusGenInputs['AddNonUserTranslatorInput']; // AddNonUserTranslatorInput!
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
    createAssignment: { // args
      input: NexusGenInputs['CreateAssignmentInput']; // CreateAssignmentInput!
    }
    createClaimant: { // args
      input: NexusGenInputs['CreateClaimantInput']; // CreateClaimantInput!
    }
    createReminder: { // args
      input: NexusGenInputs['CreateReminderInput']; // CreateReminderInput!
    }
    createUser: { // args
      input: NexusGenInputs['CreateUserInput']; // CreateUserInput!
    }
    deleteAddress: { // args
      input: NexusGenInputs['ByIdInput']; // ByIdInput!
    }
    deleteAssignment: { // args
      input: NexusGenInputs['ByIdInput']; // ByIdInput!
    }
    deleteClaimant: { // args
      input: NexusGenInputs['ByIdInput']; // ByIdInput!
    }
    deleteNonUserTranslator: { // args
      input: NexusGenInputs['ByIdInput']; // ByIdInput!
    }
    deleteReminder: { // args
      input: NexusGenInputs['ByIdInput']; // ByIdInput!
    }
    disconnectTranslator: { // args
      input: NexusGenInputs['DisconnectTranslatorInput']; // DisconnectTranslatorInput!
    }
    login: { // args
      input: NexusGenInputs['CreateUserInput']; // CreateUserInput!
    }
    updateAddress: { // args
      input: NexusGenInputs['UpdateAddressInput']; // UpdateAddressInput!
    }
    updateAssignment: { // args
      input: NexusGenInputs['UpdateAssignmentInput']; // UpdateAssignmentInput!
    }
    updateClaimant: { // args
      input: NexusGenInputs['UpdateClaimantInput']; // UpdateClaimantInput!
    }
    updateNonUserTranslator: { // args
      input: NexusGenInputs['UpdateNonUserTranslatorInput']; // UpdateNonUserTranslatorInput!
    }
    updateReminder: { // args
      input: NexusGenInputs['UpdateReminderInput']; // UpdateReminderInput!
    }
    updateUser: { // args
      input: NexusGenInputs['UpdateUserInput']; // UpdateUserInput!
    }
  }
  Query: {
    getAddress: { // args
      input: NexusGenInputs['ByIdInput']; // ByIdInput!
    }
    getAddresses: { // args
      input?: NexusGenInputs['PaginatedInput'] | null; // PaginatedInput
      where?: NexusGenInputs['AddressesFilter'] | null; // AddressesFilter
    }
    getAssignment: { // args
      input: NexusGenInputs['ByIdInput']; // ByIdInput!
    }
    getAssignments: { // args
      input: NexusGenInputs['PaginatedInput']; // PaginatedInput!
      where?: NexusGenInputs['AssignmentsFilter'] | null; // AssignmentsFilter
    }
    getClaimant: { // args
      input: NexusGenInputs['ByIdInput']; // ByIdInput!
    }
    getClaimants: { // args
      input?: NexusGenInputs['PaginatedInput'] | null; // PaginatedInput
      where?: NexusGenInputs['ClaimantsFilter'] | null; // ClaimantsFilter
    }
    getNonUserTranslator: { // args
      input: NexusGenInputs['ByIdInput']; // ByIdInput!
    }
    getNonUserTranslators: { // args
      input?: NexusGenInputs['PaginatedInput'] | null; // PaginatedInput
      where?: NexusGenInputs['TranslatorsFilter'] | null; // TranslatorsFilter
    }
    getReminder: { // args
      input: NexusGenInputs['ByIdInput']; // ByIdInput!
    }
    getReminders: { // args
      input: NexusGenInputs['PaginatedInput']; // PaginatedInput!
      where?: NexusGenInputs['RemindersFilter'] | null; // RemindersFilter
    }
    getTranslator: { // args
      input: NexusGenInputs['ByIdInput']; // ByIdInput!
    }
    getTranslators: { // args
      input?: NexusGenInputs['PaginatedInput'] | null; // PaginatedInput
      where?: NexusGenInputs['TranslatorsFilter'] | null; // TranslatorsFilter
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