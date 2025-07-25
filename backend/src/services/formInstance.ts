// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Request, Response } from 'express';
import { randomUUID } from "crypto";
import { literalDate, literalString, nodeValue, ns } from "../rdfutil";
import * as ia from '../ia';

export async function create(req: Request, res: Response) {
  try {
    const { formData, formTemplateId, createdAt } = req.body;
    const { incidentId } = req.params;

    const formId = randomUUID();
    const formNode = ns.data(formId);
    const formTemplateNode = ns.data(formTemplateId);

    const authorNode = ns.data(res.locals.user.username);

    const incidentIdNode = ns.data(incidentId);

    const jsonLiteral = literalString(JSON.stringify(formData));
  
    await ia.insertData([
      [formNode, ns.rdf.type, formTemplateNode],
      [formNode, ns.lisa.createdAt, literalDate(new Date(createdAt))],
      [incidentIdNode, ns.lisa.hasForm, formNode],
  
      // Form Author details
      [authorNode, ns.rdf.type, ns.ies.Creator],
      [authorNode, ns.ies.hasName, literalString(res.locals.user.displayName)],
      [authorNode, ns.ies.isParticipantIn, formNode],
  
      // Form JSON structure
      [formNode, ns.lisa.hasData, jsonLiteral]
    ]);

    res.status(200).json({ id: formId });

  } catch (error) {
    console.error('Error saving form:', error);
    res.status(500).json({ error: 'An error occurred while saving the form.' });
  }
}

export async function get(req: Request, res: Response) {
  try {
    const { incidentId } = req.params;

    const results = await ia.select({
      clause: [
        [ns.data(incidentId), ns.lisa.hasForm, '?formId'],
        ['?formId', ns.rdf.type, '?formTemplateId'],
        ['?formTemplateId', ns.ies.hasName, '?formTemplateName'],
        ['?formId', ns.lisa.createdAt, '?createdAt'],
        ['?formId', ns.lisa.hasData, '?formData'],
        ['?author', ns.ies.isParticipantIn, '?formId'],
        ['?author', ns.ies.hasName, '?authorName']
      ],
      orderBy: [
        ['?createdAt', 'DESC']
      ]
    });

    const forms = results.map(result => ({
      id: nodeValue(result.formId.value),
      formTemplateId: nodeValue(result.formTemplateId.value),
      title: result.formTemplateName.value,
      createdAt: result.createdAt.value,
      formData: JSON.parse(result.formData.value),
      authorName: result.authorName?.value ?? null
    }));

    return res.status(200).json(forms);

  } catch (error) {
    console.error('Error fetching forms:', error);
    return res.status(500).json({ error: 'An error occurred while retrieving the forms' });
  }
}

