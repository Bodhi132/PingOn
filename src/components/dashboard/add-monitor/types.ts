export type MonitorCategory = "api" | "website" | "ping" | "udp" | "ssl";
export type ApiMonitorType = "http" | "advanced";

export interface MonitorFormData {
  category: MonitorCategory;
  apiType: ApiMonitorType;
  url: string;
  port: string;
  method: string;
  headers: string;
  payload: string;
  expectedResponse: string;
}
