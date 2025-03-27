// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type EnvironmentalType } from '../IncidentType/EnvironmentalType';
import { type Group } from './Group';

type Type = Omit<Group, 'types'> & {
  types: { [key in EnvironmentalType]: {
    index: string, subIndex?: string, label: string
  }}
};

export const EnvironmentalGroup: Type = {
  label: 'Natural and environmental hazards',
  types: {
    Wildfire: { index: '42', label: 'Wildfire' },
    VolcanicEruption: { index: '43', label: 'Volcanic eruption' },
    Earthquake: { index: '44', label: 'Earthquake' },
    NaturalHumanitarianCrisisOverseas: { index: '45', label: 'Humanitarian crisis overseas - natural hazard event' },
    DisasterResponseOverseas: { index: '46', label: 'Disaster response in the Overseas Territories' },
    SevereSpaceWeather: { index: '47', label: 'Severe space weather' },
    Storms: { index: '48', label: 'Storms' },
    Heatwaves: { index: '49', label: 'High temperatures and heatwaves' },
    ColdAndSnow: { index: '50', label: 'Low temperatures and snow' },
    FloodingCoastal: { index: '51', subIndex: 'a', label: 'Coastal flooding' },
    FloodingFluvial: { index: '51', subIndex: 'b', label: 'Fluvial flooding' },
    FloodingSurface: { index: '51', subIndex: 'c', label: 'Surface water flooding' },
    Drought: { index: '52', label: 'Drought' },
    PoorAirQuality: { index: '53', label: 'Poor air quality' }
  }
};
