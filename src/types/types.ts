import { Message } from "@/model/User";

export interface ApiResponse {
  data(data: any): unknown;
  success: boolean,
  message: string,
  isAcceptingMessage?: boolean,
  messages?: Array<Message>
}