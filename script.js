document.addEventListener('DOMContentLoaded', () => {
    const conteudoPost = document.querySelector('.conteudoPost');
    const enviarPost = document.querySelector('.enviarPost');
    const feed = document.getElementById('feed');

    // Carregar os posts salvos no localStorage ao carregar a página
    carregarPosts();

    // Exibir a área de digitação ao clicar no botão de postar
    document.querySelector('.postar').addEventListener('click', () => {
        document.querySelector('.digitarPost').style.display = 'flex';
    });

    // Atualizar o botão de enviar conforme o conteúdo do textarea
    conteudoPost.addEventListener('input', () => {
        let conteudoPostValue = conteudoPost.value.trim();
        enviarPost.innerHTML = conteudoPostValue === '' ? 'X' : '=';
    });

    // Evento de envio de post
    enviarPost.addEventListener('click', () => {
        let conteudoPostValue = conteudoPost.value.trim();

        if (conteudoPostValue !== '') {
            // Criar novo post
            let novoPost = criarPost(conteudoPostValue);

            // Adicionar novo post ao feed
            feed.appendChild(novoPost);

            // Salvar post no localStorage
            salvarPostLocalStorage(conteudoPostValue);

            // Limpar textarea e ocultar div de digitação
            conteudoPost.value = '';
            document.querySelector('.digitarPost').style.display = 'none';
            enviarPost.innerHTML = 'X';
        } else {
            // Ocultar div de digitação se o conteúdo estiver vazio
            document.querySelector('.digitarPost').style.display = 'none';
        }
    });

    // Função para criar um novo post no DOM
    function criarPost(conteudo) {
        let novoPost = document.createElement('div');
        novoPost.classList.add('postagemValue');

        // Elemento para o texto do post
        let textPostValue = document.createElement('div');
        textPostValue.classList.add('textPostValue');

        let h2 = document.createElement('h2');
        h2.textContent = conteudo;
        textPostValue.appendChild(h2);

        // Adicionar texto do post ao novo post
        novoPost.appendChild(textPostValue);

        // Elemento para a aba de comentários
        let abaComentarios = document.createElement('div');
        abaComentarios.classList.add('abaComentarios');

        // Elemento para a área de criar comentário
        let comentarioAside = document.createElement('div');
        comentarioAside.classList.add('comentarioAside');

        let textareaComentario = document.createElement('textarea');
        textareaComentario.classList.add('criaComentario');
        textareaComentario.setAttribute('placeholder', 'Digite seu comentário...');

        let btnEnviarComentario = document.createElement('button');
        btnEnviarComentario.classList.add('enviarComentario');
        btnEnviarComentario.textContent = '!';

        comentarioAside.appendChild(textareaComentario);
        comentarioAside.appendChild(btnEnviarComentario);

        // Evento para adicionar comentário
        btnEnviarComentario.addEventListener('click', () => {
            let comentarioTexto = textareaComentario.value.trim();
            if (comentarioTexto !== '') {
                let comentarioValue = document.createElement('p');
                comentarioValue.classList.add('comentarioValue');
                comentarioValue.textContent = comentarioTexto;
                abaComentarios.appendChild(comentarioValue);
                textareaComentario.value = ''; // Limpar textarea

                // Salvar comentário no localStorage
                salvarComentarioLocalStorage(conteudo, comentarioTexto);
            }
        });

        // Carregar comentários salvos do localStorage
        carregarComentarios(conteudo, abaComentarios);

        abaComentarios.appendChild(comentarioAside);

        // Botão para excluir o post
        let btnExcluirPost = document.createElement('button');
        btnExcluirPost.textContent = 'Excluir';
        btnExcluirPost.classList.add('excluir'); // Adicionando a classe .excluir
        btnExcluirPost.addEventListener('click', () => {
            feed.removeChild(novoPost); // Remover o elemento do DOM
            removerPostLocalStorage(conteudo); // Remover o post do localStorage
        });
        novoPost.appendChild(btnExcluirPost);

        // Adicionar aba de comentários ao novo post
        novoPost.appendChild(abaComentarios);

        return novoPost;
    }

    // Função para salvar o post no localStorage
    function salvarPostLocalStorage(post) {
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.push({ conteudo: post, comentarios: [] });
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    // Função para carregar os posts do localStorage
    function carregarPosts() {
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.forEach(post => {
            let novoPost = criarPost(post.conteudo);
            feed.appendChild(novoPost);
        });
    }

    // Função para remover um post do localStorage
    function removerPostLocalStorage(post) {
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts = posts.filter(p => p.conteudo !== post);
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    // Função para salvar o comentário no localStorage
    function salvarComentarioLocalStorage(post, comentario) {
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        let index = posts.findIndex(p => p.conteudo === post);
        if (index !== -1) {
            posts[index].comentarios.push(comentario);
            localStorage.setItem('posts', JSON.stringify(posts));
        }
    }

    // Função para carregar os comentários do localStorage
    function carregarComentarios(post, abaComentarios) {
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        let index = posts.findIndex(p => p.conteudo === post);
        if (index !== -1) {
            posts[index].comentarios.forEach(comentario => {
                let comentarioValue = document.createElement('p');
                comentarioValue.classList.add('comentarioValue');
                comentarioValue.textContent = comentario;
                abaComentarios.appendChild(comentarioValue);
            });
        }
    }
});
