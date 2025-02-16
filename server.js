const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database("usuarios.db", (err) => {
    if (err) {
        console.error("Error al conectar con SQLite:", err);
    } else {
        console.log("Base de datos conectada");
        inicializarBaseDeDatos();
    }
});

// Crear tablas si no existen
function inicializarBaseDeDatos() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                apellidos TEXT,
                direccion TEXT,
                localidad TEXT,
                municipio TEXT
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS localidades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT UNIQUE
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS municipios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                localidad_id INTEGER,
                FOREIGN KEY (localidad_id) REFERENCES localidades(id)
            )
        `);

        // Insertar datos si no existen
        db.run(`INSERT OR IGNORE INTO localidades (nombre) VALUES 
            ('Mérida'), ('Valladolid'), ('Tizimín'), ('Progreso'), ('Izamal'), ('Motul'), ('Tekax'), ('Ticul'), ('Maxcanú'), ('Sotuta')`);

        db.run(`INSERT OR IGNORE INTO municipios (nombre, localidad_id) VALUES 
            ('Mérida', 1), ('Kanasín', 1), ('Umán', 1), ('Progreso', 1), ('Hunucmá', 1), ('Conkal', 1), ('Ucú', 1), ('Tixpéhual', 1), ('Tixkokob', 1), ('Abalá', 1), ('Timucuy', 1), ('Chicxulub Pueblo', 1), ('Ixil', 1), ('Seyé', 1), ('Acanceh', 1), ('Tahmek', 1), ('Tecoh', 1), ('Cuzamá', 1), ('Homún', 1), ('Huhí', 1),
            ('Valladolid', 2), ('Temozón', 2), ('Chemax', 2), ('Tizimín', 2), ('Cuncunul', 2), ('Tinum', 2), ('Uayma', 2), ('Chichimilá', 2), ('Chankom', 2), ('Dzitás', 2), ('Kaua', 2), ('Yaxcabá', 2), ('Quintana Roo', 2), ('Chikindzonot', 2), ('Tixcacalcupul', 2),
            ('Tizimín', 3), ('Espita', 3), ('Sucilá', 3), ('Buctzotz', 3), ('Calotmul', 3), ('Panabá', 3), ('Río Lagartos', 3), ('San Felipe', 3), ('Cenotillo', 3), ('Dzilam de Bravo', 3), ('Dzilam González', 3), ('Temax', 3), ('Yaxcabá', 3), ('Cantamayec', 3),
            ('Tekax', 4), ('Oxkutzcab', 4), ('Peto', 4), ('Tzucacab', 4), ('Tixméhuac', 4), ('Akil', 4), ('Teabo', 4), ('Maní', 4), ('Dzan', 4), ('Chacsinkín', 4), ('Tahdziú', 4), ('Mayapán', 4), ('Chumayel', 4), ('Tekit', 4), ('Cantamayec', 4),
            ('Izamal', 5), ('Tekal de Venegas', 5), ('Hoctún', 5), ('Tunkás', 5), ('Sudzal', 5), ('Xocchel', 5), ('Teya', 5), ('Tepakán', 5), ('Tekantó', 5), ('Quintana Roo', 5), ('Dzoncauich', 5), ('Sanahcat', 5), ('Kantunil', 5), ('Yaxcabá', 5), ('Sotuta', 5),
            ('Motul', 6), ('Cansahcab', 6), ('Baca', 6), ('Dzidzantún', 6), ('Yaxkukul', 6), ('Telchac Pueblo', 6), ('Muxupip', 6), ('Cacalchén', 6), ('Bokobá', 6), ('Suma', 6), ('Temax', 6), ('Sinanché', 6), ('Dzemul', 6), ('Mocochá', 6), ('Telchac Puerto', 6),
            ('Ticul', 7), ('Muna', 7), ('Santa Elena', 7), ('Mama', 7), ('Chapab', 7), ('Sacalum', 7), ('Tekit', 7), ('Dzan', 7), ('Pustunich', 7), ('Oxkutzcab', 7), ('Maní', 7), ('Akil', 7), ('Teabo', 7), ('Chumayel', 7), ('Mayapán', 7),
            ('Progreso', 8), ('Chicxulub Pueblo', 8), ('Telchac Puerto', 8), ('Dzemul', 8), ('Sinanché', 8), ('Yobaín', 8), ('Dzidzantún', 8), ('Dzilam de Bravo', 8), ('Dzilam González', 8), ('Ixil', 8), ('Muxupip', 8), ('Motul', 8), ('Baca', 8), ('Yaxkukul', 8), ('Conkal', 8),
            ('Maxcanú', 9), ('Halachó', 9), ('Opichén', 9), ('Kopomá', 9), ('Chocholá', 9), ('Samahil', 9), ('Tetiz', 9), ('Celestún', 9), ('Kinchil', 9), ('Hunucmá', 9), ('Ucú', 9), ('Umán', 9), ('Abalá', 9), ('Sacalum', 9), ('Muna', 9),
            ('Sotuta', 10), ('Cantamayec', 10), ('Yaxcabá', 10), ('Tixcacalcupul', 10), ('Kaua', 10), ('Cuncunul', 10), ('Tekom', 10), ('Chankom', 10), ('Chikindzonot', 10), ('Tixméhuac', 10), ('Chacsinkín', 10), ('Teabo', 10), ('Mayapán', 10), ('Tekit', 10), ('Kantunil', 10)`);
    });
}

// Obtener todas las localidades
app.get("/localidades", (req, res) => {
    db.all("SELECT * FROM localidades", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Obtener municipios según localidad
app.get("/municipios/:localidad", (req, res) => {
    const localidad = req.params.localidad;
    db.get("SELECT id FROM localidades WHERE nombre = ?", [localidad], (err, row) => {
        if (err || !row) {
            return res.json([]);
        }
        db.all("SELECT nombre FROM municipios WHERE localidad_id = ?", [row.id], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(rows);
            }
        });
    });
});

// Obtener todos los usuarios
app.get("/usuarios", (req, res) => {
    db.all("SELECT * FROM usuarios", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Agregar un usuario
app.post("/usuarios", (req, res) => {
    const { nombre, apellidos, direccion, localidad, municipio } = req.body;
    if (!nombre || !apellidos || !direccion || !localidad || !municipio) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    db.run(
        "INSERT INTO usuarios (nombre, apellidos, direccion, localidad, municipio) VALUES (?, ?, ?, ?, ?)",
        [nombre, apellidos, direccion, localidad, municipio],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID, nombre, apellidos, direccion, localidad, municipio });
            }
        }
    );
});

// Eliminar un usuario por ID
app.delete("/usuarios/:id", (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM usuarios WHERE id = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "Usuario eliminado correctamente", id });
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
