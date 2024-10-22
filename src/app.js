import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: false })); // URL 인코딩, lib 사용 유무
app.use(express.static('public')); // 정적 파일 서빙
initSocket(server); // 소켓 추가

app.get('/', (req, res) => {
    res.send('<h1>Hello World !</h1>');
});

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    try {
        // 파일 읽기
        const assets = await loadGameAssets();
        console.log(assets);
        console.log("success");
    } catch (e) {
        console.log("err");
    }

});

