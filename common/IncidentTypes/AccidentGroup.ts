// Local imports
import { type AccidentType } from '../IncidentType/AccidentType';
import { type Group } from './Group';

type Type = Omit<Group, 'types'> & {
  types: { [key in AccidentType]: {
    index: string, subIndex?: string, label: string
  }}
};

export const AccidentGroup: Type = {
  label: 'Accidents and systems failures',
  types: {
    SocialCareFailure: { index: '13', label: 'Major adult social care provider failure' },
    InsolvencyCriticalSupplier: { index: '14', label: 'Insolvency of supplier(s) of critical services to the public sector' },
    InsolvencyFuelSupply: { index: '15', label: 'Insolvency affecting fuel supply' },
    AccidentRail: { index: '16', label: 'Rail accident' },
    AccidentLargePassengerVessel: { index: '17', label: 'Large passenger vessel accident' },
    MajorMaritimePollution: { index: '18', label: 'Major maritime pollution incident' },
    VesselBlockingPort: { index: '19', label: 'Incident (grounding/sinking) of a vessel blocking a major port' },
    AccidentDangerousGoods: { index: '20', label: 'Accident involving high-consequence dangerous goods' },
    AviationCollision: { index: '21', label: 'Aviation collision' },
    MaliciousDrone: { index: '22', label: 'Malicious drone incident' },
    SpaceBasedDisruption: { index: '23', label: 'Disruption of space-based services' },
    PNTLoss: { index: '24', label: 'Loss of Positioning, Navigation and Timing (PNT) services' },
    FullCommunicationLoss: { index: '25', label: 'Simultaneous loss of all fixed and mobile forms of communication' },
    ElectricityNationalFailure: { index: '26', subIndex: 'a', label: 'Failure of the National Electricity Transmission System (NETS)' },
    ElectricityRegionalFailure: { index: '26', subIndex: 'b', label: 'Regional failure of the electricity network' },
    GasSupplyFailure: { index: '27', label: 'Failure of gas supply infrastructure' },
    CivilNuclearAccident: { index: '28', label: 'Civil nuclear accident' },
    RadiationOverseas: { index: '29', label: 'Radiation release from overseas nuclear site' },
    RadiationTransported: { index: '30', label: 'Radiation exposure from transported, stolen or lost goods' },
    TechnologyFailureBank: { index: '31', subIndex: 'a', label: 'Technological failure at a systemically important retail bank' },
    TechnologyFailureMarket: { index: '31', subIndex: 'b', label: 'Technological failure at a UK critical financial market infrastructure' },
    FireOnshoreCOMAH: { index: '32', label: 'Accidental fire or explosion at an onshore major hazard (COMAH) site' },
    ToxicReleaseOnshoreCOMAH: { index: '33', label: 'Accidental large toxic chemical release from an onshore major hazard (COMAH) site' },
    FireOffshoreOil: { index: '34', label: 'Accidental fire or explosion on an offshore oil or gas installation' },
    FireOnshoreFuelPipeline: { index: '35', label: 'Accidental fire or explosion at an onshore fuel pipeline' },
    FireOnshorHazardPipeline: { index: '36', label: 'Accidental fire or explosion at an onshore major accident hazard pipeline' },
    PathogenReleaseLab: { index: '37', label: 'Accidental work-related (laboratory) release of a hazardous pathogen' },
    DamCollapse: { index: '38', label: 'Reservoir/dam collapse' },
    WaterInfrastructureFailure: { index: '39', label: 'Water infrastructure failure or loss of drinking water' },
    FoodSupplyContamination: { index: '40', label: 'Food supply contamination' },
    MajorFire: { index: '41', label: 'Major fire' }
  }
};
