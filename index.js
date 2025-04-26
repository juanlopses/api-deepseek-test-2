const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Endpoint GET para personalizar role y content
app.get('/chat', async (req, res) => {
  try {
    // Obtener role y content desde los query parameters
    const { role, content } = req.query;

    // Validar que role y content estén presentes
    if (!role) {
      return res.status(400).json({ error: 'El parámetro "role" es requerido' });
    }
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
            role,
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

    // Modificar la respuesta para incluir solo author
    const modifiedResponse = {
      ...response.data,
      author: 'kenn'
    };

    // Enviar la respuesta modificada
    res.json(modifiedResponse);
  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
