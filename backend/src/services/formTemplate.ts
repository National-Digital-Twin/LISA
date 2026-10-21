// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import * as sparql from 'rdf-sparql-builder';
import { literalDate, literalString, nodeValue, ns } from '../rdfutil';
import * as ia from '../ia';
import { formContentTriples } from './common/formContent';

export async function create(req: Request, res: Response) {
  try {
    const accessToken = req.header('X-Auth-Request-Access-Token');
    const { formData, title } = req.body;
    const formId = randomUUID();
    const formNode = ns.data(formId);

    const now = new Date();

    await ia.insertData([
      [formNode, ns.rdf.type, ns.lisa.Form],
      [formNode, ns.ies.hasName, literalString(title)],
      [formNode, ns.lisa.createdAt, literalDate(now)],

      ...formContentTriples(formNode, res.locals.user, formData)
    ], accessToken);

    res.status(200).json({ id: formId });
  } catch (error) {
    console.error('Error saving form:', error);
    res.status(500).json({ error: 'An error occurred while saving the form.' });
  }
}

export async function get(req: Request, res: Response) {
  try {
    const accessToken = req.header('X-Auth-Request-Access-Token');
    const results = await ia.select({
      accessToken,
      clause: [
        ['?formId', ns.rdf.type, ns.lisa.Form],
        ['?formId', ns.ies.hasName, '?title'],
        ['?formId', ns.lisa.createdAt, '?createdAt'],
        ['?formId', ns.lisa.hasData, '?formData'],
        sparql.optional([
          ['?author', ns.ies.isParticipantIn, '?formId'],
          ['?author', ns.ies.hasName, '?authorName']
        ])
      ],
      orderBy: [['?createdAt', 'DESC']]
    });

    const forms = results.map((result) => ({
      id: nodeValue(result.formId.value),
      title: result.title.value,
      createdAt: result.createdAt.value,
      formData: JSON.parse(result.formData.value),
      authorName: result.authorName?.value ?? null
    }));

    return res.status(200).json(forms);
  } catch (error) {
    console.error('Error fetching form templates:', error);
    return res.status(500).json({ error: 'An error occurred while retrieving the form templates' });
  }
}
