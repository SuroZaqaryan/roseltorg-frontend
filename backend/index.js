const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

const app = express();
const PORT = 8080;

// Создаём папку для хранения загруженных файлов
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

// Конфигурация multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        // Сохраняем оригинальное имя файла
        const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, originalname);
    }
});
const upload = multer({ storage });

app.use(cors());
app.use('/uploads', express.static(UPLOAD_DIR)); // раздача файлов

// Middleware для правильной обработки JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Обработка загрузки файла
app.post('/api/conversation', upload.single('file'), (req, res) => {
    const file = req.file;
    let files = [];

    const message = req.body.message;

    if (message === 'Как внести изменения в ТЗ?') {
        return res.json({
            content: `Вы можете загрузить уже готовое ТЗ или просто описать изменения в чате. Я обновлю документ и уточню только то, что нужно.\nПример:\n«Хочу поменять количество стульев в предыдущем ТЗ — теперь 40, доставка туда же, срок — 10 дней»`,
            role: 'assistant',
            files
        });
    }

    if (message === 'Как создать новое ТЗ?') {
        return res.json({
            content: `Напишите в чате, что вам нужно, в свободной форме. Я сам определю важные детали — количество, адрес, сроки — и превращу это в готовое техническое задание.\nПример:\n«Хочу закупить 10 ноутбуков, доставка — Казань, Пушкина 21, срок — 5 дней»`,
            role: 'assistant',
            files
        });
    }

    if (message === 'Что ты умеешь делать?') {
        return res.json({
            content: `Я умею быстро составлять или обновлять технические задания (ТЗ) прямо в чате 🚀
             Просто опишите, что вы хотите — например, «хочу купить стулья» или «надо обновить старое ТЗ».
              Я всё структурирую и оформлю 😊`,
            role: 'assistant',
            files
        });
    }

  if (file) {
    const decodedName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const fileUrl = `http://localhost:${PORT}/uploads/${encodeURIComponent(decodedName)}`;

    files.push({
        name: decodedName,
        type: file.mimetype,
        url: fileUrl
    });
}


    res.json({
        content: 'Файл получен и загружен (если был передан).',
        role: 'assistant',
        files
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
