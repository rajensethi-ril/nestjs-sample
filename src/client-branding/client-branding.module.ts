import { Module } from '@nestjs/common';
import { ClientBrandingAggregateService } from './aggregates/aggregate.service';
import { ClientBrandingCommandService } from './commands/command.service';
import { ClientBrandingControllerService } from './controllers/controller.service';
import { ClientBrandingEntitiesService } from './entities/entities.service';
import { ClientBrandingEventsService } from './events/events.service';
import { ClientBrandingPoliciesService } from './policies/policies.service';
import { ClientBrandingQueriesService } from './queries/queries.service';

@Module({})
export class ClientBrandingModule {
  imports: [
    ClientBrandingAggregateService,
    ClientBrandingCommandService,
    ClientBrandingControllerService,
    ClientBrandingEntitiesService,
    ClientBrandingEventsService,
    ClientBrandingPoliciesService,
    ClientBrandingQueriesService,
  ];
}
