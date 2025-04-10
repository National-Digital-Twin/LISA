import { Request, Response } from 'express';
import { randomUUID } from "crypto";
import { literalDate, literalString, nodeValue, ns } from "../rdfutil";
import * as ia from '../ia';

export async function create(req: Request, res: Response) {
  try {
    const { formData, title } = req.body;
    const formId = randomUUID();
    const formNode = ns.data(formId);

    const authorNode = ns.data(res.locals.user.username);
    const now = new Date();

    const jsonLiteral = literalString(JSON.stringify(formData));

    await ia.insertData([
      [formNode, ns.rdf.type, ns.lisa.Form],
      [formNode, ns.ies.hasName, literalString(title)],
      [formNode, ns.lisa.createdAt, literalDate(now)],

      // Form Author details
      [authorNode, ns.rdf.type, ns.ies.Creator],
      [authorNode, ns.ies.hasName, literalString(res.locals.user.displayName)],
      [authorNode, ns.ies.isParticipantIn, formNode],

      // Form JSON structure
      [formNode, ns.lisa.hasData, jsonLiteral]
    ]);

    res.status(200).json({ message: "Form successfully saved" });

  } catch (error) {
    console.error('Error saving form:', error);
    res.status(500).json({ error: 'An error occurred while saving the form.' });
  }
}

export async function get(req: Request, res: Response) {
  try {
  
    const results = await ia.select({
      clause: [
        ['?formId', ns.rdf.type, ns.lisa.Form],
        ['?formId', ns.ies.hasName, '?title'],
        ['?formId', ns.lisa.createdAt, '?createdAt'],
        ['?formId', ns.lisa.hasData, '?formData'],
        ['?author', ns.ies.isParticipantIn, '?formId'],
        ['?author', ns.ies.hasName, '?authorName']
      ]
    });

    const forms = results.map(result => ({
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