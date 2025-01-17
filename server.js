const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: "secret-key",
        resave: false,
        saveUninitialized: false,
    })
);

// Armazena os IPs únicos
const activeIPs = new Set();

// Middleware para capturar o IP de cada requisição
app.use((req, res, next) => {
    const clientIP = req.ip || req.socket.remoteAddress;
    activeIPs.add(clientIP); // Adiciona o IP ao conjunto

    // Exibe os IPs únicos no console
    console.clear(); // Limpa o console para exibir a lista atualizada
    console.log('IPs conectados ao servidor:');
    activeIPs.forEach(ip => console.log(ip));
    console.log(`Quantidade de IPs: ${activeIPs.size}`);

    next();
});

// Configuração do banco de dados
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Atualize com sua senha (senha: bestdavidx23)
    database: "user_management",
});

db.connect((err) => {
    if (err) throw err;
    console.log("Conectado ao MySQL!");
});

// Rota para a página inicial
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html')); // Envia o arquivo login.html
});


app.post("/register", async (req, res) => {
    const { nome, senha, skills, admFinanceira, rotAdm1, rotAdm2 } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Verifica quais cursos foram selecionados
    const introducaoInformatica = skills?.includes("introducaoInformatica") ? 1 : 0;
    const windows11 = skills?.includes("windows11") ? 1 : 0;
    const word = skills?.includes("word") ? 1 : 0;
    const excel = skills?.includes("excel") ? 1 : 0;
    const powerpoint = skills?.includes("powerpoint") ? 1 : 0;
    const depPessoal = skills?.includes("depPessoal") ? 1 : 0;
    const escritaFiscal = skills?.includes("escritaFiscal") ? 1 : 0;

    // Verifica os valores de admFinanceira, rotAdm1 e rotAdm2
    const admFinanceiraValue = admFinanceira ? 1 : 0;
    const rotAdm1Value = rotAdm1 ? 1 : 0;
    const rotAdm2Value = rotAdm2 ? 1 : 0;

    // Insere o usuário no banco de dados
    const sql = `
      INSERT INTO users (
        nome, senha, introducaoInformatica, windows11, word, excel, powerpoint, depPessoal, escritaFiscal, admFinanceira, rotAdm1, rotAdm2
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
        sql,
        [
            nome,
            hashedPassword,
            introducaoInformatica,
            windows11,
            word,
            excel,
            powerpoint,
            depPessoal,
            escritaFiscal,
            admFinanceiraValue,
            rotAdm1Value,
            rotAdm2Value,
        ],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Erro ao cadastrar usuário.");
            }

            // Redireciona para register.html com parâmetro de sucesso
            res.redirect("/register.html?success=true");
        }
    );
});


// Rota para login de usuários
app.post("/login", (req, res) => {
    const { nome, senha } = req.body;

    const sql = `SELECT * FROM users WHERE nome = ?`;
    db.query(sql, [nome], async (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.redirect('/login.html?error=Usuário não encontrado!');
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.redirect('/login.html?error=Senha incorreta!');
        }

        // Carrega todas as informações do usuário na sessão
        req.session.user = user;
        res.redirect('/profile?success=Login bem-sucedido!');
    });
});


app.get("/profile", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login.html");
    }

    const {
        nome,
        introducaoInformatica,
        windows11,
        word,
        excel,
        powerpoint,
        depPessoal,
        escritaFiscal,
        admFinanceira,
        rotAdm1,
        rotAdm2
    } = req.session.user;

    const links = [
        '../intro/intro.html',
        './win/win.html',
        './word/word.html',
        './excel/excel.html',
        './powerpoint/powerpoint.html',
        './dep-pessoal/dep-pessoal.html',
        './escrita-fiscal/escrita-fiscal.html',
        './adm-financeira/adm-financeira.html',
        './rot-adm1/rot-adm1.html',
        './rot-adm2/rot-adm2.html'
    ];

    const cursos = [
        { ativo: introducaoInformatica, nome: "Introdução à Informática", link: links[0] },
        { ativo: windows11, nome: "Windows 11", link: links[1] },
        { ativo: word, nome: "Word 2021", link: links[2] },
        { ativo: excel, nome: "Excel 2021", link: links[3] },
        { ativo: powerpoint, nome: "PowerPoint 2021", link: links[4] },
        { ativo: depPessoal, nome: "Assistente Departamento Pessoal", link: links[5] },
        { ativo: escritaFiscal, nome: "Assistente Escrita Fiscal", link: links[6] },
        { ativo: admFinanceira, nome: "Administração Financeira", link: links[7] },
        { ativo: rotAdm1, nome: "Rotina Administrativa 1", link: links[8] },
        { ativo: rotAdm2, nome: "Rotina Administrativa 2", link: links[9] }
    ];

    // Gerar dinamicamente os cards de cursos
    const cursosHTML = cursos
        .filter(curso => curso.ativo)
        .map(curso => `
            <div class="cursoCard">
                <div class="curso">
                    <p class="cursoTitle">${curso.nome}</p>
                    <div class="barraConclusao">
                        <p style="font-weight: 600; color: #fff;">100%</p>
                    </div>
                    <div class="btnAcessarContainer">
                        <button class="btnAcessar" data-link="${curso.link}">
                            <i style="margin-right: 5px;" class="fas fa-chalkboard-teacher"></i>Aulas
                        </button>
                    </div>
                </div>
            </div>
        `)
        .join("");

    // Scripts dinâmicos baseados nos cursos selecionados
    const scriptsHTML = `
        ${introducaoInformatica ? '<script src="/intro/intro.js"></script>' : ''}    
        ${windows11 ? '<script src="/win/win.js"></script>' : ''}
        ${word ? '<script src="/word/word.js"></script>' : ''}
        ${excel ? '<script src="/excel/excel.js"></script>' : ''}
        ${powerpoint ? '<script src="/powerpoint/powerpoint.js"></script>' : ''}
        ${depPessoal ? '<script src="/dep-pessoal/dep-pessoal.js"></script>' : ''}
        ${escritaFiscal ? '<script src="/escrita-fiscal/escrita-fiscal.js"></script>' : ''}
        ${admFinanceira ? '<script src="/adm-financeira/adm-financeira.js"></script>' : ''}
        ${rotAdm1 ? '<script src="/rot-adm1/rot-adm1.js"></script>' : ''}
        ${rotAdm2 ? '<script src="/rot-adm2/rot-adm2.js"></script>' : ''}
        
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                // Lidar com os botões de acessar cursos
                const btns = document.querySelectorAll('.btnAcessar');
                btns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const link = e.target.closest('button').dataset.link;
                        window.location.href = link;
                    });
                });

                // Lidar com o botão "Sair" e encerrar a sessão
                const btnSair = document.querySelector('.btnSairHome');
                if (btnSair) {
                    btnSair.addEventListener('click', () => {
                        // Faz uma requisição GET para o servidor para destruir a sessão
                        fetch('/logout', {
                            method: 'GET',
                        })
                        .then(() => {
                            // Redireciona o usuário para a página de login após a sessão ser encerrada
                            window.location.href = "/login.html";
                        })
                        .catch((error) => {
                            console.error('Erro ao tentar encerrar a sessão:', error);
                        });
                    });
                }

                // Lidar com os links dos botões "Cursos disponíveis" e "Alunos"
                const cursosDisponiveis = document.querySelector('.cursosDisponiveis');
                if (cursosDisponiveis) {
                    cursosDisponiveis.addEventListener('click', () => {
                        window.location.href = '/devs/devs.html';
                    });
                }

                const controleAlunos = document.querySelector('.controle-alunos');
                if (controleAlunos) {
                    controleAlunos.addEventListener('click', () => {
                        window.location.href = '/controle-alunos/controle-alunos.html';
                    });
                }
            });
        </script>


        <script src="./js/home.js"></script>
        <script src="../js/menu-left.js"></script>
        <script src="./js/global.js"></script>
    `;

    res.send(`
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Meus Cursos</title>
            <link rel="shortcut icon" href="./img/onstudy.ico" type="image/x-icon">
            <link rel="stylesheet" href="./css/home.css">
            <link rel="stylesheet" href="./css/responsiveHome.css">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
        </head>
        <body>
            <div class="menuTop">
                <div class="logo">
                    <img class="gorro" src="./img/gorro.png" alt="Logo" width="20px">
                    <img src="./img/logo.png" alt="Logo" width="40px">
                </div>
                <div class="menuTopRight">
                    <a href="">Plano de carreira</a>
                    <a href="">Categorias</a>
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="menuTopInput">
                    <i class="fas fa-search"></i>
                    <input id="menuTopInput" type="text" placeholder="Pesquise seu curso">
                </div>
                <div class="menuTopLeft">
                    <p class="nameUser">Aluno: ${nome}</p>
                    <div class="menuTopLeftBtn">
                        <button class="btnSairHome">Sair  <i class="fas fa-sign-out-alt"></i></button>
                    </div>
                </div>
            </div>

            <div class="menu-top-mobile">
                <div class="user-img">
                    <!--<img src="../img/user.jpg" alt="" width="100%">-->
                    <img src="https://cdn-icons-png.flaticon.com/512/1361/1361728.png" alt="" width="80%" style="opacity: 0.8;">
                    <p class="saudacao-mobile">Bem-vindo(a)<p class="">, ${nome}</p></p>
                </div>
                <p class="pacote">Pacote: Informática personalizado</p>
                <hr>
            </div>


            <div class="container">
                <div class="menuLeft">
                    <div class="icon">
                        <p class="menu-icon"><i class="fas fa-home"></i>Inicio</p>
                    </div>
                    <div style="border-left: 3px solid #fff;" class="icon">
                        <p class="meusCursos menu-icon"><i class="fas fa-display"></i>Meus cursos</p>
                    </div>
                    <div class="icon">
                        <p class="menu-icon"><i class="fas fa-book-open"></i>Apostilas</p>
                    </div>
                    <div class="icon">
                        <p class="menu-icon"><i class="fas fa-award"></i>Certificados</p>
                    </div>
                    <div class="icon">
                        <p class="menu-icon"><i class="fas fa-user"></i>Meus dados</p>
                    </div>
                    <div class="icon">
                        <p class="menu-icon"><i class="fas fa-bullseye"></i>Plano de carreira</p>
                    </div>
                    <div class="icon">
                        <p class="menu-icon"><i class="fas fa-heart"></i>Favoritos</p>
                    </div>
                    <div class="icon devsBtn">
                        <p class="menu-icon"><i class="fas fa-code"></i>Para devs</p>
                    </div>
                    <div class="dev-opts" id="dev-opts">
                        <a class="cursosDisponiveis">Cursos disponíveis</a>
                        <a class="controle-alunos">Gerir alunos</a>
                        <a href="/register.html" class="gerir-contas">Gerir contas</a>
                    </div>
                </div>

                <div class="menuRight">
                    <div class="menuRightTitle">
                        <a href="home.html">Meus cursos</a>
                    </div>
                    ${cursosHTML || "<p>Nenhum curso selecionado.</p>"}
                </div>
            </div>

            <div class="menu-bottom">
                <div class="pesquisa-mobile btn-bottom">
                    <i class="fas fa-search search-icon"></i>
                    <p>Pesquisa</p>
                </div>
                <div class="plano-carreira-mobile btn-bottom">
                    <i class="fas fa-bullseye"></i>
                    <p>Plano de <br> carreira</p>
                </div>
                <div class="meus-cursos-mobile btn-bottom">
                    <i class="fas fa-play"></i>
                    <p>Meus cursos</p>
                </div>
                <div class="favoritos-mobile btn-bottom">
                    <i class="fas fa-heart"></i>
                    <p>Favoritos</p>
                </div>
                <div class="conta-mobile btn-bottom">
                    <i class="fas fa-user-circle profile-icon"></i>
                    <p>Conta</p>
                </div>
            </div>

            <div class="modal-overlay" id="modal">
                <div class="modal">
                    <img src="./img/feliznatal.png" alt="Feliz Natal e Ano Novo">
                    <p>A <strong>OnStudy</strong> deseja a você e a sua família um Feliz Natal e um próspero Ano Novo!</p>
                    <button id="closeModal">Fechar</button>
                </div>
            </div>

            ${scriptsHTML}
        </body>
        </html>
    `);
});


app.get("/logout", (req, res) => {
    // Destruir a sessão do usuário
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Erro ao encerrar a sessão.");
        }
        // Redireciona para a página de login após destruir a sessão
        res.redirect("/login.html");
    });
});


// Rota para listar todos os usuários
app.get("/users", (req, res) => {
    const sql = "SELECT id, nome FROM users";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Rota para excluir um usuário
app.delete("/users/:id", (req, res) => {
    const userId = req.params.id;
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [userId], (err) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

app.put("/users/:id", async (req, res) => {
    const { nome, senha } = req.body;
    console.log("Dados recebidos no servidor:", { nome, senha }); // Verificar o corpo da requisição

    if (!nome || !senha) {
        return res.status(400).json({ error: "Nome e senha são obrigatórios." });
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const sql = "UPDATE users SET nome = ?, senha = ? WHERE id = ?";
        db.query(sql, [nome, hashedPassword, req.params.id], (err) => {
            if (err) {
                console.error("Erro ao atualizar usuário:", err);
                return res.status(500).json({ error: "Erro interno no servidor." });
            }
            res.sendStatus(200); // Sucesso
        });
    } catch (error) {
        console.error("Erro ao processar a senha:", error);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
});

// Inicia o servidor
app.listen(3000, '0.0.0.0', () => {
    console.log("Servidor rodando na porta 3000");
});