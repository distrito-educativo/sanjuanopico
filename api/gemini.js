export default async function handler(req, res) {
  // Configuración de permisos CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-Type'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'El mensaje es requerido' });
  }

  // Prompt de Sistema Institucional de San Juan Opico
  const systemInstruction = `
    Eres el Asistente Virtual Oficial del Distrito Educativo de San Juan Opico, Departamento de La Libertad, El Salvador.
    Tu objetivo es orientar con amabilidad, precisión y profesionalismo a directores, docentes, personal administrativo, estudiantes y padres de familia.
    Responde en español, usando un tono claro, atento e institucional.
    Si el usuario consulta sobre trámites o normativas, recuérdale con educación que puede consultar la Biblioteca Documental, el Calendario Escolar o la Mesa de Ayuda del portal distrital.
    Mantén las respuestas concisas y directas.
  `;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key no configurada en el servidor' });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nConsulta del usuario: ${prompt}` }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      const botResponse = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply: botResponse });
    } else {
      return res.status(500).json({ error: 'Respuesta no válida de la API' });
    }
  } catch (error) {
    console.error('Error en el puente Gemini:', error);
    return res.status(500).json({ error: 'Error al conectar con la IA' });
  }
}
