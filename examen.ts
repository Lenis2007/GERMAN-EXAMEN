import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { Database } from 'sqlite3';
const db = new Database('BD - EXAMEN.db');

dotenv.config();

const app = express()
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// 1. Registrar un nuevo libro
// POST: Envía datos.
// RUN: Inserta varios datos.
app.post('/biblioteca/libros', function (request: Request, response: Response) {
    let titulo = request.body.titulo;
    let autor = request.body.autor;
    let id = request.body.id;
    let anioPublicacion = request.body.anioPublicacion;
    let genero = request.body.genero;
    let sinopsis = request.body.sinopsis
    db.run('INSERT INTO biblioteca (titulo, autor, id, anioPublicacion, genero, sinopsis) VALUES (?, ?, ?, ?, ?, ?)', [titulo, autor, id, anioPublicacion, genero, sinopsis], (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Nuevo libro agregado en biblioteca digital.')
        }
    })
    return response.status(200).json({
        Status: "Nuevo libro agregado en biblioteca digital.",
        titulo: titulo,
        autor: autor,
        id: id,
        anioPublicacion: anioPublicacion,
        genero: genero,
        sinopsis: sinopsis
    })
})

// 2. Consultar un libro por id
// GET: Solicita datos o un dato.
// GET: Devuelve un dato.
app.get('/biblioteca/libros/:id', function (request: Request, response: Response) {
    db.get('SELECT * FROM biblioteca WHERE id = ?', [request.params.id], (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Libro filtrado por id: ', row);
            return response.status(200).json({
                row: row
            })
        }
    })
})

// 3. Buscar libros por género
// GET: Solicita datos o un dato.
// GET: Devuelve un dato.
app.get('/biblioteca/libros/genero/:genero', function (request: Request, response: Response) {
    db.get('SELECT * FROM biblioteca WHERE genero = ?', [request.params.genero], (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Libro filtrado por género: ', row);
            return response.status(200).json({
                row: row
            })
        }
    })
})

// 4. Actualizar información de un libro por id
// Put: Actualiza un dato con una ubicación específica.
// RUN: Inserta datos
app.put('/biblioteca/libros/:id', function (request: Request, response: Response) {
    let titulo = request.body.titulo;
    let autor = request.body.autor;
    let id = request.params.id;
    let anioPublicacion = request.body.anioPublicacion;
    let genero = request.body.genero;
    let sinopsis = request.body.sinopsis
    db.run('UPDATE biblioteca SET titulo = ?, autor = ?, anioPublicacion = ?, genero = ?, sinopsis = ? WHERE id = ?', [titulo, autor, anioPublicacion, genero, sinopsis, id]);
    return response.status(200).json({
        Status: "Nuevo libro actualizado.",
        titulo: titulo,
        autor: autor,
        id: id,
        anioPublicacion: anioPublicacion,
        genero: genero,
        sinopsis: sinopsis
    })
})

// 5. Eliminar un libro por id
// DELETE: Eliminar algo en especifico.
// RUN: Inserta datos.
app.delete('/biblioteca/libros/:id', function (request: Request, response: Response) {
    db.run('DELETE FROM biblioteca WHERE id = ?', [request.params.id], (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Libro eliminado por id.', request.params.id);
            return response.status(200).json({
                Status: 'Eliminado.'
            })
        }
    })
})

app.listen(PORT, () => {
    console.log("Servidor ejecutándose en el puerto: ", PORT);
}).on("error", (error: any) => {
    throw new Error(error.message);
});