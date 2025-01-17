// Rota para a página inicial
app.get("/", (req, res) => {
    res.send("<h1>Bem-vindo ao OnStudy</h1><p>Clique abaixo para fazer o login:</p><a href='/login.html'>Fazer Login</a>");
});

// Rota para cadastro de usuários
app.post("/register", async (req, res) => {
    const { nome, senha, skills } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Verifica quais cursos foram selecionados
    const introducaoInformatica = skills?.includes("introducaoInformatica") ? 1 : 0;
    const windows11 = skills?.includes("windows11") ? 1 : 0;
    const word = skills?.includes("word") ? 1 : 0;
    const excel = skills?.includes("excel") ? 1 : 0;
    const powerpoint = skills?.includes("powerpoint") ? 1 : 0;
    const depPessoal = skills?.includes("depPessoal") ? 1 : 0;
    const escritaFiscal = skills?.includes("escritaFiscal") ? 1 : 0;

    // Insere o usuário no banco de dados
    const sql = `
      INSERT INTO users (
        nome, senha, introducaoInformatica, windows11, word, excel, powerpoint, depPessoal, escritaFiscal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
        sql,
        [nome, hashedPassword, introducaoInformatica, windows11, word, excel, powerpoint, depPessoal, escritaFiscal],
        (err) => {
            if (err) throw err;
            res.send("<h1>Usuário cadastrado com sucesso!</h1><a href='/login.html'>Fazer Login</a>");
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
            return res.send("<h1>Usuário não encontrado!</h1>");
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.send("<h1>Senha incorreta!</h1>");
        }

        // Carrega todas as informações do usuário na sessão
        req.session.user = user;
        res.redirect("/profile");
    });
});

// Rota para exibir o perfil do usuário
app.get("/profile", (req, res) => {
    if (!req.session.user) return res.redirect("/login.html");

    const user = req.session.user;
    const cursos = [];

    // Verifica os cursos selecionados para o usuário
    if (user.introducaoInformatica) cursos.push("Introdução à Informática");
    if (user.windows11) cursos.push("Windows 11");
    if (user.word) cursos.push("Word");
    if (user.excel) cursos.push("Excel");
    if (user.powerpoint) cursos.push("PowerPoint");
    if (user.depPessoal) cursos.push("Departamento Pessoal");
    if (user.escritaFiscal) cursos.push("Escrita Fiscal");

    // Gera o HTML dinamicamente para os cursos selecionados
    const cursosHTML = cursos.map(curso => `<h1>${curso}</h1>`).join("");

    res.send(`
      <h1>Bem-vindo, ${user.nome}!</h1>
      ${cursosHTML || "<p>Nenhum curso selecionado.</p>"}
      <a href="/login.html">Sair</a>
    `);
});

// Inicia o servidor
app.listen(3000, '0.0.0.0', () => {
    console.log("Servidor rodando na porta 3000");
});


