// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import bem from './bem';
import { debounce } from './debounce';
import { deduplicate } from './deduplicate';
import { sortLabel } from './sortLabel';
import Document from './Document';
import Form from './Form';
import Format from './Format';
import Icons from './Icons';
import { Incident } from './Incident';
import { MapUtils } from './Map';
import { Search } from './Search';
import Validate from './Validate';
import { mergeOfflineEntities } from './mergeOffline';

const Utils = {
  bem,
  debounce,
  deduplicate,
  mergeOfflineEntities,
  sortLabel
};

export {
  bem,
  debounce,
  deduplicate,
  Document,
  Form,
  Format,
  Icons,
  Incident,
  mergeOfflineEntities,
  MapUtils,
  Search,
  Utils,
  Validate
};
