export interface EmailNotification {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
}
