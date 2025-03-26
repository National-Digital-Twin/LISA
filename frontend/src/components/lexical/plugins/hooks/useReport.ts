/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useRef } from 'react';

const getElement = (): HTMLElement => {
  let element = document.getElementById('report-container');

  if (element === null) {
    element = document.createElement('div');
    element.id = 'report-container';
    element.className = 'report-container';

    if (document.body) {
      document.body.appendChild(element);
    }
  }

  return element;
};

export default function useReport(): (
  arg0: string
) => ReturnType<typeof setTimeout> {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanup = useCallback(() => {
    if (timer !== null) {
      clearTimeout(timer.current as ReturnType<typeof setTimeout>);
    }

    if (document.body) {
      document.body.removeChild(getElement());
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  return useCallback(
    (content) => {
      const element = getElement();
      clearTimeout(timer.current as ReturnType<typeof setTimeout>);
      element.innerHTML = content;
      timer.current = setTimeout(cleanup, 1000);
      return timer.current;
    },
    [cleanup]
  );
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
