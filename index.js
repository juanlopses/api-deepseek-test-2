const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Endpoint GET para personalizar content
app.get('/chat', async (req, res) => {
  try {
    // Obtener content desde los query parameters
    const { content } = req.query;

    // Validar que content esté presente
    if (!content) {
      return res.status(400).json({ error: 'El parámetro "content" es requerido' });
    }

    // Configuración de la solicitud a la API de Chutes
    const apiToken = process.env.CHUTES_API_TOKEN || 'cpk_578f1b4e3dc94044b8914476a5fcadf5.33e81d8192625cd9952abebf9641b482.zBlvMaFg7sShZhYSVRIPO9bnyGBNRaEx';
    const response = await axios.post(
      'https://llm.chutes.ai/v1/chat/completions',
      {
        model: 'deepseek-ai/DeepSeek-V3-0324',
        messages: [
          {
            role: 'user',
            content
          }
        ],
        stream: false, // Cambiar a true si deseas streaming
        max_tokens: 1024,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extraer solo content y reasoning_content de la respuesta
    const apiResponse = response.data;
    const simplifiedResponse = {
      content: apiResponse.choices?.[0]?.message?.content || '',
      reasoning_content: apiResponse.choices?.[0]?.message?.reasoning_content || null,
      author: 'kenn'
    };

    // Enviar la respuesta simplificada
    res.json(simplifiedResponse);
  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
