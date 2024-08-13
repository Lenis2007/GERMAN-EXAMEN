"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const sqlite3_1 = require("sqlite3");
const db = new sqlite3_1.Database('BD - EXAMEN.db');
dotenv_1.default.config();
const app = (0, express_1.default)()
    .use((0, cors_1.default)())
    .use(express_1.default.json())
    .use(express_1.default.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
// 1. Registrar un nuevo libro
app.post('/biblioteca/libros', function (request, response) {
    let titulo = request.body.titulo;
    let autor = request.body.autor;
    let id = request.body.id;
    let anioPublicacion = request.body.anioPublicacion;
    let genero = request.body.genero;
    let sinopsis = request.body.sinopsis;
    db.run('INSERT INTO biblioteca (titulo, autor, id, anioPublicacion, genero, sinopsis) VALUES (?, ?, ?, ?, ?, ?)', [titulo, autor, id, anioPublicacion, genero, sinopsis], (err) => {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log('Nuevo libro agregado en biblioteca digital.');
        }
    });
    return response.status(200).json({
        Status: "Nuevo libro agregado en biblioteca digital.",
        titulo: titulo,
        autor: autor,
        id: id,
        anioPublicacion: anioPublicacion,
        genero: genero,
        sinopsis: sinopsis
    });
});
// 2. Consultar un libro por id
app.get('/biblioteca/libros/:id', function (request, response) {
    db.get('SELECT * FROM biblioteca WHERE id = ?', [request.params.id], (err, row) => {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log('Libro filtrado por id: ', row);
            return response.status(200).json({
                row: row
            });
        }
    });
});
// 3. Buscar libros por género
app.get('/biblioteca/libros/genero/:genero', function (request, response) {
    db.get('SELECT * FROM biblioteca WHERE genero = ?', [request.params.genero], (err, row) => {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log('Libro filtrado por género: ', row);
            return response.status(200).json({
                row: row
            });
        }
    });
});
// 4. Actualizar información de un libro por id
app.put('/biblioteca/libros/:id', function (request, response) {
    let titulo = request.body.titulo;
    let autor = request.body.autor;
    let id = request.params.id;
    let anioPublicacion = request.body.anioPublicacion;
    let genero = request.body.genero;
    let sinopsis = request.body.sinopsis;
    db.run('UPDATE biblioteca SET titulo = ?, autor = ?, anioPublicacion = ?, genero = ?, sinopsis = ? WHERE id = ?', [titulo, autor, anioPublicacion, genero, sinopsis, id]);
    return response.status(200).json({
        Status: "Nuevo libro actualizado.",
        titulo: titulo,
        autor: autor,
        id: id,
        anioPublicacion: anioPublicacion,
        genero: genero,
        sinopsis: sinopsis
    });
});
// 5. Eliminar un libro por id
app.delete('/biblioteca/libros/:id', function (request, response) {
    db.run('DELETE FROM biblioteca WHERE id = ?', [request.params.id], (err) => {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log('Libro eliminado por id.', request.params.id);
            return response.status(200).json({
                Status: 'Eliminado.'
            });
        }
    });
});
app.listen(PORT, () => {
    console.log("Servidor ejecutándose en el puerto: ", PORT);
}).on("error", (error) => {
    throw new Error(error.message);
});
