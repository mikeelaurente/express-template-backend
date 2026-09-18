/**
 * TypeScript types and interfaces for the Example module
 */

export interface ExampleItem {
  id: string;
  message: string;
  createdAt: Date;
}

export interface GetExampleResponse {
  message: string;
  timestamp: string;
}
