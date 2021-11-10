import { Server } from "./server";

export interface CustomResponse{
  timeStamp: Date;
  statusCode: number;
  httpStatus: string;
  reason: string;
  message: string;
  developerMessage: string;
  data: { servers?: Server[], server?: Server };

}
