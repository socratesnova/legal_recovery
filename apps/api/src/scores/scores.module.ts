import { Module } from "@nestjs/common";
import { ScoringService } from "./scoring.service";
import { ScoresController } from "./scores.controller";

@Module({
  controllers: [ScoresController],
  providers: [ScoringService],
  exports: [ScoringService],
})
export class ScoresModule {}
