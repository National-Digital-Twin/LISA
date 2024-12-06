// Local imports
import { type FieldOption } from 'common/Field';
import { type IncidentType } from 'common/IncidentType';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IncidentTypes as ITypes } from 'common/IncidentTypes';

/**
 * The types need to include any groups, which are defined
 * as labels on the IncidentTypes dictionary.
 */
export const IncidentTypes = Object.keys(ITypes).reduce(
  (options: Array<FieldOption>, value: string) => {
    const opts = [...options];
    const type = ITypes[value as IncidentType];
    if (!type || type.legacy) {
      return opts;
    }

    if (type.group) {
      const groupIndex = opts.findIndex((t) => t.label === type.group);
      if (groupIndex > -1) {
        opts[groupIndex] = {
          ...opts[groupIndex],
          options: [
            ...(opts[groupIndex].options ?? []),
            { ...type, value }
          ]
        };
      } else {
        opts.push({
          value: type.group,
          label: type.group,
          options: [{ ...type, value }]
        });
      }
    } else {
      opts.push({ ...type, value });
    }
    return opts;
  },
  []
);
