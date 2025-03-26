// Global imports
import { PropsWithChildren } from 'react';

// Local imports
import bem, { ModifiersType } from '../utils/bem';

type PropsType = PropsWithChildren & {
  classModifiers?: ModifiersType;
}
const Readonly = ({ classModifiers = [], children }: PropsType) => {
  const classes = bem('readonly', classModifiers);
  return <div className={classes()}>{children}</div>;
};

export default Readonly;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
