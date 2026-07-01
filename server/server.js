const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

let lobbies = [];

app.get('/', (req, res) => {
    res.json({
        message: 'Backend server is running',
        endpoints: ['/api/lobbies', '/api/lobbies/:id', '/api/lobbies/:id/join']
    });
});

app.get('/api/lobbies', (req, res) => {
    res.json({ success: true, data: lobbies });
});

app.post('/api/lobbies', (req, res) => {
    const { name, host, maxPlayers = 4 } = req.body || {};

    if (!name || !host) {
        return res.status(400).json({
            success: false,
            message: 'Nama lobby dan host wajib diisi'
        });
    }

    const lobby = {
        id: `lobby-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name,
        host,
        maxPlayers,
        players: [{ id: 'host', name: host }],
        status: 'waiting',
        createdAt: new Date().toISOString()
    };

    lobbies.push(lobby);

    res.status(201).json({ success: true, data: lobby });
});

app.get('/api/lobbies/:id', (req, res) => {
    const lobby = lobbies.find((item) => item.id === req.params.id);

    if (!lobby) {
        return res.status(404).json({ success: false, message: 'Lobby tidak ditemukan' });
    }

    res.json({ success: true, data: lobby });
});

app.post('/api/lobbies/:id/join', (req, res) => {
    const lobby = lobbies.find((item) => item.id === req.params.id);
    const { name } = req.body || {};

    if (!lobby) {
        return res.status(404).json({ success: false, message: 'Lobby tidak ditemukan' });
    }

    if (!name) {
        return res.status(400).json({ success: false, message: 'Nama pemain wajib diisi' });
    }

    if (lobby.players.length >= lobby.maxPlayers) {
        return res.status(400).json({ success: false, message: 'Lobby sudah penuh' });
    }

    const alreadyJoined = lobby.players.some((player) => player.name === name);
    if (alreadyJoined) {
        return res.status(400).json({ success: false, message: 'Nama pemain sudah ada di lobby ini' });
    }

    lobby.players.push({ id: `player-${Date.now()}`, name });

    res.json({ success: true, data: lobby });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
