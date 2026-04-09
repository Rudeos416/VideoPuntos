const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Configuración con tus datos de Railway 
const db = mysql.createConnection({
    host: 'mainline.proxy.rlwy.net',
    user: 'root',
    password: 'bAfFDUKvFhJjCvUiXsXyhYtYmyvCOmpX',
    database: 'railway',
    port: 47759
});

// Ruta exacta que busca tu script de HTML
app.post('/api/trpc/registration.register', (req, res) => {
    // El HTML envía los datos dentro de un objeto "json"
    const { username, email, password } = req.body.json;

    const query = "INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)";
    
    db.query(query, [username, email, password], (err, result) => {
        if (err) {
            console.error("Error en DB:", err);
            // Si el email ya existe (es UNIQUE), enviamos el error CONFLICT que espera tu HTML
            if (err.code === 'ER_DUP_ENTRY') {
                return res.json({ error: { data: { code: 'CONFLICT' } } });
            }
            return res.json({ error: { message: "Error al registrar" } });
        }
        
        // Respuesta de éxito formateada para tu script
        res.json({ result: { data: { success: true } } });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});