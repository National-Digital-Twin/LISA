// Global imports
import { Literal, Static, Union } from 'runtypes';

export const AccidentType = Union(
  Literal('SocialCareFailure'),
  Literal('InsolvencyCriticalSupplier'),
  Literal('InsolvencyFuelSupply'),
  Literal('AccidentRail'),
  Literal('AccidentLargePassengerVessel'),
  Literal('MajorMaritimePollution'),
  Literal('VesselBlockingPort'),
  Literal('AccidentDangerousGoods'),
  Literal('AviationCollision'),
  Literal('MaliciousDrone'),
  Literal('SpaceBasedDisruption'),
  Literal('PNTLoss'),
  Literal('FullCommunicationLoss'),
  Literal('ElectricityNationalFailure'),
  Literal('ElectricityRegionalFailure'),
  Literal('GasSupplyFailure'),
  Literal('CivilNuclearAccident'),
  Literal('RadiationOverseas'),
  Literal('RadiationTransported'),
  Literal('TechnologyFailureBank'),
  Literal('TechnologyFailureMarket'),
  Literal('FireOnshoreCOMAH'),
  Literal('ToxicReleaseOnshoreCOMAH'),
  Literal('FireOffshoreOil'),
  Literal('FireOnshoreFuelPipeline'),
  Literal('FireOnshorHazardPipeline'),
  Literal('PathogenReleaseLab'),
  Literal('DamCollapse'),
  Literal('WaterInfrastructureFailure'),
  Literal('FoodSupplyContamination'),
  Literal('MajorFire')
);

// eslint-disable-next-line no-redeclare
export type AccidentType = Static<typeof AccidentType>;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
