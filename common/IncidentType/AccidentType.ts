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
