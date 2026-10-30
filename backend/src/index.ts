import express from 'express';

const app = express();

app.get("/health", (_req, res) => {
    res.send({
        status: 'ok'
    });
})

app.listen(8080, () => {
    console.log('server started');
});