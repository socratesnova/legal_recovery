import { Module } from "@nestjs/common";
import { DataPassportsController } from "./data-passports.controller";
import { DataPassportsService } from "./data-passports.service";

@Module({
  controllers: [DataPassportsController],
  providers: [DataPassportsService],
})
export class DataPassportsModule {}
