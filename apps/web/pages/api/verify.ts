import type { NextApiRequest, NextApiResponse } from 'next';

const CORE_API = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:4002';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, code, integrityHash } = req.body as Record<string, string>;

  if (!code) {
    return res.status(400).json({ error: 'Verification code is required' });
  }

  try {
    let backendUrl = '';
    if (type === 'transcript') {
      if (!integrityHash) {
        return res.status(400).json({ error: 'integrityHash is required for transcript verification' });
      }
      backendUrl = `${CORE_API}/verification/transcript`;
    } else if (type === 'diploma') {
      backendUrl = `${CORE_API}/verification/diploma`;
    } else {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verificationCode: code, integrityHash, diploma_number: code, qr_code: code })
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return res.status(backendResponse.status).json(data);
    }

    return res.status(200).json({
      verified: data.verified,
      documentType: type,
      ...(data.studentName && { studentName: data.studentName }),
      ...(data.programTitle && { programTitle: data.programTitle }),
      ...(data.level && { level: data.level }),
      ...(data.mention && { mention: data.mention }),
      ...(data.issuedDate && { issuedDate: data.issuedDate }),
      ...(data.weightedAverage && { weightedAverage: data.weightedAverage }),
      ...(data.decision && { decision: data.decision }),
      ...(data.integrityHash && { integrityHash: data.integrityHash }),
      ...(data.documentSignature && { documentSignature: data.documentSignature }),
      ...(data.verifiedAt && { verifiedAt: data.verifiedAt })
    });
  } catch (error) {
    console.error('[web] Verification error:', error);
    return res.status(500).json({ error: 'Verification service error' });
  }
}
